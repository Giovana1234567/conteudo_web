import { ApiProperty } from '@nestjs/swagger';

/**
 * O dto UploadDto vai ser usado para mapear o arquivo enviado via formulário multipart no Swagger,
 * ele pode ser testado com o endpoint POST /estudante/upload
 * e vai ser importado em EstudanteController para receber e salvar o upload.
 */
export class UploadDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  file: any;
}