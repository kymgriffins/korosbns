import { RouteLoadingGate } from "@/components/global/route-loading-gate";

/** Root segment — CMS default is no loading page. */
export default function RootLoading() {
  return <RouteLoadingGate />;
}
