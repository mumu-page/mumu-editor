import instance from '../request';

interface Config {
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
  // id: number
  // templateId: number
  // name: string
  // pageConfig: Config
  // gitConfig: string
  // releaseInfo: string
  // version: string
  // desc: string
}

export default {
  async createProject(params: CreateProjectParams) {
    const result = await instance.post('/project/createProject', params);
    return result.data;
  },
  async query(params: {}) {
    const result = await instance.get(`/project/query`, {
      params,
    });
    return result.data;
  },
  async save(params: any) {
    const result = await instance.post('/project/updateConfig', params);
    return result.data;
  },
  async release(params: any) {
    const result = await instance.post('/project/release', params);
    return result.data;
  },
  async preview(params: any) {
    const result = await instance.post('/project/preview', params);
    return result.data;
  },
  async updateOtherConfig(params: any) {
    const result = await instance.post('/project/updateOtherConfig', params);
    return result.data;
  },
}
