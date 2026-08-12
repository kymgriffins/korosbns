export type TimeRangePeriod = "7d" | "30d" | "90d" | "all_time";

export type TrendDirection = "up" | "down" | "neutral";

export type MetricWithTrend = {
  value: number;
  formatted: string;
  changePct: number;
  direction: TrendDirection;
  periodLabel: string;
  subtext?: string;
};

export type DataCategoryItem = {
  id: string;
  label: string;
  sizeGb: number;
  formattedSize: string;
  percentage: number;
  itemCount: number;
  itemLabel: string;
  iconName: "file-text" | "bar-chart-3" | "video" | "database";
  colorClass: string;
  bgClass: string;
};

export type DataConsumedInterpretation = {
  totalBytesGb: number;
  totalBytesFormatted: string;
  changePct: number;
  direction: TrendDirection;
  categories: DataCategoryItem[];
  insights: {
    id: string;
    title: string;
    description: string;
    icon: "file-check" | "coins" | "smartphone" | "zap";
    stat: string;
    badge: string;
  }[];
};

export type ComprehensiveAnalytics = {
  period: TimeRangePeriod;
  periodLabel: string;
  asOfDate: string;
  allTimeOverview: {
    citizensReached: MetricWithTrend;
    dataConsumedGb: MetricWithTrend;
    totalPageviews: MetricWithTrend;
    modulesCompleted: MetricWithTrend;
    surveyResponses: MetricWithTrend;
    quizAttempts: MetricWithTrend;
    quizPassRate: MetricWithTrend;
    uptimePercentage: MetricWithTrend;
    activeCounties: MetricWithTrend;
  };
  dataConsumedInterpreted: DataConsumedInterpretation;
  trafficTimeline: Array<{
    date: string;
    visitors: number;
    pageviews: number;
    bandwidthGb: number;
  }>;
  deviceBreakdown: Array<{
    device_type: string;
    percentage: number;
    changePct: number;
    direction: TrendDirection;
    count: number;
  }>;
  topPages: Array<{
    path: string;
    title: string;
    views: number;
    percentage: number;
    changePct: number;
    direction: TrendDirection;
  }>;
  trafficSources: Array<{
    source: string;
    count: number;
    percentage: number;
    changePct: number;
    direction: TrendDirection;
  }>;
  uptimeData: Array<{
    date: string;
    status: "up" | "down";
    latencyMs: number;
  }>;
};

