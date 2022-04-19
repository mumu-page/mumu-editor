import instance from '../request';

async function query(params: any) {
  const result = await instance.get(`/component/query`, {
    params,
  });
  return result.data;
}

export { query }