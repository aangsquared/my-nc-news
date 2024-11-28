const db = require("../db/connection")
const format = require("pg-format")

function fetchTopics() {
  return db.query("SELECT * FROM topics;").then(({ rows }) => {
    return rows
  })
}

function fetchArticleById(article_id) {
  const queryString = `SELECT * FROM articles WHERE article_id=$1`
  return db.query(queryString, [article_id]).then(({ rows }) => {
    return rows[0]
  })
}

function fetchAllArticles() {
  const queryString = `SELECT 
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
    ON articles.article_id = comments.article_id
    GROUP BY articles.article_id
    ORDER BY articles.created_at DESC;`
  return db.query(queryString).then(({ rows }) => {
    return rows.map((article) => ({
      ...article,
      comment_count: Number(article.comment_count),
    }))
  })
}

function fetchArticleComments(article_id) {
  const queryString = `
    SELECT comment_id, votes, created_at, author, body, article_id
    FROM comments
    WHERE article_id = $1
    ORDER BY created_at DESC;
  `

  return db.query(queryString, [article_id]).then(({ rows }) => {
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
      console.log(rows)
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

module.exports = {
  fetchTopics,
  fetchArticleById,
  fetchAllArticles,
  fetchArticleComments,
  insertArticleComment,
  updateArticleVotes,
}
