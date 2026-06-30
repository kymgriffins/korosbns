import { existsSync, mkdirSync, symlinkSync } from "fs";
import { join } from "path";
import { execSync } from "child_process";

const targetBase = join(process.cwd(), "apps/budgethub/src/app/(main)");
const linkBase = join(process.cwd(), "src/app/budgethub");
const dirs = ["dashboard", "auth", "chat", "mail", "reports", "unauthorized"];

if (!existsSync(linkBase)) {
  mkdirSync(linkBase, { recursive: true });
}

for (const dir of dirs) {
  const src = join(targetBase, dir);
  const dest = join(linkBase, dir);
  if (!existsSync(dest) && existsSync(src)) {
    try {
      if (process.platform === "win32") {
        execSync(`mklink /J "${dest}" "${src}"`, { stdio: "ignore" });
      } else {
        symlinkSync(src, dest);
      }
      console.log(`Linked ${dest} -> ${src}`);
    } catch {
      console.warn(`Failed to link ${dest}`);
    }
  }
}
