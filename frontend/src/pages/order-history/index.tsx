import React, { useState } from 'react';
import { Card, Col, Row, Typography, Empty, Divider } from 'antd';
import { useQuery } from '@tanstack/react-query';
import moment from 'moment'; // Dùng moment để format thời gian
import ApiBill from '@/api/ApiBill';

const { Title, Text } = Typography;

const OrderHistory = () => {
    const [params, setParams] = useState<Query>({
        limit: 999,
        page: 1,
    })
    // Lấy dữ liệu lịch sử mua hàng bằng useQuery
    const { data: orders, isLoading, error } = useQuery({
        queryKey: ['order_history', params],
        queryFn: () => ApiBill.list(params),
    });

    if (isLoading) {
        return <div className="text-center p-6">Đang tải lịch sử mua hàng...</div>;
    }

    if (error) {
        return <div className="text-center p-6 text-red-600">Lỗi: {(error as Error).message}</div>;
    }

    if (!orders || orders.results.length === 0) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-50">
                <Empty description="Bạn chưa có đơn hàng nào" />
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
            <Title level={2} className="text-center mb-6 text-gray-800">
                LỊCH SỬ MUA HÀNG
            </Title>

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
                                        Đơn hàng #{order.id} <Text className="!text-gray-600">({order.status})</Text>
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
                                                <img
                                                    src={item.variant.image || 'https://via.placeholder.com/100'}
                                                    alt={item.variant.type}
                                                    className="w-full h-20 object-cover rounded-md"
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
                                <div className="flex justify-between">
                                    <Text strong className="text-gray-800">
                                        Tổng tiền:
                                    </Text>
                                    <Text strong className="text-gray-800">
                                        {totalPrice.toLocaleString()} VNĐ
                                    </Text>
                                </div>
                            </Card>
                        )
                    })}
                </Col>
            </Row>
        </div>
    );
};

export default OrderHistory;