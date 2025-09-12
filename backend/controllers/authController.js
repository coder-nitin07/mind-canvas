const prisma = require('../config/prisma');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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
        
        const { password: _password, ...newUser } = user;
       
        const token = jwt.sign(
            { userId: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(201).json({ message: 'User Created Successfully', user:newUser, token });
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

        const token = jwt.sign(
            { userId: User.id, email: User.email, },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).json({ message: 'User Login Successfully', user: userData, token });
    } catch (err) {
        console.log("Server Error", err);
        res.status(500).json({ message: 'Something went wrong' });
    }
};

module.exports = { register, login };