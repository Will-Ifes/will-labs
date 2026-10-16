import { render, screen } from "@testing-library/react";
import { HealthStatus } from "./HealthStatus";

describe("HealthStatus", () => {
  context("when the API answers", () => {
    it("should announce it as online with the version", () => {
      render(<HealthStatus state={{ kind: "online", version: "0.1.0" }} />);

      expect(screen.getByRole("status").textContent).toContain("API no ar");
      expect(screen.getByRole("status").textContent).toContain("0.1.0");
    });
  });

  context("when the API is unreachable", () => {
    it("should raise an alert telling how to start it", () => {
      render(<HealthStatus state={{ kind: "offline" }} />);

      expect(screen.getByRole("alert").textContent).toContain(
        "npm run dev:api",
      );
    });
  });
});
