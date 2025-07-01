import { useEffect, useState } from 'react';
import axios from 'axios';
import UserSidebar from '../../component/SideBar/Sidebar';
import styles from './UserAddress.module.css';
import AddressModal from '../../component/Modals/AddAddressModal';

interface Address {
    id: number;
    name: string;
    phone: string;
    address: string;
    is_default: boolean;
}

function AddressUserPage() {
    const [user, setUser] = useState({
        id: '',
        name: '',
        phone: '',
        email: '',
        avatar_url: '',
    });

    const [addresses, setAddresses] = useState<Address[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleAddAddress = async (data: { name: string; phone: string; address: string }) => {
        const token = localStorage.getItem('token');
        try {
            const res = await axios.post(
                'http://localhost:8000/api/address',
                data,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setAddresses([...addresses, res.data]);
            setIsModalOpen(false);
        } catch (error) {
            console.error('Failed to add address', error);
        }
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
                setAddresses(res.data);
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
                        className={styles.addButton}
                        onClick={() => setIsModalOpen(true)}>+ Add New Address</button>
                </div>
                <AddressModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleAddAddress}
                    title="Add New Address"
                />

                {addresses.length === 0 ? (
                    <p>No addresses found.</p>
                ) : (
                    addresses.map((addr) => (
                        <div
                            key={addr.id}
                            className={`${styles.addressItem} ${addr.is_default ? styles.defaultAddress : ''
                                }`}
                        >
                            <div className={styles.info}>
                                <strong>{addr.name}</strong> | {addr.phone}
                                <p>{addr.address}</p>
                                {addr.is_default && (
                                    <span className={styles.defaultBadge}>Default</span>
                                )}
                            </div>
                            <div className={styles.actions}>
                                <button>Edit</button>
                                <button onClick={() => handleDelete(addr.id)}>Delete</button>
                                {!addr.is_default && (
                                    <button onClick={() => handleSetDefault(addr.id)}>
                                        Set as default
                                    </button>
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
