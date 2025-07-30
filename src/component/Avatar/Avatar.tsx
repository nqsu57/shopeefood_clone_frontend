import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import styles from './Avatar.module.css';
import { toast } from 'react-toastify';


interface AvatarUploaderProps {
    initialAvatarUrl: string;
    onAvatarUploaded: (url: string) => void;
}

const AvatarUploader: React.FC<AvatarUploaderProps> = ({ initialAvatarUrl, onAvatarUploaded }) => {
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        if (!selectedFile) {
            setPreviewUrl(initialAvatarUrl || null);
        }
    }, [initialAvatarUrl]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            toast.error('File size must be under 5MB');
            return;
        }

        setSelectedFile(file);
        setPreviewUrl(URL.createObjectURL(file));
    };

    const handleUpload = async () => {
        if (!selectedFile) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('upload_preset', 'unsigned_avatar_upload');

        try {
            const res = await axios.post('https://api.cloudinary.com/v1_1/dfn2gpymk/image/upload', formData);
            const imageUrl = res.data.secure_url;
            onAvatarUploaded(imageUrl);
            setPreviewUrl(null);
            setSelectedFile(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        } catch (err) {
            console.error('Upload failed', err);
            toast.error('Upload failed. Try again.');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div style={{ marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <img
                    src={previewUrl || initialAvatarUrl || "/default-avatar.png"}
                    alt="Avatar Preview"
                    style={{
                        width: 96,
                        height: 96,
                        borderRadius: '50%',
                        objectFit: 'cover',
                        border: '1px solid #ccc',
                    }}
                />
                <div>
                    <label>
                        <span style={{ marginRight: 8 }}>Upload from</span>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            disabled={uploading}
                            ref={fileInputRef}
                        />
                    </label>
                    <div style={{ fontSize: 12, color: '#666' }}>
                        GIF, JPEG, PNG, BMP accepted with a maximum size of 5.0 MB
                    </div>
                    <button
                        style={{
                            marginTop: 8,
                            backgroundColor: '#2c5282',
                            color: '#fff',
                            border: 'none',
                            padding: '6px 16px',
                            borderRadius: 4,
                            cursor: selectedFile && !uploading ? 'pointer' : 'not-allowed',
                        }}
                        // disabled={!selectedFile || uploading}
                        onClick={handleUpload}
                    >
                        {uploading ? 'Updating...' : 'Update'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AvatarUploader;
