import {
  AlertTriangleIcon,
  ArrowUp,
  Ban,
  BriefcaseBusiness,
  CheckCircle2,
  Droplets,
  Flame,
  Forklift,
  type LucideIcon,
  Package,
  PackageCheck,
  PenLine,
  ShieldCheck,
  Snowflake,
  Star,
  Thermometer,
  ThermometerSun,
  Truck,
  Weight,
} from "lucide-react";

export type ShipmentStatus =
  | "Scheduled"
  | "In Transit"
  | "Out for Delivery"
  | "Delivered"
  | "Delayed"
  | "On Hold"
  | "Customs Hold";

export type TransportMode = "land" | "air" | "sea";
export type RouteType = "road" | "flight" | "ship";
export type CustomerTier = "Priority" | "Standard" | "Non-priority";

export type GeoCoordinate = [longitude: number, latitude: number];

export type ShipmentLocation = {
  coordinates: GeoCoordinate;
  display: string;
  country: string;
  countryCode: string;
};

export type ShipmentCustomer = {
  name: string;
  initials: string;
  id: string;
  tier: CustomerTier;
  tierLabel: string;
};

export type HandlingTag = {
  label: string;
  icon: LucideIcon;
};

export type ShipmentHandling = {
  label: string;
  note: string;
  tags: HandlingTag[];
};

export type Shipment = {
  id: string;
  customer: ShipmentCustomer;
  origin: ShipmentLocation;
  destination: ShipmentLocation;
  cargo: string;
  handling: ShipmentHandling;
  weight: string;
  eta: string;
  etaMeta: string;
  status: ShipmentStatus;
  progress: number;
  mode: TransportMode;
  routeType: RouteType;
  transportNumber: string;
};

const customerAccounts = {
  techCorp: {
    name: "TechCorp",
    initials: "TC",
    id: "SDA-1001-2401-01",
    tier: "Priority",
    tierLabel: "Top 1% by shipment volume",
  },
  regionalRoadExpress: {
    name: "Regional Road Express",
    initials: "RR",
    id: "SDA-1002-2402-02",
    tier: "Priority",
    tierLabel: "Top 1% by shipment volume",
  },
  sendWell: {
    name: "SendWell B.V.",
    initials: "SW",
    id: "SDA-1003-2403-03",
    tier: "Priority",
    tierLabel: "Top 1% by shipment volume",
  },
  sourceDay: {
    name: "SourceDay",
    initials: "SD",
    id: "SDA-1004-2404-04",
    tier: "Standard",
    tierLabel: "Recurring shipment account",
  },
  shippingEasy: {
    name: "ShippingEasy",
    initials: "SE",
    id: "SDA-1005-2405-05",
    tier: "Standard",
    tierLabel: "Recurring shipment account",
  },
  freightView: {
    name: "FreightView",
    initials: "FV",
    id: "SDA-1006-2406-06",
    tier: "Priority",
    tierLabel: "Top 1% by shipment volume",
  },
  logisticsPlus: {
    name: "Logistics Plus",
    initials: "LP",
    id: "SDA-1007-2407-07",
    tier: "Standard",
    tierLabel: "Managed freight account",
  },
  transvirtual: {
    name: "Transvirtual",
    initials: "TV",
    id: "SDA-1008-2408-08",
    tier: "Standard",
    tierLabel: "Managed freight account",
  },
  skyTrack: {
    name: "SkyTrack",
    initials: "ST",
    id: "SDA-1009-2409-09",
    tier: "Non-priority",
    tierLabel: "Occasional shipment account",
  },
  maersk: {
    name: "Maersk",
    initials: "MK",
    id: "SDA-1010-2410-10",
    tier: "Priority",
    tierLabel: "Top 1% by shipment volume",
  },
  flexport: {
    name: "Flexport",
    initials: "FX",
    id: "SDA-1011-2411-11",
    tier: "Priority",
    tierLabel: "Top 1% by shipment volume",
  },
  piedPiper: {
    name: "Pied Piper",
    initials: "PP",
    id: "SDA-1012-2412-12",
    tier: "Non-priority",
    tierLabel: "Occasional shipment account",
  },
} satisfies Record<string, ShipmentCustomer>;

