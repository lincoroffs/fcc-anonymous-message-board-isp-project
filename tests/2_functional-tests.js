const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function () {
  let threadId, replyId;

  suite('API ROUTING FOR /api/threads/:board', function () {

    test('POST /api/threads/{board}', function (done) {
      chai.request(server)
        .post('/api/threads/test')
        .send({ text: 'Test thread', delete_password: '12345' })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          done();
        });
    });

    test('GET /api/threads/{board}', function (done) {
      chai.request(server)
        .get('/api/threads/test')
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.property(res.body[0], '_id');
          assert.property(res.body[0], 'text');
          threadId = res.body[0]._id;
          done();
        });
    });

    test('DELETE /api/threads/{board} with incorrect password', function (done) {
      chai.request(server)
        .delete('/api/threads/test')
        .send({ thread_id: threadId, delete_password: 'wrongpassword' })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.text, 'incorrect password');
          done();
        });
    });

    test('DELETE /api/threads/{board} with correct password', function (done) {
      chai.request(server)
        .delete('/api/threads/test')
        .send({ thread_id: threadId, delete_password: '12345' })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.text, 'success');
          done();
        });
    });

    test('PUT /api/threads/{board}', function (done) {
      chai.request(server)
        .put('/api/threads/test')
        .send({ thread_id: threadId })
        .end(function (err, res) {
          assert.equal(res.status, 404);
          assert.equal(res.text, 'reported');
          done();
        });
    });

  });

  suite('API ROUTING FOR /api/replies/:board', function () {

    test('POST /api/replies/{board}', function (done) {
      chai.request(server)
        .post('/api/threads/test')
        .send({ text: 'Another test thread', delete_password: '12345' })
        .end(function (err, res) {
          chai.request(server)
            .get('/api/threads/test')
            .end(function (err, res) {
              threadId = res.body[0]._id;
              chai.request(server)
                .post('/api/replies/test')
                .send({ thread_id: threadId, text: 'Test reply', delete_password: '12345' })
                .end(function (err, res) {
                  assert.equal(res.status, 200);
                  done();
                });
            });
        });
    });

    test('GET /api/replies/{board}', function (done) {
      chai.request(server)
        .get('/api/replies/test')
        .query({ thread_id: threadId })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.isArray(res.body.replies);
          assert.property(res.body.replies[0], '_id');
          assert.property(res.body.replies[0], 'text');
          replyId = res.body.replies[0]._id;
          done();
        });
    });

    test('DELETE /api/replies/{board} with incorrect password', function (done) {
      chai.request(server)
        .delete('/api/replies/test')
        .send({ thread_id: threadId, reply_id: replyId, delete_password: 'wrongpassword' })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.text, 'incorrect password');
          done();
        });
    });

    test('DELETE /api/replies/{board} with correct password', function (done) {
      chai.request(server)
        .delete('/api/replies/test')
        .send({ thread_id: threadId, reply_id: replyId, delete_password: '12345' })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.text, 'success');
          done();
        });
    });

    test('PUT /api/replies/{board}', function (done) {
      chai.request(server)
        .put('/api/replies/test')
        .send({ thread_id: threadId, reply_id: replyId })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.text, 'reported');
          done();
        });
    });

  });
});
