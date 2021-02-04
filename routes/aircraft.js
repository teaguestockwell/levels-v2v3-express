const express = require('express');
const router = express.Router();
const services = require('../db/services');

router.get('/', async (req, res) => {
  try {
    //let role = await services.getRole(req)

    let airs = await services.readAllAircraft(req)
    res.status(200).send(airs)
    console.log('/aircraft called and sent 200')
  }
  catch (error) {
    console.log(error)
    res.status(500).send("oops")
  }
})

module.exports = router
