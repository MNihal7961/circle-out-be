import { Injectable, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { hashPassword, comparePassword } from '../utils/hash.functions';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signup(email: string, password: string) {
    try {
      const existing = await this.userService.findByEmail(email);
      if (existing) {
        return {
          success: false,
          message: 'Email already in use',
          data: null,
        };
      }
      const hash = await hashPassword(password, 10);
      const user = await this.userService.createUser(email, hash);
      const tokens = await this.generateTokens(user.id, user.email);
      await this.userService.updateRefreshToken(user.id, tokens.refreshToken);
      return {
        success: true,
        message: 'Signup successful',
        data: tokens,
      };
    } catch (error) {
      return {
        success: false,
        message: error?.message || 'Signup failed',
        data: null,
      };
    }
  }

  async signin(email: string, password: string) {
    try {
      const user = await this.userService.findByEmail(email);
      if (!user) {
        return {
          success: false,
          message: 'Invalid credentials',
          data: null,
        };
      }
      const valid = await comparePassword(password, user.password);
      if (!valid) {
        return {
          success: false,
          message: 'Invalid credentials',
          data: null,
        };
      }
      const tokens = await this.generateTokens(user.id, user.email);
      await this.userService.updateRefreshToken(user.id, tokens.refreshToken);
      return {
        success: true,
        message: 'Signin successful',
        data: tokens,
      };
    } catch (error) {
      return {
        success: false,
        message: error?.message || 'Signin failed',
        data: null,
      };
    }
  }

  async refresh(userId: string, refreshToken: string) {
    try {
      const user = await this.userService.findById(userId);
      if (!user || user.refreshToken !== refreshToken) {
        return {
          success: false,
          message: 'Access Denied',
          data: null,
        };
      }
      const tokens = await this.generateTokens(user.id, user.email);
      await this.userService.updateRefreshToken(user.id, tokens.refreshToken);
      return {
        success: true,
        message: 'Token refreshed successfully',
        data: tokens,
      };
    } catch (error) {
      return {
        success: false,
        message: error?.message || 'Token refresh failed',
        data: null,
      };
    }
  }

  async generateTokens(userId: string, email: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync({ sub: userId, email }),
      this.jwtService.signAsync({ sub: userId, email }, { expiresIn: '7d' }),
    ]);
    return { accessToken, refreshToken };
  }
} 