import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Request } from './entities/request.entity';
import { CreateRequestDto } from './dto/create-request.dto';

@Injectable()
export class RequestService {
  constructor(
    @InjectRepository(Request)
    private readonly requestRepository: Repository<Request>,
  ) {}

async create(createRequestDto: CreateRequestDto): Promise<Request> {
  try {
    console.log("Received Data at Backend:", createRequestDto); // Debugging Log

    const newRequest = this.requestRepository.create(createRequestDto);
    return await this.requestRepository.save(newRequest);
  } catch (error) {
    throw new Error(`Failed to create request: ${error.message}`);
  }
}


  /**
   * ✅ Create a new request
   */
 

  /**
   * ✅ Get all requests
   */
  async getAllRequests(): Promise<Request[]> {
    return await this.requestRepository.find();
  }

  /**
   * ✅ Get a request by ID
   */
  async getRequestById(id: number): Promise<Request> {
    const request = await this.requestRepository.findOne({ where: { id } });
    if (!request) {
      throw new NotFoundException(`Request with ID ${id} not found.`);
    }
    return request;
  }

  /**
   * ✅ Delete a request
   */
  async deleteRequest(id: number): Promise<void> {
    const request = await this.getRequestById(id);
    if (!request) {
      throw new NotFoundException(`Request with ID ${id} not found.`);
    }
    await this.requestRepository.delete(id);
  }
}
