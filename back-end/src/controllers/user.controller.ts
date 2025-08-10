import { Request, Response } from 'express';
import prisma from '../prisma';
import { UserService } from '../services/user.service';

const userService = new UserService();

export const getAllUsers = async (req: Request, res: Response) => {
  const users = await userService.getAll();
  res.json(users);
};

export const createUser = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  const user = await userService.create(name, email, password);
  res.status(201).json(user);
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const token = await userService.login(email, password);
  res.json({ token });
};
