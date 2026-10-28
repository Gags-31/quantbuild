/**
 * QuantBuild live-preview entry point.
 *
 * Identical component code to the generated app. The per-project entity
 * configuration and API base are injected at page-render time via
 * window.__QB_PREVIEW_CONFIG__.
 */
import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";
import App from "../frontend/src/App";
import { AuthProvider } from "../frontend/src/auth/AuthContext";

interface InjectedConfig {
  entityConfigs: Array<{
    resource: string;
    label: string;
    columns: { key: string; label: string }[];
    fields: Array<{
      key: string;
      label: string;
      input: string;
      required: boolean;
    }>;
  }>;
  appInfo: {
    name: string;
    appType: string;
    features: string[];
  };
}

const injected: InjectedConfig =
  (window as unknown as { __QB_PREVIEW_CONFIG__: InjectedConfig })
    .__QB_PREVIEW_CONFIG__ ?? {
    entityConfigs: [],
    appInfo: { name: "Preview", appType: "Application", features: [] },
  };

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <HashRouter>
      <AuthProvider>
        <App entityConfigs={injected.entityConfigs} appInfo={injected.appInfo} />
      </AuthProvider>
    </HashRouter>
  </React.StrictMode>
);
