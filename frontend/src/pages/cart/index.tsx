import React from 'react';
import { Button, Card, Col, Row, Typography, Space, Divider, Empty, InputNumber, message } from 'antd';
import { DeleteOutlined, PlusOutlined, MinusOutlined } from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import ApiCart from '@/api/ApiCart';
import { useGetUserRedux } from '@/redux/slices/UserSlice';

const { Title, Text } = Typography;

const CartComponent = () => {
    const queryClient = useQueryClient();
    const user = useGetUserRedux()

    // Lấy dữ liệu giỏ hàng bằng useQuery
    const { data: cart, isLoading, error } = useQuery({
        queryKey: ['cart'],
        queryFn: ApiCart.get,
        enabled: !!user?.id
    });

    // Mutation để xóa mục khỏi giỏ hàng
    const removeMutation = useMutation({
        mutationFn: ApiCart.removeFromCart,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cart'] });
            message.success('Đã xóa sản phẩm khỏi giỏ hàng');
        },
        onError: (error) => {
            console.error('Lỗi khi xóa mục:', error);
            message.error('Không thể xóa sản phẩm');
        },
    });

    // Mutation để cập nhật số lượng
    const updateQuantityMutation = useMutation({
        mutationFn: (data: { variantId: number; quantity: number }) => ApiCart.addToCart(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cart'] });
            message.success('Đã cập nhật số lượng');
        },
        onError: (error) => {
            console.error('Lỗi khi cập nhật số lượng:', error);
            message.error('Không thể cập nhật số lượng');
        },
    });

    // Mutation để thanh toán
    const checkoutMutation = useMutation({
        mutationFn: ApiCart.checkout,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cart'] });
            message.success('Thanh toán thành công');
        },
        onError: (error) => {
            console.error('Lỗi khi thanh toán:', error);
            message.error('Thanh toán thất bại');
        },
    });

    const handleQuantityChange = (cartItem: any, newQuantity: number, type?: 'add' | 'sub') => {
        const stock = cartItem.variant.stock || 0; // Giả định variant có thuộc tính stock

        // Chặn số lượng nhỏ hơn 0 hoặc lớn hơn stock
        if (newQuantity <= 0) {
            removeMutation.mutate(cartItem.id);
            return;
        }
        if (newQuantity > stock) {
            message.error(`Số lượng không thể vượt quá tồn kho (${stock})`);
            return;
        }

        // Cập nhật số lượng bằng cách gọi lại API addToCart với số lượng mới
        const variantId = cartItem.variant.id;
        updateQuantityMutation.mutate({ variantId, quantity: type == 'sub' ? - 1 : 1 });
    };

    if (isLoading) {
        return <div className="text-center p-6">Đang tải giỏ hàng...</div>;
    }

    if (error) {
        return <div className="text-center p-6 text-red-600">Lỗi: {(error as Error).message}</div>;
    }

    if (!cart || !cart.cart_items || cart.cart_items.length === 0) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-100">
                <Empty description="Giỏ hàng của bạn đang trống" />
            </div>
        );
    }

    const totalPrice = cart.cart_items.reduce(
        (sum: number, item: any) => sum + item.variant.product.price * item.quantity,
        0
    );

    return (
        <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
            <Title level={2} className="text-center mb-6 text-gray-800">
                GIỎ HÀNG CỦA BẠN
            </Title>

            <Row gutter={[16, 16]} className="flex">
                {/* Danh sách sản phẩm */}
                <Col xs={24} md={16}>
                    {cart.cart_items.map((item: any) => (
                        <Card key={item.id} className="!mb-4 shadow-md rounded-lg">
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
                                <Col xs={12} md={16}>
                                    <Text strong className="text-lg text-gray-800 block">
                                        {item.variant.product?.name} ({item.variant.type})
                                    </Text>
                                    <Text className="text-gray-600">
                                        Giá: {(item.variant.product.price || 0).toLocaleString()} VNĐ
                                    </Text>
                                    <div className="mt-2 flex items-center">
                                        <Text className="text-gray-600 mr-2">Số lượng:</Text>
                                        <Space>
                                            <Button
                                                icon={<MinusOutlined />}
                                                onClick={() => handleQuantityChange(item, item.quantity - 1, 'sub')}
                                                disabled={item.quantity <= 1}
                                                className="border-gray-300"
                                            />
                                            <InputNumber
                                                min={1}
                                                max={item.variant.stock || Infinity}
                                                value={item.quantity}
                                                onChange={(value) => handleQuantityChange(item, value || 1)}
                                                className="w-16 text-center"
                                                disabled
                                            />
                                            <Button
                                                icon={<PlusOutlined />}
                                                onClick={() => handleQuantityChange(item, item.quantity + 1, 'add')}
                                                disabled={item.quantity >= (item.variant.stock || Infinity)}
                                                className="border-gray-300"
                                            />
                                        </Space>
                                    </div>
                                </Col>

                                {/* Xóa sản phẩm */}
                                <Col xs={6} md={4} className="text-right">
                                    <Button
                                        type="text"
                                        danger
                                        icon={<DeleteOutlined />}
                                        onClick={() => removeMutation.mutate(item.id)}
                                        className="hover:text-red-600"
                                        loading={removeMutation.isLoading && removeMutation.variables === item.id}
                                    />
                                </Col>
                            </Row>
                        </Card>
                    ))}
                </Col>

                {/* Tổng kết */}
                <Col xs={24} md={8}>
                    <Card className="shadow-md rounded-lg sticky">
                        <Title level={4} className="text-gray-800">
                            TỔNG KẾT
                        </Title>
                        <Divider className="my-2" />
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
                                onClick={() => checkoutMutation.mutate()}
                                loading={checkoutMutation.isLoading}
                            >
                                THANH TOÁN NGAY
                            </Button>
                        </Space>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default CartComponent;