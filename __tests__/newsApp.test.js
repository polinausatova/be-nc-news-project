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

  describe("/api/articles", () => {

    test("200 GET: responds with an array of all article objects from corresponding database/table, each of which should have 'author', 'title', 'article_id', 'topic', 'created_at', 'votes', 'article_img_url' and 'comment_count' properties", () => {
      return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        expect(body).toHaveProperty('articles', expect.any(Array)); 
        const { articles } = body;
        expect(body.articles.length).toBe(12);

        articles.forEach((article) => {
          expect(article).toHaveProperty('author', expect.any(String));
          expect(article).toHaveProperty('title', expect.any(String));
          expect(article).toHaveProperty('article_id', expect.any(Number));
          expect(article).toHaveProperty('topic', expect.any(String));
          expect(article).toHaveProperty('created_at'
          //, expect.any(String)
          );
          expect(article).toHaveProperty('votes', expect.any(Number));
          expect(article).toHaveProperty('article_img_url', expect.any(String));
          expect(article).toHaveProperty('comment_count', expect.any(Number));
        })
      });
    });
  
  
    test("200 GET: 'comment_count' property should be the total count of all the comments with this article_id", () => {
  
    return request(app)
    .get("/api/articles")
    .expect(200)
    .then(({ body }) => {
      const [ articleOne ] = body.articles.filter((article) => (article.article_id === 1));
      expect(articleOne.comment_count).toBe(11); 
    });
    });

    test("200 GET: the articles should be sorted by date in descending order", () => {
    
    return request(app)
    .get("/api/articles")
    .expect(200)
    .then(({ body }) => {
      const { articles } = body;

      for (let i=0; i<(articles.length-1); i++) {
        expect(Date.parse(articles[i].created_at) - Date.parse(articles[i+1].created_at) >= 0).toBe(true);
      }
    });
    });
  });

  describe("/api/articles/:article_id/comments", () => {

    test.skip("201 POST: responds with the posted comment (Request body accepts an object with the following properties 'username', 'body')", () => {
      const requestBody = {
        'username': 'Bigga',
        'body': 'Not sure I got the point'
      };
      return request(app)
      .post("/api/articles/9/comments")
      .send(requestBody)
      .expect(201)
      .then(({ body }) => {
        const { comment } = body;
        expect(comment).toHaveProperty('comment_id', expect(9));
        expect(comment).toHaveProperty('body', expect('Not sure I got the point'));
        expect(comment).toHaveProperty('votes', expect(0));
        expect(comment).toHaveProperty('author', expect('Bigga'));
        expect(comment).toHaveProperty('article_id', expect(9));
        expect(article).toHaveProperty('created_at', expect.any(String));
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
        expect(serverResponseMessage).toBe('Path Not Found');
      });
    });
  });

});


