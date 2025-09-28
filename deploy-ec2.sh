#!/bin/bash

# ExcelDraw EC2 Deployment Script
echo "🚀 Deploying ExcelDraw on EC2..."

# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Install Git
sudo apt install git -y

# Create application directory
sudo mkdir -p /opt/exceldraw
sudo chown -R $USER:$USER /opt/exceldraw
cd /opt/exceldraw

# Clone repository
git clone https://github.com/Deepanshu-mani/exceldraw.git .

# Set up environment variables
cat > .env << EOF
# Database
DATABASE_URL=postgresql://exceldraw_user:exceldraw_password@postgres:5432/exceldraw

# Security
JWT_SECRET=$(openssl rand -base64 32)

# Server Ports
HTTP_PORT=4000
WS_PORT=8080

# Frontend URLs
NEXT_PUBLIC_HTTP_BACKEND=http://your-ec2-ip/api
NEXT_PUBLIC_WS_URL=ws://your-ec2-ip/ws

# App Settings
NODE_ENV=production
CORS_ORIGIN=http://your-ec2-ip
LOG_LEVEL=info
EOF

# Build and start all services
docker-compose up --build -d

# Run database migrations
docker-compose exec http-server npx prisma migrate deploy

# Set up systemd service for auto-start
sudo tee /etc/systemd/system/exceldraw.service > /dev/null << EOF
[Unit]
Description=ExcelDraw Application
Requires=docker.service
After=docker.service

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=/opt/exceldraw
ExecStart=/usr/local/bin/docker-compose up -d
ExecStop=/usr/local/bin/docker-compose down
TimeoutStartSec=0

[Install]
WantedBy=multi-user.target
EOF

# Enable and start the service
sudo systemctl enable exceldraw.service
sudo systemctl start exceldraw.service

echo "✅ ExcelDraw deployment complete!"
echo "🌐 Frontend: http://your-ec2-ip"
echo "🔗 API: http://your-ec2-ip/api"
echo "⚡ WebSocket: ws://your-ec2-ip/ws"
echo ""
echo "📋 Useful commands:"
echo "  View logs: docker-compose logs -f"
echo "  Restart: docker-compose restart"
echo "  Stop: docker-compose down"
echo "  Update: git pull && docker-compose up --build -d"
