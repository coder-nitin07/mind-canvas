const express = require('express');
const { authMiddleware } = require('../middlewares/authMiddleware');
const { addMemebersInWorkSpace, getAllMembers, updateMemberRole } = require('../controllers/workspaceMemberController');
const workSpaceMembersRouter = express.Router();

workSpaceMembersRouter.post('/addMembers/:id/members', authMiddleware, addMemebersInWorkSpace);
workSpaceMembersRouter.get('/:id/members', authMiddleware, getAllMembers);
workSpaceMembersRouter.put('/:workSpaceId/members/:memberId', authMiddleware, updateMemberRole);

module.exports = { workSpaceMembersRouter };