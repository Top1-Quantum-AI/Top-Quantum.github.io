# Security Policy / سياسة الأمان

## Supported Versions / الإصدارات المدعومة

We currently support the following versions with security updates:

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |

## Reporting a Vulnerability / الإبلاغ عن ثغرة أمنية

If you discover a security vulnerability, please follow these steps:

### English

1. **DO NOT** create a public issue
2. Send an email to the maintainers with details
3. Include steps to reproduce the vulnerability
4. We will respond within 48 hours
5. We will work with you to resolve the issue

### العربية

1. **لا تقم** بإنشاء مشكلة عامة
2. أرسل بريداً إلكترونياً للمطورين مع التفاصيل
3. اشمل خطوات إعادة إنتاج الثغرة
4. سنرد خلال 48 ساعة
5. سنعمل معك لحل المشكلة

## Security Best Practices / أفضل الممارسات الأمنية

### For Developers / للمطورين

1. **Environment Variables / متغيرات البيئة**
   - Never commit `.env` files to version control
   - Use strong, unique secrets for production
   - Rotate API keys and secrets regularly

2. **Dependencies / التبعيات**
   - Run `npm audit` regularly
   - Keep dependencies updated
   - Review security advisories

3. **Code Security / أمان الكود**
   - Validate all user inputs
   - Use HTTPS in production
   - Implement proper authentication
   - Follow OWASP guidelines

### For Users / للمستخدمين

1. **Configuration / التكوين**
   - Use strong passwords
   - Enable two-factor authentication when available
   - Keep the application updated

2. **Data Protection / حماية البيانات**
   - Don't share sensitive information
   - Use secure networks
   - Regular backups

## Security Features / الميزات الأمنية

This application includes:

- Input validation and sanitization
- Rate limiting
- CORS protection
- Helmet.js security headers
- Environment-based configuration
- Secure session management

## Security Audits / عمليات التدقيق الأمنية

We recommend running security audits regularly:

```bash
# Check for vulnerabilities
npm run security:audit

# Fix automatically fixable vulnerabilities
npm run security:fix

# Check with moderate level threshold
npm run security:check
```

## Responsible Disclosure / الإفصاح المسؤول

We believe in responsible disclosure and will:

- Acknowledge receipt of vulnerability reports
- Work with researchers to understand and fix issues
- Provide credit to researchers (if desired)
- Coordinate public disclosure timing

## Contact / التواصل

For security-related inquiries, please contact the maintainers through the
appropriate channels mentioned in the README file.

---

**Note**: This security policy is subject to updates. Please check regularly for
changes.

**ملاحظة**: هذه السياسة الأمنية قابلة للتحديث. يرجى المراجعة بانتظام للتغييرات.
