'use strict';

const mongoose = require('mongoose');
const { ObjectId } = require('mongodb');

mongoose.connect(process.env.DB, { useNewUrlParser: true, useUnifiedTopology: true });

const threadSchema = new mongoose.Schema({
  board: String,
  text: String,
  created_on: { type: Date, default: Date.now },
  bumped_on: { type: Date, default: Date.now },
  reported: { type: Boolean, default: false },
  delete_password: String,
  replies: [
    {
      _id: { type: ObjectId, default: new ObjectId() },
      text: String,
      created_on: { type: Date, default: Date.now },
      delete_password: String,
      reported: { type: Boolean, default: false },
    },
  ],
});

const Thread = mongoose.model('Thread', threadSchema);

module.exports = function (app) {
  app.route('/api/threads/:board')
    .post(async (req, res) => {
      try {
        const { board } = req.params;
        const { text, delete_password } = req.body;

        const newThread = new Thread({ board, text, delete_password });
        await newThread.save();
        res.redirect(`/b/${board}/`);
      } catch (err) {
        res.status(500).send('Error saving new thread');
      }
    })
    .get(async (req, res) => {
      try {
        const { board } = req.params;

        const threads = await Thread.find({ board })
          .sort({ bumped_on: -1 })
          .limit(10)
          .lean();

        threads.forEach(thread => {
          delete thread.delete_password;
          delete thread.reported;

          thread.replies = thread.replies
            .sort((a, b) => b.created_on - a.created_on)
            .slice(-3)
            .map(reply => {
              delete reply.delete_password;
              delete reply.reported;
              return reply;
            });

            thread.replycount = thread.replies.length;
        });

        res.json(threads);
      } catch (err) {
        res.status(500).send('Error fetching threads');
      }
    })
    .delete(async (req, res) => {
      try {
        const { thread_id, delete_password } = req.body;

        const thread = await Thread.findById(thread_id);
        if (!thread || thread.delete_password !== delete_password) {
          return res.send('incorrect password');
        }

        await Thread.findByIdAndDelete(thread_id);
        res.send('success');
      } catch (err) {
        res.status(500).send('Error deleting thread');
      }
    })
    .put(async (req, res) => {
      try {
        const { thread_id } = req.body;

        if (!thread_id) return res.status(400).send('Missing thread_id');

        const thread = await Thread.findByIdAndUpdate(thread_id, { reported: true }, { new: true });
        if (!thread) return res.status(404).send('reported');
        res.send('reported');
      } catch (err) {
        res.status(500).send('Error reporting thread');
      }
    });

  app.route('/api/replies/:board')
    .post(async (req, res) => {
      try {
        const { board } = req.params;
        const { thread_id, text, delete_password } = req.body;

        const newReply = { _id: new ObjectId(), text, delete_password, created_on: new Date(), reported: false };

        const thread = await Thread.findByIdAndUpdate(
          thread_id,
          { $push: { replies: newReply }, $set: { bumped_on: new Date() } },
          { new: true }
        );

        if (!thread) return res.status(404).send('Thread not found');
        res.redirect(`/b/${board}/${thread_id}`);
      } catch (err) {
        res.status(500).send('Error adding reply');
      }
    })
    .get(async (req, res) => {
      try {
        const { thread_id } = req.query;

        const thread = await Thread.findById(thread_id)
          .select('-reported -delete_password -replies.delete_password -replies.reported')
          .lean();

        if (!thread) return res.status(404).send('Thread not found');
        res.json(thread);
      } catch (err) {
        res.status(500).send('Error fetching thread with replies');
      }
    })
    .delete(async (req, res) => {
      try {
        const { thread_id, reply_id, delete_password } = req.body;

        const thread = await Thread.findOneAndUpdate(
          { _id: thread_id, 'replies._id': reply_id, 'replies.delete_password': delete_password },
          { $set: { 'replies.$.text': '[deleted]' } }
        );

        if (!thread) return res.send('incorrect password');
        res.send('success');
      } catch (err) {
        res.status(500).send('Error deleting reply');
      }
    })
    .put(async (req, res) => {
      try {
        const { thread_id, reply_id } = req.body;

        const thread = await Thread.findOneAndUpdate(
          { _id: thread_id, 'replies._id': reply_id },
          { $set: { 'replies.$.reported': true } }
        );

        if (!thread) return res.status(404).send('Reply not found');
        res.send('reported');
      } catch (err) {
        res.status(500).send('Error reporting reply');
      }
    });
};
