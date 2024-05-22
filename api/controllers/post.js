import axios from "axios";
import { db } from "../db.js";
import jwt from "jsonwebtoken";
import React, { useEffect, useState, useContext } from "react";

//Daten aus der DB abrufen
export const getPosts = (req, res) => {
  //Wenn die Abfrage eine Kategorie enthält, wähle alle Beiträge aus der angegebenen Kategorie aus
  //Andernsfalls wähle alle Beiträge aus
  const q = req.query.cat
    ? "SELECT * FROM posts WHERE cat = ?"
    : "SELECT * FROM posts";

  //Fragt in der DB mit den entsprechenden SQL-Anweisungen
  db.query(q, [req.query.cat], (err, data) => {
    //Bei einem Fehler soll der Feler zurückgegeben werden
    if (err) return res.status(500).send(err);
    //Andernfalls gebe den Status 200 und die daten als JSON zurück
    return res.status(200).json(data);
  });
};
//Ruft einen einzelnen Rezept-Beitrag aus der DB ab
export const getPost = (req, res) => {
  //Spezifische Felder aus user und posts Tabelle auswählen und mit der userId joinen
  const q =
  "SELECT p.id, `username`, `title`, `desc`, p.`img`,u.`img` AS userImg, `cat`,`date`, `ingr` FROM users u JOIN posts p ON u.id = p.uid WHERE p.id = ?";
  //Fragt in der DB mit den entsprechenden SQL-Anweisungen
  db.query(q, [req.params.id], (err, data) => {
    
    if (err) return res.status(500).json(err);
    //Andernfalls wird der Statuscode 200 und das erste Element im Array als Json zurück gegeben
    return res.status(200).json(data[0]);
  });
};

// Einen neuen Beitrag zur DB hinzufügen
export const addPost = (req, res) => {
  //Überprüfen ob der user authentifiziert wurde, indem geprüft wird ob sich der Token in den cookies befindet
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json("Not authenticated!");

  //Token mit dem secret key verfizieren
  jwt.verify(token, "jwtkey", (err, userInfo) => {
    
    if (err) {
      return res.status(403).json("Token is not valid!");
    }
    //Andernfalls, wird die Anfrage konstuktiert, um einen neuen Beitrag in die DB hinzuzufügen
    const q =
    "INSERT INTO posts(`title`, `desc`, `img`, `cat`, `date`,`uid`, `ingr`) VALUES (?)";
    //Array mit Werten, die in die DB hinzugefügt werden sollen
    const values = [
      req.body.title,
      req.body.desc,
      req.body.img,
      req.body.cat,
      req.body.date,
      userInfo.id,
      req.body.ingr,
    ];
    //DB Anfrage mit den Werten ausführen
    db.query(q, [values], (err, data) => {
      if (err) {
        return res.status(500).json("An error occurred while creating the post." + err); }
        //Beitrag erstellt
        return res.status(200).json("Post has been added successfully!");
    });
  });
};
//Beitrag aus der DB löschen
export const deletePost = (req, res) => {
  //Authentifizierung mit cookies überprüfen
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json("Not authenticated!");
  //Überprüfung des Tokens mithilfe von geheimen Schlüssel
  jwt.verify(token, "jwtkey", (err, userInfo) => {
    if (err) {
      return res.status(403).json("Token is not valid!");
    }
    //Den ID des zu löschenden Beitrags wird durch Anforderungsparametern erhalten
    const postId = req.params.id;
    //In der SQL-Abfrage wird überprüft, ob es sich um den Beitrag mit der angegebenen id handelt
    const q = "DELETE FROM posts WHERE `id` = ? AND `uid` = ?";
    //Anfrage mit den Parametern Id des beitrags und user ausgeführt
    db.query(q, [postId, userInfo.id], (err, data) => {
      if (err) return res.status(403).json("You can delete only your post!");

      return res.json("Post has been deleted!");
    });
  });
};
//Beitrag aktualisieren
export const updatePost = (req, res) => {
  //Zugriffstoken aus den Cookie Anforderungen holen
  const token = req.cookies.access_token;
  //Überprüfung ob der Token vorhanden ist
  if (!token) return res.status(401).json("Not Authenticated!");

  jwt.verify(token, "jwtkey", (err, userInfo) => {
    if (err) 
    return res.status(403).json("Token is not valid!");
    //Beitrag ID aus den Anforderungsparameter holen
    const postId = req.params.id;
    //SQL-Abrafe zum aktualisieren des Beitrags mit den neuen Werten
    const q =
      "UPDATE posts SET `title` = ?,`desc` = ?,`img` = ?,`cat`= ?, `ingr` = ? WHERE `id` = ? AND `uid` = ?";
    //Ein Array mit den neuen Werten für den Beitrag
    const values = [
      req.body.title, 
      req.body.desc, 
      req.body.img, 
      req.body.cat,
      req.body.ingr
    ];

    db.query(q, [...values, postId, userInfo.id], (err, data) => {
      if (err) //{ console.error(err);  Log the error for debugging purposes
      return res.status(500).json("An error occurred while updating the post.");
      return res.json("Post has been updated.");
    });
  });
};

