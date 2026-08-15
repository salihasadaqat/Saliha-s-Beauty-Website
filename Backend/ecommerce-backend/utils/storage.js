// ==========================================
// CART
// ==========================================

export const getCart = () => {
  try {
    const cart = localStorage.getItem("cart");

    return cart ? JSON.parse(cart) : [];
  } catch (error) {
    console.error("Get cart error:", error);
    return [];
  }
};


// ==========================================
// ADD TO CART
// ==========================================

export const addToCart = (product) => {
  const cart = getCart();

  const existingProduct = cart.find(
    (item) => item._id === product._id
  );

  if (existingProduct) {
    existingProduct.quantity += 1;
  } else {
    cart.push({
      ...product,
      quantity: 1
    });
  }

  localStorage.setItem(
    "cart",
    JSON.stringify(cart)
  );

  window.dispatchEvent(
    new Event("cartUpdated")
  );
};


// ==========================================
// INCREASE CART QUANTITY
// ==========================================

export const increaseCartQuantity = (id) => {
  const cart = getCart();

  const product = cart.find(
    (item) => item._id === id
  );

  if (product) {
    product.quantity += 1;
  }

  localStorage.setItem(
    "cart",
    JSON.stringify(cart)
  );

  window.dispatchEvent(
    new Event("cartUpdated")
  );
};


// ==========================================
// DECREASE CART QUANTITY
// ==========================================

export const decreaseCartQuantity = (id) => {
  const cart = getCart();

  const product = cart.find(
    (item) => item._id === id
  );

  if (product) {
    if (product.quantity > 1) {
      product.quantity -= 1;
    }
  }

  localStorage.setItem(
    "cart",
    JSON.stringify(cart)
  );

  window.dispatchEvent(
    new Event("cartUpdated")
  );
};


// ==========================================
// REMOVE FROM CART
// ==========================================

export const removeFromCart = (id) => {
  const cart = getCart();

  const updatedCart = cart.filter(
    (item) => item._id !== id
  );

  localStorage.setItem(
    "cart",
    JSON.stringify(updatedCart)
  );

  window.dispatchEvent(
    new Event("cartUpdated")
  );
};


// ==========================================
// CLEAR CART
// ==========================================

export const clearCart = () => {
  localStorage.removeItem("cart");

  window.dispatchEvent(
    new Event("cartUpdated")
  );
};


// ==========================================
// CART COUNT
// ==========================================

export const getCartCount = () => {
  const cart = getCart();

  return cart.reduce(
    (total, item) =>
      total + Number(item.quantity || 0),
    0
  );
};


// ==========================================
// CART TOTAL
// ==========================================

export const getCartTotal = () => {
  const cart = getCart();

  return cart.reduce(
    (total, item) => {
      const price =
        Number(
          item.discountPrice ??
          item.discount ??
          item.price ??
          0
        );

      return (
        total +
        price *
          Number(item.quantity || 0)
      );
    },
    0
  );
};


// ==========================================
// WISHLIST
// ==========================================

export const getWishlist = () => {
  try {
    const wishlist =
      localStorage.getItem("wishlist");

    return wishlist
      ? JSON.parse(wishlist)
      : [];
  } catch (error) {
    console.error(
      "Get wishlist error:",
      error
    );

    return [];
  }
};


// ==========================================
// ADD TO WISHLIST
// ==========================================

export const addToWishlist = (product) => {
  const wishlist = getWishlist();

  const alreadyExists =
    wishlist.some(
      (item) =>
        item._id === product._id
    );

  if (!alreadyExists) {
    wishlist.push(product);

    localStorage.setItem(
      "wishlist",
      JSON.stringify(wishlist)
    );
  }

  window.dispatchEvent(
    new Event("wishlistUpdated")
  );
};


// ==========================================
// REMOVE FROM WISHLIST
// ==========================================

export const removeFromWishlist = (id) => {
  const wishlist = getWishlist();

  const updatedWishlist =
    wishlist.filter(
      (item) => item._id !== id
    );

  localStorage.setItem(
    "wishlist",
    JSON.stringify(updatedWishlist)
  );

  window.dispatchEvent(
    new Event("wishlistUpdated")
  );
};


// ==========================================
// WISHLIST COUNT
// ==========================================

export const getWishlistCount = () => {
  return getWishlist().length;
};


// ==========================================
// CHECK WISHLIST
// ==========================================

export const isInWishlist = (id) => {
  const wishlist = getWishlist();

  return wishlist.some(
    (item) => item._id === id
  );
};