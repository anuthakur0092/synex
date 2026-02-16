const fs = require('fs');
const path = require('path');

// Check if sharp is available, if not, provide installation instructions
let sharp;
try {
  sharp = require('sharp');
} catch (error) {
  console.error('❌ Sharp is not installed. Please run: npm install sharp');
  console.error('Then run this script again: node generate-icons.js');
  process.exit(1);
}

const sourceImage = 'src/assets/logo.png';

// Android icon sizes (in pixels)
const androidSizes = [
  { dir: 'mipmap-mdpi', size: 48 },
  { dir: 'mipmap-hdpi', size: 72 },
  { dir: 'mipmap-xhdpi', size: 96 },
  { dir: 'mipmap-xxhdpi', size: 144 },
  { dir: 'mipmap-xxxhdpi', size: 192 },
];

// iOS icon sizes (in pixels) - calculated from size@scale
const iosSizes = [
  { filename: 'AppIcon-20@2x.png', size: 40 }, // 20x20@2x
  { filename: 'AppIcon-20@3x.png', size: 60 }, // 20x20@3x
  { filename: 'AppIcon-29@2x.png', size: 58 }, // 29x29@2x
  { filename: 'AppIcon-29@3x.png', size: 87 }, // 29x29@3x
  { filename: 'AppIcon-40@2x.png', size: 80 }, // 40x40@2x
  { filename: 'AppIcon-40@3x.png', size: 120 }, // 40x40@3x
  { filename: 'AppIcon-60@2x.png', size: 120 }, // 60x60@2x
  { filename: 'AppIcon-60@3x.png', size: 180 }, // 60x60@3x
  { filename: 'AppIcon-1024.png', size: 1024 }, // 1024x1024@1x
];

// Function to create a circular mask
async function createCircularMask(size) {
  const r = size / 2;
  const svgCircle = `
    <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <circle cx="${r}" cy="${r}" r="${r}" fill="white"/>
    </svg>
  `;

  return sharp(Buffer.from(svgCircle)).resize(size, size).png().toBuffer();
}

async function generateIcons() {
  console.log('🚀 Starting icon generation...');

  // Check if source image exists
  if (!fs.existsSync(sourceImage)) {
    console.error(`❌ Source image not found: ${sourceImage}`);
    process.exit(1);
  }

  console.log(`📱 Source image: ${sourceImage}`);

  // Get source image info
  const sourceInfo = await sharp(sourceImage).metadata();
  console.log(
    `📏 Source dimensions: ${sourceInfo.width}x${sourceInfo.height}px`,
  );

  if (sourceInfo.width < 1024 || sourceInfo.height < 1024) {
    console.warn(
      '⚠️  Warning: Source image is smaller than 1024x1024px. Consider using a larger image for better quality.',
    );
  }

  // Generate Android icons
  console.log('\n🤖 Generating Android icons...');
  for (const { dir, size } of androidSizes) {
    const outputDir = `android/app/src/main/res/${dir}`;

    // Create directory if it doesn't exist
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Generate ic_launcher.png (regular square icon)
    const launcherPath = path.join(outputDir, 'ic_launcher.png');
    await sharp(sourceImage)
      .resize(size, size, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 0 },
      })
      .png()
      .toFile(launcherPath);

    // Generate ic_launcher_round.png (circular icon)
    const roundPath = path.join(outputDir, 'ic_launcher_round.png');

    try {
      // Create circular mask
      const mask = await createCircularMask(size);

      // Create the resized logo first
      const resizedLogo = await sharp(sourceImage)
        .resize(size, size, {
          fit: 'contain',
          background: { r: 255, g: 255, b: 255, alpha: 0 },
        })
        .png()
        .toBuffer();

      // Apply circular mask
      await sharp(resizedLogo)
        .composite([{ input: mask, blend: 'dest-in' }])
        .png()
        .toFile(roundPath);
    } catch (error) {
      // Fallback: just copy the regular icon as round icon
      console.warn(
        `  ⚠️  Could not create circular icon for ${dir}, using square icon instead`,
      );
      await sharp(sourceImage)
        .resize(size, size, {
          fit: 'contain',
          background: { r: 255, g: 255, b: 255, alpha: 0 },
        })
        .png()
        .toFile(roundPath);
    }

    console.log(`  ✅ Generated ${dir}: ${size}x${size}px`);
  }

  // Generate iOS icons
  console.log('\n🍎 Generating iOS icons...');
  const iosOutputDir = 'ios/YoexWallet/Images.xcassets/AppIcon.appiconset';

  if (!fs.existsSync(iosOutputDir)) {
    fs.mkdirSync(iosOutputDir, { recursive: true });
  }

  for (const { filename, size } of iosSizes) {
    const outputPath = path.join(iosOutputDir, filename);

    await sharp(sourceImage)
      .resize(size, size, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 0 },
      })
      .png()
      .toFile(outputPath);

    console.log(`  ✅ Generated ${filename}: ${size}x${size}px`);
  }

  // Update iOS Contents.json
  console.log('\n📝 Updating iOS Contents.json...');
  const contentsJson = {
    images: [
      {
        filename: 'AppIcon-20@2x.png',
        idiom: 'iphone',
        scale: '2x',
        size: '20x20',
      },
      {
        filename: 'AppIcon-20@3x.png',
        idiom: 'iphone',
        scale: '3x',
        size: '20x20',
      },
      {
        filename: 'AppIcon-29@2x.png',
        idiom: 'iphone',
        scale: '2x',
        size: '29x29',
      },
      {
        filename: 'AppIcon-29@3x.png',
        idiom: 'iphone',
        scale: '3x',
        size: '29x29',
      },
      {
        filename: 'AppIcon-40@2x.png',
        idiom: 'iphone',
        scale: '2x',
        size: '40x40',
      },
      {
        filename: 'AppIcon-40@3x.png',
        idiom: 'iphone',
        scale: '3x',
        size: '40x40',
      },
      {
        filename: 'AppIcon-60@2x.png',
        idiom: 'iphone',
        scale: '2x',
        size: '60x60',
      },
      {
        filename: 'AppIcon-60@3x.png',
        idiom: 'iphone',
        scale: '3x',
        size: '60x60',
      },
      {
        filename: 'AppIcon-1024.png',
        idiom: 'ios-marketing',
        scale: '1x',
        size: '1024x1024',
      },
    ],
    info: {
      author: 'xcode',
      version: 1,
    },
  };

  fs.writeFileSync(
    path.join(iosOutputDir, 'Contents.json'),
    JSON.stringify(contentsJson, null, 2),
  );

  console.log('  ✅ Updated Contents.json');

  console.log('\n🎉 Icon generation completed successfully!');
  console.log('\n📋 Next steps:');
  console.log('1. Clean and rebuild your project:');
  console.log('   Android: cd android && ./gradlew clean && cd ..');
  console.log('   iOS: cd ios && xcodebuild clean && cd ..');
  console.log('2. Run your app:');
  console.log('   npx react-native run-android');
  console.log('   npx react-native run-ios');
  console.log('\n💡 Your logo is now set as the app icon for both platforms!');
}

// Handle errors
generateIcons().catch(error => {
  console.error('❌ Error generating icons:', error);
  process.exit(1);
});
