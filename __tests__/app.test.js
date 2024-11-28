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

describe("GET /api/users", () => {
  test("200: responds with an array of user objects", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body: { users } }) => {
        expect(users).toBeInstanceOf(Array)
        expect(users).toHaveLength(4)
        users.forEach((user) => {
          expect(user).toEqual(
            expect.objectContaining({
              username: expect.any(String),
              name: expect.any(String),
              avatar_url: expect.any(String),
            })
          )
        })
      })
  })
  test("404: responds with 'Route not found' for an invalid endpoint", () => {
    return request(app)
      .get("/api/unknownroute")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("404: Route not found")
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

describe("GET /api/articles", () => {
  const expectedObject = {
    author: expect.any(String),
    title: expect.any(String),
    article_id: expect.any(Number),
    topic: expect.any(String),
    created_at: expect.any(String),
    votes: expect.any(Number),
    article_img_url: expect.any(String),
    comment_count: expect.any(Number),
  }
  test("200: Responds with an array of article objects where the body", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toBeInstanceOf(Array)
        expect(articles).toHaveLength(13)
        articles.forEach((article) => {
          expect(article).toEqual(expect.objectContaining(expectedObject))
          expect(article.body).toBe(undefined)
        })
      })
  })
  test("200: responds with array of article objects in descending order by date", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toBeInstanceOf(Array)
        expect(articles).toHaveLength(13)
        articles.forEach((article) => {
          expect(article).toEqual(expect.objectContaining(expectedObject))
          expect(articles).toBeSortedBy("created_at", {
            descending: true,
          })
        })
      })
  })
  test("200: responds with articles sorted by created_at in descending order by default", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toBeSortedBy("created_at", { descending: true })
      })
  })
  test("200: responds with articles sorted by created_at in ascending order", () => {
    return request(app)
      .get("/api/articles?order=asc")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toBeSortedBy("created_at", { ascending: true })
      })
  })
  test("200: responds with articles sorted by title in ascending order", () => {
    return request(app)
      .get("/api/articles?sort_by=title&order=asc")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toBeSortedBy("title", { ascending: true })
      })
  })
  test("200: responds with articles sorted by title in descending order", () => {
    return request(app)
      .get("/api/articles?sort_by=title&order=desc")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toBeSortedBy("title", { descending: true })
      })
  })
  test("400: responds with 'Invalid sort column' for invalid sort_by value", () => {
    return request(app)
      .get("/api/articles?sort_by=invalid_sort_by")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid sort column")
      })
  })
  test("400: responds with 'Invalid order value' for invalid order", () => {
    return request(app)
      .get("/api/articles?order=invalid_order")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid order value")
      })
  })
  test("404: responds with a message 'Route not found' if given an invalid endpoint", () => {
    return request(app)
      .get("/api/error-right?")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("404: Route not found")
      })
  })
})

describe("GET /api/articles/:article_id/comments", () => {
  test("200: responds with an array of comments for the given article_id, sorted by most recent first", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments).toBeInstanceOf(Array)
        expect(comments).toHaveLength(11)
        comments.forEach((comment) => {
          expect(comment).toEqual(
            expect.objectContaining({
              comment_id: expect.any(Number),
              votes: expect.any(Number),
              created_at: expect.any(String),
              author: expect.any(String),
              body: expect.any(String),
              article_id: 1,
            })
          )
        })
        expect(comments).toBeSortedBy("created_at", { descending: true })
      })
  })
  test("404: responds with 'No comments for this article' if article has no comments", () => {
    return request(app)
      .get("/api/articles/11111111/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("No comments for this article")
      })
  })
  test("400: responds with 'Bad request' for invalid article_id format", () => {
    return request(app)
      .get("/api/articles/NaN/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("400: Bad request")
      })
  })
})

describe("POST /api/articles/:article_id/comments", () => {
  test("201: responds with a new posted comment", () => {
    const newComment = {
      username: "butter_bridge",
      body: "Northcoders is great.",
    }

    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(201)
      .then(({ body: { comment } }) => {
        expect(comment).toEqual(
          expect.objectContaining({
            comment_id: expect.any(Number),
            body: "Northcoders is great.",
            article_id: 1,
            author: "butter_bridge",
            votes: 0,
            created_at: expect.any(String),
          })
        )
      })
  })
  test("400: responds with 'Bad request' when necessary fields are missing", () => {
    const invalidComment = { username: "butter_bridge" }

    return request(app)
      .post("/api/articles/1/comments")
      .send(invalidComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("400: Bad request")
      })
  })
  test("400: responds with 'Bad request' for invalid article_id format", () => {
    const newComment = {
      username: "butter_bridge",
      body: "Test comment.",
    }

    return request(app)
      .post("/api/articles/NaN/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("400: Bad request")
      })
  })
  test("404: responds with 'Article not found' when posting to a invalid article_id", () => {
    const newComment = {
      username: "butter_bridge",
      body: "Test comment.",
    }

    return request(app)
      .post("/api/articles/11111111/comments")
      .send(newComment)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Article not found")
      })
  })
  test("404: responds with 'User not found' when username does not exist", () => {
    const newComment = {
      username: "user_does_not_exist",
      body: "Test comment.",
    }

    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("User not found")
      })
  })
})

describe("PATCH /api/articles/:article_id", () => {
  test("200: increments the votes and responds with updated article", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: 1 })
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toEqual(
          expect.objectContaining({
            article_id: 1,
            votes: expect.any(Number),
            title: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            topic: expect.any(String),
            created_at: expect.any(String),
            article_img_url: expect.any(String),
          })
        )
        expect(body.article.votes).toBe(101)
      })
  })

  test("200: decrements votes and responds with the updated article", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: -5 })
      .expect(200)
      .then(({ body }) => {
        expect(body.article.votes).toBe(95)
      })
  })

  test("400: responds with bad request when inc_votes is missing", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({})
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("400: Bad request")
      })
  })

  test("400: responds with bad request when inc_votes is not an integer", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: "five" })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("400: Bad request")
      })
  })

  test("404: responds with not found when article_id does not exist", () => {
    return request(app)
      .patch("/api/articles/1111111")
      .send({ inc_votes: 1 })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Article not found")
      })
  })

  test("400: responds with bad request for invalid article_id", () => {
    return request(app)
      .patch("/api/articles/NaN")
      .send({ inc_votes: 1 })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("400: Bad request")
      })
  })
})

describe("DELETE /api/comments/:comment_id", () => {
  test("204: deletes the given comment by comment_id and responds with no content", () => {
    return request(app)
      .delete("/api/comments/1")
      .expect(204)
      .then(({ body }) => {
        expect(body).toEqual({})
      })
  })
  test("400: responds with 'Bad request' for invalid comment_id format", () => {
    return request(app)
      .delete("/api/comments/NaN")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("400: Bad request")
      })
  })
  test("404: responds with 'Comment not found' for a valid but non-existent comment_id", () => {
    return request(app)
      .delete("/api/comments/11111111")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Comment not found")
      })
  })
})
