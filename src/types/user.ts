export interface Address {
    id: number;
    recipient_name: string;
    phone_number: string;
    address_line: string;
    label?: string;
    is_default: boolean;
    province: { id: number; name: string };
    district: { id: number; name: string };
    ward: { id: number; name: string };
}


export interface User {
    id: number;
    name: string;
    phone: string;
    email: string;
    gender: string;
    avatar_url?: string;
    default_address?: Address;
    role: string;
    is_verified: boolean;
    driver_profile?: any;
    restaurant_profile?: any;
    addresses: Address[];

}