const { AuthHandler } = require("genius-utils");

const JWT_SECRET = process.env.JWT_SECRET;

exports.checkToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ 
            status: 401,
            message: 'Access denied. No token provided!' 
        });
    }

    if (!authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ 
            status: 401,
            message: 'Invalid token format. Use Bearer token!' 
        });
    }

    const token = authHeader.split(' ')[1];
    const result = AuthHandler.verifyJwtToken(token, JWT_SECRET);

    if (result.status != 200) {
        return res.status(result.status).json(result);
    }

    next();
}
