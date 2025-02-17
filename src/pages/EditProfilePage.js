// src/pages/EditProfilePage.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/EditProfilePage.css';
import { profileAPI } from '../api/profile';
import { useAuth } from '../context/AuthContext';

function EditProfilePage() {
    const [form, setForm] = useState({
        Name: '',
        Phonenumber: '',
        email: '',
        address: '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    const { user } = useAuth();

    // 프로필 조회: GET /user/modify
    useEffect(() => {
        if (user && user.email && user.accessToken) {
            profileAPI.getProfile({
                email: user.email,
                accessToken: user.accessToken,
            })
                .then(response => {
                    // 백엔드 응답 구조가 { user: { ... } } 이므로,
                    // response.data에서 user 객체를 추출하도록 수정함
                    const data = response.data.user;
                    console.log('프로필 조회 응답 데이터:', data);
                    setForm({
                        Name: data.userName || '',
                        Phonenumber: data.hp || '',
                        email: data.email || '',
                        address: data.address || '',
                        currentPassword: '',
                        newPassword: '',
                        confirmPassword: '',
                    });
                })
                .catch(error => {
                    console.error('프로필 조회 오류:', error);
                    alert('프로필 정보를 불러오는 데 실패했습니다.');
                });
        }
    }, [user]);


    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async (e) => {
        e.preventDefault();

        // 필수 필드 검증
        if (!form.email.trim() || !form.Name.trim() || !form.Phonenumber.trim() || !form.address.trim()) {
            alert('모든 필수 정보를 입력해주세요.');
            return;
        }

        // 2. 현재 비밀번호는 항상 필수: currentPassword가 비어 있으면 경고 메시지 출력 후 중단
        if (!form.currentPassword.trim()) {
            alert('회원 확인을 위해 현재 비밀번호를 입력해주세요.');
            return;
        }

        // 기본 업데이트 데이터 (비밀번호 관련 필드는 제외)
        let updatedProfile = {
            email: form.email,
            userName: form.Name,
            hp: form.Phonenumber,
            address: form.address,
        };

        // "New Password"와 "Confirm New Password"에 "Current Password" 값을 채워서 전송.
        if (form.newPassword.trim() === '' && form.confirmPassword.trim() === '') {
            updatedProfile.prevPassword = form.currentPassword;
            updatedProfile.newPassword = form.currentPassword;
        } else {
            // 사용자가 새 비밀번호를 입력한 경우,
            // 모든 비밀번호 필드가 입력되어 있어야 하며, 새 비밀번호와 확인 비밀번호가 일치.
            if (!form.newPassword.trim() || !form.confirmPassword.trim()) {
                alert('비밀번호 변경을 위해 모든 비밀번호 필드를 입력해주세요.');
                return;
            }
            if (form.newPassword !== form.confirmPassword) {
                alert('새 비밀번호와 확인 비밀번호가 일치하지 않습니다.');
                return;
            }
            updatedProfile.prevPassword = form.currentPassword;
            updatedProfile.newPassword = form.newPassword;
        }

        console.log('전송할 업데이트 데이터:', updatedProfile);

        try {
            const response = await profileAPI.updateProfile(updatedProfile, {
                email: user.email,
                accessToken: user.accessToken,
            });// post
            console.log('프로필 업데이트 응답:', response.data);
            alert('개인정보가 수정되었습니다!');
        } catch (error) {
            console.error('프로필 업데이트 오류:', error);
            alert('개인정보 수정에 실패했습니다. 다시 시도해주세요.');
        }
    };

    const handleCancel = () => {
        alert('수정을 취소합니다');
    };

    return (
        <div className="outer-container">
            <div className="main-content">
                <div className="container">
                    <div className="sidebar-container">
                        <div className="sidebar">
                            <h3 className="sidebar-title">Manage My Account</h3>
                            <ul className="sidebar-menu">
                                <li className="menu-item active">
                                    <Link to="/profile/edit" className="sidebar-link">Edit My Profile</Link>
                                </li>
                            </ul>
                            <h3 className="sidebar-title">My Items</h3>
                            <ul className="sidebar-menu">
                                <li className="menu-item">
                                    <Link to="/mysale" className="sidebar-link">My sale</Link>
                                </li>
                                <li className="menu-item">
                                    <Link to="/mypurchase" className="sidebar-link">My purchase</Link>
                                </li>
                            </ul>
                            <h3 className="sidebar-title">My WishList</h3>
                            <ul className="sidebar-menu">
                                <li className="menu-item">
                                    <Link to="/wishlist" className="sidebar-link">My WishList</Link>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="profile-container">
                        <div className="main-area">
                            <h1 className="page-title">Edit Your Profile</h1>
                            <form className="form" onSubmit={handleSave}>
                                <div className="row">
                                    <div className="field">
                                        <label className="label">Name</label>
                                        <input className="input" name="Name" value={form.Name} onChange={handleChange} />
                                    </div>
                                    <div className="field">
                                        <label className="label">Phone number</label>
                                        <input className="input" name="Phonenumber" value={form.Phonenumber} onChange={handleChange} />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="field">
                                        <label className="label">Email</label>
                                        <input className="input" type="email" name="email" value={form.email} onChange={handleChange} />
                                    </div>
                                    <div className="field">
                                        <label className="label">Address</label>
                                        <input className="input" name="address" value={form.address} onChange={handleChange} />
                                    </div>
                                </div>
                                <h2 className="section-title">Password Changes</h2>
                                <div className="field">
                                    <label className="label">Current Password</label>
                                    <input className="input" type="password" name="currentPassword" value={form.currentPassword} onChange={handleChange} />
                                </div>
                                <div className="field">
                                    <label className="label">New Password</label>
                                    <input className="input" type="password" name="newPassword" value={form.newPassword} onChange={handleChange} />
                                </div>
                                <div className="field">
                                    <label className="label">Confirm New Password</label>
                                    <input className="input" type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} />
                                </div>
                                <div className="button-row">
                                    <button className="cancel-button" type="button" onClick={handleCancel}>Cancel</button>
                                    <button className="save-button" type="submit">Save Changes</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EditProfilePage;
