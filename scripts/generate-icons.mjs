import Jimp from 'jimp';
import pngToIco from 'png-to-ico';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const root = path.resolve(__dirname, '..');
const src = path.join(root, 'public', 'logo.png');
const out192 = path.join(root, 'public', 'logo-192.png');
const out512 = path.join(root, 'public', 'logo-512.png');
const icoPath = path.join(root, 'public', 'favicon.ico');

async function run() {
  if (!fs.existsSync(src)) {
    console.error('Source logo not found at', src);
    process.exit(1);
  }

  const img = await Jimp.read(src);

  await img.clone().contain(512, 512, Jimp.HORIZONTAL_ALIGN_CENTER | Jimp.VERTICAL_ALIGN_MIDDLE).write(out512);
  await img.clone().contain(192, 192, Jimp.HORIZONTAL_ALIGN_CENTER | Jimp.VERTICAL_ALIGN_MIDDLE).write(out192);

  const buf64 = await img.clone().contain(64, 64, Jimp.HORIZONTAL_ALIGN_CENTER | Jimp.VERTICAL_ALIGN_MIDDLE).toBuffer(Jimp.MIME_PNG);
  const buf48 = await img.clone().contain(48, 48, Jimp.HORIZONTAL_ALIGN_CENTER | Jimp.VERTICAL_ALIGN_MIDDLE).toBuffer(Jimp.MIME_PNG);
  const buf32 = await img.clone().contain(32, 32, Jimp.HORIZONTAL_ALIGN_CENTER | Jimp.VERTICAL_ALIGN_MIDDLE).toBuffer(Jimp.MIME_PNG);
  const buf16 = await img.clone().contain(16, 16, Jimp.HORIZONTAL_ALIGN_CENTER | Jimp.VERTICAL_ALIGN_MIDDLE).toBuffer(Jimp.MIME_PNG);

  const icoBuf = await pngToIco([buf64, buf48, buf32, buf16]);
  fs.writeFileSync(icoPath, icoBuf);

  console.log('Generated:', out512, out192, icoPath);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
