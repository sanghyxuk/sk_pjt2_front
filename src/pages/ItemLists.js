// src/pages/ItemLists.js
import React, { useState, useEffect } from 'react';
import { Container, Button, Form, InputGroup, Row, Col } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { items } from '../data/dummyData';
import Pagination from '../components/Pagination';
import '../styles/common.css';
import '../styles/ItemLists.css';

function ItemLists() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const searchParams = new URLSearchParams(location.search);

  const [filteredItems, setFilteredItems] = useState([]);
  const [searchType, setSearchType] = useState(searchParams.get('type') || 'title');
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page')) || 0);
  const [totalPages, setTotalPages] = useState(0);
  const [itemsPerPage] = useState(4);

  useEffect(() => {
    loadPosts(currentPage);
  }, [location.search, user]);

  const loadPosts = (page) => {
    const startIndex = page * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    const filtered = items.filter(item => {
      if (searchType === 'title') {
        return item.title.toLowerCase().includes(searchTerm.toLowerCase());
      } else if (searchType === 'content') {
        return item.content && item.content.toLowerCase().includes(searchTerm.toLowerCase());
      } else if (searchType === 'titleContent') {
        return (
            item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (item.content && item.content.toLowerCase().includes(searchTerm.toLowerCase()))
        );
      } else if (searchType === 'author') {
        return item.author && item.author.toLowerCase().includes(searchTerm.toLowerCase());
      }
      return false;
    });

    const paginatedItems = filtered.slice(startIndex, endIndex);
    setFilteredItems(paginatedItems);
    setTotalPages(Math.ceil(filtered.length / itemsPerPage));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();

    if (searchTerm.trim()) {
      params.set('type', searchType);
      params.set('search', searchTerm.trim());
      params.set('page', '0');
      navigate(`/items?${params.toString()}`);
    } else {
      navigate('/items');
    }
  };

  const handlePageChange = (pageNumber) => {
    const params = new URLSearchParams(location.search);
    params.set('page', pageNumber - 1);
    navigate(`${location.pathname}?${params.toString()}`);
    setCurrentPage(pageNumber - 1);
  };

  const handleWriteClick = () => {
    navigate('/items/write');
  };

  return (
      <Container className="py-5" style={{display: 'flex', flexDirection: 'column'}}>
        <h2 className="mb-4">모든 상품</h2>

        {/* 검색 폼 */}
        <Form onSubmit={handleSearch} className="mb-4">
          <Row className="align-items-center">
            <Col md={3}>
              <Form.Select
                  value={searchType}
                  onChange={(e) => setSearchType(e.target.value)}
                  className="mb-2 mb-md-0"
              >
                <option value="title">상품이름</option>
                <option value="content">내용</option>
                <option value="titleContent">상품이름+내용</option>
                <option value="author">작성자</option>
              </Form.Select>
            </Col>
            <Col md={9}>
              <InputGroup>
                <Form.Control
                    type="text"
                    placeholder="검색어를 입력하세요"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Button type="submit" variant="primary">
                  <FaSearch/> 검색
                </Button>
              </InputGroup>
            </Col>
          </Row>
        </Form>

        {/* 등록하기 버튼 */}
        <div className="d-flex justify-content-end mb-3">
          {(
              //{user && (
              <Button variant="primary" onClick={handleWriteClick} style={{ minWidth: "150px" }}>
                상품등록하기
              </Button>
          )}
        </div>

        {/* 카드 형식의 상품 목록 */}
        <div className="product-list">
          {Array.isArray(filteredItems) && filteredItems.length > 0 ? (
              filteredItems.map((item) => (
                  <div className="product-card" key={item.itemId}>
                    {item.discount && (
                        <div className="discount">-{item.discount}%</div>
                    )}
                    <Link to={`/items/${item.itemId}`}>
                      <img src={item.images || 'default-image-url.jpg'} alt={item.title}/>
                      <h5>{item.title}</h5>
                      <div className="price">${item.price}</div>
                      <div className="rating">⭐ {item.rating || 0}</div>
                    </Link>
                    <Button className="btn-add-to-cart">찜해두기</Button>
                  </div>
              ))
          ) : (
              <div className="text-center py-4">
                상품이 없습니다.
              </div>
          )}
        </Container>
      </div>
  );
}

export default ItemLists;
