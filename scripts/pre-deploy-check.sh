#!/bin/bash

# فحص ما قبل النشر - النظام الأمني الموحد
# Pre-deployment check - Unified Security System

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

# متغيرات الفحص
CHECKS_PASSED=0
CHECKS_FAILED=0
CHECKS_WARNING=0

# دالة تسجيل النتيجة
log_result() {
    case $1 in
        "pass")
            CHECKS_PASSED=$((CHECKS_PASSED + 1))
            print_success "$2"
            ;;
        "fail")
            CHECKS_FAILED=$((CHECKS_FAILED + 1))
            print_error "$2"
            ;;
        "warn")
            CHECKS_WARNING=$((CHECKS_WARNING + 1))
            print_warning "$2"
            ;;
    esac
}

# فحص متطلبات النظام
check_system_requirements() {
    print_status "فحص متطلبات النظام / Checking system requirements..."
    
    # فحص Docker
    if command -v docker &> /dev/null; then
        DOCKER_VERSION=$(docker --version | cut -d' ' -f3 | cut -d',' -f1)
        log_result "pass" "Docker متاح (إصدار $DOCKER_VERSION) / Docker available (version $DOCKER_VERSION)"
    else
        log_result "fail" "Docker غير مثبت / Docker not installed"
    fi
    
    # فحص Docker Compose
    if command -v docker-compose &> /dev/null; then
        COMPOSE_VERSION=$(docker-compose --version | cut -d' ' -f3 | cut -d',' -f1)
        log_result "pass" "Docker Compose متاح (إصدار $COMPOSE_VERSION) / Docker Compose available (version $COMPOSE_VERSION)"
    else
        log_result "fail" "Docker Compose غير مثبت / Docker Compose not installed"
    fi
    
    # فحص Nginx
    if command -v nginx &> /dev/null; then
        NGINX_VERSION=$(nginx -v 2>&1 | cut -d' ' -f3)
        log_result "pass" "Nginx متاح ($NGINX_VERSION) / Nginx available ($NGINX_VERSION)"
    else
        log_result "fail" "Nginx غير مثبت / Nginx not installed"
    fi
    
    # فحص Node.js
    if command -v node &> /dev/null; then
        NODE_VERSION=$(node --version)
        log_result "pass" "Node.js متاح ($NODE_VERSION) / Node.js available ($NODE_VERSION)"
    else
        log_result "warn" "Node.js غير مثبت - قد يكون مطلوباً للتطوير / Node.js not installed - may be needed for development"
    fi
    
    # فحص Certbot
    if command -v certbot &> /dev/null; then
        CERTBOT_VERSION=$(certbot --version | cut -d' ' -f2)
        log_result "pass" "Certbot متاح ($CERTBOT_VERSION) / Certbot available ($CERTBOT_VERSION)"
    else
        log_result "warn" "Certbot غير مثبت - مطلوب لشهادات SSL / Certbot not installed - required for SSL certificates"
    fi
}

# فحص ملفات التكوين
check_configuration_files() {
    print_status "فحص ملفات التكوين / Checking configuration files..."
    
    # فحص docker-compose.yml
    if [[ -f "docker-compose.yml" ]]; then
        if docker-compose config -q; then
            log_result "pass" "docker-compose.yml صحيح / docker-compose.yml is valid"
        else
            log_result "fail" "docker-compose.yml يحتوي على أخطاء / docker-compose.yml contains errors"
        fi
    else
        log_result "fail" "docker-compose.yml غير موجود / docker-compose.yml not found"
    fi
    
    # فحص ملف البيئة
    if [[ -f ".env" ]]; then
        log_result "pass" ".env موجود / .env file exists"
        
        # فحص المتغيرات المهمة
        if grep -q "OPENAI_API_KEY=" .env; then
            if grep -q "OPENAI_API_KEY=sk-" .env; then
                log_result "pass" "OPENAI_API_KEY مكون / OPENAI_API_KEY configured"
            else
                log_result "warn" "OPENAI_API_KEY قد يكون غير صحيح / OPENAI_API_KEY may be invalid"
            fi
        else
            log_result "warn" "OPENAI_API_KEY غير موجود / OPENAI_API_KEY not found"
        fi
        
        if grep -q "JWT_SECRET=" .env; then
            log_result "pass" "JWT_SECRET مكون / JWT_SECRET configured"
        else
            log_result "warn" "JWT_SECRET غير موجود / JWT_SECRET not found"
        fi
    else
        log_result "warn" ".env غير موجود - سيتم إنشاؤه تلقائياً / .env not found - will be created automatically"
    fi
    
    # فحص تكوين Nginx
    if [[ -f "nginx/nginx.conf" ]]; then
        log_result "pass" "nginx/nginx.conf موجود / nginx/nginx.conf exists"
    else
        log_result "fail" "nginx/nginx.conf غير موجود / nginx/nginx.conf not found"
    fi
    
    # فحص Dockerfile
    if [[ -f "Dockerfile" ]]; then
        log_result "pass" "Dockerfile موجود / Dockerfile exists"
    else
        log_result "fail" "Dockerfile غير موجود / Dockerfile not found"
    fi
}

