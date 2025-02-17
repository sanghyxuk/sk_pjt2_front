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
  const [page, setPage] = useState(2);
  const [size, setSize] = useState(6);
  const [itemsPerPage] = useState(6); // 페이지당 아이템 수 정의
  const [totalPages, setTotalPages] = useState(1); // 총 페이지 수 정의

  useEffect(() => {
    console.log("출력중");
    const fetchHomeData = async () => {
      try {
        setLoading(true);

        // getItemsList API 호출
        const response = await postsAPI.getitemList(0, size);
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
      const response = await postsAPI.searchPosts(searchKeyword, searchPage, itemsPerPage);

      if (response?.data?.products) {
        const searchResults = response.data.products.map((searchitem) => ({
          itemId: searchitem.pdtId,
          title: searchitem.pdtName,
          itemprice: searchitem.price,
          image: searchitem.imageUrl?.[0] || '알 수 없음',
        }));

        setHomeData(prevData => ({
          ...prevData,
          searchResults: searchResults,
        }));

        // 검색 결과의 길이를 사용하여 총 페이지 수 계산
        const totalCount = searchResults.length; // 검색 결과의 길이
        const calculatedTotalPages = Math.ceil(totalCount / itemsPerPage); // 총 페이지 수 계산
        setTotalPages(calculatedTotalPages); // 총 페이지 수 설정
        console.log('Total Pages:', calculatedTotalPages, totalCount, itemsPerPage); // 로그 출력
      } else {
        setHomeData(prevData => ({
          ...prevData,
          searchResults: [],
        }));
        setTotalPages(0); // 검색 결과가 없을 경우 총 페이지 수 초기화
      }
    } catch (err) {
      setError(err);
      console.error('Error fetching search results:', err);
      setHomeData(prevData => ({
        ...prevData,
        searchResults: [],
      }));
      setTotalPages(0); // 오류 발생 시 총 페이지 수 초기화
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
    //totalPages,
    handleSearch,
  };
}