export const shipments: Shipment[] = [
  {
    id: "SDA-01-2401",
    customer: customerAccounts.techCorp,
    origin: {
      display: "CGK Airport",
      country: "Indonesia",
      countryCode: "ID",
      coordinates: [106.6429036, -6.1238696],
    },
    destination: {
      display: "SIN Airport",
      country: "Singapore",
      countryCode: "SG",
      coordinates: [103.9949824, 1.3510921],
    },
    cargo: "Consumer Electronics",
    handling: {
      label: "Fragile electronics",
      note: "Keep package sealed until handoff.",
      tags: [
        { label: "Do not stack", icon: Ban },
        { label: "Keep upright", icon: ArrowUp },
        { label: "Signature required", icon: PenLine },
      ],
    },
    weight: "2,450 kg",
    eta: "08:45 AM",
    etaMeta: "Today",
    status: "In Transit",
    progress: 65,
    mode: "air",
    routeType: "flight",
    transportNumber: "GA-884",
  },
  {
    id: "SDA-02-2402",
    customer: customerAccounts.regionalRoadExpress,
    origin: {
      display: "Surabaya",
      country: "Indonesia",
      countryCode: "ID",
      coordinates: [112.7377674, -7.2462836],
    },
    destination: {
      display: "Semarang",
      country: "Indonesia",
      countryCode: "ID",
      coordinates: [110.4229104, -6.9903988],
    },
    cargo: "Industrial Machinery",
    handling: {
      label: "Heavy machinery",
      note: "Secure machinery to pallet base before road dispatch.",
      tags: [
        { label: "Forklift only", icon: Forklift },
        { label: "Secure load", icon: ShieldCheck },
        { label: "Do not tip", icon: Ban },
      ],
    },
    weight: "8,120 kg",
    eta: "11:20 AM",
    etaMeta: "Tomorrow",
    status: "Delayed",
    progress: 42,
    mode: "land",
    routeType: "road",
    transportNumber: "B 9042 KX",
  },
  {
    id: "SDA-03-2403",
    customer: customerAccounts.sendWell,
    origin: {
      display: "Tanjung Priok Port",
      country: "Indonesia",
      countryCode: "ID",
      coordinates: [106.8805674, -6.1045642],
    },
    destination: {
      display: "Port of Singapore",
      country: "Singapore",
      countryCode: "SG",
      coordinates: [103.7566, 1.2788],
    },
    cargo: "Frozen Seafood",
    handling: {
      label: "Temperature controlled",
      note: "Maintain frozen chain at or below -18°C until port handoff.",
      tags: [
        { label: "Temperature log", icon: Thermometer },
        { label: "Keep frozen", icon: Snowflake },
        { label: "Seal intact", icon: ShieldCheck },
      ],
    },
    weight: "19,800 kg",
    eta: "09:15 PM",
    etaMeta: "Delivered Yesterday",
    status: "Delivered",
    progress: 100,
    mode: "sea",
    routeType: "ship",
    transportNumber: "MV SEA-318",
  },
  {
    id: "SDA-04-2404",
    customer: customerAccounts.maersk,
    origin: {
      display: "KUL Airport",
      country: "Malaysia",
      countryCode: "MY",
      coordinates: [101.7063995, 2.7431274],
    },
    destination: {
      display: "BKK Airport",
      country: "Thailand",
      countryCode: "TH",
      coordinates: [100.7485803, 13.6818767],
    },
    cargo: "Pharmaceutical Kits",
    handling: {
      label: "Temperature controlled",
      note: "Maintain controlled temperature and verify hold clearance before release.",
      tags: [
        { label: "Temperature log", icon: Thermometer },
        { label: "Keep upright", icon: ArrowUp },
        { label: "Signature required", icon: PenLine },
      ],
    },
    weight: "540 kg",
    eta: "06:10 PM",
    etaMeta: "Today",
    status: "On Hold",
    progress: 28,
    mode: "air",
    routeType: "flight",
    transportNumber: "MH-728",
  },
  {
    id: "SDA-05-2405",
    customer: customerAccounts.sourceDay,
    origin: {
      display: "Bandung",
      country: "Indonesia",
      countryCode: "ID",
      coordinates: [107.6070833, -6.9218457],
    },
    destination: {
      display: "Yogyakarta",
      country: "Indonesia",
      countryCode: "ID",
      coordinates: [110.3672845, -7.7953473],
    },
    cargo: "Textiles",
    handling: {
      label: "Standard freight",
      note: "Keep cartons dry and away from direct sunlight.",
      tags: [
        { label: "Keep dry", icon: Droplets },
        { label: "Do not crush", icon: Ban },
        { label: "Standard handoff", icon: PackageCheck },
      ],
    },
    weight: "1,380 kg",
    eta: "09:30 AM",
    etaMeta: "Friday",
    status: "Scheduled",
    progress: 12,
    mode: "land",
    routeType: "road",
    transportNumber: "D 1284 YA",
  },
  {
    id: "SDA-06-2406",
    customer: customerAccounts.logisticsPlus,
    origin: {
      display: "Port Klang",
      country: "Malaysia",
      countryCode: "MY",
      coordinates: [101.3913589, 2.9996963],
    },
    destination: {
      display: "Laem Chabang Port",
      country: "Thailand",
      countryCode: "TH",
      coordinates: [100.8994177, 13.0734119],
    },
    cargo: "Construction Materials",
    handling: {
      label: "Heavy bulk cargo",
      note: "Load with heavy-lift equipment and secure against shifting.",
      tags: [
        { label: "Heavy lift", icon: Forklift },
        { label: "Secure load", icon: ShieldCheck },
        { label: "Do not stack", icon: Ban },
      ],
    },
    weight: "27,400 kg",
    eta: "03:40 PM",
    etaMeta: "Departing Today",
    status: "Scheduled",
    progress: 18,
    mode: "sea",
    routeType: "ship",
    transportNumber: "MV LC-204",
  },
  {
    id: "SDA-07-2407",
    customer: customerAccounts.flexport,
    origin: {
      display: "HKG Airport",
      country: "Hong Kong",
      countryCode: "HK",
      coordinates: [113.9172999, 22.3125986],
    },
    destination: {
      display: "MNL Airport",
      country: "Philippines",
      countryCode: "PH",
      coordinates: [121.0219223, 14.5122467],
    },
    cargo: "Medical Devices",
    handling: {
      label: "Sensitive medical equipment",
      note: "Keep medical devices sealed until customs inspection is complete.",
      tags: [
        { label: "Seal intact", icon: ShieldCheck },
        { label: "Keep upright", icon: ArrowUp },
        { label: "Signature required", icon: PenLine },
      ],
    },
    weight: "860 kg",
    eta: "Pending",
    etaMeta: "Customs",
    status: "Customs Hold",
    progress: 33,
    mode: "air",
    routeType: "flight",
    transportNumber: "CX-901",
  },
  {
    id: "SDA-08-2408",
    customer: customerAccounts.shippingEasy,
    origin: {
      display: "Jakarta",
      country: "Indonesia",
      countryCode: "ID",
      coordinates: [106.827168, -6.1754049],
    },
    destination: {
      display: "Bandung",
      country: "Indonesia",
      countryCode: "ID",
      coordinates: [107.6070833, -6.9218457],
    },
    cargo: "Retail Apparel",
    handling: {
      label: "Standard freight",
      note: "Keep cartons dry and call receiver before final delivery.",
      tags: [
        { label: "Keep dry", icon: Droplets },
        { label: "Call before delivery", icon: Truck },
        { label: "Standard handoff", icon: PackageCheck },
      ],
    },
    weight: "620 kg",
    eta: "02:15 PM",
    etaMeta: "Today",
    status: "Out for Delivery",
    progress: 88,
    mode: "land",
    routeType: "road",
    transportNumber: "B 7712 JKT",
  },
  {
    id: "SDA-09-2409",
    customer: customerAccounts.freightView,
    origin: {
      display: "Shanghai Port",
      country: "China",
      countryCode: "CN",
      coordinates: [121.4872194, 31.2219444],
    },
    destination: {
      display: "Busan Port",
      country: "South Korea",
      countryCode: "KR",
      coordinates: [129.0492086, 35.1177052],
    },
    cargo: "Auto Parts",
    handling: {
      label: "Industrial parts",
      note: "Secure pallets and protect machined surfaces from moisture.",
      tags: [
        { label: "Secure load", icon: ShieldCheck },
        { label: "Keep dry", icon: Droplets },
        { label: "Forklift only", icon: Forklift },
      ],
    },
    weight: "12,200 kg",
    eta: "05:50 PM",
    etaMeta: "Wednesday",
    status: "In Transit",
    progress: 54,
    mode: "sea",
    routeType: "ship",
    transportNumber: "MV BUSAN-54",
  },
  {
    id: "SDA-10-2410",
    customer: customerAccounts.techCorp,
    origin: {
      display: "NRT Airport",
      country: "Japan",
      countryCode: "JP",
      coordinates: [140.3933101, 35.7758714],
    },
    destination: {
      display: "ICN Airport",
      country: "South Korea",
      countryCode: "KR",
      coordinates: [126.4417093, 37.4634593],
    },
    cargo: "Semiconductor Wafers",
    handling: {
      label: "High-value fragile cargo",
      note: "Keep wafers sealed in shock-protected packaging until signed handoff.",
      tags: [
        { label: "Do not stack", icon: Ban },
        { label: "Keep upright", icon: ArrowUp },
        { label: "Signature required", icon: PenLine },
      ],
    },
    weight: "320 kg",
    eta: "08:30 PM",
    etaMeta: "Delivered Yesterday",
    status: "Delivered",
    progress: 100,
    mode: "air",
    routeType: "flight",
    transportNumber: "KE-704",
  },
  {
    id: "SDA-11-2411",
    customer: customerAccounts.sourceDay,
    origin: {
      display: "Kuala Lumpur",
      country: "Malaysia",
      countryCode: "MY",
      coordinates: [101.6942371, 3.1516964],
    },
    destination: {
      display: "Penang",
      country: "Malaysia",
      countryCode: "MY",
      coordinates: [100.3287352, 5.4141619],
    },
    cargo: "Food Ingredients",
    handling: {
      label: "Food-grade handling",
      note: "Keep food-grade seals intact and avoid cross-contamination.",
      tags: [
        { label: "Food grade", icon: PackageCheck },
        { label: "Seal intact", icon: ShieldCheck },
        { label: "Keep dry", icon: Droplets },
      ],
    },
    weight: "3,950 kg",
    eta: "01:05 PM",
    etaMeta: "Today",
    status: "In Transit",
    progress: 71,
    mode: "land",
    routeType: "road",
    transportNumber: "WQH 2184",
  },
  {
    id: "SDA-12-2412",
    customer: customerAccounts.transvirtual,
    origin: {
      display: "Cebu Port",
      country: "Philippines",
      countryCode: "PH",
      coordinates: [123.9174564, 10.3054355],
    },
    destination: {
      display: "Davao Port",
      country: "Philippines",
      countryCode: "PH",
      coordinates: [125.6627111, 7.1265272],
    },
    cargo: "Agricultural Produce",
    handling: {
      label: "Perishable goods",
      note: "Prioritize ventilation and inspect produce condition at port handoff.",
      tags: [
        { label: "Perishable", icon: Thermometer },
        { label: "Ventilated hold", icon: PackageCheck },
        { label: "Inspect on arrival", icon: CheckCircle2 },
      ],
    },
    weight: "6,700 kg",
    eta: "09:40 AM",
    etaMeta: "Friday",
    status: "Delayed",
    progress: 39,
    mode: "sea",
    routeType: "ship",
    transportNumber: "MV DAVAO-12",
  },
  {
    id: "SDA-13-2413",
    customer: customerAccounts.flexport,
    origin: {
      display: "SIN Airport",
      country: "Singapore",
      countryCode: "SG",
      coordinates: [103.9949824, 1.3510921],
    },
    destination: {
      display: "DPS Airport",
      country: "Indonesia",
      countryCode: "ID",
      coordinates: [115.1673704, -8.746515],
    },
    cargo: "Luxury Retail Goods",
    handling: {
      label: "High-value cargo",
      note: "Keep cartons sealed; release only to authorized receiving contact.",
      tags: [
        { label: "High value", icon: Star },
        { label: "Do not stack", icon: Ban },
        { label: "Signature required", icon: PenLine },
      ],
    },
    weight: "210 kg",
    eta: "07:15 AM",
    etaMeta: "Monday",
    status: "Scheduled",
    progress: 9,
    mode: "air",
    routeType: "flight",
    transportNumber: "SQ-938",
  },
  {
    id: "SDA-14-2414",
    customer: customerAccounts.sendWell,
    origin: {
      display: "Port of Manila",
      country: "Philippines",
      countryCode: "PH",
      coordinates: [120.9522815, 14.6038906],
    },
    destination: {
      display: "Tanjung Priok Port",
      country: "Indonesia",
      countryCode: "ID",
      coordinates: [106.8805674, -6.1045642],
    },
    cargo: "Paper Rolls",
    handling: {
      label: "Moisture-sensitive cargo",
      note: "Keep rolls dry and avoid edge impact during unloading.",
      tags: [
        { label: "Keep dry", icon: Droplets },
        { label: "Do not tip", icon: Ban },
        { label: "Forklift only", icon: Forklift },
      ],
    },
    weight: "15,900 kg",
    eta: "Awaiting Release",
    etaMeta: "Warehouse",
    status: "On Hold",
    progress: 25,
    mode: "sea",
    routeType: "ship",
    transportNumber: "MV PRI-77",
  },
  {
    id: "SDA-15-2415",
    customer: customerAccounts.skyTrack,
    origin: {
      display: "Medan",
      country: "Indonesia",
      countryCode: "ID",
      coordinates: [98.6741623, 3.5894617],
    },
    destination: {
      display: "Pekanbaru",
      country: "Indonesia",
      countryCode: "ID",
      coordinates: [101.4515727, 0.5262455],
    },
    cargo: "Beverage Stock",
    handling: {
      label: "Standard palletized freight",
      note: "Keep pallets upright and prevent carton crush during road transfer.",
      tags: [
        { label: "Keep upright", icon: ArrowUp },
        { label: "Do not stack", icon: Ban },
        { label: "Standard handoff", icon: PackageCheck },
      ],
    },
    weight: "4,500 kg",
    eta: "03:30 PM",
    etaMeta: "Today",
    status: "Scheduled",
    progress: 16,
    mode: "land",
    routeType: "road",
    transportNumber: "BK 4520 RA",
  },
  {
    id: "SDA-16-2416",
    customer: customerAccounts.regionalRoadExpress,
    origin: {
      display: "BOM Airport",
      country: "India",
      countryCode: "IN",
      coordinates: [72.8638223, 19.0901376],
    },
    destination: {
      display: "DEL Airport",
      country: "India",
      countryCode: "IN",
      coordinates: [77.0847985, 28.5553942],
    },
    cargo: "Auto Components",
    handling: {
      label: "Industrial parts",
      note: "Secure crates and inspect pallet straps before final handoff.",
      tags: [
        { label: "Secure load", icon: ShieldCheck },
        { label: "Forklift only", icon: Forklift },
        { label: "Inspect on arrival", icon: CheckCircle2 },
      ],
    },
    weight: "780 kg",
    eta: "04:10 PM",
    etaMeta: "Today",
    status: "Out for Delivery",
    progress: 84,
    mode: "air",
    routeType: "flight",
    transportNumber: "AI-864",
  },
  {
    id: "SDA-17-2417",
    customer: customerAccounts.logisticsPlus,
    origin: {
      display: "Rotterdam Port",
      country: "Netherlands",
      countryCode: "NL",
      coordinates: [4.4298268, 51.904333],
    },
    destination: {
      display: "Hamburg Port",
      country: "Germany",
      countryCode: "DE",
      coordinates: [9.9118353, 53.5279971],
    },
    cargo: "Packaging Materials",
    handling: {
      label: "Standard freight",
      note: "Keep pallets dry and verify pallet count at discharge.",
      tags: [
        { label: "Keep dry", icon: Droplets },
        { label: "Count on arrival", icon: CheckCircle2 },
        { label: "Standard handoff", icon: PackageCheck },
      ],
    },
    weight: "21,300 kg",
    eta: "Next Week",
    etaMeta: "Tuesday",
    status: "In Transit",
    progress: 62,
    mode: "sea",
    routeType: "ship",
    transportNumber: "MV HAM-902",
  },
  {
    id: "SDA-18-2418",
    customer: customerAccounts.transvirtual,
    origin: {
      display: "Ho Chi Minh City",
      country: "Vietnam",
      countryCode: "VN",
      coordinates: [106.7166008, 10.7737261],
    },
    destination: {
      display: "Da Nang",
      country: "Vietnam",
      countryCode: "VN",
      coordinates: [108.212, 16.068],
    },
    cargo: "Household Appliances",
    handling: {
      label: "Fragile bulky goods",
      note: "Use two-person handling and keep appliances upright until delivery.",
      tags: [
        { label: "Keep upright", icon: ArrowUp },
        { label: "Do not stack", icon: Ban },
        { label: "Two-person lift", icon: Truck },
      ],
    },
    weight: "2,060 kg",
    eta: "11:40 AM",
    etaMeta: "Delivered Today",
    status: "Delivered",
    progress: 100,
    mode: "land",
    routeType: "road",
    transportNumber: "51C-208.44",
  },
  {
    id: "SDA-19-2419",
    customer: customerAccounts.maersk,
    origin: {
      display: "DXB Airport",
      country: "United Arab Emirates",
      countryCode: "AE",
      coordinates: [55.3666519, 25.2515424],
    },
    destination: {
      display: "JED Airport",
      country: "Saudi Arabia",
      countryCode: "SA",
      coordinates: [39.1634852, 21.6839754],
    },
    cargo: "Temperature Controlled Goods",
    handling: {
      label: "Temperature controlled",
      note: "Maintain temperature range and escalate delay exceptions immediately.",
      tags: [
        { label: "Temperature log", icon: Thermometer },
        { label: "Keep upright", icon: ArrowUp },
        { label: "Escalate delay", icon: AlertTriangleIcon },
      ],
    },
    weight: "1,120 kg",
    eta: "10:50 PM",
    etaMeta: "Tonight",
    status: "Delayed",
    progress: 47,
    mode: "air",
    routeType: "flight",
    transportNumber: "SV-591",
  },
  {
    id: "SDA-20-2420",
    customer: customerAccounts.freightView,
    origin: {
      display: "Nhava Sheva Port",
      country: "India",
      countryCode: "IN",
      coordinates: [72.952661, 18.9470339],
    },
    destination: {
      display: "Colombo Port",
      country: "Sri Lanka",
      countryCode: "LK",
      coordinates: [79.8564409, 6.9646289],
    },
    cargo: "Steel Coils",
    handling: {
      label: "Heavy bulk cargo",
      note: "Use coil cradles and confirm lashings before release.",
      tags: [
        { label: "Heavy lift", icon: Forklift },
        { label: "Secure load", icon: ShieldCheck },
        { label: "Do not tip", icon: Ban },
      ],
    },
    weight: "31,800 kg",
    eta: "06:00 AM",
    etaMeta: "Thursday",
    status: "Scheduled",
    progress: 14,
    mode: "sea",
    routeType: "ship",
    transportNumber: "MV COL-620",
  },
  {
    id: "SDA-21-2421",
    customer: customerAccounts.piedPiper,
    origin: {
      display: "Chiang Mai",
      country: "Thailand",
      countryCode: "TH",
      coordinates: [98.9858802, 18.7882778],
    },
    destination: {
      display: "Bangkok",
      country: "Thailand",
      countryCode: "TH",
      coordinates: [100.4935089, 13.7524938],
    },
    cargo: "Furniture",
    handling: {
      label: "Fragile bulky goods",
      note: "Use blanket wrap and avoid stacking on finished surfaces.",
      tags: [
        { label: "Do not stack", icon: Ban },
        { label: "Keep dry", icon: Droplets },
        { label: "Two-person lift", icon: Truck },
      ],
    },
    weight: "5,240 kg",
    eta: "08:20 AM",
    etaMeta: "Tomorrow",
    status: "In Transit",
    progress: 58,
    mode: "land",
    routeType: "road",
    transportNumber: "กท 8842",
  },
  {
    id: "SDA-22-2422",
    customer: customerAccounts.techCorp,
    origin: {
      display: "KIX Airport",
      country: "Japan",
      countryCode: "JP",
      coordinates: [135.222523, 34.4342045],
    },
    destination: {
      display: "TPE Airport",
      country: "Taiwan",
      countryCode: "TW",
      coordinates: [121.2345977, 25.0793174],
    },
    cargo: "Precision Tools",
    handling: {
      label: "High-value precision cargo",
      note: "Keep locked case sealed pending security clearance.",
      tags: [
        { label: "Security hold", icon: ShieldCheck },
        { label: "Seal intact", icon: ShieldCheck },
        { label: "Signature required", icon: PenLine },
      ],
    },
    weight: "430 kg",
    eta: "Pending",
    etaMeta: "Security",
    status: "On Hold",
    progress: 29,
    mode: "air",
    routeType: "flight",
    transportNumber: "BR-129",
  },
  {
    id: "SDA-23-2423",
    customer: customerAccounts.maersk,
    origin: {
      display: "Port of Singapore",
      country: "Singapore",
      countryCode: "SG",
      coordinates: [103.7566, 1.2788],
    },
    destination: {
      display: "Port Klang",
      country: "Malaysia",
      countryCode: "MY",
      coordinates: [101.3913589, 2.9996963],
    },
    cargo: "Chemicals",
    handling: {
      label: "Hazardous materials review",
      note: "Hold pending hazardous materials review and port clearance.",
      tags: [
        { label: "Hazmat review", icon: Flame },
        { label: "Keep upright", icon: ArrowUp },
        { label: "Restricted handling", icon: ShieldCheck },
      ],
    },
    weight: "18,600 kg",
    eta: "Departing",
    etaMeta: "02:50 PM",
    status: "Scheduled",
    progress: 19,
    mode: "sea",
    routeType: "ship",
    transportNumber: "MV PKG-315",
  },
  {
    id: "SDA-24-2424",
    customer: customerAccounts.shippingEasy,
    origin: {
      display: "Bandar Lampung",
      country: "Indonesia",
      countryCode: "ID",
      coordinates: [105.2643742, -5.4460713],
    },
    destination: {
      display: "Jakarta",
      country: "Indonesia",
      countryCode: "ID",
      coordinates: [106.827168, -6.1754049],
    },
    cargo: "Fresh Produce",
    handling: {
      label: "Perishable goods",
      note: "Prioritize same-day handoff and keep produce ventilated.",
      tags: [
        { label: "Perishable", icon: Thermometer },
        { label: "Ventilated hold", icon: PackageCheck },
        { label: "Inspect on arrival", icon: CheckCircle2 },
      ],
    },
    weight: "970 kg",
    eta: "06:20 PM",
    etaMeta: "Delivered Today",
    status: "Delivered",
    progress: 100,
    mode: "land",
    routeType: "road",
    transportNumber: "BE 1745 YU",
  },
];

