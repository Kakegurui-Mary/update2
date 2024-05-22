import React, { useEffect, useState, useContext } from "react";
import Edit from "../img/edit.png";
import Delete from "../img/delete.png";
import Save from "../img/save.png";
import Unsave from "../img/unsave.png";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import Menu from "../components/Menu";
import axios from "axios";
import moment from "moment";
import { AuthContext } from "../context/authContext";
//import DOMPurify from "dompurify";
import { FaStar } from "react-icons/fa";

const Single = () => {
  const [post, setPost] = useState({});
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [hover, setHover] = useState(null);
  const [isSaved, setIsSaved] = useState(false); // Hinzugefügt

  const location = useLocation();
  const navigate = useNavigate();
  const postId = location.pathname.split("/")[2];
  //const {postId} = useParams();
  const { currentUser } = useContext(AuthContext);

    const fetchReviews = async (postId) => {
      try {
        const res = await axios.get(`/api/posts/getReviews/${postId}`);
        setReviews(res.data)
        return res.data;
      } catch (err) {
        console.log(err);
        return [];
      }
    }
    
  useEffect(() => {

    const fetchData = async () => {
      try {
        const res = await axios.get(`/posts/${postId}`);
        setPost(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
    checkSaved(currentUser.id, postId); // Überprüfung des gespeicherten Status hinzugefügt 
  }, [postId]);

    // Funktion zum Überprüfen, ob das Rezept gespeichert ist
    /* const checkSaved = async () => {
      try {
        const res = await axios.get(`/posts/${postId}/saved`);
        setIsSaved(res.data.saved);
      } catch (err) {
        console.log(err);
      }
    };
      fetchData();
      checkSaved();
    }, [postId]); */
    const checkSaved = (userId, postId) => {
      axios.get(`/isRecipeSaved?userId=${userId}&postId=${postId}`)
        .then(response => {
          const isSaved = response.data;
          setIsSaved(isSaved);
          // Aktualisieren Sie den Status des Rezepts basierend auf 'isSaved'
          // Zum Beispiel die Anzeige des richtigen Bildes (gespeichert oder nicht gespeichert)
        })
        .catch(error => {
          console.error("Error checking recipe saved status:", error);
        });
    };

   // Funktion zum Speichern oder Entfernen des Rezepts
   const toggleSaved = async () => {
    console.log("Button clicked");
    try {
      if (isSaved) {
        // Rezept entfernen
        await axios.delete(`/posts/${postId}/unsave`); //Unsave recipe
        console.log("Unsave Recipe button clicked");
        // Update saved state to indicate recipe is no longer saved
        setIsSaved(false); //Update isSaved state
      } else {
        // Rezept speichern
        await axios.post(`/posts/${postId}/save`, { postId: postId });
        console.log("Save Recipe button clicked");
        // Update saved state to indicate recipe is now saved
        setIsSaved(true);
      }
      // Status aktualisieren je nach save / unsave
      //setIsSaved(!isSaved);
    } catch (err) {
      console.log(err);
    }
  };


  const addReview = async () => {
    try {
      const review = {
        postId: postId,
        rating: rating,
        comment: comment
      };
      await axios.post(`/posts/${postId}/reviews`, review);
      // Nach dem Hinzufügen der Bewertung die Review-Daten neu abrufen
      await fetchReviews(postId); // Aktualisieren der Review-Liste
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`/posts/${postId}`);
      navigate("/")
    } catch (err) {
      console.log(err);
    }
  }

  const handleRating = async (value) => {
    try {
      // HTTP-Anfrage zum Aktualisieren der Bewertung senden
      await axios.put(`/posts/${postId}`, { rating: value });
      // Wenn die Anfrage erfolgreich ist, die Bewertung aktualisieren
      setRating(value);
      setHover(value); // Wert für Hover festlegen
    } catch (err) {
      console.log(err);
    }
  };

  //Funktion zum Hinzufügen eines Reviews
  // Funktion zum Hinzufügen eines Reviews


  const getText = (html) =>{
    const doc = new DOMParser().parseFromString(html, "text/html")
    return doc.body.textContent
  }


  return (
    <div className="single">
      <div className="content">
        <img src={`../upload/${post?.img}`} alt="" />
        <div className="user">
          {post.userImg && <img src={post.userImg} alt="" />}
          <div className="info">
            <span>{post.username}</span>
            <p>Posted {moment(post.date).fromNow()}</p>
          </div>
          {currentUser.username === post.username && (
            <div className="edit">
              <Link to={`/write?edit=2`} state={post}>
                <img src={Edit} alt="" />
              </Link>
              <img onClick={handleDelete} src={Delete} alt="" />
            </div>
          )}
          {/* Displaying save/unsave image */}
          <div className="edit">
            <img onClick= {toggleSaved} src={isSaved ? Unsave : Save} alt=""/>
          </div>
        </div>
        <h1>{post.title}</h1>
        {getText(post.comment)}
        
        {/* <p
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(post.comment),
          }}
        ></p>    */}   
        {/* Displaying Ingredients */}
        <div>
          <h2>Ingredients</h2>
          <ul>
            {post.ingr ? post.ingr.map((ingredient, index) => (
              <li key={index}>{ingredient.amount} {ingredient.unit} {ingredient.name}</li>
            )) : []}
          </ul>
        </div>

        {/* Adding review section */}
        <div className="add-review">
          <h2>Add Review</h2>
          {/* Hinzufügen von Code zum Eingeben von Bewertung und Kommentar */}
          <div className="rating">
            <h2>Rate this recipe</h2>
            {[...Array(5)].map((_, index) => {
              const currentRating = index + 1;
              return (
                <label key={index}>
                  <input
                    type="radio"
                    name="rating"
                    value={currentRating}
                    onClick={() => setRating(currentRating)}
                  />
                  <FaStar
                    className="star"
                    color={currentRating <= (hover || rating) ? "#ffc107" : "#e4e5e9"} 
                    onMouseEnter={() => setHover(currentRating)} 
                    onMouseLeave={() => setHover(null)} 
                  />
                </label>
              );
            })}
            <p>Your rating is {rating}</p>
          </div> 

          {/* Textarea zum Eingeben des Kommentars */}
          <textarea
            placeholder="Enter your review"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />

          {/* Button zum Hinzufügen eines Reviews */}
          <button onClick={addReview}>Submit Review</button>
      </div>
      {/* Displaying existing reviews */}
      <div className="reviews">
        <h2>Reviews:</h2>
        {reviews.length > 0 ? (
          reviews.map((review, index) => (
            <div key={index}>
              <p>Rating: {review.rating}</p>
              <p>{review.comment}</p>
            </div>
          ))
        ) : (
          <p>No reviews for this recipe</p>
        )}
        </div>

      </div>
      <Menu cat={post.cat}/>
    </div>
  );
};

export default Single;

  /* //Funktion zum Abrufen von Reviews
  useEffect(() => {
    const fetchReviews = async (postId) => {
      try {
          const res = await axios.get(`/api/post/getReviews/${postId}`);
          setReviews(res.data)
          return res.data;
      } catch (err) {
          console.log(err);
          return [];
      }
  }

    const fetchData = async () => {
      try {
          const res = await axios.get(`/posts/${postId}`);
          setPost(res.data);
          await fetchReviews(postId); // Abrufen von Reviews
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [postId]);

   //Funktion zum Abrufen von Reviews
  /* useEffect(() => {
    const fetchReviews = async () => {
      try {
          const res = await axios.get(`/api/post/getReviews/${postId}`);
          setReviews(res.data);
      } catch (err) {
          console.log(err);
      }
  };
  fetchReviews(); // Hier fetchReviews() anstelle von fetchData()
}, [postId]); */