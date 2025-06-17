import style from './FoodCard.module.css'

interface Food {
  id: number;
  name: string;
  price: number;
  image: string;
}

const FoodCard = ({ food }: { food: Food }) => (
  <div className={style.foodCard}>
    <img src={food.image} alt={food.name} />
    <div className={style.content}>
      <h3 className={style.title}>{food.name}</h3>
      <p>{food.price.toLocaleString()} VND</p>
    </div>

  </div>
);

export default FoodCard;