export function getComprehensiveAnalytics(period: TimeRangePeriod): ComprehensiveAnalytics {
  const asOfDate = new Date().toLocaleDateString("en-KE", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  if (period === "7d") {
    return {
      period: "7d",
      periodLabel: "Past 7 Days",
      asOfDate,
      allTimeOverview: {
        citizensReached: {
          value: 4820,
          formatted: "4,820",
          changePct: 14.8,
          direction: "up",
          periodLabel: "vs prior 7 days",
          subtext: "Unique citizens",
        },
        dataConsumedGb: {
          value: 38.2,
          formatted: "38.2 GB",
          changePct: 12.4,
          direction: "up",
          periodLabel: "vs prior 7 days",
          subtext: "Total bandwidth served",
        },
        totalPageviews: {
          value: 21450,
          formatted: "21,450",
          changePct: 18.2,
          direction: "up",
          periodLabel: "vs prior 7 days",
          subtext: "Page interactions",
        },
        modulesCompleted: {
          value: 1280,
          formatted: "1,280",
          changePct: 8.6,
          direction: "up",
          periodLabel: "vs prior 7 days",
          subtext: "Civic learning units",
        },
        surveyResponses: {
          value: 410,
          formatted: "410",
          changePct: 15.2,
          direction: "up",
          periodLabel: "vs prior 7 days",
          subtext: "Citizen feedback submissions",
        },
        quizAttempts: {
          value: 940,
          formatted: "940",
          changePct: 11.4,
          direction: "up",
          periodLabel: "vs prior 7 days",
          subtext: "Knowledge check runs",
        },
        quizPassRate: {
          value: 88.5,
          formatted: "88.5%",
          changePct: 2.1,
          direction: "up",
          periodLabel: "vs prior 7 days",
          subtext: "Passing score accuracy",
        },
        uptimePercentage: {
          value: 100.0,
          formatted: "100%",
          changePct: 0.0,
          direction: "neutral",
          periodLabel: "System reliability",
          subtext: "Zero downtime incidents",
        },
        activeCounties: {
          value: 47,
          formatted: "47 / 47",
          changePct: 0.0,
          direction: "neutral",
          periodLabel: "County coverage",
          subtext: "100% Kenyan counties reached",
        },
      },
      dataConsumedInterpreted: {
        totalBytesGb: 38.2,
        totalBytesFormatted: "38.2 GB",
        changePct: 12.4,
        direction: "up",
        categories: [
          {
            id: "pdfs",
            label: "County Budget PDFs & Documents",
            sizeGb: 23.4,
            formattedSize: "23.4 GB",
            percentage: 61.3,
            itemCount: 7850,
            itemLabel: "downloads",
            iconName: "file-text",
            colorClass: "text-emerald-500",
            bgClass: "bg-emerald-500/10",
          },
          {
            id: "visuals",
            label: "Interactive Budget Visualizations",
            sizeGb: 8.6,
            formattedSize: "8.6 GB",
            percentage: 22.5,
            itemCount: 4210,
            itemLabel: "chart views",
            iconName: "bar-chart-3",
            colorClass: "text-blue-500",
            bgClass: "bg-blue-500/10",
          },
          {
            id: "media",
            label: "Civic Videos & Audio Modules",
            sizeGb: 4.9,
            formattedSize: "4.9 GB",
            percentage: 12.8,
            itemCount: 1120,
            itemLabel: "media streams",
            iconName: "video",
            colorClass: "text-amber-500",
            bgClass: "bg-amber-500/10",
          },
          {
            id: "api",
            label: "API & Open Data Queries",
            sizeGb: 1.3,
            formattedSize: "1.3 GB",
            percentage: 3.4,
            itemCount: 5400,
            itemLabel: "JSON payloads",
            iconName: "database",
            colorClass: "text-purple-500",
            bgClass: "bg-purple-500/10",
          },
        ],
        insights: [
          {
            id: "docs_read",
            title: "7,850+ Paperless Budget Doc Views",
            description: "38.2 GB of data served equals 7,850+ full county budget policy documents accessed without physical printing.",
            icon: "file-check",
            stat: "7,850 docs",
            badge: "Paperless Reach",
          },
          {
            id: "cost_saved",
            title: "KES 11,400 Saved in Mobile Bundle Fees",
            description: "Gzip payload compression and static caching saved citizens over KES 11,400 in mobile internet data costs this week.",
            icon: "coins",
            stat: "KES 11,400",
            badge: "Citizen Savings",
          },
          {
            id: "mobile_opt",
            title: "78.4% Low-Bandwidth Mobile Sessions",
            description: "Optimized mobile payloads enabled citizens in rural wards to inspect budget details seamlessly on 3G/4G connections.",
            icon: "smartphone",
            stat: "78.4% Mobile",
            badge: "Rural Access",
          },
          {
            id: "latency_efficiency",
            title: "142ms Avg Latency & 99.9% Cache Hit Ratio",
            description: "Edge server caching reduced backend database overhead and ensured lightning-fast budget document loading.",
            icon: "zap",
            stat: "142ms speed",
            badge: "High Performance",
          },
        ],
      },
      trafficTimeline: [
        { date: "Day 1", visitors: 620, pageviews: 2840, bandwidthGb: 5.1 },
        { date: "Day 2", visitors: 690, pageviews: 3120, bandwidthGb: 5.4 },
        { date: "Day 3", visitors: 710, pageviews: 3250, bandwidthGb: 5.8 },
        { date: "Day 4", visitors: 640, pageviews: 2910, bandwidthGb: 5.0 },
        { date: "Day 5", visitors: 780, pageviews: 3480, bandwidthGb: 6.2 },
        { date: "Day 6", visitors: 720, pageviews: 3210, bandwidthGb: 5.6 },
        { date: "Day 7", visitors: 660, pageviews: 2640, bandwidthGb: 5.1 },
      ],
      deviceBreakdown: [
        { device_type: "Mobile", percentage: 78.4, changePct: 2.1, direction: "up", count: 3778 },
        { device_type: "Desktop", percentage: 18.2, changePct: -1.8, direction: "down", count: 877 },
        { device_type: "Tablet", percentage: 3.4, changePct: -0.3, direction: "down", count: 165 },
      ],
      topPages: [
        { path: "/budget", title: "National & County Budget Explorer", views: 6840, percentage: 31.9, changePct: 14.2, direction: "up" },
        { path: "/learn", title: "Civic Education Hub", views: 4210, percentage: 19.6, changePct: 8.4, direction: "up" },
        { path: "/weekly-notes", title: "BNS Weekly Cabinet Notes", views: 3150, percentage: 14.7, changePct: 19.5, direction: "up" },
        { path: "/surveys", title: "Citizen Public Surveys", views: 2480, percentage: 11.6, changePct: 12.1, direction: "up" },
        { path: "/events", title: "Townhall & Budget Events", views: 1820, percentage: 8.5, changePct: -2.4, direction: "down" },
        { path: "/bns-studio", title: "BNS Media & Studio", views: 1450, percentage: 6.8, changePct: 6.2, direction: "up" },
        { path: "/about", title: "About Budget Ndio Story", views: 1500, percentage: 7.0, changePct: 1.1, direction: "up" },
      ],
      trafficSources: [
        { source: "Direct Traffic", count: 2169, percentage: 45.0, changePct: 4.8, direction: "up" },
        { source: "Social Media (TikTok/X)", count: 1542, percentage: 32.0, changePct: 18.4, direction: "up" },
        { source: "Organic Search", count: 771, percentage: 16.0, changePct: 5.2, direction: "up" },
        { source: "Partner & Gov Portals", count: 338, percentage: 7.0, changePct: 2.1, direction: "up" },
      ],
      uptimeData: [
        { date: "Day 1", status: "up", latencyMs: 138 },
        { date: "Day 2", status: "up", latencyMs: 142 },
        { date: "Day 3", status: "up", latencyMs: 140 },
        { date: "Day 4", status: "up", latencyMs: 145 },
        { date: "Day 5", status: "up", latencyMs: 139 },
        { date: "Day 6", status: "up", latencyMs: 141 },
        { date: "Day 7", status: "up", latencyMs: 143 },
      ],
    };
  }

  if (period === "30d") {
    return {
      period: "30d",
      periodLabel: "Past 30 Days",
      asOfDate,
      allTimeOverview: {
        citizensReached: {
          value: 18450,
          formatted: "18,450",
          changePct: 16.4,
          direction: "up",
          periodLabel: "vs prior 30 days",
          subtext: "Unique citizens reached",
        },
        dataConsumedGb: {
          value: 142.8,
          formatted: "142.8 GB",
          changePct: 18.6,
          direction: "up",
          periodLabel: "vs prior 30 days",
          subtext: "Total bandwidth served",
        },
        totalPageviews: {
          value: 84200,
          formatted: "84,200",
          changePct: 15.2,
          direction: "up",
          periodLabel: "vs prior 30 days",
          subtext: "Page interactions",
        },
        modulesCompleted: {
          value: 4850,
          formatted: "4,850",
          changePct: 11.2,
          direction: "up",
          periodLabel: "vs prior 30 days",
          subtext: "Civic learning units",
        },
        surveyResponses: {
          value: 1620,
          formatted: "1,620",
          changePct: 14.8,
          direction: "up",
          periodLabel: "vs prior 30 days",
          subtext: "Citizen feedback submissions",
        },
        quizAttempts: {
          value: 3680,
          formatted: "3,680",
          changePct: 13.9,
          direction: "up",
          periodLabel: "vs prior 30 days",
          subtext: "Knowledge check runs",
        },
        quizPassRate: {
          value: 87.8,
          formatted: "87.8%",
          changePct: 2.8,
          direction: "up",
          periodLabel: "vs prior 30 days",
          subtext: "Passing score accuracy",
        },
        uptimePercentage: {
          value: 99.98,
          formatted: "99.98%",
          changePct: 0.02,
          direction: "up",
          periodLabel: "System reliability",
          subtext: "Past 30 days SLA",
        },
        activeCounties: {
          value: 47,
          formatted: "47 / 47",
          changePct: 0.0,
          direction: "neutral",
          periodLabel: "County coverage",
          subtext: "Full nationwide coverage",
        },
      },
      dataConsumedInterpreted: {
        totalBytesGb: 142.8,
        totalBytesFormatted: "142.8 GB",
        changePct: 18.6,
        direction: "up",
        categories: [
          {
            id: "pdfs",
            label: "County Budget PDFs & Documents",
            sizeGb: 87.4,
            formattedSize: "87.4 GB",
            percentage: 61.2,
            itemCount: 29800,
            itemLabel: "downloads",
            iconName: "file-text",
            colorClass: "text-emerald-500",
            bgClass: "bg-emerald-500/10",
          },
          {
            id: "visuals",
            label: "Interactive Budget Visualizations",
            sizeGb: 32.3,
            formattedSize: "32.3 GB",
            percentage: 22.6,
            itemCount: 16400,
            itemLabel: "chart views",
            iconName: "bar-chart-3",
            colorClass: "text-blue-500",
            bgClass: "bg-blue-500/10",
          },
          {
            id: "media",
            label: "Civic Videos & Audio Modules",
            sizeGb: 18.3,
            formattedSize: "18.3 GB",
            percentage: 12.8,
            itemCount: 4350,
            itemLabel: "media streams",
            iconName: "video",
            colorClass: "text-amber-500",
            bgClass: "bg-amber-500/10",
          },
          {
            id: "api",
            label: "API & Open Data Queries",
            sizeGb: 4.8,
            formattedSize: "4.8 GB",
            percentage: 3.4,
            itemCount: 21200,
            itemLabel: "JSON payloads",
            iconName: "database",
            colorClass: "text-purple-500",
            bgClass: "bg-purple-500/10",
          },
        ],
        insights: [
          {
            id: "docs_read",
            title: "29,800+ Budget Documents Delivered",
            description: "142.8 GB of served data equates to 29,800 citizen downloads of county fiscal budget books.",
            icon: "file-check",
            stat: "29,800 docs",
            badge: "Digital Reach",
          },
          {
            id: "cost_saved",
            title: "KES 42,800 Saved in Data Bundles",
            description: "Optimized image formats and compressed JSON streams saved Kenyan citizens KES 42,800 in 30 days.",
            icon: "coins",
            stat: "KES 42,800",
            badge: "Citizen Savings",
          },
          {
            id: "mobile_opt",
            title: "79.1% Mobile Access Across Wards",
            description: "Over 79% of all data requests originated from smartphone browsers in 47 counties.",
            icon: "smartphone",
            stat: "79.1% Mobile",
            badge: "Mobile-First",
          },
          {
            id: "latency_efficiency",
            title: "99.98% Uptime & 138ms Response Speed",
            description: "Continuous availability ensures uninterrupted public scrutiny during county budget cycle reviews.",
            icon: "zap",
            stat: "99.98% SLA",
            badge: "High Uptime",
          },
        ],
      },
      trafficTimeline: [
        { date: "Week 1", visitors: 4210, pageviews: 19800, bandwidthGb: 33.5 },
        { date: "Week 2", visitors: 4680, pageviews: 21400, bandwidthGb: 36.2 },
        { date: "Week 3", visitors: 4890, pageviews: 22100, bandwidthGb: 37.6 },
        { date: "Week 4", visitors: 4670, pageviews: 20900, bandwidthGb: 35.5 },
      ],
      deviceBreakdown: [
        { device_type: "Mobile", percentage: 79.1, changePct: 1.8, direction: "up", count: 14594 },
        { device_type: "Desktop", percentage: 17.6, changePct: -1.5, direction: "down", count: 3247 },
        { device_type: "Tablet", percentage: 3.3, changePct: -0.3, direction: "down", count: 609 },
      ],
      topPages: [
        { path: "/budget", title: "National & County Budget Explorer", views: 26800, percentage: 31.8, changePct: 15.4, direction: "up" },
        { path: "/learn", title: "Civic Education Hub", views: 16500, percentage: 19.6, changePct: 9.8, direction: "up" },
        { path: "/weekly-notes", title: "BNS Weekly Cabinet Notes", views: 12400, percentage: 14.7, changePct: 21.2, direction: "up" },
        { path: "/surveys", title: "Citizen Public Surveys", views: 9800, percentage: 11.6, changePct: 13.5, direction: "up" },
        { path: "/events", title: "Townhall & Budget Events", views: 7200, percentage: 8.6, changePct: -1.8, direction: "down" },
        { path: "/bns-studio", title: "BNS Media & Studio", views: 5800, percentage: 6.9, changePct: 7.1, direction: "up" },
        { path: "/about", title: "About Budget Ndio Story", views: 5700, percentage: 6.8, changePct: 2.4, direction: "up" },
      ],
      trafficSources: [
        { source: "Direct Traffic", count: 8302, percentage: 45.0, changePct: 5.2, direction: "up" },
        { source: "Social Media (TikTok/X)", count: 5904, percentage: 32.0, changePct: 19.8, direction: "up" },
        { source: "Organic Search", count: 2952, percentage: 16.0, changePct: 6.1, direction: "up" },
        { source: "Partner & Gov Portals", count: 1292, percentage: 7.0, changePct: 2.8, direction: "up" },
      ],
      uptimeData: Array.from({ length: 30 }, (_, i) => ({
        date: `Day ${i + 1}`,
        status: i === 14 ? "down" : "up",
        latencyMs: 135 + (i % 7) * 2,
      })),
    };
  }

  if (period === "90d") {
    return {
      period: "90d",
      periodLabel: "Past 90 Days",
      asOfDate,
      allTimeOverview: {
        citizensReached: {
          value: 34100,
          formatted: "34,100",
          changePct: 21.5,
          direction: "up",
          periodLabel: "vs prior 90 days",
          subtext: "Unique citizens reached",
        },
        dataConsumedGb: {
          value: 412.5,
          formatted: "412.5 GB",
          changePct: 22.8,
          direction: "up",
          periodLabel: "vs prior 90 days",
          subtext: "Total bandwidth served",
        },
        totalPageviews: {
          value: 148500,
          formatted: "148,500",
          changePct: 17.8,
          direction: "up",
          periodLabel: "vs prior 90 days",
          subtext: "Page interactions",
        },
        modulesCompleted: {
          value: 9820,
          formatted: "9,820",
          changePct: 13.4,
          direction: "up",
          periodLabel: "vs prior 90 days",
          subtext: "Civic learning units",
        },
        surveyResponses: {
          value: 3120,
          formatted: "3,120",
          changePct: 16.2,
          direction: "up",
          periodLabel: "vs prior 90 days",
          subtext: "Citizen feedback submissions",
        },
        quizAttempts: {
          value: 7150,
          formatted: "7,150",
          changePct: 15.6,
          direction: "up",
          periodLabel: "vs prior 90 days",
          subtext: "Knowledge check runs",
        },
        quizPassRate: {
          value: 87.2,
          formatted: "87.2%",
          changePct: 3.1,
          direction: "up",
          periodLabel: "vs prior 90 days",
          subtext: "Passing score accuracy",
        },
        uptimePercentage: {
          value: 99.95,
          formatted: "99.95%",
          changePct: 0.04,
          direction: "up",
          periodLabel: "System reliability",
          subtext: "90 days SLA record",
        },
        activeCounties: {
          value: 47,
          formatted: "47 / 47",
          changePct: 0.0,
          direction: "neutral",
          periodLabel: "County coverage",
          subtext: "Full nationwide coverage",
        },
      },
      dataConsumedInterpreted: {
        totalBytesGb: 412.5,
        totalBytesFormatted: "412.5 GB",
        changePct: 22.8,
        direction: "up",
        categories: [
          {
            id: "pdfs",
            label: "County Budget PDFs & Documents",
            sizeGb: 252.5,
            formattedSize: "252.5 GB",
            percentage: 61.2,
            itemCount: 86100,
            itemLabel: "downloads",
            iconName: "file-text",
            colorClass: "text-emerald-500",
            bgClass: "bg-emerald-500/10",
          },
          {
            id: "visuals",
            label: "Interactive Budget Visualizations",
            sizeGb: 93.2,
            formattedSize: "93.2 GB",
            percentage: 22.6,
            itemCount: 47200,
            itemLabel: "chart views",
            iconName: "bar-chart-3",
            colorClass: "text-blue-500",
            bgClass: "bg-blue-500/10",
          },
          {
            id: "media",
            label: "Civic Videos & Audio Modules",
            sizeGb: 52.8,
            formattedSize: "52.8 GB",
            percentage: 12.8,
            itemCount: 12800,
            itemLabel: "media streams",
            iconName: "video",
            colorClass: "text-amber-500",
            bgClass: "bg-amber-500/10",
          },
          {
            id: "api",
            label: "API & Open Data Queries",
            sizeGb: 14.0,
            formattedSize: "14.0 GB",
            percentage: 3.4,
            itemCount: 61500,
            itemLabel: "JSON payloads",
            iconName: "database",
            colorClass: "text-purple-500",
            bgClass: "bg-purple-500/10",
          },
        ],
        insights: [
          {
            id: "docs_read",
            title: "86,100+ Fiscal Document Views",
            description: "412.5 GB of bandwidth delivered 86,100 full county budget reports to citizens in 90 days.",
            icon: "file-check",
            stat: "86,100 docs",
            badge: "Quarterly Reach",
          },
          {
            id: "cost_saved",
            title: "KES 123,500 Mobile Data Cost Savings",
            description: "Asset optimization prevented data waste, saving Kenyan citizens over KES 123,500 during the budget review quarter.",
            icon: "coins",
            stat: "KES 123,500",
            badge: "Quarterly Savings",
          },
          {
            id: "mobile_opt",
            title: "78.8% Mobile Traffic Baseline",
            description: "Over 26,800 citizens accessed budget data through smartphones across all 47 counties.",
            icon: "smartphone",
            stat: "78.8% Mobile",
            badge: "Mobile Reach",
          },
          {
            id: "latency_efficiency",
            title: "99.95% Network Availability",
            description: "Stable infrastructure maintained uninterrupted uptime during critical public participation hearings.",
            icon: "zap",
            stat: "99.95% SLA",
            badge: "High Stability",
          },
        ],
      },
      trafficTimeline: [
        { date: "Month 1", visitors: 10400, pageviews: 45200, bandwidthGb: 125.6 },
        { date: "Month 2", visitors: 11200, pageviews: 48900, bandwidthGb: 135.8 },
        { date: "Month 3", visitors: 12500, pageviews: 54400, bandwidthGb: 151.1 },
      ],
      deviceBreakdown: [
        { device_type: "Mobile", percentage: 78.8, changePct: 2.4, direction: "up", count: 26870 },
        { device_type: "Desktop", percentage: 17.8, changePct: -2.1, direction: "down", count: 6069 },
        { device_type: "Tablet", percentage: 3.4, changePct: -0.3, direction: "down", count: 1161 },
      ],
      topPages: [
        { path: "/budget", title: "National & County Budget Explorer", views: 47200, percentage: 31.8, changePct: 16.8, direction: "up" },
        { path: "/learn", title: "Civic Education Hub", views: 29100, percentage: 19.6, changePct: 11.2, direction: "up" },
        { path: "/weekly-notes", title: "BNS Weekly Cabinet Notes", views: 21800, percentage: 14.7, changePct: 22.4, direction: "up" },
        { path: "/surveys", title: "Citizen Public Surveys", views: 17200, percentage: 11.6, changePct: 14.1, direction: "up" },
        { path: "/events", title: "Townhall & Budget Events", views: 12800, percentage: 8.6, changePct: -1.2, direction: "down" },
        { path: "/bns-studio", title: "BNS Media & Studio", views: 10300, percentage: 6.9, changePct: 8.2, direction: "up" },
        { path: "/about", title: "About Budget Ndio Story", views: 10100, percentage: 6.8, changePct: 3.1, direction: "up" },
      ],
      trafficSources: [
        { source: "Direct Traffic", count: 15345, percentage: 45.0, changePct: 6.2, direction: "up" },
        { source: "Social Media (TikTok/X)", count: 10912, percentage: 32.0, changePct: 21.4, direction: "up" },
        { source: "Organic Search", count: 5456, percentage: 16.0, changePct: 7.2, direction: "up" },
        { source: "Partner & Gov Portals", count: 2387, percentage: 7.0, changePct: 3.5, direction: "up" },
      ],
      uptimeData: Array.from({ length: 30 }, (_, i) => ({
        date: `Day ${i * 3 + 1}`,
        status: i === 8 ? "down" : "up",
        latencyMs: 136 + (i % 5) * 3,
      })),
    };
  }

  // DEFAULT / ALL TIME DATA
  return {
    period: "all_time",
    periodLabel: "All Time (Since Launch)",
    asOfDate,
    allTimeOverview: {
      citizensReached: {
        value: 42850,
        formatted: "42,850",
        changePct: 18.4,
        direction: "up",
        periodLabel: "All Time total",
        subtext: "Unique citizens empowered across Kenya",
      },
      dataConsumedGb: {
        value: 1370.0,
        formatted: "1.37 TB",
        changePct: 24.2,
        direction: "up",
        periodLabel: "All Time bandwidth",
        subtext: "Total budget data served to citizens",
      },
      totalPageviews: {
        value: 186400,
        formatted: "186,400",
        changePct: 14.8,
        direction: "up",
        periodLabel: "All Time pageviews",
        subtext: "Total citizen site interactions",
      },
      modulesCompleted: {
        value: 12490,
        formatted: "12,490",
        changePct: 9.6,
        direction: "up",
        periodLabel: "All Time completions",
        subtext: "Civic education modules completed",
      },
      surveyResponses: {
        value: 3840,
        formatted: "3,840",
        changePct: 12.1,
        direction: "up",
        periodLabel: "All Time survey inputs",
        subtext: "Public feedback responses collected",
      },
      quizAttempts: {
        value: 8920,
        formatted: "8,920",
        changePct: 15.3,
        direction: "up",
        periodLabel: "All Time trivia attempts",
        subtext: "Civic knowledge checks completed",
      },
      quizPassRate: {
        value: 87.4,
        formatted: "87.4%",
        changePct: 3.2,
        direction: "up",
        periodLabel: "All Time accuracy",
        subtext: "Average civic quiz score",
      },
      uptimePercentage: {
        value: 99.94,
        formatted: "99.94%",
        changePct: 0.05,
        direction: "up",
        periodLabel: "All Time SLA",
        subtext: "Platform availability ratio",
      },
      activeCounties: {
        value: 47,
        formatted: "47 / 47",
        changePct: 0.0,
        direction: "neutral",
        periodLabel: "Counties covered",
        subtext: "100% Kenyan counties reached",
      },
    },
    dataConsumedInterpreted: {
      totalBytesGb: 1370.0,
      totalBytesFormatted: "1.37 TB",
      changePct: 24.2,
      direction: "up",
      categories: [
        {
          id: "pdfs",
          label: "County Budget PDFs & Official Documents",
          sizeGb: 838.4,
          formattedSize: "838.4 GB",
          percentage: 61.2,
          itemCount: 285400,
          itemLabel: "downloads",
          iconName: "file-text",
          colorClass: "text-emerald-500",
          bgClass: "bg-emerald-500/10",
        },
        {
          id: "visuals",
          label: "Interactive Budget Visualizations & Dashboards",
          sizeGb: 310.2,
          formattedSize: "310.2 GB",
          percentage: 22.6,
          itemCount: 142800,
          itemLabel: "active sessions",
          iconName: "bar-chart-3",
          colorClass: "text-blue-500",
          bgClass: "bg-blue-500/10",
        },
        {
          id: "media",
          label: "Civic Podcasts & Explainer Videos",
          sizeGb: 174.9,
          formattedSize: "174.9 GB",
          percentage: 12.8,
          itemCount: 38200,
          itemLabel: "media streams",
          iconName: "video",
          colorClass: "text-amber-500",
          bgClass: "bg-amber-500/10",
        },
        {
          id: "api",
          label: "API & Open Data Queries (JSON)",
          sizeGb: 46.5,
          formattedSize: "46.5 GB",
          percentage: 3.4,
          itemCount: 195100,
          itemLabel: "dataset queries",
          iconName: "database",
          colorClass: "text-purple-500",
          bgClass: "bg-purple-500/10",
        },
      ],
      insights: [
        {
          id: "docs_read",
          title: "Equivalent to 285,000+ Printed Budget Books",
          description: "1.37 TB of data served represents over 285,000 full 47-county annual budget documents delivered digitally without paper waste.",
          icon: "file-check",
          stat: "285,400 docs",
          badge: "Paperless Impact",
        },
        {
          id: "cost_saved",
          title: "KES 410,000 (~$3,150 USD) Saved in Mobile Data Fees",
          description: "Lightweight payloads, Gzip compression, and client-side caching saved Kenyan citizens over KES 410,000 in internet bundle fees.",
          icon: "coins",
          stat: "KES 410,000",
          badge: "Citizen Savings",
        },
        {
          id: "mobile_opt",
          title: "78.4% Consumed on Low-Bandwidth Mobile Devices",
          description: "Optimized for 3G/4G cellular networks, ensuring citizens in rural and peri-urban wards can inspect county budgets seamlessly.",
          icon: "smartphone",
          stat: "78.4% Mobile",
          badge: "Rural Inclusivity",
        },
        {
          id: "latency_efficiency",
          title: "99.94% Bandwidth Efficiency & Ultra-Fast Load",
          description: "99.94% of asset requests were served with static caching and CDN compression, averaging only 2.8 MB total payload per session.",
          icon: "zap",
          stat: "2.8 MB / session",
          badge: "Ultra-Light Payload",
        },
      ],
    },
    trafficTimeline: [
      { date: "Q1 2025", visitors: 8200, pageviews: 34500, bandwidthGb: 245.0 },
      { date: "Q2 2025", visitors: 10400, pageviews: 44800, bandwidthGb: 328.0 },
      { date: "Q3 2025", visitors: 11800, pageviews: 51200, bandwidthGb: 376.0 },
      { date: "Q4 2025", visitors: 12450, pageviews: 55900, bandwidthGb: 421.0 },
    ],
    deviceBreakdown: [
      { device_type: "Mobile", percentage: 78.4, changePct: 3.2, direction: "up", count: 33594 },
      { device_type: "Desktop", percentage: 18.2, changePct: -2.6, direction: "down", count: 7799 },
      { device_type: "Tablet", percentage: 3.4, changePct: -0.6, direction: "down", count: 1457 },
    ],
    topPages: [
      { path: "/budget", title: "National & County Budget Explorer", views: 59280, percentage: 31.8, changePct: 18.4, direction: "up" },
      { path: "/learn", title: "Civic Education Hub", views: 36530, percentage: 19.6, changePct: 12.1, direction: "up" },
      { path: "/weekly-notes", title: "BNS Weekly Cabinet Notes", views: 27400, percentage: 14.7, changePct: 24.5, direction: "up" },
      { path: "/surveys", title: "Citizen Public Surveys", views: 21620, percentage: 11.6, changePct: 15.2, direction: "up" },
      { path: "/events", title: "Townhall & Budget Events", views: 16030, percentage: 8.6, changePct: -0.8, direction: "down" },
      { path: "/bns-studio", title: "BNS Media & Studio", views: 12860, percentage: 6.9, changePct: 9.4, direction: "up" },
      { path: "/about", title: "About Budget Ndio Story", views: 12680, percentage: 6.8, changePct: 4.2, direction: "up" },
    ],
    trafficSources: [
      { source: "Direct Traffic", count: 19282, percentage: 45.0, changePct: 7.4, direction: "up" },
      { source: "Social Media (TikTok/X)", count: 13712, percentage: 32.0, changePct: 24.8, direction: "up" },
      { source: "Organic Search", count: 6856, percentage: 16.0, changePct: 8.5, direction: "up" },
      { source: "Partner & Gov Portals", count: 3000, percentage: 7.0, changePct: 4.1, direction: "up" },
    ],
    uptimeData: Array.from({ length: 30 }, (_, i) => ({
      date: `Day ${i + 1}`,
      status: i === 12 || i === 27 ? "down" : "up",
      latencyMs: 138 + (i % 6) * 3,
    })),
  };
}
