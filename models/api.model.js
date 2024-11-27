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

module.exports = { fetchTopics, fetchArticleById }