export const shipmentDetails = [
  { icon: Package, label: "Cargo", value: "Electronics" },
  { icon: Weight, label: "Weight", value: "2,450 kg" },
  { icon: BriefcaseBusiness, label: "Container", value: "40ft HC" },
  { icon: Truck, label: "Reference", value: "PO-88472" },
  { icon: ThermometerSun, label: "Temperature", value: "18°C" },
] as const;

export const shipmentTimeline = [
  { label: "Booked", time: "May 12, 07:20 AM", place: "Jakarta, IDN", done: true, active: false },
  { label: "Packed", time: "May 12, 07:30 AM", place: "Cirebon, IDN", done: true, active: false },
  { label: "Transit", time: "May 12, 09:15 AM", place: "Semarang, IDN", done: false, active: true },
  { label: "Ground", time: "May 12, 12:10 PM", place: "Singapore, SGP", done: false, active: false },
  { label: "Delivered", time: "-", place: "Singapore, SGP", done: false, active: false },
] as const;

export type RouteStopStatus = "completed" | "active" | "pending" | "delayed";
export type TransportModeType = "air" | "land" | "sea";

export type RouteStop = {
  location: string;
  country: string;
  transportDetail: string;
  arrivalMode?: TransportModeType;
  arrivalTime: string;
  departureTime?: string;
  status: RouteStopStatus;
  distanceFromPrev?: string;
  durationFromPrev: number;
};

