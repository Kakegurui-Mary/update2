import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";
//import posts from "api/routes/posts.js"
//import "./Searchbar.css";

const Searchbar = ({onSearch}) => {
  const [input, setInput] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const navigate = useNavigate();
  //const [results, setResults] = useState([]);

  // Funktion zum Abrufen von Suchergebnissen über eine API-Anfrage
  const fetchData = async (searchTerm, category) => {
    try {
      const params = new URLSearchParams();
      if (category) params.append('category', category);
      params.append('searchTerm', searchTerm);
  
      const url = `posts/search?${params.toString()}`;
      const response = await axios.get(url);
      
      console.log('Search results:', response.data);  // Log the response data

      if (onSearch) {
        onSearch(response.data);
      }
      // Navigate to the /search route with search results
      navigate('/search', { state: { results: response.data } });

      }catch (error) {
        console.error(`Error fetching data: ${error.response ? error.response.status : ''} - ${error.message}`);
        //onSearch([]); // Handle empty response / fetch error
        navigate('/search', { state: { results: [] } });
      }

      //Auskommentiert
      // Assuming you want to do something with the response here
      /* setResults(response.data);

      // Pass the search results to the parent component
    if (onSearch) {
      onSearch(response.data);
    }
      //navigate(`/search?${params.toString()}`);
    } catch (error) {
      // Log error to console with more details
      console.error(`Error fetching data: ${error.response ? error.response.status : ''} - ${error.message}`);
    } */
  };

  // Funktion zum Auslösen der Suche, wenn auf das Suchsymbol geklickt wird
  const handleSearch = () => {
    console.log('Search button clicked');
    fetchData(input.toLowerCase(), selectedCategory);
  };

  // Funktion zum Aktualisieren des Eingabewerts im State, wenn sich der Benutzer ändert
  const handleChange = (value) => {
    setInput(value);
    //fetchData(value, selectedCategory);
  };

  // Funktion zum Aktualisieren der ausgewählten Kategorie im State
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    fetchData(input.toLowerCase(), category);
  };

  return (
    <div className="input-wrapper">
        {/* Suchfeld */}
      <input
        className="search-icon"
        type="text"
        placeholder="Search..."
        value={input}
        onChange={(e) => handleChange(e.target.value)}
      />
      {/* Dropdown-Liste für die Kategorien */}
      <select
        onChange={(e) => handleCategoryChange(e.target.value)}
        value={selectedCategory}
      >
        <option value="">All</option>
        <option value="breakfast">Breakfast</option>
        <option value="lunch">Lunch</option>
        <option value="dinner">Dinner</option>
        <option value="dessert">Dessert</option>
        <option value="vegetarian">Vegetarian</option>
        <option value="drinks">Drinks</option>
      </select>

      {/* Symbol zum Auslösen der Suche */}
      <FaSearch id="search-icon" onClick={handleSearch}/>
    </div>
  );
};

export default Searchbar;