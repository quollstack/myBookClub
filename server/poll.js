const express = require('express');
const router = express.Router();
const {makePoll, addVote, endPoll, getPoll} = require('../database/helpers');

router.post('/make', (req, res) => {
    const {groupId, bookIds} = req.body;
    return makePoll(groupId, bookIds)
        .then(() => 
            res.sendStatus(201)
        );
});

router.get('/get', (req, res) => {
    const {groupId} = req.body;
    return getPoll(groupId)
        .then(res.json);
});

router.patch('/addVote', (req, res) => {
    const {userId, groupId, bookId} = req;
    return addVote(userId, groupId, bookId)
        // sends the poll back to the server
        .then(res.json);
})

router.post('/delete', (req, res) => {
    const {pollId} = req.body;
    return endPoll(pollId)
        .then(() =>
            res.sendStatus(200)
        );
})

module.exports = router;