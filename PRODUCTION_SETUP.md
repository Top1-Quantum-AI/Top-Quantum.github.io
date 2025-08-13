# 🚀 دليل الإعداد للإنتاج - النظام الكمي
## Production Setup Guide - Quantum AI System

### 📋 متطلبات النظام (System Requirements)

#### الحد الأدنى (Minimum Requirements)
- **CPU**: 4 cores, 2.5GHz
- **RAM**: 8GB
- **Storage**: 50GB SSD
- **Network**: 100Mbps
- **OS**: Ubuntu 20.04+ / CentOS 8+ / Windows Server 2019+

#### الموصى به (Recommended)
- **CPU**: 8 cores, 3.0GHz+
- **RAM**: 16GB+
- **Storage**: 100GB+ NVMe SSD
- **Network**: 1Gbps
- **OS**: Ubuntu 22.04 LTS

### 🛠️ التبعيات المطلوبة (Required Dependencies)

```bash
# تحديث النظام
sudo apt update && sudo apt upgrade -y

# تثبيت Docker و Docker Compose
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# تثبيت Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# تثبيت Node.js (للتطوير المحلي)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# تثبيت أدوات إضافية
sudo apt install -y git curl wget unzip htop nginx certbot
```

### 🔧 إعداد البيئة (Environment Setup)

#### 1. استنساخ المشروع
```bash
git clone https://github.com/your-org/quantum-ai-system.git
cd quantum-ai-system
```

#### 2. إعداد متغيرات البيئة
```bash
# نسخ ملف البيئة
cp .env.production .env

# تحرير المتغيرات (استخدم محرر النصوص المفضل)
nano .env
```

**المتغيرات الحرجة التي يجب تغييرها:**
```bash
# أمان
JWT_SECRET=your-unique-jwt-secret-min-32-characters
ENCRYPTION_KEY=your-32-character-encryption-key

# قاعدة البيانات
MONGO_ROOT_PASSWORD=your-secure-mongo-password
REDIS_PASSWORD=your-secure-redis-password

# OpenAI
OPENAI_API_KEY=your-openai-api-key

# المراقبة
GRAFANA_PASSWORD=your-grafana-password

# البريد الإلكتروني
SMTP_USER=your-email@domain.com
SMTP_PASS=your-email-password

# النطاق
FRONTEND_URL=https://your-domain.com
CORS_ORIGIN=https://your-domain.com
```

#### 3. إنشاء المجلدات المطلوبة
```bash
mkdir -p logs uploads ssl nginx/ssl monitoring/grafana/dashboards
chmod 755 logs uploads
```

#### 4. إعداد SSL (اختياري للإنتاج)
```bash
# باستخدام Let's Encrypt
sudo certbot certonly --standalone -d your-domain.com

# نسخ الشهادات
sudo cp /etc/letsencrypt/live/your-domain.com/fullchain.pem ssl/cert.pem
sudo cp /etc/letsencrypt/live/your-domain.com/privkey.pem ssl/key.pem
sudo chown $USER:$USER ssl/*
```

### 🐳 تشغيل النظام باستخدام Docker

#### 1. بناء وتشغيل الخدمات
```bash
# بناء الصور
docker-compose build

# تشغيل جميع الخدمات
docker-compose up -d

# التحقق من حالة الخدمات
docker-compose ps

# عرض السجلات
docker-compose logs -f quantum-server
```

#### 2. التحقق من الصحة
```bash
# فحص صحة الخادم
curl http://localhost:3001/health

# فحص قاعدة البيانات
docker-compose exec mongo mongosh --eval "db.adminCommand('ping')"

# فحص Redis
docker-compose exec redis redis-cli ping
```

### 🔍 المراقبة والتحليل (Monitoring & Analytics)

#### الوصول إلى لوحات المراقبة:
- **Grafana**: http://localhost:3000 (admin/your-password)
- **Prometheus**: http://localhost:9090
- **Kibana**: http://localhost:5601
- **API Docs**: http://localhost:3001/api-docs

#### إعداد التنبيهات:
```bash
# إضافة قواعد التنبيه في Grafana
# 1. CPU Usage > 80%
# 2. Memory Usage > 85%
# 3. Response Time > 2s
# 4. Error Rate > 5%
# 5. Disk Space < 10%
```

### 🔒 الأمان (Security Configuration)

#### 1. إعداد Firewall
```bash
# تفعيل UFW
sudo ufw enable

# السماح بالمنافذ الضرورية
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw allow 3001/tcp  # API Server

# حظر المنافذ الداخلية من الخارج
sudo ufw deny 27017/tcp  # MongoDB
sudo ufw deny 6379/tcp   # Redis
sudo ufw deny 9200/tcp   # Elasticsearch
```

#### 2. إعداد Nginx كـ Reverse Proxy
```nginx
# /etc/nginx/sites-available/quantum-ai
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;

    ssl_certificate /path/to/ssl/cert.pem;
    ssl_certificate_key /path/to/ssl/key.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;

    # Security headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload";
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'";

    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
    limit_req zone=api burst=20 nodelay;

    location / {
        proxy_pass http://localhost:5173;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # API specific rate limiting
        limit_req zone=api burst=50 nodelay;
    }
}
```

#### 3. تفعيل الموقع
```bash
sudo ln -s /etc/nginx/sites-available/quantum-ai /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 📊 النسخ الاحتياطي (Backup Strategy)

#### 1. نسخ احتياطي لقاعدة البيانات
```bash
#!/bin/bash
# backup-mongodb.sh

