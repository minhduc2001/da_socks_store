import { fetcher } from './Fetcher';

export interface IDepartment {
  id: number;
  name: string;
  active: boolean;
  description: string;
}

export interface ICreateDepartment {
  name: string;
  description: string;
}

function list(params?: Query): Promise<DataListResponse<IDepartment>> {
  return fetcher({ url: 'department', method: 'get', params });
}

function getAll(): Promise<IDepartment[]> {
  return fetcher({ url: 'department/all', method: 'get' });
}

function create(data: ICreateDepartment) {
  return fetcher({ url: '/department', method: 'post', data });
}

function update({ id, data }: { id: number; data: ICreateDepartment }) {
  return fetcher({
    url: `/department/${id}`,
    method: 'put',
    data,
  });
}

function active({
  id,
  active,
}: {
  id: string;
  active: boolean;
}): Promise<string> {
  return fetcher({
    url: `/department/${id}`,
    method: 'patch',
    data: { active },
  });
}

export default {
  list,
  create,
  update,
  active,
  getAll,
};
