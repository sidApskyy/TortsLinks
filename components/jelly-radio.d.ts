import type { ReactNode, ReactElement } from "react";

declare const JellyRadio: (props: {
  items?: (string | { value: string; label: ReactNode; icon?: ReactNode; disabled?: boolean })[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string, index: number) => void;
  chipColor?: string;
  activeColor?: string;
  textColor?: string;
  activeTextColor?: string;
  size?: "sm" | "md" | "lg";
  gap?: number;
  radius?: number;
  swell?: number;
  barge?: number;
  shrink?: number;
  jelly?: number;
  bounce?: number;
  stagger?: number;
  stiffness?: number;
  disabled?: boolean;
  ariaLabel?: string;
  className?: string;
}) => ReactElement;

export default JellyRadio;
