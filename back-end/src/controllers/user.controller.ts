import { Request, Response } from 'express';
import prisma from '../prisma';
import { UserService } from '../services/user.service';

const userService = new UserService();

export const getAllUsers = async (req: Request, res: Response) => {
    const users = await userService.getAll();
    res.json(users);
};

export const createUser = async (req: Request, res: Response) => {
    const { name, email } = req.body;
    const user = await userService.create(name, email);
    res.status(201).json(user);
};
