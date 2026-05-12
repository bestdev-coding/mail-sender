const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

// Configuration
const ALLOWED_DOMAINS = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'aol.com'];
const GMAIL_USER = process.env.GMAIL_USER || 'your-email@gmail.com';
const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD || 'your-app-password';

// Email message configuration
const EMAIL_SUBJECT = 'Hello from Mail Sender';
const EMAIL_BODY = 'This is an automated email. Please do not reply.';

/**
 * Check if email domain is allowed
 */
function isAllowedDomain(email) {
  const domain = email.split('@')[1]?.toLowerCase();
  return ALLOWED_DOMAINS.includes(domain);
}

/**
 * Extract emails from JSON file
 */
function extractEmailsFromFile(filePath) {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    const contacts = JSON.parse(data);
    
    if (!Array.isArray(contacts)) {
      console.warn(`[${path.basename(filePath)}] File does not contain an array`);
      return [];
    }

    return contacts
      .map(contact => contact.Email)
      .filter(email => email && typeof email === 'string')
      .filter(isAllowedDomain);
  } catch (error) {
    console.error(`[${path.basename(filePath)}] Error reading file: ${error.message}`);
    return [];
  }
}

/**
 * Get all JSON files from mails folder
 */
function getJsonFiles(mailsDir) {
  try {
    const files = fs.readdirSync(mailsDir);
    return files
      .filter(file => path.extname(file).toLowerCase() === '.json')
      .map(file => path.join(mailsDir, file));
  } catch (error) {
    console.error(`Error reading mails directory: ${error.message}`);
    return [];
  }
}

/**
 * Send emails
 */
async function sendEmails() {
  console.log('🚀 Starting mail sender...\n');

  // Validate credentials
  if (GMAIL_USER === 'your-email@gmail.com' || GMAIL_APP_PASSWORD === 'your-app-password') {
    console.error('❌ Error: Please set GMAIL_USER and GMAIL_APP_PASSWORD environment variables');
    console.log('\nTo set up:');
    console.log('1. Go to https://myaccount.google.com/apppasswords');
    console.log('2. Generate an App Password for Mail');
    console.log('3. Set environment variables:');
    console.log('   set GMAIL_USER=your-email@gmail.com');
    console.log('   set GMAIL_APP_PASSWORD=your-16-char-password');
    process.exit(1);
  }

  // Create transporter
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: GMAIL_USER,
      pass: GMAIL_APP_PASSWORD
    }
  });

  // Test connection
  try {
    await transporter.verify();
    console.log('✅ Gmail connection verified\n');
  } catch (error) {
    console.error('❌ Gmail connection failed:', error.message);
    process.exit(1);
  }

  // Get all JSON files and extract emails
  const mailsDir = path.join(__dirname, 'mails');
  const jsonFiles = getJsonFiles(mailsDir);
  let allEmails = [];

  console.log(`📁 Found ${jsonFiles.length} JSON file(s)\n`);

  for (const filePath of jsonFiles) {
    const emails = extractEmailsFromFile(filePath);
    console.log(`📄 ${path.basename(filePath)}: Found ${emails.length} allowed email(s)`);
    allEmails = allEmails.concat(emails);
  }

  // Remove duplicates
  allEmails = [...new Set(allEmails)];

  console.log(`\n📧 Total unique emails to send: ${allEmails.length}\n`);

  if (allEmails.length === 0) {
    console.log('⚠️  No valid emails found. Exiting.');
    return;
  }

  // Send emails
  let successCount = 0;
  let failureCount = 0;

  for (const email of allEmails) {
    try {
      await transporter.sendMail({
        from: GMAIL_USER,
        to: email,
        subject: EMAIL_SUBJECT,
        text: EMAIL_BODY,
        html: `<p>${EMAIL_BODY}</p>`
      });
      console.log(`✅ Email sent to: ${email}`);
      successCount++;
    } catch (error) {
      console.error(`❌ Failed to send email to ${email}: ${error.message}`);
      failureCount++;
    }
  }

  console.log(`\n📊 Summary:`);
  console.log(`   ✅ Successful: ${successCount}`);
  console.log(`   ❌ Failed: ${failureCount}`);
  console.log(`   📧 Total: ${allEmails.length}`);
}

// Run the script
sendEmails().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
