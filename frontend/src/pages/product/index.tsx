import { useEffect, useState } from "react";
import { Card, Checkbox, Col, Divider, Row, Select, Spin } from "antd";
import ProductItem from "./components/ProductItem";
import { useQuery } from "@tanstack/react-query";
import ApiCategory from "@/api/ApiCategory";
import ApiProduct from "@/api/ApiProduct";

const { Option } = Select;

const products = [
  { id: 1, name: "Tất thể thao", category: "Thể thao", image: "https://via.placeholder.com/150" },
  { id: 2, name: "Tất cổ cao", category: "Công sở", image: "https://via.placeholder.com/150" },
  { id: 3, name: "Tất cổ ngắn", category: "Casual", image: "https://via.placeholder.com/150" },
  { id: 4, name: "Tất len", category: "Mùa đông", image: "https://via.placeholder.com/150" },
];

const priceRanges = [
  { id: "duoi-50000", label: "Giá dưới 50.000₫", value: "(<50000)" },
  { id: "50000-100000", label: "50.000₫ - 100.000₫", value: "(>=50000 AND <=100000)" },
  { id: "100000-300000", label: "100.000₫ - 300.000₫", value: "(>=100000 AND <=300000)" },
  { id: "300000-500000", label: "300.000₫ - 500.000₫", value: "(>=300000 AND <=500000)" },
  { id: "500000-7000000", label: "500.000₫ - 7.000.000₫", value: "(>=500000 AND <=7000000)" },
  { id: "7000000-10000000", label: "7.000.000₫ - 10.000.000₫", value: "(>=7000000 AND <=10000000)" },
  { id: "tren10000000", label: "Giá trên 10.000.000₫", value: "(>=10000000)" },
];

export default function ProductList() {
  const [selectedCategory, setSelectedCategory] = useState<number[]>([]);
  const [params, setParams] = useState<Query>({ page: 1, limit: 9999 })

  const { data: categories, isLoading: cLoading } = useQuery(['get_categories'], () => ApiCategory.list({ page: 1, limit: 9999 }))
  const { data: products, isLoading: pLoading } = useQuery(['get_products', params], () => ApiProduct.list(params))

  const handleChangeCategory = (e: any, id: number) => {
    if (e.target.checked) {
      setSelectedCategory((p) => [...p, id])
    } else {
      setSelectedCategory(p => p.filter(r => r != id))
    }
  }

  useEffect(() => {
    if (selectedCategory.length) {
      setParams(p => ({ ...p, filter: `{"category.id": "$in:${selectedCategory.join(',')}"}` }))
    }
    else {
      setParams({ page: 1, limit: 9999 })
    }
  }, [selectedCategory])
  return (
    <div className="p-4 max-w-6xl">
      <h1 className="text-xl font-bold mb-4">Danh sách sản phẩm</h1>
      {cLoading || pLoading ? (
        <div className="flex justify-center">
          <Spin size="large" />
        </div>
      ) : (
        <Row gutter={18}>
          <Col span={6}>
            <div className="bg-white h-full py-2 px-4">
              <div className="category_container mb-4">
                <h3 className="font-bold text-lg">Danh mục sản phẩm</h3>
                {categories?.results.map(c => (
                  <Checkbox onChange={(e) => handleChangeCategory(e, c.id)} key={c.name}>{c.name}</Checkbox>
                ))}
              </div>

              <Divider dashed></Divider>
              <div className="mt-4">
                <h3 className="font-bold text-lg">GIÁ</h3>
                <ul>
                  {priceRanges.map((range) => (
                    <li key={range.id} className="flex items-center">
                      <Checkbox
                      >
                        {range.label}
                      </Checkbox>
                    </li>
                  ))}
                </ul>
              </div>

            </div>
          </Col>
          <Col span={18}>
            <Row gutter={12}>
              {products?.results.map((product, index) => (
                <Col key={index} span={6}>
                  <ProductItem product={product}></ProductItem>
                </Col>
              ))}
            </Row>
          </Col>

        </Row>



      )}
    </div>
  );
}