export const getReviews = (req, res) => {
  const postId = req.params.id;
  const q = "SELECT * FROM reviews WHERE postId = ?";
  
  db.query(q, [postId], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json(data);
  });
};

export const addReview = (req, res) => {
  const { postId, rating, comment } = req.body;
  const q = "INSERT INTO reviews(`postId`, `rating`, `comment`) VALUES (?)";

  db.query(q, [postId, rating, comment], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("Review added successfully!");
  });
};

// Funktion zum Überprüfen, ob ein Rezept gespeichert wurde
export const isRecipeSaved = (userId, postId, callback) => {
  const q = "SELECT * FROM saved_recipes WHERE userId = ? AND postId = ?";
  db.query(q, [userId, postId], (err, data) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, data.length > 0); // true, wenn das Rezept gespeichert ist, sonst false
    }
  });
};

// Funktionalität zum Speichern eines Rezepts
export const saveRecipe = (req, res) => {
  console.log("Save Recipe endpoint called");
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json("Not authenticated!");

  jwt.verify(token, "jwtkey", async (err, decoded) => {
    if (err) {
      return res.status(403).json("Token is not valid!");
    }
    const { postId } = req.body; // postId aus den Routenparametern holen
    const userId = decoded.id; // userId aus dem decodierten Token holen
    console.log("postId:", postId);
    try{
      const q =
      "INSERT INTO saved_recipes(`userId`, `postId`) VALUES (?, ?)";
      //Array mit Werten, die in die DB hinzugefügt werden sollen
      const values = [userId, postId];
      db.query(q, values, (err));
        return res.status(200).json("Recipe saved successfully!");
    } catch (error) {
        return res.status(500).json("An error occurred while saving the recipe: " + error.message);
    }
  });
};

// Funktionalität zum Entfernen eines gespeicherten Rezepts
export const unsaveRecipe = (req, res) => {
  //Authentifizierung mit cookies überprüfen
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json("Not authenticated!");
  //Überprüfung des Tokens mithilfe von geheimen Schlüssel
  jwt.verify(token, "jwtkey",  (err,userInfo) => {
    if (err) {
      return res.status(403).json("Token is not valid!");
    }
    const postId = req.params.id; // postId aus den Routenparametern holen
    //const userId = decoded.id; // userId aus dem decodierten Token holen
    try {
      const q = "DELETE FROM saved_recipes WHERE `postId` = ?";

      db.query(q, [postId], (err) => {
        if (err) {
          console.error("Error unsaving recipe:", err);
          return res.status(500).json("An error occurred while unsaving the recipe: " + err.message);
        }
        return res.json("Recipe unsaved successfully!");
      });
    } catch (error) {
      console.error("Error unsaving recipe:", error);
      return res.status(500).json("An error occurred while unsaving the recipe: " + error.message);
    }
  });
};

