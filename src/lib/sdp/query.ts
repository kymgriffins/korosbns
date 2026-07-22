/**
 * SDP 3.0 query engine — traverse graph, no markdown parsing.
 */

import { EDGES, ENTITIES, type GraphEdge, type GraphEntity } from "./graph-data";

const entityMap = new Map(ENTITIES.map((e) => [e.id, e]));

export function getEntity(id: string): GraphEntity | undefined {
  return entityMap.get(id);
}

export function edgesFrom(id: string, rel?: GraphEdge["rel"]): GraphEdge[] {
  return EDGES.filter((e) => e.from === id && (rel ? e.rel === rel : true));
}

export function edgesTo(id: string, rel?: GraphEdge["rel"]): GraphEdge[] {
  return EDGES.filter((e) => e.to === id && (rel ? e.rel === rel : true));
}

export type CapabilityQueryResult = {
  capability: GraphEntity;
  contracts: GraphEntity[];
  components: GraphEntity[];
  requirements: GraphEntity[];
  dependencies: GraphEntity[];
};

/** GET capability — resolved context for Builder */
export function queryCapability(capabilityId: string): CapabilityQueryResult | null {
  const capability = getEntity(capabilityId);
  if (!capability || capability.type !== "capability") return null;

  const contractIds = edgesFrom(capabilityId, "IMPLEMENTS")
    .concat(edgesFrom(capabilityId, "DEPENDS_ON"))
    .map((e) => e.to);

  const componentIds = edgesFrom(capabilityId, "CONTAINS").map((e) => e.to);

  const requirements = componentIds.flatMap((cid) =>
    edgesFrom(cid, "SATISFIES").map((e) => getEntity(e.to)!),
  );

  return {
    capability,
    contracts: contractIds.map((id) => getEntity(id)!).filter(Boolean),
    components: componentIds.map((id) => getEntity(id)!).filter(Boolean),
    requirements: requirements.filter(Boolean),
    dependencies: edgesFrom(capabilityId, "DEPENDS_ON")
      .map((e) => getEntity(e.to)!)
      .filter(Boolean),
  };
}

export type TraceabilityChain = {
  requirement: string;
  contract?: string;
  capability?: string;
  component?: string;
  test?: string;
};

/** REQ → contract → capability → component → test */
export function traceRequirement(reqId: string): TraceabilityChain | null {
  const req = getEntity(reqId);
  if (!req) return null;

  const componentEdge = edgesTo(reqId, "SATISFIES")[0];
  const component = componentEdge ? getEntity(componentEdge.from) : undefined;

  const capEdge = component ? edgesTo(component.id, "CONTAINS")[0] : undefined;
  const capability = capEdge ? getEntity(capEdge.from) : undefined;

  const contractEdge = capability
    ? edgesFrom(capability.id, "IMPLEMENTS")[0]
    : undefined;
  const contract = contractEdge ? getEntity(contractEdge.to) : undefined;

  const testEdge = component ? edgesTo(component.id, "VERIFIED_BY")[0] : undefined;
  const test = testEdge ? getEntity(testEdge.from) : undefined;

  return {
    requirement: reqId,
    contract: contract?.id,
    capability: capability?.id,
    component: component?.id,
    test: test?.id,
  };
}
