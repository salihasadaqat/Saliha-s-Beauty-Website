// ==========================================
// CART STORAGE
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
// SAVE CART
// ==========================================

export const saveCart = (cart) => {
  localStorage.setItem(
    "cart",
    JSON.stringify(cart)
  );
};

// ==========================================
// GET CART COUNT
// ==========================================

export const getCartCount = () => {
  const cart = getCart();

  return cart.reduce(
    (total, product) =>
      total + Number(product.quantity || 1),
    0
  );
};

// ==========================================
// GET CART TOTAL
// ==========================================

export const getCartTotal = () => {
  const cart = getCart();

  return cart.reduce((total, product) => {
    const price =
      Number(product.discountPrice) > 0
        ? Number(product.discountPrice)
        : Number(product.discount) > 0
        ? Number(product.discount)
        : Number(product.price) || 0;

    const quantity =
      Number(product.quantity) || 1;

    return total + price * quantity;
  }, 0);
};

// ==========================================
// ADD TO CART
// ==========================================

export const addToCart = (product) => {
  const cart = getCart();

  const index = cart.findIndex(
    (item) => item._id === product._id
  );

  if (index !== -1) {
    cart[index].quantity =
      (Number(cart[index].quantity) || 1) + 1;
  } else {
    cart.push({
      ...product,
      quantity: 1,
    });
  }

  saveCart(cart);

  return cart;
};

// ==========================================
// INCREASE QUANTITY
// ==========================================

export const increaseCartQuantity = (productId) => {
  const cart = getCart();

  const product = cart.find(
    (item) => item._id === productId
  );

  if (product) {
    product.quantity =
      (Number(product.quantity) || 1) + 1;
  }

  saveCart(cart);

  return cart;
};

// ==========================================
// DECREASE QUANTITY
// ==========================================

export const decreaseCartQuantity = (productId) => {
  const cart = getCart();

  const index = cart.findIndex(
    (item) => item._id === productId
  );

  if (index === -1) {
    return cart;
  }

  const quantity =
    Number(cart[index].quantity) || 1;

  if (quantity > 1) {
    cart[index].quantity = quantity - 1;
  } else {
    cart.splice(index, 1);
  }

  saveCart(cart);

  return cart;
};

// ==========================================
// REMOVE FROM CART
// ==========================================

export const removeFromCart = (productId) => {
  const cart = getCart();

  const updatedCart = cart.filter(
    (item) => item._id !== productId
  );

  saveCart(updatedCart);

  return updatedCart;
};

// ==========================================
// CLEAR CART
// ==========================================

export const clearCart = () => {
  localStorage.removeItem("cart");
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
// WISHLIST COUNT
// ==========================================

export const getWishlistCount = () => {
  const wishlist = getWishlist();

  return wishlist.length;
};

// ==========================================
// ADD TO WISHLIST
// ==========================================

export const addToWishlist = (product) => {
  const wishlist = getWishlist();

  const exists = wishlist.some(
    (item) => item._id === product._id
  );

  if (!exists) {
    wishlist.push(product);
  }

  localStorage.setItem(
    "wishlist",
    JSON.stringify(wishlist)
  );

  return wishlist;
};

// ==========================================
// REMOVE FROM WISHLIST
// ==========================================

export const removeFromWishlist = (productId) => {
  const wishlist = getWishlist();

  const updatedWishlist =
    wishlist.filter(
      (item) => item._id !== productId
    );

  localStorage.setItem(
    "wishlist",
    JSON.stringify(updatedWishlist)
  );

  return updatedWishlist;
};

// ==========================================
// CLEAR WISHLIST
// ==========================================

export const clearWishlist = () => {
  localStorage.removeItem("wishlist");
};