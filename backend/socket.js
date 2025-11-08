const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');

const initializeSocket = (server)=>{
    const io = new Server(server, {
        cors: {
            origin: 'http://localhost:5173',
            methods: [ 'GET', 'POST' ],
            credentials: true
        }
    });

    // Middleware for authorizwtion
    io.use((socket, next)=>{
        try {
            const token = socket.handshake.auth?.token;
            if (!token) return next(new Error('No token provided'));
            
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            socket.user = decoded;
            next();
        } catch (err) {
            console.error('Socket auth failed:', err.message);
            next(new Error('Authentication failed'));
        }
    });

    io.on('connection', (socket) => {
        console.log('New client connected:', socket.user?.email);

        // join room for board
        const { boardId } = socket.handshake.query;
        if (boardId) {
        socket.join(boardId);
        console.log(`User ${ socket.user?.email } joined board ${ boardId }`);
        }

        // handle disconnect
        socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.user?.email);
        });
    });

    return io;
};

module.exports = { initializeSocket  };