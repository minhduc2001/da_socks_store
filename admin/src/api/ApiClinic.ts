import { fetcher } from './Fetcher';

export interface ICreateClinic {
  name: string;
  description: string;
}

export interface IClinic {
  id: number;
  name: string;
  description: string;
}

function getAll(): Promise<IClinic[]> {
  return fetcher({ url: 'clinic-room/all', method: 'get' });
}

function create(data: ICreateClinic) {
  return fetcher({ url: '/clinic-room', method: 'post', data });
}

function update({ id, data }: { id: number; data: ICreateClinic }) {
  return fetcher({
    url: `/clinic-room/${id}`,
    method: 'put',
    data,
  });
}

function list(params?: Query): Promise<DataListResponse<IClinic>> {
  return fetcher({ url: 'clinic-room', method: 'get', params });
}

export default {
  getAll,
  list,
  create,
  update,
};
