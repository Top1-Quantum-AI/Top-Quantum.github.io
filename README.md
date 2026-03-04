<div align="center">

# ⚛️ Top1-Quantum-AI

### نظام الثورة الكمية المتقدم  
### Advanced Quantum AI System

**v2.0.0** · React 18 · TypeScript · Vite · Tailwind CSS

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.2-61dafb.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-4.4-646cff.svg)](https://vitejs.dev/)
[![Tests](https://img.shields.io/badge/Tests-102%20passing-brightgreen.svg)](#testing)

</div>

---

## 🌐 نظرة عامة | Overview

**Top1-Quantum-AI** هو تطبيق ويب متقدم مبني بـ **React 18 + TypeScript + Vite**، يجمع بين محاكاة الحوسبة الكمية وتقنيات الذكاء الاصطناعي وأنظمة الأمان السيبراني. يوفر لوحة تحكم متكاملة للمراقبة والتحليل والأمان مع واجهة مستخدم عربية (RTL).

**Top1-Quantum-AI** is an advanced web application that combines quantum computing simulation, AI technologies, and cybersecurity systems. It provides an integrated dashboard for real-time monitoring, analysis, and security with an Arabic (RTL) user interface.

---

## ✨ المميزات | Features

| المميزة | Feature |
|---------|---------|
| ⚛️ لوحة تحكم كمية متقدمة | Advanced quantum computing dashboard |
| 🤖 إدارة وكلاء الذكاء الاصطناعي | AI agent management & orchestration |
| 🔐 نظام أمان مع تشفير كمي | Cybersecurity with quantum encryption |
| 📊 مراقبة الأداء في الوقت الفعلي | Real-time performance monitoring |
| 🌐 مراقبة الشبكة | Network monitoring dashboard |
| 🎨 دعم الوضع المظلم والفاتح | Dark / Light mode support |
| 🔔 إشعارات وتنبيهات ذكية | Smart notifications & alerts |
| 📈 تحليلات ورسوم بيانية متقدمة | Advanced analytics & charts |
| ⚙️ إعدادات قابلة للتخصيص | Fully customizable settings |
| 🌍 دعم ثنائي اللغة (العربية/الإنجليزية) | Bilingual support (Arabic / English) |
| 💡 عرض للمستثمرين | Investor pitch presentation |
| 🏥 تشخيص سير العمل | Workflow diagnostic tool |

---

## 🛠️ التقنيات المستخدمة | Tech Stack

### الواجهة الأمامية | Frontend
| التقنية | الإصدار | الغرض |
|---------|---------|-------|
| [React](https://reactjs.org/) | 18.2 | إطار واجهة المستخدم |
| [TypeScript](https://www.typescriptlang.org/) | 5.0 | أنواع البيانات الثابتة |
| [Vite](https://vitejs.dev/) | 4.4 | أداة البناء والتطوير |
| [Tailwind CSS](https://tailwindcss.com/) | 3.3 | تصميم CSS |
| [Framer Motion](https://www.framer-motion.com/) | 11 | رسوم متحركة |
| [Lucide React](https://lucide.dev/) | 0.263 | أيقونات |
| [Recharts](https://recharts.org/) | 2.8 | رسوم بيانية |

### الخادم | Backend
| التقنية | الإصدار | الغرض |
|---------|---------|-------|
| [Express.js](https://expressjs.com/) | 5.1 | خادم API |
| [OpenAI API](https://openai.com/) | 5.12 | تكامل الذكاء الاصطناعي |
| [localforage](https://localforage.github.io/) | 1.10 | تخزين محلي |
| [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) | 9.0 | مصادقة JWT |
| [bcryptjs](https://github.com/dcodeIO/bcrypt.js/) | 2.4 | تشفير كلمات المرور |
| [Helmet](https://helmetjs.github.io/) | 7.1 | أمان HTTP |

### الاختبار | Testing
| التقنية | الإصدار | الغرض |
|---------|---------|-------|
| [Vitest](https://vitest.dev/) | 1.6 | إطار الاختبار |
| [Testing Library](https://testing-library.com/) | 14.3 | اختبار React |

---

## 📁 بنية المشروع | Project Structure

```
Top1-Quantum-AI/
├── src/
│   ├── App.tsx                         # المكون الجذر
│   ├── main.tsx                        # نقطة الدخول
│   ├── config.ts                       # إعدادات التطبيق
│   ├── aiService.ts                    # خدمة الذكاء الاصطناعي
│   ├── database.ts                     # إدارة قاعدة البيانات
│   ├── RevolutionaryQuantumSystem.tsx  # النظام الكمي الثوري
│   ├── AdvancedQuantumDashboard.tsx    # لوحة التحكم المتقدمة
│   ├── QuantumAIHybridSystem.tsx       # النظام الهجين كمي-AI
│   ├── QuantumAgentSystem.tsx          # نظام الوكلاء
│   ├── QuantumAnalyticsManager.tsx     # مدير التحليلات
│   ├── QuantumErrorHandler.tsx         # معالج الأخطاء
│   ├── UnifiedSecureQuantumSystem.tsx  # النظام الآمن الموحد
│   ├── WorkflowDiagnosticTool.tsx      # أداة التشخيص
│   ├── quantum/                        # وحدات الكم المشتركة
│   │   ├── types.ts                    # أنواع TypeScript المشتركة
│   │   ├── LoginScreen.tsx             # شاشة تسجيل الدخول
│   │   └── QuantumSidebar.tsx          # شريط التنقل الجانبي
│   ├── config/
│   │   └── credentials.ts             # بيانات الاعتماد من متغيرات البيئة
│   ├── components/
│   │   ├── AdvancedSecurityDashboard.tsx
│   │   ├── SecurityDashboard.tsx
│   │   ├── QuantumDashboard.tsx
│   │   ├── AIDashboard.tsx
│   │   ├── NetworkDashboard.tsx
│   │   ├── AdvancedSettings.tsx
│   │   ├── QuantumSystemDemo.tsx
│   │   └── InvestorPitch.tsx
│   └── styles/
├── tests/
│   └── unit/                           # 8 ملفات، 102 اختبار
├── server/                             # خادم Express.js
│   ├── index.js
│   ├── routes/
│   ├── middleware/
│   ├── models/
│   └── services/
├── nginx/                              # إعداد nginx
├── scripts/                            # سكريبتات المساعدة
├── Dockerfile                          # صورة Docker
├── docker-compose.yml                  # تكوين Docker Compose
├── k8s-deployment.yaml                 # نشر Kubernetes
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```

---

## 🚀 البدء السريع | Quick Start

### المتطلبات | Prerequisites

- **Node.js** ≥ 18.0
- **npm** ≥ 9.0
- **Git**

### التثبيت | Installation

```bash
# 1. استنساخ المستودع | Clone the repository
git clone https://github.com/AZIIZALOYIBI/Top1-Quantum-AI.github.io.git
cd Top1-Quantum-AI.github.io

# 2. تثبيت التبعيات | Install dependencies
npm install

# 3. إعداد متغيرات البيئة | Set up environment variables
cp .env.example .env
# ثم عدّل .env بالقيم المناسبة | Then edit .env with your values
```

### التشغيل المحلي | Local Development

```bash
# تشغيل الواجهة الأمامية | Start frontend (http://localhost:3000)
npm run dev

# تشغيل الخادم | Start backend server (http://localhost:3001)
npm run server

# تشغيل كليهما معاً | Run both concurrently
npm run dev & npm run server
```

### بناء الإنتاج | Production Build

```bash
npm run build
npm run preview
```

---

## ⚙️ متغيرات البيئة | Environment Variables

انسخ `.env.example` إلى `.env` وأعدّ المتغيرات التالية:  
Copy `.env.example` to `.env` and configure the following variables:

```env
# مفتاح OpenAI API | OpenAI API Key
VITE_OPENAI_API_KEY="your-openai-api-key-here"

# بيانات دخول النظام | System login credentials
# غيّرها قبل النشر في الإنتاج | Change before production deployment
VITE_SYSTEM_USERNAME="511"
VITE_SYSTEM_PASSWORD="511"

# الرمز السري الرئيسي للتحقق الكمي | Master secret for quantum verification
VITE_MASTER_SECRET_CODE="511"

# قاعدة البيانات | Database
DATABASE_URL=""
```

> ⚠️ **تحذير أمني | Security Warning:** غيّر قيم `VITE_SYSTEM_USERNAME` و`VITE_SYSTEM_PASSWORD` و`VITE_MASTER_SECRET_CODE` قبل النشر في بيئة الإنتاج.  
> Change `VITE_SYSTEM_USERNAME`, `VITE_SYSTEM_PASSWORD`, and `VITE_MASTER_SECRET_CODE` before deploying to production.

---

## 🧪 الاختبارات | Testing

```bash
# تشغيل جميع الاختبارات | Run all tests
npm test

# تشغيل الاختبارات مع المراقبة | Watch mode
npm run test:watch

# تشغيل مع تقرير التغطية | With coverage report
npm run test:coverage
```

> **102 اختبار** تمر بنجاح عبر 8 ملفات اختبار  
> **102 tests** passing across 8 test files

---

## 🐳 Docker

### تشغيل بـ Docker Compose | Run with Docker Compose

```bash
# تشغيل جميع الخدمات | Start all services
docker-compose up -d

# إيقاف الخدمات | Stop services
docker-compose down
```

### بناء الصورة يدوياً | Manual Image Build

```bash
docker build -t top1-quantum-ai .
docker run -p 3000:3000 top1-quantum-ai
```

---

## ☸️ Kubernetes

```bash
# نشر على Kubernetes | Deploy to Kubernetes
kubectl apply -f k8s-deployment.yaml
kubectl apply -f k8s-monitoring.yaml
```

---

## 🔒 الأمان | Security

- تشفير كلمات المرور بـ **bcryptjs**
- حماية HTTP headers بـ **Helmet**
- تحديد معدل الطلبات بـ **express-rate-limit**
- متغيرات البيئة لجميع البيانات الحساسة
- سياسة المحتوى (CSP) مُفعّلة

اطلع على [SECURITY.md](SECURITY.md) للتفاصيل.

---

## 📊 حالة المشروع | Project Status

| العنصر | الحالة |
|--------|--------|
| TypeScript Errors | ✅ 0 أخطاء |
| اختبارات الوحدة | ✅ 102 / 102 تمر |
| بناء الإنتاج | ✅ يعمل |
| Docker | ✅ جاهز |

---

## 🤝 المساهمة | Contributing

نرحب بجميع المساهمات! اطلع على [CONTRIBUTING.md](CONTRIBUTING.md) للتفاصيل.  
We welcome all contributions! See [CONTRIBUTING.md](CONTRIBUTING.md) for details.

```bash
# 1. Fork the repository
# 2. إنشاء فرع | Create a feature branch
git checkout -b feature/my-feature

# 3. تطبيق التعديلات | Make changes
# 4. رفع التعديلات | Push changes
git push origin feature/my-feature

# 5. فتح Pull Request
```

---

## 📄 الرخصة | License

هذا المشروع مرخص تحت رخصة [MIT](LICENSE).  
This project is licensed under the [MIT License](LICENSE).

---

## 👤 المؤلف | Author

**عبدالعزيز بن سلطان العتيبي**  
**Abdulaziz bin Sultan Al-Otaibi**

---

## 📚 الوثائق الإضافية | Additional Documentation

| الملف | الوصف |
|-------|-------|
| [COMPREHENSIVE_REPORT.md](COMPREHENSIVE_REPORT.md) | تقرير شامل عن المشروع |
| [DEVELOPMENT_ROADMAP.md](DEVELOPMENT_ROADMAP.md) | خارطة طريق التطوير |
| [PRODUCTION_SETUP.md](PRODUCTION_SETUP.md) | إعداد بيئة الإنتاج |
| [SECURITY.md](SECURITY.md) | سياسة الأمان |
| [CONTRIBUTING.md](CONTRIBUTING.md) | دليل المساهمة |
| [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) | ميثاق السلوك |

---

<div align="center">
⚛️ بُني بشغف وثورة كمية | Built with passion and quantum revolution ⚛️
</div>

