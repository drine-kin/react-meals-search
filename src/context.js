import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";

const AppContext = createContext();

const allMealsURL = "https://www.themealdb.com/api/json/v1/1/search.php?s=";

const randomMealURL = "https://www.themealdb.com/api/json/v1/1/random.php";

const getFavouritesFromLocalStorage = () => {
  let favourites = localStorage.getItem("favourites");
  if (favourites) {
    favourites = JSON.parse(favourites);
  } else {
    favourites = [];
  }

  return favourites;
};

const AppProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [meals, setMeals] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState(null);

  const [favourites, setFavourites] = useState(getFavouritesFromLocalStorage());

  const fetchMeals = async (url) => {
    setLoading(true);
    try {
      const { data } = await axios(url);
      if (data.meals) {
        setMeals(data.meals);
      } else {
        setMeals([]);
      }
    } catch (error) {
      console.log(error.response);
    }
    setLoading(false);
  };

  const fetchRandomMeal = () => {
    fetchMeals(randomMealURL);
  };

  const selectMeal = (idMeal, favouriteMeal) => {
    let meal;
    if (favouriteMeal) {
      meal = favourites.find((m) => m.idMeal === idMeal);
    } else {
      meal = meals.find((m) => m.idMeal === idMeal);
    }

    //console.log(meal);
    setSelectedMeal(meal);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const addToFavourites = (idMeal) => {
    const meal = meals.find((m) => m.idMeal === idMeal);
    const alreadyFavourite = favourites.find((f) => f.idMeal === idMeal);
    if (alreadyFavourite) return;
    const updateFavourites = [...favourites, meal];
    setFavourites(updateFavourites);
    localStorage.setItem("favourites", JSON.stringify(updateFavourites));
  };

  const removeFromFavourites = (idMeal) => {
    const updatedFavourites = favourites.filter((f) => f.idMeal !== idMeal);
    setFavourites(updatedFavourites);
    localStorage.setItem("favourites", JSON.stringify(updatedFavourites));
  };

  useEffect(() => {
    fetchMeals(allMealsURL);
  }, []);

  useEffect(() => {
    if (!searchTerm) return;
    fetchMeals(`${allMealsURL}${searchTerm}`);
  }, [searchTerm]);

  return (
    <AppContext.Provider
      value={{
        loading,
        meals,
        setSearchTerm,
        fetchRandomMeal,
        showModal,
        selectMeal,
        selectedMeal,
        closeModal,
        favourites,
        addToFavourites,
        removeFromFavourites,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useGlobalContext = () => {
  return useContext(AppContext);
};

export { AppContext, AppProvider };
