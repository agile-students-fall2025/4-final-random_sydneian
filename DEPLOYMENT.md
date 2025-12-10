# Deployment Guide for DigitalOcean Droplet

## Prerequisites

1. A DigitalOcean droplet (Ubuntu 22.04 LTS recommended)
2. Domain name pointed to your droplet's IP (optional but recommended)
3. SSH access to your droplet

## Initial Droplet Setup

### 1. Connect to your droplet

```bash
ssh root@your_droplet_ip
```

### 2. Update system packages

```bash
apt update && apt upgrade -y
```

### 3. Install Docker

```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Start Docker service
systemctl start docker
systemctl enable docker

# Verify installation
docker --version
```

### 4. Install Docker Compose

```bash
# Install Docker Compose
apt install docker-compose-plugin -y

# Verify installation
docker compose version
```

### 5. Install Git

```bash
apt install git -y
```

### 6. Create a non-root user (optional but recommended)

```bash
adduser deploy
usermod -aG sudo deploy
usermod -aG docker deploy
```

## Application Deployment

### 1. Clone your repository

```bash
# If using non-root user
su - deploy

# Clone the repository
git clone https://github.com/your-username/random_sydneian.git
cd random_sydneian/4-final-random_sydneian
```

### 2. Set up environment variables

```bash
# Create backend .env file
cp back-end/.env.template back-end/.env
nano back-end/.env
```

Fill in your production environment variables:
- Database credentials
- API keys
- JWT secrets
- AWS S3 credentials (if using)
- Email service credentials

```bash
# Create frontend .env file (if needed)
cp front-end/.env.template front-end/.env
nano front-end/.env
```

### 3. Build and start the containers

```bash
# Build and start in detached mode
docker compose up -d --build

# Check if containers are running
docker compose ps

# View logs
docker compose logs -f
```

### 4. Verify deployment

```bash
# Check backend health
curl http://localhost:8000/api/health

# Check frontend
curl http://localhost:80
```

## Firewall Configuration

### Set up UFW firewall

```bash
# Enable UFW
ufw --force enable

# Allow SSH (important!)
ufw allow 22/tcp

# Allow HTTP
ufw allow 80/tcp

# Allow HTTPS (for future SSL setup)
ufw allow 443/tcp

# Check status
ufw status
```

## SSL/HTTPS Setup (Optional but Recommended)

### Using Let's Encrypt with Certbot

```bash
# Install Certbot
apt install certbot python3-certbot-nginx -y

# Stop containers temporarily
cd ~/random_sydneian/4-final-random_sydneian
docker compose down

# Obtain SSL certificate
certbot certonly --standalone -d yourdomain.com -d www.yourdomain.com

# Update nginx configuration (see SSL section below)
```

### Update nginx.conf for SSL

Add this server block to `front-end/nginx.conf`:

```nginx
server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers on;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512;

    # ... rest of your nginx config
}

server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    return 301 https://$server_name$request_uri;
}
```

Update docker-compose.yml to mount SSL certificates:

```yaml
frontend:
  volumes:
    - /etc/letsencrypt:/etc/letsencrypt:ro
  ports:
    - "80:80"
    - "443:443"
```

## Maintenance Commands

### View logs

```bash
# All services
docker compose logs -f

# Specific service
docker compose logs -f backend
docker compose logs -f frontend
```

### Restart services

```bash
# Restart all
docker compose restart

# Restart specific service
docker compose restart backend
```

### Update application

```bash
# Pull latest code
git pull origin main

# Rebuild and restart
docker compose up -d --build

# Clean up old images
docker image prune -f
```

### Stop services

```bash
docker compose down
```

### Database backup (if using a database)

```bash
# Example for MongoDB
docker compose exec backend mongodump --out /backup

# Example for PostgreSQL
docker compose exec backend pg_dump -U postgres dbname > backup.sql
```

## Monitoring

### Check resource usage

```bash
# System resources
htop

# Docker stats
docker stats

# Disk usage
df -h
docker system df
```

### Set up automatic restarts

The `restart: unless-stopped` policy in docker-compose.yml ensures containers restart automatically after system reboots or crashes.

## Troubleshooting

### Containers not starting

```bash
# Check logs
docker compose logs

# Check if ports are already in use
netstat -tulpn | grep :80
netstat -tulpn | grep :8000

# Remove and rebuild
docker compose down
docker compose up -d --build --force-recreate
```

### Out of disk space

```bash
# Clean up Docker
docker system prune -a --volumes

# Check disk usage
df -h
```

### Backend can't connect to database

- Verify database credentials in `.env`
- Check if database service is running
- Verify network connectivity

## Security Best Practices

1. **Regular Updates**: Keep system and Docker updated
2. **Firewall**: Use UFW to restrict access
3. **Non-root User**: Run applications as non-root user
4. **Environment Variables**: Never commit `.env` files
5. **SSL/TLS**: Use HTTPS in production
6. **Monitoring**: Set up logging and monitoring
7. **Backups**: Regular database and file backups

## Performance Optimization

1. **Enable swap** if your droplet has limited RAM:
```bash
fallocate -l 2G /swapfile
chmod 600 /swapfile
mkswap /swapfile
swapon /swapfile
echo '/swapfile none swap sw 0 0' | tee -a /etc/fstab
```

2. **Monitor resource usage** and upgrade droplet if needed

3. **Enable Docker logging limits** (already configured in docker-compose.yml)

## Support

For issues or questions:
- Check application logs: `docker compose logs`
- Check system logs: `journalctl -xe`
- Review DigitalOcean droplet metrics in the dashboard
