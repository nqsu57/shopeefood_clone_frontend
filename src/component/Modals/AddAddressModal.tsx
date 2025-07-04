import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './AddressModal.module.css';
import AddressSelection from '../ProvinceDistrictWardSelector';
import { Province, District, Ward, Address } from '../../types/address'


interface AddressModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: {
        recipient_name: string;
        phone_number: string;
        address_line: string;
        province_id: number;
        district_id: number;
        ward_id: number;
        label: string;
        is_default: boolean;
    }) => void;
    initialData?: {
        recipient_name: string;
        phone_number: string;
        address_line: string;
        province_id: number;
        district_id: number;
        ward_id: number;
        label?: string;
        is_default?: boolean;
    };
    title: string;
    provinces: Province[];
    districts: District[];
    wards: Ward[];
}

function AddressModal({
    isOpen,
    onClose,
    onSave,
    initialData,
    title,
    provinces,
    districts,
    wards
}: AddressModalProps) {
    const [name, setName] = useState(initialData?.recipient_name || '');
    const [phone, setPhone] = useState(initialData?.phone_number || '');
    const [address, setAddress] = useState(initialData?.address_line || '');
    const [provinceId, setProvinceId] = useState<number | null>(initialData?.province_id || null);
    const [districtId, setDistrictId] = useState<number | null>(initialData?.district_id || null);
    const [wardId, setWardId] = useState<number | null>(initialData?.ward_id || null);
    const tags = ['Home', 'Work', 'Other'];
    const [selectedTag, setSelectedTag] = useState(initialData?.label || 'Home');
    const [isDefault, setIsDefault] = useState(false);

    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                setName(initialData.recipient_name);
                setPhone(initialData.phone_number);
                setAddress(initialData.address_line);
                setProvinceId(initialData.province_id);
                setDistrictId(initialData.district_id);
                setWardId(initialData.ward_id);
                setSelectedTag(initialData.label || 'Home');
                setIsDefault(initialData.is_default || false);
            } else {
                setName('');
                setPhone('');
                setAddress('');
                setProvinceId(null);
                setDistrictId(null);
                setWardId(null);
                setSelectedTag('Home');
                setIsDefault(false);
            }
        }
    }, [isOpen, initialData]);

    if (!isOpen) return null;

    const handleSubmit = () => {
        console.log(name, phone, address, provinceId, districtId, wardId, selectedTag);
        if (!name || !phone || !address || !provinceId || !districtId || !wardId) {
            alert('Please fill all fields');
            return;
        }
        onSave({
            recipient_name: name,
            phone_number: phone,
            address_line: address,
            province_id: provinceId,
            district_id: districtId,
            ward_id: wardId,
            label: selectedTag,
            is_default: isDefault,

        });
        // setName('');
        // setPhone('');
        // setAddress('');
        // setProvinceId(null);
        // setDistrictId(null);
        // setWardId(null);
        // setSelectedTag('Home');

    };

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <h2>{title}</h2>
                <div className={styles.formGroup}>
                    <div className={styles.inputGroup}>
                        <input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            type="text"
                            placeholder="Full name"
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <input
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            type="text"
                            placeholder="Phone Number"
                        />
                    </div>
                </div>
                <div className={styles.addressSelection}>

                    <AddressSelection
                        value={{
                            province_id: provinceId,
                            district_id: districtId,
                            ward_id: wardId,
                        }}
                        onChange={(
                            province: Province | null,
                            district: District | null,
                            ward: Ward | null
                        ) => {
                            setProvinceId(province?.id || null);
                            setDistrictId(district?.id || null);
                            setWardId(ward?.id || null);
                        }}
                        provinces={provinces}
                        districts={districts}
                        wards={wards}
                    />
                    <textarea
                        value={address}
                        cols={50} rows={3}
                        placeholder="Street Name, Building, House No."
                        onChange={(e) => setAddress(e.target.value)}
                    />
                </div>
                <div className={styles.tagContainer}>
                    <span>Label as:</span>
                    {tags.map((tag) => (
                        <span
                            key={tag}
                            className={`${styles.tag} ${selectedTag === tag ? styles.active : ''}`}
                            onClick={() => setSelectedTag(tag)}
                        >
                            {tag}
                        </span>
                    ))}
                </div>
                <div className={styles.setDefault}>
                    <input
                        type="checkbox"
                        checked={isDefault}
                        onChange={(e) => setIsDefault(e.target.checked)}
                    />
                    <label>Set as Default Address</label>
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
