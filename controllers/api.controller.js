const endpointsJson = require("../endpoints.json")
const { fetchTopics } = require("../models/api.model")

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

module.exports = { getApi, getTopics }
