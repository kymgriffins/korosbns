/**
 * SDP 3.0 — build provenance metadata for traceability.
 * @see agent/graph/README.md
 */

export type SdpProvenance = {
  intent: string;
  requirements: string[];
  contracts: string[];
  capability: string;
  builder: string;
  date: string;
};

export function sdpProvenanceHeader(meta: SdpProvenance): string {
  const lines = [
    "/**",
    " * @sdp-provenance",
    ` * intent: ${meta.intent}`,
    ` * capability: ${meta.capability}`,
    ` * requirements: ${meta.requirements.join(", ")}`,
    ` * contracts: ${meta.contracts.join(", ")}`,
    ` * builder: ${meta.builder}`,
    ` * date: ${meta.date}`,
    " */",
  ];
  return lines.join("\n");
}
