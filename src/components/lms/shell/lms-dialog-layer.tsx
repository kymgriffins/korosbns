/**
 * @sdp-provenance
 * intent: INTENT-001
 * capability: CAP-learning-shell
 * contracts: CTR-lms-shell@1.0.0
 * builder: SDP-Builder
 * date: 2026-07-07
 */

/** Portal target for shared learn dialogs (v2). */
export function LmsDialogLayer() {
  return <div id="lms-dialog-root" className="contents" aria-hidden="true" />;
}
