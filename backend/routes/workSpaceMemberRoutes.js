const express = require('express');
const { authMiddleware } = require('../middlewares/authMiddleware');
const { addMemebersInWorkSpace } = require('../controllers/workspaceMemberController');
const workSpaceMembersRouter = express.Router();

workSpaceMembersRouter.post('/addMembers/:id/members', authMiddleware, addMemebersInWorkSpace);

module.exports = { workSpaceMembersRouter };