const endpointsJson = require("../endpoints.json")
const { fetchTopics, fetchArticleById } = require("../models/api.model")

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

module.exports = { getApi, getTopics, getArticleByID }