# فحص البنية والملفات
check_project_structure() {
    print_status "فحص بنية المشروع / Checking project structure..."
    
    # المجلدات الأساسية
    local required_dirs=("src" "server" "nginx" "logs" "scripts")
    
    for dir in "${required_dirs[@]}"; do
        if [[ -d "$dir" ]]; then
            log_result "pass" "مجلد $dir موجود / Directory $dir exists"
        else
            if [[ "$dir" == "logs" ]] || [[ "$dir" == "scripts" ]]; then
                log_result "warn" "مجلد $dir غير موجود - سيتم إنشاؤه / Directory $dir missing - will be created"
            else
                log_result "fail" "مجلد $dir مطلوب / Directory $dir required"
            fi
        fi
    done
    
    # الملفات الأساسية
    local required_files=("package.json" "server/index.js" "src/main.tsx")
    
    for file in "${required_files[@]}"; do
        if [[ -f "$file" ]]; then
            log_result "pass" "ملف $file موجود / File $file exists"
        else
            log_result "fail" "ملف $file مطلوب / File $file required"
        fi
    done
}

# فحص المنافذ
check_ports() {
    print_status "فحص المنافذ / Checking ports..."
    
    local ports=(80 443 3000 5173 27017 6379 9090 3001 9200 5601)
    
    for port in "${ports[@]}"; do
        if netstat -tuln 2>/dev/null | grep -q ":$port "; then
            log_result "warn" "المنفذ $port مستخدم / Port $port is in use"
        else
            log_result "pass" "المنفذ $port متاح / Port $port available"
        fi
    done
}

# فحص الموارد
check_resources() {
    print_status "فحص موارد النظام / Checking system resources..."
    
    # فحص المساحة المتاحة
    DISK_USAGE=$(df . | tail -1 | awk '{print $5}' | sed 's/%//')
    if [[ $DISK_USAGE -lt 80 ]]; then
        log_result "pass" "مساحة القرص كافية (${DISK_USAGE}% مستخدمة) / Disk space sufficient (${DISK_USAGE}% used)"
    else
        log_result "warn" "مساحة القرص منخفضة (${DISK_USAGE}% مستخدمة) / Disk space low (${DISK_USAGE}% used)"
    fi
    
    # فحص الذاكرة
    if command -v free &> /dev/null; then
        MEMORY_USAGE=$(free | grep Mem | awk '{printf "%.0f", $3/$2 * 100.0}')
        if [[ $MEMORY_USAGE -lt 80 ]]; then
            log_result "pass" "الذاكرة كافية (${MEMORY_USAGE}% مستخدمة) / Memory sufficient (${MEMORY_USAGE}% used)"
        else
            log_result "warn" "استخدام الذاكرة مرتفع (${MEMORY_USAGE}% مستخدمة) / High memory usage (${MEMORY_USAGE}% used)"
        fi
    fi
}

# فحص خدمات Docker الحالية
check_docker_services() {
    print_status "فحص خدمات Docker / Checking Docker services..."
    
    if docker ps -q &> /dev/null; then
        RUNNING_CONTAINERS=$(docker ps -q | wc -l)
        if [[ $RUNNING_CONTAINERS -gt 0 ]]; then
            log_result "warn" "$RUNNING_CONTAINERS حاوية تعمل حالياً / $RUNNING_CONTAINERS containers currently running"
            docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
        else
            log_result "pass" "لا توجد حاويات تعمل / No containers running"
        fi
    else
        log_result "fail" "خدمة Docker غير متاحة / Docker service not available"
    fi
}

