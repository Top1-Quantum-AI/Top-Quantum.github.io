// Commitlint Configuration للنظام الكمي المتقدم
// Advanced Quantum AI System Commit Lint Configuration

module.exports = {
  extends: ['@commitlint/config-conventional'],
  
  // قواعد مخصصة للنظام الكمي
  rules: {
    // نوع الالتزام
    'type-enum': [
      2,
      'always',
      [
        'feat',      // ميزة جديدة
        'fix',       // إصلاح خطأ
        'docs',      // تحديث الوثائق
        'style',     // تغييرات التنسيق
        'refactor',  // إعادة هيكلة الكود
        'perf',      // تحسين الأداء
        'test',      // إضافة أو تحديث الاختبارات
        'build',     // تغييرات نظام البناء
        'ci',        // تغييرات CI/CD
        'chore',     // مهام صيانة
        'revert',    // التراجع عن التغييرات
        'security',  // إصلاحات أمنية
        'quantum',   // تحديثات خاصة بالكم
        'ai',        // تحديثات الذكاء الاصطناعي
        'crypto',    // تحديثات التشفير
        'monitoring', // تحديثات المراقبة
        'k8s',       // تحديثات Kubernetes
        'docker',    // تحديثات Docker
        'deps',      // تحديث التبعيات
        'config',    // تغييرات الإعدادات
        'breaking'   // تغييرات كاسرة
      ]
    ],
    
    // طول العنوان
    'subject-max-length': [2, 'always', 100],
    'subject-min-length': [2, 'always', 10],
    
    // تنسيق العنوان
    'subject-case': [2, 'always', 'sentence-case'],
    'subject-empty': [2, 'never'],
    'subject-full-stop': [2, 'never', '.'],
    
    // تنسيق النوع
    'type-case': [2, 'always', 'lower-case'],
    'type-empty': [2, 'never'],
    
    // النطاق (Scope)
    'scope-enum': [
      2,
      'always',
      [
        'api-gateway', 'quantum-core', 'ai-agents', 'security', 'monitoring',
        'dashboard', 'lab', 'network',
        'docker', 'k8s', 'ci-cd', 'deployment',
        'quantum-state', 'quantum-gates', 'quantum-circuits', 'quantum-algorithms', 'quantum-simulator',
        'ai-models', 'ai-training', 'ai-inference', 'nlp', 'ml',
        'encryption', 'authentication', 'authorization', 'post-quantum-crypto', 'key-management',
        'mongodb', 'redis', 'storage', 'cache',
        'websockets', 'graphql', 'rest-api', 'grpc', 'nats',
        'unit-tests', 'integration-tests', 'e2e-tests', 'load-tests', 'security-tests',
        'readme', 'api-docs', 'user-guide', 'dev-docs',
        'env', 'config', 'settings',
        'deps', 'dev-deps', 'peer-deps',
        'webpack', 'vite', 'babel', 'typescript', 'eslint', 'prettier', 'jest',
        'prometheus', 'grafana', 'jaeger', 'logging', 'metrics', 'tracing',
        'optimization', 'caching', 'compression', 'lazy-loading'
      ]
    ],
    
    'scope-case': [2, 'always', 'kebab-case'],
    'body-max-line-length': [2, 'always', 100],
    'body-leading-blank': [2, 'always'],
    'footer-max-line-length': [2, 'always', 100],
    'footer-leading-blank': [2, 'always'],
    'header-max-length': [2, 'always', 100],
    'header-min-length': [2, 'always', 15]
  }
};
