// Get Cart
export const getCart = () => {
  const cart = localStorage.getItem("cart");
  return cart ? JSON.parse(cart) : [];
};

// Add Product to Cart
export const addToCart = (product) => {
  const cart = getCart();

  const alreadyExists = cart.find(
    (item) => item._id === product._id
  );

  if (!alreadyExists) {
    cart.push({
      ...product,
      quantity: 1
    });

    localStorage.setItem("cart", JSON.stringify(cart));
  }
};

// Remove Product from Cart
export const removeFromCart = (id) => {
  const cart = getCart();

  const updatedCart = cart.filter(
    (item) => item._id !== id
  );

  localStorage.setItem(
    "cart",
    JSON.stringify(updatedCart)
  );
};


// Get Wishlist
export const getWishlist = () => {
  const wishlist = localStorage.getItem("wishlist");

  return wishlist ? JSON.parse(wishlist) : [];
};


// Add Product to Wishlist
export const addToWishlist = (product) => {
  const wishlist = getWishlist();

  const alreadyExists = wishlist.find(
    (item) => item._id === product._id
  );

  if (!alreadyExists) {
    wishlist.push(product);

    localStorage.setItem(
      "wishlist",
      JSON.stringify(wishlist)
    );
  }
};


// Remove Product from Wishlist
export const removeFromWishlist = (id) => {
  const wishlist = getWishlist();

  const updatedWishlist = wishlist.filter(
    (item) => item._id !== id
  );

  localStorage.setItem(
    "wishlist",
    JSON.stringify(updatedWishlist)
  );
};