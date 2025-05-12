import { Test, TestingModule } from '@nestjs/testing';
import { InspectorApplicantController } from './inspector-applicant.controller';
import { InspectorApplicantService } from './inspector-applicant.service';

describe('InspectorApplicantController', () => {
  let controller: InspectorApplicantController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InspectorApplicantController],
      providers: [InspectorApplicantService],
    }).compile();

    controller = module.get<InspectorApplicantController>(InspectorApplicantController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
