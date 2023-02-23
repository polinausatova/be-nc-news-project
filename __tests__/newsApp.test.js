const app = require("../newsApp");
const data = require("../db/data/test-data");
const request = require("supertest");
const db = require("../db/connection.js");
const seed = require("../db/seeds/seed");

beforeEach(() => {
  return seed(data);
});

afterAll(() => {
  if (db.end) db.end();
});

describe("app", () => {

  describe("/api/topics", () => {

    test("200 GET: responds with an array of all topic objects from corresponding database/table, each of which should have 'slug' and 'description' properties", () => {
      return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        
        expect(body).toHaveProperty('topics', expect.any(Array)); 
        const {topics} = body;
        expect(topics.length).toBe(3);
        topics.forEach((topic) => {
          expect(topic).toHaveProperty('slug', expect.any(String));
          expect(topic).toHaveProperty('description', expect.any(String));
        })
      
      });
    });
  });

  describe("/api/articles/:article_id/commens", () => {

    test("200 GET: responds with an empty array given valid article_id for the article with no comments existing", () => {
      return request(app)
      .get('/api/articles/4/comments')
      .expect(200)
      .then(({ body }) => {
        expect(body).toHaveProperty('comments', expect.any(Array)); 

        const { comments } = body;
        expect(comments.length).toBe(0);
      });
    });

    test("200 GET: responds with an array of all comments for the given article_id, each of which should have 'comment_id', 'votes', 'created_at', 'author', 'body', 'article_id'  properties", () => {
      return request(app)
      .get("/api/articles/9/comments")
      .expect(200)
      .then(({ body }) => {

        expect(body).toHaveProperty('comments', expect.any(Array)); 

        const { comments } = body;
        expect(comments.length).toBe(2);

        comments.forEach((comment) => {
        expect(comment).toHaveProperty('comment_id', expect.any(Number));
        expect(comment).toHaveProperty('votes', expect.any(Number));
        expect(comment).toHaveProperty('created_at', expect.any(String));
        expect(comment).toHaveProperty('author', expect.any(String));
        expect(comment).toHaveProperty('body', expect.any(String));
        expect(comment).toHaveProperty('article_id');
        expect(comment.article_id).toBe(9);
        })
      })
    });
    
    test("200 GET: comments should be served with the most recent comments first", () => {

      return request(app)
      .get("/api/articles/9/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(comments.length).not.toBe(undefined); //add to similiar test to avoid false passing!
        for (let i=0; i<(comments.length-1); i++) {
          expect(Date.parse(comments[i].created_at) - Date.parse(comments[i+1].created_at) >= 0).toBe(true);
        }
      });
    });

    test("400 GET: responds with 'Incorrect Request' message given invalid article_id", () => {
      return request(app)
      .get("/api/articles/Mitch/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Incorrect Request");
      });
    });

    test("404 GET: responds with 'Article id does not exist' message given valid but non-existent article_id", () => {
      return request(app)
      .get('/api/articles/28/comments')
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Article id does not exist");
      });
    });

  });

  describe("Server errors", () => {
    test("404: responds with message when sent a valid but non-existing path", () => {
      return request(app)
      .get('/give-me-some-bananas')
      .expect(404)
      .then(({ body }) => {
        const serverResponseMessage = body.msg;
        expect(serverResponseMessage).toBe("Path Not Found");
      });
    });
  });

});


