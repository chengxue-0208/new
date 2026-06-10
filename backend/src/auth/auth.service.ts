import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: { email: string; password: string }) {
    const existingUser = await this.userRepository.findOne({
      where: { email: registerDto.email },
    });

    if (existingUser) {
      return {
        statusCode: 403,
        message: 'User already exists'
      };
    }

    const user = await this.userRepository.create({
      email: registerDto.email,
      passwordHash: registerDto.password,
      balance: 0,
      subscriptionStatus: 'ACTIVE',
      trafficUsed: 0,
      trafficLimit: 0,
    });

    const savedUser = await this.userRepository.save(user);

    return {
      user: {
        id: savedUser.id,
        email: savedUser.email,
      },
      accessToken: this.jwtService.sign({ sub: savedUser.id }),
    };
  }

  async login(loginDto: { email: string; password: string }) {
    const user = await this.userRepository.findOne({
      where: { email: loginDto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return {
      user: {
        id: user.id,
        email: user.email,
      },
      accessToken: this.jwtService.sign({ sub: user.id }),
    };
  }

  async validateUser(
    email: string,
    password: string,
  ): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: { email },
    });

    if (!user) {
      return null;
    }

    // Simple validation - in production, use bcrypt.compare
    if (user.passwordHash !== password) {
      return null;
    }

    return user;
  }
}