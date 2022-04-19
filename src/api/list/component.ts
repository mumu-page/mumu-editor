import instance from '../request';

export default {
  async query(params: any) {
    const result = await instance.get(`/component/query`, {
      params,
    });
    return result.data;
  }
}
