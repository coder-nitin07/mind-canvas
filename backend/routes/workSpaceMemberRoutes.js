const express = require('express');
const { authMiddleware } = require('../middlewares/authMiddleware');
const { addMemebersInWorkSpace, getAllMembers, updateMemberRole, removedMember } = require('../controllers/workspaceMemberController');
const workSpaceMembersRouter = express.Router();

workSpaceMembersRouter.post('/addMembers/:id/members', authMiddleware, addMemebersInWorkSpace);
workSpaceMembersRouter.get('/:id/members', authMiddleware, getAllMembers);
workSpaceMembersRouter.put('/:workSpaceId/members/:memberId', authMiddleware, updateMemberRole);
workSpaceMembersRouter.delete('/:workSpaceId/members/:memberId', authMiddleware, removedMember);

module.exports = { workSpaceMembersRouter };