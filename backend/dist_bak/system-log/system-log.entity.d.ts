export declare enum LogLevel {
    DEBUG = "DEBUG",
    INFO = "INFO",
    WARNING = "WARNING",
    ERROR = "ERROR",
    CRITICAL = "CRITICAL"
}
export declare enum LogSource {
    USER_SERVICE = "USER_SERVICE",
    NODE_SERVICE = "NODE_SERVICE",
    VPN_SERVICE = "VPN_SERVICE",
    PAYMENT_SERVICE = "PAYMENT_SERVICE",
    SUBSCRIPTION_SERVICE = "SUBSCRIPTION_SERVICE",
    SYSTEM = "SYSTEM"
}
export declare class SystemLog {
    id: string;
    level: LogLevel;
    source: LogSource;
    message: string;
    userId?: string;
    nodeId?: string;
    metadata?: any;
    ipAddress?: string;
    responseTime: number;
    stackTrace?: any;
    createdAt: Date;
    updatedAt: Date;
}
