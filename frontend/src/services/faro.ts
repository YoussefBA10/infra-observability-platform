import { initializeFaro } from '@grafana/faro-react';
import { TracingInstrumentation } from '@grafana/faro-web-tracing';

export function initFaro() {
  initializeFaro({
    url: 'http://localhost:12347/collect', // Replace with your Grafana Agent endpoint
    app: {
      name: 'devops-frontend',
      version: '1.0.0',
    },
    instrumentations: [
      new TracingInstrumentation(),
    ],
  });
}
