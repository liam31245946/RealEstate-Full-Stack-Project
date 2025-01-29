// import Slider from 'react-slick';
// import 'slick-carousel/slick/slick.css';
// import 'slick-carousel/slick/slick-theme.css';

// type ImageCarouselProps = {
//   images: string[];
// };

// export function ImageCarousel({ images }: ImageCarouselProps) {
//   const settings = {
//     dots: true,
//     infinite: true,
//     speed: 500,
//     slidesToShow: 1,
//     slidesToScroll: 1,
//     autoplay: true,
//   };

//   return (
//     <Slider {...settings}>
//       {images.map((image, index) => (
//         <div key={index}>
//           <img
//             src={image}
//             alt={`Property image ${index + 1}`}
//             className="w-full h-96 object-cover"
//             loading="lazy" // Optional for performance
//           />
//         </div>
//       ))}
//     </Slider>
//   );
// }
