exports.psqlErrorHandler = (err, req, res, next) => {
  if (err.code === "22P02" || err.code === "23502") {
    res.status(400).send({ msg: "400: Bad request" })
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
  console.log(err)
  res.status(500).send({ msg: "500: Internal server error" })
}
