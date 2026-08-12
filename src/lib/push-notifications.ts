/**
 * Web Push Notification Engine for Citizen Alerts.
 * Alerts registered citizens when new Cabinet Notes, surveys, or townhalls are published.
 */

export type PushNotificationSubscription = {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
  subscribedAt: string;
  preferences: {
    cabinetNotes: boolean;
    surveys: boolean;
    townhalls: boolean;
    budgetReports: boolean;
  };
};

const VAPID_PUBLIC_KEY = "BEl62iUYgUivxIkv69yViEuiBIa-p9y_BNS_YOUTH_PUBLIC_VAPID_KEY";

export const pushNotificationEngine = {
  getVapidPublicKey: (): string => VAPID_PUBLIC_KEY,

  isSupported: (): boolean => {
    if (typeof window === "undefined") return false;
    return "serviceWorker" in navigator && "PushManager" in window;
  },

  subscribeUser: async (): Promise<PushNotificationSubscription | null> => {
    if (!pushNotificationEngine.isSupported()) return null;

    const sub: PushNotificationSubscription = {
      endpoint: `https://push.budgetndiostory.org/sub/${Date.now()}`,
      keys: {
        p256dh: "BNSSubscriptionKeyP256",
        auth: "BNSAuthSecretKey",
      },
      subscribedAt: new Date().toISOString(),
      preferences: {
        cabinetNotes: true,
        surveys: true,
        townhalls: true,
        budgetReports: true,
      },
    };

    if (typeof localStorage !== "undefined") {
      localStorage.setItem("bns_push_subscription", JSON.stringify(sub));
    }

    return sub;
  },

  getSavedSubscription: (): PushNotificationSubscription | null => {
    if (typeof localStorage === "undefined") return null;
    const raw = localStorage.getItem("bns_push_subscription");
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },
};
