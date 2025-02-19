import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Row, Col, Image } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
//import { items } from '../data/dummyData'; // 더미 데이터 임포트
import { postsAPI } from '../api/posts';
import '../styles/ItemWriteEdit.css';
import {getWishlistItems} from "../api/wishlistApi"; // CSS 파일 추가

function ItemRegistration() {
  const { id } = useParams(); // 수정 모드일 경우 게시글 ID
  const navigate = useNavigate();
  const { user } = useAuth();
  const [pdtPrice, setPdtPrice] = useState('');
  const [pdtName, setPdtName] = useState('');
  const [pdtQuantity, setPdtQuantity] = useState('');
  const [description, setDescription] = useState('');
  const [dtype, setDtype] = useState('');
  const [images, setImages] = useState([]);
  const [files, setFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // 수정 모드일 경우 기존 아이템 데이터 로드
  useEffect(() => {
    if (id) {
      loadPost();
    }
  }, [id]);

  const loadPost = async () => {
    try {
      const response = await postsAPI.getPostDetail(id);
      if (response?.data?.post) {
        const post = response.data.post;
        // userId를 Number로 변환하여 비교
        if (Number(user?.userId) !== Number(post.userId)) {
          alert('수정 권한이 없습니다.');
          navigate('/items');
          return;
        }
        setPdtName(post.pdtName);
        setPdtQuantity(post.pdtQuantity);
        setPdtPrice(post.pdtPrice)
      }
    } catch (error) {
      console.error('Error loading post:', error);
      alert('게시글을 불러오는데 실패했습니다.');
      navigate('/items');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("서버로 보낼 dtype 값:", dtype); // 콘솔에 dtype 값 출력

    if (!user) {
      alert('로그인이 필요합니다.');
      navigate('/login');
      return;
    }

    if (!pdtName.trim() || !description.trim()) {
      alert('상품이름과 설명을 모두 입력해주세요.');
      return;
    }

    /**
     setIsLoading(true);
     try {
     if (id) {
     // 수정 모드
     await postsAPI.updatePost(id, title.trim(), content.trim());
     alert('게시글이 수정되었습니다.');
     } else {
     // 새 글 작성 모드
     await postsAPI.createPost(title, content, files.length > 0 ? files : null);
     alert('게시글이 작성되었습니다.');
     }
     navigate('/items');
     } catch (error) {
     console.error('Error saving post:', error);
     alert(id ? '게시글 수정에 실패했습니다.' : '게시글 작성에 실패했습니다.');
     } finally {
     setIsLoading(false);
     }
     */
    console.log(user);
    // 더미 데이터에 새 아이템 추가
    const newItem = {
      pdtPrice: pdtPrice.trim(),
      pdtName: pdtName.trim(),
      pdtQuantity: pdtQuantity.trim(),
      description: description.trim(),
      dtype: dtype.trim(),
      images: images,
      user: user,
    };

    // 실제 구현에서는 API 호출로 서버에 아이템을 저장해야 합니다.
    postsAPI.registItems(newItem)

    //->json으로

    //items.push(newItem); // 더미 데이터에 추가
    alert('아이템이 작성되었습니다.');
    navigate('/items'); // 아이템 목록으로 이동
  };

  // 이미지 삭제 핸들러
  const handleImageDelete = (index) => {
    const updatedImages = images.filter((_, i) => i !== index); // 선택한 이미지 삭제
    setImages(updatedImages);
  };

  // 이미지 업로드 저장소
  const handleImageUpload = (e) => {
    const newImages = Array.from(e.target.files);
    setImages((prevImages) => [...prevImages, ...newImages]); // 기존 이미지를 유지하고 새 이미지를 추가
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
            />
          </Form.Group>

          {!id && ( // 새 글 작성시에만 파일 업로드 가능
              <Form.Group className="mb-3">
                <Form.Label>파일 첨부</Form.Label>
                <Form.Control
                    type="file"
                    multiple
                    onChange={handleImageUpload} // 이미지 업로드 핸들러 연결
                />
              </Form.Group>
          )}

          {/* 이미지 미리보기 및 삭제 */}
          <Form.Group className="mb-3">
            <Form.Label>첨부된 이미지</Form.Label>
            <div>
              {images.map((image, index) => (
                  <div key={index} className="image-preview-container">
                    <Image src={URL.createObjectURL(image)} alt="preview" thumbnail width={100} />
                    <Button variant="danger" onClick={() => handleImageDelete(index)} className="ms-2">
                      삭제
                    </Button>
                  </div>
              ))}
            </div>
          </Form.Group>

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