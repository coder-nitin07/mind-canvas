const express = require('express');
const { authMiddleware } = require('../middlewares/authMiddleware');
const { addMemebersInWorkSpace, getAllMembers } = require('../controllers/workspaceMemberController');
const workSpaceMembersRouter = express.Router();

workSpaceMembersRouter.post('/addMembers/:id/members', authMiddleware, addMemebersInWorkSpace);
workSpaceMembersRouter.get('/:id/members', authMiddleware, getAllMembers);

module.exports = { workSpaceMembersRouter };