# دليل ربط النظام الأمني الموحد بالدومين
# Domain Deployment Guide for Unified Security System

## متطلبات النشر / Deployment Requirements

### 1. الخادم / Server
- **CPU**: 2 cores minimum
- **RAM**: 4GB minimum (8GB recommended)
- **Storage**: 20GB SSD minimum
- **OS**: Ubuntu 20.04+ / CentOS 8+ / Debian 11+

### 2. البرمجيات المطلوبة / Required Software
```bash
# تحديث النظام / Update system
sudo apt update && sudo apt upgrade -y

# تثبيت Docker و Docker Compose
sudo apt install docker.io docker-compose -y
sudo systemctl enable docker
sudo usermod -aG docker $USER

# تثبيت Nginx
sudo apt install nginx -y
sudo systemctl enable nginx

# تثبيت Certbot للشهادات المجانية
sudo apt install certbot python3-certbot-nginx -y
```

## خطوات النشر / Deployment Steps

### الخطوة 1: تحضير الخادم / Step 1: Server Preparation

```bash
# إنشاء مجلد المشروع
mkdir -p /opt/quantum-security
cd /opt/quantum-security

# نسخ ملفات المشروع
# Copy project files (upload your project to this directory)
```

### الخطوة 2: إعداد متغيرات البيئة / Step 2: Environment Setup

```bash
# إنشاء ملف البيئة للإنتاج
cp .env.example .env.production

# تحرير متغيرات الإنتاج
nano .env.production
```

**محتوى `.env.production` / `.env.production` Content:**
```env
# أساسيات الخادم / Server Basics
NODE_ENV=production
PORT=3001
HOST=0.0.0.0

# قاعدة البيانات / Database
MONGODB_URI=mongodb://mongo:27017/quantum-ai
MONGO_ROOT_USERNAME=admin
MONGO_ROOT_PASSWORD=your-secure-mongo-password

# Redis
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_PASSWORD=your-secure-redis-password

# الأمان / Security
JWT_SECRET=your-very-secure-jwt-secret-key-here
CORS_ORIGIN=https://yourdomain.com,https://www.yourdomain.com

# OpenAI API
OPENAI_API_KEY=your-openai-api-key

# المراقبة / Monitoring
GRAFANA_USER=admin
GRAFANA_PASSWORD=your-secure-grafana-password

# SSL
SSL_CERT_PATH=/etc/nginx/ssl/cert.pem
SSL_KEY_PATH=/etc/nginx/ssl/key.pem
```

### الخطوة 3: إعداد الدومين / Step 3: Domain Configuration

```bash
# تحديث تكوين Nginx
sudo nano /etc/nginx/sites-available/quantum-security

# محتوى التكوين / Configuration content:
```

**تكوين Nginx المؤقت / Temporary Nginx Config:**
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    
    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# تفعيل التكوين
sudo ln -s /etc/nginx/sites-available/quantum-security /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### الخطوة 4: الحصول على شهادة SSL / Step 4: SSL Certificate

```bash
# الحصول على شهادة SSL مجانية من Let's Encrypt
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# سيتم تحديث تكوين Nginx تلقائياً
# Nginx configuration will be automatically updated
```

### الخطوة 5: بناء ونشر التطبيق / Step 5: Build and Deploy

```bash
# إعداد مجلدات SSL للدوكر
mkdir -p nginx/ssl

# نسخ شهادات SSL
sudo cp /etc/letsencrypt/live/yourdomain.com/fullchain.pem nginx/ssl/cert.pem
sudo cp /etc/letsencrypt/live/yourdomain.com/privkey.pem nginx/ssl/key.pem
sudo chown -R $USER:$USER nginx/ssl/

# بناء ونشر النظام
docker-compose --env-file .env.production up --build -d

# التحقق من حالة الخدمات
docker-compose ps
```

### الخطوة 6: تحديث تكوين Nginx / Step 6: Update Nginx Configuration

```bash
# استبدال تكوين Nginx بالتكوين المتقدم
sudo cp nginx/nginx.conf /etc/nginx/sites-available/quantum-security
sudo nginx -t
sudo systemctl reload nginx
```

## اختبار النشر / Testing Deployment

