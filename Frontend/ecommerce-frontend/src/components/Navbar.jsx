import {Link} from "react-router-dom";


function Navbar(){

return(

<nav className="navbar navbar-expand-lg pink-nav">

<div className="container">


<Link className="navbar-brand text-white fw-bold" to="/">
💄 Saliha's Beauty
</Link>


<button className="navbar-toggler" 
data-bs-toggle="collapse"
data-bs-target="#menu">

<span className="navbar-toggler-icon"></span>

</button>


<div className="collapse navbar-collapse" id="menu">


<ul className="navbar-nav ms-auto">


<li className="nav-item">
<Link className="nav-link text-white" to="/">
Home
</Link>
</li>


<li className="nav-item">
<Link className="nav-link text-white" to="/products">
Products
</Link>
</li>


<li className="nav-item">
<Link className="nav-link text-white" to="/wishlist">
❤️ Wishlist
</Link>
</li>


<li className="nav-item">
<Link className="nav-link text-white" to="/cart">
🛒 Cart
</Link>
</li>


<li>
  <Link className="btn btn-light ms-2" to="/login">
    Login
  </Link>
</li>

<li>
  <Link className="btn btn-outline-light ms-2" to="/signup">
    Signup
  </Link>
</li>
</ul>


</div>

</div>

</nav>

)

}

export default Navbar;