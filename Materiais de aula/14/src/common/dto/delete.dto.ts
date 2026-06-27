import { Transform } from 'class-transformer';
import { IsArray, IsInt } from 'class-validator';

export class DeleteDto {
  @Transform(({ value }) =>
    Array.isArray(value) ? value.map(Number) : [Number(value)],
  )
  @IsArray()
  @IsInt({ each: true })
  ids: number[];
}
