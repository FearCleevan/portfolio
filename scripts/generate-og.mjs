import sharp from 'sharp';
import { readFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

const profilePath = resolve(root, 'public/profile.png');
const outputPath = resolve(root, 'public/og-image.png');

const W = 1200;
const H = 630;

// Circle geometry — must match SVG circle element below
const CX = 950;
const CY = 290;
const R = 185;
const D = R * 2; // 370px diameter

const techBadges = ['React', 'Node.js', 'TypeScript', 'Supabase', 'React Native', 'MySQL'];
const badgeWidth = 110;
const badgeHeight = 36;
const badgeGap = 12;
const badgesPerRow = 3;

const badgeSvg = techBadges.map((label, i) => {
    const col = i % badgesPerRow;
    const row = Math.floor(i / badgesPerRow);
    const x = 72 + col * (badgeWidth + badgeGap);
    const y = 390 + row * (badgeHeight + 10);
    return `
    <rect x="${x}" y="${y}" width="${badgeWidth}" height="${badgeHeight}" rx="18"
          fill="#1e293b" stroke="#6366f1" stroke-width="1.5"/>
    <text x="${x + badgeWidth / 2}" y="${y + 23}" font-family="system-ui,-apple-system,sans-serif"
          font-size="13" fill="#a5b4fc" text-anchor="middle">${label}</text>`;
}).join('');

// Background SVG — no embedded images, just the circle border as a placeholder ring
const svg = `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg-grad" x1="0" y1="0" x2="${W}" y2="${H}" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#0f172a"/>
      <stop offset="100%" stop-color="#1e293b"/>
    </linearGradient>
    <linearGradient id="accent-grad" x1="0" y1="0" x2="${W}" y2="0" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#6366f1"/>
      <stop offset="100%" stop-color="#8b5cf6"/>
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="${W}" height="${H}" fill="url(#bg-grad)"/>

  <!-- Subtle decorative orbs -->
  <circle cx="120" cy="520" r="220" fill="#6366f1" opacity="0.04"/>
  <circle cx="1100" cy="80" r="180" fill="#8b5cf6" opacity="0.05"/>

  <!-- Top accent bar -->
  <rect x="0" y="0" width="${W}" height="6" fill="url(#accent-grad)"/>

  <!-- Profile circle border ring (image composited on top separately) -->
  <circle cx="${CX}" cy="${CY}" r="${R + 5}" fill="#1e293b" stroke="#6366f1" stroke-width="2"/>

  <!-- Name -->
  <text x="72" y="185" font-family="system-ui,-apple-system,BlinkMacSystemFont,sans-serif"
        font-size="58" font-weight="700" fill="#ffffff" letter-spacing="-0.5">Peter Paul Lazan</text>

  <!-- Title -->
  <text x="72" y="240" font-family="system-ui,-apple-system,sans-serif"
        font-size="24" fill="#94a3b8">Full-Stack Developer &amp; Mobile App DevOps</text>

  <!-- Divider -->
  <rect x="72" y="268" width="640" height="1" fill="#334155"/>

  <!-- Location -->
  <text x="72" y="310" font-family="system-ui,-apple-system,sans-serif"
        font-size="20" fill="#64748b">&#x25CF;  Davao City, Philippines</text>

  <!-- Available label -->
  <rect x="72" y="332" width="160" height="30" rx="15" fill="#14532d" opacity="0.8"/>
  <text x="152" y="352" font-family="system-ui,-apple-system,sans-serif"
        font-size="13" fill="#4ade80" text-anchor="middle">&#x2713; Available for hire</text>

  <!-- Tech badges -->
  ${badgeSvg}

  <!-- Portfolio URL -->
  <text x="72" y="585" font-family="system-ui,-apple-system,sans-serif"
        font-size="22" fill="#6366f1" opacity="0.9">lazandev.vercel.app</text>

  <!-- Bottom accent line -->
  <rect x="0" y="${H - 4}" width="${W}" height="4" fill="url(#accent-grad)"/>
</svg>`;

// Step 1: Render SVG background to PNG buffer
const bgBuffer = await sharp(Buffer.from(svg)).png().toBuffer();

const composites = [];

// Step 2: If profile exists, create circular-cropped version and composite it
if (existsSync(profilePath)) {
    // Circular mask SVG
    const circleMask = Buffer.from(
        `<svg width="${D}" height="${D}"><circle cx="${R}" cy="${R}" r="${R}" fill="white"/></svg>`
    );

    const profileCircular = await sharp(profilePath)
        .resize(D, D, { fit: 'cover', position: 'centre' })
        .composite([{ input: circleMask, blend: 'dest-in' }])
        .png()
        .toBuffer();

    composites.push({
        input: profileCircular,
        left: CX - R,   // 765
        top: CY - R,    // 105
    });
}

// Step 3: Composite profile onto background
await sharp(bgBuffer)
    .composite(composites)
    .png()
    .toFile(outputPath);

console.log('OG image generated:', outputPath);