export type RouteData = {
  shipmentId: string;
  stops: RouteStop[];
};

export type CargoItem = {
  id: string;
  description: string;
  quantity: number;
  unit: string;
  weight: string;
  dimensions: string;
  hazmat: boolean;
  containerRef: string;
};

export type DocumentStatus = "approved" | "pending" | "rejected";

export type ShipmentDocument = {
  id: string;
  name: string;
  type: string;
  reference: string;
  status: DocumentStatus;
  issuedDate: string;
  expiryDate: string | null;
  fileUrl: string;
};

export type ActivityEvent = {
  id: string;
  timestamp: string;
  event: string;
  location: string;
  actor: string;
  note: string;
};

const routeData: Record<string, RouteData> = {
  "SDA-01-2401": {
    shipmentId: "SDA-01-2401",
    stops: [
      { location: "Soekarno-Hatta International Airport (CGK)", country: "Indonesia", transportDetail: "Truck C-112 → Cargo Terminal 2", arrivalMode: "land", arrivalTime: "Jul 02, 06:30 AM", departureTime: "Jul 02, 07:15 AM", status: "completed", distanceFromPrev: "0", durationFromPrev: 0 },
      { location: "Cargo Terminal 2 — CGK", country: "Indonesia", transportDetail: "Security screening & palletization", arrivalMode: "land", arrivalTime: "Jul 02, 07:30 AM", departureTime: "Jul 02, 08:10 AM", status: "completed", distanceFromPrev: "3", durationFromPrev: 40 },
      { location: "Changi International Airport (SIN)", country: "Singapore", transportDetail: "Flight GA-884 (Airbus A330-300)", arrivalMode: "air", arrivalTime: "Jul 02, 10:45 AM", departureTime: "Jul 02, 11:30 AM", status: "active", distanceFromPrev: "890", durationFromPrev: 155 },
      { location: "SIN Cargo Clearance Hub", country: "Singapore", transportDetail: "Customs inspection & release", arrivalMode: "land", arrivalTime: "Jul 02, 12:00 PM", status: "pending", distanceFromPrev: "2", durationFromPrev: 30 },
    ],
  },
  "SDA-02-2402": {
    shipmentId: "SDA-02-2402",
    stops: [
      { location: "Surabaya Industrial Warehouse", country: "Indonesia", transportDetail: "Forklift loading — B 9042 KX", arrivalMode: "land", arrivalTime: "Jul 01, 08:00 AM", departureTime: "Jul 01, 09:30 AM", status: "completed", distanceFromPrev: "0", durationFromPrev: 0 },
      { location: "Surabaya Outer Ring Road", country: "Indonesia", transportDetail: "Road transport via Trans-Java Toll", arrivalMode: "land", arrivalTime: "Jul 01, 10:15 AM", departureTime: "Jul 01, 11:00 AM", status: "completed", distanceFromPrev: "15", durationFromPrev: 45 },
      { location: "Mojokerto Weigh Station", country: "Indonesia", transportDetail: "Weight check & cargo inspection", arrivalMode: "land", arrivalTime: "Jul 01, 12:30 PM", departureTime: "Jul 01, 01:15 PM", status: "completed", distanceFromPrev: "48", durationFromPrev: 90 },
      { location: "Semarang Logistics Hub", country: "Indonesia", transportDetail: "Unloading at warehouse bay #4", arrivalMode: "land", arrivalTime: "Jul 02, 09:45 AM", departureTime: "Jul 02, 10:30 AM", status: "delayed", distanceFromPrev: "310", durationFromPrev: 510 },
    ],
  },
};

