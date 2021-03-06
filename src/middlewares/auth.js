const jwt = require('jsonwebtoken');

const { User } = require('../models');
const { sendErrorResponse } = require('../helpers');

const userAuth = async (req, res, next) => {
    try {
        if (
            req.header('Authorization') === undefined ||
            req.header('Authorization').split(' ')[1] === 'undefined'
        ) {
            return sendErrorResponse(res, 401, 'Token must be provided');
        }
        const token = req.header('Authorization').split(' ')[1];
        const decoded = jwt.verify(token, 'secret');

        const user = await User.findById(decoded._id);
        if (!user) {
            return sendErrorResponse(res, 401, 'Invalid token');
        }

        req.user = user;
        req.token = token;
        next();
    } catch (err) {
        sendErrorResponse(res, 401, err);
    }
};

module.exports = userAuth;
