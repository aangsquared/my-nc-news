const endpointsJson = require("../endpoints.json")
const {
  fetchTopics,
  fetchArticleById,
  fetchAllArticles,
  fetchArticleComments,
  insertArticleComment,
} = require("../models/api.model")

function getApi(req, res) {
  res.status(200).send({ endpoints: endpointsJson })
}

function getTopics(req, res, next) {
  fetchTopics()
    .then((topics) => {
      res.status(200).send({ topics })
    })
    .catch(next)
}

function getArticleByID(req, res, next) {
  const { article_id } = req.params
  fetchArticleById(article_id)
    .then((article) => {
      if (!article) {
        return res.status(404).send({ msg: "Article Not Found" })
      }
      res.status(200).send({ article })
    })
    .catch(next)
}

function getArticles(req, res, next) {
  fetchAllArticles()
    .then((articles) => {
      res.status(200).send({ articles })
    })
    .catch(next)
}

function getArticleComments(req, res, next) {
  const { article_id } = req.params

  fetchArticleComments(article_id)
    .then((comments) => {
      if (!comments.length) {
        res.status(404).send({ msg: "No comments for this article" })
      }
      res.status(200).send({ comments })
    })
    .catch(next)
}

function postArticleComment(req, res, next) {
  const { article_id } = req.params
  const { username, body } = req.body

  insertArticleComment(article_id, username, body)
    .then((comment) => {
      res.status(201).send({ comment })
    })
    .catch(next)
}

module.exports = {
  getApi,
  getTopics,
  getArticleByID,
  getArticles,
  getArticleComments,
  postArticleComment,
}
