import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import style from './FoodCard.module.css'
import { IoIosStar} from "react-icons/io";
import { FaCartPlus } from "react-icons/fa";


interface Restaurant {
    id: number;
    name: string;
    address: string;
}

interface FoodSize {
    id: number;
    name: string;
    price: number;
}


interface Food {
    id: number;
    name: string;
    image: string;
    description?: string;
    restaurant: Restaurant;
    price: number | null;
    sizes: FoodSize[];
    basePrice: number;
    toppings: {
        id: number;
        name: string;
        price: number;
    }[];

}

function FoodCardDetail() {
    const { id } = useParams<{ id: string }>();
    const [food, setFood] = useState<Food | null>(null);
    const [quantity, setQuantity] = useState(1)
    const [selectedSize, setSelectedSize] = useState<FoodSize | null>(null)
    const [selectedToppings, setSelectedToppings] = useState<number[]>([])
    const [price, setPrice] = useState<number>(0);
    // const [note, setNote] = useState("")


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
            // .then(res => setFood(res.data))
            .then(res => {
                console.log(res.data)  // 👈 kiểm tra dữ liệu
                setFood(res.data)
            })
            .catch(err => console.error(err));
    }, [id]);
    useEffect(() => {
        // Mặc định lấy size đầu tiên nếu có
        if (food?.sizes.length) {
            setSelectedSize(food.sizes[0]);
            setPrice(food.sizes[0].price);
        }
    }, [food]);

    if (!food) return <p className="p-4">Đang tải...</p>;

    const handleSizeChange = (size: FoodSize) => {
        setSelectedSize(size);
        const total = calculateTotalPrice(size.price, selectedToppings, quantity);
        setPrice(total);
    };
    const calculateTotalPrice = (sizePrice: number, toppingIds: number[], qty: number) => {
        const toppingPrice = food?.toppings
            .filter(topping => toppingIds.includes(topping.id))
            .reduce((sum, topping) => sum + topping.price, 0) || 0;

        return (sizePrice + toppingPrice) * qty;
    };
    const handleToppingChange = (toppingId: number) => {
        let updatedToppings: number[];

        if (selectedToppings.includes(toppingId)) {
            updatedToppings = selectedToppings.filter(id => id !== toppingId);
        } else {
            updatedToppings = [...selectedToppings, toppingId];
        }

        setSelectedToppings(updatedToppings);

        // Cập nhật giá sau khi chọn topping
        if (selectedSize) {
            const total = calculateTotalPrice(selectedSize.price, updatedToppings, quantity);
            setPrice(total);
        }
    };

    const handleQuantityChange = (delta: number) => {
        const newQty = Math.max(1, quantity + delta);
        setQuantity(newQty);
        if (selectedSize) {
            const total = calculateTotalPrice(selectedSize.price, selectedToppings, newQty);
            setPrice(total);
        }
    };

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
                        <StarRating />
                        {/* <span className={style.price}>{food.price}</span> */}
                        <div>
                            <h3>Chọn kích thước:</h3>
                            {food.sizes.map((size) => (
                                <div className={style.chooseOption}>
                                    <label key={size.id} style={{ marginRight: "1rem" }}>
                                        <input
                                            type="radio"
                                            name="size"
                                            checked={selectedSize?.id === size.id}
                                            onChange={() => handleSizeChange(size)}
                                        />
                                        {size.name}

                                    </label>
                                </div>
                            ))}
                        </div>

                        <h3>Chọn topping:</h3>
                        {food.toppings.map((topping) => (
                            <div className={style.chooseOption}>
                                <label key={topping.id} style={{ marginRight: "1rem" }}>
                                    <input
                                        type="checkbox"
                                        checked={selectedToppings.includes(topping.id)}
                                        onChange={() => handleToppingChange(topping.id)}
                                    />
                                    {topping.name} + {topping.price.toLocaleString()}đ
                                </label> </div>
                        ))}

                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <span style={{ fontWeight: 500 }}>Số Lượng</span>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                border: '1px solid #ccc',
                                borderRadius: '4px',
                                overflow: 'hidden',
                                width: '100px',
                                justifyContent: 'space-between'
                            }}>
                                <button
                                    onClick={() => handleQuantityChange(-1)}
                                    style={{
                                        border: 'none',
                                        background: 'transparent',
                                        width: '30px',
                                        cursor: 'pointer'
                                    }}
                                    disabled={quantity <= 1}
                                >
                                    –
                                </button>
                                <span style={{ width: '30px', textAlign: 'center' }}>{quantity}</span>
                                <button
                                    onClick={() => handleQuantityChange(1)}
                                    style={{
                                        border: 'none',
                                        background: 'transparent',
                                        width: '30px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    +
                                </button>
                            </div>
                        </div>



                        <h2>Giá: {price.toLocaleString()}đ</h2>
                        <div className={style.formCart}> 
                            <button className={style.addCart}> <FaCartPlus /> Thêm vào giỏ hàng</button> 
                            <button>Mua ngay</button>
                        </div>
                    </div>

                </div>
            </div>
        </>
    )
}

export default FoodCardDetail;