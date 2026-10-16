import type { ProblemDetails } from "@will-labs/contracts";
import type { Context, ErrorHandler, NotFoundHandler } from "hono";
import type { ContentfulStatusCode } from "hono/utils/http-status";

const ERROR_TYPE_BASE = "https://will-labs.dev/errors";

type Problem = Omit<ProblemDetails, "status" | "traceId"> & {
  status: ContentfulStatusCode;
};

function respondWithProblem(c: Context, problem: Problem, traceId: string) {
  const body: ProblemDetails = { ...problem, traceId };
  return c.json(body, problem.status, {
    "Content-Type": "application/problem+json",
  });
}

export const handleNotFound: NotFoundHandler = (c) =>
  respondWithProblem(
    c,
    {
      type: `${ERROR_TYPE_BASE}/not-found`,
      title: "Recurso não encontrado",
      status: 404,
    },
    crypto.randomUUID(),
  );

export const handleError: ErrorHandler = (error, c) => {
  const traceId = crypto.randomUUID();
  console.error(
    JSON.stringify({
      level: "error",
      message: error.message,
      path: c.req.path,
      traceId,
    }),
  );
  return respondWithProblem(
    c,
    {
      type: `${ERROR_TYPE_BASE}/internal`,
      title: "Erro inesperado",
      status: 500,
    },
    traceId,
  );
};
