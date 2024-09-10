# Anonymous Message Board
Build a full stack JavaScript app that is functionally similar to this: [https://anonymous-message-board.freecodecamp.rocks/](https://anonymous-message-board.freecodecamp.rocks/).

Working on this project will involve you writing your code using one of the following methods:

- Clone [this GitHub repo](https://github.com/freeCodeCamp/boilerplate-project-messageboard/) and complete your project locally.
- Use [our Gitpod starter project](https://gitpod.io/?autostart=true#https://github.com/freeCodeCamp/boilerplate-project-messageboard/) to complete your project.
- Use a site builder of your choice to complete the project. Be sure to incorporate all the files from our GitHub repo.

---

1. Set `NODE_ENV` to test without quotes when ready to write tests and DB to your databases connection string (in `.env`)
2. Recommended to create controllers/handlers and handle routing in `routes/api.js`
3. You will add any security features to `server.js`

Write the following tests in `tests/2_functional-tests.js`:

- Creating a new thread: POST request to `/api/threads/{board}`
- Viewing the 10 most recent threads with 3 replies each: GET request to `/api/threads/{board}`
- Deleting a thread with the incorrect password: DELETE request to `/api/threads/{board}` with an invalid `delete_password`
- Deleting a thread with the correct password: DELETE request to `/api/threads/{board}` with a valid `delete_password`
- Reporting a thread: PUT request to `/api/threads/{board}`
- Creating a new reply: POST request to `/api/replies/{board}`
- Viewing a single thread with all replies: GET request to `/api/replies/{board}`
- Deleting a reply with the incorrect password: DELETE request to `/api/replies/{board}` with an invalid `delete_password`
- Deleting a reply with the correct password: DELETE request to `/api/replies/{board}` with a valid `delete_password`
- Reporting a reply: PUT request to `/api/replies/{board}`

---

## Tests

1. You can provide your own project, not the example URL.
2. Only allow your site to be loaded in an iFrame on your own pages.
3. Do not allow DNS prefetching.
4. Only allow your site to send the referrer for your own pages.
5. You can send a POST request to `/api/threads/{board}` with form data including `text` and `delete_password`. The saved database record will have at least the fields `_id`, `text`, `created_on`(date & time), `bumped_on`(date & time, starts same as `created_on`), `reported` (boolean), `delete_password`, & `replies` (array).
6. You can send a POST request to `/api/replies/{board}` with form data including `text`, `delete_password`, & `thread_id`. This will update the `bumped_on` date to the comment's date. In the thread's `replies` array, an object will be saved with at least the properties `_id`, `text`, `created_on`, `delete_password`, & `reported`.
7. You can send a GET request to `/api/threads/{board}`. Returned will be an array of the most recent 10 bumped threads on the board with only the most recent 3 replies for each. The `reported` and `delete_password` fields will not be sent to the client.
8. You can send a GET request to `/api/replies/{board}?thread_id={thread_id}`. Returned will be the entire thread with all its replies, also excluding the same fields from the client as the previous test.
9. You can send a DELETE request to `/api/threads/{board}` and pass along the `thread_id` & `delete_password` to delete the thread. Returned will be the string `incorrect password` or `success`.
10. You can send a DELETE request to `/api/replies/{board}` and pass along the `thread_id`, `reply_id`, & `delete_password`. Returned will be the string `incorrect password` or `success`. On success, the text of the `reply_id` will be changed to `[deleted]`.
11. You can send a PUT request to `/api/threads/{board}` and pass along the `thread_id`. Returned will be the string `reported`. The `reported` value of the `thread_id` will be changed to `true`.
12. You can send a PUT request to `/api/replies/{board}` and pass along the `thread_id` & `reply_id`. Returned will be the string `reported`. The `reported` value of the `reply_id` will be changed to `true`.
13. All 10 functional tests are complete and passing.