import { PartialType } from '@nestjs/mapped-types';
import { CreateTruyenDto } from './create-truyen.dto';

export class UpdateTruyenDto extends PartialType(CreateTruyenDto) {}
