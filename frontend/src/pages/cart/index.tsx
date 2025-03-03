import React from 'react';
import { Button, Card, Col, Row, Typography, Space, Divider, Empty } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { useCart } from './useCart'; // Giả định đây là hook quản lý giỏ hàng

const { Title, Text } = Typography;

const CartComponent = () => {
    const { cartItems, removeFromCart, totalPrice, checkout } = useCart(); // Hook giả định

    if (!cartItems || cartItems.length === 0) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-100">
                <Empty description="Giỏ hàng của bạn đang trống" />
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
            <Title level={2} className="text-center mb-6 text-gray-800">
                Giỏ Hàng Của Bạn
            </Title>

            <Row gutter={[16, 16]}>
                {/* Danh sách sản phẩm */}
                <Col xs={24} md={16}>
                    <Card className="shadow-lg rounded-lg">
                        {cartItems.map((item) => (
                            <div key={item.id} className="py-4 border-b last:border-b-0">
                                <Row align="middle" gutter={[16, 16]}>
                                    {/* Hình ảnh */}
                                    <Col xs={6} md={4}>
                                        <img
                                            src={item.variant.image || 'https://via.placeholder.com/100'}
                                            alt={item.variant.type}
                                            className="w-full h-20 object-cover rounded-md"
                                        />
                                    </Col>

                                    {/* Thông tin sản phẩm */}
                                    <Col xs={12} md={14}>
                                        <Text strong className="text-lg text-gray-800">
                                            {item.variant.product.name} ({item.variant.type})
                                        </Text>
                                        <div className="text-gray-600">
                                            <Text>Giá: {(item.variant.price || 0).toLocaleString()} VNĐ</Text>
                                            <br />
                                            <Text>Số lượng: {item.quantity}</Text>
                                        </div>
                                    </Col>

                                    {/* Xóa sản phẩm */}
                                    <Col xs={6} md={6} className="text-right">
                                        <Button
                                            type="text"
                                            danger
                                            icon={<DeleteOutlined />}
                                            onClick={() => removeFromCart(item.id)}
                                            className="hover:text-red-600"
                                        />
                                    </Col>
                                </Row>
                            </div>
                        ))}
                    </Card>
                </Col>

                {/* Tổng kết */}
                <Col xs={24} md={8}>
                    <Card className="shadow-lg rounded-lg sticky top-6">
                        <Title level={4} className="text-gray-800">
                            Tổng Kết
                        </Title>
                        <Divider />
                        <Space direction="vertical" className="w-full">
                            <div className="flex justify-between">
                                <Text>Tổng tiền:</Text>
                                <Text strong>{totalPrice.toLocaleString()} VNĐ</Text>
                            </div>
                            <Button
                                type="primary"
                                size="large"
                                block
                                className="mt-4 bg-blue-600 hover:bg-blue-700 transition-colors"
                                onClick={checkout}
                            >
                                Thanh Toán Ngay
                            </Button>
                        </Space>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default CartComponent;