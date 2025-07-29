import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete,
  Query 
} from '@nestjs/common';
import { SlotsService } from './slots.service';
import { CreateSlotDto } from './dto/create-slot.dto';
import { UpdateSlotDto } from './dto/update-slot.dto';

@Controller('slots')
export class SlotsController {
  constructor(private readonly slotsService: SlotsService) {}

  @Post()
  create(@Body() createSlotDto: CreateSlotDto) {
    return this.slotsService.create(createSlotDto);
  }

  @Get()
  findAll(@Query('userId') userId?: number) {
    if (userId) {
      return this.slotsService.findSlotsByUser(+userId);
    }
    return this.slotsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.slotsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateSlotDto: UpdateSlotDto) {
    return this.slotsService.update(id, updateSlotDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.slotsService.remove(id);
  }
}