import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import style from './FoodCard.module.css'
import { IoIosStar } from "react-icons/io";

interface Restaurant {
    id: number;
    name: string;
    address: string;
}

interface Food {
    id: number;
    name: string;
    price: number;
    image: string;
    description?: string;
    restaurant: Restaurant;
}

function FoodCardDetail() {
    // const { id } = useParams();
    // const [food, setFood] = useState(null);
    const { id } = useParams<{ id: string }>();
    const [food, setFood] = useState<Food | null>(null);

    const StarRating = () => {
        return (
            <div>
                {[...Array(5)].map((_, index) => (
                    <IoIosStar key={index} color="#facc15" size={24} />
                ))}
            </div>
        );
    };

    useEffect(() => {
        axios.get(`http://localhost:8000/api/food/${id}`)
            .then(res => setFood(res.data))
            .catch(err => console.error(err));
    }, [id]);

    if (!food) return <p className="p-4">Đang tải...</p>;

    return (
        <>
            <div className={style.containerCard}>
                <div className={style.detailLeft}>
                    <img src={food.image} alt={food.name} className="w-full h-60 object-cover rounded" />
                </div>
                <div className={style.detailRight}>
                    <div className={style.detailCard}>
                        <h2>{food.name}</h2>
                        <p>{food.restaurant.address}</p>
                        <StarRating/>
                        {/* <span className={style.price}>{food.price}</span> */}
                        <p className={style.price}>{food.price.toLocaleString()} VNĐ</p>
                        <p>{food.description || "Đang cập nhật"}</p>                        <p>{food.description || "Đang cập nhật"}</p>
                        <p>{food.description || "Đang cập nhật"}</p>
                        <p>{food.description || "Đang cập nhật"}</p>
                        <p>{food.description || "Đang cập nhật"}</p>
                        <p>{food.description || "Đang cập nhật"}</p>
                        <p>{food.description || "Đang cập nhật"}</p>
                        <p>{food.description || "Đang cập nhật"}</p>
                        <p>{food.description || "Đang cập nhật"}</p>
                        <p>{food.description || "Đang cập nhật"}</p>

                    </div>
                </div>
            </div>
        </>
    )
}

export default FoodCardDetail;