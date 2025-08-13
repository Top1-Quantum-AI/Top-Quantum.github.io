#!/bin/bash

# إعداد شهادات SSL - النظام الأمني الموحد
# SSL Certificate Setup - Unified Security System

set -e

# ألوان للطباعة
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# دالة طباعة ملونة
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# متغيرات الإعداد
DOMAIN=""
EMAIL=""
STAGING=false
FORCE_RENEWAL=false
AUTO_RENEW=false

# دالة المساعدة
show_help() {
    echo "إعداد شهادات SSL / SSL Certificate Setup"
    echo ""
    echo "الاستخدام / Usage:"
    echo "./setup-ssl.sh --domain yourdomain.com --email your@email.com [OPTIONS]"
    echo ""
    echo "الخيارات / Options:"
    echo "  --domain DOMAIN       الدومين المراد إعداد SSL له / Domain for SSL setup"
    echo "  --email EMAIL         البريد الإلكتروني للتسجيل / Email for registration"
    echo "  --staging             استخدام بيئة الاختبار / Use staging environment"
    echo "  --force-renewal       إجبار تجديد الشهادة / Force certificate renewal"
    echo "  --auto-renew         إعداد التجديد التلقائي / Setup automatic renewal"
    echo "  --test-only          اختبار التكوين فقط / Test configuration only"
    echo "  --help               عرض هذه المساعدة / Show this help"
    echo ""
    echo "أمثلة / Examples:"
    echo "./setup-ssl.sh --domain myapp.com --email admin@myapp.com"
    echo "./setup-ssl.sh --domain myapp.com --email admin@myapp.com --staging"
    echo "./setup-ssl.sh --domain myapp.com --email admin@myapp.com --auto-renew"
}

# تحليل المعاملات
parse_args() {
    while [[ $# -gt 0 ]]; do
        case $1 in
            --domain)
                DOMAIN="$2"
                shift 2
                ;;
            --email)
                EMAIL="$2"
                shift 2
                ;;
            --staging)
                STAGING=true
                shift
                ;;
            --force-renewal)
                FORCE_RENEWAL=true
                shift
                ;;
            --auto-renew)
                AUTO_RENEW=true
                shift
                ;;
            --test-only)
                TEST_ONLY=true
                shift
                ;;
            --help)
                show_help
                exit 0
                ;;
            *)
                print_error "خيار غير معروف: $1 / Unknown option: $1"
                show_help
                exit 1
                ;;
        esac
    done
}

# التحقق من المتطلبات
check_requirements() {
    print_status "فحص المتطلبات / Checking requirements..."
    
    # فحص Certbot
    if ! command -v certbot &> /dev/null; then
        print_error "Certbot غير مثبت / Certbot is not installed"
        print_status "لتثبيت Certbot على Ubuntu: / To install Certbot on Ubuntu:"
        echo "sudo apt update && sudo apt install certbot python3-certbot-nginx"
        exit 1
    fi
    
    # فحص Nginx
    if ! command -v nginx &> /dev/null; then
        print_error "Nginx غير مثبت / Nginx is not installed"
        exit 1
    fi
    
    # فحص صلاحيات المدير
    if [[ $EUID -ne 0 ]] && ! groups | grep -q sudo; then
        print_error "يجب تشغيل النصل بصلاحيات المدير / Must run with sudo privileges"
        exit 1
    fi
    
    print_success "جميع المتطلبات متوفرة / All requirements met"
}

# التحقق من صحة المعاملات
validate_input() {
    if [[ -z "$DOMAIN" ]]; then
        print_error "الدومين مطلوب / Domain is required"
        show_help
        exit 1
    fi
    
    if [[ -z "$EMAIL" ]]; then
        print_error "البريد الإلكتروني مطلوب / Email is required"
        show_help
        exit 1
    fi
    
    # التحقق من صيغة الدومين
    if [[ ! "$DOMAIN" =~ ^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$ ]]; then
        print_error "صيغة الدومين غير صحيحة / Invalid domain format"
        exit 1
    fi
    
    # التحقق من صيغة البريد الإلكتروني
    if [[ ! "$EMAIL" =~ ^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$ ]]; then
        print_error "صيغة البريد الإلكتروني غير صحيحة / Invalid email format"
        exit 1
    fi
    
    print_success "المعاملات صحيحة / Parameters validated"
}

