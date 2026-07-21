import { describe, expect, it } from "vitest";
import { queryCapability, traceRequirement } from "@/lib/sdp/query";

describe("SDP query engine", () => {
  it("GET CAP-learning-shell resolves contracts and requirements", () => {
    const result = queryCapability("CAP-learning-shell");
    expect(result).not.toBeNull();
    expect(result!.capability.id).toBe("CAP-learning-shell");
    expect(result!.contracts.map((c) => c.id)).toContain("CTR-lms-shell");
    expect(result!.requirements.map((r) => r.id)).toContain("REQ-0012");
  });

  it("TRACE REQ-0012 returns component chain", () => {
    const chain = traceRequirement("REQ-0012");
    expect(chain?.requirement).toBe("REQ-0012");
    expect(chain?.component).toBe("CMP-LearningShell");
    expect(chain?.capability).toBe("CAP-learning-shell");
  });
});
