import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Property } from './entities/property.entity';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { ConfigService } from '@nestjs/config';
import { User } from '../users/entities/user.entity';

@Injectable()
export class PropertyService {
  private readonly BASE_URL: string;

  constructor(
    @InjectRepository(Property)
    private propertyRepository: Repository<Property>,

    @InjectRepository(User)
    private userRepository: Repository<User>, // ✅ Inject User Repository

    private readonly configService: ConfigService,
  ) {
    this.BASE_URL =
      this.configService.get<string>('BASE_URL') || 'http://localhost:3000';
  }

  /**
   * ✅ Create a new property & Assign to User
   */
  async create(createPropertyDto: CreatePropertyDto): Promise<Property> {
    console.log('📩 Received Data Before Processing:', createPropertyDto);

    const { userId, ...propertyData } = createPropertyDto;

    if (!userId) {
      throw new BadRequestException('User ID is required to create a property');
    }

    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // ✅ Ensure images array exists before assigning
    propertyData.images = propertyData.images?.filter((img) => img) || [];

    console.log('✅ Final Images Before Saving:', propertyData.images);

    const property = this.propertyRepository.create({
      ...propertyData,
      user, // ✅ Associate property with user
    });

    return await this.propertyRepository.save(property);
  }

  /**
   * ✅ FIND ALL properties (Include User Details)
   */
  async findAll(): Promise<Property[]> {
    const properties = await this.propertyRepository.find({
      relations: ['user'],
    });

    return properties.map((property) => {
      // ✅ Keep the original user object instead of modifying structure
      return {
        ...property,
        images:
          property.images?.map(
            (img) => `${this.BASE_URL}/uploads/property/${img}`,
          ) || [],
      };
    });
  }

  /**
   * ✅ FIND ONE property (Include User Details)
   */
  async findOne(id: number): Promise<Property> {
    const property = await this.propertyRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!property) {
      throw new NotFoundException(`Property with ID ${id} not found`);
    }

    return {
      ...property,
      images:
        property.images?.map(
          (img) => `${this.BASE_URL}/uploads/property/${img}`,
        ) || [],
    };
  }

  /**
   * ✅ UPDATE property while keeping images
   */
  async update(
    id: number,
    updatePropertyDto: UpdatePropertyDto,
  ): Promise<Property> {
    const property = await this.findOne(id); // Fetch existing property by ID

    // Keep existing images if none are provided
    const updatedImages =
      updatePropertyDto.images && updatePropertyDto.images.length
        ? updatePropertyDto.images
        : property.images;

    // Merge the updated data with the existing property data
    const updatedProperty = {
      ...property,
      ...updatePropertyDto,
      images: updatedImages, // Use updated images or keep the old ones
    };

    return await this.propertyRepository.save(updatedProperty); // Save the updated property
  }

  async findByUserId(userId: number) {
    return await this.propertyRepository.find({
      where: { user: { id: userId } },
      relations: ['user'], // Ensure the user relation is loaded
    });
  }

  /**
   * ✅ DELETE property
   */
  async remove(id: number): Promise<void> {
    // Find the property by id using the correct syntax
    const property = await this.propertyRepository.findOne({
      where: { id }, // Find property where id matches
    });
  
    if (!property) {
      throw new NotFoundException(`Property with ID ${id} not found`);
    }
  
    // Proceed with deletion if the property exists
    await this.propertyRepository.remove(property);
  }
  
}
