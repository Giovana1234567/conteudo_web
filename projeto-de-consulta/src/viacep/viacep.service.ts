import { Injectable, BadRequestException } from '@nestjs/common';
import axios from 'axios';

/**
 * SERVIÇO: ViacepService (Integração de API Externa)
 * 
 * Conectividade:
 * - Responsável por consumir a API REST pública do ViaCEP.
 * - Injeta uma instância configurada do Axios carregando a `baseURL` a partir das variáveis do `.env`.
 * - É consumido pelo `AuthService` para prover informações de endereço para autenticação/perfil.
 * - Registrado no `ViacepModule` (que exporta `ViacepService` para que outros módulos possam importá-lo).
 */
@Injectable()
export class ViacepService {
  private api: axios.AxiosInstance;

  constructor() {
    // Configura o Axios carregando o endpoint base das variáveis do .env
    const baseURL = process.env.VIACEP_URL || 'https://viacep.com.br/ws/';
    console.log(`[VIACEP SERVICE] Inicializando instância do Axios. Base URL: ${baseURL}`);
    
    this.api = axios.create({
      baseURL,
    });
  }

  async getAddress(cep: string) {
    const cepLimpo = cep.replace(/\D/g, ''); // Remove caracteres não numéricos
    console.log(`[VIACEP SERVICE] Buscando CEP: ${cepLimpo}`);
    
    if (cepLimpo.length !== 8) {
      console.warn(`[VIACEP SERVICE] Tentativa de busca com formato de CEP inválido: ${cepLimpo}`);
      throw new BadRequestException('Formato de CEP inválido. Deve conter 8 dígitos.');
    }

    try {
      const { data } = await this.api.get(`${cepLimpo}/json/`);
      
      if (data.erro) {
        console.warn(`[VIACEP SERVICE] CEP ${cepLimpo} não foi localizado na base do ViaCEP.`);
        throw new BadRequestException('CEP não encontrado');
      }

      console.log(`[VIACEP SERVICE] Endereço retornado com sucesso para o CEP ${cepLimpo}: ${data.logradouro}, ${data.bairro}`);
      return data;
    } catch (error) {
      console.error(`[VIACEP SERVICE] Erro na requisição HTTP externa para o CEP ${cepLimpo}`, error.message);
      throw error;
    }
  }
}
