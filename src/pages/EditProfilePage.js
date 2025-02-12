// src/pages/EditProfilePage.js
import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/EditProfilePage.css';

function EditProfilePage() {
    const [form, setForm] = useState({
        firstName: 'Md',
        lastName: 'Rimel',
        email: 'rimel111@gmail.com',
        address: 'Kingston, 5236, United State',
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = (e) => {
        e.preventDefault();
        alert('개인정보가 수정되었습니다!');
    };

    const handleCancel = () => {
        alert('수정을 취소합니다');
    };

    return (
        <div className="outer-container">
            <Header />
            <div className="main-content">
                <div className="container">
                    <div className="sidebar-container">
                        <div className="sidebar">
                            <h3 className="sidebar-title">Manage My Account</h3>
                            <ul className="sidebar-menu">
                                <li className="menu-item active">Edit My Profile</li>
                            </ul>

                            <h3 className="sidebar-title">My Items</h3>
                            <ul className="sidebar-menu">
                                <li className="menu-item">My sale</li>
                                <li className="menu-item">My purchase</li>
                            </ul>

                            <h3 className="sidebar-title">My WishList</h3>
                        </div>
                    </div>

                    <div className="profile-container">
                        <div className="main-area">
                            <h1 className="page-title">Edit Your Profile</h1>
                            <form className="form" onSubmit={handleSave}>
                                <div className="row">
                                    <div className="field">
                                        <label className="label">First Name</label>
                                        <input
                                            className="input"
                                            name="firstName"
                                            value={form.firstName}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="field">
                                        <label className="label">Last Name</label>
                                        <input
                                            className="input"
                                            name="lastName"
                                            value={form.lastName}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="field">
                                        <label className="label">Email</label>
                                        <input
                                            className="input"
                                            type="email"
                                            name="email"
                                            value={form.email}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="field">
                                        <label className="label">Address</label>
                                        <input
                                            className="input"
                                            name="address"
                                            value={form.address}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>

                                <h2 className="section-title">Password Changes</h2>
                                <div className="field">
                                    <label className="label">Current Password</label>
                                    <input
                                        className="input"
                                        type="password"
                                        name="currentPassword"
                                        value={form.currentPassword}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="field">
                                    <label className="label">New Password</label>
                                    <input
                                        className="input"
                                        type="password"
                                        name="newPassword"
                                        value={form.newPassword}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="field">
                                    <label className="label">Confirm New Password</label>
                                    <input
                                        className="input"
                                        type="password"
                                        name="confirmPassword"
                                        value={form.confirmPassword}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="button-row">
                                    <button className="cancel-button" type="button" onClick={handleCancel}>
                                        Cancel
                                    </button>
                                    <button className="save-button" type="submit">
                                        Save Changes
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default EditProfilePage;
