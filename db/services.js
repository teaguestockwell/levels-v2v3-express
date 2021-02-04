const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()
var atob = require('atob');

module.exports = {

  //create

  //1 Admin (email,aircraftname)
  createAdmin: async function(email , aircraftid){
    console.log('create admin')

    const admin = await prisma.a
  },

  //1 Aircraft (name,fs0,fs1,mom0,mom1,weight0,weight1,cargoweight1,lemac,mac,mommultiplier)
  //1 Glossary (aircraftname,title,body)
  //1 Tank (aircraftname,name,weights,simplemoms)
  //1 Config (aircraftname,name)
  //1 Cargo (aircraftname,name,weight,fs?)
  //1 ConfigCargo (configid,aircraftid,name,weight,fs,qty)
  
  //read

  //1 Aircraft where(id)
  readAircraftAtID: async function(id){
    console.log('readOneAircraftAtID: ' + id)

    const air = await prisma.aircraft.findUnique({
      where: {id:{equals: id}},
      include: {
        cargos: true,
        tanks: true,
        glossarys: true,
        configs: {include:{configcargos: {include:{cargo:true}}}}
      },
    })

    return air
  },

  //n Aircraft() 
  readAircrafts: async function(req){  
    console.log('readAllAircraft')


    const airs = await prisma.aircraft.findMany({
      include: {
        cargos: true,
        tanks: true,
        glossarys: true,
        configs: {include:{configcargos: {include:{cargo:true}}}}
      }
    }),

    return airs
  },

  ///1 role (endpoint request)
  readRole: async function(req){
    console.log('readOneRole')/// 0 no role, 1 user, 3 admin 4 db 

    try{
      const auth = req.get('authorization')
      const jwt = JSON.parse(atob(auth.split('.')[1]))
      const email = jwt.email

      const ppl = await prisma.auth.findUnique({
        where: {email: {equals: email}}
      })
      
      console.log(ppl.role)

      return ppl.role
    } catch(e){console.log(e)}

    console.log('no role found')
    return 0
  },

  //1 person (endpoint request)
  readPerson: async function(req){
    console.log('readOnePerson')

    try{
      const auth = req.get('authorization')
      const jwt = JSON.parse(atob(auth.split('.')[1]))
      const email = jwt.email

      const person = await prisma.auth.findUnique({
        where: {email: {equals: email}}
      })

      return person

    } catch(e) {console.log(e)}
  },

  readGeneral: async function(intRole){
    console.log('read general at role called')

    const general = await prisma.general.findFirst({
      where: {role: {equals: intRole}}
    })

    return general
  }

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
