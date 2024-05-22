import React, { useState }  from "react";
import Searchbar from "../components/Searchbar";
import { Link, useLocation } from "react-router-dom";

const Search = () => {

  const location = useLocation();
  const searchResults = location.state?.results || [];

    //const [searchResults, setSearchResults] = useState([]);
  
    // Funktion zum Verarbeiten der Suchergebnisse
    // Du kannst hier Logik hinzufügen, um die erhaltenen Suchergebnisse anzuzeigen oder zu verarbeiten
    /* const handleSearchResults = (results) => {
      if (Array.isArray(results)) {
        setSearchResults(results);
    } else {
        setSearchResults([]); // Handle unexpected response
    }

}; */
  
    return (
    <div>
      <h1>Search Page</h1>
      {/* <Searchbar onSearch={handleSearchResults}/> */}
      {/* You can render search results or other components related to search here */}
      <div>
      {searchResults.length > 0 ? (
        searchResults.map((post) => (
            <div className="post" key={post.id}>
              {/* Hier kannst du die einzelnen Suchergebnisse anzeigen */}
              <img src={`../upload/${post?.img}`} alt="" />
              <h2>{post.title}</h2>
              <Link className="link" to={`/post/${post.id}`}>
                <button>Read More</button>
              </Link>
          </div>
        ))
      ):(
        <p>No results found</p>
      )}
        </div>
    </div>
  );
};

export default Search;
