import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './models/user.schema';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async findByEmail(email: string): Promise<any> {
    try {
      const user = await this.userModel.findOne({ email });
      return {
        success: true,
        message: user ? 'User found' : 'User not found',
        data: user,
      };
    } catch (error) {
      return {
        success: false,
        message: error?.message || 'Error finding user by email',
        data: null,
      };
    }
  }

  async createUser(email: string, password: string): Promise<any> {
    try {
      const user = new this.userModel({ email, password });
      const savedUser = await user.save();
      return {
        success: true,
        message: 'User created successfully',
        data: savedUser,
      };
    } catch (error) {
      return {
        success: false,
        message: error?.message || 'Error creating user',
        data: null,
      };
    }
  }

  async updateRefreshToken(userId: string, refreshToken: string): Promise<any> {
    try {
      await this.userModel.findByIdAndUpdate(userId, { refreshToken });
      return {
        success: true,
        message: 'Refresh token updated',
        data: null,
      };
    } catch (error) {
      return {
        success: false,
        message: error?.message || 'Error updating refresh token',
        data: null,
      };
    }
  }

  async findById(id: string): Promise<any> {
    try {
      const user = await this.userModel.findById(id);
      return {
        success: true,
        message: user ? 'User found' : 'User not found',
        data: user,
      };
    } catch (error) {
      return {
        success: false,
        message: error?.message || 'Error finding user by id',
        data: null,
      };
    }
  }
} 