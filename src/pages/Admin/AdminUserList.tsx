import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./AdminUserList.module.css";
import { User } from "../../types/user";
import { useNavigate } from "react-router-dom";

function AdminUserList() {
    const [users, setUsers] = useState<User[]>([]);
    const [roleFilter, setRoleFilter] = useState("");
    const [search, setSearch] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        fetchUsers();
    }, [roleFilter, search]);

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem("token");

            if (!token) {
                console.error("No token found");
                return;
            }

            const res = await axios.get("http://localhost:8000/api/admin/users", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params: {
                    role: roleFilter, 
                    search: search, 
                },
            });

            setUsers(res.data);
            console.log("Fetched users:", res.data);
        } catch (error) {
            console.error("Error fetching users:", error);

            if (axios.isAxiosError(error)) {
                if (error.response?.status === 401) {
                    console.error("Unauthorized - maybe token expired or not admin?");
                    // Có thể redirect đến login hoặc hiển thị toast:
                    // toast.error("Bạn không có quyền truy cập.");
                } else {
                    console.error("Other axios error:", error.response?.data);
                }
            } else {
                console.error("Unknown error:", error);
            }
        }
    };


    const handleVerify = async (userId: number) => {
        await axios.post(`/api/admin/verify-user/${userId}`);
        fetchUsers();
    };

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>User Management</h2>

            <div className={styles.controls}>
                <input
                    type="text"
                    placeholder="Search for email/phone number..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className={styles.input}
                />
                <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    className={styles.select}
                >
                    <option value="">All</option>
                    <option value="user">User</option>
                    <option value="driver">Driver</option>
                    <option value="restaurant">Restaurant</option>
                    <option value="admin">Admin</option>
                </select>
            </div>

            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Role</th>
                        <th>Verified</th>
                        <th>Action</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((u) => (
                        <tr key={u.id}>
                            <td>{u.name}</td>
                            <td>{u.email}</td>
                            <td>{u.phone}</td>
                            <td>{u.role}</td>
                            <td className={styles.checkVerify}>{u.is_verified ? "✔" : "✖"}</td>
                            <td>
                                {!u.is_verified && (u.role === "driver" ||  u.role === "restaurant") && (
                                    <button className={styles.verifyBtn} onClick={() => handleVerify(u.id)}>
                                        Duyệt
                                    </button>
                                )}
                            </td>
                            <td>  
                                <button className={styles.detailButton}
                                  onClick={() => navigate(`/admin/users/${u.id}`)} >
                                    Xem chi tiết
                                </button></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminUserList;
