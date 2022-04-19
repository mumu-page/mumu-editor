import instance from '../request';

export default {
  async queryAll() {
    const result = await instance.get('/template/list');
    return result.data;
  },
  async queryInfo(params: any) {
    const result = await instance.get('/template/detail', {params});
    return result.data;
  }
}
