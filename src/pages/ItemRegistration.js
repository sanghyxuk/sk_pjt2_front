// src/pages/ItemRegistration.js
import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Row, Col, Image } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { postsAPI } from '../api/posts';
import '../styles/ItemWriteEdit.css';

function ItemRegistration() {
    const { id } = useParams(); // 수정 모드라면 id 값이 존재함
    const navigate = useNavigate();
    const { user } = useAuth();

    // 입력폼 상태
    const [pdtPrice, setPdtPrice] = useState('');
    const [pdtName, setPdtName] = useState('');
    const [pdtQuantity, setPdtQuantity] = useState('');
    const [description, setDescription] = useState('');
    const [dtype, setDtype] = useState('');

    // 수정 시 기존 이미지는 읽기 전용으로 표시 (전송하지 않음)
    const [existingImages, setExistingImages] = useState([]);
    // 실제 등록(새 이미지)로 전송할 File 객체 배열
    const [newImages, setNewImages] = useState([]);

    const [isLoading, setIsLoading] = useState(false);

    // 수정 모드일 때 기존 상품 정보 로드 (기존 이미지는 화면에만 표시)
    useEffect(() => {
        if (id) {
            const loadPost = async () => {
                try {
                    const response = await postsAPI.getPostDetail(id);
                    if (!user || user.email !== response.data.email) {
                        alert('수정 권한이 없습니다.');
                        navigate('/items');
                        return;
                    }
                    setPdtName(response.data.pdtName || '');
                    setPdtQuantity(response.data.pdtQuantity || '');
                    setPdtPrice(String(response.data.pdtPrice || ''));
                    setDescription(response.data.description || '');
                    setDtype(response.data.dtype || '');
                    if (response.data.imageUrls) {
                        setExistingImages(response.data.imageUrls); // 기존 이미지는 읽기 전용으로 저장
                    }
                } catch (error) {
                    console.error('Error loading product:', error);
                    alert('상품 정보를 불러오는데 실패했습니다.');
                    navigate('/items');
                }
            };
            loadPost();
        }
    }, [id, user, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!user) {
            alert('로그인이 필요합니다.');
            navigate('/login');
            return;
        }
        if (!pdtName || !pdtName.trim() || !description || !description.trim()) {
            alert('상품 이름과 설명은 필수입니다.');
            return;
        }
        // 수정 시에는 반드시 새 이미지를 업로드하도록 강제 (기존 이미지는 화면에만 표시)
        if (id && newImages.length === 0) {
            alert('수정 시 반드시 새 이미지를 업로드해야 합니다.');
            return;
        }

        // 신규 등록시에는 기존 이미지는 사용하고 싶지 않다면 (수정 시에는 삭제 처리)
        // 여기서는 전송되는 이미지는 newImages만 사용합니다.
        const newItem = {
            pdtId: null, // 신규 등록 시 pdtId는 null
            pdtPrice: String(pdtPrice).trim(),
            pdtName: pdtName.trim(),
            pdtQuantity: pdtQuantity ? pdtQuantity.trim() : '',
            description: description.trim(),
            dtype: dtype ? dtype.trim() : '',
            images: newImages, // 새 이미지 파일만 전송
            user: user,
        };

        setIsLoading(true);
        try {
            if (id) {
                // 수정 모드: 기존 상품 삭제 후 새 상품 등록
                await postsAPI.deleteItem(id, user);
                await postsAPI.registItems(newItem);
                alert('상품이 수정되었습니다.');
            } else {
                // 신규 등록
                await postsAPI.registItems(newItem);
                alert('상품이 등록되었습니다.');
            }
            navigate('/items');
        } catch (error) {
            console.error('상품 등록/수정 오류:', error);
            alert('상품 등록/수정에 실패했습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    // 새 이미지 업로드 핸들러 (File 객체만 newImages 배열에 추가)
    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        setNewImages(prev => [...prev, ...files]);
    };

    // newImages 배열에서 이미지 삭제 핸들러
    const handleImageDelete = (index) => {
        setNewImages(prev => prev.filter((_, i) => i !== index));
    };

    return (
        <Container className="py-4 item-registration-container" style={{ display: 'flex', flexDirection: 'column' }}>
            <h2>{id ? '상품 수정' : '새 상품 등록'}</h2>
            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                    <Form.Label>상품 이름 *</Form.Label>
                    <Form.Control
                        type="text"
                        value={pdtName}
                        onChange={(e) => setPdtName(e.target.value)}
                        placeholder="상품 이름을 입력하세요"
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>카테고리 *</Form.Label>
                    <Form.Select value={dtype} onChange={(e) => setDtype(e.target.value)} required>
                        <option value="">카테고리를 선택하세요</option>
                        <option value="디지털기기">디지털기기</option>
                        <option value="가구/인테리어">가구/인테리어</option>
                        <option value="의류">의류</option>
                        <option value="생활가전">생활가전</option>
                        <option value="뷰티/미용">뷰티/미용</option>
                        <option value="기타">기타</option>
                    </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>가격 *</Form.Label>
                    <Form.Control
                        type="number"
                        value={pdtPrice}
                        onChange={(e) => setPdtPrice(e.target.value)}
                        placeholder="가격을 입력하세요"
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>택배비 *</Form.Label>
                    <Form.Select required>
                        <option value="3000">₩3,000</option>
                    </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>상품 설명 *</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={5}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="상품 설명을 입력하세요"
                        required
                    />
                </Form.Group>

                {/* 수정 모드: 기존 이미지 보여주기 (읽기 전용) */}
                {id && existingImages.length > 0 && (
                    <Form.Group className="mb-3">
                        <Form.Label>기존 이미지 (수정 시 모두 제거됩니다)</Form.Label>
                        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                            {existingImages.map((url, idx) => (
                                <div key={idx} className="image-preview-container">
                                    <Image src={url} alt={`existing-${idx}`} thumbnail width={100} />
                                </div>
                            ))}
                        </div>
                    </Form.Group>
                )}

                {/* 새 이미지 업로드: 수정 시 반드시 새 이미지를 업로드해야 함 */}
                <Form.Group className="mb-3">
                    <Form.Label>새 이미지 첨부 (기존 이미지는 제거됩니다)</Form.Label>
                    <Form.Control type="file" multiple onChange={handleImageUpload} />
                </Form.Group>

                {newImages.length > 0 && (
                    <Form.Group className="mb-3">
                        <Form.Label>업로드할 새 이미지</Form.Label>
                        <div>
                            {newImages.map((file, index) => (
                                <div key={index} className="image-preview-container" style={{ marginBottom: '10px' }}>
                                    <Image src={URL.createObjectURL(file)} alt={`new-${index}`} thumbnail width={100} />
                                    <Button variant="danger" onClick={() => handleImageDelete(index)} className="ms-2">
                                        삭제
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </Form.Group>
                )}

                <Row>
                    <Col className="d-flex justify-content-end gap-2">
                        <Button variant="secondary" onClick={() => navigate('/items')}>
                            취소
                        </Button>
                        <Button variant="primary" type="submit" disabled={isLoading}>
                            {isLoading ? '처리중...' : (id ? '수정하기' : '작성하기')}
                        </Button>
                    </Col>
                </Row>
            </Form>
        </Container>
    );
}

export default ItemRegistration;
