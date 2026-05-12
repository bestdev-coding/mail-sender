# Mail Sender

Automatically send emails to contacts from JSON files using Gmail.

## Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Gmail Configuration

1. Go to [Google Account Security](https://myaccount.google.com/apppasswords)
2. Select "Mail" and "Windows Computer" (or your OS)
3. Google will generate a 16-character app password
4. Copy this password

### 3. Set Environment Variables

**Windows (Command Prompt):**
```cmd
set GMAIL_USER=your-email@gmail.com
set GMAIL_APP_PASSWORD=your-16-char-password
```

**Windows (PowerShell):**
```powershell
$env:GMAIL_USER="your-email@gmail.com"
$env:GMAIL_APP_PASSWORD="your-16-char-password"
```

**Linux/Mac:**
```bash
export GMAIL_USER=your-email@gmail.com
export GMAIL_APP_PASSWORD=your-16-char-password
```

### 4. Run the Script
```bash
npm start
```

## Features

- ✅ Reads all JSON files from the `mails/` folder
- ✅ Filters emails by allowed domains:
  - gmail.com
  - yahoo.com
  - outlook.com
  - hotmail.com
  - aol.com
- ✅ Removes duplicate emails
- ✅ Sends emails via Gmail
- ✅ Provides detailed logging

## Customization

Edit `index.js` to customize:
- `EMAIL_SUBJECT` - Email subject line
- `EMAIL_BODY` - Email content
- `ALLOWED_DOMAINS` - Allowed email domains

## Important Notes

⚠️ **Security**: Never commit your credentials to version control. Use environment variables only.

⚠️ **Rate Limiting**: Gmail has sending limits. The script will respect these limits automatically.

⚠️ **Duplicates**: The script automatically removes duplicate emails across all JSON files.
