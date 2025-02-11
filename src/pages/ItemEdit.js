import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Card, Alert } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { items } from '../data/dummyData';
import '../styles/ItemWriteEdit.css';

function ItemEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);

  useEffect(() => {
    const item = items.find(item => item.itemId === parseInt(id));
    if (!item) {
      alert('게시글을 찾을 수 없습니다.');
      navigate('/items');
      return;
    }

    if (!user || user.userId !== item.userId) {
      alert('수정 권한이 없습니다.');
      navigate('/items');
      return;
    }

    setTitle(item.title);
    setContent(item.content);
    if (item.images) {
      setPreviews(item.images);
      setImages(item.images);
    }
  }, [id, user, navigate]);

  const handleImageChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setImages(selectedFiles);
    setPreviews(selectedFiles.map(file => URL.createObjectURL(file)));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      alert('제목과 내용을 모두 입력해주세요.');
      return;
    }

    // 실제 구현시에는 API 호출
    /**
    const updatedPost = {
      boardId: parseInt(id),
      userId: user.userId,
      title: title.trim(),
      content: content.trim(),
      images: images, // 수정된 이미지 포함
    };
    */

        // 더미 데이터에서 아이템 수정
    const updatedItem = {
          itemId: parseInt(id),
          userId: user.userId,
          title: title.trim(),
          content: content.trim(),
        };

    const index = items.findIndex(item => item.itemId === parseInt(id));
    if (index !== -1) {
      items[index] = updatedItem; // 수정된 아이템으로 업데이트
    }

    // 수정 완료 후 상세 페이지로 이동
    navigate(`/items/${id}`);
  };

  return (
      <Container className="py-5">
        <Card>
          <Card.Header>
            <h4>게시글 수정</h4>
          </Card.Header>
          <Card.Body>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>제목</Form.Label>
                <Form.Control
                    type="text"
                    placeholder="제목을 입력하세요"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>내용</Form.Label>
                <Form.Control
                    as="textarea"
                    rows={10}
                    placeholder="내용을 입력하세요"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>이미지 첨부</Form.Label>
                <Form.Control
                    type="file"
                    multiple
                    onChange={handleImageChange}
                />
                {previews.length > 0 && (
                    <div className="image-previews mt-3">
                      {previews.map((preview, index) => (
                          <img
                              key={index}
                              src={preview}
                              alt={`preview-${index}`}
                              className="img-thumbnail"
                              style={{ width: '100px', marginRight: '10px' }}
                          />
                      ))}
                    </div>
                )}
              </Form.Group>

              <div className="d-flex justify-content-end gap-2">
                <Button variant="secondary" onClick={() => navigate(`/items/${id}`)}>
                  취소
                </Button>
                <Button variant="primary" type="submit">
                  수정완료
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </Container>
  );
}

export default ItemEdit;
