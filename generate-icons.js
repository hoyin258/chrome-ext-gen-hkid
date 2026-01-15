const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

const sizes = [16, 48, 128];

const generateIcon = (size) => {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');

  // Background color - blue (#007bff)
  ctx.fillStyle = '#007bff';
  ctx.beginPath();
  ctx.roundRect(0, 0, size, size, size * 0.125);
  ctx.fill();

  // Card shape
  const cardPadding = size * 0.15;
  const cardWidth = size - (cardPadding * 2);
  const cardHeight = size * 0.45;
  const cardY = (size - cardHeight) / 2;

  ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
  ctx.beginPath();
  ctx.roundRect(cardPadding, cardY, cardWidth, cardHeight, size * 0.03);
  ctx.fill();

  // HK text
  ctx.fillStyle = '#007bff';
  ctx.font = `bold ${size * 0.22}px Arial`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('HK', size / 2, size / 2);

  // Decorative line
  const lineY = size / 2 + size * 0.1;
  const lineWidth = cardWidth * 0.8;
  ctx.strokeStyle = '#007bff';
  ctx.lineWidth = size * 0.015;
  ctx.beginPath();
  ctx.moveTo((size - lineWidth) / 2, lineY);
  ctx.lineTo((size + lineWidth) / 2, lineY);
  ctx.stroke();

  // Save PNG
  const buffer = canvas.toBuffer('image/png');
  const iconPath = path.join(__dirname, 'icons', `icon${size}.png`);
  fs.writeFileSync(iconPath, buffer);
  console.log(`Created ${iconPath}`);
};

sizes.forEach(generateIcon);
console.log('All icons generated successfully!');