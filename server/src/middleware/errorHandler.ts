import type { Request, Response, NextFunction } from 'express'

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  const status = typeof (err as any)?.status === 'number' ? (err as any).status : 500
  const message = (err as any)?.message ?? 'Internal Server Error'
  const code = (err as any)?.code ?? 'INTERNAL_ERROR'

  if (process.env.NODE_ENV !== 'production') {
    console.error(err)
  }

  res.status(status).json({
    ok: false,
    error: { code, message },
  })
}
