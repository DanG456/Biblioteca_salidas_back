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

const createNewUser = user => `
INSERT INTO users
    user_name,
    password,
    email,
    phone_number
VALUES
(   '${user.user_name}',
    '${user.password}',
    '${user.email}',
    '${user.phone_number}'
)
`

module.exports = {
    doLogin,
    createNewUser
}