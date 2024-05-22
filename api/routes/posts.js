import express from "express";
import {
  addPost,
  deletePost,
  getPost,
  getPosts,
  updatePost,
  getReviews,
  addReview,
  saveRecipe, // Neu hinzugefügt: Funktion zum Speichern eines Rezepts
  unsaveRecipe,
  getSavedRecipes,
  isRecipeSaved,
  searchPosts,
} from "../controllers/post.js";

const router = express.Router();
//Routes for posts
router.get("/", getPosts);
router.get("/:id", getPost);
router.post("/", addPost);
router.delete("/:id", deletePost);
router.put("/:id", updatePost);

router.get("/search", searchPosts);
//Routes for reviews
//router.get("/:id/reviews", getReviews); // Bewertungen für einen bestimmten Beitrag abrufen
//router.post("/:id/reviews", addReview); // Bewertung zu einem bestimmten Beitrag hinzufügen

// Neu hinzugefügt: Endpunkte zum Speichern und Entfernen von Rezepten
router.post("/:id/save", saveRecipe); // Route zum Speichern eines Rezepts
router.delete("/:id/unsave", unsaveRecipe); // Route zum Entfernen eines gespeicherten Rezepts
//router.get("/posts/saved", getSavedRecipes); //fetch saved recipes

router.get("/saved", getSavedRecipes); // Endpunkt zum Abrufen der gespeicherten Rezepte

// Route zum Überprüfen, ob ein Rezept gespeichert ist
router.get("/isRecipeSaved", (req, res) => {
  const { userId, postId } = req.query;
  isRecipeSaved(userId, postId, (err, isSaved) => {
    if (err) {
      console.error("Error checking if recipe is saved:", err);
      return res.status(500).json({ error: "An error occurred while checking if recipe is saved" });
    }
    return res.status(200).json(isSaved);
  });
});

export default router;

/* import express from "express";
import { 
    addRecipe, 
    deleteRecipe, 
    getRecipe, 
    getRecipes, 
    updateRecipe,
} from "../controllers/recipe.js";

const router = express.Router();

router.get("/", getRecipes);
router.get("/:id", getRecipe);
router.post("/", addRecipe);
router.delete("/:id", deleteRecipe);
router.put("/:id", updateRecipe);


export default router;
 */