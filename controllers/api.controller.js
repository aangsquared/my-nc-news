const endpointsJson = require("../endpoints.json")
const {
  fetchTopics,
  fetchArticleById,
  fetchAllArticles,
  fetchArticleComments,
} = require("../models/api.model")

function getApi(req, res) {
  //console.log(endpointsJson)
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
      //console.log(article)
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

module.exports = {
  getApi,
  getTopics,
  getArticleByID,
  getArticles,
  getArticleComments,
}
