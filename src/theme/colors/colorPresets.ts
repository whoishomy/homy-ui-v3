import { ColorPreset } from "./presetFactory";

export const statusPresets: ColorPreset = {
  default: {
    bg: "bg-gray-100 dark:bg-gray-800",
    text: "text-gray-800 dark:text-gray-200",
    ring: "ring-gray-300 dark:ring-gray-700",
  },
  info: {
    bg: "bg-blue-100 dark:bg-blue-800",
    text: "text-blue-800 dark:text-blue-100",
    ring: "ring-blue-300 dark:ring-blue-700",
  },
  success: {
    bg: "bg-green-100 dark:bg-green-800",
    text: "text-green-800 dark:text-green-100",
    ring: "ring-green-300 dark:ring-green-700",
  },
  warning: {
    bg: "bg-yellow-100 dark:bg-yellow-800",
    text: "text-yellow-800 dark:text-yellow-100",
    ring: "ring-yellow-300 dark:ring-yellow-700",
  },
  danger: {
    bg: "bg-red-100 dark:bg-red-800",
    text: "text-red-800 dark:text-red-100",
    ring: "ring-red-300 dark:ring-red-700",
  },
}; 