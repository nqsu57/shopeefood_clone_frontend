import { Topping } from "../types/food"; 

export const calculateTotalPrice = (
    basePrice: number,
    selectedToppingIds: number[],
    toppings: Topping[],
    quantity: number
): number => {
    const toppingTotal = toppings
        ?.filter(t => selectedToppingIds.includes(t.id))
        .reduce((sum, t) => sum + t.price, 0) ?? 0;

    return (basePrice + toppingTotal) * quantity;
};
