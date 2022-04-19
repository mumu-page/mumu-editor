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

async function queryAll() {
  const result = await instance.get<TemplateData[], Response<TemplateData[]>>('/template/list');
  return result.data;
}

async function queryInfo(params: any): Promise<Response<TemplateData>> {
  const result = await instance.get('/template/detail', { params });
  return result.data;
}

export { queryAll, queryInfo }