import type { z } from "zod";

export class HttpError extends Error {
  constructor(readonly status: number) {
    super(`A requisição falhou com status ${status}.`);
    this.name = "HttpError";
  }
}

export async function getJson<T>(
  path: string,
  schema: z.ZodType<T>,
  signal: AbortSignal,
) {
  const response = await fetch(path, {
    signal,
    headers: { Accept: "application/json" },
  });
  if (!response.ok) throw new HttpError(response.status);
  return schema.parse(await response.json());
}
