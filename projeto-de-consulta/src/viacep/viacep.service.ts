import { Injectable, BadRequestException } from '@nestjs/common';
import axios from 'axios';

/**
 * O service ViacepService vai ser usado para consultar endereços na API pública ViaCEP,
 * ele pode ser testado com a rota GET /auth/cep?cep=88801000
 * e vai ser importado em AutenticacaoService para obter dados de endereço.
 */
@Injectable()
export class ViacepService {
  private api: axios.AxiosInstance;

  constructor() {
    const baseURL = process.env.VIACEP_URL || 'https://viacep.com.br/ws/';
    console.log(`[VIACEP SERVICE] Inicializando Axios. URL base: ${baseURL}`);
    this.api = axios.create({
      baseURL,
    });
  }

  async getAddress(cep: string) {
    const cepLimpo = cep.replace(/\D/g, '');
    console.log(`[VIACEP SERVICE] Buscando CEP: ${cepLimpo}`);
    
    if (cepLimpo.length !== 8) {
      console.warn(`[VIACEP SERVICE] CEP inválido: ${cepLimpo}`);
      throw new BadRequestException('Formato de CEP inválido. Deve conter 8 dígitos.');
    }

    try {
      const { data } = await this.api.get(`${cepLimpo}/json/`);
      if (data.erro) {
        console.warn(`[VIACEP SERVICE] CEP ${cepLimpo} não encontrado.`);
        throw new BadRequestException('CEP não encontrado');
      }
      console.log(`[VIACEP SERVICE] CEP ${cepLimpo} encontrado.`);
      return data;
    } catch (error) {
      console.error(`[VIACEP SERVICE] Erro ao buscar CEP ${cepLimpo}:`, error.message);
      throw error;
    }
  }
}
