import instance from '../request';
import { Response } from '@/utils/response'
import { BaseModel } from '../model';
import { PageConfig } from '@/store/edit/state';

interface Config {
  config?: any;
  userSelectComponents?: any;
  templateId: string | number
  templateGit: string
  templateName: string
  projectName: string
  gitName: string
  version: string
}

export interface CreateProjectParams {
  pageConfig: {
    config: Config
    userSelectComponents: Array<Record<string, any>>
    components: Array<Record<string, any>>
  }
}

export interface Project extends BaseModel {
  id: number
  templateId: number
  name: string
  pageConfig: PageConfig
  releaseInfo: string
  version: string
  desc: string
  gitConfig: Record<string, any>;
}


async function createProject(params: CreateProjectParams) {
  const result = await instance.post('/project/createProject', params);
  return result.data;
}
async function query(params: {}) {
  const result = await instance.get<Project[], Response<Project[]>>(`/project/find`, {
    params,
  });
  return result.data;
}
async function save(params: any) {
  const result = await instance.post<Project, Response<Project>>('/project/updateConfig', params);
  return result;
}
async function release(params: any) {
  const result = await instance.post('/project/release', params);
  return result.data;
}
async function preview(params: any) {
  const result = await instance.post('/project/preview', params);
  return result.data;
}
async function updateOtherConfig(params: any) {
  const result = await instance.post('/project/updateOtherConfig', params);
  return result.data;
}

export {
  createProject,
  query,
  save,
  release,
  preview,
  updateOtherConfig,
}