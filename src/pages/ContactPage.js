// src/pages/ContactPage.js
import React, { useState } from 'react';
import '../styles/ContactPage.css';

function ContactPage() {
    const [form, setForm] = useState({
        name: '',
        email: '',
        phone: '',
        message: '',
    });

    const [loading, setLoading] = useState(false);

    const validateEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.name || !form.email || !form.phone || !form.message) {
            alert("모든 필드를 입력해주세요.");
            return;
        }

        if (!validateEmail(form.email)) {
            alert("유효한 이메일 주소를 입력해주세요.");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch("http://13.208.145.12:8080/inquiry/upload", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-Auth-User": "user1234" // 테스트용, 실제 로그인된 사용자 정보로 대체
                },
                body: JSON.stringify(form),
            });

            if (response.ok) {
                alert("문의가 정상적으로 접수되었습니다.");
                setForm({ name: '', email: '', phone: '', message: '' });
            } else {
                alert("문의 접수에 실패했습니다.");
            }
        } catch (error) {
            console.error("문의 요청 오류:", error);
            alert("서버 오류가 발생했습니다.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="outer-container">
            <div className="main-content">
                <div className="sub-nav">Home / Contact</div>
                <div className="content-wrapper">
                    <div className="left-card">
                        <div className="card-box">
                            <div className="icon">📞</div>
                            <h2 className="card-title">Call To Us</h2>
                            <p className="card-desc">전화상담 운영시간은 09:00 ~ 17:00 입니다.</p>
                            <p className="card-desc">Phone: +8212345678</p>
                        </div>
                        <div className="card-box">
                            <div className="icon">✉️</div>
                            <h2 className="card-title">Write To US</h2>
                            <p className="card-desc">고객센터 운영시간은 10:00 ~ 19:00 입니다.</p>
                            <p className="card-desc">Emails: reuse@skrookies.com</p>
                        </div>
                    </div>

                    <form className="right-form" onSubmit={handleSubmit}>
                        <div className="input-row">
                            <input
                                className="input-field"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                placeholder="Your Name *"
                                required
                            />
                            <input
                                className="input-field"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                placeholder="Your Email *"
                                required
                            />
                            <input
                                className="input-field"
                                name="phone"
                                value={form.phone}
                                onChange={handleChange}
                                placeholder="Your Phone *"
                                required
                            />
                        </div>
                        <textarea
                            className="textarea"
                            name="message"
                            value={form.message}
                            onChange={handleChange}
                            placeholder="Your Message"
                            rows="8"
                            required
                        />
                        <button className="send-button" type="submit" disabled={loading}>
                            {loading ? "Sending..." : "Send Message"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default ContactPage;
