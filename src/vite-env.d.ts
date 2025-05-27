/// <reference types="vite/client" />

interface ImportMeta {
  readonly env: {
    readonly VITE_GEMINI_API_KEY: string;
    readonly VITE_DEFAULT_MODEL: string;
    readonly VITE_APP_NAME: string;
    readonly VITE_APP_DESCRIPTION: string;
    readonly [key: string]: string | undefined;
  }
}
