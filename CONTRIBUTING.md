# دليل المساهمة | Contribution Guide

مرحباً بك! نحن سعداء باهتمامك بالمساهمة في **Top1 Quantum AI**. يرجى قراءة هذا
الدليل قبل البدء.

---

## 📋 جدول المحتويات

- [متطلبات البيئة](#متطلبات-البيئة)
- [إعداد بيئة التطوير](#إعداد-بيئة-التطوير)
- [هيكل المشروع](#هيكل-المشروع)
- [فروع Git](#فروع-git)
- [معايير الكود](#معايير-الكود)
- [الاختبارات](#الاختبارات)
- [رسائل Commit](#رسائل-commit)
- [تقديم Pull Request](#تقديم-pull-request)
- [الإبلاغ عن المشكلات](#الإبلاغ-عن-المشكلات)

---

## متطلبات البيئة

| الأداة             | الإصدار المطلوب | التحقق                   |
| ------------------ | --------------- | ------------------------ |
| **Node.js**        | 20 LTS+         | `node --version`         |
| **npm**            | 9+              | `npm --version`          |
| **Python**         | 3.11+           | `python --version`       |
| **Docker**         | 24+             | `docker --version`       |
| **Docker Compose** | 2.20+           | `docker compose version` |
| **Git**            | 2.40+           | `git --version`          |

---

## إعداد بيئة التطوير

### 1. استنساخ المستودع

```bash
git clone https://github.com/Top1-Quantum-AI/Top1-Quantum-AI.github.io.git
cd Top1-Quantum-AI.github.io
```

### 2. إعداد Frontend (Node.js)

```bash
# تثبيت تبعيات Node.js
npm install

# نسخ ملف متغيرات البيئة
cp .env.example .env

# تشغيل خادم التطوير
npm run dev
# ← يعمل على http://localhost:3000
```

### 3. إعداد Python / OpenMythos

```bash
# إنشاء بيئة افتراضية
python -m venv .venv

# تفعيل البيئة
# Linux/macOS:
source .venv/bin/activate
# Windows:
.venv\Scripts\activate

# تثبيت تبعيات Python
pip install torch --index-url https://download.pytorch.org/whl/cpu
pip install pytest pytest-cov black ruff mypy

# تشغيل اختبارات Python
pytest tests/python/ -v
```

### 4. إعداد كامل مع Docker

```bash
# تشغيل جميع الخدمات (MongoDB + Redis + Backend + Frontend)
docker compose up -d

# عرض السجلات
docker compose logs -f

# إيقاف الخدمات
docker compose down
```

### 5. إعداد Backend (Express.js)

```bash
# تشغيل الخادم الخلفي فقط
npm run server
# ← يعمل على http://localhost:3001

# أو تشغيل الـ Frontend والـ Backend معاً
npm run dev:all
```

---

## هيكل المشروع

```
Top1-Quantum-AI.github.io/
├── src/              # Frontend – React + TypeScript
│   ├── pages/        # صفحات التطبيق
│   ├── components/   # مكونات قابلة لإعادة الاستخدام
│   └── services/     # خدمات وAPIs
├── server/           # Backend – Express.js
│   ├── routes/       # مسارات API
│   ├── middleware/   # برمجيات وسيطة
│   ├── models/       # نماذج MongoDB
│   └── services/     # خدمات الخادم
├── open_mythos/      # نموذج AI هجين (Python + PyTorch)
├── tests/            # اختبارات JavaScript/TypeScript
│   └── python/       # اختبارات Python (pytest)
├── .github/          # قوالب Issues + CI/CD
├── nginx/            # إعدادات Nginx
└── k8s-*.yaml        # إعدادات Kubernetes
```

---

## فروع Git

| الفرع            | الغرض                    |
| ---------------- | ------------------------ |
| `main`           | الإصدار الإنتاجي المستقر |
| `develop`        | التطوير المستمر          |
| `feature/<name>` | ميزة جديدة               |
| `fix/<name>`     | إصلاح خطأ                |
| `hotfix/<name>`  | إصلاح عاجل للإنتاج       |
| `docs/<name>`    | تحديث التوثيق            |

```bash
# إنشاء فرع جديد
git checkout develop
git pull origin develop
git checkout -b feature/my-awesome-feature
```

---

## معايير الكود

### TypeScript / React

- **Strict mode** مُفعَّل — لا يُسمح بـ `any`
- استخدم `?.` و`??` بدلاً من الفحوصات اليدوية للـ null
- أنواع صريحة على جميع الدوال والحدود البرمجية
- مكوّنات `PascalCase`، خدمات ومرافق `camelCase`

```bash
# فحص الأنواع
npm run type-check

# فحص ESLint
npm run lint

# تنسيق الكود
npm run format
```

### Python

- اتبع **PEP 8** مع سطر بحد أقصى 100 حرف
- استخدم type hints في جميع التوقيعات
- نسّق مع `black` وافحص مع `ruff`

```bash
# تنسيق
black open_mythos/

# فحص الكود
ruff check open_mythos/

# فحص الأنواع
mypy open_mythos/
```

---

## الاختبارات

### اختبارات JavaScript/TypeScript

```bash
# تشغيل جميع الاختبارات
npm test

# وضع المراقبة (watch mode)
npm run test:watch

# مع تقرير التغطية
npm run test:coverage
```

### اختبارات Python (OpenMythos)

```bash
# تشغيل جميع اختبارات Python
pytest tests/python/ -v

# مع تقرير التغطية
pytest tests/python/ --cov=open_mythos --cov-report=term-missing
```

---

## رسائل Commit

نتبع معيار [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <short description>

[optional body]
[optional footer]
```

| النوع      | الاستخدام               |
| ---------- | ----------------------- |
| `feat`     | ميزة جديدة              |
| `fix`      | إصلاح خطأ               |
| `docs`     | تحديث التوثيق           |
| `style`    | تنسيق (بدون تغيير منطق) |
| `refactor` | إعادة هيكلة الكود       |
| `test`     | إضافة أو تحديث اختبارات |
| `chore`    | مهام البناء أو الصيانة  |
| `perf`     | تحسين الأداء            |

**أمثلة:**

```bash
git commit -m "feat(quantum): add KV-cache to OpenMythos generation"
git commit -m "fix(auth): handle expired JWT tokens gracefully"
git commit -m "test(components): add unit tests for QuantumDashboard"
```

---

## تقديم Pull Request

1. **تأكد** من أن جميع الاختبارات تجتاز: `npm test`
2. **تأكد** من نجاح فحص TypeScript: `npm run type-check`
3. **نسّق** الكود: `npm run format`
4. **ادفع** الفرع: `git push origin feature/my-feature`
5. **افتح** Pull Request نحو فرع `develop`
6. **اِملأ** قالب PR بالكامل

---

## الإبلاغ عن المشكلات

استخدم
[قوالب GitHub Issues](https://github.com/Top1-Quantum-AI/Top1-Quantum-AI.github.io/issues/new/choose):

- 🐛 **Bug Report** — الإبلاغ عن خطأ
- ✨ **Feature Request** — اقتراح ميزة جديدة
- ❓ **Question** — طرح سؤال

---

## مدونة السلوك

نلتزم بتوفير بيئة مرحبة ومحترمة للجميع. يرجى قراءة
[مدونة السلوك](CODE_OF_CONDUCT.md) قبل المشاركة.

---

شكراً لمساهمتك! 🙏 نتطلع إلى تعاونك.