# إعداد Nginx الأساسي
setup_basic_nginx() {
    print_status "إعداد Nginx الأساسي / Setting up basic Nginx..."
    
    NGINX_CONFIG="/etc/nginx/sites-available/quantum-security"
    
    sudo tee "$NGINX_CONFIG" > /dev/null <<EOF
server {
    listen 80;
    server_name $DOMAIN www.$DOMAIN;
    
    # Let's Encrypt challenge
    location /.well-known/acme-challenge/ {
        root /var/www/html;
    }
    
    # Redirect other traffic to HTTPS (will be enabled after SSL setup)
    location / {
        return 301 https://\$server_name\$request_uri;
    }
}
EOF
    
    # تفعيل التكوين
    sudo ln -sf "$NGINX_CONFIG" /etc/nginx/sites-enabled/
    sudo rm -f /etc/nginx/sites-enabled/default
    
    # إنشاء مجلد webroot
    sudo mkdir -p /var/www/html
    sudo chown -R www-data:www-data /var/www/html
    
    # اختبار التكوين
    if sudo nginx -t; then
        print_success "تكوين Nginx صحيح / Nginx configuration valid"
        sudo systemctl reload nginx
    else
        print_error "تكوين Nginx يحتوي على أخطاء / Nginx configuration has errors"
        exit 1
    fi
}

# اختبار الاتصال بالدومين
test_domain_connection() {
    print_status "اختبار الاتصال بالدومين / Testing domain connection..."
    
    # اختبار DNS
    if nslookup "$DOMAIN" > /dev/null 2>&1; then
        print_success "DNS resolution works for $DOMAIN"
    else
        print_error "DNS resolution failed for $DOMAIN"
        print_warning "تأكد من أن DNS للدومين يشير إلى هذا الخادم / Make sure domain DNS points to this server"
        exit 1
    fi
    
    # اختبار HTTP
    if curl -f -s "http://$DOMAIN/.well-known/acme-challenge/test" > /dev/null 2>&1; then
        print_success "HTTP connection test passed"
    else
        print_warning "HTTP connection test failed - this is normal before certificate issuance"
    fi
}

# الحصول على شهادة SSL
obtain_ssl_certificate() {
    print_status "الحصول على شهادة SSL / Obtaining SSL certificate..."
    
    # إعداد أوامر Certbot
    CERTBOT_ARGS="--nginx -d $DOMAIN -d www.$DOMAIN --email $EMAIL --agree-tos --non-interactive"
    
    if [[ "$STAGING" == true ]]; then
        CERTBOT_ARGS="$CERTBOT_ARGS --staging"
        print_warning "استخدام بيئة الاختبار / Using staging environment"
    fi
    
    if [[ "$FORCE_RENEWAL" == true ]]; then
        CERTBOT_ARGS="$CERTBOT_ARGS --force-renewal"
        print_warning "إجبار تجديد الشهادة / Forcing certificate renewal"
    fi
    
    # تشغيل Certbot
    if sudo certbot $CERTBOT_ARGS; then
        print_success "تم الحصول على شهادة SSL بنجاح / SSL certificate obtained successfully"
    else
        print_error "فشل في الحصول على شهادة SSL / Failed to obtain SSL certificate"
        print_status "تحقق من:"
        echo "- DNS الدومين يشير إلى هذا الخادم"
        echo "- المنفذ 80 و 443 مفتوحان"
        echo "- لا يوجد جدار حماية يحجب الاتصالات"
        exit 1
    fi
}

