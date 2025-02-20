// src/api/posts.js
import api from './axios';

export const postsAPI = {
    // 아이템 목록 조회 (페이지네이션) - homepage
    getitemList: async (page = 0, size = 10) => {
        console.log("getitemList 함수실행");
        try {
            const params = new URLSearchParams();
            params.append('page', page);
            params.append('size', size);
            const response = await api.get(`/home/all?page=${page}&size=${size}`);
            const data = response.data;
            console.log("Response Data:", data);
            return data;
        } catch (error) {
            console.error("Error fetching posts list:", error);
        }
    },

    // 아이템 검색
    searchPosts: (keyword, page = 0, size = 10) => {
        return api.get(`/home/search?keyword=${keyword}&page=${page}&size=${size}`);
    },

    // 아이템 상세 조회
    getPostDetail: (pdtId, isBackNavigation = false) => {
        const params = new URLSearchParams();
        if (isBackNavigation) {
            params.append('skipCount', 'true');
        }
        return api.get(`/pdts/detail/${pdtId}`);
    },

    // 카테고리별 아이템 조회
    getcategoryList: async (category, page = 0, size = 10) => {
        console.log("getcategoryList 함수실행");
        try {
            const params = new URLSearchParams();
            params.append('page', page);
            params.append('size', size);
            params.append('category', category);
            const response = await api.get(`/home/category?${params.toString()}`);
            const data = response.data;
            console.log("Response Data:", data);
            return data;
        } catch (error) {
            console.error("Error fetching category list:", error);
        }
    },

    // ★ 신규 등록 API (pdtId가 null이면 등록)
    registItems: ({ pdtPrice, pdtName, pdtQuantity, description, dtype, images, user, pdtId }) => {
        const formData = new FormData();
        // 기존 이미지 URL과 새 이미지 File 객체 분리
        const existingImages = images.filter(img => typeof img === 'string');
        const newImages = images.filter(img => img instanceof File);
        // 수정 모드가 아니라면 pdtId는 null
        const jsonData = {
            pdtId: pdtId ?? null,
            pdtPrice,
            pdtName,
            pdtQuantity,
            description,
            dtype,
            email: user.email,
            imageUrls: existingImages
        };
        formData.append("productDetailJson", JSON.stringify(jsonData));
        console.log("registItems json:", JSON.stringify(jsonData));
        if (newImages.length > 0) {
            newImages.forEach(file => formData.append('images', file));
        }
        console.log("registItems user정보:", JSON.stringify(user));
        return api.post('/pdts/register', formData, {
            headers: {
                "X-Auth-User": user.email,
                "Authorization": user.accessToken,
                'Content-Type': 'multipart/form-data'
            }
        });
    },

    // ★ 업데이트 API (수정 모드: pdtId가 존재하는 경우)
    updateItem: ({ pdtPrice, pdtName, pdtQuantity, description, dtype, images, user, pdtId }) => {
        const formData = new FormData();
        // 기존 이미지 URL과 새 이미지 File 객체 분리
        const existingImages = images.filter(img => typeof img === 'string');
        const newImages = images.filter(img => img instanceof File);
        // 수정할 때는 pdtId가 반드시 있어야 함
        const jsonData = {
            pdtId,  // 수정 모드이면 pdtId를 포함
            pdtPrice,
            pdtName,
            pdtQuantity,
            description,
            dtype,
            email: user.email,
            imageUrls: existingImages
        };
        formData.append("productDetailJson", JSON.stringify(jsonData));
        console.log("updateItem json:", JSON.stringify(jsonData));
        if (newImages.length > 0) {
            newImages.forEach(file => formData.append('images', file));
        }
        console.log("updateItem user정보:", JSON.stringify(user));
        // PUT 요청을 통해 업데이트 (엔드포인트: /pdts/update/{pdtId})
        return api.put(`/pdts/update/${pdtId}`, formData, {
            headers: {
                "X-Auth-User": user.email,
                "Authorization": user.accessToken,
                'Content-Type': 'multipart/form-data'
            }
        });
    },

    // 아이템 삭제 API
    deleteItem: async (productId, user) => {
        try {
            console.log("Deleting product:", productId);
            const response = await api.delete(`/pdts/delete/${productId}`, {
                headers: {
                    'X-Auth-User': user.email,
                    'Authorization': user.accessToken,
                },
            });
            return response.data;
        } catch (error) {
            console.error("상품 삭제 실패:", error);
            throw error;
        }
    },

    // 아이템 수정 (기존 updatePost 함수; 필요 시 사용)
    updatePost: (postId, title, content) =>
        api.put(`/posts/update/${postId}?title=${encodeURIComponent(title)}&content=${encodeURIComponent(content)}`),

    // 아이템 찜 상태 확인
    checkLikeStatus: async (postId, username) => {
        try {
            const response = await api.get('/like/post', {
                params: {
                    username: username,
                    size: 100,
                    page: 0
                }
            });
            console.log('Like status response:', response.data);
            const likedPosts = response.data.post || [];
            return likedPosts.some(post => {
                const likedPostId = Number(post.post_id);
                const currentPostId = Number(postId);
                console.log('Comparing postIds:', likedPostId, currentPostId);
                return likedPostId === currentPostId;
            });
        } catch (error) {
            console.error('Check like status error:', error);
            return false;
        }
    },

    // 아이템 좋아요/취소
    likePost: (postId, username) =>
        api.post('/posts/like', null, {
            params: {
                itemId: postId,
                username
            }
        }),

    // 팔로우 상태 확인
    checkFollowStatus: async (currentUsername, targetUsername) => {
        try {
            const response = await api.get('/followingList', {
                params: {
                    username: currentUsername,
                    size: 100,
                    page: 0
                }
            });
            console.log('Follow status response:', response.data);
            const followingUsers = response.data.users || [];
            const isFollowing = followingUsers.some(user => {
                console.log('Comparing usernames:', user.id, targetUsername);
                return user.id === targetUsername;
            });
            localStorage.setItem(`follow_${currentUsername}_${targetUsername}`, isFollowing);
            return isFollowing;
        } catch (error) {
            console.error('Check follow status error:', error);
            return localStorage.getItem(`follow_${currentUsername}_${targetUsername}`) === 'true';
        }
    },

    // 팔로우/언팔로우
    followUser: (username) =>
        api.post('/follow', null, {
            params: { username }
        }),

    // 후기 관련 API
    createComment: (content, postId, username) =>
        api.post(`/api/comments/newcomment?content=${encodeURIComponent(content)}&postId=${postId}&username=${username}`),
    updateComment: (commentId, content) =>
        api.put(`/api/comments/${commentId}?content=${encodeURIComponent(content)}`),
    deleteComment: (commentId, currentUser) => {
        const params = {};
        if (currentUser.role === 'ROLE_ADMIN') {
            params.isAdmin = true;
        }
        return api.delete(`/api/comments/${commentId}`, { params });
    },

    // 전체 게시글 목록 조회 (페이지네이션 없이)
    getAllPosts: () =>
        api.get('/posts/list/all'),

    // 유저 정보 조회
    getUserInfo: (username) =>
        api.get(`/userPage?username=${username}`),

    // 유저가 작성한 게시글 목록 (username으로 검색)
    getUserPosts: (username) =>
        api.get(`/posts/search/username`, {
            params: {
                username: username,
                page: 0,
                size: 100
            }
        }),

    // 팔로워 목록 조회
    getFollowers: (username) =>
        api.get(`/followerList`, {
            params: {
                username: username,
                size: 100,
                page: 0
            }
        }),

    // 팔로잉 목록 조회
    getFollowing: (username) =>
        api.get(`/followingList`, {
            params: {
                username: username,
                size: 100,
                page: 0
            }
        }),
};

export default postsAPI;