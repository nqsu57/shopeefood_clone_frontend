// import React, { useState } from 'react';
// import axios from 'axios';

// const AvatarUpload = ({ onUploadSuccess }) => {
//   const [imageUrl, setImageUrl] = useState('');
//   const [uploading, setUploading] = useState(false);

//   const handleImageChange = async (e: any) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     setUploading(true);
//     const formData = new FormData();
//     formData.append('file', file);
//     formData.append('upload_preset', 'your_upload_preset'); // Thay bằng preset của bạn

//     try {
//       const response = await axios.post(
//         'https://api.cloudinary.com/v1_1/your_cloud_name/image/upload', // Thay bằng cloud_name của bạn
//         formData
//       );
//       const url = response.data.secure_url;
//       setImageUrl(url);
//       onUploadSuccess(url); // Gửi URL về component cha/backend
//     } catch (error) {
//       console.error('Upload error', error);
//     } finally {
//       setUploading(false);
//     }
//   };

//   return (
//     <div>
//       <input type="file" onChange={handleImageChange} accept="image/*" />
//       {uploading && <p>Uploading...</p>}
//       {imageUrl && <img src={imageUrl} alt="Avatar" width={100} />}
//     </div>
//   );
// };

// export default AvatarUpload;
