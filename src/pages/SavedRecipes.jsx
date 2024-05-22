// SavedRecipes.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const SavedRecipes = () => {
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchSavedRecipes = async () => {
      try {
        const response = await axios.get("/posts/saved");
        //const res = await axios.get(`/posts/saved`);
        if (response.data.message) {
          // No recipes saved
          setSavedRecipes([]);
          setMessage(response.data.message);
        } else {
          // Recipes saved, update state
          setSavedRecipes(response.data);
          setMessage("");
        }
      } catch (error) {
        console.error("Error fetching saved recipes:", error);
        setMessage("Error fetching saved recipes. Please try again later.");
      }
    };
    fetchSavedRecipes();
  }, []);

  return (
    <div>
      {message && <p>{message}</p>}
      {savedRecipes.length > 0 ? (
        <div>
          {savedRecipes.map(recipe => (
            <div key={recipe.id}>
              {console.log("Recipe title:", recipe.title)}
              {/* Display saved recipe */}
              <p>{recipe.title}</p>
              {/* Add more details if needed */}
            </div>
          ))}
        </div>
      ) : (
        <p>No recipes saved. Save recipes to see them here.</p>
      )}
    </div>
  );
};

export default SavedRecipes;
