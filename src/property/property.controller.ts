import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Delete,
  UseInterceptors,
  UploadedFiles,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { PropertyService } from './property.service';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('property')
export class PropertyController {
  constructor(private readonly propertyService: PropertyService) {}

  @Post()
  @UseInterceptors(
    FilesInterceptor('images', 5, {
      storage: diskStorage({
        destination: './uploads/property',
        filename: (req, file, callback) => {
          const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
          callback(null, `${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async create(
    @Body() createPropertyDto: CreatePropertyDto,
    @UploadedFiles() files: Express.Multer.File[] = [],
  ) {
    try {
      console.log('Received Property Data:', createPropertyDto);
      console.log('Uploaded Files:', files);

      createPropertyDto.images =
        files.length > 0 ? files.map((file) => file.filename) : [];

      console.log('Final Property Data:', createPropertyDto);

      const property = await this.propertyService.create(createPropertyDto);
      return property;
    } catch (error) {
      console.error('Error in Property Controller:', error);
      throw new HttpException(
        'Error saving property',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Patch(':id')
  @UseInterceptors(
    FilesInterceptor('images', 5, {
      storage: diskStorage({
        destination: './uploads/property',
        filename: (req, file, callback) => {
          const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
          callback(null, `${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async update(
    @Param('id') id: string,
    @Body() updatePropertyDto: UpdatePropertyDto,
    @UploadedFiles() files: Express.Multer.File[] = [],
  ) {
    console.log('Updating Property ID:', id);
    console.log('New Uploaded Files:', files);
  
    if (files && files.length > 0) {
      updatePropertyDto.images = files.map((file) => file.filename);
    }
  
    // Call the PropertyService to update the property
    return this.propertyService.update(+id, updatePropertyDto);
  }
  
  /**
   * ✅ Fetch All Properties
   */
  @Get()
  async findAll() {
    try {
      return await this.propertyService.findAll();
    } catch (error) {
      console.error('❌ Error fetching properties:', error);
      throw new HttpException(
        'Error fetching properties',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * ✅ Fetch a Single Property
   */
  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      return await this.propertyService.findOne(+id);
    } catch (error) {
      console.error('❌ Error fetching property:', error);
      throw new HttpException('Property not found', HttpStatus.NOT_FOUND);
    }
  }

  /**
   * ✅ Fetch Properties By User ID
   */
  @Get('user/:userId')
  async findByUser(@Param('userId') userId: string) {
    const properties = await this.propertyService.findByUserId(+userId);
    if (!properties.length) {
      throw new HttpException(
        'No properties found for this user.',
        HttpStatus.NOT_FOUND,
      );
    }
    return properties;
  }

  /**
   * ✅ Delete a Property
   */
  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      return await this.propertyService.remove(+id);
    } catch (error) {
      console.error('❌ Error deleting property:', error);
      throw new HttpException(
        'Error deleting property',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
