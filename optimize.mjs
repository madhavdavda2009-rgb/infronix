import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const files = ['hero_bg.png', 'trust_bg.png', 'testimonial.png', 'web-log.png'];
const publicDir = path.join(process.cwd(), 'public');

if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir);
}

async function optimizeImages() {
  for (const file of files) {
    const inputPath = path.join(process.cwd(), file);
    if (fs.existsSync(inputPath)) {
      const name = path.parse(file).name;
      const outputPath = path.join(publicDir, `${name}.webp`);

      console.log(`Optimizing ${file}...`);
      await sharp(inputPath)
        .webp({ quality: 75, effort: 6 }) // aggressive compression for Lighthouse
        .toFile(outputPath);
      console.log(`Saved ${outputPath}`);

      // Also move original to public just in case
      fs.copyFileSync(inputPath, path.join(publicDir, file));
    }
  }
}

optimizeImages().catch(console.error);
