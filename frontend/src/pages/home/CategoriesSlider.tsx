import { useEffect, useState } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { Card, Checkbox, Col, Divider, Row, Select, Spin } from 'antd';
import { Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import ApiCategory from '@/api/ApiCategory';

function CategoriesSlider() {
  const navigate = useNavigate();

  const { data: categories } = useQuery(['get_categories_home'], () =>
    ApiCategory.list({ page: 1, limit: 9999 }),
  );

  const getCategory = (_categories: any) => {
    if (!_categories) return [];
    const _list = _categories.filter((_: any, idx: any) => idx <= 10);
    if (_list.length === 11) _list.push({ id: 999999999, name: '...' });
    return _list;
  };

  const handleClick = () => {
    return navigate('/product');
  };

  return (
    <>
      <Row gutter={12}>
        <span
          style={{
            fontSize: '1.4rem',
            fontWeight: '600',
            color: 'rgba(0,0,0,0.64)',
            marginLeft: '8px',
            marginBottom: '8px',
          }}
        >
          Danh Mục Sản Phẩm
        </span>
      </Row>
      <Row gutter={[12, 12]}>
        {getCategory(categories?.results).map((category: any, index: number) => (
          <Col key={category?.id || index} span={4}>
            <div
              onClick={handleClick}
              className="hover:shadow-lg hover:shadow-gray-400"
              style={{
                border: '2px solid rgba(0,0,0,0.42)',
                padding: '4px 8px',
                display: 'flex',
                alignItems: 'center',
                width: '100%',
                textAlign: 'center',
                borderRadius: '10px',
                cursor: 'pointer',
              }}
            >
              <span
                style={{
                  width: '100%',
                  fontSize: '1.2rem',
                  fontWeight: '600',
                  color: 'rgba(0,0,0,0.42)',
                }}
              >
                {category.name}
              </span>
            </div>
          </Col>
        ))}
      </Row>
    </>
  );
}

export default CategoriesSlider;
