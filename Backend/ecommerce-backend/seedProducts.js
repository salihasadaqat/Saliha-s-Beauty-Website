const mongoose = require("mongoose");
const Product = require("./models/Product");
require("dotenv").config();

const products = [
  {
    name: "Velvet Matte Lipstick",
    title: "Velvet Matte Lipstick",
    description:
      "Long-lasting matte lipstick with a smooth and comfortable finish.",
    price: 1499,
    discount: 10,
    discountPrice: 1349,
    category: "Makeup",
    image:
      "https://images.unsplash.com/photo-1586495777744-4413f21062fa",
    stock: 25,
  },

  {
    name: "Hydrating Foundation",
    title: "Hydrating Foundation",
    description:
      "Lightweight foundation providing natural coverage and hydration.",
    price: 2499,
    discount: 15,
    discountPrice: 2124,
    category: "Makeup",
    image:
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348",
    stock: 20,
  },

  {
    name: "Waterproof Mascara",
    title: "Waterproof Mascara",
    description:
      "Volumizing waterproof mascara for fuller and defined lashes.",
    price: 1299,
    discount: 10,
    discountPrice: 1169,
    category: "Makeup",
    image:
      "https://images.unsplash.com/photo-1631214524020-7e18db9a8f92",
    stock: 30,
  },

  {
    name: "Liquid Eyeliner",
    title: "Liquid Eyeliner",
    description:
      "Precision liquid eyeliner with a smooth and long-lasting finish.",
    price: 899,
    discount: 5,
    discountPrice: 854,
    category: "Makeup",
    image:
      "https://images.unsplash.com/photo-1512496015851-a90fb38ba796",
    stock: 35,
  },

  {
    name: "Blush Palette",
    title: "Blush Palette",
    description:
      "Beautiful blendable blush shades for a natural rosy glow.",
    price: 1799,
    discount: 12,
    discountPrice: 1583,
    category: "Makeup",
    image:
      "https://images.unsplash.com/photo-1512496015851-a90fb38ba796",
    stock: 18,
  },

  {
    name: "Highlighter Glow Kit",
    title: "Highlighter Glow Kit",
    description:
      "Shimmering highlighter shades designed to enhance your natural glow.",
    price: 1599,
    discount: 10,
    discountPrice: 1439,
    category: "Makeup",
    image:
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348",
    stock: 22,
  },

  {
    name: "Vitamin C Face Serum",
    title: "Vitamin C Face Serum",
    description:
      "Brightening face serum designed for a fresh and radiant appearance.",
    price: 2199,
    discount: 15,
    discountPrice: 1869,
    category: "Skincare",
    image:
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be",
    stock: 20,
  },

  {
    name: "Hyaluronic Acid Serum",
    title: "Hyaluronic Acid Serum",
    description:
      "Hydrating serum that helps maintain soft and moisturized skin.",
    price: 2399,
    discount: 10,
    discountPrice: 2159,
    category: "Skincare",
    image:
      "https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8",
    stock: 15,
  },

  {
    name: "Gentle Face Cleanser",
    title: "Gentle Face Cleanser",
    description:
      "Gentle daily cleanser suitable for removing dirt and impurities.",
    price: 1299,
    discount: 8,
    discountPrice: 1195,
    category: "Skincare",
    image:
      "https://images.unsplash.com/photo-1556228578-8c89e6adf883",
    stock: 30,
  },

  {
    name: "Hydrating Face Moisturizer",
    title: "Hydrating Face Moisturizer",
    description:
      "Daily moisturizer that leaves skin feeling soft and hydrated.",
    price: 1699,
    discount: 10,
    discountPrice: 1529,
    category: "Skincare",
    image:
      "https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd",
    stock: 25,
  },

  {
    name: "Sunscreen SPF 50",
    title: "Sunscreen SPF 50",
    description:
      "Lightweight daily sunscreen with high SPF protection.",
    price: 1899,
    discount: 12,
    discountPrice: 1671,
    category: "Skincare",
    image:
      "https://images.unsplash.com/photo-1556228720-195a672e8a03",
    stock: 28,
  },

  {
    name: "Rose Water Face Mist",
    title: "Rose Water Face Mist",
    description:
      "Refreshing rose face mist for a quick boost of freshness.",
    price: 999,
    discount: 5,
    discountPrice: 949,
    category: "Skincare",
    image:
      "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b",
    stock: 35,
  },

  {
    name: "Argan Hair Oil",
    title: "Argan Hair Oil",
    description:
      "Nourishing hair oil designed to add shine and smoothness.",
    price: 1499,
    discount: 10,
    discountPrice: 1349,
    category: "Haircare",
    image:
      "https://images.unsplash.com/photo-1527799820374-dcf8b6f1a3c7",
    stock: 20,
  },

  {
    name: "Keratin Hair Mask",
    title: "Keratin Hair Mask",
    description:
      "Deep conditioning hair mask for soft and manageable hair.",
    price: 1799,
    discount: 15,
    discountPrice: 1529,
    category: "Haircare",
    image:
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e",
    stock: 18,
  },

  {
    name: "Nourishing Shampoo",
    title: "Nourishing Shampoo",
    description:
      "Gentle nourishing shampoo for clean and healthy-looking hair.",
    price: 1399,
    discount: 8,
    discountPrice: 1287,
    category: "Haircare",
    image:
      "https://images.unsplash.com/photo-1556229010-aa3d0d3d4f8a",
    stock: 25,
  },

  {
    name: "Repair Hair Serum",
    title: "Repair Hair Serum",
    description:
      "Lightweight hair serum designed to smooth dry-looking hair.",
    price: 1299,
    discount: 10,
    discountPrice: 1169,
    category: "Haircare",
    image:
      "https://images.unsplash.com/photo-1526045478516-99145907023c",
    stock: 22,
  },

  {
    name: "Floral Eau de Parfum",
    title: "Floral Eau de Parfum",
    description:
      "Elegant floral fragrance with a soft and sophisticated aroma.",
    price: 2999,
    discount: 15,
    discountPrice: 2549,
    category: "Fragrance",
    image:
      "https://images.unsplash.com/photo-1541643600914-78b084683601",
    stock: 12,
  },

  {
    name: "Rose Body Mist",
    title: "Rose Body Mist",
    description:
      "Light floral body mist with a refreshing rose fragrance.",
    price: 1599,
    discount: 10,
    discountPrice: 1439,
    category: "Fragrance",
    image:
      "https://images.unsplash.com/photo-1594035910387-fea47794261f",
    stock: 20,
  },

  {
    name: "Professional Makeup Brush Set",
    title: "Professional Makeup Brush Set",
    description:
      "Complete makeup brush set for foundation, blush, eyeshadow and more.",
    price: 1899,
    discount: 12,
    discountPrice: 1671,
    category: "Beauty Tools",
    image:
      "https://images.unsplash.com/photo-1522338242992-e1a54906a8da",
    stock: 15,
  },

  {
    name: "Silicone Facial Cleansing Brush",
    title: "Silicone Facial Cleansing Brush",
    description:
      "Soft silicone cleansing brush for a refreshing facial cleansing routine.",
    price: 1199,
    discount: 10,
    discountPrice: 1079,
    category: "Beauty Tools",
    image:
      "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881",
    stock: 20,
  },
];

// ==========================================
// SEED PRODUCTS
// ==========================================

const seedProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected.");

    await Product.deleteMany({});

    await Product.insertMany(products);

    console.log(
      `✅ ${products.length} products added successfully!`
    );

    await mongoose.connection.close();

    process.exit(0);
  } catch (error) {
    console.error(
      "❌ Product seeding failed:",
      error.message
    );

    await mongoose.connection.close();

    process.exit(1);
  }
};

seedProducts();