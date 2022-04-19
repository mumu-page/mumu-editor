import instance from '../request';
import { Response } from '@/utils/response'
import { BaseModel } from '../model';

export interface TemplateData extends BaseModel {
  id: number;
  templateName: string,
  author: string,
  name: string,
  snapshot: string,
  gitUrl: string,
  type: number,
  version: string,
}

interface pageConfig {

}

export default {
  async queryAll() {
    const result = await instance.get<TemplateData[], Response<TemplateData[]>>('/template/list');
    return result.data;
  },
  async queryInfo(params: any): Promise<Response<TemplateData>> {
    const result = await instance.get('/template/detail', { params });
    return result.data;
  }
}
