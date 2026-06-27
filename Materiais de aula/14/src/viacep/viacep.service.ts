import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class ViacepService {
    private api: axios.AxiosInstance;

    constructor() {
        this.api = axios.create({
            baseURL: process.env.VIACEP_URL,
        })
    }

    async getAddress(cep: string) {
        const { data } = await this.api.get(`${cep}/json/`);
        return data;
    }
}
