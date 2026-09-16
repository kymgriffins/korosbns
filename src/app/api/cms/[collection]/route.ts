import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import fs from "node:fs/promises";
import path from "node:path";
import {
  headlessCmsApi,
  CMS_COLLECTIONS_CATALOG,
  MASTER_CMS_EMAIL,
  type CmsCollectionSlug,
} from "@/lib/headless-cms";
import {
  saveJsonToR2,
  getJsonFromR2,
  purgeCloudflareEdgeCache,
} from "@/lib/r2-storage";
import { validateCollection, checkLockedFields } from "@/lib/cms-validators";

async function findValidDiskPath(slug: CmsCollectionSlug): Promise<string | null> {
  const meta = CMS_COLLECTIONS_CATALOG[slug];
  if (!meta?.filePath) return null;

  const cwd = process.cwd();
  const candidates = [
    path.resolve(cwd, meta.filePath),
    path.resolve(cwd, "korosbns", meta.filePath),
    path.resolve(cwd, "..", "korosbns", meta.filePath),
    path.resolve(cwd, "..", meta.filePath),
  ];

  for (const p of candidates) {
    try {
      await fs.access(p);
      return p;
    } catch {
      // continue checking
    }
  }

  // Default to candidate 1 if not yet created or direct path
  return path.resolve(cwd, meta.filePath);
}

