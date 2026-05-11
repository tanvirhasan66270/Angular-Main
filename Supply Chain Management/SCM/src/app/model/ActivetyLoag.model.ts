export interface ActivityLog {
  logId?: string;
  userId: string;
  action: string;
  module: string;
  referenceId?: string;
  performedAt: string;//Date
}

