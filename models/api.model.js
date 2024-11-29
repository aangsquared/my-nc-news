const db = require("../db/connection")
const format = require("pg-format")

function fetchUsers() {
  return db.query(`SELECT * FROM users;`).then(({ rows }) => {
    return rows
  })
}

function fetchTopics() {
  return db.query(`SELECT * FROM topics;`).then(({ rows }) => {
    return rows
  })
}

function fetchArticleById(article_id) {
  const queryString = `
    SELECT
      articles.author, 
      articles.title, 
      articles.article_id,
      articles.body, 
      articles.topic, 
      articles.created_at, 
      articles.votes, 
      articles.article_img_url,
      COUNT(comments.comment_id) AS comment_count
    FROM articles
    LEFT JOIN comments
      ON articles.article_id = comments.article_id
    WHERE articles.article_id = $1
    GROUP BY articles.article_id;`

  return db.query(queryString, [article_id]).then(({ rows }) => {
    const article = rows[0]
    if (!article) {
      return Promise.reject({ status: 404, msg: "Article not found" })
    }
    return {
      ...article,
      comment_count: Number(article.comment_count),
    }
  })
}

function fetchAllArticles(sort_by = "created_at", order = "desc", topic) {
  const validSortBy = [
    "author",
    "title",
    "article_id",
    "topic",
    "created_at",
    "votes",
    "article_img_url",
    "comment_count",
  ]

  const validTopics = ["mitch", "cats", "paper"]

  if (!validSortBy.includes(sort_by)) {
    return Promise.reject({ status: 400, msg: "Invalid sort column" })
  }

  if (order !== "asc" && order !== "desc") {
    return Promise.reject({ status: 400, msg: "Invalid order value" })
  }

  if (topic && !validTopics.includes(topic)) {
    return Promise.reject({ status: 400, msg: "Invalid topic" })
  }

  let queryString = `
    SELECT
      articles.author, 
      articles.title, 
      articles.article_id, 
      articles.topic, 
      articles.created_at, 
      articles.votes, 
      articles.article_img_url,
      COUNT(comments.comment_id) AS comment_count
    FROM articles
    LEFT JOIN comments
      ON articles.article_id = comments.article_id`

  const queryTopic = (topic && [topic]) || []

  if (topic) {
    queryString += ` WHERE articles.topic = $1`
  }

  queryString += `
  GROUP BY articles.article_id 
  ORDER BY ${sort_by} ${order};`

  return db.query(queryString, queryTopic).then(({ rows }) => {
    return rows.map((article) => ({
      ...article,
      comment_count: Number(article.comment_count),
    }))
  })
}

function fetchArticleComments(article_id) {
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1`, [article_id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Article not found" })
      }

      return db.query(
        `
      SELECT 
        comment_id, votes, created_at, author, body, article_id 
      FROM comments 
      WHERE article_id = $1
      ORDER BY created_at DESC;`,
        [article_id]
      )
    })
    .then(({ rows }) => {
      return rows
    })
}

function insertArticleComment(article_id, username, body) {
  const queryString = `INSERT INTO comments (article_id, author, body)
    VALUES ($1, $2, $3)
    RETURNING *;`
  return db
    .query(queryString, [article_id, username, body])
    .then(({ rows }) => {
      return rows[0]
    })
}

function updateArticleVotes(article_id, inc_votes) {
  if (!Number.isInteger(parseInt(article_id)) || !Number.isInteger(inc_votes)) {
    return Promise.reject({ status: 400, msg: "400: Bad request" })
  }

  const queryStr = `
      UPDATE articles
      SET votes = votes + $1
      WHERE article_id = $2
      RETURNING *;
    `

  return db.query(queryStr, [inc_votes, article_id]).then(({ rows }) => {
    if (rows.length === 0) {
      return Promise.reject({ status: 404, msg: "Article not found" })
    }
    return rows[0]
  })
}

function deleteCommentById(comment_id) {
  if (!Number.isInteger(parseInt(comment_id))) {
    return Promise.reject({ status: 400, msg: "400: Bad request" })
  }

  const queryStr = `
      DELETE FROM comments
      WHERE comment_id = $1
      RETURNING *;
    `

  return db.query(queryStr, [comment_id]).then(({ rows }) => {
    if (rows.length === 0) {
      return Promise.reject({ status: 404, msg: "Comment not found" })
    }
    return
  })
}

module.exports = {
  fetchUsers,
  fetchTopics,
  fetchArticleById,
  fetchAllArticles,
  fetchArticleComments,
  insertArticleComment,
  updateArticleVotes,
  deleteCommentById,
}
