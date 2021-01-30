const express = require('express');
const router = express.Router();
const services = require('../db/services');

router.get('/', async (req, res) => {
  console.log("aircraft route called in api")
  try {
    let airs = await services.readAllAircraft()
    airs.forEach((a) => console.log(a))
    res.status(200).send(airs)
  }
  catch (error) {
    res.status(500).send("oops")
  }
})

module.exports = router
