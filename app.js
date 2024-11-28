const express = require("express")
const app = express()

const {
  getApi,
  getTopics,
  getArticleByID,
  getArticles,
  getArticleComments,
  postArticleComment,
} = require("./controllers/api.controller")

// ERROR HANDLER IMPORT
const {
  customErrorHandler,
  serverErrorHandler,
  psqlErrorHandler,
} = require("./db/error-handlers")

app.use(express.json())

//GET

app.get("/api", getApi)
app.get("/api/topics", getTopics)
app.get("/api/articles/:article_id", getArticleByID)
app.get("/api/articles", getArticles)
app.get("/api/articles/:article_id/comments", getArticleComments)

//POST

app.post("/api/articles/:article_id/comments", postArticleComment)

// ERROR HANDLERS

app.all("*", (req, res) => {
  res.status(404).send({ msg: "404: Route not found" })
})

app.use(psqlErrorHandler)
app.use(customErrorHandler)
app.use(serverErrorHandler)

module.exports = app