const cargoData: Record<string, CargoItem[]> = {
  "SDA-01-2401": [
    { id: "PKG-001", description: "Smartphones — Model X Pro", quantity: 500, unit: "units", weight: "250 kg", dimensions: "120×80×60 cm", hazmat: false, containerRef: "ULD-AY-8841" },
    { id: "PKG-002", description: "Tablets — Model Tab S", quantity: 200, unit: "units", weight: "180 kg", dimensions: "100×70×50 cm", hazmat: false, containerRef: "ULD-AY-8841" },
    { id: "PKG-003", description: "Laptop Batteries (Li-ion)", quantity: 50, unit: "boxes", weight: "320 kg", dimensions: "80×60×40 cm", hazmat: true, containerRef: "ULD-AY-8842" },
    { id: "PKG-004", description: "USB-C Accessory Kits", quantity: 1000, unit: "units", weight: "700 kg", dimensions: "140×100×80 cm", hazmat: false, containerRef: "ULD-AY-8843" },
  ],
  "SDA-02-2402": [
    { id: "PKG-005", description: "CNC Milling Machine Base", quantity: 1, unit: "unit", weight: "4,200 kg", dimensions: "300×180×220 cm", hazmat: false, containerRef: "Flat Rack FR-202" },
    { id: "PKG-006", description: "Hydraulic Press Assembly", quantity: 1, unit: "unit", weight: "2,800 kg", dimensions: "250×150×190 cm", hazmat: false, containerRef: "Flat Rack FR-202" },
    { id: "PKG-007", description: "Steel Shafts (set of 12)", quantity: 2, unit: "bundles", weight: "1,120 kg", dimensions: "400×30×30 cm", hazmat: false, containerRef: "Flat Rack FR-203" },
  ],
};

