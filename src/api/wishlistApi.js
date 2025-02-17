// src/api/wishlistApi.js
import api from "./axios";

export const getWishlistItems = async (page = 1, size = 3, authData) => {
    try {
        const response = await api.get('/myPage/wishList', {
            params: { page, size },
            headers: {
                "X-Auth-User": authData.email,
                "Authorization": authData.accessToken
            }
        });
        console.log('Using headers:', {
            "X-Auth-User": authData.email,
            "Authorization": authData.accessToken
        });
        console.log('page:', page, 'size:', size);
        return response.data;
    } catch (error) {
        console.error("찜한 상품을 불러오는 중 오류 발생:", error);
        return { totalPages: 0, wishlist: [] };
    }
};

// (옵션) 찜 목록에서 삭제
export const removeWishlistItem = async (page = 1, size = 8, authData, itemId) => {
    try {
        await api.delete('/myPage/wishList', {
            params: { page, size, itemId },
            headers: {
                "X-Auth-User": authData.email,
                "Authorization": authData.accessToken
            }
        });
    } catch (error) {
        console.error("찜한 상품 삭제 중 오류 발생:", error);
    }
};
