# Cloud Storage Setup Guide

This app uses **Digital Ocean Spaces** (S3-compatible storage) to store uploaded files. This guide will help you set it up.

## Why Digital Ocean Spaces?

- **Affordable**: $5/month for 250 GB storage + 1 TB bandwidth
- **S3-Compatible**: Works with AWS SDK
- **CDN Included**: Files are served via CDN for fast access
- **Simple**: Easy to set up and manage
- **Integrated**: Works seamlessly with Digital Ocean App Platform

---

## Setup Digital Ocean Spaces

### Step 1: Create a Space

1. **Login to Digital Ocean**: https://cloud.digitalocean.com/
2. **Navigate to Spaces**: Click "Spaces" in the left sidebar
3. **Create a Space**:
   - Click "Create a Space"
   - **Region**: Choose closest to your users (e.g., NYC3, SFO3)
   - **Name**: `devportal-files` (or any name you prefer)
   - **Enable CDN**: Yes (recommended)
   - **File Listing**: Restricted (recommended for security)
   - Click "Create a Space"

### Step 2: Generate API Keys

1. **Navigate to API**: Click "API" in the left sidebar
2. **Scroll to "Spaces Keys"** section
3. **Generate New Key**:
   - Click "Generate New Key"
   - **Name**: `devportal-app`
   - Copy both:
     - **Access Key** (looks like: `DO00XXXXXXXXXXXXX`)
     - **Secret Key** (looks like: `XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX`)
   - ⚠️ **Important**: Save these securely - you can't view the secret key again!

### Step 3: Configure Environment Variables

Your `.env.local` file is already configured with your credentials:

```bash
# Cloud Storage Configuration
STORAGE_ENDPOINT=https://blr1.digitaloceanspaces.com
STORAGE_REGION=us-east-1
STORAGE_ACCESS_KEY=DO00NYKK38BF9LTNTBX6
STORAGE_SECRET_KEY=tUw43ctE4UrNlJADPJNtxfiMgqNYgG9DHSYVsOf2opA
STORAGE_BUCKET=devportal-files
```

**Your Space URLs:**
- **Origin Endpoint**: https://devportal-files.blr1.digitaloceanspaces.com
- **CDN Endpoint**: https://devportal-files.blr1.cdn.digitaloceanspaces.com
- **Region**: BLR1 (Bangalore, India)

**Other Region Endpoints (if you need to change):**
- NYC3: `https://nyc3.digitaloceanspaces.com`
- SFO3: `https://sfo3.digitaloceanspaces.com`
- AMS3: `https://ams3.digitaloceanspaces.com`
- SGP1: `https://sgp1.digitaloceanspaces.com`
- BLR1: `https://blr1.digitaloceanspaces.com`

### Step 4: Configure CORS (Important!)

To allow uploads from your web app, you need to configure CORS on your Space.

1. **Open your Space** in Digital Ocean dashboard
2. **Click "Settings" tab**
3. **Scroll to "CORS Configurations"**
4. **Add CORS Rule**:

```json
{
  "AllowedOrigins": ["*"],
  "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
  "AllowedHeaders": ["*"],
  "MaxAgeSeconds": 3000
}
```

For production, replace `"*"` with your actual domain:
```json
{
  "AllowedOrigins": ["https://your-domain.com"],
  "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
  "AllowedHeaders": ["*"],
  "MaxAgeSeconds": 3000
}
```

### Step 5: Test the Setup

1. **Restart your development server**:
   ```bash
   npm run dev
   ```

2. **Login to your app**: http://localhost:3005

3. **Go to Code Vault**

4. **Upload a test file**:
   - Click "Upload ZIP"
   - Drag and drop a ZIP file
   - Click "Upload"

5. **Verify**:
   - File should upload successfully
   - Check your Digital Ocean Space - you should see the file in the `uploads/` folder
   - The file should be publicly accessible via the CDN URL

---

