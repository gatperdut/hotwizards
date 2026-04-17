import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class UsersService {
  constructor(private prismaService: PrismaService) {}

  public availabilityHandle(handle: string) {
    return this.prismaService.user.findUnique({
      where: { handle: handle },
    });
  }

  public availabilityEmail(email: string) {
    return this.prismaService.user.findUnique({
      where: { email: email },
    });
  }

  public byIdentifier(identifier: string) {
    return this.prismaService.user.findFirst({
      where: {
        OR: [{ email: identifier }, { handle: identifier }],
      },
    });
  }

  public byId(id: number) {
    return this.prismaService.user.findUnique({ where: { id: id } });
  }

  public create(handle: string, email: string, hashedPassword: string, admin: boolean) {
    return this.prismaService.user.create({
      data: { handle: handle, email: email, password: hashedPassword, admin: admin },
    });
  }
}
