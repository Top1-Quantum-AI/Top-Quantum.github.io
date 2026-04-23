// / <reference types="vite/client" />

interface ImportMetaEnv {
  readonly BASE_URL: string;
  readonly VITE_ADMIN_USERNAME: string;
  readonly VITE_ADMIN_PASSWORD: string;
  readonly VITE_OPENAI_API_KEY: string;
  readonly VITE_API_URL: string;
  readonly VITE_MASTER_SECRET: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
