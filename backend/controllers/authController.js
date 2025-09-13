const prisma = require('../config/prisma');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const generateTokens = require('../utils/generateTokens');

// register api
const register = async (req, res)=>{
    try {
        const { name, email, password } = req.body;

        if(!name || !email || !password){
            return res.status(400).json({ message: 'Please fill all the fields' });
        }

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if(existingUser){
            return res.status(400).json({ message: 'Invalid Credentials' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword
            }
        });

        const { accessToken, refreshToken } = await generateTokens(user);

        // Store token with their expiry
        // await prisma.refreshToken.create({
        //     data: {
        //         token: refreshToken,
        //         userId: user.id,

        //         expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        //     }
        // });
        
        const { password: _password, ...newUser } = user;

        res.status(201).json({ message: 'User Created Successfully', user:newUser, accessToken, refreshToken });
    } catch (err) {
        console.log('Server error', err);
        res.status(500).json({ message: 'Something went wrong' });
    }
};

// login API
const login  = async (req, res)=>{
    try {
        const { email,password } = req.body;
        
        if(!email || !password){
            return res.status(400).json({ message: 'Please fill all the fields' });
        }

        const User = await prisma.user.findUnique({ where: { email } });
        if(!User){
            return res.status(400).json({ message: 'User not exist' });
        }

        const comparePassword = await bcrypt.compare(password, User.password);
        if(!comparePassword){
            return res.status(400).json({ message: 'Invalid Credentials' });
        }

        const { password: _password, ...userData } = User;

        const { accessToken, refreshToken } = await generateTokens(User);

        // Store token with their expiry
        // await prisma.refreshToken.create({
        //     data: {
        //         token: refreshToken,
        //         userId: User.id,

        //         expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        //     }
        // });

        res.status(200).json({ message: 'User Login Successfully', user: userData, accessToken, refreshToken });
    } catch (err) {
        console.log("Server Error", err);
        res.status(500).json({ message: 'Something went wrong' });
    }
};

// refreshAccessToken
const refreshAccessToken = async (req, res)=>{
    try {
        const { refreshToken } = req.body;
        if(!refreshToken){
            return res.status(400).json({ message: 'Refresh Token required' });
        }

        // Check token exists in DB and not expired
        const storedToken = await prisma.refreshToken.findUnique({
            where: { token: refreshToken }
        });
        if(!storedToken || storedToken.expiresAt < new Date()){
            return res.status(401).json({ message: 'Invalid or expired refresh token' });
        }

        // verify refresh token signature
        const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);

        
        //  Generate New Access Token
        const accessToken = jwt.sign(
            { userId: decoded.userId },
            process.env.JWT_SECRET,
            { expiresIn: '15m' }
        );

        res.json({ accessToken });
    } catch (err) {
        console.log('Server Error', err);
        res.status(401).json({ message: 'Invalid or Expired refresh Token' });
    }
};


// logout API
const logout = async (req, res)=>{
    try {
        const { refreshToken } = req.body;
        if(!refreshToken){
            return res.status(400).json({ message: 'Refresh token required' });
        }

        await prisma.refreshToken.deleteMany({
            where: { token: refreshToken }
        });

        res.json({ message: 'Logged Out Sucessfully' });
    } catch (err) {
        console.log('Server Error', err);
        res.status(500).json({ message: 'Something went wrong' });
    }
};

module.exports = { register, login, refreshAccessToken, logout };