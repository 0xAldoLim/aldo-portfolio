import { copyFile, mkdir, stat } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const source = path.join(root, "Aldo-Lim-Saputra-CV.pdf");
const destination = path.join(root, "public", "Aldo-Lim-Saputra-CV.pdf");

async function exists(file) {
  try { return (await stat(file)).isFile(); } catch { return false; }
}

if (await exists(source)) {
  await mkdir(path.dirname(destination), { recursive: true });
  await copyFile(source, destination);
  process.stdout.write("CV copied to public/Aldo-Lim-Saputra-CV.pdf\n");
} else if (await exists(destination)) {
  process.stdout.write("CV is available in public/Aldo-Lim-Saputra-CV.pdf\n");
} else {
  process.stdout.write("CV not found. The download control will remain hidden.\n");
}
