import api from './axios';

export const getMySaleItems = async (page = 1, size = 3, authData) => {
    try {
        const response = await api.get('/myPage/mySale', {
            params: { page, size },
            headers: {
                'X-Auth-User': authData.email,
                'Authorization': authData.accessToken,
            },
        });
        console.log('Using headers:', {
            "X-Auth-User": authData.email,
            "Authorization": authData.accessToken
        });
        console.log('page:', page, 'size:', size);
        return response.data;
    } catch (error) {
        console.error('판매한 물품을 불러오는 중 오류 발생:', error);
        return { totalPages: 0, sales: [] };
    }
};
