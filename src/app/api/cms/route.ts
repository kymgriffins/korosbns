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
      // continue
    }
  }
  return path.resolve(cwd, meta.filePath);
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const isExportAll = searchParams.get("export") === "all" || searchParams.get("bundle") === "true";

  if (isExportAll) {
    return NextResponse.json({
      bundle: headlessCmsApi.exportAllCollectionsJson(),
      totalCollections: Object.keys(CMS_COLLECTIONS_CATALOG).length,
      masterEditor: MASTER_CMS_EMAIL,
      timestamp: new Date().toISOString(),
    });
  }

  return NextResponse.json({
    collections: headlessCmsApi.getAllCollections(),
    totalDatasets: Object.keys(CMS_COLLECTIONS_CATALOG).length,
    coreSlugs: headlessCmsApi.getCollections().map((c) => c.slug),
    masterEditor: MASTER_CMS_EMAIL,
    timestamp: new Date().toISOString(),
  });
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      action?: "push-all" | "sync-all";
      editorEmail?: string;
      datasets?: Record<string, unknown>;
    };

    const editorEmail = body.editorEmail || MASTER_CMS_EMAIL;
    const isMaster = editorEmail.toLowerCase() === MASTER_CMS_EMAIL.toLowerCase();
    const isAdminDomain = editorEmail.toLowerCase().endsWith("@budgetndiostory.org");

    if (!isMaster && !isAdminDomain) {
      return NextResponse.json(
        { error: "Permission Denied: Only Master CMS Editor or admin accounts can push all datasets." },
        { status: 403 },
      );
    }

    const allMeta = headlessCmsApi.getAllCollections();
    const syncResults: { slug: string; filePath: string; success: boolean; error?: string }[] = [];

    for (const item of allMeta) {
      const slug = item.slug;
      try {
        const dataToSave = (body.datasets && body.datasets[slug])
          ? (body.datasets[slug] as Record<string, unknown>)
          : headlessCmsApi.getCollectionData(slug);

        // Update in-memory
        headlessCmsApi.updateCollectionData(slug, dataToSave, editorEmail);

        // Persist to disk
        const diskPath = await findValidDiskPath(slug);
        if (diskPath) {
          const parentDir = path.dirname(diskPath);
          await fs.mkdir(parentDir, { recursive: true });
          const formattedJson = JSON.stringify(dataToSave, null, 2) + "\n";
          await fs.writeFile(diskPath, formattedJson, "utf-8");
          syncResults.push({ slug, filePath: diskPath, success: true });
        } else {
          syncResults.push({ slug, filePath: item.filePath, success: false, error: "Disk path could not be resolved" });
        }
      } catch (err) {
        syncResults.push({
          slug,
          filePath: item.filePath,
          success: false,
          error: err instanceof Error ? err.message : "Disk write failed",
        });
      }
    }

    const successCount = syncResults.filter((r) => r.success).length;

    return NextResponse.json({
      success: true,
      message: `Successfully pushed and synced ${successCount}/${allMeta.length} datasets to disk.`,
      totalSynced: successCount,
      totalDatasets: allMeta.length,
      timestamp: new Date().toISOString(),
      results: syncResults,
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to execute push all" },
      { status: 500 },
    );
  }
}
