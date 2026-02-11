export interface DashboardSummary {
  platformHealth: {
    productionApp: string;
    backendApi: string;
    monitoringStack: string;
    infrastructure: string;
  };
  weeklyKpis: {
    deploymentSuccessRate: string;
    incidents: number;
    mttr: string;
    availability: string;
  };
  deliveryStatus: {
    [key: string]: string;
  };
  capacity: {
    activeServices: number;
    stoppedServices: number;
    activeContainerNames: string[];
    status: string;
  };
}

export interface Pipeline {
  id: number;
  name: string;
  status: 'success' | 'failed' | 'running';
  lastRun: string;
  duration: string;
  successRate: string;
}

export interface CICDResponse {
  pipelines: Pipeline[];
  summary: {
    totalPipelines: number;
    successCount: number;
    failedCount: number;
    runningCount: number;
  };
}

export interface Metric {
  id: number;
  name: string;
  value: string;
  status: 'healthy' | 'warning' | 'critical';
  threshold: string;
}

export interface Alert {
  id: number;
  title: string;
  severity: 'info' | 'warning' | 'critical';
  timestamp: string;
}

export interface MonitoringResponse {
  metrics: Metric[];
  alerts: Alert[];
}

export interface Cluster {
  id: number;
  name: string;
  status: 'healthy' | 'warning' | 'critical';
  nodes: number;
  pods: number;
  cpuUsage: string;
  memoryUsage: string;
}

export interface Container {
  id: number;
  name: string;
  status: 'running' | 'stopped' | 'error';
  image: string;
  uptime: string;
  restarts: number;
}

export interface Node {
  id: number;
  name: string;
  status: 'healthy' | 'warning' | 'critical';
  cpuUsage: string;
  memoryUsage: string;
  diskUsage: string;
}

export interface InfrastructureResponse {
  clusters: Cluster[];
  containers: Container[];
  nodes: Node[];
}