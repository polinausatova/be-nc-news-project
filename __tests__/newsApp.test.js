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

  describe("GET: /api/topics", () => {

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


  describe("GET: /api/articles", () => {

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

  describe("GET: /api/articles/:article_id", () => {

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
        expect(body.msg).toBe('Bad Request');
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

  describe("GET: /api/articles/:article_id/comments", () => {

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
        expect(body.msg).toBe('Bad Request');
      });
    });

    test.skip("404 GET: responds with 'Article Not Found' message given valid but non-existent article_id", () => {
      return request(app)
      .get('/api/articles/28/comments')
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Article Not Found");
      });
    });
  });

  describe("POST: /api/articles/:article_id/comments", () => {

    test("201 POST: responds with the posted comment (Request body accepts an object with the following properties 'username', 'body')", () => {
      const requestBody = {
        'username': 'butter_bridge',
        'body': 'Not sure I got the point'
      };
      return request(app)
      .post("/api/articles/9/comments")
      .send(requestBody)
      .expect(201)
      .then(({ body }) => {
        const { comment } = body;
        console.log(comment);
        expect(comment).toEqual({
          comment_id: 19,
          body: 'Not sure I got the point',
          article_id: 9,
          author: 'butter_bridge',
          votes: 0,
          created_at: expect.any(String)
        });
      });
    });

    test("400 POST: responds with an error message given invalid article_id", () => {
      const requestBody = {
        'username': 'butter_bridge',
        'body': 'Not sure I got the point'
      };
      return request(app)
      .post("/api/articles/Mitch/comments")
      .send(requestBody)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Bad Request');
      });
    });
    
    test("400 POST: responds with an error message if input does not have any of required properties ('username','body')", () => {
      const requestBody = {
        'nickname': 'Bigga',
        'text': 'Not sure I got the point'
      };
      return request(app)
      .post("/api/articles/9/comments")
      .send(requestBody)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
    });

    test("404 POST: responds with an error message if the comment's author's username is not in users database", () => {
      const requestBody = {
        'username': '123_zorro_man',
        'body': 'Not sure I got the point'
      };;
      return request(app)
      .post("/api/articles/9/comments")
      .send(requestBody)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe('User not found');
      });
    });

    test("404 POST: responds with an error message if the article is not in articles database", () => {
      const requestBody = {
        'username': 'butter_bridge',
        'body': 'Not sure I got the point'
      };;
      return request(app)
      .post("/api/articles/33/comments")
      .send(requestBody)
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
