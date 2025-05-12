import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { InspectorApplicantService } from './inspector-applicant.service';
import { CreateInspectorApplicantDto } from './dto/create-inspector-applicant.dto';
import { UpdateInspectorApplicantDto } from './dto/update-inspector-applicant.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('inspector-applicant')
export class InspectorApplicantController {
  constructor(private readonly inspectorService: InspectorApplicantService) {}

  @Post()
  @UseInterceptors(
    FilesInterceptor('files', 2, {
      storage: diskStorage({
        destination: './uploads/inspectorApplicants',
        filename: (req, file, callback) => {
          const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
          callback(null, `${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async create(
    @Body() createInspectorApplicantDto: CreateInspectorApplicantDto,
    @UploadedFiles() files: Express.Multer.File[] = [],
  ) {
    console.log('📂 Uploaded Files:', files);

    createInspectorApplicantDto.image =
      files.length > 0 ? files[0].filename : undefined;
    createInspectorApplicantDto.experienceLetter =
      files.length > 1 ? files[1].filename : undefined;

    return this.inspectorService.create(createInspectorApplicantDto);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateInspectorApplicantDto: UpdateInspectorApplicantDto,
  ) {
    return this.inspectorService.update(+id, updateInspectorApplicantDto);
  }

  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.inspectorService.updateStatus(+id, status);
  }

  @Get()
  findAll() {
    return this.inspectorService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.inspectorService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.inspectorService.remove(+id);
  }
// ✅ Add Slot
  @Post(':id/slot')
  async addSlot(@Param('id') id: number, @Body() slot: { date: string; time: string; charges: number }) {
    return this.inspectorService.addSlot(id, slot);
  }

  // ✅ Update Slot
  @Patch(':id/slot/:slotIndex')
  async updateSlot(
    @Param('id') id: number,
    @Param('slotIndex') slotIndex: number,
    @Body() updatedSlot: { date: string; time: string; charges: number }
  ) {
    return this.inspectorService.updateSlot(id, slotIndex, updatedSlot);
  }

  // ✅ Delete Slot
  @Delete(':id/slot/:slotIndex')
  async removeSlot(@Param('id') id: number, @Param('slotIndex') slotIndex: number) {
    return this.inspectorService.removeSlot(id, slotIndex);
  }
}
