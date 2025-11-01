import type { Request, Response, NextFunction } from 'express'

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction,
) {
  const status = typeof (err as { status?: number })?.status === 'number' ? (err as { status: number }).status : 500
  const message = (err as { message?: string })?.message ?? 'Internal Server Error'
  const code = (err as { code?: string })?.code ?? 'INTERNAL_ERROR'

  if (process.env.NODE_ENV !== 'production') {
    console.error(err)
  }

  res.status(status).json({
    ok: false,
    error: { code, message },
  })
}
