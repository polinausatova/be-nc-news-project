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

  describe("/api/articles/:article_id", () => {

    test("200 GET: responds with an article object that should have 'author', 'title', 'article_id', 'body', 'topic', 'created_at', 'votes', 'article_img_url' properties", () => {

      return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        //console.log(body.article);
        expect(body).toHaveProperty('article', expect.any(Object)); 

        const { article } = body;

        expect(article).toHaveProperty('author', expect.any(String));
        expect(article).toHaveProperty('title', expect.any(String));
        expect(article).toHaveProperty('article_id', expect.any(Number));
        expect(article).toHaveProperty('topic', expect.any(String));
        expect(article).toHaveProperty('created_at', expect.any(String));
        expect(article).toHaveProperty('votes', expect.any(Number));
        expect(article).toHaveProperty('article_img_url', expect.any(String));
        expect(article).toHaveProperty('body', expect.any(String));
      })
    })

    test("400 GET: responds with incorrect request given invalid article_id", () => {
      return request(app)
      .get('/api/articles/Mitch')
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Incorrect Request');
      });
    });

    test("404 GET: responds with 'Not found' message given valid but non-existent article_id", () => {
      return request(app)
      .get('/api/articles/20008')
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe('Article Not Found');
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


