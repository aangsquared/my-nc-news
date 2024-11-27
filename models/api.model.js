const db = require("../db/connection")
const format = require("pg-format")

function fetchTopics() {
  return db.query("SELECT * FROM topics;").then(({ rows }) => {
    //console.log(rows)
    return rows
  })
}

function fetchArticleById(article_id) {
  const queryString = `SELECT * FROM articles WHERE article_id=$1`
  return db.query(queryString, [article_id]).then(({ rows }) => {
    //console.log(rows)
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
    console.log(rows)
    return rows.map((article) => ({
      ...article,
      comment_count: Number(article.comment_count),
    }))
  })
}

module.exports = { fetchTopics, fetchArticleById, fetchAllArticles }
