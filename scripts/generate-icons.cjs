const fs = require('fs');
const { createCanvas } = require('canvas');
const path = require('path');

function createIcon(size, filename) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');

  // Background
  ctx.fillStyle = '#09090b';
  ctx.fillRect(0, 0, size, size);

  // Circuit board pattern
  ctx.strokeStyle = '#22d3ee';
  ctx.lineWidth = size / 20;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  
  const p = size / 10;

  ctx.beginPath();
  ctx.moveTo(p * 2, p * 5);
  ctx.lineTo(p * 4, p * 5);
  ctx.lineTo(p * 5, p * 4);
  ctx.lineTo(p * 7, p * 4);
  
  ctx.moveTo(p * 5, p * 4);
  ctx.lineTo(p * 6, p * 6);
  ctx.lineTo(p * 8, p * 6);

  ctx.stroke();

  // Nodes
  ctx.fillStyle = '#22d3ee';
  ctx.beginPath();
  ctx.arc(p * 2, p * 5, p / 1.5, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.arc(p * 7, p * 4, p / 1.5, 0, Math.PI * 2);
  ctx.fill();
  
  ctx.beginPath();
  ctx.arc(p * 8, p * 6, p / 1.5, 0, Math.PI * 2);
  ctx.fill();

  const buffer = canvas.toBuffer('image/png');
  const filepath = path.join(__dirname, '..', 'public', 'icons', filename);
  
  // ensure dir exists
  fs.mkdirSync(path.dirname(filepath), { recursive: true });
  fs.writeFileSync(filepath, buffer);
  
  // read back to verify
  const readBuffer = fs.readFileSync(filepath);
  const magic = readBuffer.subarray(0, 4).toString('hex');
  console.log(`Generated ${filename}. Magic bytes: ${magic}`);
}

createIcon(192, 'icon-192.png');
createIcon(512, 'icon-512.png');
