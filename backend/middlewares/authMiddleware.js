const jwt = require('jsonwebtoken');

const authMiddleware = async (req, res, next)=>{
    const authHeader = req.headers.authorization;
    if(!authHeader?.startsWith('Bearer ')){
        return res.status(401).json({ message: 'No Token Provided' });
    }

    const token = authHeader.split(' ')[1];
    if (!token){ 
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // console.log("decoded", decoded);
        req.user = decoded;

        next();
    } catch (err) {
        res.status(401).json({ message: 'Invalid or Expired Token' });
    }
};

module.exports = { authMiddleware };