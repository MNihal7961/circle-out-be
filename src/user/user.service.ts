import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './models/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

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

  async createUser(createUserDto: CreateUserDto): Promise<any> {
    try {
      const user = new this.userModel(createUserDto);
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

  async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<any> {
    try {
      const updatedUser = await this.userModel.findByIdAndUpdate(id, updateUserDto, { new: true });
      return {
        success: true,
        message: 'User updated successfully',
        data: updatedUser,
      };
    } catch (error) {
      return {
        success: false,
        message: error?.message || 'Error updating user',
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