# Frontend Development Dockerfile
# ملف Docker للتطوير للواجهة الأمامية

FROM node:20-alpine AS base

# إعداد متغيرات البيئة
ENV NODE_ENV=development \
    VITE_HOST=0.0.0.0 \
    VITE_PORT=5173

# تثبيت الأدوات الأساسية
RUN apk add --no-cache \
    dumb-init \
    python3 \
    make \
    g++ \
    libc6-compat

# إنشاء مستخدم غير جذر للأمان
RUN addgroup -g 1001 -S viteuser && \
    adduser -S viteuser -u 1001 -G viteuser

# إعداد دليل العمل
WORKDIR /app

# نسخ ملفات إدارة التبعيات
COPY package*.json ./
COPY tsconfig*.json ./
COPY vite.config.ts ./

# تثبيت التبعيات
RUN npm ci --include=dev --prefer-offline

# نسخ الكود المصدري
COPY src/ ./src/
COPY public/ ./public/
COPY index.html ./
COPY .eslintrc.json ./

# إنشاء الدلائل المطلوبة وإعداد الأذونات
RUN mkdir -p /app/node_modules/.vite && \
    chown -R viteuser:viteuser /app

# التبديل للمستخدم غير الجذر
USER viteuser

# فحص صحة الحاوية
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
    CMD curl -f http://localhost:5173/ || exit 1

# كشف المنفذ
EXPOSE 5173

# نقطة الدخول الآمنة
ENTRYPOINT ["dumb-init", "--"]
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5173"]