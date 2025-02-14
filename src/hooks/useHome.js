import { useState, useEffect } from 'react';
//import { items } from '../data/dummyData'; // 더미 데이터 임포트
import { postsAPI } from '../api/posts'; // postsAPI 경로 확인

export function useHomeData() {
  const [homeData, setHomeData] = useState({
    recentItems: []  // 최근 아이템 리스트 (게시글 포함)
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("출력중");
    const fetchHomeData = async () => {
      try {
        setLoading(true);

        // getItemsList API 호출
        const response = await postsAPI.getitemList(0, 5); // 첫 5개 아이템을 요청
        const recentItems = response.data.map(item => ({
          itemId: item.pdtId,
          title: item.pdtName,
          itemprice: item.price,
          image: item.imageUrl[0] || '알 수 없음' // 사용자 정보가 없으면 기본값 설정
        }));



        console.log('Extracted Data:', {
          recentItems
        });

        setHomeData({
          recentItems: recentItems
        });

      } catch (err) {
        setError(err);
        console.error('Error fetching home data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();

    // 주석: 나중에 API를 사용하여 데이터를 가져오고 싶다면 아래와 같이 수정할 수 있습니다.
    /*
    const fetchHomeData = async () => {
      try {
        setLoading(true);

        const recentItemsResponse = await itemsAPI.getRecentItems(); // 최근 아이템 API 호출

        const recentItems = recentItemsResponse?.data || [];

        setHomeData({
          recentItems: recentItems
        });

      } catch (err) {
        setError(err);
        console.error('Error fetching home data:', err);
      } finally {
        setLoading(false);
      }
    };
    */

  }, []);

  return { homeData, loading, error };
}