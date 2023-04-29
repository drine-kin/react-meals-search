import { useGlobalContext } from "../context";

const Favourites = () => {
  const { favourites, selectMeal, removeFromFavourites } = useGlobalContext();
  return (
    <section className="favorites">
      <div className="favorites-content">
        <h5>Favourites</h5>
        <div className="favorites-container">
          {favourites.map((f) => {
            const { idMeal, strMeal: title, strMealThumb: image } = f;
            return (
              <div key={idMeal} className="favorite-item">
                <img
                  src={image}
                  alt={title}
                  className="favorites-img img"
                  onClick={() => selectMeal(idMeal, true)}
                />
                <button
                  className="remove-btn"
                  onClick={() => removeFromFavourites(idMeal)}
                >
                  Remove
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Favourites;
