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
const dateFormat = "YYYY/MM/DD";
dayjs.extend(customParseFormat);
dayjs.extend(advancedFormat);
dayjs.extend(weekday);
dayjs.extend(localeData);
dayjs.extend(weekOfYear);
dayjs.extend(weekYear);

function ServiceStatistic() {
    const [serviceStatisticParams, setServiceStatisticParams] =
        useState<IGetStatParams>({
            start_date: dayjs().subtract(30, "day").format(dateFormat).toString(),
            end_date: dayjs().format(dateFormat),
        });

    const { data: serviceStatistic } = useQuery(
        ["get_service_statistic", [serviceStatisticParams]],
        () => ApiStatistic.getServiceStatistic(serviceStatisticParams)
    );

    const exportExcelServiceMutation = useMutation(
        ApiStatistic.exportExcelService
    );
    const handleExportExcel = () => {
        exportExcelServiceMutation.mutate(serviceStatisticParams);
    };

    const handleRangeChange = (dates: any, dateStrings: any) => {
        setServiceStatisticParams({
            start_date: dateStrings[0],
            end_date: dateStrings[1],
        });
    };

    // const config = {
    //     data: serviceStatistic ?? [],
    //     xField: "name",
    //     yField: "value",
    //     label: {
    //         style: {
    //             fill: "#FFFFFF",
    //             opacity: 0.6,
    //         },
    //     },
    //     xAxis: {
    //         label: {
    //             autoHide: true,
    //             autoRotate: false,
    //         },
    //     },
    // };

    const config = {
        appendPadding: 10,
        data: serviceStatistic ?? [],
        angleField: "value",
        colorField: "type",
        radius: 0.9,
        label: {
            type: "inner",
            offset: "-30%",
            content: ({ percent = 0 }) => `${(percent * 100).toFixed(0)}%`,
            style: {
                fontSize: 14,
                textAlign: "center",
            },
        },
        interactions: [
            {
                type: "element-active",
            },
        ],
    };

    const configColunm = {
        data: serviceStatistic?.map((v: any) => ({ type: v.type, value: v.quantity })) ?? [],
        xField: 'type',
        yField: 'value',
        style: {
            fill: ({ type }: any) => {
                if (type === '10-30分' || type === '30+分') {
                    return '#22CBCC';
                }
                return '#2989FF';
            },
        },
        label: {
            text: (originData: any) => {
                const val = parseFloat(originData.value);
                if (val < 0.05) {
                    return (val * 100).toFixed(1) + '%';
                }
                return '';
            },
            offset: 10,
        },
        legend: false,
    }
    return (
        <div className="service-statistic">
            <h1 className="text-center">THỐNG KÊ LIỆU TRÌNH</h1>
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
            <Row gutter={22}>
                <Col span={12}>
                    {/* @ts-ignore  */}
                    <Column {...configColunm} />
                </Col>
                <Col span={12}> <Pie {...config} /></Col>
            </Row>
        </div>
    );
}

