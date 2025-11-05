# Authentication & File Upload Features

## New Features Added

### 1. Google OAuth Authentication ✅

**What was added:**
- NextAuth.js v5 (Auth.js) integration
- Google OAuth provider configuration
- Protected routes middleware
- Beautiful login page with Google sign-in button
- User profile display in top bar with avatar
- Logout functionality

**Key Files:**
- `src/auth.ts` - NextAuth configuration
- `src/middleware.ts` - Route protection middleware
- `src/app/login/page.tsx` - Login page with Google OAuth
- `src/app/api/auth/[...nextauth]/route.ts` - Auth API route
- `src/components/Topbar.tsx` & `src/components/TopbarClient.tsx` - Updated with user info
- `.env.local` - Environment variables for OAuth credentials

**How it works:**
1. All routes except `/login` are protected
2. Unauthenticated users are redirected to the login page
3. Users click "Sign in with Google"
4. After authentication, they're redirected to the dashboard
5. User's Google profile info (name, email, avatar) is displayed in the top bar
6. Users can logout from the profile dropdown

### 2. Drag-and-Drop File Upload 🎯

**What was added:**
- Reusable `FileUpload` component with drag-and-drop
- Visual feedback for drag events
- File validation (size, type)
- Multiple file support
- Upload progress indication
- Success/error messaging
- Integration in Projects and Vault pages

**Key Files:**
- `src/components/FileUpload.tsx` - Main upload component
- `src/app/projects/[id]/page.tsx` - Project-specific uploads
- `src/app/vault/page.tsx` - General file uploads

**Features:**
- ✅ Drag and drop files
- ✅ Click to browse files
- ✅ File type validation (ZIP only)
- ✅ File size validation (100MB max)
- ✅ Visual drag-over state
- ✅ File preview before upload
- ✅ Remove files from queue
- ✅ Upload multiple files
- ✅ Loading states
- ✅ Success/error feedback

**Where to upload:**
1. **Projects Detail Page** (`/projects/[id]`)
   - Click "Upload Code ZIP" button
   - Drag-and-drop panel appears
   - Upload files specific to that project
   - Files appear in "Associated Files" section

2. **Code Vault Page** (`/vault`)
   - Click "Upload ZIP" button
   - Optional: Select a project to associate files with
   - Drag and drop multiple files
   - Files appear in the vault table

## Setup Instructions

### Before You Start

You need to set up Google OAuth credentials. Follow the detailed guide in:
**[GOOGLE_OAUTH_SETUP.md](GOOGLE_OAUTH_SETUP.md)**

### Quick Setup (Summary)

1. **Create Google OAuth Credentials:**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project
   - Enable Google+ API
   - Configure OAuth consent screen
   - Create OAuth 2.0 credentials
   - Add redirect URI: `http://localhost:3002/api/auth/callback/google`

2. **Update `.env.local`:**
   ```env
   # Generate a secure secret:
   # PowerShell: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   AUTH_SECRET=your-generated-secret-here

   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   ```

3. **Restart the dev server:**
   ```bash
   npm run dev
   ```

4. **Test the authentication:**
   - Navigate to http://localhost:3002
   - You'll be redirected to the login page
   - Click "Sign in with Google"
   - Login with your Google account
   - You're now authenticated!

## Usage Guide

### Authentication Flow

1. **First Visit**
   - App checks if you're authenticated
   - Not authenticated → Redirected to `/login`
   - Click "Sign in with Google"
   - Authorize the app
   - Redirected to dashboard

2. **Logged In**
   - Your Google profile photo/initials appear in top-right
   - Your name and email are displayed
   - Navigate freely through all pages
   - Click profile → Logout when done

### File Upload Flow

#### Uploading to a Specific Project:

1. Navigate to **Projects** page
2. Click on a project to view details
3. Click **"Upload Code ZIP"** button
4. Drag and drop your ZIP file(s) or click to browse
5. Review the files in the queue
6. Click **"Upload X file(s)"**
7. Wait for upload to complete
8. Files appear in the "Associated Files" section

#### Uploading to Code Vault:

1. Navigate to **Code Vault** page
2. Click **"Upload ZIP"** button
3. (Optional) Select a project to associate files with
4. Drag and drop your ZIP file(s) or click to browse
5. Review the files
6. Click **"Upload X file(s)"**
7. Files appear in the vault table

### File Upload Validations

