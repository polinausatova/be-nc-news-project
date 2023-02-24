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
        //console.log(body.articles);
        expect(body).toHaveProperty('articles', expect.any(Array)); 
        const { articles } = body;
        expect(body.articles.length).toBe(12);

        articles.forEach((article) => {
          expect(article).toHaveProperty('author', expect.any(String));
          expect(article).toHaveProperty('title', expect.any(String));
          expect(article).toHaveProperty('article_id', expect.any(Number));
          expect(article).toHaveProperty('topic', expect.any(String));
          expect(article).toHaveProperty('created_at', expect.any(String));
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

  describe("/api/articles/:article_id", () => {

    test("200 GET: responds with an article object that should have 'author', 'title', 'article_id', 'body', 'topic', 'created_at', 'votes', 'article_img_url' properties", () => {

      return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
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
        expect(body.msg).toBe("Bad Request");
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

  describe("PATCH /api/articles/:article_id", () => {

    test("400 PATCH: responds with an error message if missing required keys - empty input", () => {
      const requestBody = {};
      return request(app)
      .patch("/api/articles/1")
      .send(requestBody)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Bad Request');
      });
    });

    test("400 PATCH:responds with an error message if missing required keys - wrong keys in the input", () => {
      const requestBody = {'Mitch': 7};
      return request(app)
      .patch("/api/articles/1")
      .send(requestBody)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Bad Request');
      });
    });

    test("400 PATCH: bad request responds with an error message if id is NaN", () => {
      const requestBody = {
        inc_votes: 3 
      };
      return request(app)
      .patch("/api/articles/Mitch")
      .send(requestBody)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
    });

    test("404 PATCH: responds with an error message if article id is valid but not exists", () => {
      const requestBody = {
        inc_votes: 3 
      };
      return request(app)
      .patch("/api/articles/28")
      .send(requestBody)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Article Not Found");
      });
    });
  

    test("200 PATCH: responds with the corresponding article, updated so that 'votes' property changed accordingly to 'inc_votes' value in input object'", () => {
      const requestBody = {
        inc_votes: 3 
      };
      return request(app)
      .patch("/api/articles/1")
      .send(requestBody)
      .expect(200)
      .then(({ body }) => {
        const { article } = body;
        expect(article).toEqual({
          "article_id": 1, 
          "article_img_url": "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700", 
          "author": "butter_bridge", 
          "body": "I find this existence challenging", "created_at": "2020-07-09T20:11:00.000Z", 
          "title": "Living in the shadow of a great man", "topic": "mitch", 
          "votes": 103});
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
