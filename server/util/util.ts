import { Response } from 'express';

export async function safe<T>(func: () => T, def?: T) {
  let val;
  try {
    val = await func();
  } catch {}
  return val ?? def;
}

export class ResHandler {
  static success<T>(res: Response, data: T) {
    res.send({success: true, data: data});
  }

  static fail<T>(res: Response, data: {data?: T, message?: string, code?: number}) {
    res.status(data.code ?? 500).send({success: false, ...data});
  }
}
