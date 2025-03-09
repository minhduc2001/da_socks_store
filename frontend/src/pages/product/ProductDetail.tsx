import { Card, Tag, Button, Row, Col, Divider, List, Radio, Typography, InputNumber } from 'antd';
import { CheckOutlined, MinusOutlined, PlusOutlined, ShoppingCartOutlined, ThunderboltOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import ApiProduct from '@/api/ApiProduct';
import { useCart } from '../cart/useCart';
import { toast } from 'react-toastify';
// import { copyToClipboard } from './utils'; // Giả sử có hàm copy từ clipboard lib
import Swal from 'sweetalert2'
import 'sweetalert2/src/sweetalert2.scss'
import { useGetUserRedux } from '@/redux/slices/UserSlice';
import './index.scss'

const { Title, Text } = Typography;

const ProductDetail = () => {
    const [variant, setVariant] = useState<any>();
    const [activeCoupon, setActiveCoupon] = useState('');

    const navigate = useNavigate()

    const user = useGetUserRedux()

    const { id } = useParams();
    const { data: product1, isLoading: isLoading1 } = useQuery(['get_product', id], () => ApiProduct.get(id), { enabled: !!(id && user?.id) });
    const { data: product2, isLoading: isLoading2 } = useQuery(['get_product_client', id], () => ApiProduct.getClient(id), { enabled: !!id });

    const product = user?.id ? product1 : product2;
    const idLoading = user?.id ? isLoading1 : isLoading2

    useEffect(() => {
        if (product) setVariant(product?.variants?.[0])
    }, [product])

    const colorOptions = product?.variants?.map((v: any) => {
        return { label: v.type, value: v.id }
    })

    const promotions = [
        'Chất liệu cotton khử mùi',
        'NHẬP MÃ FREESHIP GIẢM NGAY 30.000đ phí vận chuyển',
        'Kiểm tra hàng trước khi thanh toán (COD)',
        'Đổi trả miễn phí trong 7 ngày nếu có lỗi từ NSX'
    ];

    const [quantity, setQuantity] = useState<number>(1);

    const { addToCart } = useCart();

    const handleAddToCart = () => {
        if (!user) {
            Swal.fire({
                title: "Bạn cần đăng nhập để sủ dụng tính năng này",
                // text: "Đăng nhập ngay",
                icon: "question",
                confirmButtonText: 'Đăng nhập ngay',

            }).then((result) => {
                if (result.isConfirmed) {
                    navigate('/login')
                }
            });
            return;
        }
        if (!variant) {
            toast.error('Vui lòng chọn một biến thể!');
            return;
        }
        if (quantity > variant.stock) {
            toast.error('Số lượng vượt quá tồn kho!');
            return;
        }

        addToCart(variant.id, quantity);
        toast.success(`${product.name} (${variant.type}) đã được thêm vào giỏ hàng!`);
        setQuantity(1);
    };

    const handleQuantityChange = (value: any) => {
        if (value >= 1 && value <= 99) setQuantity(value);
    };


    return (
        <div className="my-6">
            <h1 className="text-xl font-bold mb-4">Chi tiết sản phẩm</h1>
            <Card>
                <Row gutter={[24, 24]}>
                    {/* Product Images Section - Giả sử ở đây */}
                    <Col span={12}>
                        <div className="bg-gray-100 h-96 flex items-center justify-center">
                            <img className='object-cover w-full h-full' src={product?.variants?.find((v: any) => v.id == variant?.id)?.image ?? product?.variants?.[0]?.image}></img>
                        </div>
                    </Col>

                    {/* Product Info Section */}
                    <Col span={12}>
                        <Title level={2} className="!text-2xl !mb-2">
                            {product?.name?.toUpperCase()}
                        </Title>

                        <div className="mb-4">
                            <Text type="secondary">Thương hiệu: {product?.category?.name}</Text>
                            <br />
                            <Text className="text-red-500">Đã bán 315 sản phẩm</Text>
                        </div>

                        {/* Price Section */}
                        <div className="mb-6">
                            <Row align="middle" gutter={8}>
                                <Col>
                                    <Title level={3} className="!text-red-500 !m-0">{product?.price?.toLocaleString()} đ</Title>
                                </Col>
                            </Row>
                        </div>

                        <Divider />

                        {/* Promotions */}
                        <List
                            header={<Text strong>KHUYẾN MÃI - ƯU ĐÃI</Text>}
                            dataSource={promotions}
                            renderItem={item => (
                                <List.Item>
                                    <CheckOutlined className="text-green-500 mr-2" />
                                    {item}
                                </List.Item>
                            )}
                            className="mb-6"
                        />

                        {/* Color Selection */}
                        <div className="mb-8">
                            <Text strong className="block mb-2">Phân loại:</Text>
                            <Radio.Group
                                options={colorOptions}
                                optionType="button"
                                value={variant?.id}
                                onChange={(e) => setVariant(product.variants.find((v: any) => e.target.value == v.id))}
                            />
                        </div>

                        <div className="mb-8">
                            <Text strong className="block mb-2">Số lượng:</Text>
                            <div className="flex items-center gap-2">
                                <Button
                                    icon={<MinusOutlined />}
                                    onClick={() => handleQuantityChange(quantity - 1)}
                                    disabled={quantity <= 1}
                                />
                                <InputNumber
                                    min={1}
                                    max={99}
                                    value={quantity}
                                    onChange={handleQuantityChange}
                                    className="w-16 text-center"
                                />
                                <Button
                                    icon={<PlusOutlined />}
                                    onClick={() => handleQuantityChange(quantity + 1)}
                                    disabled={quantity >= 99}
                                />
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <Row gutter={16}>
                            <Col span={12}>
                                <Button
                                    icon={<ShoppingCartOutlined />}
                                    size="large"
                                    className="w-full"
                                    onClick={handleAddToCart}
                                >
                                    Thêm vào giỏ
                                </Button>
                            </Col>
                            <Col span={12}>
                                <Button
                                    type="primary"
                                    icon={<ThunderboltOutlined />}
                                    size="large"
                                    className="w-full bg-blue-600 hover:bg-blue-700"
                                >
                                    Mua ngay
                                </Button>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Card>
            <br></br>
            <Row gutter={22}>
                <Col span={16}>
                    <Card>
                        <h1 className="text-lg font-bold mb-4">Mô tả sản phẩm</h1>
                        <Divider></Divider>
                        <div dangerouslySetInnerHTML={{ __html: product?.description }}></div>
                    </Card>
                </Col>
                <Col span={8}>
                    <Card title={<div className='text-center'>SẢN PHẨM LIÊN QUAN</div>} >

                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default ProductDetail;