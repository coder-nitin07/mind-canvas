    const jwt = require('jsonwebtoken');
    const prisma = require('../config/prisma');

    // helper to generate tokens
    async function generateTokens(user){
        const accessToken = jwt.sign(
            { userId: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '15m' }
        );

        const refreshToken = jwt.sign(
            { userId: user.id },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        await prisma.refreshToken.create({
            data:{
                token: refreshToken,
                userId: user.id,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
            }
        });

        return { accessToken, refreshToken }
    };

    module.exports = generateTokens;