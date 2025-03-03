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

  const config = {
    data: serviceStatistic ?? [],
    xField: "name",
    yField: "value",
    label: {
      style: {
        fill: "#FFFFFF",
        opacity: 0.6,
      },
    },
    xAxis: {
      label: {
        autoHide: true,
        autoRotate: false,
      },
    },
  };

  return (
    <div className="service-statistic">
      <h1 className="text-center">THỐNG KÊ DOANH THU LIỆU TRÌNH</h1>
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
      <Column {...config} />
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

  const config = {
    data: serviceStatistic ?? [],
    xField: "name",
    yField: "value",
    label: {
      style: {
        fill: "#FFFFFF",
        opacity: 0.6,
      },
    },
    xAxis: {
      label: {
        autoHide: true,
        autoRotate: false,
      },
    },
  };

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
      <Column {...config} />
    </div>
  );
}

export default function Statistic() {
  return (
    <div>
      <Row>
        {/* <Col span={12}>
          <RevenueBookingStatistic />
        </Col>
        <Col span={12}>
          <RevenueStatistic />
        </Col> */}
      </Row>
      {/* <Divider />
      <Row gutter={33}>
        <Col span={24}>
          <ServiceStatistic />
        </Col>
        <Col span={24}>
          <TypeServiceStatistic />
        </Col>
      </Row> */}
    </div>
  );
}