export const getSavedRecipes = (req, res) => {
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json("Not authenticated!");

  jwt.verify(token, "jwtkey", async (err, decoded) => {
    if (err) {
      return res.status(403).json("Token is not valid!");
    }

    const userId = decoded.id;
    
    try {
      //const q = "SELECT * FROM saved_recipes WHERE `userId` = ?";
      const q = "SELECT postId FROM saved_recipes WHERE `userId` = ?";
      db.query(q, [userId], async (err, data) => {
        console.log("Saved recipes:", data);
        if (err) {
          console.error("Error fetching saved recipes:", err);
          return res.status(500).json("An error occurred while fetching saved recipes: " + err.message);
        }

        if (data.length === 0) {
          return res.status(200).json({ message: "No recipes saved." });
        }
        // Assuming you have a function to fetch post details by postId
        // Modify this part based on your actual implementation
        const postIds = data.map(item => item.postId);
        //const savedRecipes = await Promise.all(postIds.map(fetchPostDetailsById));
        //return res.status(200).json(savedRecipes);
        //New
        // Query the posts table to get details of saved recipes
        const q2 = "SELECT * FROM posts WHERE id IN (?)";
        db.query(q2, [postIds], (err, posts) => {
          if (err) {
            console.error("Error fetching saved recipes:", err);
            return res.status(500).json("An error occurred while fetching saved recipes: " + err.message);
          }
          return res.status(200).json(posts);
        });
      });
    } catch (error) {
      console.error("Error:", error);
      return res.status(500).json("An error occurred while fetching saved recipes: " + error.message);
    }
  });
};

const fetchPostDetailsById = async (postId) => {
  try {
    const res = await axios.get(`/posts/${postId}`);
    return res.data;
  } catch (err) {
    console.error("Error fetching post details:", err);
    return null; // Or handle the error as per your requirement
  }
};

// Suchfunktion für Beiträge
export const searchPosts = (req, res) => {
  console.log('Search request received');
  const searchTerm = req.query.searchTerm || ''; // Suchbegriff aus der Abfrage extrahieren
  const category = req.query.category || ''; // Kategorie aus der Abfrage extrahieren

  console.log('Search Term:', searchTerm);
  console.log('Category:', category);

  let q;
  let params;

  // Überprüfen, ob ein Suchbegriff vorhanden ist
  if (searchTerm) {
    // Suchanfrage mit Suchbegriff und optionaler Kategorie erstellen
    q = category ? "SELECT * FROM posts WHERE LOWER(cat) = ? AND LOWER(title) LIKE ?" : "SELECT * FROM posts WHERE LOWER(title) LIKE ?";
    
    // Parameter für die SQL-Abfrage festlegen
    params = category ? [category.toLowerCase(), `%${searchTerm.toLowerCase()}%`] : [`%${searchTerm.toLowerCase()}%`];
  } else {
    // Wenn kein Suchbegriff vorhanden ist, nach Kategorie filtern oder alle Beiträge abrufen
    q = category ? "SELECT * FROM posts WHERE LOWER(cat) = ?" : "SELECT * FROM posts";
    params = category ? [category.toLowerCase()] : [];
  }

  // Fragt in der DB mit den entsprechenden SQL-Anweisungen
  db.query(q, params, (err, data) => {
    // Bei einem Fehler soll der Fehler zurückgegeben werden
    if (err) return res.status(500).json({ error: "An error occurred while fetching posts" });
    // Andernfalls geben Sie den Status 200 und die Daten als JSON zurück
    return res.status(200).json(data);
  });
};
/* export const searchPosts = (req, res) => {
  const searchTerm = req.query.searchTerm || ''; // Suchbegriff aus der Abfrage extrahieren
  const category = req.query.category || ''; // Kategorie aus der Abfrage extrahieren

  const q = category ? "SELECT * FROM posts WHERE cat = ?" : "SELECT * FROM posts";

  // Fragt in der DB mit den entsprechenden SQL-Anweisungen
  db.query(q, [category], (err, data) => {
    // Bei einem Fehler soll der Fehler zurückgegeben werden
    if (err) return res.status(500).send(err);
    // Andernfalls geben Sie den Status 200 und die Daten als JSON zurück
    return res.status(200).json(data);
  });
}; */


