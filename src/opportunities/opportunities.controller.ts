import { Body, Controller, Get, Param, Post, Query, Req, UploadedFile, UseInterceptors } from '@nestjs/common';
import { OpportunitiesService } from './opportunities.service';
import { CreateOpportunityDto } from './dto/create-opportunity.dto';
import { Auth } from 'src/roles/decorators/roles.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApplyFormDto } from './dto/apply-form.dto';

@Controller('opportunities')
export class OpportunitiesController {
  constructor(private readonly service: OpportunitiesService) {}

  @Post()
  @Auth('hr')
  async create(@Body() dto: CreateOpportunityDto, @Param() _params: any, @Query() _qs: any, @Req() req: any) {
    const userId = req?.user?.sub ?? req?.user?.id;
    const opp = await this.service.create(dto, userId);
    return opp;
  }

  @Get()
  async findAll(@Query('activeOnly') activeOnly?: string) {
    const onlyActive = activeOnly !== 'false';
    return this.service.findAll(onlyActive);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.service.findOne(Number(id));
  }

  @Post(':id/apply')
  @Auth()
  @UseInterceptors(FileInterceptor('cv'))
  async apply(
    @Param('id') id: string,
    @Body() dto: ApplyFormDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: any,
  ) {
    const applicantId = req.user?.sub ?? req.user?.id;
    const app = await this.service.applyWithForm(Number(id), Number(applicantId), dto, file);
    return app;
  }

  @Get(':id/applications')
  @Auth('hr')
  async listApplications(@Param('id') id: string) {
    return this.service.listApplications(Number(id));
  }
}