## Alternative: Use AWS S3

If you prefer AWS S3 instead of Digital Ocean Spaces:

### Setup AWS S3

1. **Create S3 Bucket**: https://s3.console.aws.amazon.com/s3/
   - Name: `devportal-files`
   - Region: Choose closest to users
   - **Uncheck** "Block all public access"

2. **Configure Bucket Policy** (for public read access):
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Sid": "PublicReadGetObject",
         "Effect": "Allow",
         "Principal": "*",
         "Action": "s3:GetObject",
         "Resource": "arn:aws:s3:::devportal-files/*"
       }
     ]
   }
   ```

3. **Create IAM User**:
   - Go to IAM → Users → Add User
   - Name: `devportal-app`
   - Access type: Programmatic access
   - Permissions: `AmazonS3FullAccess`
   - Save Access Key ID and Secret Access Key

4. **Configure CORS**:
   ```json
   [
     {
       "AllowedHeaders": ["*"],
       "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
       "AllowedOrigins": ["*"],
       "ExposeHeaders": []
     }
   ]
   ```

5. **Update Environment Variables**:
   ```bash
   STORAGE_ENDPOINT=https://s3.amazonaws.com
   STORAGE_REGION=us-east-1  # Your bucket region
   STORAGE_ACCESS_KEY=AKIAXXXXXXXXXXXXX
   STORAGE_SECRET_KEY=XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
   STORAGE_BUCKET=devportal-files
   ```

---

## Cost Comparison

### Digital Ocean Spaces
- **$5/month** flat rate
- Includes: 250 GB storage + 1 TB bandwidth
- CDN included
- Simple pricing

### AWS S3
- **Pay as you go**
- Storage: ~$0.023/GB/month
- Requests: ~$0.005 per 1,000 requests
- Transfer: ~$0.09/GB (first 10 TB)
- More expensive for small-medium apps

**Recommendation**: Use Digital Ocean Spaces for simpler pricing and built-in CDN.

---

## File URLs

After upload, files will be accessible at:

**Digital Ocean Spaces:**
```
https://devportal-files.nyc3.digitaloceanspaces.com/uploads/1234567890-filename.zip
```

With CDN (recommended):
```
https://devportal-files.nyc3.cdn.digitaloceanspaces.com/uploads/1234567890-filename.zip
```

**AWS S3:**
```
https://devportal-files.s3.amazonaws.com/uploads/1234567890-filename.zip
```

---

## Security Best Practices

1. **Never commit API keys** to Git (already in `.gitignore`)
2. **Use environment variables** for all credentials
3. **Restrict CORS origins** in production (use your domain, not `*`)
4. **Set bucket permissions** to restrict who can upload
5. **Enable CDN** for better performance and security
6. **Rotate keys** regularly for production apps

---

## Deployment Notes

When deploying to Digital Ocean App Platform:

1. **Add environment variables** in the app settings
2. **Use the same Spaces keys** (they're in the same region)
3. **Update CORS** to allow your production domain
4. **Files persist** even if you redeploy your app

---

## Troubleshooting

### Upload fails with CORS error
- Check CORS configuration in Spaces settings
- Ensure `AllowedOrigins` includes your domain
- Restart your app after updating CORS

### Upload fails with 403 Forbidden
- Verify your Access Key and Secret Key are correct
- Check the bucket name matches `STORAGE_BUCKET`
- Ensure the IAM user/key has write permissions

### Files not publicly accessible
- Check bucket policy allows public read
- Verify ACL is set to `public-read` in upload code
- Try accessing the file URL directly in browser

### Wrong endpoint/region
- Make sure `STORAGE_ENDPOINT` matches your Space region
- Check the URL in your Space dashboard

---

## Need Help?

- Digital Ocean Spaces Docs: https://docs.digitalocean.com/products/spaces/
- AWS S3 Docs: https://docs.aws.amazon.com/s3/
- Create an issue in your repo if you have questions
