# Digital Ocean Deployment Guide

This guide will help you deploy your Next.js application to Digital Ocean.

## Prerequisites

- Digital Ocean account
- Node.js 18+ installed locally
- Git repository (GitHub/GitLab)
- **Digital Ocean Spaces** for file storage (see [STORAGE_SETUP.md](STORAGE_SETUP.md))

## Option 1: Deploy with Digital Ocean App Platform (Recommended - Easiest)

### Step 1: Prepare Your Application

1. **Update package.json start script** (already configured):
   ```json
   "scripts": {
     "start": "node sammy.js; serve -s _static -l tcp://0.0.0.0:${PORT:-8080} -n"
   }
   ```

2. **Ensure environment variables are set** - Create `.env.production`:
   ```bash
   AUTH_SECRET=your-production-secret-here
   AUTH_TRUST_HOST=true
   ```

3. **Generate a secure AUTH_SECRET**:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

### Step 2: Push to Git Repository

```bash
git init
git add .
git commit -m "Initial commit - DevPortal app"
git branch -M main
git remote add origin https://github.com/yourusername/your-repo.git
git push -u origin main
```

### Step 3: Deploy on Digital Ocean App Platform

1. **Go to Digital Ocean Dashboard**:
   - Navigate to: https://cloud.digitalocean.com/apps

2. **Create New App**:
   - Click "Create App"
   - Select "GitHub" or "GitLab" as source
   - Authorize Digital Ocean to access your repository
   - Select your repository and branch (main)

