const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

async function testChromeProfile() {
  // Create a dedicated profile directory for Puppeteer
  const userDataDir = path.join(__dirname, 'puppeteer-profile');
  
  // Ensure the directory exists
  if (!fs.existsSync(userDataDir)) {
    fs.mkdirSync(userDataDir, { recursive: true });
  }

  const browser = await puppeteer.launch({ 
    headless: false,
    executablePath: '/Users/marcbowen_1/.cache/puppeteer/chrome/mac_arm-138.0.7204.92/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing',
    userDataDir: userDataDir,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-extensions',
      '--disable-plugins'
    ]
  });
  
  const page = await browser.newPage();
  
  try {
    console.log('Testing Chrome profile...');
    console.log('Profile directory:', userDataDir);
    console.log('Browser window is open. Complete any setup/sign-in, then press Enter in this terminal to continue...');
    
    // Wait for user input before proceeding
    await new Promise(resolve => {
      process.stdin.once('data', () => {
        resolve();
      });
    });
    
    // Test with a simple website first
    console.log('Testing with google.com...');
    await page.goto('https://www.google.com', { waitUntil: 'networkidle2', timeout: 30000 });
    console.log('✅ Google loaded successfully');
    
    // Wait a bit
    await page.waitForTimeout(2000);
    
    // Test with DXSummit
    console.log('Testing with DXSummit...');
    await page.goto('http://www.dxsummit.fi/', { waitUntil: 'networkidle2', timeout: 30000 });
    console.log('✅ DXSummit loaded successfully');
    
    // Take a screenshot
    await page.screenshot({ path: 'test-profile-success.png' });
    console.log('Screenshot saved as test-profile-success.png');
    
    console.log('Tests completed. Browser will close in 10 seconds...');
    await page.waitForTimeout(10000);
    
  } catch (err) {
    console.error('❌ Error testing profile:', err.message);
    try {
      await page.screenshot({ path: 'test-profile-error.png' });
      console.log('Error screenshot saved as test-profile-error.png');
    } catch (screenshotErr) {
      console.log('Could not take error screenshot:', screenshotErr.message);
    }
    
    console.log('Browser will stay open for 30 seconds so you can investigate...');
    await page.waitForTimeout(30000);
  } finally {
    await browser.close();
  }
}

if (require.main === module) {
  testChromeProfile();
} 