function normalizeEmDashes(obj: unknown): unknown {
  if (typeof obj === "string") {
    return obj.replace(/\u2014/g, " -- ");
  }
  if (Array.isArray(obj)) {
    return obj.map(normalizeEmDashes);
  }
  if (obj && typeof obj === "object") {
    const res: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(obj)) {
      res[k] = normalizeEmDashes(v);
    }
    return res;
  }
  return obj;
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ collection: string }> },
) {
  const { collection } = await params;

  // Support catalog discovery endpoint
  if (collection === "catalog" || collection === "list") {
    return NextResponse.json({
      collections: headlessCmsApi.getAllCollections(),
      coreSlugs: headlessCmsApi.getCollections().map((c) => c.slug),
      masterEditor: MASTER_CMS_EMAIL,
      timestamp: new Date().toISOString(),
    });
  }

  const slug = collection as CmsCollectionSlug;
  const meta = CMS_COLLECTIONS_CATALOG[slug];

  if (!meta) {
    return NextResponse.json(
      { error: `Collection '${collection}' is not registered in CMS catalog.` },
      { status: 404 },
    );
  }

  try {
    let data = headlessCmsApi.getCollectionData(slug);
    let source: "r2_cloudflare" | "disk" | "memory_fallback" = "memory_fallback";
    const isDev = process.env.NODE_ENV === "development";
    const diskPath = await findValidDiskPath(slug);

    // 1. Attempt to read live version from Cloudflare R2 bucket first (authoritative live CMS database)
    const forceDisk = process.env.CMS_FORCE_DISK === "1";
    if (!forceDisk) {
      try {
        const r2Data = await getJsonFromR2<Record<string, unknown>>(`cms/${slug}.json`);
        if (r2Data && typeof r2Data === "object" && Object.keys(r2Data).length > 0) {
          data = r2Data;
          source = "r2_cloudflare";
        }
      } catch (r2Err) {
        console.warn(`[CMS R2 Read Warning] Failed to read ${slug} from R2:`, r2Err);
      }
    }

    // 2. Fall back to local repository disk if R2 was unavailable, empty, or forceDisk is set
    if (source === "memory_fallback" && diskPath) {
      try {
        const raw = await fs.readFile(diskPath, "utf-8");
        data = JSON.parse(raw);
        source = "disk";
      } catch {
        // Fall back to memory cache
      }
    }

    return NextResponse.json({
      collection: slug,
      meta,
      masterEditor: MASTER_CMS_EMAIL,
      timestamp: new Date().toISOString(),
      source,
      filePath: meta.filePath,
      data,
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Collection not found" },
      { status: 404 },
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ collection: string }> },
) {
  const { collection } = await params;
  const slug = collection as CmsCollectionSlug;
  const meta = CMS_COLLECTIONS_CATALOG[slug];

  if (!meta) {
    return NextResponse.json(
      { error: `Collection '${collection}' is not registered in CMS catalog.` },
      { status: 404 },
    );
  }

  try {
    const body = (await request.json()) as {
      data?: Record<string, unknown>;
      editorEmail?: string;
    };
    const editorEmail = body.editorEmail || MASTER_CMS_EMAIL;

    if (!body.data) {
      return NextResponse.json(
        { error: "Missing JSON data body payload" },
        { status: 400 },
      );
    }

    // Auto-normalize any raw em-dashes (\u2014) to standard markdown dashes ( -- )
    body.data = normalizeEmDashes(body.data) as Record<string, unknown>;

    // 0. Run Section 11 validators — reject publish on fail
    const validation = validateCollection(slug, body.data);
    if (!validation.passed) {
      const failures = validation.results.filter((r) => !r.pass);
      const failureList = failures.map((f) => `${f.rule}: ${f.message}`).join("; ");
      return NextResponse.json(
        {
          error: `Validation failed on '${slug}': ${failureList}`,
          message: `Validation failed on ${failures.length} rule(s) for collection '${slug}'.`,
          validationFailures: failures.map((f) => ({
            rule: f.rule,
            message: f.message,
            count: f.count,
            limit: f.limit,
          })),
        },
        { status: 422 },
      );
    }

    // 0b. Enforce locked fields — reject edits to locked content
    let existingData = headlessCmsApi.getCollectionData(slug);
    const diskPathForExisting = await findValidDiskPath(slug);
    if (diskPathForExisting) {
      try {
        const raw = await fs.readFile(diskPathForExisting, "utf-8");
        existingData = JSON.parse(raw);
      } catch {
        // fallback to in-memory
      }
    }

    if (existingData) {
      const lockedPaths = checkLockedFields(
        existingData as Record<string, unknown>,
        body.data,
      );
      if (lockedPaths.length > 0) {
        return NextResponse.json(
          {
            error: `Locked fields in '${slug}' cannot be edited: ${lockedPaths.join(", ")}`,
            message: `Edits rejected because the following fields are locked: ${lockedPaths.join(", ")}`,
            lockedPaths,
          },
          { status: 422 },
        );
      }

      // Restore locked markers on the payload so saved file stays locked
      function restoreLockedMarkers(orig: unknown, incoming: unknown) {
        if (!orig || !incoming || typeof orig !== "object" || typeof incoming !== "object") return;
        if (Array.isArray(orig) && Array.isArray(incoming)) {
          for (let i = 0; i < Math.min(orig.length, incoming.length); i++) {
            restoreLockedMarkers(orig[i], incoming[i]);
          }
          return;
        }
        const o = orig as Record<string, unknown>;
        const inc = incoming as Record<string, unknown>;
        for (const [k, v] of Object.entries(o)) {
          if (v && typeof v === "object" && !Array.isArray(v) && (v as Record<string, unknown>).locked === true) {
            if (inc[k] && typeof inc[k] === "object" && !Array.isArray(inc[k])) {
              (inc[k] as Record<string, unknown>).locked = true;
            }
          } else if (inc[k] && typeof inc[k] === "object") {
            restoreLockedMarkers(v, inc[k]);
          }
        }
      }
      restoreLockedMarkers(existingData, body.data);
    }

    // Auto-stamp current save timestamps onto data and provenance
    const nowIso = new Date().toISOString();
    if (!body.data.provenance || typeof body.data.provenance !== "object") {
      body.data.provenance = {};
    }
    const prov = body.data.provenance as Record<string, unknown>;
    prov.lastUpdated = nowIso;
    prov.lastSaved = nowIso;
    prov.lastSync = nowIso;
    body.data._savedAt = nowIso;
    body.data.lastSaved = nowIso;

    // 1. Update in-memory data cache and permissions
    const res = headlessCmsApi.updateCollectionData(slug, body.data, editorEmail);

    // 2. Persist directly to physical JSON file on disk (for local repository & git)
    let diskPersisted = false;
    let targetPath = meta.filePath;
    try {
      const diskPath = await findValidDiskPath(slug);
      if (diskPath) {
        const formattedJson = JSON.stringify(body.data, null, 2) + "\n";
        await fs.writeFile(diskPath, formattedJson, "utf-8");
        diskPersisted = true;
        targetPath = diskPath;
      }
    } catch (writeErr) {
      console.warn(`[CMS Disk Write Warning] Failed to write to disk:`, writeErr);
    }

    // 3. Persist directly to Cloudflare R2 Storage (for Edge, Serverless & Permanent Backup)
    let r2Persisted = false;
    let r2Url = "";
    let r2Error: string | null = null;
    try {
      const r2Res = await saveJsonToR2(`cms/${slug}.json`, body.data);
      r2Persisted = true;
      r2Url = r2Res.url;
    } catch (r2Err) {
      r2Error = r2Err instanceof Error ? r2Err.message : String(r2Err);
      console.warn(`[CMS R2 Write Warning] Failed to persist to Cloudflare R2:`, r2Err);
    }

    // 4. Purge Cloudflare Edge CDN cache so live visitors get instant update
    let edgePurged = false;
    try {
      const purgeRes = await purgeCloudflareEdgeCache();
      edgePurged = purgeRes.success;
    } catch (purgeErr) {
      console.warn(`[Cloudflare Purge Warning]`, purgeErr);
    }

    // 5. Invalidate Next.js internal server cache on-demand
    let nextRevalidated = false;
    try {
      revalidatePath("/", "layout");
      revalidatePath("/programmes", "layout");
      revalidatePath("/bns-studio", "layout");
      revalidatePath("/about", "layout");
      revalidatePath("/contact", "layout");
      revalidatePath("/stories", "layout");
      revalidatePath("/work", "layout");
      if (slug === "custom-pages") revalidatePath("/pages", "layout");
      nextRevalidated = true;
    } catch (revalErr) {
      console.warn(`[CMS Next Cache Revalidate Warning]`, revalErr);
    }

    return NextResponse.json({
      ...res,
      masterEditor: MASTER_CMS_EMAIL,
      diskPersisted,
      r2Persisted,
      r2Url,
      r2Error,
      edgePurged,
      nextRevalidated,
      filePath: targetPath,
      message: r2Persisted
        ? `Successfully updated and persisted ${slug}.json to Disk and Cloudflare R2.`
        : `Successfully updated ${slug}.json to local repository disk.${r2Error ? ` (Note: Cloudflare R2 backup skipped: ${r2Error})` : ""}`,
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to update collection" },
      { status: 403 },
    );
  }
}
