const endpointsJson = require("../endpoints.json")
const {
  fetchUsers,
  fetchTopics,
  fetchArticleById,
  fetchAllArticles,
  fetchArticleComments,
  insertArticleComment,
  updateArticleVotes,
  deleteCommentById,
} = require("../models/api.model")

function getApi(req, res) {
  res.status(200).send({ endpoints: endpointsJson })
}
function getUsers(req, res, next) {
  fetchUsers()
    .then((users) => {
      res.status(200).send({ users })
    })
    .catch(next)
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
      res.status(200).send({ article })
    })
    .catch(next)
}

function getArticles(req, res, next) {
  const { sort_by = "created_at", order = "desc", topic } = req.query
  fetchAllArticles(sort_by, order, topic)
    .then((articles) => {
      res.status(200).send({ articles })
    })
    .catch(next)
}

function getArticleComments(req, res, next) {
  const { article_id } = req.params

  fetchArticleComments(article_id)
    .then((comments) => {
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

function patchArticleVotes(req, res, next) {
  const { article_id } = req.params
  const { inc_votes } = req.body

  updateArticleVotes(article_id, inc_votes)
    .then((updatedArticle) => {
      res.status(200).send({ article: updatedArticle })
    })
    .catch(next)
}

function deleteComment(req, res, next) {
  const { comment_id } = req.params

  deleteCommentById(comment_id)
    .then(() => {
      res.status(204).send()
    })
    .catch(next)
}

module.exports = {
  getApi,
  getUsers,
  getTopics,
  getArticleByID,
  getArticles,
  getArticleComments,
  postArticleComment,
  patchArticleVotes,
  deleteComment,
}
