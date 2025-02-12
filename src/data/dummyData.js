// data/dummyData.js
export const users = [
    {
        userId: 1,
        username: 'user1',
        email: 'user1@example.com',
        password: 'password123',
    },
    {
        userId: 2,
        username: 'user2',
        email: 'user2@example.com',
        password: 'password123',
    },
    {
        userId: 3,
        username: 'user3',
        email: 'user3@example.com',
        password: 'password123',
    },
];

export const items = [
    {
        itemId: 1,
        userId: 1,
        title: '첫 번째 아이템',
        price: '11111',
        content: '이것은 첫 번째 아이템의 내용입니다.',
        images: ['https://via.placeholder.com/150', 'https://via.placeholder.com/150'],
    },
    {
        itemId: 2,
        userId: 2,
        title: '두 번째 아이템',
        price: '11111',
        content: '이것은 두 번째 아이템의 내용입니다.',
        images: ['https://via.placeholder.com/150'],
    },
    {
        itemId: 3,
        userId: 1,
        title: '세 번째 아이템',
        price: '11111',
        content: '이것은 세 번째 아이템의 내용입니다.',
        images: [],
    },
    {
        itemId: 4,
        userId: 3,
        title: '네 번째 아이템',
        price: '11111',
        content: '이것은 네 번째 아이템의 내용입니다.',
        images: ['https://via.placeholder.com/150', 'https://via.placeholder.com/150', 'https://via.placeholder.com/150'],
    },
    {
        itemId: 5,
        userId: 2,
        title: '다섯 번째 아이템',
        price: '11111',
        content: '이것은 다섯 번째 아이템의 내용입니다.',
        images: [],
    },
];
