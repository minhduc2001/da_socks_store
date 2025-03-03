import { Moment } from 'moment';
import { IPatient } from './ApiPatient';
import { IUsedTypeService } from './ApiService';
import { EGender, IUser } from './ApiUser';
import { downloadFile, fetcher } from './Fetcher';
import { ppid } from 'process';

export enum BillStatus {
  Pending = 'Khởi tạo hóa đơn',
  Resolve = 'Đã thanh toán',
  Cancel = 'Bị Lỗi',
}

export enum AppointmentStatus {
  Pending = 'Chờ duyệt',
  Waitting = 'Chờ khám',
  Doing = 'Đang khám',
  Waitting_Payment = 'Đang chờ thanh toán',
  Finish = 'Đã khám xong',
}

export interface IBill {
  id: number;
  type: number;
  status: BillStatus;
}

export interface IAppointment {
  id?: number;
  appointment_date: Date;
  patient: IPatient;
  doctor?: IUser;
  status: AppointmentStatus;
  used_type_services: IUsedTypeService[];
  diagnosis: any;
  symptoms: string;
  bills: IBill[];
}

export interface Root {
  id: number;
  appointment_date: string;
  status: string;
  patient: IUser;
  used_type_services: IUsedTypeService[];
}

export interface ICreateAppointmentNew {
  full_name?: string;
  birthday?: Date;
  gender?: EGender;
  phone?: string;
  type_service_id?: number;
  wards?: string;
  district?: string;
  province?: string;
  symptoms?: string;
}

export interface ICreateAppointmentFutureNew {
  full_name?: string;
  birthday?: Date;
  gender?: EGender;
  phone?: string;
  insurance?: boolean;
  type_service_id?: number;
  wards?: string;
  district?: string;
  province?: string;
  symptoms?: string;
  appointment_date: Moment;
}

export interface ICreateAppointment extends ICreateAppointmentNew {
  patient_id: number;
}

type CreateAppointment = ICreateAppointment | ICreateAppointmentNew;

function list(params: Query): Promise<DataListResponse<IAppointment>> {
  return fetcher({ url: 'appointment', method: 'get', params });
}

function listBS(params: Query): Promise<DataListResponse<IAppointment>> {
  return fetcher({ url: 'appointment/bs', method: 'get', params });
}

function create(data: Partial<CreateAppointment>) {
  return fetcher({ url: 'appointment', method: 'post', data });
}

function createCustomer(data: any) {
  return fetcher({ url: 'appointment/customer', method: 'post', data });
}

function update(data: any) {
  return fetcher({
    url: 'appointment/' + data.id,
    method: 'put',
    data: data.data,
  });
}

function updateFuture(data: any) {
  return fetcher({
    url: 'appointment/' + data.id + '/future',
    method: 'put',
    data: data.data,
  });
}

function updateFuture1(data: any) {
  return fetcher({
    url: 'appointment/' + data.id + '/future1',
    method: 'put',
    data: data.data,
  });
}

function getDoctor(params: Partial<Query>): Promise<IUser[]> {
  return fetcher({ url: 'user/doctor', method: 'get', params });
}

function listFuture(params: Query): Promise<DataListResponse<IAppointment>> {
  return fetcher({ url: 'appointment/future', method: 'get', params });
}

function createFuture(data: Partial<CreateAppointment>) {
  return fetcher({ url: 'appointment/future', method: 'post', data });
}

function saveKetQua(payload: any) {
  const { id, ...data } = payload;
  return fetcher({ url: `appointment/${id}/ketqua`, method: 'post', data });
}

function saveDTCT(payload: any) {
  const { id, ...data } = payload;
  return fetcher({ url: `appointment/${id}/dtct`, method: 'post', data });
}
function saveDonThuoc(payload: any) {
  const { id, ...data } = payload;
  return fetcher({ url: `appointment/${id}/donthuoc`, method: 'post', data });
}

function kham(data: any) {
  return fetcher({ url: `appointment/kham`, method: 'post', data });
}

function remove(id: number) {
  return fetcher({ url: `appointment/` + id, method: 'delete' });
}

function count(): Promise<{
  cho_kham: number;
  dang_kham: number;
  cho_thanh_toan: number;
  da_thanh_toan: number;
}> {
  return fetcher({ url: `appointment/count`, method: 'get' });
}

function waitting(data: any) {
  return fetcher({ url: `appointment/waitting-payment`, method: 'post', data });
}

function print(id: number) {
  return downloadFile({
    url: `prescription/` + id + '/print',
    type: 'pdf',
    open: true,
  });
}

function printDKKB(id: number) {
  return downloadFile({
    url: `appointment/` + id + '/print-dkkb',
    type: 'pdf',
    open: true,
  });
}

function printHD(id: number) {
  return downloadFile({
    url: `appointment/` + id + '/print-invoice',
    type: 'pdf',
    open: true,
  });
}

function printKQKB(id: number) {
  return downloadFile({
    url: `appointment/` + id + '/print-kqkb',
    type: 'pdf',
    open: true,
  });
}

function printLT(id: number) {
  return downloadFile({
    url: `appointment/` + id + '/print-lt',
    type: 'pdf',
    open: true,
  });
}

export default {
  list,
  create,
  update,
  createCustomer,
  getDoctor,
  listFuture,
  createFuture,
  saveKetQua,
  saveDTCT,
  saveDonThuoc,
  listBS,
  kham,
  count,
  waitting,
  updateFuture,
  print,
  remove,
  printDKKB,
  printHD,
  printKQKB,
  printLT,
  updateFuture1,
};
