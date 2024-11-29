exports.psqlErrorHandler = (err, req, res, next) => {
  if (err.code === "22P02" || err.code === "23502") {
    res.status(400).send({ msg: "400: Bad request" })
  } else if (err.code === "23503") {
    if (err.detail.includes('is not present in table "articles"')) {
      res.status(404).send({ msg: "Article not found" })
    } else if (err.detail.includes('is not present in table "users"')) {
      res.status(404).send({ msg: "User not found" })
    }
  } else {
    next(err)
  }
}

exports.customErrorHandler = (err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg })
  } else {
    next(err)
  }
}

exports.serverErrorHandler = (err, res, req, next) => {
  res.status(500).send({ msg: "500: Internal server error" })
}
