const express = require('express');
const router = express.Router();
const services = require('../db/services');

router.get('/', async (req, res) => {
  try {
    let role = await services.readOneRole(req)

    let general = await services.readGeneralAtRole(role)

    res.status(200).send(general)
    
    console.log('/general called and sent 200')
  }
  catch (error) {
    res.status(500).send("oops")
  }
})

module.exports = router