const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()
var atob = require('atob');



module.exports = {

  //create
    //1 Admin (email,aircraftname)
    //1 Aircraft (name,fs0,fs1,mom0,mom1,weight0,weight1,cargoweight1,lemac,mac,mommultiplier)
    //1 Glossary (aircraftname,title,body)
    //1 Tank (aircraftname,name,weights,simplemoms)
    //1 Config (aircraftname,name)
    //1 Cargo (aircraftname,name,weight,fs?)
    //1 ConfigCargo (configid,aircraftid,name,weight,fs,qty)
  
  //read
  readAllAircraft: async () => await prisma.aircraft.findMany({
    include: {
      cargos: true,
      tanks: true,
      glossarys: true,
      configs: {include:{configcargos: {include:{cargo:true}}}}
    }
  }),

  isAdmin: async function(req){
    console.log('is admin called')

    try{
    let auth = req.get('authorization')
    let jwt = JSON.parse(atob(auth.split('.')[1]))
    let email = jwt.email
    console.log(email)

    const admin = await prisma.auth.findMany({
      where: {email: {equals: email}}
    })

    if(admin.length > 0){
      console.log(' = admin')
      return true
    }
    else{
      console.log(' != admin')
      return false
    }
  } catch(e){console.log(e)}

    return false
  }
  //readAllGeneral: () =>

  //update

  //delete
    //1 Aircraft cascade to all relashionships/recursive (Aircraft.id)
    //1 Glossary (Glossary.id)
    //1 Tank (Tank.id)
    //1 Config (Config.id)
    //1 ConfigCargo (ConfigCargo.id)
    //1 Cargo (Cargo.id)
    //all CongfCargo (Config.id)
    //
}
