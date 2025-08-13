#!/bin/bash

# نصل نشر النظام الأمني الموحد
# Unified Security System Deployment Script

set -e

# ألوان للطباعة
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# متحققات الدومين
DOMAIN=""
EMAIL=""
ENVIRONMENT="production"

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

# دالة المساعدة
show_help() {
    echo "استخدام / Usage:"
    echo "./deploy.sh --domain yourdomain.com --email your@email.com [OPTIONS]"
    echo ""
    echo "الخيارات / Options:"
    echo "  --domain DOMAIN     الدومين المراد ربطه / Domain to deploy"
    echo "  --email EMAIL       البريد الإلكتروني لشهادة SSL / Email for SSL certificate"
    echo "  --env ENVIRONMENT   البيئة (production/staging) / Environment (default: production)"
    echo "  --skip-ssl          تخطي إعداد SSL / Skip SSL setup"
    echo "  --skip-backup       تخطي النسخ الاحتياطي / Skip backup"
    echo "  --help              عرض هذه المساعدة / Show this help"
    echo ""
    echo "مثال / Example:"
    echo "./deploy.sh --domain myapp.com --email admin@myapp.com"
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
            --env)
                ENVIRONMENT="$2"
                shift 2
                ;;
            --skip-ssl)
                SKIP_SSL=true
                shift
                ;;
            --skip-backup)
                SKIP_BACKUP=true
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
    
    # فحص Docker
    if ! command -v docker &> /dev/null; then
        print_error "Docker غير مثبت / Docker is not installed"
        exit 1
    fi
    
    # فحص Docker Compose
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose غير مثبت / Docker Compose is not installed"
        exit 1
    fi
    
    # فحص Nginx
    if ! command -v nginx &> /dev/null; then
        print_error "Nginx غير مثبت / Nginx is not installed"
        exit 1
    fi
    
    # فحص Certbot (إذا لم يتم تخطي SSL)
    if [[ "$SKIP_SSL" != true ]] && ! command -v certbot &> /dev/null; then
        print_error "Certbot غير مثبت / Certbot is not installed"
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
    
    if [[ -z "$EMAIL" ]] && [[ "$SKIP_SSL" != true ]]; then
        print_error "البريد الإلكتروني مطلوب لشهادة SSL / Email is required for SSL certificate"
        show_help
        exit 1
    fi
    
    # التحقق من صيغة الدومين
    if [[ ! "$DOMAIN" =~ ^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$ ]]; then
        print_error "صيغة الدومين غير صحيحة / Invalid domain format"
        exit 1
    fi
    
    print_success "المعاملات صحيحة / Parameters validated"
}

# إنشاء نسخة احتياطية
create_backup() {
    if [[ "$SKIP_BACKUP" == true ]]; then
        print_warning "تم تخطي النسخ الاحتياطي / Backup skipped"
        return
    fi
    
    print_status "إنشاء نسخة احتياطية / Creating backup..."
    
    BACKUP_DIR="backups/$(date +%Y%m%d_%H%M%S)"
    mkdir -p "$BACKUP_DIR"
    
    # نسخ احتياطي للتكوينات
    if [[ -f ".env" ]]; then
        cp .env "$BACKUP_DIR/"
    fi
    
    if [[ -f "docker-compose.yml" ]]; then
        cp docker-compose.yml "$BACKUP_DIR/"
    fi
    
    # نسخ احتياطي لقاعدة البيانات إذا كانت تعمل
    if docker-compose ps | grep -q "mongo.*Up"; then
        print_status "نسخ احتياطي لقاعدة البيانات / Backing up database..."
        docker-compose exec -T mongo mongodump --archive --gzip > "$BACKUP_DIR/mongodb_backup.gz"
    fi
    
    print_success "تم إنشاء النسخة الاحتياطية في: $BACKUP_DIR / Backup created in: $BACKUP_DIR"
}

