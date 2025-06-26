import React, { useEffect, useState } from "react";

const Hero = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const products = [
    {
      id: 1,
      name: "Gaming Laptop",
      description: "Powerful laptop for gaming and productivity.",
      price: "₹599999",
      imageUrl:
        "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRJMfZ47Q4PqPoRnyJ3kMcTt9NXijjMWaeMsP2f7tsVTOzSvfF0mfmjqNkXJ4Jo22pLjk-IKH7CGq6NkKQl2yDSg0AGBQXFrvybggW6GIl0JyMLEyGchF4-", // Replace with actual image
    },
    {
      id: 2,
      name: "Gaming Headphone",
      description: "High-quality sound and comfort for long gaming sessions.",
      price: "₹1999",
      imageUrl:
        "https://w7.pngwing.com/pngs/969/417/png-transparent-red-beats-by-dr-dre-wireless-headphones-headphones-beats-electronics-microphone-sound-disc-jockey-headphone-electronics-recording-studio-musician-thumbnail.png",
    },
    {
      id: 3,
      name: "Smartphone",
      description: "Latest smartphone with advanced features.",
      price: "₹29999",
      imageUrl:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSrXhxO1XXZIl_9xIoPZs6XJTIKc3Ui8S4uQuWK3do372AFf2H6ckY8FkU&s",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === 0 ? products.length - 1 : prevIndex - 1
      );
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-[80vh] overflow-hidden">
      {products.map((product, index) => (
        <div
          key={product.id}
          className={`absolute inset-0 flex items-center justify-center transition-opacity duration-1000 ${
            index === currentIndex ? "opacity-100" : "opacity-0"
          }`}
          style={{
            backgroundImage: `url(${product.imageUrl})`,
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "right 200px center",
          }}
        >
          <div className="bg-gradient-to-r from-blue-700 via-transparent to-transparent w-full h-full z-10 flex items-center px-10">
            <div className="max-w-lg text-white">
              <h1 className="text-5xl font-bold">{product.name}</h1>
              <p className="mt-3 text-lg">{product.description}</p>
              <p className="mt-2 text-2xl font-semibold">{product.price}</p>
              <button className="mt-4 px-6 py-2 bg-white text-blue-700 font-semibold rounded-md hover:bg-gray-300 transition">
                Buy Now
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Hero;
