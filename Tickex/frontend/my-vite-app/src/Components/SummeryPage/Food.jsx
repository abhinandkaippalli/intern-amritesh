import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { getFood, storeSelectedFood } from "../../Redux/food/actions";
import styles from "../Styling/Food.module.css";
import FoodCard from "./FoodCard";

const init = {
  all: true,
  combo: false,
  snacks: false,
  beverages: false,
  popcorn: false,
};

const Food = () => {
  const dispatch = useDispatch();
  const [filteredFood, setFilteredFood] = React.useState([]);
  const foods = useSelector((state) => state.food.foods);
  const [active, setActive] = React.useState(init);
  const [selectedFood, setSelectedFood] = React.useState([]);

  React.useEffect(() => {
    dispatch(getFood()); // Fetches food items from the backend
    setFilteredFood(foods);
    handleFilter("All");
  }, []);

  React.useEffect(() => {
    setFilteredFood(foods);
  }, [foods]);

  const handleFilter = (type) => {
    let updated = foods;
    switch (type) {
      case "CO":
        updated = foods.filter((item) => item.is_combo);
        setActive({
          ...active,
          combo: true,
          all: false,
          snacks: false,
          beverages: false,
          popcorn: false,
        });
        break;
      case "SN":
        updated = foods.filter((item) => item.is_snack);
        setActive({
          ...active,
          combo: false,
          all: false,
          snacks: true,
          beverages: false,
          popcorn: false,
        });
        break;
      case "BE":
        updated = foods.filter((item) => item.is_beverage);
        setActive({
          ...active,
          combo: false,
          all: false,
          snacks: false,
          beverages: true,
          popcorn: false,
        });
        break;
      case "PO":
        updated = foods.filter((item) => item.is_popcorn);
        setActive({
          ...active,
          combo: false,
          all: false,
          snacks: false,
          beverages: false,
          popcorn: true,
        });
        break;
      default:
        updated = foods;
        setActive({
          ...active,
          combo: false,
          all: true,
          snacks: false,
          beverages: false,
          popcorn: false,
        });
        break;
    }
    setFilteredFood(updated);
  };

  const handleCount = (id, val) => {
    const selected = filteredFood.map((item) =>
      item._id === id ? { ...item, count: (item.count || 0) + val } : item
    );
    const temp = selected.filter((item) => item.count > 0);
    setFilteredFood(selected);
    setSelectedFood(temp);
    dispatch(storeSelectedFood(temp)); // Updates selected food in the Redux state
  };

  console.log(selectedFood); // For debugging

  return (
    <div className={styles.container}>
      <img
        src="https://in.bmscdn.com/bmsin/fnb/offerbanner/web/web-offerbanner.jpg"
        alt="banner"
      />
      <div className={styles.wrapper}>
        <div>
          Grab a <a href="">bite!</a>
        </div>
        <span className={styles.span}>
          Prebook Your Meal and<span> Save More!</span>
        </span>
        <div className={styles.filters}>
          <span
            style={
              active.all
                ? { color: "white", background: "#F84464", border: "none" }
                : {}
            }
            onClick={() => handleFilter("ALL")}
          >
            ALL
          </span>
          <span
            style={
              active.combo
                ? { color: "white", background: "#F84464", border: "none" }
                : {}
            }
            onClick={() => handleFilter("CO")}
          >
            COMBOS
          </span>
          <span
            style={
              active.snacks
                ? { color: "white", background: "#F84464", border: "none" }
                : {}
            }
            onClick={() => handleFilter("SN")}
          >
            SNACKS
          </span>
          <span
            style={
              active.beverages
                ? { color: "white", background: "#F84464", border: "none" }
                : {}
            }
            onClick={() => handleFilter("BE")}
          >
            BEVERAGES
          </span>
          <span
            style={
              active.popcorn
                ? { color: "white", background: "#F84464", border: "none" }
                : {}
            }
            onClick={() => handleFilter("PO")}
          >
            POPCORN
          </span>
        </div>
        <div className={styles.cards}>
          {filteredFood?.map((item) => (
            <FoodCard {...item} key={item._id} handleCount={handleCount} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Food;
