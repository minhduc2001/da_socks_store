import React, { useState } from 'react';
import { Tabs } from 'antd';
import type { TabsProps } from 'antd';
import { useNavigate } from 'react-router-dom';
import Order from './Order';
import { QueryClient } from '@tanstack/react-query';
import OrderConfirm from './OrderConfirm';
import OrderSuccess from './OrderSuccess';
import OrderCancel from './OrderCancel';

const items: TabsProps['items'] = [
    {
        key: '1',
        label: 'Đơn mới',
        children: <Order />,
    },
    {
        key: '2',
        label: 'Đã xác nhận',
        children: <OrderConfirm />,
    },
    {
        key: '3',
        label: 'Thành công',
        children: <OrderSuccess />,
    },
    {
        key: '4',
        label: 'Đã huỷ',
        children: <OrderCancel />,
    },
];

const OrderManagement = () => {
    const navigate = useNavigate()
    const clientQuery = new QueryClient()

    const [tab, setTab] = useState('1')

    const onChange = (key: string) => {
        setTab(key)
    };

    return (
        <Tabs defaultActiveKey={tab} items={items} onChange={onChange} />
    )
}

export default OrderManagement;