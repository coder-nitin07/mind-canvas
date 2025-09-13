const prisma = require('../config/prisma');

// create workspace
const createWorkSpace = async (req, res)=>{
    try {
        const { name, description } = req.body;
        const userId = req.user?.userId;
if (!userId) return res.status(401).json({ message: 'User not found in token' });

        

        if(!name){
            return res.status(400).json({ 
                success: false,
                message: 'Please filled all the required fields' 
            });
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

module.exports = { createWorkSpace };