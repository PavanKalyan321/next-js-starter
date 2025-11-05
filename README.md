# DevPortal - Personal Developer Portal

A modern Next.js application for managing projects, code archives, ideas, and automation bots.

## Features

✅ **Authentication** - Secure login with hardcoded credentials
✅ **Projects Management** - Organize your development projects
✅ **Code Vault** - Upload and store ZIP code archives with cloud storage
✅ **Ideas Tracker** - Manage and prioritize development ideas
✅ **Bots Dashboard** - Monitor automation bots
✅ **Modern UI** - Beautiful, responsive design with Tailwind CSS
✅ **Protected Routes** - All routes require authentication
✅ **Cloud Storage** - Files saved to Digital Ocean Spaces (S3-compatible)

## Tech Stack

- **Framework**: Next.js 15.4.5 (App Router)
- **Authentication**: NextAuth.js v5
- **Styling**: Tailwind CSS 4
- **Storage**: Digital Ocean Spaces / AWS S3
- **File Upload**: React Dropzone
- **TypeScript**: Strict mode enabled

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Update `.env.local` with your credentials:

```bash
# Authentication
AUTH_SECRET=your-secret-key-here  # Generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
AUTH_TRUST_HOST=true

# Cloud Storage (see STORAGE_SETUP.md)
STORAGE_ENDPOINT=https://nyc3.digitaloceanspaces.com
STORAGE_REGION=us-east-1
STORAGE_ACCESS_KEY=your-spaces-access-key
STORAGE_SECRET_KEY=your-spaces-secret-key
STORAGE_BUCKET=devportal-files
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 4. Login

**Default Credentials:**
- Username: `pk`
- Password: `1122`

## Documentation

- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Deploy to Digital Ocean
- **[STORAGE_SETUP.md](STORAGE_SETUP.md)** - Setup cloud storage for file uploads

## Where Files Are Saved

Uploaded files are saved to **Digital Ocean Spaces** (or any S3-compatible storage):

- **Cloud Location**: `https://your-space.nyc3.digitaloceanspaces.com/uploads/`
- **CDN URL**: `https://your-space.nyc3.cdn.digitaloceanspaces.com/uploads/`
- Files persist permanently in cloud storage
- Accessible worldwide via CDN for fast delivery

See [STORAGE_SETUP.md](STORAGE_SETUP.md) for setup instructions.

## Deployment

### Deploy to Digital Ocean App Platform

1. Push code to GitHub
2. Connect to Digital Ocean App Platform
3. Add environment variables (see [DEPLOYMENT.md](DEPLOYMENT.md))
4. Deploy!

**Cost**: $5/month (app) + $5/month (storage) = **$10/month total**

See [DEPLOYMENT.md](DEPLOYMENT.md) for complete deployment guide.

## Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm start        # Start production server
npm run lint     # Run ESLint
```

## Security Features

- ✅ Protected routes with middleware
- ✅ Server-side authentication checks
- ✅ JWT session tokens
- ✅ File type validation (ZIP only)
- ✅ File size limits (100MB max)
- ✅ Cloud storage with CORS protection

## License

ISC
