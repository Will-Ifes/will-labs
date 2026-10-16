import { Banner } from "@will-labs/ui-react";
import type { HealthState } from "../model/health.model";

export function HealthStatus({ state }: { state: HealthState }) {
  switch (state.kind) {
    case "loading":
      return (
        <Banner title="Verificando a API" kind="info">
          Aguardando a resposta de /v1/health.
        </Banner>
      );
    case "online":
      return (
        <Banner title="API no ar" kind="success">
          WilFlowLab API versão {state.version}.
        </Banner>
      );
    case "offline":
      return (
        <Banner title="API fora do ar" kind="danger">
          Rode npm run dev:api e recarregue a página.
        </Banner>
      );
  }
}
