const prisma = require('../config/prisma');

// Create board
const createBoard = async (req, res)=>{
    try {
        const { title, description } = req.body;
        if(!title){
            return res.status(404).json({ messsage: 'Title is required' });
        }

        const userId = req.user.userId;
        const workSpaceId = req.params.workSpaceId;
        if(!workSpaceId){
            return res.status(404).json({ message: 'WorkSpace is required' });
        }

        // Check workSpace exist
        const workSpace = await prisma.workspace.findUnique({
            where: { id: workSpaceId },
            select: { ownerId: true }
        });

        if(!workSpace){
            return res.status(404).json({ message: 'WorkSpace not found' });
        }

        if(workSpace.ownerId !== userId){
            return res.status(404).json({ message: 'Only Owner can create a Board' });
        }

        const board = await prisma.board.create({
            data: {
                title,
                description,
                workspace: { connect: { id: workSpaceId } },
                createdBy: { connect: { id: userId } }
            }
        });

        res.status(201).json({ message: 'Board Created Successfully', board });
    } catch (err) {
        console.log("Server Error", err);
        res.status(500).json({ message: 'Something went wrong' });
    }
};

// Get details of Board
const getBoardDetails = async (req, res)=>{
    try {
        const boardId = req.params.boardId;
        if(!boardId){
            return res.status(404).json({ message: 'BoardId is required' });
        }

        const getBoard = await prisma.board.findUnique({
            where: { id: boardId }
        });

        res.status(200).json({ message: 'Board Fetched Successfully', board: getBoard });
    } catch (err) {
        console.log("Server Error", err);
        res.status(500).json({ message: 'Something went wrong' });
    }
};

module.exports = { createBoard, getBoardDetails };