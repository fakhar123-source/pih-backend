import { Controller, Post, Get, Delete, Param, Body } from '@nestjs/common';
import { RequestService } from './requests.service';
import { CreateRequestDto } from './dto/create-request.dto';

@Controller('requests') // ✅ Updated route
export class RequestController {
  constructor(private readonly requestService: RequestService) {}

  @Post()
  async create(@Body() createRequestDto: CreateRequestDto) {
    console.log('📌 Received Request:', createRequestDto);  // ✅ Debugging
    return this.requestService.create(createRequestDto);
  }



  @Get()
  async getAllRequests() {
    return await this.requestService.getAllRequests();
  }

  @Get(':id')
  async getRequestById(@Param('id') id: number) {
    return await this.requestService.getRequestById(id);
  }

  @Delete(':id')
  async deleteRequest(@Param('id') id: number) {
    return await this.requestService.deleteRequest(id);
  }
}
