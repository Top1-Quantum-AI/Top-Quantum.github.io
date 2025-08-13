{
  "$schema": "https://json.schemastore.org/stylelintrc",
  "extends": [
    "stylelint-config-standard",
    "stylelint-config-standard-scss",
    "stylelint-config-css-modules",
    "stylelint-config-prettier",
    "stylelint-config-rational-order"
  ],
  "plugins": [
    "stylelint-scss",
    "stylelint-order",
    "stylelint-config-rational-order/plugin",
    "stylelint-declaration-block-no-ignored-properties",
    "stylelint-high-performance-animation",
    "stylelint-a11y"
  ],
  "customSyntax": "postcss-scss",
  "ignoreFiles": [
    "**/node_modules/**",
    "**/dist/**",
    "**/build/**",
    "**/coverage/**",
    "**/*.min.css",
    "**/vendor/**",
    "**/public/**",
    "**/static/**"
  ],
  "rules": {
    "order/properties-order": [],
    "plugin/rational-order": [
      true,
      {
        "border-in-box-model": false,
        "empty-line-between-groups": false
      }
    ],
    "at-rule-no-unknown": [
      true,
      {
        "ignoreAtRules": [
          "tailwind",
          "apply",
          "variants",
          "responsive",
          "screen",
          "layer",
          "config",
          "use",
          "forward",
          "import",
          "mixin",
          "include",
          "function",
          "return",
          "each",
          "for",
          "if",
          "else",
          "warn",
          "error",
          "debug"
        ]
      }
    ],
    "scss/at-rule-no-unknown": [
      true,
      {
        "ignoreAtRules": [
          "tailwind",
          "apply",
          "variants",
          "responsive",
          "screen",
          "layer",
          "config"
        ]
      }
    ],
    "color-hex-case": "lower",
    "color-hex-length": "short",
    "color-named": "never",
    "color-no-invalid-hex": true,
    "font-family-name-quotes": "always-where-recommended",
    "font-family-no-duplicate-names": true,
    "font-family-no-missing-generic-family-keyword": true,
    "font-weight-notation": "numeric",
    "function-calc-no-unspaced-operator": true,
    "function-comma-newline-after": "always-multi-line",
    "function-comma-space-after": "always-single-line",
    "function-comma-space-before": "never",
    "function-max-empty-lines": 0,
    "function-name-case": "lower",
    "function-parentheses-newline-inside": "always-multi-line",
    "function-parentheses-space-inside": "never-single-line",
    "function-whitespace-after": "always",
    "number-leading-zero": "always",
    "number-no-trailing-zeros": true,
    "string-no-newline": true,
    "string-quotes": "single",
    "length-zero-no-unit": true,
    "unit-case": "lower",
    "unit-no-unknown": true,
    "value-keyword-case": "lower",
    "value-list-comma-newline-after": "always-multi-line",
    "value-list-comma-space-after": "always-single-line",
    "value-list-comma-space-before": "never",
    "value-list-max-empty-lines": 0,
    "property-case": "lower",
    "property-no-unknown": [
      true,
      {
        "ignoreProperties": [
          "composes",
          "compose-with",
          "font-display"
        ]
      }
    ],
    "keyframe-declaration-no-important": true,
    "declaration-bang-space-after": "never",
    "declaration-bang-space-before": "always",
    "declaration-colon-newline-after": "always-multi-line",
    "declaration-colon-space-after": "always-single-line",
    "declaration-colon-space-before": "never",
    "declaration-empty-line-before": [
      "always",
      {
        "except": [
          "after-declaration",
          "first-nested"
        ],
        "ignore": [
          "after-comment",
          "inside-single-line-block"
        ]
      }
    ],
    "declaration-block-no-duplicate-properties": [
      true,
      {
        "ignore": [
          "consecutive-duplicates-with-different-values"
        ]
      }
    ],
    "declaration-block-no-shorthand-property-overrides": true,
    "declaration-block-semicolon-newline-after": "always-multi-line",
    "declaration-block-semicolon-space-after": "always-single-line",
    "declaration-block-semicolon-space-before": "never",
    "declaration-block-single-line-max-declarations": 1,
    "declaration-block-trailing-semicolon": "always",
    "block-closing-brace-empty-line-before": "never",
    "block-closing-brace-newline-after": "always",
    "block-closing-brace-newline-before": "always-multi-line",
    "block-closing-brace-space-before": "always-single-line",
    "block-no-empty": true,
    "block-opening-brace-newline-after": "always-multi-line",
    "block-opening-brace-space-after": "always-single-line",
    "block-opening-brace-space-before": "always",
    "selector-attribute-brackets-space-inside": "never",
    "selector-attribute-operator-space-after": "never",
    "selector-attribute-operator-space-before": "never",
    "selector-combinator-space-after": "always",
    "selector-combinator-space-before": "always",
    "selector-descendant-combinator-no-non-space": true,
    "selector-max-empty-lines": 0,
    "selector-pseudo-class-case": "lower",
    "selector-pseudo-class-no-unknown": true,
    "selector-pseudo-class-parentheses-space-inside": "never",
    "selector-pseudo-element-case": "lower",
    "selector-pseudo-element-colon-notation": "double",
    "selector-pseudo-element-no-unknown": true,
    "selector-type-case": "lower",
    "selector-type-no-unknown": true,
    "selector-list-comma-newline-after": "always",
    "selector-list-comma-space-before": "never",
    "rule-empty-line-before": [
      "always-multi-line",
      {
        "except": [
          "first-nested"
        ],
        "ignore": [
          "after-comment"
        ]
      }
    ],
    "media-feature-colon-space-after": "always",
    "media-feature-colon-space-before": "never",
    "media-feature-name-case": "lower",
    "media-feature-name-no-unknown": true,
    "media-feature-parentheses-space-inside": "never",
    "media-feature-range-operator-space-after": "always",
    "media-feature-range-operator-space-before": "always",
    "media-query-list-comma-newline-after": "always-multi-line",
    "media-query-list-comma-space-after": "always-single-line",
    "media-query-list-comma-space-before": "never",
    "at-rule-empty-line-before": [
      "always",
      {
        "except": [
          "blockless-after-same-name-blockless",
          "first-nested"
        ],
        "ignore": [
          "after-comment"
        ]
      }
    ],
    "at-rule-name-case": "lower",
    "at-rule-name-space-after": "always-single-line",
    "at-rule-semicolon-newline-after": "always",
    "comment-empty-line-before": [
      "always",
      {
        "except": [
          "first-nested"
        ],
        "ignore": [
          "stylelint-commands"
        ]
      }
    ],
    "comment-whitespace-inside": "always",
    "indentation": 2,
    "linebreaks": "unix",
    "max-empty-lines": 1,
    "max-line-length": [
      100,
      {
        "ignore": [
          "non-comments"
        ]
      }
    ],
    "no-eol-whitespace": true,
    "no-missing-end-of-source-newline": true,
    "no-empty-first-line": true,
    "unicode-bom": "never",
    "plugin/declaration-block-no-ignored-properties": true,
    "plugin/no-low-performance-animation-properties": [
      true,
      {
        "ignore": "paint-properties"
      }
    ],
    "a11y/content-property-no-static-value": true,
    "a11y/font-size-is-readable": true,
    "a11y/line-height-is-vertical-rhythmed": true,
    "a11y/media-prefers-reduced-motion": true,
    "a11y/no-display-none": true,
    "a11y/no-obsolete-attribute": true,
    "a11y/no-obsolete-element": true,
    "a11y/no-outline-none": true,
    "a11y/no-spread-text": true,
    "a11y/no-text-align-justify": true,
    "a11y/selector-pseudo-class-focus": true,
    "scss/at-extend-no-missing-placeholder": true,
    "scss/at-function-pattern": "^[a-z]+([a-z0-9-]+[a-z0-9]+)?$",
    "scss/at-import-no-partial-leading-underscore": true,
    "scss/at-import-partial-extension-blacklist": [
      "scss"
    ],
    "scss/at-mixin-pattern": "^[a-z]+([a-z0-9-]+[a-z0-9]+)?$",
    "scss/dollar-variable-colon-space-after": "always",
    "scss/dollar-variable-colon-space-before": "never",
    "scss/dollar-variable-pattern": "^[_]?[a-z]+([a-z0-9-]+[a-z0-9]+)?$",
    "scss/percent-placeholder-pattern": "^[a-z]+([a-z0-9-]+[a-z0-9]+)?$",
    "scss/selector-no-redundant-nesting-selector": true,
    "scss/no-duplicate-dollar-variables": true,
    "scss/operator-no-newline-before": true,
    "scss/operator-no-unspaced": true,
    "scss/partial-no-import": true,
    "scss/double-slash-comment-whitespace-inside": "always",
    "scss/declaration-nested-properties": "never",
    "scss/dimension-no-non-numeric-values": true,
    "scss/function-quote-no-quoted-strings-inside": true,
    "scss/function-unquote-no-unquoted-strings-inside": true,
    "scss/map-keys-quotes": "always",
    "scss/media-feature-value-dollar-variable": "always",
    "scss/no-duplicate-mixins": true,
    "scss/no-global-function-names": true
  },
  "overrides": [
    {
      "files": [
        "*.vue",
        "**/*.vue"
      ],
      "customSyntax": "postcss-html"
    },
    {
      "files": [
        "*.html",
        "**/*.html"
      ],
      "customSyntax": "postcss-html"
    },
    {
      "files": [
        "*.jsx",
        "**/*.jsx",
        "*.tsx",
        "**/*.tsx"
      ],
      "customSyntax": "@stylelint/postcss-css-in-js"
    },
    {
      "files": [
        "*.module.css",
        "**/*.module.css",
        "*.module.scss",
        "**/*.module.scss"
      ],
      "rules": {
        "selector-pseudo-class-no-unknown": [
          true,
          {
            "ignorePseudoClasses": [
              "export",
              "import",
              "global",
              "local",
              "external"
            ]
          }
        ]
      }
    },
    {
      "files": [
        "*.quantum.css",
        "**/*.quantum.css",
        "*.quantum.scss",
        "**/*.quantum.scss"
      ],
      "rules": {
        "property-no-unknown": [
          true,
          {
            "ignoreProperties": [
              "quantum-state",
              "quantum-entanglement",
              "quantum-coherence",
              "quantum-superposition",
              "quantum-measurement",
              "quantum-decoherence",
              "quantum-gate",
              "quantum-circuit",
              "quantum-algorithm",
              "quantum-error-correction"
            ]
          }
        ]
      }
    }
  ]
}