# إعداد متغيرات البيئة
setup_environment() {
    print_status "إعداد متغيرات البيئة / Setting up environment..."
    
    ENV_FILE=".env"
    if [[ "$ENVIRONMENT" == "production" ]]; then
        ENV_FILE=".env.production"
    fi
    
    # إنشاء ملف البيئة من المثال
    if [[ ! -f "$ENV_FILE" ]]; then
        if [[ -f ".env.example" ]]; then
            cp .env.example "$ENV_FILE"
        else
            print_error "ملف المثال غير موجود / Example file not found"
            exit 1
        fi
    fi
    
    # تحديث الدومين في ملف البيئة
    sed -i "s/yourdomain\.com/$DOMAIN/g" "$ENV_FILE"
    sed -i "s/localhost:5173/https:\/\/$DOMAIN/g" "$ENV_FILE"
    
    # توليد مفاتيح عشوائية آمنة
    JWT_SECRET=$(openssl rand -hex 32)
    MONGO_PASSWORD=$(openssl rand -hex 16)
    REDIS_PASSWORD=$(openssl rand -hex 16)
    GRAFANA_PASSWORD=$(openssl rand -hex 12)
    
    # تحديث كلمات المرور في ملف البيئة
    sed -i "s/your-very-secure-jwt-secret-key-here/$JWT_SECRET/" "$ENV_FILE"
    sed -i "s/your-secure-mongo-password/$MONGO_PASSWORD/" "$ENV_FILE"
    sed -i "s/your-secure-redis-password/$REDIS_PASSWORD/" "$ENV_FILE"
    sed -i "s/your-secure-grafana-password/$GRAFANA_PASSWORD/" "$ENV_FILE"
    
    print_success "تم إعداد متغيرات البيئة / Environment configured"
}

# إعداد Nginx
setup_nginx() {
    print_status "إعداد Nginx / Setting up Nginx..."
    
    # إنشاء تكوين Nginx مؤقت
    NGINX_CONFIG="/etc/nginx/sites-available/quantum-security"
    
    sudo tee "$NGINX_CONFIG" > /dev/null <<EOF
server {
    listen 80;
    server_name $DOMAIN www.$DOMAIN;
    
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
    
    location /health {
        proxy_pass http://127.0.0.1:80;
        access_log off;
    }
}
EOF
    
    # تفعيل التكوين
    sudo ln -sf "$NGINX_CONFIG" /etc/nginx/sites-enabled/
    sudo rm -f /etc/nginx/sites-enabled/default
    
    # اختبار التكوين
    sudo nginx -t
    sudo systemctl reload nginx
    
    print_success "تم إعداد Nginx / Nginx configured"
}

# إعداد SSL
setup_ssl() {
    if [[ "$SKIP_SSL" == true ]]; then
        print_warning "تم تخطي إعداد SSL / SSL setup skipped"
        return
    fi
    
    print_status "إعداد شهادة SSL / Setting up SSL certificate..."
    
    # الحصول على شهادة SSL
    sudo certbot --nginx -d "$DOMAIN" -d "www.$DOMAIN" --email "$EMAIL" --agree-tos --non-interactive
    
    # إنشاء مجلد SSL للدوكر
    mkdir -p nginx/ssl
    
    # نسخ الشهادات
    sudo cp "/etc/letsencrypt/live/$DOMAIN/fullchain.pem" nginx/ssl/cert.pem
    sudo cp "/etc/letsencrypt/live/$DOMAIN/privkey.pem" nginx/ssl/key.pem
    sudo chown -R $USER:$USER nginx/ssl/
    
    print_success "تم إعداد شهادة SSL / SSL certificate configured"
}

# بناء ونشر التطبيق
deploy_application() {
    print_status "بناء ونشر التطبيق / Building and deploying application..."
    
    ENV_FILE=".env"
    if [[ "$ENVIRONMENT" == "production" ]]; then
        ENV_FILE=".env.production"
    fi
    
    # إيقاف الخدمات الحالية
    if docker-compose ps -q | grep -q .; then
        print_status "إيقاف الخدمات الحالية / Stopping current services..."
        docker-compose down
    fi
    
    # بناء ونشر الخدمات الجديدة
    docker-compose --env-file "$ENV_FILE" up --build -d
    
    # انتظار بدء الخدمات
    print_status "انتظار بدء الخدمات / Waiting for services to start..."
    sleep 30
    
    # فحص حالة الخدمات
    if ! docker-compose ps | grep -q "Up"; then
        print_error "فشل في بدء بعض الخدمات / Some services failed to start"
        docker-compose logs
        exit 1
    fi
    
    print_success "تم نشر التطبيق بنجاح / Application deployed successfully"
}

