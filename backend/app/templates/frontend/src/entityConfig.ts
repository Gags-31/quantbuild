/** Build-time stub. At runtime, the live preview injects real config via window.__QB_PREVIEW_CONFIG__. */

export interface EntityFieldConfig {
  key: string;
  label: string;
  input: "text" | "number" | "checkbox" | "textarea" | "datetime-local" | "date";
  required: boolean;
}

export interface EntityConfig {
  resource: string;
  label: string;
  columns: { key: string; label: string }[];
  fields: EntityFieldConfig[];
}

export const entityConfigs: EntityConfig[] = [];
