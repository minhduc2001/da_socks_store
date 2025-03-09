import React, { useState } from 'react';
import { Card, Col, Row, Typography, Empty, Divider, Image, Button } from 'antd';
import { useMutation, useQuery } from '@tanstack/react-query';
import moment from 'moment'; // Dùng moment để format thời gian
import ApiBill, { BillStatus } from '@/api/ApiBill';
import { IChangeTable, TABLE_DEFAULT_VALUE } from '@/components/TableGlobal';
import { toast } from 'react-toastify';

const { Title, Text } = Typography;

export default function OrderSuccess() {
    const [isOpenModal, setIsOpenModal] = useState(false);
    // const [searchValue, setSearchValue] = useState("");
    const [params, setParams] = useState<Query>({
        page: 1,
        limit: TABLE_DEFAULT_VALUE.defaultPageSize,
        filter: `{"status": "${BillStatus.success}"}`
    });
    const [selected, setSelected] = useState<any>();


    const { data: orders, isLoading, error } = useQuery(
        ["get_orders_success", params],
        () => ApiBill.list(params),
        {
            keepPreviousData: true,
        }
    );



    const updateMutation = useMutation(ApiBill.update)


    // const handleCloseModal = () => {
    //     setSelected(undefined);
    //     setIsOpenModal(false);
    // };

    const handleChangeTable = (value: IChangeTable) => {
        setParams({
            ...params,
            page: value.page,
            limit: value.pageSize,
        });
    };

    if (isLoading) {
        return <div className="text-center p-6">Đang tải lịch sử mua hàng...</div>;
    }

    if (error) {
        return <div className="text-center p-6 text-red-600">Lỗi: {(error as Error).message}</div>;
    }

    if (!orders || orders.results.length === 0) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-50">
                <Empty description="Chưa có đơn hàng nào" />
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
            {/* <Title level={2} className="text-center mb-6 text-gray-800">
            
            </Title> */}

            <Row gutter={[16, 16]}>
                <Col span={24}>
                    {orders.results.map((order: any) => {
                        const totalPrice = order?.cart.cart_items?.reduce(
                            (sum: number, item: any) => sum + item.variant.product.price * item.quantity,
                            0
                        );

                        return (
                            <Card key={order.id} className="!mb-6 shadow-md rounded-lg">
                                {/* Tiêu đề đơn hàng */}
                                <div className="flex justify-between items-center mb-4">
                                    <Text strong className="text-lg text-gray-800">
                                        Đơn hàng #{order.id}
                                    </Text>
                                    <Text className="text-gray-600">
                                        Đặt ngày: {moment(order.created_at).format('DD/MM/YYYY HH:mm')}
                                    </Text>
                                </div>

                                {/* Danh sách sản phẩm */}
                                {order?.cart?.cart_items.map((item: any) => (
                                    <div key={item.id} className="py-4 border-b last:border-b-0">
                                        <Row align="middle" gutter={[16, 16]}>
                                            <Col xs={6} md={4}>
                                                <Image
                                                    width={150}
                                                    // height={80}
                                                    src={item.variant.image || 'https://via.placeholder.com/100'}
                                                    alt={item.variant.type}
                                                    className="w-full !h-20 object-cover rounded-md"
                                                />
                                            </Col>
                                            <Col xs={18} md={20}>
                                                <Text strong className="text-lg text-gray-800 block">
                                                    {item.variant.product.name} ({item.variant.type})
                                                </Text>
                                                <div className="text-gray-600">
                                                    <Text>Giá: {(item.variant.product.price || 0).toLocaleString()} VNĐ</Text>
                                                    <br />
                                                    <Text>Số lượng: {item.quantity}</Text>
                                                </div>
                                            </Col>
                                        </Row>
                                    </div>
                                ))}

                                {/* Tổng tiền */}
                                <Divider className="my-4" />
                                <div className='flex justify-between items-center'>
                                    <div className="flex gap-4 items-center">
                                        <Text strong className="text-gray-800">
                                            Tổng tiền:
                                        </Text>
                                        <Text strong className="text-gray-800">
                                            {totalPrice.toLocaleString()} VNĐ
                                        </Text>
                                    </div>

                                    {/* <div className='flex gap-4'>
                                        <Button type='dashed' danger onClick={() =>
                                            updateMutation.mutate({ id: order.id, status: BillStatus.cancel }, {
                                                onSuccess() {
                                                    toast.success('Huỷ đơn thành công')
                                                    refetch()
                                                }
                                            })}
                                        >{'Huỷ đơn'}</Button>
                                        <Button type='primary' onClick={() =>
                                            updateMutation.mutate({ id: order.id, status: BillStatus.confirm }, {
                                                onSuccess() {
                                                    toast.success('Xác nhận đơn thành công')
                                                    refetch()
                                                }
                                            })}>{'Xác nhận đơn'}</Button>
                                    </div> */}
                                </div>
                            </Card>
                        )
                    })}
                </Col>
            </Row>
        </div>
    );
}
