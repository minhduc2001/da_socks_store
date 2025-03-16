import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

function BannerSlider() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <div>
      <div className="slider-container">
        <Slider {...settings}>
          <div>
            <img
              src="https://graphicsfamily.com/wp-content/uploads/edd/2022/06/Free-Shoes-Sale-Banner-Advertising-Template-scaled.jpg"
              alt=""
            />
          </div>
          <div>
            <img
              src="https://graphicsfamily.com/wp-content/uploads/edd/2022/06/Free-Shoes-Sale-Banner-Advertising-Template-scaled.jpg"
              alt=""
            />
          </div>
          <div>
            <img
              src="https://graphicsfamily.com/wp-content/uploads/edd/2022/06/Free-Shoes-Sale-Banner-Advertising-Template-scaled.jpg"
              alt=""
            />
          </div>
          <div>
            <img
              src="https://graphicsfamily.com/wp-content/uploads/edd/2022/06/Free-Shoes-Sale-Banner-Advertising-Template-scaled.jpg"
              alt=""
            />
          </div>
          <div>
            <img
              src="https://graphicsfamily.com/wp-content/uploads/edd/2022/06/Free-Shoes-Sale-Banner-Advertising-Template-scaled.jpg"
              alt=""
            />
          </div>
          <div>
            <img
              src="https://graphicsfamily.com/wp-content/uploads/edd/2022/06/Free-Shoes-Sale-Banner-Advertising-Template-scaled.jpg"
              alt=""
            />
          </div>
        </Slider>
      </div>
    </div>
  );
}

export default BannerSlider;
