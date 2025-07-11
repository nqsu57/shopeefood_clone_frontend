import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import styles from './OrderPage.module.css';
import { CiLocationOn } from "react-icons/ci";
import { CartItemOut } from "../../types/cart";
import AddressListModal from '../../component/Modals/AddressList/AddressListModal';
import {User, Address} from '../../types/user';


function OrderPage() {
    const [user, setUser] = useState<User | null>(null);
    const [cartItems, setCartItems] = useState<CartItemOut[]>([]);
    const [paymentMethod, setPaymentMethod] = useState<string>('COD');
    const shippingFee = 25000;
    const [showAddressModal, setShowAddressModal] = useState(false);
    const [currentAddress, setCurrentAddress] = useState<Address | null>(null);

    const calculateItemTotal = (item: CartItemOut) => {
        const toppingTotal = item.toppings?.reduce((sum, t) => sum + t.price, 0) || 0;
        const basePrice = item.selected_size?.price || item.food.price || 0;
        return (basePrice + toppingTotal) * item.quantity;
    };

    const totalProductPrice = cartItems.reduce(
        (sum, item) => sum + calculateItemTotal(item),
        0
    );
    const totalPayment = totalProductPrice + shippingFee;

    useEffect(() => {
        axios.get("http://localhost:8000/api/get_user", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        })
            .then(res => {
                setUser(res.data);
                setCurrentAddress(res.data.default_address);
                console.log('default', res.data.default_address);
            })
            .catch(err => {
                console.error("Lỗi lấy thông tin user", err);
            });
    }, []);

    useEffect(() => {
        axios
            .get("http://localhost:8000/api/cart", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            })
            .then(res => {
                console.log("Cart data:", res.data);
                setCartItems(res.data);
            })
            .catch(err => console.error("Failed to fetch cart", err));
    }, []);
    const handlePlaceOrder = async () => {
        try {
            const payload = {
                items: cartItems.map(item => ({
                    cart_item_id: item.id
                })),
                payment_method: paymentMethod,
                shipping_fee: shippingFee,
                note: ""
            };

            const res = await axios.post(
                "http://localhost:8000/api/order",
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                }
            );

            alert("Đặt hàng thành công!");
            // Sau khi đặt hàng có thể redirect về trang home hoặc profile
            window.location.href = "/";
        } catch (error) {
            console.error("Đặt hàng thất bại", error);
            alert("Đặt hàng thất bại. Vui lòng thử lại.");
        }
    };


    return (
        <>
            <div className={styles.orderContainer}>
                <div className={styles.addressSection}>
                    <div className={styles.addressHeader}>
                        <CiLocationOn />
                        <h2>Địa chỉ nhận hàng</h2>
                    </div>
                    {/* <div >
                        {user ? (
                            <div>
                                {user?.default_address ? (
                                    <div className={styles.addressInfo}>
                                        <span>{user.default_address.recipient_name}</span>
                                        <span>{user.default_address.phone_number}</span>
                                        <span>
                                            {user.default_address.address_line}, {user.default_address.ward.name}, {user.default_address.district.name}, {user.default_address.province.name}
                                        </span>
                                        <span className={styles.defaultBadge}>Default</span>
                                        <button onClick={() => setShowAddressModal(true)} className={styles.changeBtn}>Change</button>

                                    </div>
                                ) : (
                                    <p>Vui lòng chọn địa chỉ giao hàng</p>
                                )}

                            </div>
                        ) : (
                            <p>Vui lòng đăng nhập</p>
                        )}
                    </div> */}
                    <div>
                        {currentAddress ? (
                            <div className={styles.addressInfo}>
                                <span>{currentAddress.recipient_name}</span>
                                <span>{currentAddress.phone_number}</span>
                                <span>
                                    {currentAddress.address_line}, {currentAddress.ward.name}, {currentAddress.district.name}, {currentAddress.province.name}
                                </span>
                                {currentAddress.is_default && <span className={styles.defaultBadge}>Default</span>}
                                <button onClick={() => setShowAddressModal(true)} className={styles.changeBtn}>Change</button>
                            </div>
                        ) : (
                            <p>Vui lòng chọn địa chỉ giao hàng</p>
                        )}
                    </div>
                </div>

                <div className={styles.productSection}>
                    <div className={styles.productHeader}>
                        <span>Sản phẩm</span>
                        <span></span>
                        <span>Số lượng</span>
                        <span>Thành tiền</span>
                    </div>

                    {cartItems.map(item => {
                        const toppingTotal = item.toppings?.reduce((s, t) => s + t.price, 0) || 0;
                        const basePrice = item.selected_size?.price || item.food.price || 0;
                        const itemTotal = (basePrice + toppingTotal) * item.quantity;

                        return (
                            <div className={styles.productRow} key={item.id}>
                                <div className={styles.productInfo}>
                                    <img src={item.food.image} alt={item.food.name} />
                                    <h4>{item.food.name}</h4>
                                </div>

                                <div className={styles.detailInfo}>
                                    <p>{item.selected_size?.name || ""}</p>
                                    <p>
                                        {item.toppings?.length
                                            ? item.toppings.map(t => t.name).join(", ")
                                            : ""}
                                    </p>
                                    <p>{item.note || ""}</p>
                                </div>

                                <div className={styles.quantity}>
                                    {item.quantity}
                                </div>

                                <div className={styles.total}>
                                    {itemTotal.toLocaleString()}₫
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className={styles.shippingSection}>
                    <h3>Phương thức thanh toán</h3>
                    <div className={styles.paymentMethods}>
                        <button
                            className={`${styles.paymentButton} ${paymentMethod === 'ShopeePay' ? styles.paymentButtonActive : ''
                                }`}
                            onClick={() => setPaymentMethod('ShopeePay')}
                        >
                            Ví ShopeePay
                        </button>

                        <button
                            className={`${styles.paymentButton} ${paymentMethod === 'CreditCard' ? styles.paymentButtonActive : ''
                                }`}
                            onClick={() => setPaymentMethod('CreditCard')}
                            disabled
                        >
                            Thẻ Tín dụng/Ghi nợ
                        </button>

                        <button
                            className={`${styles.paymentButton} ${paymentMethod === 'COD' ? styles.paymentButtonActive : ''
                                }`}
                            onClick={() => setPaymentMethod('COD')}
                        >
                            Thanh toán khi nhận hàng
                        </button>
                    </div>

                </div>

                <div className={styles.summaryPrice}>
                    <div>
                        <span>Tổng tiền hàng</span>
                        <span>{totalProductPrice.toLocaleString()}₫</span>
                    </div>
                    <div>
                        <span>Phí vận chuyển</span>
                        <span>{shippingFee.toLocaleString()}₫</span>
                    </div>
                    <div className={styles.total}>
                        <strong>Tổng thanh toán</strong>
                        <strong>{totalPayment.toLocaleString()}₫</strong>
                    </div>
                </div>
                <div className={styles.orderSection}>
                    <p>
                        Nhấn "Đặt hàng" đồng nghĩa với việc bạn đồng ý tuân theo
                        <a href='https://shopeefood.vn/terms-of-service'>
                            Điều khoản ShopeeFood
                        </a>
                    </p>
                    <button className={styles.orderButton} onClick={handlePlaceOrder}>
                        Đặt hàng
                    </button>
                </div>
            </div>
            {showAddressModal && (
                <AddressListModal
                    currentAddressId={currentAddress?.id || null}
                    onClose={() => setShowAddressModal(false)}
                    onConfirm={(addr) => {
                        setCurrentAddress(addr);
                        setShowAddressModal(false);
                    }}
                />
            )}
        </>
    );
};
export default OrderPage;