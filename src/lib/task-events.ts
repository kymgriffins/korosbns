/** Dispatched after any task create/update/delete so list views can refresh. */
export const TASK_LIST_INVALIDATED_EVENT = "korosbns:tasks-invalidated";

export function invalidateTaskList(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(TASK_LIST_INVALIDATED_EVENT));
}
