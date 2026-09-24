import type { CSSProperties, ReactElement } from "react";

export type PaperCrumpleState = "flat" | "holding" | "crumpled" | "creased";

declare const PaperCrumple: (props: {
  src: string;
  alt?: string;
  backSrc?: string;
  width?: number;
  height?: number;
  sceneHeight?: number;
  imageFit?: "cover" | "contain";
  releaseBehavior?: "stay" | "restore" | "creased";
  crumpleAmount?: number;
  crumpleDuration?: number;
  releaseDuration?: number;
  foldCount?: number;
  foldSharpness?: number;
  wrinkleDepth?: number;
  creaseStrength?: number;
  paperColor?: string;
  roughness?: number;
  paperTexture?: number;
  lightIntensity?: number;
  lightAngle?: number;
  shadow?: boolean;
  shadowOpacity?: number;
  draggable?: boolean;
  dragRotation?: number;
  dragRadius?: number;
  returnToOrigin?: boolean;
  rotation?: number;
  seed?: number;
  detail?: number;
  disabled?: boolean;
  /** Crumple automatically once ready, then settle into the release state. */
  autoCrumple?: boolean;
  resetKey?: number | string;
  onStateChange?: (state: PaperCrumpleState) => void;
  onError?: (error: Error) => void;
  className?: string;
  style?: CSSProperties;
}) => ReactElement;

export default PaperCrumple;
