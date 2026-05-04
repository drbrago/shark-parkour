import fs from "fs";
import { PNG } from "pngjs";

const input = process.argv[2];
const output = process.argv[3];

if (!input || !output) {
  console.error("Usage: node scripts/magenta-to-alpha.js input.png output.png");
  process.exit(1);
}

const tolerance = Number(process.argv[4] ?? 80);

let removed = 0;
let total = 0;

fs.createReadStream(input)
  .pipe(new PNG())
  .on("parsed", function () {
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const idx = (this.width * y + x) << 2;

        const r = this.data[idx];
        const g = this.data[idx + 1];
        const b = this.data[idx + 2];

        total++;

        const isMagenta =
          r >= 180 && b >= 180 && g <= tolerance && Math.abs(r - b) <= 80;

        if (isMagenta) {
          this.data[idx + 3] = 0;
          removed++;
        }
      }
    }

    console.log(`Removed ${removed} / ${total} pixels as transparent`);

    this.pack().pipe(fs.createWriteStream(output));
  })
  .on("error", (err) => {
    console.error(err);
    process.exit(1);
  });
