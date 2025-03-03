import { IAppointment, ICreateAppointment } from './ApiAppointment';
import { EGender } from './ApiUser';
import { fetcher } from './Fetcher';

interface DiaDanh {
  id: string;
  name: string;
}
export interface IPatient {
  id?: number;
  full_name: string;
  birthday: Date;
  wards: DiaDanh;
  district: DiaDanh;
  province: DiaDanh;
  gender: EGender;
  phone: string;
}

export interface IPatientFullInfo {
  id?: number;
  full_name: string;
  birthday: Date;
  wards: DiaDanh;
  district: DiaDanh;
  province: DiaDanh;
  gender: EGender;
  phone: string;

  appointments: IAppointment[];
}

function list(params: Query): Promise<DataListResponse<IPatient>> {
  return fetcher({ url: 'patient', method: 'get', params });
}

function search(key: string): Promise<IPatient[]> {
  return fetcher({ url: 'patient/search/' + key, method: 'get' });
}

function getFullInfo(id?: string): Promise<IPatientFullInfo> {
  return fetcher({ url: 'patient/full/' + id, method: 'get' });
}

function update(payload: { id: number; data: any }): Promise<IPatientFullInfo> {
  return fetcher({
    url: 'patient/' + payload.id,
    method: 'patch',
    data: payload.data,
  });
}

export default {
  list,
  search,
  getFullInfo,
  update,
};
