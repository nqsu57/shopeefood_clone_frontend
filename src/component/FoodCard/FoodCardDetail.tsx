import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import style from './FoodCard.module.css';
import { IoIosStar } from "react-icons/io";
import { FaCartPlus } from "react-icons/fa";
import { Food, FoodSize, Topping } from '../../types/food';
import { toast } from 'react-toastify';

const ClearCartModal = ({
    isOpen,
    onConfirm,
    onCancel,
    existingRestaurant,
    newRestaurant,
}: {
    isOpen: boolean;
    onConfirm: () => void;
    onCancel: () => void;
    existingRestaurant: { id: number; name: string } | null;
    newRestaurant: { id: number; name: string } | null;
}) => {
    if (!isOpen) return null;
    return (
        <div className={style.modalOverlay}>
            <div className={style.modal}>
                <h3>Xác nhận xóa giỏ hàng</h3>
                <p>
                    Giỏ hàng hiện chứa món từ nhà hàng <strong>{existingRestaurant?.name}</strong>.
                    Bạn có muốn xóa giỏ hàng để thêm món từ nhà hàng <strong>{newRestaurant?.name}</strong>?
                </p>
                <div className={style.modalButtons}>
                    <button onClick={onConfirm} className={style.confirmButton}>OK</button>
                    <button onClick={onCancel} className={style.cancelButton}>Hủy</button>
                </div>
            </div>
        </div>
    );
};

