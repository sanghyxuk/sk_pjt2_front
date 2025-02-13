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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('문의 요청:', form);
        alert('문의가 접수되었습니다!');
        setForm({ name: '', email: '', phone: '', message: '' });
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
                        <button className="send-button" type="submit">
                            Send Message
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default ContactPage;
