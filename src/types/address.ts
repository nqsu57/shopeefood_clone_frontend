export interface Province {
  id: number;
  name: string;
}

export interface District {
  id: number;
  name: string;
}

export interface Ward {
  id: number;
  name: string;
}

export interface Address {
  id: number;
  recipient_name: string;
  phone_number: string;
  address_line: string;
  label?: string;
  is_default: boolean;

  province: Province;
  district: District;
  ward: Ward;
}