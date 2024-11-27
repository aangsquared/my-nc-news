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

describe("get /api/topics", () => {
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
