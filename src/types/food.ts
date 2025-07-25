export interface Restaurant {
    id: number;
    name: string;
    address: string;
}

export interface FoodSize {
    id: number;
    name: string;
    price: number;
}

export interface Topping {
    id: number;
    name: string;
    price: number;
}

export interface Food {
    id: number;
    name: string;
    image: string;
    description?: string;
    restaurant: Restaurant;
    price: number;
    sizes: FoodSize[];
    basePrice: number;
    toppings: Topping[];
}