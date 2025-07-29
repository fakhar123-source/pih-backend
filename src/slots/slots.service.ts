import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Slot } from './entities/slot.entity';
import { CreateSlotDto } from './dto/create-slot.dto';
import { UpdateSlotDto } from './dto/update-slot.dto';
import { User } from '../users/entities/user.entity'; // Add this import

@Injectable()
export class SlotsService {
  constructor(
    @InjectRepository(Slot)
    private readonly slotsRepository: Repository<Slot>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>, // Add user repository
  ) {}

  async create(createSlotDto: CreateSlotDto): Promise<Slot> {
    const slot = this.slotsRepository.create(createSlotDto);

    // If userId is provided, associate the slot with the user
    if (createSlotDto.userId) {
      const user = await this.userRepository.findOne({
        where: { id: createSlotDto.userId },
      });
      if (!user) {
        throw new NotFoundException(
          `User with ID ${createSlotDto.userId} not found`,
        );
      }
      slot.user = user;
    }

    return this.slotsRepository.save(slot);
  }

  async findAll(): Promise<Slot[]> {
    return this.slotsRepository.find({ relations: ['user'] });
  }

  async findOne(id: number): Promise<Slot> {
    const slot = await this.slotsRepository.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!slot) {
      throw new NotFoundException(`Slot with ID ${id} not found`);
    }
    return slot;
  }

  async update(id: number, updateSlotDto: UpdateSlotDto): Promise<Slot> {
    const slot = await this.findOne(id);
    Object.assign(slot, updateSlotDto);

    // Handle user update if provided
    if (updateSlotDto.userId) {
      const user = await this.userRepository.findOne({
        where: { id: updateSlotDto.userId },
      });
      if (!user) {
        throw new NotFoundException(
          `User with ID ${updateSlotDto.userId} not found`,
        );
      }
      slot.user = user;
    }

    return this.slotsRepository.save(slot);
  }

  async remove(id: number): Promise<void> {
    const result = await this.slotsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Slot with ID ${id} not found`);
    }
  }

  async findSlotsByUser(userId: number): Promise<Slot[]> {
    return this.slotsRepository.find({
      where: { user: { id: userId } },
      relations: ['user'],
    });
  }
}
