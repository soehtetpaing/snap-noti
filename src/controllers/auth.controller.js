const { AuthHandler, CommonHandler, DateTimeHandler } = require("genius-utils");
const { app } = require("../configs/app.config");

const APP_VERSION = process.env.VERSION || app.version;

const JWT_SECRET = process.env.JWT_SECRET;
const REFRESH_SECRET = process.env.REFRESH_SECRET;

exports.generateJwtToken = (req, res) => {
    const requestBody = jwtTokenRequest(req.body);
    const user = requestBody;

    if (user.id == 0 || !user.username) {
        return res.status(401).json({
            status: 401,
            message: "Invalid user credentials!",
            metadata: generateMetadata()
        });
    }

    try {
        const result = AuthHandler.generateJwtToken(user, JWT_SECRET, REFRESH_SECRET);

        return res.status(result.status).json({
            status: result.status,
            message: result.message,
            data: { 
                tokens: result.tokens,
                tokenType: "Bearer",
                expireAt: "15m"
            },
            metadata: generateMetadata()
        });

    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: "Failed to generate jwt tokens!",
            metadata: generateMetadata()
        });
    }
}


// metadata
function generateMetadata() {
    return {
        requestId: CommonHandler.getSyskey(),
        timestamp: DateTimeHandler.getMyanmarDateTime(),
        version: APP_VERSION
    }
}

// private function
function jwtTokenRequest(param = {}) {
    return {
        id: param.id || 0,
        username: param.username || "",
        role: param.role || "",
        tokenVersion: param.tokenVersion || 0
    }
}
