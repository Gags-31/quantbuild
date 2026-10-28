/** Build-time stub. At runtime, the live preview injects real config via window.__QB_PREVIEW_CONFIG__. */

export interface AppInfo {
  name: string;
  appType: string;
  features: string[];
}

export const appInfo: AppInfo = {
  name: "Preview",
  appType: "Application",
  features: [],
};
