import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/authContext";
import Searchbar from "./Searchbar";
import Logo from "../img/recipes_logo.jpg";

const Navbar = () => {
  const { currentUser, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const handleSearchResults = (results) => {
    navigate('/search', { state: { results } });
  };
  
  return (
    <div className="navbar">
      <div className="container">
        <div className="logo">
          <Link to="/">
          <img src={Logo} alt="" />
          </Link> 
        </div>

        <Searchbar onSearch={handleSearchResults}/>
        
        <div className="links">
          <Link className="link" to="/?cat=breakfast">
            <h6>BREAKFAST</h6>
          </Link>
          <Link className="link" to="/?cat=lunch">
            <h6>LUNCH</h6>
          </Link>
          <Link className="link" to="/?cat=dinner">
            <h6>DINNER</h6>
          </Link>
          <Link className="link" to="/?cat=desserts">
            <h6>DESSERTS</h6>
          </Link>
          <Link className="link" to="/?cat=vegetarian">
            <h6>VEGETARIAN</h6>
          </Link>
          <Link className="link" to="/?cat=drinks">
            <h6>DRINKS</h6>
          </Link>
          
          {currentUser && (
            <Link className="link" to="/posts/saved">
              <h6>SAVED</h6>
            </Link>
          )}

          <span>{currentUser?.username}</span>
          {currentUser ? (
            <span onClick={logout}>Logout</span>
          ) : (
            <Link className="link" to="/login">
              Login
            </Link>
          )}
          {currentUser && (
          <span className="write">
            <Link className="link" to="/write">
              Write
            </Link>
          </span> )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;

/* import React, { useContext } from "react";
import { Link } from 'react-router-dom';
import { AuthContext } from "../context/authContext";
import Logo from "../img/recipes_logo.jpg"

const Navbar = () => {
  const { currentUser, logout } = useContext(AuthContext);
  
  return (
    <div className='navbar'>
      <div className='container'>
        <div className='logo'>
          <Link to="/">
            <img src={Logo} alt=''/>
          </Link>
        </div>
        <div className='links'>
          <Link className='link' to="/?cat=apetizer">
            <h6>Apetizer</h6>
          </Link>
          <Link className='link' to="/?cat=dish">
            <h6>Dish</h6>
          </Link>
          <Link className='link' to="/?cat=dessert">
            <h6>Dessert</h6>
          </Link>
          <Link className='link' to="/?cat=drink">
            <h6>Drink</h6>
          </Link>
          <span>{currentUser?.username}</span>
          { currentUser ? (
            <span onClick={logout}>Logout</span>
          ) : (
            <Link className="link" to="/login">Login</Link>
          )}
          <span className='write'>
            <Link className='link' to="/write">Write</Link>
          </span>
        </div>
      </div>
    </div>
  );
};

export default Navbar; */