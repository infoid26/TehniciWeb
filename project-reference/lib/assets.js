const fs = require('fs/promises');
const path = require('path');
const sass = require('sass');
const sharp = require('sharp');
// Build-time only: the web application serves the prepared files directly.
async function prepareAssets() {
  const publicFolder = path.join(__dirname, '../public');
  await fs.mkdir(path.join(publicFolder, 'css'), { recursive: true });
  const result = sass.compile(path.join(publicFolder, 'scss/site.scss'));
  await fs.writeFile(path.join(publicFolder, 'css/site.css'), result.css);
  for (const name of ['cake', 'tea', 'icecream']) {
    const source = path.join(publicFolder, 'images', name + '.svg');
    for (const width of [300, 600]) {
      await sharp(source).resize(width).webp().toFile(path.join(publicFolder, 'images', `${name}-${width}.webp`));
    }
  }
}
module.exports = { prepareAssets };