function FoodCardDetail() {
    const { id } = useParams<{ id: string }>();
    const [food, setFood] = useState<Food | null>(null);
    const [quantity, setQuantity] = useState(1);
    const [selectedSize, setSelectedSize] = useState<{ id: number; name: string; price: number } | null>(null);
    const [selectedToppings, setSelectedToppings] = useState<number[]>([]);
    const [price, setPrice] = useState<number>(0);
    const [note, setNote] = useState("");
    const [isAdding, setIsAdding] = useState(false);
    const [showClearCartModal, setShowClearCartModal] = useState(false);
    const [cartConflict, setCartConflict] = useState<{
        existing_restaurant: { id: number; name: string };
        new_restaurant: { id: number; name: string };
    } | null>(null);
    const [cartItems, setCartItems] = useState<any[]>([]);
    const [isLoadingCart, setIsLoadingCart] = useState(false);

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
        if (selectedSize) {
            const total = calculateTotalPrice(selectedSize.price, updatedToppings, quantity);
            setPrice(total);
        }
    };

    const handleQuantityChange = (delta: number) => {
        const newQty = Math.max(1, quantity + delta);
        setQuantity(newQty);
        const basePrice = selectedSize ? selectedSize.price : food?.price ?? 0;
        const total = calculateTotalPrice(basePrice, selectedToppings, newQty);
        setPrice(total);
    };

    const fetchCart = async () => {
        setIsLoadingCart(true);
        try {
            const res = await fetch("http://localhost:8000/api/cart", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            if (!res.ok) throw new Error("Lỗi khi tải giỏ hàng");
            const data = await res.json();
            console.log("Fetched cart items:", data);
            setCartItems(data);
            return data;
        } catch (err) {
            console.error('Failed to load cart', err);
        } finally {
            setIsLoadingCart(false);
        }
    };

    const clearCart = async () => {
        try {
            const res = await fetch("http://localhost:8000/api/cart/confirm-clear", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Lỗi khi xóa giỏ hàng");
            setCartItems([]);
            return data.message || "Giỏ hàng đã được xóa, bạn có thể thêm món ăn mới từ nhà hàng khác.";
        } catch (err) {
            console.error('Failed to clear cart', err);
            throw err;
        }
    };

    const addToCart = async (data: {
        food_id: number;
        quantity: number;
        selected_size_id?: number;
        topping_ids?: number[];
        note?: string;
        clear_cart?: boolean;
    }) => {
        const token = localStorage.getItem("token");
        if (!token) {
            throw new Error("Vui lòng đăng nhập để thêm vào giỏ hàng.");
        }
        try {
            const res = await fetch("http://localhost:8000/api/cart/add", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(data),
            });
            const responseData = await res.json();
            console.log("API response:", responseData);
            if (res.status === 409) {
                if (responseData.clear_cart_required && responseData.existing_restaurant && responseData.new_restaurant) {
                    setCartConflict({
                        existing_restaurant: responseData.existing_restaurant,
                        new_restaurant: responseData.new_restaurant,
                    });
                    setShowClearCartModal(true);
                }
                return { status: res.status, data: null };
            }
            if (!res.ok) {
                throw new Error(responseData.detail || "Lỗi khi thêm vào giỏ hàng");
            }
            return { status: res.status, data: responseData };
        } catch (err) {
            console.error("Add to cart error:", err);
            throw err;
        }
    };

    const fetchExistingRestaurant = async (foodId: number) => {
        try {
            const res = await axios.get(`http://localhost:8000/api/food/${foodId}`);
            const foodData = res.data;
            console.log("Fetched existing food:", foodData); // Debug
            return { id: foodData.restaurant.id, name: foodData.restaurant.name };
        } catch (err) {
            console.error('Failed to fetch food details', err);
            return null;
        }
    };

    const handleAddToCart = async (clearCart: boolean = false) => {
        if (!food || isLoadingCart) return;

        setIsAdding(true);
        const currentCart = await fetchCart(); // Đảm bảo fetchCart hoàn tất

        const newRestaurantId = food.restaurant.id;
        let existingRestaurantId = null;
        let existingRestaurantName = 'Unknown Restaurant';

        if (currentCart.length > 0) {
            const existingFoodId = currentCart[0].food.id;
            const existingRestaurant = await fetchExistingRestaurant(existingFoodId);
            if (existingRestaurant) {
                existingRestaurantId = existingRestaurant.id;
                existingRestaurantName = existingRestaurant.name;
            }
        }

        if (existingRestaurantId && existingRestaurantId !== newRestaurantId && !clearCart) {
            setCartConflict({
                existing_restaurant: { id: existingRestaurantId, name: existingRestaurantName },
                new_restaurant: { id: newRestaurantId, name: food.restaurant.name },
            });
            setShowClearCartModal(true);
            setIsAdding(false);
            return;
        }

        const data = {
            food_id: food.id,
            quantity: quantity,
            selected_size_id: selectedSize?.id,
            topping_ids: selectedToppings,
            note: note,
            clear_cart: clearCart,
        };
        try {
            const result = await addToCart(data);
            if (result.status === 200 && result.data) {
                toast.success("Thêm vào giỏ hàng thành công!");
                setTimeout(() => {
                    window.location.reload();
                }, 1000); 
            } else if (result.status === 409) {
            }
        } catch (err: any) {
            toast.error(err.message || "Có lỗi xảy ra khi thêm vào giỏ hàng.");
            console.error(err);
        } finally {
            setIsAdding(false);
        }
    };


    const handleClearCartConfirm = async () => {
        setShowClearCartModal(false);
        setIsAdding(true);
        try {
            const message = await clearCart();
            toast.success(message);
            await handleAddToCart(true); // Add new item after clearing cart
        } catch (err: any) {
            toast.error(err.message || "Có lỗi xảy ra khi xóa giỏ hàng.");
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
                            <button
                                className={style.addCart}
                                onClick={() => handleAddToCart()}
                                disabled={isAdding || isLoadingCart}
                            >
                                <FaCartPlus /> {isAdding ? "Đang thêm..." : "Thêm vào giỏ hàng"}
                            </button>
                            {/* <button className={style.order}>Mua ngay</button> */}
                        </div>
                    </div>
                </div>
            </div>
            <ClearCartModal
                isOpen={showClearCartModal}
                onConfirm={handleClearCartConfirm}
                onCancel={() => setShowClearCartModal(false)}
                existingRestaurant={cartConflict?.existing_restaurant || null}
                newRestaurant={cartConflict?.new_restaurant || null}
            />
        </>
    );
}

export default FoodCardDetail;