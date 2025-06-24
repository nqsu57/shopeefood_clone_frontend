export interface FoodInfo {
    id: number;
    name: string;
    image?: string;
    price?: number;
}

export interface SizeInfo {
    id: number;
    name: string;
    price: number;
}

export interface ToppingInfo {
    id: number;
    name: string;
    price: number;
}

// export interface CartItemOut {
//     id: number;
//     quantity: number;
//     note?: string;
//     food: {
//         id: number;
//         name: string;
//         image?: string;
//         price?: number;
//     };
//     selected_size?: {
//         id: number;
//         name: string;
//         price: number;
//     };
//     toppings_list?: {
//         id: number;
//         name: string;
//         price: number;
//     }[];
// }


export interface CartItemOut {
    id: number;
    quantity: number;
    note?: string;
    food: FoodInfo;
    selected_size?: SizeInfo;
    toppings_list?: ToppingInfo[];
}

