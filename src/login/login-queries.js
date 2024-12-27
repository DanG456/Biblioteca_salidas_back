const doLogin = user => `
SELECT 
    id,
    username, 
    email, 
    password, 
    phone_number,
FROM
    users
WHERE
    email = '${user}'
`;

module.exports = {doLogin}