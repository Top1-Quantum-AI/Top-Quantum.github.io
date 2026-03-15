# Multi-stage Dockerfile للنظام الكمي المتقدم
# Advanced Quantum AI System Container

# مرحلة البناء الأساسية
FROM node:20-alpine AS base

# إعداد متغيرات البناء
ARG NODE_ENV=production
ARG BUILD_DATE
ARG VCS_REF
ARG VERSION=1.0.0

# إضافة البيانات الوصفية
LABEL maintainer="Quantum AI Team <quantum@company.com>" \
      org.opencontainers.image.title="Quantum AI System" \
      org.opencontainers.image.description="Advanced Hybrid Quantum AI System" \
      org.opencontainers.image.version="$VERSION" \
      org.opencontainers.image.created="$BUILD_DATE" \
      org.opencontainers.image.revision="$VCS_REF" \
      org.opencontainers.image.vendor="Quantum AI Company" \
      org.opencontainers.image.licenses="MIT" \
      org.opencontainers.image.source="https://github.com/company/quantum-ai-system"

# تثبيت الأدوات الأساسية والمكتبات المطلوبة
RUN apk add --no-cache \
    dumb-init \
    python3 \
    py3-pip \
    make \
    g++ \
    libc6-compat \
    openssl \
    ca-certificates \
    && rm -rf /var/cache/apk/*

# إنشاء مستخدم غير جذر للأمان
RUN addgroup -g 1001 -S quantum && \
    adduser -S quantum -u 1001 -G quantum

# إعداد دليل العمل
WORKDIR /app

# نسخ ملفات إدارة التبعيات
COPY package*.json ./
COPY tsconfig.json ./
COPY jest.config.js ./
COPY .eslintrc.json ./

# ================================
# مرحلة تثبيت التبعيات
# ================================
FROM base AS dependencies

# تثبيت جميع التبعيات (للبناء والإنتاج)
RUN npm ci --include=dev --prefer-offline --no-audit

# ================================
# مرحلة البناء
# ================================
FROM dependencies AS build

# نسخ الكود المصدري
COPY src/ ./src/
COPY server/ ./server/
COPY public/ ./public/
COPY index.html ./
COPY vite.config.ts ./

# بناء التطبيق
RUN npm run build && \
    npm run build:server

# تنظيف ملفات البناء غير المطلوبة
RUN rm -rf src/ && \
    rm -rf node_modules/@types && \
    rm -rf node_modules/.cache

# ================================
# مرحلة تبعيات الإنتاج
# ================================
FROM base AS production-deps

# تثبيت تبعيات الإنتاج فقط
RUN npm ci --omit=dev --prefer-offline --no-audit && \
    npm cache clean --force

# ================================
# مرحلة الإنتاج النهائية
# ================================
FROM base AS production

# إعداد متغيرات البيئة
ENV NODE_ENV=production \
    PORT=3000 \
    HOST=0.0.0.0 \
    NODE_OPTIONS="--max-old-space-size=2048" \
    UV_THREADPOOL_SIZE=128

# نسخ تبعيات الإنتاج
COPY --from=production-deps --chown=quantum:quantum /app/node_modules ./node_modules

# نسخ الملفات المبنية
COPY --from=build --chown=quantum:quantum /app/dist ./dist
COPY --from=build --chown=quantum:quantum /app/server-dist ./server-dist
COPY --from=build --chown=quantum:quantum /app/package.json ./package.json

# نسخ الملفات الإضافية المطلوبة
COPY --chown=quantum:quantum server.js ./
COPY --chown=quantum:quantum README.md ./

# إنشاء الدلائل المطلوبة
RUN mkdir -p /app/logs /app/data /app/temp && \
    chown -R quantum:quantum /app/logs /app/data /app/temp

# إعداد الأذونات الأمنية
RUN chmod -R 755 /app && \
    chmod -R 700 /app/logs /app/data /app/temp

# التبديل للمستخدم غير الجذر
USER quantum

# فحص صحة الحاوية
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3000/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) }).on('error', () => process.exit(1))"

# كشف المنافذ
EXPOSE 3000

# نقطة الدخول الآمنة
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "server.js"]

# ================================
# مرحلة التطوير (اختيارية)
# ================================
FROM dependencies AS development

# إعداد متغيرات بيئة التطوير
ENV NODE_ENV=development \
    PORT=3000 \
    HOST=0.0.0.0

# نسخ جميع الملفات للتطوير
COPY --chown=quantum:quantum . .

# إنشاء الدلائل المطلوبة
RUN mkdir -p /app/logs /app/data /app/temp && \
    chown -R quantum:quantum /app

# التبديل للمستخدم غير الجذر
USER quantum

# كشف المنافذ للتطوير
EXPOSE 3000 5173

# أمر التطوير
CMD ["npm", "run", "dev"]

# ================================
# مرحلة الاختبار (اختيارية)
# ================================
FROM dependencies AS test

# إعداد متغيرات بيئة الاختبار
ENV NODE_ENV=test \
    CI=true

# نسخ جميع الملفات للاختبار
COPY --chown=quantum:quantum . .

# إنشاء دليل تقارير الاختبار
RUN mkdir -p /app/coverage /app/test-results && \
    chown -R quantum:quantum /app

# التبديل للمستخدم غير الجذر
USER quantum

# أمر الاختبار
CMD ["npm", "test"]