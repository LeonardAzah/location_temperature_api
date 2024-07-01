import { IsString } from 'class-validator';

export class VisitorNameDto {
  @IsString()
  visitor_name: string;
}
