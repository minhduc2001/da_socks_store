import { useEffect, useState } from 'react';
import BannerSlider from './BannerSlider.tsx';
import ProductListSlider from './ProductListSlider.tsx';
import ProductBuySlider from './ProductBuySlider.tsx';
import ProductRecommendedSlider from './ProductRecommendedSlider.tsx';
import CategoriesSlider from './CategoriesSlider.tsx';
import { useGetUserRedux } from '@/redux/slices/UserSlice'

function index() {
  const user = useGetUserRedux();
  const [isLogged, setIsLogged] = useState<Boolean>(false);

  const isNull = (object: Object) => {
    return Object.keys(object).length === 0;
  };

  useEffect(() => {
    if (!isNull(user)) setIsLogged(true);
  }, [user]);

  return (
    <>
      <BannerSlider />
      <div style={{ marginTop: '28px' }}></div>
      <CategoriesSlider />
      <div style={{ marginTop: '28px' }}></div>
      <ProductListSlider />
      <div style={{ marginTop: '28px' }}></div>
      <ProductBuySlider />
      <div style={{ marginTop: '28px' }}></div>
      {isLogged ? (
        <>
          <ProductRecommendedSlider />
          <div style={{ marginTop: '28px' }}></div>
        </>
      ) : (
        <></>
      )}
    </>
  );
}

export default index;
