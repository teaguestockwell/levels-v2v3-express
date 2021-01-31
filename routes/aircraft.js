const express = require('express');
const router = express.Router();
const services = require('../db/services');

router.get('/', async (req, res) => {
  try {
    let admin = await services.isAdmin(req)

    let airs = await services.readAllAircraft()
    res.status(200).send(airs)
    console.log('/aircraft called and sent 200')
  }
  catch (error) {
    res.status(500).send("oops")
  }
})

module.exports = router
