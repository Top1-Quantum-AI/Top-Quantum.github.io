# Quantum AI System - نظام الذكاء الاصطناعي الكمي

<div align="center">
  <img src="https://img.shields.io/badge/Quantum-Computing-blue?style=for-the-badge&logo=quantum" alt="Quantum Computing">
  <img src="https://img.shields.io/badge/AI-Powered-green?style=for-the-badge&logo=artificial-intelligence" alt="AI Powered">
  <img src="https://img.shields.io/badge/Node.js-18+-brightgreen?style=for-the-badge&logo=node.js" alt="Node.js">
  <img src="https://img.shields.io/badge/React-18+-blue?style=for-the-badge&logo=react" alt="React">
  <img src="https://img.shields.io/badge/MongoDB-Database-green?style=for-the-badge&logo=mongodb" alt="MongoDB">
  <img src="https://img.shields.io/badge/Redis-Cache-red?style=for-the-badge&logo=redis" alt="Redis">
</div>

## 🌟 Overview - نظرة عامة

Quantum AI System is a cutting-edge platform that combines quantum computing principles with artificial intelligence to provide advanced computational capabilities. The system offers quantum state management, algorithm execution, and AI-powered analysis with bilingual support (English/Arabic).

نظام الذكاء الاصطناعي الكمي هو منصة متطورة تجمع بين مبادئ الحوسبة الكمية والذكاء الاصطناعي لتوفير قدرات حاسوبية متقدمة. يوفر النظام إدارة الحالات الكمية وتنفيذ الخوارزميات والتحليل المدعوم بالذكاء الاصطناعي مع الدعم ثنائي اللغة.

## ✨ Features - الميزات

### 🔬 Quantum Computing - الحوسبة الكمية
- **Quantum State Management** - إدارة الحالات الكمية
- **Quantum Gate Operations** - عمليات البوابات الكمية
- **Algorithm Implementation** - تنفيذ الخوارزميات
  - Grover's Algorithm - خوارزمية جروفر
  - Quantum Fourier Transform - تحويل فورييه الكمي
  - Shor's Algorithm - خوارزمية شور
  - Variational Quantum Eigensolver (VQE) - حلال القيم الذاتية الكمي المتغير
- **Quantum Measurement** - القياس الكمي
- **State Visualization** - تصور الحالات

### 🤖 AI Integration - تكامل الذكاء الاصطناعي
- **Multiple AI Personalities** - شخصيات ذكاء اصطناعي متعددة
  - Quantum Assistant - المساعد الكمي
  - Creative Quantum - الكمي الإبداعي
  - Analytical Quantum - الكمي التحليلي
  - Educational Quantum - الكمي التعليمي
- **Quantum-Enhanced Processing** - معالجة محسنة كمياً
- **Conversation History** - تاريخ المحادثات
- **Feedback System** - نظام التقييم

### 👥 User Management - إدارة المستخدمين
- **Authentication & Authorization** - المصادقة والتخويل
- **Subscription Tiers** - مستويات الاشتراك
  - Free - مجاني
  - Basic - أساسي
  - Premium - مميز
  - Enterprise - مؤسسي
- **Profile Management** - إدارة الملف الشخصي
- **Usage Tracking** - تتبع الاستخدام

### 📊 Monitoring & Analytics - المراقبة والتحليلات
- **Real-time System Monitoring** - مراقبة النظام في الوقت الفعلي
- **Performance Metrics** - مقاييس الأداء
- **Alert System** - نظام التنبيهات
- **Health Checks** - فحوصات الصحة
- **Usage Statistics** - إحصائيات الاستخدام

### 🌐 Bilingual Support - الدعم ثنائي اللغة
- **English & Arabic Interface** - واجهة إنجليزية وعربية
- **Localized Error Messages** - رسائل خطأ محلية
- **Cultural Adaptation** - تكيف ثقافي

## 🏗️ Architecture - البنية

### Backend - الخلفية
```
server/
├── index.js                 # Main server file - ملف الخادم الرئيسي
├── models/                  # Database models - نماذج قاعدة البيانات
│   ├── User.js             # User model - نموذج المستخدم
│   └── Conversation.js     # Conversation model - نموذج المحادثة
├── routes/                  # API routes - مسارات API
│   ├── auth.js             # Authentication routes - مسارات المصادقة
│   ├── ai.js               # AI routes - مسارات الذكاء الاصطناعي
│   ├── quantum.js          # Quantum routes - مسارات الحوسبة الكمية
│   ├── user.js             # User routes - مسارات المستخدم
│   └── monitoring.js       # Monitoring routes - مسارات المراقبة
├── services/                # Business logic - منطق العمل
│   ├── ai.js               # AI service - خدمة الذكاء الاصطناعي
│   ├── quantum.js          # Quantum service - خدمة الحوسبة الكمية
│   └── monitoring.js       # Monitoring service - خدمة المراقبة
├── middleware/              # Express middleware - وسطاء Express
│   └── auth.js             # Authentication middleware - وسطاء المصادقة
└── utils/                   # Utility functions - وظائف مساعدة
```

