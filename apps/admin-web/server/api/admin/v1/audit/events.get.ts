import { createError, defineEventHandler, getQuery } from "h3";
import { createAdminRuntimeDeps } from "../../../../services/runtime-deps";

export function getAuditEvents(
  severity?: "info" | "warning" | "critical",
  deps = createAdminRuntimeDeps()
) {
  return deps.adminDeviceService.listAuditEvents(severity);
}

export default defineEventHandler(async (event) => {
  if (!event.context.adminAuth) {
    throw createError({ statusCode: 403, statusMessage: "Admin role required" });
  }

  const query = getQuery(event);
  const severity =
    query.severity === "info" || query.severity === "warning" || query.severity === "critical"
      ? query.severity
      : undefined;
  const page = Number.parseInt(String(query.page ?? "1"), 10);
  const pageSize = Number.parseInt(String(query.pageSize ?? "50"), 10);

  const all = getAuditEvents(severity, createAdminRuntimeDeps());
  const safePage = Number.isNaN(page) || page < 1 ? 1 : page;
  const safePageSize = Number.isNaN(pageSize) || pageSize < 1 ? 50 : Math.min(pageSize, 200);
  const start = (safePage - 1) * safePageSize;

  return {
    items: all.slice(start, start + safePageSize),
    page: safePage,
    pageSize: safePageSize,
    total: all.length
  };
});