# فحص الأمان
check_security() {
    print_status "فحص إعدادات الأمان / Checking security settings..."
    
    # فحص جدار الحماية
    if command -v ufw &> /dev/null; then
        UFW_STATUS=$(ufw status | grep "Status:" | cut -d' ' -f2)
        if [[ "$UFW_STATUS" == "active" ]]; then
            log_result "pass" "جدار الحماية UFW نشط / UFW firewall active"
        else
            log_result "warn" "جدار الحماية UFW غير نشط / UFW firewall inactive"
        fi
    elif command -v firewall-cmd &> /dev/null; then
        if firewall-cmd --state &> /dev/null; then
            log_result "pass" "جدار الحماية FirewallD نشط / FirewallD active"
        else
            log_result "warn" "جدار الحماية FirewallD غير نشط / FirewallD inactive"
        fi
    else
        log_result "warn" "لم يتم العثور على جدار حماية / No firewall found"
    fi
    
    # فحص صلاحيات الملفات
    if [[ -f ".env" ]]; then
        ENV_PERMS=$(stat -c "%a" .env 2>/dev/null || stat -f "%A" .env 2>/dev/null)
        if [[ "$ENV_PERMS" == "600" ]] || [[ "$ENV_PERMS" == "640" ]]; then
            log_result "pass" "صلاحيات ملف .env آمنة ($ENV_PERMS) / .env file permissions secure ($ENV_PERMS)"
        else
            log_result "warn" "صلاحيات ملف .env قد تكون غير آمنة ($ENV_PERMS) / .env file permissions may be insecure ($ENV_PERMS)"
        fi
    fi
}

# إنشاء تقرير الفحص
generate_report() {
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "📋 تقرير فحص ما قبل النشر / Pre-deployment Check Report"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "✅ الفحوصات الناجحة / Passed Checks: $CHECKS_PASSED"
    echo "⚠️  التحذيرات / Warnings: $CHECKS_WARNING"
    echo "❌ الفحوصات الفاشلة / Failed Checks: $CHECKS_FAILED"
    echo ""
    
    if [[ $CHECKS_FAILED -eq 0 ]]; then
        print_success "النظام جاهز للنشر! / System ready for deployment!"
        if [[ $CHECKS_WARNING -gt 0 ]]; then
            print_warning "توجد بعض التحذيرات التي يُفضل معالجتها / Some warnings should be addressed"
        fi
        echo ""
        echo "لنشر النظام، استخدم الأمر التالي:"
        echo "To deploy the system, use the following command:"
        echo "./scripts/deploy.sh --domain yourdomain.com --email your@email.com"
        return 0
    else
        print_error "النظام غير جاهز للنشر! / System not ready for deployment!"
        echo ""
        echo "يرجى حل المشاكل المذكورة أعلاه قبل المتابعة"
        echo "Please resolve the issues mentioned above before proceeding"
        return 1
    fi
}

# إنشاء المجلدات المطلوبة
create_required_directories() {
    print_status "إنشاء المجلدات المطلوبة / Creating required directories..."
    
    local dirs=("logs" "logs/nginx" "logs/server" "nginx/ssl" "backups" "scripts")
    
    for dir in "${dirs[@]}"; do
        if [[ ! -d "$dir" ]]; then
            mkdir -p "$dir"
            log_result "pass" "تم إنشاء مجلد $dir / Created directory $dir"
        fi
    done
}

# الدالة الرئيسية
main() {
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "🔍 فحص ما قبل النشر - النظام الأمني الموحد"
    echo "🔍 Pre-deployment Check - Unified Security System"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    
    # إنشاء المجلدات المطلوبة
    create_required_directories
    
    # تشغيل جميع الفحوصات
    check_system_requirements
    check_configuration_files
    check_project_structure
    check_ports
    check_resources
    check_docker_services
    check_security
    
    # إنشاء التقرير
    generate_report
}

# تشغيل الدالة الرئيسية
main "$@"