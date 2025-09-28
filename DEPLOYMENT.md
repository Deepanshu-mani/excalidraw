# ExcelDraw EC2 Deployment Guide

## 🚀 Complete Docker Deployment on EC2

This guide will help you deploy the entire ExcelDraw application on AWS EC2 using Docker containers.

## 📋 Prerequisites

- AWS EC2 instance (t3.micro for free tier)
- Ubuntu 22.04 LTS
- Security group with ports: 22, 80, 3000, 4000, 8080, 5432

## 🐳 Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   HTTP Server   │    │  WebSocket      │
│   (Next.js)     │    │   (Express)     │    │   Server        │
│   Port: 3000    │    │   Port: 4000    │    │   Port: 8080    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │   PostgreSQL    │
                    │   Database      │
                    │   Port: 5432    │
                    └─────────────────┘
```

## 🚀 Quick Deployment

### Step 1: Launch EC2 Instance
1. Go to AWS EC2 Console
2. Launch instance with Ubuntu 22.04 LTS
3. Configure security group with required ports
4. Connect via SSH

### Step 2: Run Deployment Script
```bash
# Make script executable
chmod +x deploy-ec2.sh

# Run deployment
./deploy-ec2.sh
```

### Step 3: Update Environment Variables
```bash
# Edit environment file
nano .env

# Update with your EC2 IP
NEXT_PUBLIC_HTTP_BACKEND=http://your-ec2-ip/api
NEXT_PUBLIC_WS_URL=ws://your-ec2-ip/ws
CORS_ORIGIN=http://your-ec2-ip
```

### Step 4: Restart Services
```bash
docker-compose down
docker-compose up -d
```

## 🔧 Manual Setup (Alternative)

### Install Docker
```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER
```

### Install Docker Compose
```bash
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

### Clone Repository
```bash
git clone https://github.com/Deepanshu-mani/exceldraw.git
cd exceldraw
```

### Start Services
```bash
docker-compose up --build -d
```

## 📊 Service Management

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f frontend
docker-compose logs -f http-server
docker-compose logs -f ws-server
```

### Restart Services
```bash
# All services
docker-compose restart

# Specific service
docker-compose restart frontend
```

### Update Application
```bash
git pull
docker-compose up --build -d
```

### Stop Services
```bash
docker-compose down
```

## 🔐 Security Configuration

### Generate JWT Secret
```bash
openssl rand -base64 32
```

### Update Database Password
```bash
# Edit docker-compose.yml
# Change POSTGRES_PASSWORD
# Update DATABASE_URL in all services
```

## 📈 Monitoring

### Check Service Status
```bash
docker-compose ps
```

### View Resource Usage
```bash
docker stats
```

### Database Access
```bash
docker-compose exec postgres psql -U exceldraw_user -d exceldraw
```

## 🎯 Resume Benefits

This deployment shows:
- **Docker Skills** - Containerization and orchestration
- **Infrastructure Management** - EC2, networking, security
- **Microservices Architecture** - Service separation
- **Database Management** - PostgreSQL with Docker
- **Production Deployment** - Real-world application hosting
- **DevOps Skills** - Automation, monitoring, maintenance

## 💰 Cost Estimation

- **EC2 t3.micro**: Free tier (750 hours/month)
- **EC2 t3.small**: ~$15/month
- **Storage**: ~$5/month
- **Total**: $0-20/month

## 🚀 Next Steps

1. **Set up domain** (optional)
2. **Configure SSL** with Let's Encrypt
3. **Set up monitoring** with CloudWatch
4. **Implement backups** for database
5. **Add CI/CD** pipeline

## 📞 Support

If you encounter issues:
1. Check logs: `docker-compose logs -f`
2. Verify ports are open in security group
3. Ensure environment variables are correct
4. Check database connection
