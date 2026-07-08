/**
 * Learning Shell — public API
 * @see docs/ljp-spec/implementation-roadmap.md Phase B
 */

export {
  type LmsShellLayers,
  type LmsShellMode,
  SHELL_LAYERS_BY_MODE,
  resolveShellMode,
} from "@/components/lms/shell/types";

export { LearningShell } from "@/components/lms/shell/learning-shell";
export { LmsTopNav } from "@/components/lms/shell/lms-top-nav";
export { LmsBottomNav } from "@/components/lms/shell/lms-bottom-nav";
export { LmsPage, LmsSection } from "@/components/lms/shell/lms-page";
export { LmsToastLayer } from "@/components/lms/shell/lms-toast-layer";
export { LmsDialogLayer } from "@/components/lms/shell/lms-dialog-layer";
export { LmsBottomSheetLayer } from "@/components/lms/shell/lms-bottom-sheet-layer";