### فحص الخدمات الأساسية / Basic Service Checks
```bash
# فحص صحة النظام
curl https://yourdomain.com/health

# فحص API
curl https://yourdomain.com/api/monitoring/status

# فحص واجهة Grafana
curl https://grafana.yourdomain.com

# فحص واجهة Kibana
curl https://kibana.yourdomain.com
```

### فحص الأمان / Security Tests
```bash
# فحص شهادة SSL
openssl s_client -connect yourdomain.com:443 -servername yourdomain.com

# فحص رؤوس الأمان
curl -I https://yourdomain.com
```

## المراقبة والصيانة / Monitoring and Maintenance

### المراقبة اليومية / Daily Monitoring
```bash
# فحص حالة الحاويات
docker-compose ps

# فحص سجلات النظام
docker-compose logs --tail=100 quantum-server

# فحص استخدام الموارد
docker stats
```

### النسخ الاحتياطي / Backup
```bash
# نسخ احتياطي لقاعدة البيانات
docker exec quantum-mongo mongodump --out /backup/$(date +%Y%m%d)

# نسخ احتياطي للملفات
tar -czf backup-$(date +%Y%m%d).tar.gz /opt/quantum-security
```

### التحديثات / Updates
```bash
# سحب آخر التحديثات
git pull origin main

# إعادة بناء التطبيق
docker-compose --env-file .env.production up --build -d

# تجديد شهادة SSL (تلقائي)
sudo certbot renew
```

## استكشاف الأخطاء / Troubleshooting

### مشاكل شائعة / Common Issues

#### 1. خطأ في الاتصال بقاعدة البيانات
```bash
# فحص حالة MongoDB
docker-compose logs mongo

# إعادة تشغيل قاعدة البيانات
docker-compose restart mongo
```

#### 2. مشاكل SSL
```bash
# تجديد الشهادة يدوياً
sudo certbot renew --force-renewal

# فحص انتهاء صلاحية الشهادة
sudo certbot certificates
```

#### 3. مشاكل الأداء
```bash
# فحص استخدام الذاكرة
free -h

# فحص استخدام المعالج
top

# فحص مساحة القرص
df -h
```

### سجلات مهمة / Important Logs
```bash
# سجلات النظام
tail -f /var/log/syslog

# سجلات Nginx
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log

# سجلات التطبيق
docker-compose logs -f quantum-server
```

## الأمان المتقدم / Advanced Security

### جدار الحماية / Firewall
```bash
# تفعيل UFW
sudo ufw enable

# السماح بـ SSH
sudo ufw allow ssh

# السماح بـ HTTP و HTTPS
sudo ufw allow 80
sudo ufw allow 443

# حظر باقي المنافذ
sudo ufw default deny incoming
sudo ufw default allow outgoing
```

### مراقبة الأمان / Security Monitoring
```bash
# تثبيت fail2ban
sudo apt install fail2ban -y

# تكوين fail2ban للحماية من هجمات القوة الغاشمة
sudo nano /etc/fail2ban/jail.local
```

## الدعم الفني / Technical Support

### معلومات الاتصال / Contact Information
- **البريد الإلكتروني / Email**: support@yourdomain.com
- **التوثيق / Documentation**: https://docs.yourdomain.com
- **حالة النظام / System Status**: https://status.yourdomain.com

### روابط مفيدة / Useful Links
- [Nginx Documentation](https://nginx.org/en/docs/)
- [Docker Compose Reference](https://docs.docker.com/compose/)
- [Let's Encrypt Guide](https://letsencrypt.org/getting-started/)
- [MongoDB Production Notes](https://docs.mongodb.com/manual/administration/production-notes/)

---

## ملاحظات مهمة / Important Notes

⚠️ **تحذير أمني / Security Warning**: 
- استبدل جميع كلمات المرور الافتراضية
- فعّل المصادقة الثنائية عند الإمكان
- راقب سجلات النظام بانتظام

✅ **نصائح للأداء / Performance Tips**:
- استخدم CDN لتحسين سرعة التحميل
- فعّل ضغط Gzip في Nginx
- راقب استخدام الموارد بانتظام

📊 **المراقبة / Monitoring**:
- تحقق من لوحة Grafana يومياً
- راجع سجلات Kibana أسبوعياً
- قم بنسخ احتياطي شهري

---

*تم إنشاء هذا الدليل للنظام الأمني الموحد - Quantum AI System*
*This guide was created for the Unified Security System - Quantum AI System*