// export const hasDeletePermission = (currentUser, authorId) => {
//     if (!currentUser) return false;
//     return currentUser.role === 'ROLE_ADMIN' || Number(currentUser.userId) === Number(authorId);
// };
export const hasDeletePermission = (currentUser, item) => {
    if (!currentUser || !item) return false; // user 또는 item이 없으면 false
    return currentUser.role === 'ROLE_ADMIN' || currentUser.email === item.email;
};
