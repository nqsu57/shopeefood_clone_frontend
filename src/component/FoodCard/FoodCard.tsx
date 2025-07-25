import style from './FoodCard.module.css'
import { Link } from 'react-router-dom';

interface Food {
  id: number;
  name: string;
  price: number;
  image: string;
}

const FoodCard = ({ food }: { food: Food }) => (
  <Link to={`/food/${food.id}`}>
    <div className={style.foodCard}>
      <img src={food.image} alt={food.name} />
      <div className={style.content}>
        <h3 className={style.title}>{food.name}</h3>
        <p>{food.price.toLocaleString()} VND</p>
      </div>
    </div>
  </Link>
);

export default FoodCard;
