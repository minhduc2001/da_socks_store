import React from 'react'
import './index.scss'
import { Button } from 'antd'
import { ShoppingCartOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'

function ProductItem({ product }: any) {
    return (
        <div className='product_item_main'>
            <div className='product_thumbnail'>
                <img src='https://hoanghamobile.com/tin-tuc/wp-content/uploads/2023/07/anh-dep-thien-nhien-2-1.jpg'></img>
            </div>
            <div className="product_info">
                <div className="product_title">{product?.name}</div>
                <div className="product_item_cta">
                    <div className="price_box">{(product?.price).toLocaleString()}</div>
                    <Link to={`/product/${product.id}`} className="btn_buy rounded-full bg-red-500 w-8 h-8 flex justify-center text-white font-bold mr-2">
                        <ShoppingCartOutlined />
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default ProductItem