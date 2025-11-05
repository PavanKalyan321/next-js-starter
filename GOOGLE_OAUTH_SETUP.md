# Google OAuth Setup Guide

This application uses Google OAuth for authentication. Follow these steps to set up Google OAuth for your DevPortal application.

## Step 1: Create a Google Cloud Project

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Click on the project dropdown at the top
3. Click "New Project"
4. Enter a project name (e.g., "DevPortal")
5. Click "Create"

## Step 2: Enable Google+ API

1. In your Google Cloud project, go to "APIs & Services" → "Library"
2. Search for "Google+ API"
3. Click on it and press "Enable"

## Step 3: Configure OAuth Consent Screen

1. Go to "APIs & Services" → "OAuth consent screen"
2. Select "External" user type (unless you have a Google Workspace)
3. Click "Create"

### Fill in the required fields:

**App Information:**
- App name: `DevPortal`
- User support email: Your email address
- App logo: (Optional) Upload your logo

**App Domain:**
- Application home page: `http://localhost:3002` (for development)
- Application privacy policy link: (Optional)
- Application terms of service link: (Optional)

**Authorized Domains:**
- Add `localhost` for development
- Add your production domain when deploying

**Developer Contact Information:**
- Email addresses: Your email

4. Click "Save and Continue"

### Scopes:
5. Click "Add or Remove Scopes"
6. Add these scopes:
   - `.../auth/userinfo.email`
   - `.../auth/userinfo.profile`
   - `openid`
7. Click "Update" then "Save and Continue"

### Test Users:
8. Click "Add Users"
9. Add your Gmail address and any other test users
10. Click "Save and Continue"

## Step 4: Create OAuth 2.0 Credentials

1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth client ID"
3. Select "Web application"

**Configure the OAuth Client:**

- **Application Name**: DevPortal Web Client

- **Authorized JavaScript Origins**: Add these URLs:
  ```
  http://localhost:3002
  http://localhost:3000
  https://yourdomain.com  (for production)
  ```

- **Authorized Redirect URIs**: Add these URLs:
  ```
  http://localhost:3002/api/auth/callback/google
  http://localhost:3000/api/auth/callback/google
  https://yourdomain.com/api/auth/callback/google  (for production)
  ```

4. Click "Create"

## Step 5: Copy Your Credentials

After creating the OAuth client, you'll see a popup with your credentials:

- **Client ID**: Looks like `123456789-abcdefgh.apps.googleusercontent.com`
- **Client Secret**: Looks like `GOCSPX-1234567890abcdefgh`

Copy both of these values.

## Step 6: Update Your `.env.local` File

Open `c:\Work\next-js-starter\.env.local` and update the following variables:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000

# NextAuth Configuration
AUTH_SECRET=your-secret-key-change-this-in-production
AUTH_TRUST_HOST=true

# Google OAuth Credentials (from Google Cloud Console)
GOOGLE_CLIENT_ID=your-actual-client-id-here
GOOGLE_CLIENT_SECRET=your-actual-client-secret-here
```

### Generate a Secure AUTH_SECRET

Run this command to generate a secure secret:

**On Windows (PowerShell):**
```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**On macOS/Linux:**
```bash
openssl rand -base64 32
```

Copy the output and paste it as your `AUTH_SECRET` value.

## Step 7: Restart Your Development Server

After updating the `.env.local` file:

1. Stop the current dev server (Ctrl+C)
2. Start it again:
   ```bash
   npm run dev
   ```

## Step 8: Test the Login

1. Navigate to http://localhost:3002
2. You should be redirected to the login page
3. Click "Sign in with Google"
4. Select your Google account
5. Grant permissions when prompted
6. You should be redirected to the dashboard

## Troubleshooting

### Error: "redirect_uri_mismatch"
- Make sure the redirect URI in Google Console exactly matches: `http://localhost:3002/api/auth/callback/google`
- Check the port number - if your app is running on a different port, update it

### Error: "Access blocked: This app's request is invalid"
- Make sure you've added your email as a test user in the OAuth consent screen
- Verify that Google+ API is enabled

### Login redirects to `/api/auth/error`
- Check that your `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are correct
- Make sure there are no extra spaces or quotes in your `.env.local` file
- Verify `AUTH_SECRET` is set

### Changes not taking effect
- Restart the dev server after modifying `.env.local`
- Clear browser cookies for localhost
- Try in an incognito/private window

## Production Deployment

When deploying to production:

1. **Update OAuth Credentials in Google Console:**
   - Add your production domain to Authorized JavaScript Origins
   - Add `https://yourdomain.com/api/auth/callback/google` to Authorized Redirect URIs

2. **Update Environment Variables:**
   ```env
   AUTH_SECRET=generate-a-new-secure-secret-for-production
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   NEXTAUTH_URL=https://yourdomain.com
   ```

3. **Publish OAuth App** (if needed):
   - Go to OAuth consent screen
   - Click "Publish App" if you want users outside your test users to access it
   - Note: You may need to go through Google's verification process for production apps

## Security Best Practices

1. **Never commit `.env.local` to Git** - It's already in `.gitignore`
2. **Use different OAuth clients** for development and production
3. **Rotate secrets regularly** in production
4. **Monitor usage** in Google Cloud Console
5. **Set up proper CORS** and security headers in production

## Restricting Access

To allow only specific Google accounts:

1. In `src/auth.ts`, add an authorization callback:

```typescript
callbacks: {
  async signIn({ user, account, profile }) {
    const allowedEmails = [
      'your-email@gmail.com',
      'another-allowed@gmail.com'
    ]

    if (user.email && allowedEmails.includes(user.email)) {
      return true
    }

    return false // Reject sign in
  },
},
```

2. This will prevent unauthorized users from logging in, even if they have a Google account.

## Support

If you encounter issues:
- Check the [NextAuth.js Documentation](https://next-auth.js.org/)
- Review [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- Check browser console for error messages
- Review server logs in your terminal

---

**Your DevPortal is now secured with Google OAuth authentication!**
