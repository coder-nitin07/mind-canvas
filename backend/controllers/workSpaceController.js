const prisma = require('../config/prisma');

// create workspace
const createWorkSpace = async (req, res) => {
    try {
        const { name, description } = req.body;
        if (!name) {
            return res.status(400).json({
                success: false,
                message: 'Please filled all the required fields'
            });
        }

        const userId = req.user?.userId;
        if (!userId) {
            return res.status(401).json({ message: 'User not found in token' });
        }

        // crete workspace and add owner as creator
        const result = await prisma.$transaction(async (tx) => {
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
const getWorkSpace = async (req, res) => {
    try {
        const workSpaceId = req.params.id;

        const workSpace = await prisma.workspace.findUnique({
            where: { id: workSpaceId },
            include: {
                owner: true,
                members: { include: { user: true } },
                boards: true
            }
        });

        if (!workSpace) {
            return res.status(404).json({ message: 'WorkSpace not found' });
        }

        res.status(200).json({ message: 'Fetched the WorkSpace Successfully', workSpace });
    } catch (err) {
        console.log("Server Error", err);
        res.status(500).json({ message: 'Something went wrong' });
    }
};

// List User WorkSpace
const getUserWorkSpace = async (req, res) => {
    try {
        const userId = req.user.userId;
        if (!userId) {
            return res.status(404).json({ message: 'User not found in token' });
        }

        const workSpace = await prisma.workspace.findMany({
            where: {
                OR: [
                    { ownerId: userId },
                    { members: { some: { userId } } }
                ]
            },
            select: {
                id: true,
                name: true,
                description: true,
                owner: {
                    select: {
                        id: true,
                        name: true
                    }
                },
                members: {
                    select: {
                        id: true,
                        role: true,
                        user: {
                            select: {
                                id: true,
                                name: true
                            }
                        }
                    }
                },
                boards: {
                    select: {
                        id: true,
                        title: true,
                        description: true
                    }
                }
            }
        });

        res.status(200).json({ message: "Fetched User's Workspaces", workSpace });
    } catch (err) {
        console.log("Server Error", err);
        res.status(500).json({ message: 'Something went wrong' });
    }
};

// Update WorkSpace Info
const updateWorkSpace = async (req, res)=>{
    try {
        const { name, description } = req.body;
        const workSpaceId = req.params.id;
        const userId = req.user.userId;

        if(!workSpaceId){
            return res.status(404).json({ message: 'WorkSpace ID not found' });
        }

        // Fetch WorkSpace to check the Owner
        const workSpace = await prisma.workspace.findUnique({
            where: { id: workSpaceId },
            select: { ownerId: true }
        });
        
        if(!workSpace){
            return res.status(404).json({ message: 'WorkSpace not found' });
        }

        // only owner can update
        if(workSpace.ownerId !== userId){
            return res.status(403).json({ message: 'You are not authorized to update this WorkSpace' });
        }

        // Get data for Update
        const updatedData = {};
        if(name) updatedData.name = name;
        if(description) updatedData.description = description;

        if(Object.keys(updatedData).length === 0){
            return res.status(400).json({ message: 'No valid fields provided for updated' });
        }

        const updatedWorkSpace = await prisma.workspace.update({
            where: { id: workSpaceId },
            data: updatedData
        });

        res.status(200).json({ message: 'WorkSpace Updated Successfully', updatedWorkSpace });
    } catch (err) {
        console.log("Server Error", err);
        res.status(500).json({ message: 'Something went wrong' });
    }
};

module.exports = { createWorkSpace, getWorkSpace, getUserWorkSpace, updateWorkSpace };