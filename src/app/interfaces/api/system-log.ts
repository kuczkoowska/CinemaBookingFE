export interface SystemLog {
  readonly id: number;
  readonly timestamp: string;
  readonly type: LogType;
  readonly message: string;
  readonly userId?: number;
}

export enum LogType {
  INFO = 'INFO',
  ERROR = 'ERROR',
  WARNING = 'WARNING',
}
