import { IsNotEmpty, IsString } from 'class-validator';

export class VideoDetailsDto {
  @IsNotEmpty()
  @IsString()
  video_id: string;
}
