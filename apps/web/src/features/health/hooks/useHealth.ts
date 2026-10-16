import { useEffect, useState } from "react";
import { fetchHealth } from "../api/health.api";
import type { HealthState } from "../model/health.model";

export function useHealth(): HealthState {
  const [state, setState] = useState<HealthState>({ kind: "loading" });

  useEffect(() => {
    const controller = new AbortController();
    fetchHealth(controller.signal)
      .then((health) => setState({ kind: "online", version: health.version }))
      .catch((error: unknown) => {
        if (!controller.signal.aborted) {
          console.error(error);
          setState({ kind: "offline" });
        }
      });
    return () => controller.abort();
  }, []);

  return state;
}
