"use client";
import { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { apiService } from '@/services/api.service';
import Image from "next/image";

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import SingleItem from "./SingleItem";

interface Testimonial {
  _id: string;
  name: string;
  role: string;
  content: string;
  rating: number;
  image?: string;
  createdAt: string;
}

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // useEffect(() => {
  //   const fetchTestimonials = async () => {
  //     try {
  //       const response = await apiService.getTestimonials();
  //       setTestimonials(response.data);
  //       setLoading(false);
  //     } catch (err) {
  //       setError('Failed to load testimonials');
  //       setLoading(false);
  //     }
  //   };

  //   fetchTestimonials();
  // }, []);

  // if (loading) {
  //   return (
  //     <div className="testimonials-section">
  //       <div className="container">
  //         <div className="row">
  //           <div className="col-12">
  //             <div className="section-title">
  //               <h2>Loading testimonials...</h2>
  //             </div>
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //   );
  // }

  // if (error) {
  //   return (
  //     <div className="testimonials-section">
  //       <div className="container">
  //         <div className="row">
  //           <div className="col-12">
  //             <div className="section-title">
  //               <h2>Error: {error}</h2>
  //             </div>
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //   );
  // }

  // return (
  //   // <div className="testimonials-section">
  //   //   <div className="container">
  //   //     <div className="row">
  //   //       <div className="col-12">
  //   //         <div className="section-title">
  //   //           <h2>What Our Customers Say</h2>
  //   //           <p>Read testimonials from our satisfied customers</p>
  //   //         </div>
  //   //       </div>
  //   //     </div>
  //   //     <div className="row">
  //   //       <div className="col-12">
  //   //         <Swiper
  //   //           spaceBetween={30}
  //   //           slidesPerView={1}
  //   //           navigation
  //   //           pagination={{ clickable: true }}
  //   //           breakpoints={{
  //   //             640: {
  //   //               slidesPerView: 2,
  //   //               spaceBetween: 20
  //   //             },
  //   //             1024: {
  //   //               slidesPerView: 3,
  //   //               spaceBetween: 30
  //   //             }
  //   //           }}
  //   //         >
  //   //           {testimonials.map((testimonial) => (
  //   //             <SwiperSlide key={testimonial._id}>
  //   //               <div className="testimonial-item">
  //   //                 <div className="testimonial-content">
  //   //                   <div className="rating">
  //   //                     {[...Array(5)].map((_, index) => (
  //   //                       <i
  //   //                         key={index}
  //   //                         className={`fas fa-star ${
  //   //                           index < testimonial.rating ? 'active' : ''
  //   //                         }`}
  //   //                       ></i>
  //   //                     ))}
  //   //                   </div>
  //   //                   <p>{testimonial.content}</p>
  //   //                 </div>
  //   //                 <div className="testimonial-author">
  //   //                   <div className="author-image">
  //   //                     <img
  //   //                       src={testimonial.image || '/images/user-placeholder.jpg'}
  //   //                       alt={testimonial.name}
  //   //                     />
  //   //                   </div>
  //   //                   <div className="author-info">
  //   //                     <h4>{testimonial.name}</h4>
  //   //                     <span>{testimonial.role}</span>
  //   //                   </div>
  //   //                 </div>
  //   //               </div>
  //   //             </SwiperSlide>
  //   //           ))}
  //   //         </Swiper>
  //   //       </div>
  //   //     </div>
  //   //   </div>
  //   // </div>
  // );
};

export default Testimonials;