DATE=$(date +"%Y%m%d_%H%M%S")
BACKUP_DIR="/backups/mongodb"
DB_NAME="quantum-ai"

mkdir -p $BACKUP_DIR

# إنشاء النسخة الاحتياطية
docker-compose exec -T mongo mongodump --db $DB_NAME --archive --gzip > $BACKUP_DIR/mongodb_backup_$DATE.gz

# حذف النسخ القديمة (أكثر من 30 يوم)
find $BACKUP_DIR -name "mongodb_backup_*.gz" -mtime +30 -delete

echo "Backup completed: mongodb_backup_$DATE.gz"
```

#### 2. نسخ احتياطي للملفات
```bash
#!/bin/bash
# backup-files.sh

DATE=$(date +"%Y%m%d_%H%M%S")
BACKUP_DIR="/backups/files"
SOURCE_DIR="/path/to/quantum-ai-system"

mkdir -p $BACKUP_DIR

# ضغط الملفات المهمة
tar -czf $BACKUP_DIR/files_backup_$DATE.tar.gz \
    --exclude='node_modules' \
    --exclude='logs' \
    --exclude='.git' \
    $SOURCE_DIR

# حذف النسخ القديمة
find $BACKUP_DIR -name "files_backup_*.tar.gz" -mtime +7 -delete

echo "Files backup completed: files_backup_$DATE.tar.gz"
```

#### 3. جدولة النسخ الاحتياطي
```bash
# إضافة إلى crontab
crontab -e

# نسخ احتياطي يومي في الساعة 2:00 صباحاً
0 2 * * * /path/to/backup-mongodb.sh
0 2 * * * /path/to/backup-files.sh

# نسخ احتياطي أسبوعي للنظام الكامل
0 3 * * 0 /path/to/full-system-backup.sh
```

### 🔄 التحديث والصيانة (Updates & Maintenance)

#### 1. تحديث النظام
```bash
# إيقاف الخدمات
docker-compose down

# سحب آخر التحديثات
git pull origin main

# إعادة بناء الصور
docker-compose build --no-cache

# تشغيل النظام
docker-compose up -d

# التحقق من الصحة
docker-compose ps
curl http://localhost:3001/health
```

#### 2. مراقبة الأداء
```bash
# مراقبة استخدام الموارد
docker stats

# فحص السجلات
docker-compose logs --tail=100 quantum-server

# فحص مساحة القرص
df -h

# فحص الذاكرة
free -h

# فحص العمليات
top
```

### 🚨 استكشاف الأخطاء (Troubleshooting)

#### المشاكل الشائعة:

**1. فشل في الاتصال بقاعدة البيانات**
```bash
# فحص حالة MongoDB
docker-compose logs mongo

# إعادة تشغيل MongoDB
docker-compose restart mongo

# فحص الاتصال
docker-compose exec mongo mongosh --eval "db.adminCommand('ping')"
```

**2. مشاكل في الذاكرة**
```bash
# فحص استخدام الذاكرة
docker stats --no-stream

# زيادة حدود الذاكرة في docker-compose.yml
services:
  quantum-server:
    deploy:
      resources:
        limits:
          memory: 2G
        reservations:
          memory: 1G
```

**3. بطء في الاستجابة**
```bash
# فحص أداء الشبكة
ping google.com

# فحص أداء القرص
iostat -x 1

# تحسين إعدادات Nginx
# زيادة worker_processes و worker_connections
```

### 📈 تحسين الأداء (Performance Optimization)

#### 1. تحسين قاعدة البيانات
```javascript
// إضافة فهارس في MongoDB
db.users.createIndex({ "username": 1 })
db.users.createIndex({ "email": 1 })
db.logs.createIndex({ "timestamp": -1 })
db.metrics.createIndex({ "name": 1, "timestamp": -1 })
```

#### 2. تحسين Redis
```bash
# في redis.conf
maxmemory 1gb
maxmemory-policy allkeys-lru
save 900 1
save 300 10
save 60 10000
```

#### 3. تحسين Node.js
```bash
# متغيرات البيئة للأداء
export NODE_ENV=production
export NODE_OPTIONS="--max-old-space-size=2048"
export UV_THREADPOOL_SIZE=16
```

### 🔐 قائمة التحقق الأمني (Security Checklist)

- [ ] تغيير جميع كلمات المرور الافتراضية
- [ ] تفعيل HTTPS مع شهادات SSL صالحة
- [ ] إعداد Firewall وحظر المنافذ غير الضرورية
- [ ] تفعيل Rate Limiting
- [ ] إعداد مراقبة السجلات
- [ ] تحديث جميع التبعيات للإصدارات الآمنة
- [ ] إعداد النسخ الاحتياطي التلقائي
- [ ] اختبار خطة الاستعادة من الكوارث
- [ ] تفعيل التنبيهات الأمنية
- [ ] مراجعة أذونات الملفات والمجلدات

### 📞 الدعم والمساعدة (Support)

- **الوثائق**: https://docs.quantum-ai.com
- **المجتمع**: https://community.quantum-ai.com
- **الدعم التقني**: support@quantum-ai.com
- **تقارير الأخطاء**: https://github.com/quantum-ai/issues

---

**ملاحظة مهمة**: هذا الدليل يوفر إعداداً أساسياً للإنتاج. للبيئات الحرجة، يُنصح بالتشاور مع خبير أمان وأداء لضمان أفضل الممارسات.