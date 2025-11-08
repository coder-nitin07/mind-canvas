const express = require('express');
const http = require('http');
const { initializeSocket } = require('./socket');
const app = express();
const prisma = require('./config/prisma');
const { authRouter } = require('./routes/authRoutes');
const { workSpaceRouter } = require('./routes/workSpaceRoutes');
const { workSpaceMembersRouter } = require('./routes/workSpaceMemberRoutes');
const { boardRouter } = require('./routes/boardRoutes');
const { noteRouter } = require('./routes/noteRoutes');
const cors = require('cors');
require('dotenv').config();

app.use(express.json());

// cors 
app.use(cors());

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
app.use('/workSpace', workSpaceRouter);
app.use('/workSpaceMembers', workSpaceMembersRouter);
app.use('/board', boardRouter);
app.use('/note', noteRouter);

// create http server
const server = http.createServer(app);
const io = initializeSocket(server);

// make io accessible in controllers if needed
app.set('io', io);

app.get('/', (req, res) => {
    res.send('MindCanvas Project Working');
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log('Server is running on PORT', PORT);
});