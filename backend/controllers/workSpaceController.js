const prisma = require('../config/prisma');

// create workspace
const createWorkSpace = async (req, res)=>{
    try {
        const { name, description } = req.body;
        if(!name){
            return res.status(400).json({ 
                success: false,
                message: 'Please filled all the required fields' 
            });
        }

        const userId = req.user?.userId;
        if (!userId){
            return res.status(401).json({ message: 'User not found in token' });
        }

        // crete workspace and add owner as creator
        const result = await prisma.$transaction(async (tx)=>{
            const workspace = await tx.workspace.create({
                data: {
                    name,
                    description,
                    ownerId: userId
                }
            });

            await tx.workspaceMember.create({
                data: {
                    userId,
                    workspaceId: workspace.id,
                    role: 'OWNER'
                }
            });

            return workspace
        });

        res.status(201).json({ 
            success: true,
            message: 'WorkSpace created Successfully',
            data: result
        });
    } catch (err) {
        console.log("Server Error", err);
        res.status(500).json({ success: false, message: 'Something went wrong' });
    }
};

// Get WorkSpace Details
const getWorkSpace = async (req, res)=>{
    try {
        const workSpaceId = req.params.id;
        
        const workSpace = await prisma.workspace.findUnique({
            where: { id: workSpaceId },
            include: {
                owner: true,
                members: { include: { user:true } },
                boards: true
            }
        });

        if(!workSpace){
            return res.status(404).json({ message: 'WorkSpace not found' });
        }

        res.status(200).json({ message: 'Fetched the WorkSpace Successfully', workSpace });
    } catch (err) {
        console.log("Server Error", err);
        res.status(500).json({ message: 'Something went wrong' });
    }
};

module.exports = { createWorkSpace, getWorkSpace };