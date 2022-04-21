import instance from '../request';

async function query(params: any) {
  const result = await instance.get(`/component/findAll`, {
    params,
  });
  return result.data;
}

export { query }