3. **Configure Build Settings**:
   - **Build Command**: `npm run build`
   - **Run Command**: `npm start`
   - **Environment Variables** (Add all of these):
     - `AUTH_SECRET`: (generate with: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`)
     - `AUTH_TRUST_HOST`: `true`
     - `STORAGE_ENDPOINT`: `https://blr1.digitaloceanspaces.com`
     - `STORAGE_REGION`: `us-east-1`
     - `STORAGE_ACCESS_KEY`: `DO00NYKK38BF9LTNTBX6`
     - `STORAGE_SECRET_KEY`: `tUw43ctE4UrNlJADPJNtxfiMgqNYgG9DHSYVsOf2opA`
     - `STORAGE_BUCKET`: `devportal-files`

4. **Configure Resources**:
   - Select region (closest to your users)
   - Choose plan:
     - **Basic** ($5/month): For testing/small apps
     - **Professional** ($12/month): For production apps

5. **Deploy**:
   - Click "Next" → "Create Resources"
   - Wait for deployment (5-10 minutes)
   - Your app will be available at: `https://your-app-name.ondigitalocean.app`

### Step 4: Configure Custom Domain (Optional)

1. In your app dashboard, go to "Settings" → "Domains"
2. Add your custom domain
3. Update your DNS records as instructed by Digital Ocean

---

## Option 2: Deploy with Digital Ocean Droplet (Advanced)

### Step 1: Create a Droplet

1. **Create Droplet**:
   - Go to: https://cloud.digitalocean.com/droplets
   - Click "Create Droplet"
   - Choose **Ubuntu 22.04 LTS**
   - Select size: At least **Basic - $6/month (1GB RAM)**
   - Choose datacenter region
   - Add SSH key for authentication
   - Click "Create Droplet"

### Step 2: Connect to Your Droplet

```bash
ssh root@your-droplet-ip
```

### Step 3: Install Dependencies

```bash
# Update system
apt update && apt upgrade -y

# Install Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# Install PM2 (process manager)
npm install -g pm2

# Install Nginx
apt install -y nginx

# Install Git
apt install -y git
```

### Step 4: Clone and Setup Your Application

```bash
# Create application directory
mkdir -p /var/www
cd /var/www

# Clone your repository
git clone https://github.com/yourusername/your-repo.git app
cd app

# Install dependencies
npm install

# Create environment file
cat > .env.local << EOF
AUTH_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
AUTH_TRUST_HOST=true
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
EOF

# Build the application
npm run build
```

### Step 5: Configure PM2

```bash
# Start the application with PM2
pm2 start npm --name "devportal" -- start

# Save PM2 configuration
pm2 save

# Setup PM2 to start on system boot
pm2 startup systemd
# Run the command that PM2 outputs
```

### Step 6: Configure Nginx as Reverse Proxy

```bash
# Create Nginx configuration
cat > /etc/nginx/sites-available/devportal << 'EOF'
server {
    listen 80;
    server_name your-domain.com;  # Replace with your domain or IP

    location / {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF

# Enable the site
ln -s /etc/nginx/sites-available/devportal /etc/nginx/sites-enabled/

# Remove default site
rm /etc/nginx/sites-enabled/default

# Test Nginx configuration
nginx -t

# Restart Nginx
systemctl restart nginx
```

### Step 7: Setup SSL with Let's Encrypt (Optional but Recommended)

```bash
# Install Certbot
apt install -y certbot python3-certbot-nginx

# Get SSL certificate
certbot --nginx -d your-domain.com

# Certbot will automatically update Nginx configuration
```

### Step 8: Configure Firewall

```bash
# Allow SSH, HTTP, and HTTPS
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw enable
```

### Step 9: Setup Automatic Updates

```bash
# Create update script
cat > /root/update-app.sh << 'EOF'
#!/bin/bash
cd /var/www/app
git pull origin main
npm install
npm run build
pm2 restart devportal
EOF

chmod +x /root/update-app.sh
```

To update your app in the future:
```bash
ssh root@your-droplet-ip
/root/update-app.sh
```

---

## Post-Deployment Checklist

- [ ] Application is accessible via browser
- [ ] Login works with credentials (username: pk, password: 1122)
- [ ] All routes are protected (redirects to login when not authenticated)
- [ ] Drag and drop file upload works
- [ ] All pages load correctly (Projects, Vault, Ideas, Bots)
- [ ] Logout functionality works
- [ ] SSL certificate is active (https://)

---

## Monitoring and Maintenance

### For App Platform:
- Check logs: Digital Ocean Dashboard → Your App → Runtime Logs
- View metrics: Digital Ocean Dashboard → Your App → Insights

### For Droplet:
```bash
# View application logs
pm2 logs devportal

# View application status
pm2 status

# Restart application
pm2 restart devportal

# View Nginx error logs
tail -f /var/log/nginx/error.log

# View Nginx access logs
tail -f /var/log/nginx/access.log
```

---

## Troubleshooting

### Authentication Issues
1. Verify `AUTH_SECRET` is set in environment variables
2. Ensure `AUTH_TRUST_HOST=true` is set
3. Check that cookies are not being blocked

### Build Failures
1. Check Node.js version (should be 18+)
2. Clear node_modules and reinstall: `rm -rf node_modules package-lock.json && npm install`
3. Review build logs for specific errors

### Port Issues (Droplet only)
```bash
# Check what's running on port 8080
lsof -i :8080

# Check if PM2 is running
pm2 status

# Restart PM2
pm2 restart all
```

---

## Estimated Costs

### App Platform:
- **Basic**: $5/month (512 MB RAM, 1 vCPU)
- **Professional**: $12/month (1 GB RAM, 1 vCPU)

### Droplet:
- **Basic**: $6/month (1 GB RAM, 1 vCPU, 25 GB SSD)
- **Standard**: $12/month (2 GB RAM, 1 vCPU, 50 GB SSD)

---

## Support Resources

- Digital Ocean Documentation: https://docs.digitalocean.com/
- Next.js Deployment: https://nextjs.org/docs/deployment
- PM2 Documentation: https://pm2.keymetrics.io/docs/usage/quick-start/

---

## Quick Commands Reference

```bash
# App Platform deployment
git add . && git commit -m "Update" && git push origin main

# Droplet deployment
ssh root@your-ip
cd /var/www/app
git pull
npm install
npm run build
pm2 restart devportal
```