- **File Type:** Only `.zip` files are accepted
- **File Size:** Maximum 100MB per file
- **Multiple Files:** Supported in Vault (not in project-specific upload)
- **Error Handling:** Clear error messages for validation failures

## Technical Details

### Dependencies Added

```json
{
  "next-auth": "^5.0.0-beta",
  "react-dropzone": "^14.x.x"
}
```

### NextAuth Configuration

**Authentication Method:** OAuth 2.0 with Google provider

**Session Strategy:** Database sessions (can be configured)

**Protected Routes:** All routes except `/login` and `/api/auth/*`

**Callbacks:**
- `authorized`: Checks if user is authenticated
- Can be extended to check specific email addresses

### File Upload Component API

```typescript
interface FileUploadProps {
  onUpload: (files: File[]) => Promise<void>
  accept?: Record<string, string[]>  // Default: ZIP only
  maxSize?: number                    // Default: 100MB
  multiple?: boolean                  // Default: false
  projectId?: number                  // Optional project association
}
```

**Usage Example:**
```typescript
<FileUpload
  onUpload={handleUpload}
  multiple={true}
  projectId={123}
/>
```

## Connecting to Your Backend

### Current State
- File uploads currently use mock implementation
- Files are added to local state for demonstration
- No actual API calls are made

### To Connect Real API:

1. **Update `src/lib/api.ts`:**
   Already has the `uploadFile` function ready:
   ```typescript
   uploadFile: async (file: File, projectId?: number) => {
     const formData = new FormData()
     formData.append('file', file)
     if (projectId) formData.append('project_id', String(projectId))

     return fetch(`${API_BASE_URL}/api/files/upload`, {
       method: 'POST',
       body: formData,
     }).then(res => res.json())
   }
   ```

2. **Update Upload Handlers:**

   **In Projects Detail Page:**
   ```typescript
   const handleUpload = async (uploadFiles: File[]) => {
     for (const file of uploadFiles) {
       await api.uploadFile(file, parseInt(id))
     }
     // Refresh file list
     const updatedFiles = await api.getFiles()
     setFiles(updatedFiles)
   }
   ```

   **In Vault Page:**
   ```typescript
   const handleUpload = async (uploadFiles: File[]) => {
     for (const file of uploadFiles) {
       await api.uploadFile(file)
     }
     // Refresh file list
     const updatedFiles = await api.getFiles()
     setFiles(updatedFiles)
   }
   ```

## Security Considerations

### Authentication
- ✅ All routes are protected by default
- ✅ Middleware validates session on every request
- ✅ Secure session storage
- ✅ CSRF protection built-in with NextAuth

### To Restrict to Specific Users:

Edit `src/auth.ts` and add allowed emails:

```typescript
callbacks: {
  async signIn({ user }) {
    const allowedEmails = [
      'your-email@gmail.com',
      'another-allowed@gmail.com'
    ]

    if (user.email && allowedEmails.includes(user.email)) {
      return true
    }

    return false // Reject sign-in
  },
},
```

### File Upload Security
- Client-side validation for file type and size
- Server-side validation should be implemented in your FastAPI backend
- Sanitize filenames on the server
- Scan files for viruses/malware
- Store files outside web root
- Use signed URLs for downloads

## Troubleshooting

### Authentication Issues

**"Missing Secret" Error:**
- Make sure `AUTH_SECRET` is set in `.env.local`
- Restart the dev server after adding it

**"redirect_uri_mismatch" Error:**
- Check redirect URI in Google Console matches exactly
- Verify the port number (3002 vs 3000)

**Can't login:**
- Add your email as a test user in Google Console
- Check that Google+ API is enabled
- Clear browser cookies and try in incognito mode

### Upload Issues

**Files not uploading:**
- Check browser console for errors
- Verify file is .zip format
- Check file size is under 100MB

**Drag and drop not working:**
- Make sure JavaScript is enabled
- Try clicking to browse files instead
- Check browser compatibility

## Next Steps

1. **Set up your Google OAuth credentials** (see GOOGLE_OAUTH_SETUP.md)
2. **Test the authentication flow**
3. **Test file uploads** in both Projects and Vault
4. **Connect to your FastAPI backend** for real uploads
5. **Deploy to production** (update OAuth settings for production domain)

---

**Your DevPortal now has secure Google authentication and drag-and-drop file uploads!** 🚀
