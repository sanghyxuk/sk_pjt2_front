import { useState, useEffect } from 'react';
import { postsAPI } from '../api/posts'; // postsAPI 경로 확인

export function useHomeData() {
  const [homeData, setHomeData] = useState({
    recentItems: [],
    searchResults: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [keyword, setKeyword] = useState('');
  const [page, setPage] = useState(0); // 기본 페이지 인덱스 (0-based)
  const [size, setSize] = useState(6); // 한 페이지당 아이템 수 (server-side)


  const [totalPages, setTotalPages] = useState(0);

  //최근 아이템 데이터
  useEffect(() => {
    console.log("출력중 - recent items");
    const fetchHomeData = async () => {
      try {
        setLoading(true);
        const response = await postsAPI.getitemList(0, size);
        console.log('API Response:', response);

        const recentItems = response?.products?.map(item => ({
          itemId: item.pdtId,
          title: item.pdtName,
          itemprice: item.price,
          image: item.imageUrl?.[0] || '알 수 없음'
        })) || [];

        setHomeData(prevData => ({
          ...prevData,
          recentItems: recentItems,
        }));
      } catch (err) {
        setError(err);
        console.error('Error fetching home data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, [size]);

  // 검색기능
  const handleSearch = async (searchKeyword, searchPage = 0) => {
    try {
      setLoading(true);

      const response = await postsAPI.searchPosts(searchKeyword, searchPage, size);

      if (response?.data?.products) {
        const searchResults = response.data.products.map(item => ({
          itemId: item.pdtId,
          title: item.pdtName,
          itemprice: item.price,
          image: item.imageUrl?.[0] || '알 수 없음',
        }));

        setHomeData(prevData => ({
          ...prevData,
          searchResults: searchResults,
        }));

        const serverTotalPages = response.data.totalPages;
        console.log('serverTotalPages from response:', serverTotalPages);
        setTotalPages(serverTotalPages);

      } else {
        setHomeData(prevData => ({
          ...prevData,
          searchResults: [],
        }));
        setTotalPages(0);
      }
    } catch (err) {
      setError(err);
      console.error('Error fetching search results:', err);
      setHomeData(prevData => ({
        ...prevData,
        searchResults: [],
      }));
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  };

  // 카테고리 데이터 가져오기
  const fetchCategoryData = async (category, page = 0) => {
    try {
      setLoading(true);
      const response = await postsAPI.getcategoryList(category, page, size);

      if (response?.products) {
        const categoryResults = response.products.map(item => ({
          itemId: item.pdtId,
          title: item.pdtName,
          itemprice: item.price,
          image: item.imageUrl?.[0] || '알 수 없음',
        }));

        setHomeData(prevData => ({
          ...prevData,
          searchResults: categoryResults,
        }));

        const serverTotalPages = response.totalPages;
        console.log('serverTotalPages from category response:', serverTotalPages);
        setTotalPages(serverTotalPages);
      } else {
        setHomeData(prevData => ({
          ...prevData,
          searchResults: [],
        }));
        setTotalPages(0);
      }
    } catch (err) {
      setError(err);
      console.error('Error fetching category results:', err);
      setHomeData(prevData => ({
        ...prevData,
        searchResults: [],
      }));
      setTotalPages(0);
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
    totalPages,
    handleSearch,
    fetchCategoryData,
  };

}