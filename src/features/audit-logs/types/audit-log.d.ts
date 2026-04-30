export interface IAuditLog {
  id: string;
  createdAt: string;
  actorUserId: string;
  actorUsername: string;
  actorEmail: string;
  actorRole: string;
  category: string;
  action: "CREATE" | "UPDATE" | "DELETE";
  entityType: string;
  entityId: string;
  metadata: Record<string, unknown> | null;
  ipAddress: string;
  userAgent: string;
  httpMethod: string;
  path: string;
}

export interface IAuditLogsMetadata {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface IAuditLogsPayload {
  data: IAuditLog[];
  metadata: IAuditLogsMetadata;
}

export interface IAuditLogDetailPayload extends Partial<IAuditLog> {
  auditLog?: IAuditLog;
  log?: IAuditLog;
}
