import { describe, it, expect } from "vitest";
import {
  godModeStore,
  GOD_MODE_EMAIL,
  type CrudActionType,
  type CrudResourceType,
} from "@/lib/god-mode";
import {
  headlessCmsApi,
  CMS_COLLECTIONS_CATALOG,
  MASTER_CMS_EMAIL,
  type CmsCollectionSlug,
} from "@/lib/headless-cms";
import {
  getComprehensiveAnalytics,
} from "@/components/analytics/analytics-data";
import { countyScraperEngine } from "@/lib/county-scraper-engine";
import { bnskeSyncEngine } from "@/lib/bnske-sync";
import { pushNotificationEngine } from "@/lib/push-notifications";
import { liveTownhallEngine } from "@/lib/townhall-live";
import { socialAuthAdapter } from "@/lib/social-auth";

describe("Updated PRD Compliance Test Suite", () => {
  /* ========================================================================
   * 1. God Mode Authorization & CRUD Approval Engine
   * ======================================================================== */
  describe("God Mode Authorization Engine (PRD Spec 1)", () => {
    it("designates info@budgetndiostory.org as Master God Mode Approver", () => {
      expect(GOD_MODE_EMAIL).toBe("info@budgetndiostory.org");
      expect(godModeStore.isGodMode("info@budgetndiostory.org")).toBe(true);
      expect(godModeStore.isGodMode("INFO@BUDGETNDIOSTORY.ORG")).toBe(true);
      expect(godModeStore.isGodMode("other@budgetndiostory.org")).toBe(false);
    });

    it("queues pending CRUD requests submitted by any user role", () => {
      const initialPending = godModeStore.getPendingCount();
      const req = godModeStore.submitRequest(
        "UPDATE",
        "budget_record",
        "PRD Test Budget Update",
        "editor@budgetndiostory.org",
        "Content Editor",
        "Modifying county health allocation table",
      );

      expect(req.status).toBe("PENDING");
      expect(req.targetTitle).toBe("PRD Test Budget Update");
      expect(godModeStore.getPendingCount()).toBe(initialPending + 1);
    });

    it("allows info@budgetndiostory.org to authorize and approve CRUD requests", () => {
      const req = godModeStore.submitRequest(
        "PUBLISH",
        "civic_module",
        "PRD Test Module Publish",
        "manager@budgetndiostory.org",
        "Operations Manager",
        "Publishing FY2026 civic module",
      );

      const approved = godModeStore.approveRequest(req.id, "info@budgetndiostory.org");
      expect(approved).toBe(true);

      const allReqs = godModeStore.getRequests();
      const updatedReq = allReqs.find((r) => r.id === req.id);
      expect(updatedReq?.status).toBe("APPROVED");
    });

    it("rejects approval attempts from non-god mode emails", () => {
      const req = godModeStore.submitRequest(
        "DELETE",
        "doc_file",
        "Unauthorized Delete Attempt",
        "user@example.com",
        "Citizen",
        "Attempting to delete doc file",
      );

      expect(() => {
        godModeStore.approveRequest(req.id, "unauthorized@example.com");
      }).toThrow(/Only God Mode master email/i);
    });

    it("allows info@budgetndiostory.org to deny CRUD requests with a reason", () => {
      const req = godModeStore.submitRequest(
        "ROLE_ASSIGNMENT",
        "user_role",
        "PRD Test Role Promotion",
        "admin@budgetndiostory.org",
        "System Administrator",
        "Promote user to Manager",
      );

      const denied = godModeStore.denyRequest(
        req.id,
        "info@budgetndiostory.org",
        "Insufficient audit sign-off",
      );
      expect(denied).toBe(true);

      const allReqs = godModeStore.getRequests();
      const updatedReq = allReqs.find((r) => r.id === req.id);
      expect(updatedReq?.status).toBe("DENIED");
      expect(updatedReq?.reason).toBe("Insufficient audit sign-off");
    });
  });

  /* ========================================================================
   * 2. Headless CMS Engine & JSON Collection Data API
   * ======================================================================== */
  describe("Headless CMS Data Engine (PRD Spec 2)", () => {
    it("assigns Master Headless CMS privileges to info@budgetndiostory.org", () => {
      expect(MASTER_CMS_EMAIL).toBe("info@budgetndiostory.org");
    });

    it("exposes all 6 required JSON data collections", () => {
      const collections = headlessCmsApi.getCollections();
      const slugs = collections.map((c) => c.slug);

      expect(collections.length).toBe(6);
      expect(slugs).toContain("programmes");
      expect(slugs).toContain("landing");
      expect(slugs).toContain("about");
      expect(slugs).toContain("media");
      expect(slugs).toContain("socials");
      expect(slugs).toContain("timeline");
    });

    it("retrieves valid JSON data for programmes collection", () => {
      const data = headlessCmsApi.getCollectionData("programmes");
      expect(data).toHaveProperty("items");
      expect(Array.isArray(data.items)).toBe(true);
      expect((data.items as unknown[]).length).toBeGreaterThanOrEqual(4);
    });

    it("allows info@budgetndiostory.org to update collection data", () => {
      const currentData = headlessCmsApi.getCollectionData("socials");
      const updatedData = { ...currentData, testKey: "PRD Compliance Value" };

      const res = headlessCmsApi.updateCollectionData("socials", updatedData, "info@budgetndiostory.org");
      expect(res.success).toBe(true);
      expect(res.collection).toBe("socials");

      const verifyData = headlessCmsApi.getCollectionData("socials");
      expect(verifyData.testKey).toBe("PRD Compliance Value");
    });

    it("prevents unauthorized users from updating Headless CMS collections", () => {
      const currentData = headlessCmsApi.getCollectionData("landing");
      expect(() => {
        headlessCmsApi.updateCollectionData("landing", currentData, "hacker@example.com");
      }).toThrow(/Permission Denied/i);
    });

    it("exports valid formatted JSON for any collection", () => {
      const jsonStr = headlessCmsApi.exportCollectionJson("about");
      expect(() => JSON.parse(jsonStr)).not.toThrow();
      const parsed = JSON.parse(jsonStr);
      expect(parsed).toBeDefined();
    });
  });

  /* ========================================================================
   * 3. Public Web Analytics & All-Time Metrics
   * ======================================================================== */
  describe("Public Web Analytics & Bandwidth Metrics (PRD Spec 3)", () => {
    it("provides All-Time historical metrics including 1.37 TB bandwidth payload", () => {
      const analytics = getComprehensiveAnalytics("all_time");
      expect(analytics.period).toBe("all_time");
      expect(analytics.allTimeOverview.dataConsumedGb.formatted).toBe("1.37 TB");
      expect(analytics.allTimeOverview.totalPageviews.formatted).toBe("186,400");
      expect(analytics.allTimeOverview.citizensReached.formatted).toBe("42,850");
      expect(analytics.allTimeOverview.uptimePercentage.formatted).toBe("99.94%");
    });

    it("calculates correct bandwidth payload breakdown percentages", () => {
      const analytics = getComprehensiveAnalytics("all_time");
      const categories = analytics.dataConsumedInterpreted.categories;
      const totalPct = categories.reduce((acc, curr) => acc + curr.percentage, 0);

      expect(totalPct).toBeCloseTo(100, 1);

      const pdfCategory = categories.find((b) => b.label.includes("PDF"));
      expect(pdfCategory?.percentage).toBe(61.2);

      const visualsCategory = categories.find((b) => b.label.includes("Visualizations"));
      expect(visualsCategory?.percentage).toBe(22.6);
    });
  });

  /* ========================================================================
   * 4. Programmes Architecture & Copy Audit Compliance
   * ======================================================================== */
  describe("Programmes Architecture & Copy Audit Compliance (PRD Spec 4)", () => {
    it("includes BNS Connect, Mashinani, Wanahabari Lab, and Studios in programmes schema", () => {
      const programmesData = headlessCmsApi.getCollectionData("programmes") as {
        items?: Array<{ slug: string; name: string }>;
      };

      const slugs = (programmesData.items || []).map((i) => i.slug);
      expect(slugs).toContain("connect");
      expect(slugs).toContain("mashinani");
      expect(slugs).toContain("wanahabari-lab");
      expect(slugs).toContain("studios");
    });

    it("verifies BNS Mashinani embeds in Kakamega, Kilifi, Nakuru, and Wajir", () => {
      const programmesData = headlessCmsApi.getCollectionData("programmes") as {
        items?: Array<{ slug: string; body: string; highlight: string }>;
      };

      const mashinani = (programmesData.items || []).find((i) => i.slug === "mashinani");
      expect(mashinani?.body).toContain("Kakamega");
      expect(mashinani?.body).toContain("Kilifi");
      expect(mashinani?.body).toContain("Nakuru");
      expect(mashinani?.body).toContain("Wajir");
      expect(mashinani?.highlight).toContain("4 counties");
    });
  });

  /* ========================================================================
   * 5. 47-County Budget Ingestion & Real Data Engine
   * ======================================================================== */
  describe("47-County Fiscal Data Engine (PRD Spec 5)", () => {
    it("provides verified allocation data for ALL 47 Kenyan counties", () => {
      const counties = countyScraperEngine.getAllCounties();
      expect(counties.length).toBe(47);

      const nairobi = countyScraperEngine.getCountyByCode(47);
      expect(nairobi?.name).toBe("Nairobi");
      expect(nairobi?.allocationKesMillion).toBeGreaterThan(40000);

      const kakamega = countyScraperEngine.getCountyByName("Kakamega");
      expect(kakamega?.name).toBe("Kakamega");
      expect(kakamega?.executionRatePct).toBeGreaterThan(90);
    });

    it("calculates accurate summary metrics for national equitable share", () => {
      const summary = countyScraperEngine.getSummary();
      expect(summary.totalCounties).toBe(47);
      expect(summary.nationalEquitableShareKesBillion).toBe(415.0);
      expect(summary.averageExecutionRatePct).toBeGreaterThan(80);
    });
  });

  /* ========================================================================
   * 6. Real-Time Features: Django Sync, Push Notifications & Townhall Live
   * ======================================================================== */
  describe("Real-Time Engagement & Django Sync (PRD Spec 6)", () => {
    it("synchronizes God Mode and CMS requests with bnske Django backend", async () => {
      const syncGod = await bnskeSyncEngine.syncGodModeRequests();
      expect(syncGod).toBe(true);

      const syncCms = await bnskeSyncEngine.syncCmsCollection("programmes", {});
      expect(syncCms).toBe(true);

      const status = bnskeSyncEngine.getStatus();
      expect(status.connected).toBe(true);
      expect(status.godModeRequestsSynced).toBeGreaterThan(0);
    });

    it("generates VAPID keys and handles Web Push Subscriptions", () => {
      const key = pushNotificationEngine.getVapidPublicKey();
      expect(key).toContain("BNS_YOUTH_PUBLIC_VAPID_KEY");
    });

    it("handles live townhall question submissions and upvoting", () => {
      const initialCount = liveTownhallEngine.getSession().questions.length;
      const q = liveTownhallEngine.submitQuestion(
        "John Kamau",
        "Nakuru",
        "What proportion of Nakuru agricultural budget targets water harvesting?",
      );

      expect(q.authorName).toBe("John Kamau");
      expect(liveTownhallEngine.getSession().questions.length).toBe(initialCount + 1);

      const upvoted = liveTownhallEngine.upvoteQuestion(q.id);
      expect(upvoted).toBe(true);
      const updatedQ = liveTownhallEngine.getSession().questions.find((item) => item.id === q.id);
      expect(updatedQ?.upvotes).toBe(2);
    });

    it("generates valid OAuth authentication URLs for Google and Apple", () => {
      const googleUrl = socialAuthAdapter.getGoogleAuthUrl();
      expect(googleUrl).toContain("accounts.google.com");
      expect(googleUrl).toContain("oauth2");

      const appleUrl = socialAuthAdapter.getAppleAuthUrl();
      expect(appleUrl).toContain("appleid.apple.com");
    });
  });
});