/* // Funktion zum Hinzufügen eines neuen Reviews
export const addReview = (req, res) => {
  const id = req.params.id;

  let data = {
    postId: id,
    rating: req.body.rating,
    comment: req.body.comment
  }
  try {
    const review = await Review.create(data)
    res.status(200).send(review);
} catch (error) {
    res.status(500).json(error);
}
}; */
  /* const {rating, comment, userId, postId} = req.body;
  const q = "INSERT INTO reviews (`rating`, `comment`, `userId`, `postId`) VALUES (?, ?, ?, ?)";

  db.query(q, [rating, comment, userId, postId], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json("Review added successfully!");
  });
}; */

//Get All Reviews
// Funktion zum Abrufen von Reviews für einen bestimmten Beitrag
/* export const getReviews = async (req, res) => {
  const postId = req.params.id;
  try {
    const reviews = await Review.findAll({where: { postId }})
    res.status(200).send(reviews);
  } catch (error) {
    res.status(500).json(error);
  }
 */
  /* const q = "SELECT * FROM reviews WHERE postId = ?";
  db.query(q, [postId], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  }); */
// };



 



/* import { db } from "../db.js";
import jwt from "jsonwebtoken";

export const getRecipes = (req, res)=>{
    const q = req.query.cat ? "SELECT * FROM recipes WHERE cat=?" : "SELECT * FROM recipes";

    db.query(q, [req.query.cat], (err, data) => {
        if (err) return res.status(500).send(err);

        return res.status(200).json(data);
    });
};

//Single recipe
export const getRecipe = (req, res)=>{
    const q =
    "SELECT r.id, `username`, `title`, `desc`, r.img, u.img AS userImg, `cat`,`date` FROM users u JOIN recipes r ON u.id = r.uid WHERE r.id = ? ";

    db.query(q, [req.params.id], (err, data) => {
        if (err) return res.status(500).json(err);

        return res.status(200).json(data[0]); //returns first item
    });
};

export const addRecipe = (req, res)=>{
    const token = req.cookies.access_token;
    if (!token) return res.status(401).json("Not authenticated!");

    jwt.verify(token, "jwtkey", (err, userInfo) => {
        if (err) return res.status(403).json("Token is not valid!");

        const q =
        "INSERT INTO recipes(`title`, `desc`, `img`, `cat`, `date`,`uid`) VALUES (?)";

        const values = [
        req.body.title,
        req.body.desc,
        req.body.img,
        req.body.cat,
        req.body.date,
        userInfo.id,
        ];

        db.query(q, [values], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.json("Post has been created.");
        });
    });
};

export const deleteRecipe = (req, res)=>{
    const token = req.cookies.access_token;
    if (!token) return res.status(401).json("Not authenticated!");

    jwt.verify(token, "jwtkey", (err, userInfo) => {
        if (err) return res.status(403).json("Token is not valid!");
    
        const recipeId = req.params.id;
        const q = "DELETE FROM recipes WHERE `id` = ? AND `uid` = ?";

        db.query(q, [recipeId, userInfo.id], (err, data) => {
            if (err) return res.status(403).json("You can delete only your recipe!");
      
            return res.json("Recipe has been deleted!");
        });
    });
};

export const updateRecipe = (req, res) => {
    const token = req.cookies.access_token;
    if (!token) return res.status(401).json("Not authenticated!");
  
    jwt.verify(token, "jwtkey", (err, userInfo) => {
      if (err) return res.status(403).json("Token is not valid!");
  
      const recipeId = req.params.id;
      const q =
        "UPDATE recipes SET `title`=?,`desc`=?,`img`=?,`cat`=? WHERE `id` = ? AND `uid` = ?";
  
      const values = [req.body.title, req.body.desc, req.body.img, req.body.cat];
  
      db.query(q, [...values, recipeId, userInfo.id], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.json("Recipe has been updated.");
      });
    });
  };

 */