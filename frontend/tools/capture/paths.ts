import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));

export const PUBLIC_WORK_ROOT = path.resolve(HERE, "../../public/work");
export const ARCHIVE_ROOT = path.resolve(HERE, "../../../assets-archive");
export const TODAY = new Date().toLocaleDateString("en-CA"); // local date as YYYY-MM-DD

export const LAUNCH_ARGS = [
  "--force-color-profile=srgb",
  "--hide-scrollbars",
  "--disable-blink-features=AutomationControlled",
];
