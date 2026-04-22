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
        // Core Services
        'api-gateway',
        'quantum-core',
        'ai-agents',
        'security',
        'monitoring',
        
        // Applications
        'dashboard',
        'lab',
        'network',
        
        // Infrastructure
        'docker',
        'k8s',
        'ci-cd',
        'deployment',
        
        // Quantum Components
        'quantum-state',
        'quantum-gates',
        'quantum-circuits',
        'quantum-algorithms',
        'quantum-simulator',
        
        // AI Components
        'ai-models',
        'ai-training',
        'ai-inference',
        'nlp',
        'ml',
        
        // Security Components
        'encryption',
        'authentication',
        'authorization',
        'post-quantum-crypto',
        'key-management',
        
        // Database & Storage
        'mongodb',
        'redis',
        'storage',
        'cache',
        
        // Communication
        'websockets',
        'graphql',
        'rest-api',
        'grpc',
        'nats',
        
        // Testing
        'unit-tests',
        'integration-tests',
        'e2e-tests',
        'load-tests',
        'security-tests',
        
        // Documentation
        'readme',
        'api-docs',
        'user-guide',
        'dev-docs',
        
        // Configuration
        'env',
        'config',
        'settings',
        
        // Dependencies
        'deps',
        'dev-deps',
        'peer-deps',
        
        // Build & Tools
        'webpack',
        'vite',
        'babel',
        'typescript',
        'eslint',
        'prettier',
        'jest',
        
        // Monitoring & Observability
        'prometheus',
        'grafana',
        'jaeger',
        'logging',
        'metrics',
        'tracing',
        
        // Performance
        'optimization',
        'caching',
        'compression',
        'lazy-loading'
      ]
    ],
    
    'scope-case': [2, 'always', 'kebab-case'],
    
    // طول الجسم
    'body-max-line-length': [2, 'always', 100],
    'body-leading-blank': [2, 'always'],
    
    // طول التذييل
    'footer-max-line-length': [2, 'always', 100],
    'footer-leading-blank': [2, 'always'],
    
    // طول الرأس
    'header-max-length': [2, 'always', 100],
    'header-min-length': [2, 'always', 15]
  },
  
  // إعدادات إضافية
  parserPreset: {
    parserOpts: {
      headerPattern: /^(\w*)(?:\(([\w\$\.\-\*\s]*)\))?\:\s(.*)$/,
      headerCorrespondence: ['type', 'scope', 'subject'],
      referenceActions: [
        'close',
        'closes',
        'closed',
        'fix',
        'fixes',
        'fixed',
        'resolve',
        'resolves',
        'resolved'
      ],
      issuePrefixes: ['#'],
      noteKeywords: ['BREAKING CHANGE', 'BREAKING CHANGES'],
      fieldPattern: /^-(.*?)-$/,
      revertPattern: /^Revert\s"([\s\S]*)"\s*This reverts commit (\w*)\.$/,
      revertCorrespondence: ['header', 'hash'],
      warn() {},
      mergePattern: null,
      mergeCorrespondence: null
    }
  },
  
  // رسائل مساعدة مخصصة
  helpUrl: 'https://github.com/conventional-changelog/commitlint/#what-is-commitlint',
  
  // إعدادات المطالبة
  prompt: {
    questions: {
      type: {
        description: 'Select the type of change that you\'re committing',
        enum: {
          feat: {
            description: 'A new feature',
            title: 'Features',
            emoji: '✨'
          },
          fix: {
            description: 'A bug fix',
            title: 'Bug Fixes',
            emoji: '🐛'
          },
          docs: {
            description: 'Documentation only changes',
            title: 'Documentation',
            emoji: '📚'
          },
          style: {
            description: 'Changes that do not affect the meaning of the code',
            title: 'Styles',
            emoji: '💎'
          },
          refactor: {
            description: 'A code change that neither fixes a bug nor adds a feature',
            title: 'Code Refactoring',
            emoji: '📦'
          },
          perf: {
            description: 'A code change that improves performance',
            title: 'Performance Improvements',
            emoji: '🚀'
          },
          test: {
            description: 'Adding missing tests or correcting existing tests',
            title: 'Tests',
            emoji: '🚨'
          },
          build: {
            description: 'Changes that affect the build system or external dependencies',
            title: 'Builds',
            emoji: '🛠'
          },
          ci: {
            description: 'Changes to our CI configuration files and scripts',
            title: 'Continuous Integrations',
            emoji: '⚙️'
          },
          chore: {
            description: 'Other changes that don\'t modify src or test files',
            title: 'Chores',
            emoji: '♻️'
          },
          revert: {
            description: 'Reverts a previous commit',
            title: 'Reverts',
            emoji: '🗑'
          },
          security: {
            description: 'Security improvements or fixes',
            title: 'Security',
            emoji: '🔒'
          },
          quantum: {
            description: 'Quantum computing related changes',
            title: 'Quantum',
            emoji: '⚛️'
          },
          ai: {
            description: 'Artificial Intelligence related changes',
            title: 'AI',
            emoji: '🤖'
          },
          crypto: {
            description: 'Cryptography related changes',
            title: 'Cryptography',
            emoji: '🔐'
          },
          monitoring: {
            description: 'Monitoring and observability changes',
            title: 'Monitoring',
            emoji: '📊'
          }
        }
      },
      scope: {
        description: 'What is the scope of this change (e.g. component or file name)'
      },
      subject: {
        description: 'Write a short, imperative tense description of the change'
      },
      body: {
        description: 'Provide a longer description of the change'
      },
      isBreaking: {
        description: 'Are there any breaking changes?'
      },
      breakingBody: {
        description: 'A BREAKING CHANGE commit requires a body. Please enter a longer description of the commit itself'
      },
      breaking: {
        description: 'Describe the breaking changes'
      },
      isIssueAffected: {
        description: 'Does this change affect any open issues?'
      },
      issuesBody: {
        description: 'If issues are closed, the commit requires a body. Please enter a longer description of the commit itself'
      },
      issues: {
        description: 'Add issue references (e.g. "fix #123", "re #123".)'
      }
    }
  }
};

// أمثلة على رسائل الالتزام الصحيحة:
// feat(quantum-core): add quantum state serialization
// fix(ai-agents): resolve memory leak in training loop
// docs(api-gateway): update authentication documentation
// security(encryption): implement post-quantum cryptography
// quantum(simulator): optimize quantum circuit execution
// ai(nlp): improve natural language processing accuracy
// perf(dashboard): reduce initial load time by 40%
// test(integration): add end-to-end quantum workflow tests
// ci(docker): update multi-stage build configuration
// refactor(monitoring): restructure metrics collection system