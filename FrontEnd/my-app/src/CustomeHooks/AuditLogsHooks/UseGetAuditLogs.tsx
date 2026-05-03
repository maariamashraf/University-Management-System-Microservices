import { useQuery } from "@tanstack/react-query";
import { getAllAuditLogs } from "../../Services/AuditLogService";
import type { AuditLog } from "../../Interfaces/auditLog";

export function useGetAuditLogs() {
    const { data, isLoading, error, isFetching } = useQuery<AuditLog[], Error>({
        queryKey: ["audit-logs"],
        queryFn: getAllAuditLogs,
    });

    return {
        auditLogs: data ?? [],
        isLoading,
        isFetching,
        error: error instanceof Error ? error.message : null,
    };
}