### Frontend - الواجهة الأمامية
```
src/
├── components/              # React components - مكونات React
├── pages/                   # Page components - مكونات الصفحات
├── hooks/                   # Custom hooks - خطافات مخصصة
├── services/                # API services - خدمات API
├── utils/                   # Utility functions - وظائف مساعدة
└── styles/                  # CSS styles - أنماط CSS
```

## 🚀 Quick Start - البدء السريع

### Prerequisites - المتطلبات المسبقة
- Node.js 18+ - Node.js 18 أو أحدث
- MongoDB 5+ - MongoDB 5 أو أحدث
- Redis 6+ - Redis 6 أو أحدث
- npm or yarn - npm أو yarn

### Installation - التثبيت

1. **Clone the repository - استنساخ المستودع**
```bash
git clone <repository-url>
cd Top1
```

2. **Install dependencies - تثبيت التبعيات**
```bash
# Install server dependencies - تثبيت تبعيات الخادم
npm install

# Install client dependencies - تثبيت تبعيات العميل
cd client
npm install
cd ..
```

3. **Environment Setup - إعداد البيئة**
```bash
# Copy environment files - نسخ ملفات البيئة
cp .env.example .env.development
cp .env.example .env.production

# Edit environment variables - تحرير متغيرات البيئة
# Configure MongoDB, Redis, and API keys
```

4. **Start the application - تشغيل التطبيق**
```bash
# Development mode - وضع التطوير
npm run dev

# Production mode - وضع الإنتاج
npm run build
npm start
```

### Docker Setup - إعداد Docker

```bash
# Build and run with Docker Compose - البناء والتشغيل مع Docker Compose
docker-compose up -d

# View logs - عرض السجلات
docker-compose logs -f

# Stop services - إيقاف الخدمات
docker-compose down
```

## 📖 API Documentation - توثيق API

### Authentication Endpoints - نقاط المصادقة

#### Register User - تسجيل مستخدم
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "user123",
  "email": "user@example.com",
  "password": "securePassword123",
  "firstName": "John",
  "lastName": "Doe"
}
```

#### Login - تسجيل الدخول
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

### AI Endpoints - نقاط الذكاء الاصطناعي

#### Chat with AI - الدردشة مع الذكاء الاصطناعي
```http
POST /api/ai/chat
Authorization: Bearer <token>
Content-Type: application/json

{
  "message": "Explain quantum superposition",
  "conversationId": "optional-conversation-id",
  "personality": "quantum",
  "language": "en"
}
```

#### Quantum Analysis - التحليل الكمي
```http
POST /api/ai/quantum-analyze
Authorization: Bearer <token>
Content-Type: application/json

{
  "text": "Text to analyze with quantum principles",
  "analysisType": ["complexity", "uncertainty", "entanglement"],
  "depth": "advanced"
}
```

### Quantum Endpoints - نقاط الحوسبة الكمية

#### Create Quantum State - إنشاء حالة كمية
```http
POST /api/quantum/create-state
Authorization: Bearer <token>
Content-Type: application/json

{
  "numQubits": 3,
  "initialState": "000",
  "name": "My Quantum State"
}
```

#### Apply Quantum Gate - تطبيق بوابة كمية
```http
POST /api/quantum/apply-gate
Authorization: Bearer <token>
Content-Type: application/json

{
  "stateId": "state-id",
  "gateType": "H",
  "targetQubit": 0
}
```

#### Run Quantum Algorithm - تشغيل خوارزمية كمية
```http
POST /api/quantum/run-algorithm
Authorization: Bearer <token>
Content-Type: application/json

{
  "algorithm": "grover",
  "numQubits": 4,
  "parameters": {
    "targetState": "1010"
  }
}
```

## 🔧 Configuration - التكوين

### Environment Variables - متغيرات البيئة

```env
# Server Configuration - تكوين الخادم
PORT=3000
NODE_ENV=development

# Database Configuration - تكوين قاعدة البيانات
MONGODB_URI=mongodb://localhost:27017/quantum-ai
REDIS_URL=redis://localhost:6379

# JWT Configuration - تكوين JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d

# AI Configuration - تكوين الذكاء الاصطناعي
OPENAI_API_KEY=your-openai-api-key
AI_MODEL=gpt-4
AI_MAX_TOKENS=2000

