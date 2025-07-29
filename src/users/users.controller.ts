import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  Req,
  UseGuards,
  UploadedFiles,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FileFieldsInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { AuthGuard } from '@nestjs/passport';
import { extname } from 'path';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  // @UseGuards(AuthGuard('jwt'))
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  // @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  // @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.usersService.remove(id);
  }

  @Patch(':id/profile')
  @UseInterceptors(
    FileInterceptor('picture', {
      storage: diskStorage({
        destination: './uploads/profile', // Public folder
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          callback(null, `${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async updateProfile(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFile() file: Express.Multer.File, // For single file upload
    @Req() req,
  ) {
    if (file) {
      // Generate the correct URL for the image
      updateUserDto.image = `http://localhost:3000/uploads/profile/${file.filename}`;
    }

    const userId = parseInt(id, 10);
    return await this.usersService.updateUser(userId, updateUserDto);
  }
  @Patch(':id/inspector')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'image', maxCount: 1 },
        { name: 'experienceLetter', maxCount: 1 },
      ],
      {
        storage: diskStorage({
          destination: './uploads/inspectorApplicants',
          filename: (req, file, callback) => {
            const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
            callback(null, `${uniqueSuffix}${extname(file.originalname)}`);
          },
        }),
      },
    ),
  )
  async updateInspectorDetails(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFiles()
    files: {
      image?: Express.Multer.File[];
      experienceLetter?: Express.Multer.File[];
    },
  ) {
    const userId = parseInt(id, 10);

    // Handle image upload
    if (files?.image?.[0]) {
      updateUserDto.image = `http://localhost:3000/uploads/inspectorApplicants/${files.image[0].filename}`;
    }

    // Handle experience letter upload
    if (files?.experienceLetter?.[0]) {
      updateUserDto.experienceLetter = `http://localhost:3000/uploads/inspectorApplicants/${files.experienceLetter[0].filename}`;
    }

    return await this.usersService.update(userId, updateUserDto);
  }
}
