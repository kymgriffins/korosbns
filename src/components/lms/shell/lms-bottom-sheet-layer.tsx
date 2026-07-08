/**
 * @sdp-provenance
 * intent: INTENT-001
 * capability: CAP-learning-shell
 * contracts: CTR-lms-shell@1.0.0, CTR-trivia-popup@1.0.0
 * builder: SDP-Builder
 * date: 2026-07-07
 */

/** Host mount for trivia bottom sheet (Lesson capability). */
export function LmsBottomSheetLayer() {
  return <div id="lms-bottom-sheet-host" className="contents" aria-hidden="true" />;
}