function TypeServiceStatistic() {
    const [serviceStatisticParams, setServiceStatisticParams] =
        useState<IGetStatParams>({
            start_date: dayjs().subtract(30, "day").format(dateFormat).toString(),
            end_date: dayjs().format(dateFormat),
        });

    const { data: serviceStatistic } = useQuery(
        ["get_typeservice_statistic", [serviceStatisticParams]],
        () => ApiStatistic.getTypeServiceStatitic(serviceStatisticParams)
    );

    const exportExcelServiceMutation = useMutation(
        ApiStatistic.exportExcelTypeService
    );
    const handleExportExcel = () => {
        exportExcelServiceMutation.mutate(serviceStatisticParams);
    };

    const handleRangeChange = (dates: any, dateStrings: any) => {
        setServiceStatisticParams({
            start_date: dateStrings[0],
            end_date: dateStrings[1],
        });
    };

    //   const config = {
    //     data: serviceStatistic ?? [],
    //     xField: "name",
    //     yField: "value",
    //     label: {
    //       style: {
    //         fill: "#FFFFFF",
    //         opacity: 0.6,
    //       },
    //     },
    //     xAxis: {
    //       label: {
    //         autoHide: true,
    //         autoRotate: false,
    //       },
    //     },
    //   };
    const config = {
        appendPadding: 10,
        data: serviceStatistic ?? [],
        angleField: "value",
        colorField: "type",
        radius: 0.9,
        label: {
            type: "inner",
            offset: "-30%",
            content: ({ percent = 0 }) => `${(percent * 100).toFixed(0)}%`,
            style: {
                fontSize: 14,
                textAlign: "center",
            },
        },
        interactions: [
            {
                type: "element-active",
            },
        ],
    };


    const configColunm = {
        data: serviceStatistic?.map((v: any) => ({ type: v.type, value: v.quantity })) ?? [],
        xField: 'type',
        yField: 'value',
        style: {
            fill: ({ type }: any) => {
                if (type === '10-30分' || type === '30+分') {
                    return '#22CBCC';
                }
                return '#2989FF';
            },
        },
        label: {
            text: (originData: any) => {
                const val = parseFloat(originData.value);
                if (val < 0.05) {
                    return (val * 100).toFixed(1) + '%';
                }
                return '';
            },
            offset: 10,
        },
        legend: false,
    }

    return (
        <div className="service-statistic">
            <h1 className="text-center">THỐNG KÊ DỊCH VỤ KHÁM</h1>
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
            <Row gutter={22}>
                <Col span={12}>
                    {/* @ts-ignore  */}
                    <Column {...configColunm} />
                </Col>
                <Col span={12}> <Pie {...config} /></Col>
            </Row>
        </div>
    );
}


// function RevenueStatistic() {
//   const [revenueStatisticParams, setRevenueStatisticParams] =
//     useState<IGetRoomStatisticParams>({
//       year: moment().year(),
//       month: moment().month() + 1,
//       day: moment().date(),
//     });

//   const { data: revenueStatistic } = useQuery(
//     ["get_revenue_statistic", [revenueStatisticParams]],
//     () => ApiStatistic.getRevenueStatistic(revenueStatisticParams)
//   );

//   const exportExcelRevenueMutation = useMutation(
//     ApiStatistic.exportExcelRevenue
//   );
//   const handleExportExcel = () => {
//     exportExcelRevenueMutation.mutate(revenueStatisticParams);
//   };

//   const config = {
//     appendPadding: 10,
//     data: revenueStatistic ?? [],
//     angleField: "value",
//     colorField: "type",
//     radius: 0.9,
//     label: {
//       type: "inner",
//       offset: "-30%",
//       content: ({ percent = 0 }) => `${(percent * 100).toFixed(0)}%`,
//       style: {
//         fontSize: 14,
//         textAlign: "center",
//       },
//     },
//     interactions: [
//       {
//         type: "element-active",
//       },
//     ],
//   };

//   return (
//     <div className="service-statistic">
//       <h1 className="text-center">THỐNG KÊ DOANH THU KHÁCH SẠN THEO NĂM</h1>
//       <div className="flex justify-end">
//         <Space>
//           <ButtonGlobal
//             className="!h-[30px]"
//             title="Xuất excel"
//             onClick={handleExportExcel}
//           />
//           <SelectGlobal
//             placeholder="Năm"
//             allowClear={false}
//             options={Array.from({ length: 11 }, (_, index) => ({
//               label: moment().year() - index + "",
//               value: moment().year() - index,
//             }))}
//             value={revenueStatisticParams.year}
//             onChange={(value) => {
//               setRevenueStatisticParams({
//                 ...revenueStatisticParams,
//                 year: value,
//                 month: undefined,
//                 day: undefined,
//               });
//             }}
//           />
//         </Space>
//       </div>
//       <Pie {...config} />
//     </div>
//   );
// }

function BCdoanhthu() {
    return (
        <Row>
            <Col span={24}>
                <ServiceStatistic></ServiceStatistic>
                <Divider></Divider>
                <TypeServiceStatistic></TypeServiceStatistic>
            </Col>

        </Row>
    )
}

export default BCdoanhthu

