import prisma from '../prisma';
import jwt from 'jsonwebtoken';
import { ulid } from 'ulid';

export class UserService {
  async getAll() {
    return await prisma.user.findMany();
  }

  async create(name: string, email: string, password: string) {
    return await prisma.user.create({
      data: {
        id: ulid(),
        name,
        email,
      },
    });
  }

  async login(email: string, password: string) {
    let private_key = process.env.PUBLIC_KEY;

    let user = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (user && user.password !== password) {
      return null;
    }

    let payload = {
      id: user.id,
      email: user.email,
      name: user.name,
    };

    let token = jwt.sign(payload, private_key, {
      expiresIn: '1d',
    });

    return token;
  }
}
