import { Test, TestingModule } from '@nestjs/testing';
import { InspectorApplicantService } from './inspector-applicant.service';

describe('InspectorApplicantService', () => {
  let service: InspectorApplicantService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InspectorApplicantService],
    }).compile();

    service = module.get<InspectorApplicantService>(InspectorApplicantService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
