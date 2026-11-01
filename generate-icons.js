// Generate simple Arcadia PWA icons as PNG using canvas-free approach
// Creates minimal valid PNG files with the Arcadia brand colors

const fs = require('fs');
const path = require('path');

// Minimal PNG generator - creates a simple colored square with an "A" shape
function createMinimalPNG(size) {
  // We'll create a simple SVG and reference it, but for actual PNG we need a minimal valid PNG
  // Create a simple solid color PNG
  
  const bgR = 16, bgG = 15, bgB = 13; // #100F0D
  const goldR = 197, goldG = 164, goldB = 109; // #C5A46D
  
  // PNG signature
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  
  // IHDR chunk
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(size, 0); // width
  ihdrData.writeUInt32BE(size, 4); // height
  ihdrData[8] = 8; // bit depth
  ihdrData[9] = 2; // color type (RGB)
  ihdrData[10] = 0; // compression
  ihdrData[11] = 0; // filter
  ihdrData[12] = 0; // interlace
  
  const ihdrChunk = createChunk('IHDR', ihdrData);
  
  // IDAT chunk - create image data
  const rawData = [];
  const centerX = size / 2;
  const centerY = size / 2;
  const radius = size * 0.35;
  
  for (let y = 0; y < size; y++) {
    rawData.push(0); // filter byte (none)
    for (let x = 0; x < size; x++) {
      const dx = x - centerX;
      const dy = y - centerY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      // Draw a circle with "A" letterform hint
      if (dist < radius) {
        // Inside circle - create an "A" shape
        const relX = (x - centerX) / radius;
        const relY = (y - centerY) / radius;
        
        // Simple "A" shape detection
        const isA = (
          // Left leg
          (relX > -0.5 - (0.5 - relY) * 0.3 && relX < -0.3 - (0.5 - relY) * 0.3 && relY > -0.3 && relY < 0.6) ||
          // Right leg
          (relX < 0.5 + (0.5 - relY) * 0.3 && relX > 0.3 + (0.5 - relY) * 0.3 && relY > -0.3 && relY < 0.6) ||
          // Top connector
          (relY > -0.45 && relY < -0.25 && relX > -0.3 && relX < 0.3) ||
          // Crossbar
          (relY > 0.05 && relY < 0.2 && relX > -0.35 && relX < 0.35)
        );
        
        if (isA) {
          rawData.push(goldR, goldG, goldB);
        } else {
          // Dark circle background
          rawData.push(bgR + 12, bgG + 10, bgB + 8);
        }
      } else {
        rawData.push(bgR, bgG, bgB);
      }
    }
  }
  
  const rawBuffer = Buffer.from(rawData);
  
  // Compress with zlib
  const zlib = require('zlib');
  const compressed = zlib.deflateSync(rawBuffer);
  
  const idatChunk = createChunk('IDAT', compressed);
  
  // IEND chunk
  const iendChunk = createChunk('IEND', Buffer.alloc(0));
  
  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

function createChunk(type, data) {
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length, 0);
  
  const typeBuffer = Buffer.from(type, 'ascii');
  const crcData = Buffer.concat([typeBuffer, data]);
  
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(crcData), 0);
  
  return Buffer.concat([length, typeBuffer, data, crc]);
}

function crc32(buf) {
  let crc = 0xFFFFFFFF;
  for (let i = 0; i < buf.length; i++) {
    crc ^= buf[i];
    for (let j = 0; j < 8; j++) {
      if (crc & 1) {
        crc = (crc >>> 1) ^ 0xEDB88320;
      } else {
        crc >>>= 1;
      }
    }
  }
  return (crc ^ 0xFFFFFFFF) >>> 0;
}

// Generate icons
const iconsDir = path.join(__dirname, 'public', 'icons');

const sizes = [192, 512];
sizes.forEach(size => {
  const png = createMinimalPNG(size);
  fs.writeFileSync(path.join(iconsDir, `icon-${size}.png`), png);
  console.log(`Created icon-${size}.png (${png.length} bytes)`);
});

// Also create maskable version (same as 512 for now)
const maskable = createMinimalPNG(512);
fs.writeFileSync(path.join(iconsDir, 'icon-maskable-512.png'), maskable);
console.log(`Created icon-maskable-512.png (${maskable.length} bytes)`);

console.log('All PWA icons generated successfully!');

