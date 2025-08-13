// Babel configuration for Advanced Quantum AI System
// Optimized for modern JavaScript, TypeScript, React, and quantum computing libraries

module.exports = function (api) {
  api.cache(true);

  const isProduction = process.env.NODE_ENV === 'production';
  const isDevelopment = process.env.NODE_ENV === 'development';
  const isTest = process.env.NODE_ENV === 'test';
  const isQuantum = process.env.QUANTUM_MODE === 'true';
  const isAI = process.env.AI_MODE === 'true';

  const presets = [
    [
      '@babel/preset-env',
      {
        // Use browserslist configuration
        useBuiltIns: 'usage',
        corejs: {
          version: '3.30',
          proposals: true,
        },
        // Enable modern features for quantum computing
        targets: isProduction
          ? {
              browsers: [
                'Chrome >= 90',
                'Firefox >= 88',
                'Safari >= 14',
                'Edge >= 90',
              ],
              node: '18',
            }
          : {
              node: 'current',
            },
        modules: isTest ? 'commonjs' : false,
        loose: false,
        bugfixes: true,
        shippedProposals: true,
        // Enable experimental features for quantum computing
        include: [
          'proposal-top-level-await',
          'proposal-class-properties',
          'proposal-private-methods',
          'proposal-private-property-in-object',
          'proposal-decorators',
          'proposal-pipeline-operator',
          'proposal-optional-chaining',
          'proposal-nullish-coalescing-operator',
          'proposal-logical-assignment-operators',
        ],
      },
    ],
    [
      '@babel/preset-typescript',
      {
        isTSX: true,
        allExtensions: true,
        allowNamespaces: true,
        allowDeclareFields: true,
        onlyRemoveTypeImports: true,
        optimizeConstEnums: true,
      },
    ],
    [
      '@babel/preset-react',
      {
        runtime: 'automatic',
        development: isDevelopment,
        importSource: '@emotion/react',
        throwIfNamespace: false,
      },
    ],
  ];

  const plugins = [
    // Core language features
    '@babel/plugin-syntax-top-level-await',
    '@babel/plugin-syntax-import-meta',
    '@babel/plugin-syntax-dynamic-import',
    '@babel/plugin-syntax-import-assertions',
    
    // Class and object features
    ['@babel/plugin-proposal-decorators', { version: '2023-05' }],
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-proposal-private-methods',
    '@babel/plugin-proposal-private-property-in-object',
    '@babel/plugin-proposal-class-static-block',
    
    // Operators and expressions
    '@babel/plugin-proposal-optional-chaining',
    '@babel/plugin-proposal-nullish-coalescing-operator',
    '@babel/plugin-proposal-logical-assignment-operators',
    ['@babel/plugin-proposal-pipeline-operator', { proposal: 'hack', topicToken: '%' }],
    
    // Function and async features
    '@babel/plugin-proposal-partial-application',
    '@babel/plugin-proposal-function-bind',
    '@babel/plugin-proposal-async-generator-functions',
    
    // Object and array features
    '@babel/plugin-proposal-object-rest-spread',
    '@babel/plugin-proposal-export-default-from',
    '@babel/plugin-proposal-export-namespace-from',
    
    // React optimizations
    isDevelopment && 'react-refresh/babel',
    
    // Emotion CSS-in-JS
    '@emotion/babel-plugin',
    
    // Bundle optimization
    isProduction && [
      'babel-plugin-transform-remove-console',
      {
        exclude: ['error', 'warn'],
      },
    ],
    
    // Import optimizations
    [
      'babel-plugin-import',
      {
        libraryName: 'lodash',
        libraryDirectory: '',
        camel2DashComponentName: false,
      },
      'lodash',
    ],
    [
      'babel-plugin-import',
      {
        libraryName: 'antd',
        libraryDirectory: 'es',
        style: true,
      },
      'antd',
    ],
    
    // Quantum computing optimizations
    isQuantum && [
      'babel-plugin-transform-quantum-operators',
      {
        enableSuperposition: true,
        enableEntanglement: true,
        enableMeasurement: true,
      },
    ],
    
    // AI/ML optimizations
    isAI && [
      'babel-plugin-transform-ai-operators',
      {
        enableTensorFlow: true,
        enablePyTorch: true,
        enableMLOptimizations: true,
      },
    ],
    
    // Performance optimizations
    isProduction && [
      'babel-plugin-transform-inline-environment-variables',
      {
        include: [
          'NODE_ENV',
          'QUANTUM_MODE',
          'AI_MODE',
          'CRYPTO_MODE',
          'MONITORING_MODE',
        ],
      },
    ],
    
    // Security optimizations
    isProduction && [
      'babel-plugin-transform-remove-debugger',
    ],
    
    // Bundle size optimizations
    isProduction && [
      'babel-plugin-transform-remove-undefined',
    ],
    
    // Tree shaking optimizations
    isProduction && [
      'babel-plugin-transform-imports',
      {
        '@mui/material': {
          transform: '@mui/material/{{member}}',
          preventFullImport: true,
        },
        '@mui/icons-material': {
          transform: '@mui/icons-material/{{member}}',
          preventFullImport: true,
        },
        'react-router-dom': {
          transform: 'react-router-dom/{{member}}',
          preventFullImport: true,
        },
      },
    ],
    
    // Development helpers
    isDevelopment && [
      'babel-plugin-transform-react-jsx-source',
    ],
    
    // Testing optimizations
    isTest && [
      'babel-plugin-transform-dynamic-import',
    ],
    
  ].filter(Boolean);

  const env = {
    development: {
      plugins: [
        'react-refresh/babel',
        '@babel/plugin-transform-react-jsx-source',
        '@babel/plugin-transform-react-jsx-self',
      ],
    },
    production: {
      plugins: [
        'babel-plugin-transform-remove-console',
        'babel-plugin-transform-remove-debugger',
        'babel-plugin-transform-react-remove-prop-types',
        [
          'babel-plugin-transform-react-constant-elements',
          {
            allowMutablePropsOnTags: ['FormattedMessage'],
          },
        ],
        [
          'babel-plugin-transform-react-inline-elements',
          {
            allowMutablePropsOnTags: ['FormattedMessage'],
          },
        ],
      ],
    },
    test: {
      presets: [
        [
          '@babel/preset-env',
          {
            targets: {
              node: 'current',
            },
            modules: 'commonjs',
          },
        ],
      ],
      plugins: [
        'babel-plugin-transform-dynamic-import',
        '@babel/plugin-transform-modules-commonjs',
      ],
    },
    quantum: {
      plugins: [
        [
          'babel-plugin-transform-quantum-operators',
          {
            enableSuperposition: true,
            enableEntanglement: true,
            enableMeasurement: true,
            enableQuantumGates: true,
            enableQuantumCircuits: true,
            enableQuantumAlgorithms: true,
          },
        ],
      ],
    },
    ai: {
      plugins: [
        [
          'babel-plugin-transform-ai-operators',
          {
            enableTensorFlow: true,
            enablePyTorch: true,
            enableMLOptimizations: true,
            enableNeuralNetworks: true,
            enableDeepLearning: true,
            enableNLP: true,
          },
        ],
      ],
    },
    security: {
      plugins: [
        'babel-plugin-transform-remove-console',
        'babel-plugin-transform-remove-debugger',
        [
          'babel-plugin-transform-inline-environment-variables',
          {
            exclude: [
              'API_KEY',
              'SECRET_KEY',
              'PRIVATE_KEY',
              'PASSWORD',
              'TOKEN',
            ],
          },
        ],
      ],
    },
  };

  const overrides = [
    {
      test: /\.tsx?$/,
      presets: [
        [
          '@babel/preset-typescript',
          {
            isTSX: true,
            allExtensions: true,
            allowNamespaces: true,
            allowDeclareFields: true,
            onlyRemoveTypeImports: true,
            optimizeConstEnums: true,
          },
        ],
      ],
    },
    {
      test: /\.quantum\.(js|ts|jsx|tsx)$/,
      plugins: [
        [
          'babel-plugin-transform-quantum-operators',
          {
            enableSuperposition: true,
            enableEntanglement: true,
            enableMeasurement: true,
            enableQuantumGates: true,
            enableQuantumCircuits: true,
            enableQuantumAlgorithms: true,
            enableQuantumErrorCorrection: true,
          },
        ],
      ],
    },
    {
      test: /\.ai\.(js|ts|jsx|tsx)$/,
      plugins: [
        [
          'babel-plugin-transform-ai-operators',
          {
            enableTensorFlow: true,
            enablePyTorch: true,
            enableMLOptimizations: true,
            enableNeuralNetworks: true,
            enableDeepLearning: true,
            enableNLP: true,
            enableComputerVision: true,
            enableReinforcementLearning: true,
          },
        ],
      ],
    },
    {
      test: /\.crypto\.(js|ts|jsx|tsx)$/,
      plugins: [
        [
          'babel-plugin-transform-crypto-operators',
          {
            enableQuantumCryptography: true,
            enablePostQuantumCryptography: true,
            enableHomomorphicEncryption: true,
            enableZeroKnowledgeProofs: true,
            enableSecureMultipartyComputation: true,
          },
        ],
      ],
    },
  ];

  return {
    presets,
    plugins,
    env,
    overrides,
    sourceType: 'unambiguous',
    assumptions: {
      constantReexports: true,
      enumerableModuleMeta: true,
      ignoreFunctionLength: true,
      ignoreToPrimitiveHint: true,
      iterableIsArray: false,
      mutableTemplateObject: true,
      noClassCalls: true,
      noDocumentAll: true,
      noIncompleteNsImportDetection: true,
      noNewArrows: true,
      objectRestNoSymbols: true,
      privateFieldsAsProperties: false,
      pureGetters: true,
      setClassMethods: true,
      setComputedProperties: true,
      setPublicClassFields: true,
      setSpreadProperties: true,
      skipForOfIteratorClosing: true,
      superIsCallableConstructor: true,
    },
    compact: isProduction,
    minified: false, // Let other tools handle minification
    comments: !isProduction,
    shouldPrintComment: (val) => {
      // Keep important comments in production
      return isProduction
        ? /(@preserve|@license|@cc_on|@quantum|@ai|@crypto|@security)/i.test(val)
        : true;
    },
  };
};