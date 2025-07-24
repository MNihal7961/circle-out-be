import { Controller, Patch, Param, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './update-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Patch(':id')
  async updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.updateUser(id, updateUserDto);
  }
}
