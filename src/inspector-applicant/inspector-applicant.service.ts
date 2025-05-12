import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InspectorApplicant } from './entities/inspector-applicant.entity';
import { CreateInspectorApplicantDto } from './dto/create-inspector-applicant.dto';
import { UpdateInspectorApplicantDto } from './dto/update-inspector-applicant.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class InspectorApplicantService {
  private readonly BASE_URL: string;

  constructor(
    @InjectRepository(InspectorApplicant)
    private inspectorRepository: Repository<InspectorApplicant>,
    private readonly configService: ConfigService,
  ) {
    this.BASE_URL =
      this.configService.get<string>('BASE_URL') || 'http://localhost:3000';
  }

  async create(
    createInspectorApplicantDto: CreateInspectorApplicantDto,
  ): Promise<InspectorApplicant> {
    const applicant = this.inspectorRepository.create(
      createInspectorApplicantDto,
    );
    return await this.inspectorRepository.save(applicant);
  }

  async update(
    id: number,
    updateInspectorApplicantDto: UpdateInspectorApplicantDto,
  ): Promise<InspectorApplicant> {
    await this.inspectorRepository.update(id, updateInspectorApplicantDto);
    return this.findOne(id);
  }

  async updateStatus(id: number, status: string): Promise<InspectorApplicant> {
    const applicant = await this.inspectorRepository.findOne({ where: { id } });

    if (!applicant) {
      throw new NotFoundException(
        `Inspector Applicant with ID ${id} not found`,
      );
    }

    applicant.status = status;
    return this.inspectorRepository.save(applicant);
  }

  async findAll(): Promise<InspectorApplicant[]> {
    const applicants = await this.inspectorRepository.find();
  return applicants.map((applicant) => ({
  ...applicant,
  image: applicant.image
    ? `${this.BASE_URL}/uploads/inspectorApplicants/${applicant.image}`
    : "",  // ✅ Always return a string (empty if null)
  experienceLetter: applicant.experienceLetter
    ? `${this.BASE_URL}/uploads/inspectorApplicants/${applicant.experienceLetter}`
    : "",  // ✅ Always return a string (empty if null)
}));

  }

  async findOne(id: number): Promise<InspectorApplicant> {
    const applicant = await this.inspectorRepository.findOne({ where: { id } });

    if (!applicant) {
      throw new NotFoundException(
        `Inspector Applicant with ID ${id} not found`,
      );
    }

    return {
      ...applicant,
      image: applicant.image
        ? `${this.BASE_URL}/uploads/inspectorApplicants/${applicant.image}`
        : "",  // ✅ Always return a string
      experienceLetter: applicant.experienceLetter
        ? `${this.BASE_URL}/uploads/inspectorApplicants/${applicant.experienceLetter}`
        : "",  // ✅ Always return a string
    };
  }


  async remove(id: number): Promise<void> {
    const result = await this.inspectorRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(
        `Inspector Applicant with ID ${id} not found`,
      );
    }
  }
   // Slot Management Methods





   // ✅ Update a slot (by index)
  async addSlot(id: number, slot: { date: string; time: string; charges: number }): Promise<InspectorApplicant> {
    const applicant = await this.findOne(id);
    if (!applicant.slots) {
      applicant.slots = [];
    }
    applicant.slots.push(slot);
    return await this.inspectorRepository.save(applicant);
  }

  async updateSlot(id: number, slotIndex: number, updatedSlot: { date: string; time: string; charges: number }): Promise<InspectorApplicant> {
    const applicant = await this.findOne(id);
    if (!applicant.slots || slotIndex < 0 || slotIndex >= applicant.slots.length) {
      throw new NotFoundException(`Slot at index ${slotIndex} not found`);
    }
    applicant.slots[slotIndex] = updatedSlot;
    return await this.inspectorRepository.save(applicant);
  }

  async removeSlot(id: number, slotIndex: number): Promise<InspectorApplicant> {
    const applicant = await this.findOne(id);
    if (!applicant.slots || slotIndex < 0 || slotIndex >= applicant.slots.length) {
      throw new NotFoundException(`Slot at index ${slotIndex} not found`);
    }
    applicant.slots.splice(slotIndex, 1);
    return await this.inspectorRepository.save(applicant);
  }
}
