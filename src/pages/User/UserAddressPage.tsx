import { useEffect, useState } from 'react';
import axios from 'axios';
import UserSidebar from '../../component/SideBar/Sidebar';
import styles from './UserAddress.module.css';
import AddressModal from '../../component/Modals/AddAddressModal';
import { Province, District, Ward, Address } from '../../types/address';

type EditingAddress = Address & {
    province_id: number;
    district_id: number;
    ward_id: number;
    districts: District[];
    wards: Ward[];
};

function AddressUserPage() {

    const [user, setUser] = useState({
        id: '',
        name: '',
        phone: '',
        email: '',
        avatar_url: '',
    });
    const [provinces, setProvinces] = useState<Province[]>([]);
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAddress, setEditingAddress] = useState<EditingAddress | null>(null);
    // const handleAddAddress = async (data: {
    //     recipient_name: string;
    //     phone_number: string;
    //     address_line: string;
    //     province_id: number;
    //     district_id: number;
    //     ward_id: number;
    //     label: string;
    // }) => {
    //     const token = localStorage.getItem('token');
    //     try {
    //         const res = await axios.post(
    //             'http://localhost:8000/api/address',
    //             data,
    //             { headers: { Authorization: `Bearer ${token}` } }
    //         );

    //         // Map data backend trả về sang format frontend hiển thị
    //         setAddresses([...addresses, res.data]);
    //         setIsModalOpen(false);
    //     } catch (error) {
    //         console.error('Failed to add address', error);
    //     }
    // };

    useEffect(() => {
        axios.get('http://localhost:8000/api/provinces')
            .then(res => setProvinces(res.data));
    }, []);

    const handleSaveAddress = async (data: {
        recipient_name: string;
        phone_number: string;
        address_line: string;
        province_id: number;
        district_id: number;
        ward_id: number;
        label: string;
        is_default: boolean;

    }) => {
        const token = localStorage.getItem('token');
        try {
            if (editingAddress) {
                const res = await axios.put<Address>(
                    `http://localhost:8000/api/address/${editingAddress.id}`,
                    data,
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                const updated = addresses.map((addr) =>
                    addr.id === editingAddress.id
                        ? res.data
                        : res.data.is_default ? { ...addr, is_default: false } : addr
                );
                setAddresses(
                    [...updated].sort((a, b) => (b.is_default ? 1 : 0) - (a.is_default ? 1 : 0))
                );
            } else {
                const res = await axios.post<Address>(
                    `http://localhost:8000/api/address`,
                    data,
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                const updated = addresses
                    .map((addr) => res.data.is_default ? { ...addr, is_default: false } : addr)
                    .concat(res.data);
                setAddresses(
                    [...updated].sort((a, b) => (b.is_default ? 1 : 0) - (a.is_default ? 1 : 0))
                );
            }

            setIsModalOpen(false);
            setEditingAddress(null);
        } catch (error) {
            console.error('Failed to save address', error);
        }
    };
    const handleEdit = async (addr: Address) => {
        const token = localStorage.getItem('token');

        const districtsRes = await axios.get(
            `http://localhost:8000/api/provinces/${addr.province.id}/districts`,
            { headers: { Authorization: `Bearer ${token}` } }
        );

        const wardsRes = await axios.get(
            `http://localhost:8000/api/districts/${addr.district.id}/wards`,
            { headers: { Authorization: `Bearer ${token}` } }
        );

        setEditingAddress({
            ...addr,
            province_id: addr.province.id,
            district_id: addr.district.id,
            ward_id: addr.ward.id,
            districts: districtsRes.data,
            wards: wardsRes.data,
        });

        setIsModalOpen(true);
    };

    // Fetch user info
    useEffect(() => {
        const fetchUserInfo = async () => {
            const token = localStorage.getItem('token');
            try {
                const res = await axios.get('http://localhost:8000/api/get_user', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const data = res.data;
                setUser({
                    id: data.id,
                    name: data.name,
                    phone: data.phone,
                    email: data.email,
                    avatar_url: data.avatar_url,
                });
            } catch (error) {
                console.error('Failed to fetch user info', error);
            }
        };

        fetchUserInfo();
    }, []);

    // Fetch address list
    useEffect(() => {
        const fetchAddresses = async () => {
            const token = localStorage.getItem('token');
            try {
                const res = await axios.get('http://localhost:8000/api/address', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                // setAddresses(res.data);
                // console.log("Data", res.data);
                const sorted = res.data.sort((a: Address, b: Address) => {
                    return (b.is_default ? 1 : 0) - (a.is_default ? 1 : 0); // ✅ ép kiểu thành number
                });
                setAddresses(sorted);
            } catch (error) {
                console.error('Failed to fetch addresses', error);
            }
        };

        fetchAddresses();
    }, []);

    const handleDelete = async (id: number) => {
        const token = localStorage.getItem('token');
        try {
            await axios.delete(`http://localhost:8000/api/address/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setAddresses(addresses.filter((addr) => addr.id !== id));
        } catch (error) {
            console.error('Failed to delete address', error);
        }
    };

    const handleSetDefault = async (id: number) => {
        const token = localStorage.getItem('token');
        try {
            await axios.put(
                `http://localhost:8000/api/address/${id}/set_default`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            const updated = addresses.map((addr) => ({
                ...addr,
                is_default: addr.id === id,
            }));
            updated.sort((a, b) => (b.is_default ? 1 : 0) - (a.is_default ? 1 : 0));
            setAddresses(updated);
        } catch (error) {
            console.error('Failed to set default address', error);
        }
    };

    return (
        <div className={styles.container}>
            <UserSidebar user={user} />

            <main className={styles.address}>
                <div className={styles.header}>
                    <h2>My Addresses</h2>
                    <button
                        className={`${styles.addButton} ${addresses.length >= 10 ? styles.disabledBtn : ""}`}
                        onClick={() => {
                            setEditingAddress(null);
                            setIsModalOpen(true);
                        }}
                        disabled={addresses.length >= 10}>+ Add New Address
                    </button>
                </div>
                <AddressModal
                    isOpen={isModalOpen}
                    onClose={() => { setIsModalOpen(false); setEditingAddress(null); }}
                    onSave={handleSaveAddress}
                    initialData={
                        editingAddress
                            ? {
                                recipient_name: editingAddress.recipient_name,
                                phone_number: editingAddress.phone_number,
                                address_line: editingAddress.address_line,
                                province_id: editingAddress.province.id,
                                district_id: editingAddress.district.id,
                                ward_id: editingAddress.ward.id,
                                label: editingAddress.label,
                            }
                            : undefined
                    }
                    provinces={provinces}
                    districts={editingAddress?.districts || []}
                    wards={editingAddress?.wards || []}
                    title={editingAddress ? 'Edit Address' : 'Add New Address'}
                />

                {addresses.length === 0 ? (
                    <p>No addresses found.</p>
                ) : (
                    addresses.map((addr) => (
                        // <div
                        //     key={addr.id}
                        //     className={`${styles.addressItem} ${addr.is_default ? styles.defaultAddress : ''
                        //         }`}
                        // >
                        //     <div className={styles.info}>
                        //         <strong>{addr.recipient_name}</strong> | {addr.phone_number}
                        //         <p>
                        //             {addr.address_line}, {addr.ward.name}, {addr.district.name}, {addr.province.name}
                        //         </p>
                        //         {addr.is_default && (
                        //             <span className={styles.defaultBadge}>Default</span>
                        //         )}
                        //     </div>
                        //     <div className={styles.actions}>
                        //         <button onClick={() => handleEdit(addr)}>
                        //             Edit
                        //         </button>
                        //         <button
                        //             onClick={() => handleDelete(addr.id)}
                        //             disabled={addr.is_default}
                        //             className={addr.is_default ? styles.disabledBtn : ""}
                        //            >
                        //             Delete
                        //         </button>
                        //         {!addr.is_default && (
                        //             <button onClick={() => handleSetDefault(addr.id)}>
                        //                 Set as default
                        //             </button>
                        //         )}
                        //     </div>
                        // </div>
                        <div
                            key={addr.id}
                            className={`${styles.addressItem} ${addr.is_default ? styles.defaultAddress : ''}`}
                        >
                            <div className={styles.info}>
                                <div className={styles.headerInfo}>
                                    <span className={styles.recipient}>
                                        <strong>{addr.recipient_name}</strong> | {addr.phone_number}
                                    </span>
                                    {addr.is_default && (
                                        <span className={styles.defaultBadge}>Default</span>
                                    )}
                                </div>
                                <p className={styles.addressDetails}>
                                    {addr.address_line}, {addr.ward.name}, {addr.district.name}, {addr.province.name}
                                </p>
                            </div>
                            <div className={styles.actions}>
                                <button onClick={() => handleEdit(addr)}>Edit</button>
                                <button
                                    onClick={() => handleDelete(addr.id)}
                                    disabled={addr.is_default}
                                    className={addr.is_default ? styles.disabledBtn : ''}
                                >
                                    Delete
                                </button>
                                {!addr.is_default && (
                                    <button onClick={() => handleSetDefault(addr.id)}>Set as default</button>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </main>
        </div>
    );
}

export default AddressUserPage;
