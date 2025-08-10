import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

export const authenticateMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader) {
    return res.status(401).json({ message: 'Token de acesso não fornecido.' });
  }

  const token = authorizationHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_PUBLIC_SECRET || 'secret'
    );
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token de acesso inválido.' });
  }
};
