import { useMutation, useQuery } from "@tanstack/react-query";
import moment from "moment";
import { useEffect, useMemo, useState } from "react";
import { Column } from "@ant-design/plots";
import { Divider, Space, DatePicker, Row, Col, Card } from "antd";
import { SelectGlobal } from "@/components/AntdGlobal";
import { Pie } from "@ant-design/plots";
import { Line } from "@ant-design/plots";
import ApiRoom from "@/api/ApiRoom";
import ButtonGlobal from "@/components/ButtonGlobal";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import advancedFormat from "dayjs/plugin/advancedFormat";
import localeData from "dayjs/plugin/localeData";
import weekday from "dayjs/plugin/weekday";
import weekOfYear from "dayjs/plugin/weekOfYear";
import weekYear from "dayjs/plugin/weekYear";
import { ArrowDownOutlined, ArrowUpOutlined } from "@ant-design/icons";
import ApiStatistic, { IGetStatParams } from "@/api/ApiStatistic";
import TableGlobal from "@/components/TableGlobal";
import { ColumnsType } from "antd/lib/table";
const dateFormat = "YYYY/MM/DD";
dayjs.extend(customParseFormat);
dayjs.extend(advancedFormat);
dayjs.extend(weekday);
dayjs.extend(localeData);
dayjs.extend(weekOfYear);
dayjs.extend(weekYear);


export default function TKbenhnhan() {
    const [serviceStatisticParams, setServiceStatisticParams] =
        useState<IGetStatParams>({
            start_date: dayjs().subtract(30, "day").format(dateFormat).toString(),
            end_date: dayjs().format(dateFormat),
        });

    const { data } = useQuery(
        ["get_tk_benh_nhan", [serviceStatisticParams]],
        () => ApiStatistic.getTkBenhNhan(serviceStatisticParams)
    );

    const handleRangeChange = (dates: any, dateStrings: any) => {
        setServiceStatisticParams({
            start_date: dateStrings[0],
            end_date: dateStrings[1],
        });
    };

    const columns: ColumnsType<any> = [
        {
            title: "STT",
            align: "center",
            width: 80,
            render: (_, __, i) => i + 1,
        },
        {
            title: "Tên bệnh nhân",
            align: "center",
            dataIndex: 'full_name',
        },
        {
            title: "Tổng số ca",
            align: "center",
            dataIndex: 'total_cakham'
        },
        {
            title: "Tiền khám",
            align: "center",
            dataIndex: 'total_dichvu',
            render: (v) => Number(v).toLocaleString()
        },
        {
            title: "Tiền điều trị",
            align: "center",
            dataIndex: 'total_lieutrinh',
            render: (v) => Number(v).toLocaleString()
        },
        {
            title: "Tổng tiền",
            align: "center",
            dataIndex: 'total',
            render: (v) => Number(v).toLocaleString()
        },
    ]

    const exportExcelServiceMutation = useMutation(
        ApiStatistic.exportBenhNhan
    );

    const handleExportExcel = () => {
        exportExcelServiceMutation.mutate(serviceStatisticParams);
    };

    return (
        <div className="service-statistic">
            <h1 className="text-center">BÁO CÁO DOANH THU KHÁM BỆNH VÀ ĐIỀU TRỊ THEO BỆNH NHÂN</h1>
            <div className="flex justify-end">
                <Space>
                    <ButtonGlobal
                        className="!h-[30px]"
                        title="Xuất excel"
                        onClick={handleExportExcel}
                    />
                    {/* @ts-ignore */}
                    <DatePicker.RangePicker
                        format={dateFormat}
                        defaultValue={[
                            dayjs(dayjs().subtract(30, "day"), dateFormat),
                            dayjs(dayjs(), dateFormat),
                        ]}
                        // disabledDate={(d) => d >= moment()}
                        onChange={handleRangeChange}
                    />
                </Space>
            </div>
            {/* @ts-ignore  */}
            <TableGlobal columns={columns} dataSource={data} className=" mt-4" ></TableGlobal>
        </div>
    );
}