# إعداد تكوين Nginx المتقدم
setup_advanced_nginx() {
    print_status "إعداد تكوين Nginx المتقدم / Setting up advanced Nginx configuration..."
    
    NGINX_CONFIG="/etc/nginx/sites-available/quantum-security"
    
    sudo tee "$NGINX_CONFIG" > /dev/null <<EOF
# HTTP to HTTPS redirect
server {
    listen 80;
    server_name $DOMAIN www.$DOMAIN;
    
    # Let's Encrypt challenge
    location /.well-known/acme-challenge/ {
        root /var/www/html;
    }
    
    # Redirect to HTTPS
    location / {
        return 301 https://\$server_name\$request_uri;
    }
}

# HTTPS server
server {
    listen 443 ssl http2;
    server_name $DOMAIN www.$DOMAIN;
    
    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/$DOMAIN/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/$DOMAIN/privkey.pem;
    
    # SSL Security
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;
    
    # HSTS
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    
    # Security Headers
    add_header X-Frame-Options DENY always;
    add_header X-Content-Type-Options nosniff always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    
    # CSP Header
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://api.openai.com;" always;
    
    # Proxy to application
    location / {
        proxy_pass http://127.0.0.1:80;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        proxy_connect_timeout 30s;
        proxy_send_timeout 30s;
        proxy_read_timeout 30s;
    }
    
    # Health check
    location /health {
        proxy_pass http://127.0.0.1:80;
        access_log off;
    }
    
    # API endpoints
    location /api/ {
        proxy_pass http://127.0.0.1:80;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}

# Grafana subdomain
server {
    listen 443 ssl http2;
    server_name grafana.$DOMAIN;
    
    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/$DOMAIN/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/$DOMAIN/privkey.pem;
    
    # SSL Security
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers off;
    
    location / {
        proxy_pass http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
}

# Kibana subdomain
server {
    listen 443 ssl http2;
    server_name kibana.$DOMAIN;
    
    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/$DOMAIN/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/$DOMAIN/privkey.pem;
    
    # SSL Security
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers off;
    
    location / {
        proxy_pass http://127.0.0.1:5601;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF
    
    # اختبار التكوين الجديد
    if sudo nginx -t; then
        print_success "تكوين Nginx المتقدم صحيح / Advanced Nginx configuration valid"
        sudo systemctl reload nginx
    else
        print_error "تكوين Nginx المتقدم يحتوي على أخطاء / Advanced Nginx configuration has errors"
        exit 1
    fi
}

# نسخ الشهادات للدوكر
copy_certificates_for_docker() {
    print_status "نسخ الشهادات للدوكر / Copying certificates for Docker..."
    
    # إنشاء مجلد SSL
    mkdir -p nginx/ssl
    
    # نسخ الشهادات
    sudo cp "/etc/letsencrypt/live/$DOMAIN/fullchain.pem" nginx/ssl/cert.pem
    sudo cp "/etc/letsencrypt/live/$DOMAIN/privkey.pem" nginx/ssl/key.pem
    
    # تغيير الصلاحيات
    sudo chown -R $USER:$USER nginx/ssl/
    chmod 600 nginx/ssl/key.pem
    chmod 644 nginx/ssl/cert.pem
    
    print_success "تم نسخ الشهادات / Certificates copied"
}

# إعداد التجديد التلقائي
setup_auto_renewal() {
    if [[ "$AUTO_RENEW" != true ]]; then
        return
    fi
    
    print_status "إعداد التجديد التلقائي / Setting up automatic renewal..."
    
    # إنشاء نصل التجديد
    RENEWAL_SCRIPT="/usr/local/bin/quantum-ssl-renewal.sh"
    
    sudo tee "$RENEWAL_SCRIPT" > /dev/null <<EOF
#!/bin/bash
# نصل تجديد شهادات SSL التلقائي
# Automatic SSL Certificate Renewal Script

DOMAIN="$DOMAIN"
PROJECT_DIR="$(pwd)"

# تجديد الشهادة
certbot renew --quiet

# نسخ الشهادات المحدثة
if [[ -f "/etc/letsencrypt/live/\$DOMAIN/fullchain.pem" ]]; then
    cp "/etc/letsencrypt/live/\$DOMAIN/fullchain.pem" "\$PROJECT_DIR/nginx/ssl/cert.pem"
    cp "/etc/letsencrypt/live/\$DOMAIN/privkey.pem" "\$PROJECT_DIR/nginx/ssl/key.pem"
    chmod 600 "\$PROJECT_DIR/nginx/ssl/key.pem"
    chmod 644 "\$PROJECT_DIR/nginx/ssl/cert.pem"
fi

# إعادة تحميل Nginx
systemctl reload nginx

# إعادة تشغيل حاوية Nginx إذا كانت تعمل
if command -v docker-compose &> /dev/null; then
    cd "\$PROJECT_DIR"
    if docker-compose ps nginx | grep -q Up; then
        docker-compose restart nginx
    fi
fi
EOF
    
    sudo chmod +x "$RENEWAL_SCRIPT"
    
    # إضافة مهمة cron
    CRON_JOB="0 3 * * * $RENEWAL_SCRIPT"
    
    if crontab -l 2>/dev/null | grep -q "$RENEWAL_SCRIPT"; then
        print_warning "مهمة التجديد التلقائي موجودة بالفعل / Auto-renewal cron job already exists"
    else
        (crontab -l 2>/dev/null; echo "$CRON_JOB") | crontab -
        print_success "تم إعداد التجديد التلقائي / Automatic renewal configured"
    fi
}

# اختبار الشهادة
test_ssl_certificate() {
    print_status "اختبار شهادة SSL / Testing SSL certificate..."
    
    # اختبار اتصال HTTPS
    if curl -f -s "https://$DOMAIN/health" > /dev/null 2>&1; then
        print_success "اختبار HTTPS نجح / HTTPS test passed"
    else
        print_warning "اختبار HTTPS فشل - قد يكون الخادم غير متاح / HTTPS test failed - server may not be running"
    fi
    
    # فحص صحة الشهادة
    if openssl s_client -connect "$DOMAIN:443" -servername "$DOMAIN" < /dev/null 2>/dev/null | openssl x509 -noout -dates; then
        print_success "شهادة SSL صحيحة / SSL certificate is valid"
    else
        print_warning "لا يمكن التحقق من شهادة SSL / Cannot verify SSL certificate"
    fi
    
    # اختبار SSL Labs (اختياري)
    if command -v curl &> /dev/null; then
        print_status "يمكنك اختبار تقييم SSL على: / You can test SSL rating at:"
        echo "https://www.ssllabs.com/ssltest/analyze.html?d=$DOMAIN"
    fi
}

# عرض معلومات الشهادة
show_certificate_info() {
    print_success "تم إعداد SSL بنجاح! / SSL setup completed successfully!"
    echo ""
    echo "معلومات الشهادة / Certificate Information:"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "🌐 الدومين / Domain: $DOMAIN"
    echo "📧 البريد الإلكتروني / Email: $EMAIL"
    
    if [[ "$STAGING" == true ]]; then
        echo "⚠️  بيئة الاختبار / Staging Environment: نعم / Yes"
    else
        echo "✅ بيئة الإنتاج / Production Environment: نعم / Yes"
    fi
    
    echo ""
    echo "المواقع المتاحة / Available Sites:"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "🌐 الموقع الرئيسي / Main Site: https://$DOMAIN"
    echo "📊 لوحة Grafana / Grafana Dashboard: https://grafana.$DOMAIN"
    echo "🔍 لوحة Kibana / Kibana Dashboard: https://kibana.$DOMAIN"
    
    echo ""
    echo "إدارة الشهادات / Certificate Management:"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "# فحص حالة الشهادة / Check certificate status"
    echo "sudo certbot certificates"
    echo ""
    echo "# تجديد يدوي / Manual renewal"
    echo "sudo certbot renew --dry-run"
    echo ""
    echo "# إعادة إعداد SSL / Reconfigure SSL"
    echo "./scripts/setup-ssl.sh --domain $DOMAIN --email $EMAIL --force-renewal"
    
    if [[ "$AUTO_RENEW" == true ]]; then
        echo ""
        echo "✅ التجديد التلقائي مفعل / Automatic renewal enabled"
    else
        echo ""
        echo "⚠️  لتفعيل التجديد التلقائي: / To enable automatic renewal:"
        echo "./scripts/setup-ssl.sh --domain $DOMAIN --email $EMAIL --auto-renew"
    fi
}

# الدالة الرئيسية
main() {
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "🔒 إعداد شهادات SSL - النظام الأمني الموحد"
    echo "🔒 SSL Certificate Setup - Unified Security System"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    
    parse_args "$@"
    validate_input
    check_requirements
    
    if [[ "$TEST_ONLY" == true ]]; then
        test_domain_connection
        print_success "اختبار التكوين مكتمل / Configuration test completed"
        exit 0
    fi
    
    # إعداد SSL
    setup_basic_nginx
    test_domain_connection
    obtain_ssl_certificate
    setup_advanced_nginx
    copy_certificates_for_docker
    setup_auto_renewal
    
    # اختبار النتيجة النهائية
    test_ssl_certificate
    
    # عرض المعلومات
    show_certificate_info
}

# تشغيل الدالة الرئيسية
main "$@"