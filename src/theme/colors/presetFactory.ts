export type PresetCategory = "status" | "priority";

export type PresetKey = "default" | "info" | "success" | "warning" | "danger";

export interface PresetConfig {
  bg: string;
  text: string;
  ring?: string;
}

export type ColorPreset = Record<PresetKey, PresetConfig>;

export const createPresetClass = (preset: PresetConfig): string => {
  return [
    preset.bg,
    preset.text,
    preset.ring ?? "ring-transparent",
    "px-2 py-1 rounded-full text-xs font-medium ring-1",
  ].join(" ");
}; 