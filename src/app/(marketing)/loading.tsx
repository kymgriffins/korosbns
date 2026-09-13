import { RouteLoadingGate } from "@/components/global/route-loading-gate";

/** Marketing segment — pathname-aware; CMS default is no loading page. */
export default function MarketingLoading() {
  return <RouteLoadingGate />;
}
