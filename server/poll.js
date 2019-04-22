const express = require('express');
const router = express.Router();
const {makePoll, addVote, endPoll, getPoll} = require('../database/helpers');

// makes a poll
router.post('/make', (req, res) => {
    const {groupId, books} = req.body;
    return makePoll(groupId, books)
        .then(() => 
            res.sendStatus(201)
        )
        .catch(err => {
            res.sendStatus(500);
            console.error(err);
        })
});

// sends a poll to the client
router.get('/get', (req, res) => {
    const {groupId} = req.query;
    return getPoll(groupId)
        .then(poll => 
            res.json(poll)
        )
        .catch(err => {
            res.sendStatus(200).json({poll: null, books: []});
            console.error(err);
        })
});

// adds a vote
router.patch('/addVote', (req, res) => {
    const {userId, groupId, bookId} = req.body;
    return addVote(userId, groupId, bookId)
        // sends the poll back to the server
        .then(poll => res.json(poll))
        .catch(err => {
            res.sendStatus(500);
            console.error(err);
        })
});

// deletes a poll by the poll id
router.post('/delete', (req, res) => {
    const {pollId} = req.body;
    return endPoll(pollId)
        .then(() =>
            res.sendStatus(200)
        )
        .catch(err => {
            res.sendStatus(500);
            console.error(err);
        })
});

module.exports = router;