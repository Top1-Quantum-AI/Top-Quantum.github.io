{
  "$schema": "https://json.schemastore.org/semantic-release",
  "branches": [
    "main",
    "master",
    {
      "name": "develop",
      "prerelease": "beta"
    },
    {
      "name": "release/*",
      "prerelease": "rc"
    },
    {
      "name": "hotfix/*",
      "prerelease": "hotfix"
    }
  ],
  "repositoryUrl": "https://github.com/quantum-ai/microservices.git",
  "tagFormat": "v${version}",
  "plugins": [
    [
      "@semantic-release/commit-analyzer",
      {
        "preset": "conventionalcommits",
        "releaseRules": [
          {
            "type": "feat",
            "release": "minor"
          },
          {
            "type": "fix",
            "release": "patch"
          },
          {
            "type": "perf",
            "release": "patch"
          },
          {
            "type": "security",
            "release": "patch"
          },
          {
            "type": "quantum",
            "release": "minor"
          },
          {
            "type": "ai",
            "release": "minor"
          },
          {
            "type": "crypto",
            "release": "patch"
          },
          {
            "type": "breaking",
            "release": "major"
          },
          {
            "type": "docs",
            "release": false
          },
          {
            "type": "style",
            "release": false
          },
          {
            "type": "refactor",
            "release": "patch"
          },
          {
            "type": "test",
            "release": false
          },
          {
            "type": "build",
            "release": "patch"
          },
          {
            "type": "ci",
            "release": false
          },
          {
            "type": "chore",
            "release": false
          },
          {
            "type": "revert",
            "release": "patch"
          },
          {
            "scope": "no-release",
            "release": false
          },
          {
            "breaking": true,
            "release": "major"
          }
        ],
        "parserOpts": {
          "noteKeywords": [
            "BREAKING CHANGE",
            "BREAKING CHANGES",
            "BREAKING"
          ]
        }
      }
    ],
    [
      "@semantic-release/release-notes-generator",
      {
        "preset": "conventionalcommits",
        "presetConfig": {
          "types": [
            {
              "type": "feat",
              "section": "🚀 Features",
              "hidden": false
            },
            {
              "type": "fix",
              "section": "🐛 Bug Fixes",
              "hidden": false
            },
            {
              "type": "perf",
              "section": "⚡ Performance Improvements",
              "hidden": false
            },
            {
              "type": "security",
              "section": "🔒 Security",
              "hidden": false
            },
            {
              "type": "quantum",
              "section": "⚛️ Quantum Computing",
              "hidden": false
            },
            {
              "type": "ai",
              "section": "🤖 Artificial Intelligence",
              "hidden": false
            },
            {
              "type": "crypto",
              "section": "🔐 Cryptography",
              "hidden": false
            },
            {
              "type": "monitoring",
              "section": "📊 Monitoring & Observability",
              "hidden": false
            },
            {
              "type": "refactor",
              "section": "♻️ Code Refactoring",
              "hidden": false
            },
            {
              "type": "build",
              "section": "🛠 Build System",
              "hidden": false
            },
            {
              "type": "deps",
              "section": "📦 Dependencies",
              "hidden": false
            },
            {
              "type": "config",
              "section": "⚙️ Configuration",
              "hidden": false
            },
            {
              "type": "docker",
              "section": "🐳 Docker",
              "hidden": false
            },
            {
              "type": "k8s",
              "section": "☸️ Kubernetes",
              "hidden": false
            },
            {
              "type": "docs",
              "section": "📚 Documentation",
              "hidden": true
            },
            {
              "type": "style",
              "section": "💎 Styles",
              "hidden": true
            },
            {
              "type": "test",
              "section": "🧪 Tests",
              "hidden": true
            },
            {
              "type": "ci",
              "section": "🔄 CI/CD",
              "hidden": true
            },
            {
              "type": "chore",
              "section": "🔧 Chores",
              "hidden": true
            },
            {
              "type": "revert",
              "section": "⏪ Reverts",
              "hidden": false
            }
          ]
        },
        "writerOpts": {
          "commitsSort": ["subject", "scope"]
        }
      }
    ],
    [
      "@semantic-release/changelog",
      {
        "changelogFile": "CHANGELOG.md",
        "changelogTitle": "# Changelog\n\nAll notable changes to the Quantum AI System will be documented in this file.\n\nThe format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),\nand this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).\n"
      }
    ],
    [
      "@semantic-release/npm",
      {
        "npmPublish": false,
        "tarballDir": "dist"
      }
    ],
    [
      "@semantic-release/exec",
      {
        "verifyConditionsCmd": "npm run security:audit && npm run test:unit",
        "prepareCmd": "npm run build && npm run docs:build",
        "publishCmd": "echo 'Publishing version ${nextRelease.version}' && npm run docker:build && docker tag quantum-ai:latest quantum-ai:${nextRelease.version}",
        "successCmd": "echo 'Successfully released version ${nextRelease.version}' && npm run monitoring:notify -- --version=${nextRelease.version}"
      }
    ],
    [
      "@semantic-release/github",
      {
        "assets": [
          {
            "path": "dist/*.tgz",
            "label": "Distribution Package"
          },
          {
            "path": "docs/**/*",
            "label": "Documentation"
          },
          {
            "path": "CHANGELOG.md",
            "label": "Changelog"
          },
          {
            "path": "docker-compose.quantum.yml",
            "label": "Docker Compose Configuration"
          },
          {
            "path": "k8s-deployment.yaml",
            "label": "Kubernetes Deployment"
          },
          {
            "path": "k8s-monitoring.yaml",
            "label": "Kubernetes Monitoring"
          }
        ],
        "successComment": "🎉 This ${issue.pull_request ? 'PR is included' : 'issue has been resolved'} in version [${nextRelease.version}](${releases.filter(release => !!release.name)[0].url}) 🎉\n\n**Release Notes:**\n${nextRelease.notes}\n\n**Docker Image:**\n```bash\ndocker pull quantum-ai:${nextRelease.version}\n```\n\n**Kubernetes Deployment:**\n```bash\nkubectl set image deployment/quantum-ai quantum-ai=quantum-ai:${nextRelease.version}\n```",
        "failComment": "❌ This release from branch `${branch.name}` had failed due to the following errors:\n- ${errors.map(err => err.message).join('\\n- ')}",
        "failTitle": "🚨 The automated release is failing",
        "labels": ["released"],
        "assignees": ["quantum-ai-bot"],
        "releasedLabels": ["released-${nextRelease.channel || 'latest'}"],
        "addReleases": "bottom"
      }
    ],
    [
      "@semantic-release/git",
      {
        "assets": [
          "CHANGELOG.md",
          "package.json",
          "package-lock.json",
          "microservices-package.json",
          "docs/**/*"
        ],
        "message": "chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}"
      }
    ]
  ],
  "preset": "conventionalcommits",
  "dryRun": false,
  "ci": true,
  "debug": false,
  "verifyConditions": [
    "@semantic-release/changelog",
    "@semantic-release/npm",
    "@semantic-release/git",
    "@semantic-release/github"
  ],
  "analyzeCommits": [
    "@semantic-release/commit-analyzer"
  ],
  "verifyRelease": [],
  "generateNotes": [
    "@semantic-release/release-notes-generator"
  ],
  "prepare": [
    "@semantic-release/changelog",
    "@semantic-release/npm",
    "@semantic-release/exec",
    "@semantic-release/git"
  ],
  "publish": [
    "@semantic-release/npm",
    "@semantic-release/github"
  ],
  "success": [
    "@semantic-release/github",
    "@semantic-release/exec"
  ],
  "fail": [
    "@semantic-release/github"
  ]
}