# Email Configuration - تكوين البريد الإلكتروني
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Security Configuration - تكوين الأمان
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX=100

# Monitoring Configuration - تكوين المراقبة
MONITORING_ENABLED=true
ALERT_EMAIL=admin@example.com
```

### Subscription Tiers - مستويات الاشتراك

| Feature | Free | Basic | Premium | Enterprise |
|---------|------|-------|---------|------------|
| Daily API Calls | 50 | 200 | 1,000 | Unlimited |
| Monthly API Calls | 1,000 | 5,000 | 25,000 | Unlimited |
| Quantum Algorithms | ❌ | ✅ | ✅ | ✅ |
| Advanced Analytics | ❌ | ❌ | ✅ | ✅ |
| Priority Support | ❌ | ❌ | ✅ | ✅ |
| Custom Models | ❌ | ❌ | ❌ | ✅ |

## 🧪 Testing - الاختبار

### Running Tests - تشغيل الاختبارات

```bash
# Run all tests - تشغيل جميع الاختبارات
npm test

# Run tests with coverage - تشغيل الاختبارات مع التغطية
npm run test:coverage

# Run specific test suite - تشغيل مجموعة اختبارات محددة
npm test -- --grep "Quantum"

# Run tests in watch mode - تشغيل الاختبارات في وضع المراقبة
npm run test:watch
```

### Test Structure - هيكل الاختبارات

```
tests/
├── unit/                    # Unit tests - اختبارات الوحدة
│   ├── services/           # Service tests - اختبارات الخدمات
│   ├── models/             # Model tests - اختبارات النماذج
│   └── utils/              # Utility tests - اختبارات المساعدات
├── integration/            # Integration tests - اختبارات التكامل
│   ├── auth.test.js       # Auth integration - تكامل المصادقة
│   ├── ai.test.js         # AI integration - تكامل الذكاء الاصطناعي
│   └── quantum.test.js    # Quantum integration - تكامل الحوسبة الكمية
└── e2e/                   # End-to-end tests - اختبارات شاملة
```

## 📊 Monitoring - المراقبة

### Health Checks - فحوصات الصحة

```http
GET /api/monitoring/health
```

Response:
```json
{
  "success": true,
  "status": "healthy",
  "data": {
    "system": {
      "status": "healthy",
      "uptime": 3600,
      "version": "v18.17.0"
    },
    "services": {
      "database": "connected",
      "redis": "connected",
      "ai": "operational",
      "quantum": "operational"
    }
  }
}
```

### Metrics Dashboard - لوحة المقاييس

Access the monitoring dashboard at:
- Development: `http://localhost:3000/api/monitoring/dashboard`
- Production: `https://your-domain.com/api/monitoring/dashboard`

## 🔒 Security - الأمان

### Security Features - ميزات الأمان
- **JWT Authentication** - مصادقة JWT
- **Password Hashing** - تشفير كلمات المرور
- **Rate Limiting** - تحديد المعدل
- **Input Validation** - التحقق من المدخلات
- **CORS Protection** - حماية CORS
- **Helmet Security Headers** - رؤوس أمان Helmet
- **Account Lockout** - قفل الحساب
- **Email Verification** - التحقق من البريد الإلكتروني

### Security Best Practices - أفضل ممارسات الأمان
1. **Use strong passwords** - استخدم كلمات مرور قوية
2. **Enable 2FA when available** - فعل المصادقة الثنائية عند توفرها
3. **Keep dependencies updated** - حافظ على تحديث التبعيات
4. **Use HTTPS in production** - استخدم HTTPS في الإنتاج
5. **Regular security audits** - عمليات تدقيق أمني منتظمة

## 🚀 Deployment - النشر

### Production Deployment - نشر الإنتاج

See [PRODUCTION_SETUP.md](./PRODUCTION_SETUP.md) for detailed production deployment instructions.

راجع [PRODUCTION_SETUP.md](./PRODUCTION_SETUP.md) للحصول على تعليمات مفصلة لنشر الإنتاج.

### Docker Deployment - نشر Docker

```bash
# Build production image - بناء صورة الإنتاج
docker build -t quantum-ai:latest .

# Run with Docker Compose - التشغيل مع Docker Compose
docker-compose -f docker-compose.prod.yml up -d

# Scale services - توسيع الخدمات
docker-compose -f docker-compose.prod.yml up -d --scale app=3
```

### Cloud Deployment - النشر السحابي

#### AWS Deployment - نشر AWS
- Use ECS or EKS for container orchestration
- RDS for MongoDB hosting
- ElastiCache for Redis
- CloudFront for CDN
- Route 53 for DNS

