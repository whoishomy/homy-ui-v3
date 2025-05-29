"use client";

import { statusPresets } from "../colors/colorPresets";
import { createPresetClass } from "../colors/presetFactory";

type StatusKey = keyof typeof statusPresets;

interface Props {
  label: string;
  status?: StatusKey;
}

export const StatusBadge = ({ label, status = "default" }: Props) => {
  const config = statusPresets[status];
  const className = createPresetClass(config);

  return <span className={className}>{label}</span>;
}; 