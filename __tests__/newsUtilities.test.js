const { commentsCount } = require("../newsUtilities/newsUtilities.js");

describe("commentsCount", () => {

  test("should not mutate input data", () => {
    const input = [{
        body: "The owls are not what they seem.",
        votes: 20,
        author: "icellusedkars",
        article_id: 9,
        created_at: 1584205320000,
      }
    ];
    const copyInput = [...input];

    const articleId = 1;

    commentsCount(articleId, input);

    expect(input).toEqual(copyInput);
    expect(articleId).toBe(1);
  });

  test("should return a correct number of comments - none or one - when passed an array with one object", () => {
    const input1 = [{
        body: "The owls are not what they seem.",
        votes: 20,
        author: "icellusedkars",
        article_id: 9,
        created_at: 1584205320000,
        }
    ];
    const input2 = [{
        body: "I am 100% sure that we're not completely sure.",
        votes: 1,
        author: "butter_bridge",
        article_id: 1,
        created_at: 1606176480000,
        }
    ];

    const articleId = 1;

    const actual1 = commentsCount(articleId, input1);
    expect(actual1).toBe(0);

    const actual2 = commentsCount(articleId, input2);
    expect(actual2).toBe(1);
  });

  test("should return a correct number of comments when passed an array with many objects", () => {
    const input = [{
        body: "I am 100% sure that we're not completely sure.",
        votes: 1,
        author: "butter_bridge",
        article_id: 1,
        created_at: 1606176480000,
      },
      {
        body: "This is a bad article name",
        votes: 1,
        author: "butter_bridge",
        article_id: 1,
        created_at: 1602433380000,
      },
      {
        body: "The owls are not what they seem.",
        votes: 20,
        author: "icellusedkars",
        article_id: 9,
        created_at: 1584205320000,
      },
      {
        body: "This morning, I showered for nine minutes.",
        votes: 16,
        author: "butter_bridge",
        article_id: 1,
        created_at: 1595294400000,
      }
    ];

    const articleId = 1;

    const actual = commentsCount(articleId, input);

    expect(actual).toBe(3);
  });
});