#### Azure Deployment - نشر Azure
- Azure Container Instances
- Azure Cosmos DB
- Azure Cache for Redis
- Azure CDN
- Azure DNS

## 🤝 Contributing - المساهمة

### Development Workflow - سير عمل التطوير

1. **Fork the repository** - انسخ المستودع
2. **Create a feature branch** - أنشئ فرع ميزة
```bash
git checkout -b feature/amazing-feature
```
3. **Make your changes** - قم بإجراء تغييراتك
4. **Add tests** - أضف اختبارات
5. **Run tests** - شغل الاختبارات
```bash
npm test
```
6. **Commit your changes** - اعتمد تغييراتك
```bash
git commit -m "Add amazing feature"
```
7. **Push to the branch** - ادفع إلى الفرع
```bash
git push origin feature/amazing-feature
```
8. **Open a Pull Request** - افتح طلب سحب

### Code Style - نمط الكود

- Use ESLint and Prettier for code formatting
- Follow JavaScript Standard Style
- Write meaningful commit messages
- Add JSDoc comments for functions
- Use TypeScript for type safety (when applicable)

### Pull Request Guidelines - إرشادات طلب السحب

- Provide a clear description of changes
- Include relevant issue numbers
- Add screenshots for UI changes
- Ensure all tests pass
- Update documentation if needed

## 📚 Documentation - التوثيق

### Additional Documentation - توثيق إضافي

- [API Reference](./docs/API.md) - مرجع API
- [Quantum Computing Guide](./docs/QUANTUM.md) - دليل الحوسبة الكمية
- [AI Integration Guide](./docs/AI.md) - دليل تكامل الذكاء الاصطناعي
- [Deployment Guide](./docs/DEPLOYMENT.md) - دليل النشر
- [Troubleshooting](./docs/TROUBLESHOOTING.md) - استكشاف الأخطاء وإصلاحها

### Learning Resources - مصادر التعلم

#### Quantum Computing - الحوسبة الكمية
- [IBM Qiskit Textbook](https://qiskit.org/textbook/)
- [Microsoft Quantum Development Kit](https://azure.microsoft.com/en-us/products/quantum/)
- [Quantum Computing: An Applied Approach](https://www.springer.com/gp/book/9783030239213)

#### AI & Machine Learning - الذكاء الاصطناعي والتعلم الآلي
- [OpenAI Documentation](https://platform.openai.com/docs)
- [TensorFlow Quantum](https://www.tensorflow.org/quantum)
- [Quantum Machine Learning](https://pennylane.ai/)

## 🐛 Troubleshooting - استكشاف الأخطاء وإصلاحها

### Common Issues - المشاكل الشائعة

#### Database Connection Issues - مشاكل اتصال قاعدة البيانات
```bash
# Check MongoDB status - فحص حالة MongoDB
sudo systemctl status mongod

# Restart MongoDB - إعادة تشغيل MongoDB
sudo systemctl restart mongod

# Check connection string - فحص سلسلة الاتصال
echo $MONGODB_URI
```

#### Redis Connection Issues - مشاكل اتصال Redis
```bash
# Check Redis status - فحص حالة Redis
redis-cli ping

# Restart Redis - إعادة تشغيل Redis
sudo systemctl restart redis

# Check Redis logs - فحص سجلات Redis
sudo journalctl -u redis
```

#### Memory Issues - مشاكل الذاكرة
```bash
# Check memory usage - فحص استخدام الذاكرة
free -h

# Check Node.js memory usage - فحص استخدام ذاكرة Node.js
node --max-old-space-size=4096 index.js
```

### Getting Help - الحصول على المساعدة

- 📧 Email: support@quantum-ai.com
- 💬 Discord: [Join our community](https://discord.gg/quantum-ai)
- 📖 Documentation: [docs.quantum-ai.com](https://docs.quantum-ai.com)
- 🐛 Issues: [GitHub Issues](https://github.com/your-repo/issues)

## 📄 License - الترخيص

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

هذا المشروع مرخص تحت رخصة MIT - راجع ملف [LICENSE](LICENSE) للتفاصيل.

## 🙏 Acknowledgments - الشكر والتقدير

- OpenAI for providing advanced AI capabilities
- IBM Qiskit for quantum computing inspiration
- The open-source community for amazing tools and libraries
- Contributors and beta testers

---

<div align="center">
  <p>Made with ❤️ by the Quantum AI Team</p>
  <p>صُنع بـ ❤️ من قبل فريق الذكاء الاصطناعي الكمي</p>
  
  <p>
    <a href="#top">Back to top - العودة إلى الأعلى</a>
  </p>
</div>