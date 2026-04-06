# Gmail Setup for Contact Form Emails

## ⚙️ Setup Steps (Takes 5 minutes)

### Step 1: Enable 2-Factor Authentication
1. Go to [myaccount.google.com](https://myaccount.google.com)
2. Click "Security" in the left menu
3. Scroll down to "How you sign in to Google"
4. Enable "2-Step Verification" if not already enabled

### Step 2: Create an App Password
1. Go to [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
2. If you don't see "App passwords":
   - Make sure 2-Step Verification is enabled
   - Select app: **Mail**
   - Select device: **Windows Computer** (or your OS)
3. Google will generate a 16-character password
4. Copy this password

### Step 3: Add to Environment Variables
1. Open `.env.local` at the project root
2. Add this line:
```
GMAIL_APP_PASSWORD=xxxx xxxx xxxx xxxx
```
3. (Replace with the 16-character password Google gave you)
4. Save the file

### Step 4: Restart Dev Server
```bash
npm run dev
```

## ✅ Done!
Users can now fill out the contact form and emails will be sent to `meyaarjewellers@gmail.com`

## Features
- ✅ Email sent to meyaarjewellers@gmail.com with full contact details
- ✅ Reply-To field set to user's email (so you can reply directly)
- ✅ Automatic confirmation email sent to the user
- ✅ HTML formatted emails with styling

## Troubleshooting

**Issue: "Less secure app access is turned on"**
- This is expected and safe - the app password is separate from your Gmail password
- You can disable it after setup if desired

**Issue: Email not sending**
- Check that `GMAIL_APP_PASSWORD` is set correctly
- Server logs will show "Email service not configured" if variable is missing
- Restart dev server after adding the variable

**Issue: Gmail blocking the connection**
- This is rare but if it happens:
  - Go to [myaccount.google.com/u/0/security-checkup](https://myaccount.google.com/u/0/security-checkup)
  - Allow access from less secure apps (temporarily check this)

## Security Notes
- App passwords are isolated from your main Gmail password
- They work only with Gmail SMTP
- Never commit `.env.local` to git (it's in `.gitignore`)
