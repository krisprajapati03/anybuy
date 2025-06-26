import React, { useEffect, useState } from 'react';

export const Carousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const slides = [
    {
      image: "https://images.unsplash.com/photo-1532795986-dbef1643a596?auto=format&fit=crop&q=80&w=2070",
      // image: "https://images.unsplash.com/photo-1532795986-dbef1643a596?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      title: "Special Offer",
      description: "Up to 50% off on Electronics"
    },
    {
      image: "https://images.unsplash.com/photo-1607082349566-187342175e2f?auto=format&fit=crop&q=80&w=2070",
      title: "New Arrivals",
      description: "Check out our latest collection"
    },
    {
      image: "https://images.unsplash.com/photo-1607082350899-7e105aa886ae?auto=format&fit=crop&q=80&w=2070",
      title: "Flash Sale",
      description: "24 hours only - Don't miss out!"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative h-[400px] overflow-hidden rounded-lg ">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute w-full h-full transition-opacity duration-500 ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <img
            src={slide.image}
            alt={slide.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-y-0 right-0 flex items-center justify-end bg-opacity-40 text-white">
            <div className="container auto mx-auto px-6">
              <h2 className="text-4xl   font-bold mb-4">{slide.title}</h2>
              <p className="text-xl">{slide.description}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};