const prisma = require('../config/prisma');

// addMemebers In workSpace
const addMemebersInWorkSpace = async (req, res) => {
    try {
        const { email, role } = req.body;
        const workSpaceId = req.params.id;
        const userId = req.user.userId;

        if (!email || !role) {
            return res.status(400).json({ message: 'Please provide email and role of Member' });
        }

        const workSpace = await prisma.workspace.findUnique({
            where: { id: workSpaceId },
            select: { ownerId: true }
        });

        if (!workSpace) {
            return res.status(404).json({ message: 'WorkSpace not found' });
        }

        // only owner can update
        if (workSpace.ownerId !== userId) {
            return res.status(403).json({ message: 'You are not authorized to add Members in this WorkSpace' });
        }

        const invitedMember = await prisma.user.findUnique({ where: { email } });
        if (!invitedMember) {
            return res.status(404).json({ message: 'User not found' });
        }

        // check the member alredy in the workSpace
        const existingMember = await prisma.workspaceMember.findUnique({
            where: {
                userId_workspaceId: {
                    userId: invitedMember.id,
                    workspaceId: workSpaceId
                }
            }
        });

        if (existingMember) {
            return res.status(400).json({ message: 'User Already in the WorkSpace' });
        }

        const addMember = await prisma.workspaceMember.create({
            data: {
                role,
                user: { connect: { id: invitedMember.id } },
                workspace: { connect: { id: workSpaceId } }
            }
        });

        res.status(200).json({ message: 'Member Successfully Added in WorkSpace', workSpace: addMember });
    } catch (err) {
        console.log('Server Error', err);
        res.status(500).json({ message: 'Something went wrong' });
    }
};

// Get All Members of a WorkSpace
const getAllMembers = async (req, res) => {
    try {
        const { id: workspaceId } = req.params;

        const members = await prisma.workspaceMember.findMany({
            where: { workspaceId },
            select: {
                role: true,
                user: { select: { id: true, name: true, email: true } }
            }
        });

        res.status(200).json({ message: 'Members Fetched Successfully', members });
    } catch (err) {
        console.log("Server Error", err);
        res.status(500).json({ message: 'Something went wrong' });
    }
};

// Change a Members role
const updateMemberRole = async (req, res)=>{
    try {
        const workSpaceId = req.params.workSpaceId;
        const memberId = req.params.memberId;
        const userId = req.user.userId;
        const { role } = req.body;

        if (!role) {
            return res.status(400).json({ message: 'Role is required' });
        }

        // OPTIONAL: You may fetch the requesting user's role in workspace
        const requesterRole = await prisma.workspaceMember.findFirst({
            where: { workspaceId: workSpaceId, userId },
        });
        if (!requesterRole || (requesterRole.role !== 'OWNER' && requesterRole.role !== 'ADMIN')) {
            return res.status(403).json({ message: 'You are not authorized to change member roles' });
        }

        const updatedMember = await prisma.workspaceMember.update({
            where: { id: memberId },
            data: { role }
        });

        res.status(200).json({ message: 'Member role updated successfully', member: updatedMember });
    } catch (err) {
        console.log("Server Error", err);
        res.status(500).json({ message: 'Somethng went wrong' });
    }
};

// Remove a Member
const removedMember = async (req, res)=>{
    try {
        const { workSpaceId, memberId } = req.params;
        const userId = req.user.userId;

        const workSpace = await prisma.workspace.findUnique({
            where: { id: workSpaceId },
            select: { ownerId: true }
        });

        if(!workSpace){
            return res.status(404).json({ message: 'WorkSpace not found' });
        }

        // only owner can remove members
        if (workSpace.ownerId !== userId) {
            return res.status(403).json({ message: 'You are not authorized to remove Members in this WorkSpace' });
        }       

        // check the member exist in the workSpace
        const getMember = await prisma.workspaceMember.findUnique({
            where: { id : memberId, workspaceId: workSpaceId }
        });

        if(!getMember){
            return res.status(404).json({ message: 'Member not found' });
        }

        const deletedMember = await prisma.workspaceMember.delete({
            where: { id: memberId }
        });

        res.status(200).json({ message: 'Member Removed Successfully', deletedMember });
    } catch (err) {
        console.log("Server Error", err);
        res.status(500).json({ message: 'Something went wrong' });
    }
};

module.exports = { addMemebersInWorkSpace, getAllMembers, updateMemberRole, removedMember };