const documentData: Record<string, ShipmentDocument[]> = {
  "SDA-01-2401": [
    { id: "doc-001", name: "Air Waybill", type: "Transport", reference: "AWB-784-2910-3847", status: "approved", issuedDate: "Jul 01, 2026", expiryDate: null, fileUrl: "#" },
    { id: "doc-002", name: "Commercial Invoice", type: "Customs", reference: "INV-2026-4471", status: "approved", issuedDate: "Jun 30, 2026", expiryDate: null, fileUrl: "#" },
    { id: "doc-003", name: "Packing List", type: "Customs", reference: "PL-2026-4471", status: "approved", issuedDate: "Jun 30, 2026", expiryDate: null, fileUrl: "#" },
    { id: "doc-004", name: "Certificate of Origin", type: "Compliance", reference: "COO-ID-2026-8912", status: "pending", issuedDate: "Jul 02, 2026", expiryDate: "Dec 31, 2026", fileUrl: "#" },
    { id: "doc-005", name: "Dangerous Goods Declaration", type: "Compliance", reference: "DGD-8841-2026", status: "approved", issuedDate: "Jul 01, 2026", expiryDate: null, fileUrl: "#" },
  ],
  "SDA-02-2402": [
    { id: "doc-006", name: "Consignment Note (CMR)", type: "Transport", reference: "CMR-ID-2026-3302", status: "approved", issuedDate: "Jul 01, 2026", expiryDate: null, fileUrl: "#" },
    { id: "doc-007", name: "Commercial Invoice", type: "Customs", reference: "INV-2026-4492", status: "approved", issuedDate: "Jun 30, 2026", expiryDate: null, fileUrl: "#" },
    { id: "doc-008", name: "Packing List", type: "Customs", reference: "PL-2026-4492", status: "pending", issuedDate: "Jul 01, 2026", expiryDate: null, fileUrl: "#" },
    { id: "doc-009", name: "Insurance Certificate", type: "Insurance", reference: "INS-2026-7712", status: "rejected", issuedDate: "Jul 01, 2026", expiryDate: "Jan 01, 2027", fileUrl: "#" },
  ],
};

