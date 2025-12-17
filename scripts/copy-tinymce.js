import fs from "fs";
import path from "path";

const root = process.cwd();
const src = path.join(root, "node_modules", "tinymce");
const dest = path.join(root, "public", "tinymce");

function copyRecursive(srcDir, destDir) {
  if (!fs.existsSync(srcDir)) {
    console.error(`Source not found: ${srcDir}`);
    process.exit(1);
  }

  fs.rmSync(destDir, { recursive: true, force: true });
  fs.mkdirSync(destDir, { recursive: true });

  const entries = fs.readdirSync(srcDir, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(srcDir, entry.name);
    const destPath = path.join(destDir, entry.name);

    if (entry.isDirectory()) {
      copyRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

try {
  console.log(`Copying TinyMCE from ${src} to ${dest} ...`);
  copyRecursive(src, dest);
  console.log("TinyMCE copied to public/tinymce");
} catch (err) {
  console.error("Failed to copy TinyMCE:", err);
  process.exit(1);
}
