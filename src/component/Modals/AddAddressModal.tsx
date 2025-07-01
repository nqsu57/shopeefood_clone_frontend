import React, { useState, useEffect } from 'react';
import styles from './AddressModal.module.css';


interface AddressModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: { name: string; phone: string; address: string }) => void;
    initialData?: {
        name: string;
        phone: string;
        address: string;
    };
    title: string;
}

function AddressModal({
    isOpen,
    onClose,
    onSave,
    initialData,
    title,
}: AddressModalProps) {
    const [name, setName] = useState(initialData?.name || '');
    const [phone, setPhone] = useState(initialData?.phone || '');
    const [address, setAddress] = useState(initialData?.address || '');

    useEffect(() => {
        if (initialData) {
            setName(initialData.name);
            setPhone(initialData.phone);
            setAddress(initialData.address);
        }
    }, [initialData]);

    if (!isOpen) return null;

    const handleSubmit = () => {
        if (!name || !phone || !address) {
            alert('Please fill all fields');
            return;
        }
        onSave({ name, phone, address });
    };

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                {/* <h3>{title}</h3> */}
                <div className={styles.fromGroup}>
                    <div className={styles.inputGroup}>
                        <input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            type="text"
                            placeholder='Full name'
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <input
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            type="text"
                            placeholder='Phone Number'
                        />
                    </div>
                </div>
                <div className={styles.address}>
                    <textarea
                        value={address}
                        placeholder="Street Name, Building, House No."
                        onChange={(e) => setAddress(e.target.value)}
                    />
                </div>

                <div className={styles.actions}>
                    <button className={styles.saveBtn} onClick={handleSubmit}>
                        Save
                    </button>
                    <button className={styles.cancelBtn} onClick={onClose}>
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}

export default AddressModal;
