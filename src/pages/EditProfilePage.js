// src/pages/EditProfilePage.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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

    const { user, logout } = useAuth();
    const navigate = useNavigate();

    // 프로필 조회: GET /user/modify
    useEffect(() => {
        if (user && user.email && user.accessToken) {
            profileAPI.getProfile({
                email: user.email,
                accessToken: user.accessToken,
            })
                .then(response => {
                    // 백엔드 응답 구조 { user: { ... } }
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

    // 폼 입력 변경 핸들러
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    // 개인정보 수정 (POST /user/modify)
    const handleSave = async (e) => {
        e.preventDefault();

        // 필수 필드 체크
        if (!form.email.trim() ||
            !form.Name.trim() ||
            !form.Phonenumber.trim() ||
            !form.address.trim()) {
            alert('모든 필수 정보를 입력해주세요.');
            return;
        }

        // 현재 비밀번호는 반드시 필요
        if (!form.currentPassword.trim()) {
            alert('현재 비밀번호를 입력해주세요.');
            return;
        }

        // 기본 업데이트 데이터
        let updatedProfile = {
            email: form.email,
            userName: form.Name,
            hp: form.Phonenumber,
            address: form.address,
            rawPassword: form.currentPassword
        };

        // 새 비밀번호가 비어있다면 currentPassword로 대체
        if (form.newPassword.trim() === '' && form.confirmPassword.trim() === '') {
            updatedProfile = {
                ...updatedProfile,
                prevPassword: form.currentPassword,
                newPassword: form.currentPassword,
            };
        } else {
            // 새 비밀번호 필드가 있으면 유효성 확인
            if (!form.newPassword.trim() || !form.confirmPassword.trim()) {
                alert('비밀번호 변경을 위해 모든 비밀번호 필드를 입력해주세요.');
                return;
            }
            if (form.newPassword !== form.confirmPassword) {
                alert('새 비밀번호와 확인 비밀번호가 일치하지 않습니다.');
                return;
            }
            updatedProfile = {
                ...updatedProfile,
                prevPassword: form.currentPassword,
                newPassword: form.newPassword,
            };
        }

        console.log('전송할 업데이트 데이터:', updatedProfile);

        try {
            const response = await profileAPI.updateProfile(updatedProfile, {
                email: user.email,
                accessToken: user.accessToken
            });
            console.log('프로필 업데이트 응답:', response.data);
            alert('개인정보가 수정되었습니다!');
        } catch (error) {
            console.error('프로필 업데이트 오류:', error);
            alert('개인정보 수정에 실패했습니다. 다시 시도해주세요.');
        }
    };

    // 취소
    const handleCancel = () => {
        alert('수정을 취소합니다');
    };

    // ✅ 회원탈퇴 (DELETE /auth/delete)
    const handleDeleteAccount = async () => {
        const confirmDelete = window.confirm("정말 회원탈퇴 하시겠습니까?");
        if (!confirmDelete) return;

        try {
            // API 호출
            await profileAPI.deleteAccount({
                email: user.email,
                accessToken: user.accessToken
            });
            alert('회원탈퇴가 완료되었습니다.');

            await logout();

            // 로그아웃 + 홈으로 이동 (예시)
            // 만약 useAuth에 logout 함수가 있다면 여기서 logout() 호출
            // navigate('/') → 홈 화면
            navigate('/');
        } catch (error) {
            console.error('회원탈퇴 오류:', error);
            alert('회원탈퇴 중 오류가 발생했습니다.');
        }
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
                                        <input
                                            className="input"
                                            name="Name"
                                            value={form.Name}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="field">
                                        <label className="label">Phone number</label>
                                        <input
                                            className="input"
                                            name="Phonenumber"
                                            value={form.Phonenumber}
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
                                    <div className="left-button-container">
                                        <button
                                            type="button"
                                            onClick={handleDeleteAccount}
                                            className="cancel-button"
                                        >
                                            회원탈퇴
                                        </button>
                                    </div>
                                    <div className="right-button-container">
                                        <button
                                            className="cancel-button"
                                            type="button"
                                            onClick={handleCancel}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            className="save-button"
                                            type="submit"
                                        >
                                            Save Changes
                                        </button>
                                    </div>
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
