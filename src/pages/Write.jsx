import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import moment from "moment";

const Write = () => {
  const state = useLocation().state;
  const [title, setTitle] = useState(state?.title || "");
  const [desc, setDesc] = useState(state?.desc || "");
  const [file, setFile] = useState(null);
  const [cat, setCat] = useState(state?.cat || "");
  const [ingr, setIngr] = useState(state?.ingr || []);

  const navigate = useNavigate();

  const upload = async () => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      
      const res = await axios.post("/upload", formData);
      return res.data;
    } catch (err) {
      console.log(err);
    }
  };

  const handleIngredientChange = (index, key, value) => {
    const updateIngr = [...ingr];
    updateIngr[index][key] = value;
    setIngr(updateIngr);
  }

  const addIngredient = () => {
    setIngr([...ingr, { amount: "", unit: "", name: "" }]);
  };

  const removeIngredient = (index) => {
    const updatedIngredients = [...ingr];
    updatedIngredients.splice(index, 1);
    setIngr(updatedIngredients);
  };

  const handleClick = async (e) => {
    e.preventDefault();
    const imgUrl = await upload();

    try {
      state
        ? await axios.put(`/posts/${state.id}`, {
            title: title,
            desc: desc,
            cat: cat,
            img: file ? imgUrl : "",
            ingr: JSON.stringify(ingr), // Zutaten in JSON-Format umwandel
          })
        : await axios.post(`/posts/`, {
            title: title,
            desc: desc,
            cat: cat,
            img: file ? imgUrl : "",
            ingr: JSON.stringify(ingr), // Zutaten in JSON-Format umwandel
            date: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
          });
          
          navigate("/")
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="add">
      <div className="content">
        <input
          type="text"
          value={title}
          placeholder="Title"
          onChange={(e) => setTitle(e.target.value)}
        />
        <div className="editorContainer">
          <ReactQuill
            className="editor"
            theme="snow"
            value={desc}
            onChange={setDesc}
          />
        </div>

        <div className="ingredients">
          <h2>Ingredients</h2>
          {ingr.map((ingredient, index) => (
            <div key={index} className="ingredient">
              <input
                type="text"
                placeholder="Amount"
                value={ingredient.amount}
                onChange={(e) => handleIngredientChange(index, 'amount', e.target.value)}
              />
              <input
                type="text"
                placeholder="Unit"
                value={ingredient.unit}
                onChange={(e) => handleIngredientChange(index, 'unit', e.target.value)}
              />
              <input
                type="text"
                placeholder="Name"
                value={ingredient.name}
                onChange={(e) => handleIngredientChange(index, 'name', e.target.value)}
              />
              <button onClick={() => removeIngredient(index)}>Remove</button>
            </div>
          ))}
          <button onClick={addIngredient}>Add Ingredient</button>
        </div>
      </div>

      <div className="menu">
        <div className="item">
          <h1>Publish</h1>
          <span>
            <b>Status: </b> Draft
          </span>
          <span>
            <b>Visibility: </b> Public
          </span>
          <input
            style={{ display: "none" }}
            type="file"
            id="file"
            name=""
            onChange={(e) => setFile(e.target.files[0])}
          />
          <label className="file" htmlFor="file">
            Upload Image
          </label>
          <div className="buttons">
            <button>Save as a draft</button>
            <button onClick={handleClick}>Publish</button>
          </div>
        </div>

        <div className="item">
          <h1>Category</h1>
          
          <div className="cat">
            <input
              type="radio"
              checked={cat === "breakfast"}
              name="cat"
              value="breakfast"
              id="breakfast"
              onChange={(e) => setCat(e.target.value)}
            />
            <label htmlFor="breakfast">breakfast</label>
          </div>

          <div className="cat">
            <input
              type="radio"
              checked={cat === "lunch"}
              name="cat"
              value="lunch"
              id="lunch"
              onChange={(e) => setCat(e.target.value)}
            />
            <label htmlFor="lunch">Lunch</label>
          </div>

          <div className="cat">
            <input
              type="radio"
              checked={cat === "dinner"}
              name="cat"
              value="dinner"
              id="dinner"
              onChange={(e) => setCat(e.target.value)}
            />
            <label htmlFor="dinner">Dinner</label>
          </div>

          <div className="cat">
            <input
              type="radio"
              checked={cat === "desserts"}
              name="cat"
              value="desserts"
              id="desserts"
              onChange={(e) => setCat(e.target.value)}
            />
            <label htmlFor="desserts">Desserts</label>
          </div>

          <div className="cat">
            <input
              type="radio"
              checked={cat === "vegetarian"}
              name="cat"
              value="vegetarian"
              id="vegetarian"
              onChange={(e) => setCat(e.target.value)}
            />
            <label htmlFor="vegetarian">Vegetarian</label>
          </div>

          <div className="cat">
            <input
              type="radio"
              checked={cat === "drinks"}
              name="cat"
              value="drinks"
              id="drinks"
              onChange={(e) => setCat(e.target.value)}
            />
            <label htmlFor="drinks">Drinks</label>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Write;
/* import axios from 'axios';
import moment from 'moment';
import React, {useState} from 'react';
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useLocation, useNavigate } from 'react-router-dom';

const Write = () => {

  const state = useLocation().state;
  //If there is a state use it ex. title, if not it's gonna be empty
  const [value, setValue] = useState(state?.title || "");
  const [title, setTitle] = useState(state?.desc || "");
  const [file, setFile] = useState(null);
  const [cat, setCat] = useState(state?.cat || "");

  const navigate = useNavigate();
  //console.log(value)

  const upload = async () => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await axios.post("/upload", formData);
      return res.data;
    } catch (err) {
      console.log(err);
    }
  };

  const handleClick = async (e) => {
    e.preventDefault();
    const imgUrl = await upload();

    try {
      state
        ? await axios.put(`/recipes/${state.id}`, {
            title,
            desc: value,
            cat,
            img: file ? imgUrl : "",
          })
        : await axios.post(`/recipes/`, {
            title,
            desc: value,
            cat,
            img: file ? imgUrl : "",
            date: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
          });
          navigate("/")
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className='add'>
      <div className="content">
        <input type='text' value={title} placeholder='title' onChange={(e) => setTitle(e.target.value)}/>
          <div className='editorContainer'>
            <ReactQuill className='editor' theme="snow" value={value} onChange={setValue} />
          </div>
      </div>
      <div className="menu">
        <div className="item">
          <h1>Publish</h1>
          <span>
            <b>Status: </b> Draft 
          </span>
          <span>
            <b>Visibility: </b> Public
          </span>
          <input style={{display:"none"}} type="file" id='file' onChange={(e) => setFile(e.target.files[0])}/>
          <label className='file' htmlFor="file">Upload Image</label>
          <div className='buttons'>
            <button>Save as a draft</button>
            <button onClick={handleClick}>Publish</button>
          </div>
        </div>

        <div className="item">
          <h1>Category</h1>
          <div className='cat'>
            <input type="radio" checked={cat === "apetizer"} name='cat' value="apetizer" id='apetizer' onChange={(e) => setCat(e.target.value)}/>
            <label htmlFor="apetizer">Apetizer</label>
          </div>
          <div className='cat'>
            <input type="radio" checked={cat === "dish"} name='cat' value="dish" id='dish' onChange={(e) => setCat(e.target.value)}/>
            <label htmlFor="dish">Dish</label>
          </div>
          <div className='cat'>
            <input type="radio" checked={cat === "dessert"} name='cat' value="dessert" id='dessert' onChange={(e) => setCat(e.target.value)}/>
            <label htmlFor="dessert">Dessert</label>
          </div>
          <div className='cat'>
            <input type="radio" checked={cat === "drink"} name='cat' value="drink" id='drink' onChange={(e) => setCat(e.target.value)}/>
            <label htmlFor="drink">Drink</label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Write; */