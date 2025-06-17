// import { mockFoods } from "../../data/mockFoods";
import FoodCard from "../../component/FoodCard/FoodCard";
import style from "./Home.module.css";
import { useEffect, useState } from "react";
import axios from "axios";

interface Food {
  id: number;
  name: string;
  price: number;
  image: string;
}

function Home() {
  const [foods, setFoods] = useState<Food[]>([]);

  useEffect(() => {
    axios.get("http://localhost:8000/api/foods")
      .then(res => setFoods(res.data))
      .catch(err => console.error("Failed to fetch foods:", err));
  }, []);
  return (
    <>
      <div className={style.container}>
        <div className={style.listItem}>
          {foods.map((food) => (
            <FoodCard key={food.id} food={food} />
          ))}
        </div>
      </div>

    </>
  );
}

export default Home;