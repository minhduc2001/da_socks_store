import { IUser } from './ApiUser';
import { fetcher } from './Fetcher';

export interface IServiceRes {
  id: string;
  name: string;
  unit: string;
  price: number;
  description: string;
  active: boolean;
}

export interface ITypeService {
  id: number;
  name: string;
  description: string;
  active: boolean;
  price: number;
}

export interface IGetServicesRes {
  metadata: {
    currentPage: number;
    itemsPerPage: number;
    totalPages: number;
    totalItems: number;
  };
  results: IServiceRes[];
}

export interface ICreateServiceBody {
  name: string;
  description: string;
  price: number;
  unit: string;
}

export interface IUsedTypeService {
  id: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: any;
  price: number;
  type_service: ITypeService;
  doctor: IUser;
}

export interface ICreateTypeServiceBody {
  name: string;
  description?: string;
}

function getServices(params?: Query): Promise<IGetServicesRes> {
  return fetcher({ url: 'services', method: 'get', params });
}

function createService(data: ICreateServiceBody) {
  return fetcher({ url: '/services', method: 'post', data });
}

function updateService({ id, data }: { id: number; data: ICreateServiceBody }) {
  return fetcher({
    url: `/services/${id}`,
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
    url: `/services/${id}`,
    method: 'patch',
    data: { active },
  });
}

function getTypeServices(
  params?: Query,
): Promise<DataListResponse<ITypeService>> {
  return fetcher({ url: 'type-services', method: 'get', params });
}

function getAllTypeService(): Promise<ITypeService[]> {
  return fetcher({ url: 'type-services/all', method: 'get' });
}

function createTypeService(data: ICreateTypeServiceBody) {
  return fetcher({ url: '/type-services', method: 'post', data });
}

function updateTypeService({
  id,
  data,
}: {
  id: number;
  data: ICreateTypeServiceBody;
}) {
  return fetcher({
    url: `/type-services/${id}`,
    method: 'put',
    data,
  });
}

function activeTypeService({
  id,
  active,
}: {
  id: number;
  active: boolean;
}): Promise<string> {
  return fetcher({
    url: `/type-services/${id}`,
    method: 'patch',
    data: { active },
  });
}

export default {
  getServices,
  createService,
  updateService,
  active,
  getTypeServices,
  createTypeService,
  updateTypeService,
  activeTypeService,
  getAllTypeService,
};