const activityData: Record<string, ActivityEvent[]> = {
  "SDA-01-2401": [
    { id: "act-001", timestamp: "Jul 02, 08:10 AM", event: "Palletized and loaded onto aircraft", location: "CGK Airport, Terminal 2", actor: "Ground crew GA-884", note: "ULD-AY-8841 through 8843 secured in forward hold. Weight distribution verified." },
    { id: "act-002", timestamp: "Jul 02, 07:45 AM", event: "Security clearance completed", location: "CGK Airport, Cargo Security", actor: "Aviation Security Unit", note: "X-ray and trace detection passed. No anomalies found." },
    { id: "act-003", timestamp: "Jul 02, 07:15 AM", event: "Cargo delivered to airline terminal", location: "CGK Airport, Cargo Terminal 2", actor: "Courier — Budi S.", note: "Drop-off completed. AWB verified and cargo accepted by Garuda cargo desk." },
    { id: "act-004", timestamp: "Jul 02, 06:30 AM", event: "Shipment created", location: "TechCorp Warehouse, Jakarta", actor: "Shipper — TechCorp", note: "All packages scanned and manifest generated." },
  ],
  "SDA-02-2402": [
    { id: "act-005", timestamp: "Jul 02, 08:00 AM", event: "Driver reported mechanical issue", location: "Mojokerto Rest Area", actor: "Driver — H. Prasetyo", note: "Check engine light on. Inspection underway — estimated 3h delay." },
    { id: "act-006", timestamp: "Jul 01, 01:15 PM", event: "Weight inspection passed", location: "Mojokerto Weigh Station", actor: "Dishub Inspector", note: "Total GVW 14,280 kg. Within legal limits. Axle loads balanced." },
    { id: "act-007", timestamp: "Jul 01, 09:30 AM", event: "Cargo loaded and secured", location: "Surabaya Industrial Warehouse", actor: "Warehouse Team Lead — Rina W.", note: "All machinery crates strapped and load distribution verified." },
    { id: "act-008", timestamp: "Jul 01, 07:45 AM", event: "Vehicle arrived at pickup location", location: "Surabaya Industrial Warehouse", actor: "Driver — H. Prasetyo", note: "Vehicle B 9042 KX arrived for loading." },
    { id: "act-009", timestamp: "Jul 01, 06:00 AM", event: "Dispatch confirmed", location: "Logistics Plus Dispatch Center", actor: "Dispatcher — S. Tan", note: "Route assigned: Surabaya → Semarang via Trans-Java Toll." },
  ],
};

export function getRouteForShipment(shipmentId: string): RouteData | undefined {
  return routeData[shipmentId];
}

export function getCargoForShipment(shipmentId: string): CargoItem[] {
  return cargoData[shipmentId] ?? [];
}

export function getDocumentsForShipment(shipmentId: string): ShipmentDocument[] {
  return documentData[shipmentId] ?? [];
}

export function getActivityForShipment(shipmentId: string): ActivityEvent[] {
  return activityData[shipmentId] ?? [];
}