# تحديث تكوين Nginx النهائي
update_nginx_config() {
    print_status "تحديث تكوين Nginx النهائي / Updating final Nginx configuration..."
    
    # استبدال yourdomain.com بالدومين الفعلي في تكوين Nginx
    sed "s/yourdomain\.com/$DOMAIN/g" nginx/nginx.conf > /tmp/nginx_updated.conf
    sudo cp /tmp/nginx_updated.conf /etc/nginx/sites-available/quantum-security
    
    # اختبار وإعادة تحميل التكوين
    sudo nginx -t
    sudo systemctl reload nginx
    
    print_success "تم تحديث تكوين Nginx / Nginx configuration updated"
}

# اختبار النشر
test_deployment() {
    print_status "اختبار النشر / Testing deployment..."
    
    # اختبار الصحة الأساسي
    PROTOCOL="http"
    if [[ "$SKIP_SSL" != true ]]; then
        PROTOCOL="https"
    fi
    
    if curl -f -s "$PROTOCOL://$DOMAIN/health" > /dev/null; then
        print_success "اختبار الصحة نجح / Health check passed"
    else
        print_error "اختبار الصحة فشل / Health check failed"
        return 1
    fi
    
    # اختبار API
    if curl -f -s "$PROTOCOL://$DOMAIN/api/monitoring/status" > /dev/null; then
        print_success "اختبار API نجح / API test passed"
    else
        print_warning "اختبار API فشل / API test failed"
    fi
    
    print_success "اكتمل الاختبار / Testing completed"
}

# عرض معلومات النشر
show_deployment_info() {
    print_success "تم النشر بنجاح! / Deployment completed successfully!"
    echo ""
    echo "معلومات النشر / Deployment Information:"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    
    PROTOCOL="http"
    if [[ "$SKIP_SSL" != true ]]; then
        PROTOCOL="https"
    fi
    
    echo "🌐 الموقع الرئيسي / Main Site: $PROTOCOL://$DOMAIN"
    echo "📊 لوحة Grafana / Grafana Dashboard: $PROTOCOL://grafana.$DOMAIN"
    echo "🔍 لوحة Kibana / Kibana Dashboard: $PROTOCOL://kibana.$DOMAIN"
    echo "💚 فحص الصحة / Health Check: $PROTOCOL://$DOMAIN/health"
    echo ""
    echo "أوامر مفيدة / Useful Commands:"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "# فحص حالة الخدمات / Check services status"
    echo "docker-compose ps"
    echo ""
    echo "# عرض سجلات النظام / View system logs"
    echo "docker-compose logs -f quantum-server"
    echo ""
    echo "# إعادة تشغيل الخدمات / Restart services"
    echo "docker-compose restart"
    echo ""
    echo "# تحديث النظام / Update system"
    echo "./deploy.sh --domain $DOMAIN --email $EMAIL"
}

# الدالة الرئيسية
main() {
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "🚀 نصب نشر النظام الأمني الموحد"
    echo "🚀 Unified Security System Deployment Script"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    
    parse_args "$@"
    validate_input
    check_requirements
    
    # إنشاء نسخة احتياطية
    create_backup
    
    # إعداد البيئة
    setup_environment
    
    # إعداد Nginx المؤقت
    setup_nginx
    
    # بناء ونشر التطبيق
    deploy_application
    
    # إعداد SSL
    setup_ssl
    
    # تحديث تكوين Nginx النهائي
    update_nginx_config
    
    # اختبار النشر
    if ! test_deployment; then
        print_error "فشل في اختبار النشر / Deployment test failed"
        exit 1
    fi
    
    # عرض معلومات النشر
    show_deployment_info
}

# تشغيل الدالة الرئيسية
main "$@"