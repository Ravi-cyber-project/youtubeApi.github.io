import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ChannelDetailsDto {
  @IsNotEmpty()
  @IsString()
  channel_id: string;
}
