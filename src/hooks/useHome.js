import { useState, useEffect } from 'react';
import { postsAPI } from '../api/posts'; // postsAPI 경로 확인

export function useHomeData() {
  const [homeData, setHomeData] = useState({
    recentItems: [],  // 최근 아이템 리스트
    searchResults: [], // 검색 결과 리스트
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [keyword, setKeyword] = useState('');
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(3);

  useEffect(() => {
    console.log("출력중");
    const fetchHomeData = async () => {
      try {
        setLoading(true);

        // getItemsList API 호출
        const response = await postsAPI.getitemList(0, 4);
        console.log('API Response:', response); // 응답 구조 확인

        // 응답 구조에 맞게 recentItems 설정
        const recentItems = response?.products?.map(item => ({
          itemId: item.pdtId,
          title: item.pdtName,
          itemprice: item.price,
          image: item.imageUrl?.[0] || '알 수 없음'
        })) || [];

        console.log('Extracted Data:', recentItems);

        setHomeData(prevData => ({
          ...prevData,  // 🔥 기존 searchResults 유지
          recentItems: recentItems
        }));

      } catch (err) {
        setError(err);
        console.error('Error fetching home data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  // 🔎 검색 실행 함수
  const handleSearch = async (searchKeyword, searchPage = 0) => {
    try {
      setLoading(true);
      const response = await postsAPI.searchPosts(searchKeyword, searchPage, size);

      if (response?.data?.products) {
        const searchResults = response.data.products.map((searchitem) => ({
          itemId: searchitem.pdtId,
          title: searchitem.pdtName,
          itemprice: searchitem.price,
          image: searchitem.imageUrl?.[0] || '알 수 없음',
        }));

        setHomeData(prevData => ({
          ...prevData,  // 🔥 기존 recentItems 유지
          searchResults: searchResults,
        }));
      } else {
        setHomeData(prevData => ({
          ...prevData,
          searchResults: [],
        }));
      }
    } catch (err) {
      setError(err);
      console.error('Error fetching search results:', err);
      setHomeData(prevData => ({
        ...prevData,
        searchResults: [],
      }));
    } finally {
      setLoading(false);
    }
  };

  return {
    homeData,
    loading,
    error,
    keyword,
    setKeyword,
    page,
    setPage,
    size,
    setSize,
    handleSearch,
  };
}