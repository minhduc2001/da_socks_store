import { downloadFile, fetcher } from './Fetcher';

export interface IGetStatParams {
  start_date: string;
  end_date: string;
}

interface IServiceStatisticRes {
  name: string;
  value: number;
}

export interface IGetRoomStatisticParams {
  year: number;
  month?: number;
  day?: number;
}

interface IRoomStatisticRes {
  name: string;
  value: number;
  type: string;
}

interface IRoomStatisticInCurrentWeekRes {
  type: string;
  value: number;
  name: string;
}

export interface IRevenueStatisticParams {
  year: number;
}

interface IRevenueStatisticRes {
  type: string;
  value: number;
}

function getServiceStatistic(
  params: IGetStatParams,
): Promise<IServiceStatisticRes[]> {
  return fetcher({ url: '/statitic/stats-service', method: 'get', params });
}

function getTypeServiceStatitic(
  params: IGetStatParams,
): Promise<IServiceStatisticRes[]> {
  return fetcher({
    url: '/statitic/stats-typeservice',
    method: 'get',
    params,
  });
}

function exportExcelService(params: IGetStatParams) {
  return downloadFile({
    url: '/statitic/export-service',
    params,
    fileName: `export_excel_service_${params.start_date}_${params.end_date}`,
  });
}

function exportExcelTypeService(params: IGetStatParams) {
  return downloadFile({
    url: '/statitic/export-typeservice',
    params,
    fileName: `export_typeservice_${params.start_date}_${params.end_date}`,
  });
}

function getTkBenhNhan(params: IGetStatParams) {
  return fetcher({ url: 'statitic/tk-benh-nhan', method: 'get', params });
}

function getTkTheoNgay(params: IGetStatParams) {
  return fetcher({ url: 'statitic/tk-benh-nhan-v1', method: 'get', params });
}

function exportBenhNhan(params: IGetStatParams) {
  return downloadFile({
    url: 'statitic/export-benh-nhan',
    params,
    fileName: `export_ngay_${params.start_date}_${params.end_date}`,
  });
}

function exportBenhNhanV1(params: IGetStatParams) {
  return downloadFile({
    url: 'statitic/export-benh-nhan-v1',
    params,
    fileName: `export_benhnhan_${params.start_date}_${params.end_date}`,
  });
}

export default {
  getServiceStatistic,
  exportExcelService,
  getTypeServiceStatitic,
  exportExcelTypeService,
  getTkBenhNhan,
  getTkTheoNgay,
  exportBenhNhan,
  exportBenhNhanV1,
};
