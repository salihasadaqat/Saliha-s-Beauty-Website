const mongoose = require("mongoose");
require("dotenv").config();

const Product = require("./models/Product");

const products = [
  {
    name: "Rose Face Cream",
    category: "Skin Care",
    price: 1200,
    discount: 900,
    rating: 5,
    image: "https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?w=500"
  },
  {
    name: "Luxury Lipstick",
    category: "Makeup",
    price: 800,
    discount: 600,
    rating: 4,
    image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=500"
  },
  {
    name: "Hair Growth Oil",
    category: "Hair Care",
    price: 1500,
    discount: 1100,
    rating: 5,
    image: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=500"
  },
  {
    name: "Vitamin C Serum",
    category: "Skin Care",
    price: 2200,
    discount: 1800,
    rating: 5,
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500"
  },
  {
    name: "Face Wash",
    category: "Skin Care",
    price: 950,
    discount: 750,
    rating: 4,
    image: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=500"
  },
  {
    name: "Mascara",
    category: "Makeup",
    price: 1400,
    discount: 1200,
    rating: 5,
    image: "https://images.unsplash.com/photo-1631214524020-7e18db9a8f92?w=500"
  },
  {
    name: "Foundation",
    category: "Makeup",
    price: 2500,
    discount: 2100,
    rating: 4,
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=500"
  },
  {
    name: "Shampoo",
    category: "Hair Care",
    price: 1300,
    discount: 1000,
    rating: 4,
    image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=500"
  },
  {
    name: "Hair Conditioner",
    category: "Hair Care",
    price: 1400,
    discount: 1100,
    rating: 5,
    image: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=500"
  },
  {
    name: "Night Cream",
    category: "Skin Care",
    price: 1800,
    discount: 1500,
    rating: 5,
    image: "https://images.unsplash.com/photo-1612817288484-6f916006741a?w=500"
  },
  {
    name: "Aloe Vera Gel",
    category: "Skin Care",
    price: 900,
    discount: 699,
    rating: 5,
    image: "https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=500"
  },
  {
    name: "Cleansing Foam",
    category: "Skin Care",
    price: 1100,
    discount: 850,
    rating: 4,
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500"
  },
  {
    name: "Body Lotion",
    category: "Skin Care",
    price: 1350,
    discount: 1050,
    rating: 5,
    image: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=500"
  },
  {
    name: "Makeup Brush Set",
    category: "Makeup",
    price: 2500,
    discount: 1999,
    rating: 5,
    image: "https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=500"
  },
  {
    name: "Lip Gloss",
    category: "Makeup",
    price: 950,
    discount: 750,
    rating: 4,
    image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=500"
  },
  {
    name: "Eye Shadow Palette",
    category: "Makeup",
    price: 2200,
    discount: 1850,
    rating: 5,
    image: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=500"
  },
  {
    name: "Hair Serum",
    category: "Hair Care",
    price: 1600,
    discount: 1250,
    rating: 5,
    image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=500"
  },
  {
    name: "Hair Mask",
    category: "Hair Care",
    price: 1700,
    discount: 1400,
    rating: 4,
    image: "https://images.unsplash.com/photo-1519735777090-ec97162dc266?w=500"
  },
  {
    name: "Sunscreen SPF 50",
    category: "Skin Care",
    price: 1900,
    discount: 1550,
    rating: 5,
    image: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=500"
  },
  {
    name: "Face Scrub",
    category: "Skin Care",
    price: 1000,
    discount: 799,
    rating: 4,
    image: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=500"
  }
];

const seedProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected");

    // Remove old products
    await Product.deleteMany();

    // Insert 20 products
    await Product.insertMany(products);

    console.log("20 products inserted successfully!");

    await mongoose.connection.close();

    console.log("Database connection closed");

    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error.message);
    process.exit(1);
  }
};

seedProducts();