import { NextResponse } from "next/server";
import fs from "node:fs/promises";
import path from "node:path";
import {
  headlessCmsApi,
  CMS_COLLECTIONS_CATALOG,
  MASTER_CMS_EMAIL,
  type CmsCollectionSlug,
} from "@/lib/headless-cms";

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
    let source: "disk" | "memory_fallback" = "memory_fallback";

    // Attempt to read latest persistent copy from disk
    const diskPath = await findValidDiskPath(slug);
    if (diskPath) {
      try {
        const raw = await fs.readFile(diskPath, "utf-8");
        const parsed = JSON.parse(raw);
        data = parsed;
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

    // 1. Update in-memory data cache and permissions
    const res = headlessCmsApi.updateCollectionData(slug, body.data, editorEmail);

    // 2. Persist directly to physical JSON file on disk
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

    return NextResponse.json({
      ...res,
      masterEditor: MASTER_CMS_EMAIL,
      diskPersisted,
      filePath: targetPath,
      message: `Successfully updated and persisted ${slug}.json in Headless CMS.`,
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to update collection" },
      { status: 403 },
    );
  }
}
