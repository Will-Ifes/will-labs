import { HealthStatus } from "../components/HealthStatus";
import { useHealth } from "../hooks/useHealth";

export function HealthPage() {
  const health = useHealth();
  return (
    <>
      <h1>WilFlowLab</h1>
      <p>Estrutura da v0.1: API, contratos e interface conectados.</p>
      <HealthStatus state={health} />
    </>
  );
}
