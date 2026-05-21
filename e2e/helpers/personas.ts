import fs from "node:fs";
import path from "node:path";

export type PersonasFile = {
  apiBase: string;
  frontendBase: string;
  password: string;
  anonymous: { description: string };
  existingCitizen: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    displayName: string;
  };
  newCitizen: {
    emailPrefix: string;
    emailDomain: string;
    password: string;
    firstName: string;
    lastName: string;
  };
};

const DEFAULT_PERSONAS: PersonasFile = {
  apiBase: process.env.E2E_API_BASE_URL || "http://localhost:8000",
  frontendBase: process.env.E2E_BASE_URL || "http://localhost:3000",
  password: process.env.E2E_CITIZEN_PASSWORD || "E2eDemoPass123!",
  anonymous: { description: "Visitor without login" },
  existingCitizen: {
    email: "citizen.existing@bns-e2e.test",
    password: process.env.E2E_CITIZEN_PASSWORD || "E2eDemoPass123!",
    firstName: "E2E",
    lastName: "Existing",
    displayName: "E2E Existing Citizen",
  },
  newCitizen: {
    emailPrefix: "citizen.new",
    emailDomain: "bns-e2e.test",
    password: process.env.E2E_CITIZEN_PASSWORD || "E2eDemoPass123!",
    firstName: "E2E",
    lastName: "Newcomer",
  },
};

export function loadPersonas(): PersonasFile {
  const filePath = path.join(__dirname, "..", "personas.json");
  if (!fs.existsSync(filePath)) {
    return DEFAULT_PERSONAS;
  }
  const raw = JSON.parse(fs.readFileSync(filePath, "utf8")) as PersonasFile;
  return { ...DEFAULT_PERSONAS, ...raw };
}

export function uniqueNewEmail(personas: PersonasFile): string {
  const stamp = Date.now().toString(36);
  return `${personas.newCitizen.emailPrefix}.${stamp}@${personas.newCitizen.emailDomain}`;
}
