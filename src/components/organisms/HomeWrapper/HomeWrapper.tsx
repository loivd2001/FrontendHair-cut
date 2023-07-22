import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { DATA_SLIDE } from '@/constants/constant';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import 'swiper/css/autoplay';
import './HomeWrapper.scss';

const HomeWrapper = () => {
  return (
    <Swiper
      // install Swiper modules
      modules={[Navigation, Pagination, Scrollbar, A11y]}
      spaceBetween={100}
      slidesPerView={1}
      navigation
      autoplay={{ delay: 1000 }}
      pagination={{ clickable: true }}
      scrollbar={{ draggable: true }}
    >
      {DATA_SLIDE.map((e) => (
        <SwiperSlide key={e.id}>
          <img className="slide_img" src={e.img} />
        </SwiperSlide>
      ))}
    </Swiper>
  );
};
export default HomeWrapper;