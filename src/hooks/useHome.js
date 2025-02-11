import { useState, useEffect } from 'react';
import { items } from '../data/dummyData'; // 더미 데이터 임포트

export function useHomeData() {
  const [homeData, setHomeData] = useState({
    recentItems: []  // 최근 아이템 리스트 (게시글 포함)
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHomeData = () => {
      try {
        setLoading(true);

        // 더미 데이터에서 최근 아이템(게시글)을 가져옴
        const recentItems = items.slice(-5).map(item => ({
          itemId: item.itemId,
          title: item.title,
          content: item.content,
          nickname: item.nickname || '알 수 없음' // 사용자 정보가 없으므로 기본값 설정
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