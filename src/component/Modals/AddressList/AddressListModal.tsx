import { useEffect, useState } from 'react';
import axios from 'axios';
import AddressModal from '../AddAddressModal';
import styles from './AddressListModal.module.css';
import { Address, Province, District, Ward } from '../../../types/address';

interface Props {
    currentAddressId: number | null;
    onClose: () => void;
    onConfirm: (addr: Address) => void;
}

export default function AddressListModal({ currentAddressId, onClose, onConfirm }: Props) {
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [selectedId, setSelectedId] = useState<number | null>(currentAddressId);
    const [editingAddress, setEditingAddress] = useState<Address | null>(null);
    const [provinces, setProvinces] = useState<Province[]>([]);
    const [districts, setDistricts] = useState<District[]>([]);
    const [wards, setWards] = useState<Ward[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);


    const fetchAddresses = async () => {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:8000/api/address", {
            headers: { Authorization: `Bearer ${token}` }
        });
        setAddresses(res.data);
    };

    useEffect(() => {
        fetchAddresses();
        axios.get("http://localhost:8000/api/provinces").then(res => setProvinces(res.data));
    }, []);

    const handleConfirmAddress = async (data: {
        recipient_name: string;
        phone_number: string;
        address_line: string;
        province_id: number;
        district_id: number;
        ward_id: number;
        label: string;
        is_default: boolean;
    }) => {
        const token = localStorage.getItem("token");

        const res = editingAddress
            ? await axios.put<Address>(
                `http://localhost:8000/api/address/${editingAddress.id}`,
                data,
                { headers: { Authorization: `Bearer ${token}` } }
            )
            : await axios.post<Address>(
                `http://localhost:8000/api/address`,
                data,
                { headers: { Authorization: `Bearer ${token}` } }
            );

        const updatedAddresses = addresses.map((addr) =>
            res.data.is_default ? { ...addr, is_default: false } : addr
        );

        const newAddresses = editingAddress
            ? updatedAddresses.map((addr) =>
                addr.id === editingAddress.id ? res.data : addr
            )
            : [...updatedAddresses, res.data];

        console.log("res.data trước khi set & return:", res.data);

        setAddresses(
            newAddresses.sort(
                (a, b) => Number(b.is_default) - Number(a.is_default)
            )
        );

        setIsModalOpen(false);
        setEditingAddress(null);
        // console.log("API response:", res);
        // console.log("API response.data:", res.data);
        return res.data;
    };



    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <h3>Chọn địa chỉ giao hàng</h3>

                <div className={styles.list}>
                    {addresses.map(addr => (
                        <div key={addr.id} className={styles.item}>
                            <div className={styles.address_option}>
                                <input
                                    type="radio"
                                    checked={addr.id === selectedId}
                                    onChange={() => setSelectedId(addr.id)}
                                />
                                <span> {addr.recipient_name} | {addr.phone_number} </span>
                                <div >
                                    <button onClick={async () => {
                                        const token = localStorage.getItem("token");
                                        const districtsRes = await axios.get(`http://localhost:8000/api/provinces/${addr.province.id}/districts`, { headers: { Authorization: `Bearer ${token}` } });
                                        const wardsRes = await axios.get(`http://localhost:8000/api/districts/${addr.district.id}/wards`, { headers: { Authorization: `Bearer ${token}` } });
                                        setDistricts(districtsRes.data);
                                        setWards(wardsRes.data);
                                        setEditingAddress(addr);
                                    }}>Edit</button>
                                </div>
                            </div>

                            <div>
                                <span>
                                    {addr.address_line}, {addr.ward.name}, {addr.district.name}, {addr.province.name}
                                </span>
                            </div>


                        </div>
                    ))}
                </div>

                <div className={styles.actions}>
                    <button
                        disabled={!selectedId}
                        className={styles.saveBtn}
                        onClick={() => {
                            const selected = addresses.find(a => a.id === selectedId);
                            if (selected) onConfirm(selected);
                        }}
                    >
                        Confirm
                    </button>
                    <button onClick={onClose} className={styles.cancelBtn}>Cancel</button>

                </div>

                {editingAddress && (
                    <AddressModal
                        isOpen={!!editingAddress}
                        onClose={() => setEditingAddress(null)}
                        onSave={handleConfirmAddress}
                        initialData={{
                            recipient_name: editingAddress.recipient_name,
                            phone_number: editingAddress.phone_number,
                            address_line: editingAddress.address_line,
                            province_id: editingAddress.province.id,
                            district_id: editingAddress.district.id,
                            ward_id: editingAddress.ward.id,
                            label: editingAddress.label,
                            is_default: editingAddress.is_default
                        }}
                        provinces={provinces}
                        districts={districts}
                        wards={wards}
                        title="Edit Address"
                    />
                )}
            </div>
        </div>
    );
}
