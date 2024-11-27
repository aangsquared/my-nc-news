const endpointsJson = require("../endpoints.json")
/* test imports */
// app and request
const app = require("../app")
const request = require("supertest")
// data and seed for seeding test database before each test
const testData = require("../db/data/test-data")
const seed = require("../db/seeds/seed")
// database connection pool for ending connection after tests run
const db = require("../db/connection")
/* Set up your beforeEach & afterAll functions here */
beforeEach(() => {
  return seed(testData)
})
afterAll(() => {
  return db.end()
})

describe("GET /api", () => {
  test("200: Responds with an object detailing the documentation for each endpoint", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toEqual(endpointsJson)
      })
  })
})

describe("GET /api/topics", () => {
  test("200: Responds with array of topic objects", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body: { topics } }) => {
        expect(Array.isArray(topics)).toBe(true)
        topics.forEach((topic) => {
          expect(topic).toMatchObject({
            slug: expect.any(String),
            description: expect.any(String),
          })
        })
      })
  })
})

describe("GET /api/articles/:article_id", () => {
  test("200: Responds with the correct article object with all properties", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article).toEqual(
          expect.objectContaining({
            author: expect.any(String),
            title: expect.any(String),
            article_id: 1,
            body: expect.any(String),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
          })
        )
      })
  })
  test("404: Responds with 'Article not found' error message for invalid article_id number", () => {
    return request(app)
      .get("/api/articles/1111111")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Article Not Found")
      })
  })
  test("400: Responds with 'Bad request' error message for wrong article_id request format", () => {
    return request(app)
      .get("/api/articles/NaN")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("400: Bad request")
      })
  })
})
