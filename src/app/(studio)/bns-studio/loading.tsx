import { RouteLoadingGate } from "@/components/global/route-loading-gate";

/** BNS Studio route loader — off unless CMS enables pages.studio.loading. */
export default function BnsStudioLoading() {
  return <RouteLoadingGate />;
}
