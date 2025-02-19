import api from './axios';

export const postsAPI = {
    // 아이템 목록 조회 (페이지네이션) - homepage
    getitemList : async (page = 0, size = 10) => {
        console.log("함수실행");
        try {
            // URL 쿼리 파라미터 생성
            const params = new URLSearchParams();
            params.append('page', page);
            params.append('size', size);
            // 요청 보내고 응답 받기
            const response = await api.get(`/home/all?page=${page}&size=${size}`);
            // 응답 데이터 추출
            const data = response.data;
            // 데이터 출력
            console.log("Response Data:", data);
            // 데이터 반환 (필요시 호출한 곳에서 사용할 수 있음)
            return data;
        } catch (error) {
            // 에러 처리
            console.error("Error fetching posts list:", error);
        }
    },

    // 아이템 검색 (검색 타입에 따라 다른 엔드포인트 사용)
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

    //카테고리별로 아이템 조회
    getcategoryList : async (category, page = 0, size = 10) => {
        console.log("함수실행");
        try {
            // URL 쿼리 파라미터 생성
            const params = new URLSearchParams();
            params.append('page', page);
            params.append('size', size);
            params.append('category', category);
            // 요청 보내고 응답 받기
            const response = await api.get(`/home/category?${params.toString()}`);
            // 응답 데이터 추출
            const data = response.data;
            // 데이터 출력
            console.log("Response Data:", data);
            // 데이터 반환 (필요시 호출한 곳에서 사용할 수 있음)
            return data;
        } catch (error) {
            // 에러 처리
            console.error("Error fetching category list:", error);
        }
    },

    // 아이템 등록
    registItems: ({pdtPrice, pdtName, pdtQuantity, description, dtype, images, user}) => {

        const formData = new FormData();
        const jsonData = {
            pdtPrice,
            pdtName,
            pdtQuantity,
            description,
            dtype,
            email: user.email
        };
        formData.append("productDetailJson", JSON.stringify(jsonData));
        console.log("json:" + jsonData);
        if (images.length > 0) {
            images.forEach(file => formData.append('images', file));
        }
        console.log("user정보:" + user);
        return api.post('/pdts/register', formData,{
            headers: {
                "X-Auth-User": user.email,
                "Authorization": user.accessToken,
                'Content-Type': 'multipart/form-data'
            }
        });
    },
    
    // 아이템 삭제 - 오류때문에 수정했음
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

    // 아이템 수정
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

            // post 배열에서 post_id로 매칭
            const likedPosts = response.data.post || [];
            return likedPosts.some(post => {
                // 둘 다 숫자로 변환하여 비교
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

            // users 배열에서 id로 매칭
            const followingUsers = response.data.users || [];
            const isFollowing = followingUsers.some(user => {
                console.log('Comparing usernames:', user.id, targetUsername);
                return user.id === targetUsername;
            });

            // 로컬 스토리지에 상태 저장
            localStorage.setItem(`follow_${currentUsername}_${targetUsername}`, isFollowing);

            return isFollowing;
        } catch (error) {
            console.error('Check follow status error:', error);
            // 로컬 스토리지에서 이전 상태 확인
            return localStorage.getItem(`follow_${currentUsername}_${targetUsername}`) === 'true';
        }
    },

    // 팔로우/언팔로우
    followUser: (username) =>
        api.post('/follow', null, {
            params: { username }
        }),

    // 후기 관련 API 추가
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
