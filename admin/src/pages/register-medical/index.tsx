import { Badge, Tabs, TabsProps } from "antd"
import RegisterMedical from "./RegisterMedical";
import DangKham from "./DangKham";
import ChoThanhToan from "./ChoThanhToan";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import ApiAppointment from "@/api/ApiAppointment";
import DaThanhToan from "./DaThanhToan";


function index() {
    const [tabs, setTabs] = useState('1')

    const { data, refetch } = useQuery(['get_count'], ApiAppointment.count)

    const items: TabsProps['items'] = [
        {
            key: '1',
            label: <>Danh sách đăng ký khám bệnh  <Badge
                className="site-badge-count-109 !ml-2"
                count={data?.cho_kham ?? 0}
                style={{ backgroundColor: '#52c41a' }}
            /></>,
            children: <RegisterMedical type='1' rf={refetch}></RegisterMedical>,
        },
        {
            key: '2',
            label: <>Danh sách đang khám  <Badge
                className="site-badge-count-109 !ml-2"
                count={data?.dang_kham ?? 0}
                style={{ backgroundColor: '#52c41a' }}
            /></>,
            children: <DangKham type='2' rf={refetch}></DangKham>,
        },
        {
            key: '3',
            label: <>Danh sách chờ thanh toán
                <Badge
                    className="site-badge-count-109 !ml-2"
                    count={data?.cho_thanh_toan ?? 0}
                    style={{ backgroundColor: '#52c41a' }}
                /></>,
            children: <ChoThanhToan type='3' rf={refetch}></ChoThanhToan>,
        },
        {
            key: '4',
            label: <>Danh sách đã thanh toán
                <Badge
                    className="site-badge-count-109 !ml-2"
                    count={data?.da_thanh_toan ?? 0}
                    style={{ backgroundColor: '#52c41a' }}
                /></>,
            children: <DaThanhToan type='4' rf={refetch}></DaThanhToan>,
        },

    ];

    return (
        <Tabs defaultActiveKey={tabs} items={items} onChange={(e) => { setTabs(e) }} ></Tabs>
    )
}

export default index