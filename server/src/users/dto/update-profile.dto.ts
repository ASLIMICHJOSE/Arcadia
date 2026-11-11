import { IsOptional, IsString, Matches, MaxLength, MinLength } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  @MaxLength(512, { message: 'Avatar URL cannot exceed 512 characters' })
  @Matches(/^(https:\/\/[^\s"'<>]+|\/images\/[a-zA-Z0-9/_-]+\.(png|jpg|jpeg|webp|svg|avif))$/, {
    message: 'Avatar must be a valid https:// URL or local /images asset path',
  })
  @Transform(({ value }: { value?: string }) => value?.trim())
  avatar?: string;

  @IsOptional()
  @IsString()
  @MinLength(2, { message: 'Title must be at least 2 characters long' })
  @MaxLength(48, { message: 'Title cannot exceed 48 characters' })
  @Matches(/^[a-zA-Z0-9 _'.,-]+$/, {
    message: 'Title contains unsupported characters',
  })
  @Transform(({ value }: { value?: string }) => value?.trim())
  title?: string;
}

