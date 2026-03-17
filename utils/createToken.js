const jwt = require('jsonwebtoken');

const createToken = (paylod) => {
    return jwt.sign(
        {userId : paylod},
        process.env.JWT_SECRET_KEY,
        {expiresIn : process.env.JWT_SECRET_TIME}
    );
};

module.exports = createToken;