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

        // Only OWNER and ADMIN create board
        const requestedUserRole = await prisma.workspaceMember.findFirst({
            where: { workspaceId: workSpaceId, userId },
            select: { role: true }
        });

        if(!requestedUserRole || (requestedUserRole.role !== 'OWNER' && requestedUserRole.role !== 'ADMIN')){
            return res.status(404).json({ message: 'You are not authorized to create a Board' });
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
            return res.status(400).json({ message: 'BoardId is required' });
        }

        const getBoard = await prisma.board.findUnique({
            where: { id: boardId },
            select: { id: true, title: true, description: true, workspaceId: true }
        });

        if(!getBoard){
            return res.status(404).json({ message: 'Board not found' });
        }

        const isBoardMember = await prisma.workspaceMember.findFirst({
            where: {
                workspaceId: getBoard.workspaceId,
                userId: req.user.userId
            }
        });

        if(!isBoardMember){
            return res.status(403).json({ message: 'You are not a member of this WorkSpace Board.' })
        }

        res.status(200).json({ message: 'Board Fetched Successfully', board: getBoard });
    } catch (err) {
        console.log("Server Error", err);
        res.status(500).json({ message: 'Something went wrong' });
    }
};

// Get All Boards in a workSpace
const getAllBoards = async (req, res)=>{
    try {
        const workSpaceId = req.params.workSpaceId;
        if(!workSpaceId){
            return res.status(404).json({ message: 'WorkSpaceId is required' });
        }

        const getBoards = await prisma.board.findMany({
            where: { workspaceId: workSpaceId }
        }); 

        if(getBoards.length === 0){
            return res.status(404).json({ message: 'No Boards Found' });
        }

        const isMember = await prisma.workspaceMember.findFirst({
            where: {
                workspaceId: workSpaceId,
                userId: req.user.userId
            }
        });
        if(!isMember){
            return res.status(493).json({ message: 'You are not a member of this workspace' });
        }

        res.status(200).json({ message: 'Fetched All Boards Successfully', boards: getBoards })
    } catch (err) {
        console.log("Server Error", err);
        res.status(500).json({ message: 'Something went wrong' });
    }
};

// Update Board
const updateBoard = async (req, res)=>{
    try {
        const { title, description } = req.body;
        const boardId = req.params.boardId;
        
        if(!boardId){
            return res.status(404).json({ message: 'BoardId required' });
        }

        const getBoard = await prisma.board.findUnique({
            where: { id: boardId }
        });
        if(!getBoard){
            return res.status(404).json({ message: 'Board not found' });
        }

        const isMember = await prisma.workspaceMember.findFirst({
            where: {
                workspaceId: getBoard.workspaceId,
                userId: req.user.userId
            }
        });

        if(!isMember || (isMember.role !== 'OWNER' && isMember.role !== 'ADMIN')){
            return res.status(403).json({ message: 'You are not authorized to update the Board.' });
        }

        const updatedBoard = await prisma.board.update({
            where: { id: boardId },
            data: {
                title,
                description
            }
        });

        res.status(200).json({ message: 'Board Updated Successfully', board: updatedBoard });
    } catch (err) {
        console.log("Server Error", err);
        res.status(500).json({ message: 'Something went wrong' });
    }
};

// Delete Board
const deleteBoard = async (req, res)=>{
    try {
        
    } catch (err) {
        console.log("Server Error", err);
        res.status(500).json({ message: 'Something went wrong' });
    }
};

module.exports = { createBoard, getBoardDetails, getAllBoards, updateBoard };