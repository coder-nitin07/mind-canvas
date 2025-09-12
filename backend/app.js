const express = require('express');
const app = express();
const prisma = require('./config/prisma');
const { authRouter } = require('./routes/authRoutes');
require('dotenv').config();

app.use(express.json());

(async ()=>{
    try {
        await prisma.$connect();
        console.log('Prisma Connected Successfully');
    } catch (err) {
        console.log('Prisma Connection Failed', err);
    }
})();

// routes
app.use('/auth', authRouter);

app.get('/', (req, res) => {
    res.send('MindCanvas Project Working');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log('Server is running on PORT', PORT);
});
