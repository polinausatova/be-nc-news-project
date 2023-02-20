const app = require("../newsApp");
const data = require("../db/data/test-data");
const request = require("supertest");
const db = require("../db/connection.js");
const seed = require("../db/seeds/seed");

beforeEach(() => {
  // console.log('test seeding done');
  // console.log(data);
  return seed(data);
 
});

afterAll(() => {
  if (db.end) db.end();
});

describe("app", () => {

  describe("/api/topics", () => {

    test("200 GET: responds with an array of all topic objects from corresponding database/table, each of which should have 'slug' and 'description' properties", () => {
        //Arrange
    return request(app)
        //Act
    .get("/api/topics")
        //Assert
    .expect(200)
    .then(({ body }) => {
        expect(body).toHaveProperty('topics', expect.any(Array)); 
        expect(body.topics.length).toBe(data.topicData.length);
        
        for (let i=0; i<body.topics.length; i++) {
        expect(Object.keys(body.topics[i]).sort()).toEqual(['slug', 'description'].sort()); 
        }
    });p
    });

  
  describe("error handling here", () => {});

});
});
