import prisma from '../prisma';

export class UserService {
    async getAll() {
        return await prisma.user.findMany();
    }

    async create(name: string, email: string) {
        return await prisma.user.create({
            data: {
                name,
                email,
            },
        });
    }
}
