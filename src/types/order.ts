export interface OrderItem {
  foodName: string;
  image: string;
  size?: string;
  toppings: string[];
  quantity: number;
  price: number;
}

export interface Order {
  orderID: string;
  restaurant: string;
  restaurantAddress: string;
  userName: string;
  userPhone: string;
  userAddress: string;
  createdAt: string;
  status: string;
  total: number;
  shippingFee: number;
  items: OrderItem[];
}
