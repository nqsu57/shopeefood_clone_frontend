import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import style from './FoodCard.module.css'
import { IoIosStar } from "react-icons/io";
import { FaCartPlus } from "react-icons/fa";
import {Food, FoodSize, Topping } from '../../types/food';

function FoodCardDetail() {
    const { id } = useParams<{ id: string }>();
    const [food, setFood] = useState<Food | null>(null);
    const [quantity, setQuantity] = useState(1)
    const [selectedSize, setSelectedSize] = useState<{ id: number; name: string; price: number } | null>(null);
    const [selectedToppings, setSelectedToppings] = useState<number[]>([])
    const [price, setPrice] = useState<number>(0);
    const [note, setNote] = useState("")
    const [isAdding, setIsAdding] = useState(false);

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
            .then(res => {
                const foodData = res.data;
                console.log("Fetched food:", foodData);
                setFood(foodData);

                if (foodData.sizes && foodData.sizes.length > 0) {
                    setSelectedSize(foodData.sizes[0]);
                    setPrice(foodData.sizes[0].price);
                    console.log("Set price from size:", foodData.sizes[0].price);
                } else {
                    setSelectedSize(null);
                    setPrice(foodData.price ?? 0);
                    console.log("Set base price:", foodData.price);
                }
            })
            .catch(err => console.error(err));
    }, [id]);


    if (!food) return <p className="p-4">Đang tải...</p>;

    const handleSizeChange = (size: FoodSize) => {
        setSelectedSize(size);
        const total = calculateTotalPrice(size.price, selectedToppings, quantity);
        setPrice(total);
    };

    const calculateTotalPrice = (
        basePrice: number,
        selectedToppingIds: number[],
        quantity: number
    ): number => {
        const toppingTotal = food?.toppings
            ?.filter(t => selectedToppingIds.includes(t.id))
            .reduce((sum, t) => sum + t.price, 0) ?? 0;

        return (basePrice + toppingTotal) * quantity;
    };

    const handleToppingChange = (toppingId: number) => {
        let updatedToppings: number[];

        if (selectedToppings.includes(toppingId)) {
            updatedToppings = selectedToppings.filter(id => id !== toppingId);
        } else {
            updatedToppings = [...selectedToppings, toppingId];
        }

        setSelectedToppings(updatedToppings);

        // Update price when choose topping
        if (selectedSize) {
            const total = calculateTotalPrice(selectedSize.price, updatedToppings, quantity);
            setPrice(total);
        }
    };

    const handleQuantityChange = (delta: number) => {
        const newQty = Math.max(1, quantity + delta);
        setQuantity(newQty);
        const basePrice = selectedSize
            ? selectedSize.price
            : food?.price ?? 0;

        const total = calculateTotalPrice(basePrice, selectedToppings, newQty);
        setPrice(total);
    };

    const addToCart = async (data: {
        food_id: number;
        quantity: number;
        selected_size_id?: number;
        topping_ids?: number[];
        note?: string;
    }) => {
        const token = localStorage.getItem("token");
        return await fetch("http://localhost:8000/api/cart/add", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: token ? `Bearer ${token}` : "",
            },
            body: JSON.stringify(data),

        });
    };

    const handleAddToCart = async () => {
        if (!food) return;
        setIsAdding(true);
        const data = {
            food_id: food.id,
            quantity: quantity,
            selected_size_id: selectedSize?.id,
            topping_ids: selectedToppings,
            note: note,
        };
        try {
            const res = await addToCart(data);
            console.log("Data", res);
            if (res.ok) {
                alert("Thêm vào giỏ hàng thành công!");
            } else {
                const error = await res.json();
                alert(`Lỗi: ${error.detail}`);
            }
        } catch (err) {
            alert("Có lỗi xảy ra khi thêm vào giỏ hàng.");
            console.error(err);
        } finally {
            setIsAdding(false);
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

                        {food.sizes.length > 0 && (
                            <div>
                                <h3>Chọn kích thước:</h3>
                                <div className={style.chooseSize}>
                                    {food.sizes.map((size) => (
                                        <label key={size.id}>
                                            <input
                                                type="radio"
                                                name="size"
                                                checked={selectedSize?.id === size.id}
                                                onChange={() => handleSizeChange(size)}
                                            />
                                            {size.name}
                                        </label>
                                    ))}
                                </div>
                            </div>
                        )}

                        {food.toppings.length > 0 && (
                            <div>
                                <h3>Chọn topping:</h3>
                                {food.toppings.map((topping) => (
                                    <div key={topping.id} className={style.chooseOption}>
                                        <label className={style.toppingLabel}>
                                            <input
                                                type="checkbox"
                                                checked={selectedToppings.includes(topping.id)}
                                                onChange={() => handleToppingChange(topping.id)}
                                            />
                                            {topping.name}
                                        </label>
                                        <span className={style.toppingPrice}>
                                            + {topping.price.toLocaleString()}đ
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className={style.quantityControl}>
                            <span>Số Lượng</span>
                            <div className={style.quantityBox}>
                                <button onClick={() => handleQuantityChange(-1)} disabled={quantity <= 1}>
                                    –
                                </button>
                                <span style={{ width: '30px', textAlign: 'center' }}>{quantity}</span>
                                <button onClick={() => handleQuantityChange(1)}>
                                    +
                                </button>
                            </div>
                        </div>
                        <div>
                            <h3>Ghi chú:</h3>
                            <textarea
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                                placeholder="📝 Thêm ghi chú"
                                rows={4}
                                className={style.note}
                            />
                        </div>

                        <h2>Tạm tính: {price.toLocaleString()}đ</h2>
                        <div className={style.formCart}>
                            <button className={style.addCart} onClick={handleAddToCart}> <FaCartPlus /> Thêm vào giỏ hàng</button>
                            <button className={style.order}>Mua ngay</button>
                        </div>
                    </div>

                </div>
            </div>
        </>
    )
}

export default FoodCardDetail;