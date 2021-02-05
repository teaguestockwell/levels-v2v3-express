import { Request, Response } from 'express';
import {PrismaClient} from '@prisma/client';
import atob  from 'atob';

const prisma = new PrismaClient()


const service = {

  //create

  //1 Admin (email,aircraftid[])
  createAdmin: async (email: string , aircraftid: number[]) => {
    console.log('create admin')

    const admin = await prisma.auth.create({
      data: {
        role: 3,
        email: email,
        aircrafids: aircraftid
      }
    })
    console.log(admin.email + 'created as admin with: ' + aircraftid.toString())
  },

  //1 Aircraft (name,fs0,fs1,mom0,mom1,weight0,weight1,cargoweight1,lemac,mac,mommultiplier)
  //1 Glossary (aircraftname,title,body)
  //1 Tank (aircraftname,name,weights,simplemoms)
  //1 Config (aircraftname,name)
  //1 Cargo (aircraftname,name,weight,fs?)
  //1 ConfigCargo (configid,aircraftid,name,weight,fs,qty)
  
  //read

  //1 Aircraft where(id)
  readAircraftAtID: async (id: number) => {
    console.log('readOneAircraftAtID: ' + id)

    const air = await prisma.aircraft.findUnique({
      where: {id},
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
  readAircrafts: async (req: Request) => {  
    console.log('readAircrafts')


    const airs = await prisma.aircraft.findMany({
      include: {
        cargos: true,
        tanks: true,
        glossarys: true,
        configs: {include:{configcargos: {include:{cargo:true}}}}
      }
    })

    return airs
  },

  ///1 role (endpoint request)
  readRole: async (req: Request) => {
    console.log('readRole')/// 0 no role, 1 user, 3 admin 4 db 

    try{

      const auth = req.get('authorization')

      if(auth != null){
      const jwt = JSON.parse(atob(auth.split('.')[1]))
      const email:string = jwt.email

      const ppl = await prisma.auth.findUnique({
        where: {email}
      })
      
      if(ppl != null && ppl.role != null){
        console.log(ppl.role)
        return ppl.role
      }
    }
  
    } catch(e){console.log(e)}

    console.log('no role found')
    return 0
  },

  //1 person (endpoint request)
  readPerson: async (req: Request) => {
    console.log('readOnePerson')

    try{
      
      const auth = req.get('authorization')
      if(auth !=null ){
      const jwt = JSON.parse(atob(auth.split('.')[1]))
      const email:string = jwt.email

      const person = await prisma.auth.findUnique({
        where: {email}
      })

        if(person != null){return person}
      }
    } catch(e) {console.log(e)}
  },

  readGeneral: async (role: number) => {
    console.log('read general')

    const general = await prisma.general.findFirst({
      where: {role}
    })

    return general
  },

  //update

  //delete
    //1 Aircraft cascade to all relashionships/recursive (Aircraft.id)
    deleteAircraft: async (aircraftid:number) => {
      await service.deleteGlossarys(aircraftid)
      await service.deleteTanks(aircraftid)
      await service.deleteConfigs(aircraftid)
      await service.deleteCargos(aircraftid)
    },

    //1 Glossary (Glossary.id)
    deleteGlossary: async (glossaryid: number) => {
      await prisma.glossary.delete({
        where: {glossaryid}
      })
    },

    //n glossary
    deleteGlossarys: async (aircraftid: number) => {
      await prisma.glossary.deleteMany({
        where: {aircraftid}
      })
    },

    //1 Tank (Tank.id)
    deleteTank: async (tankid: number) => {
      await prisma.tank.delete({
        where: {tankid}
      })
    },

    //n tank
    deleteTanks: async (aircraftid: number) => {
      await prisma.tank.deleteMany({
        where: {aircraftid}
      })
    },

    //1 Config (Config.id)
    deleteConfig: async (configid: number) => {
      await service.deleteConfigCargosAtConfig(configid)

      await prisma.config.delete({
        where: {configid}
      })
    },

    //n config(aircraftid)
    deleteConfigs: async (aircraftid: number) => {
      await service.deleteConfigCargosAtAircraft(aircraftid)

      await prisma.config.deleteMany({
        where: {aircraftid}
      })
    },

    //1 Cargo (Cargo.id)
    deleteCargo: async (cargoid: number) => {
      await service.deleteConfigCargosAtCargo(cargoid)
      
      await prisma.cargo.delete({
        where: {cargoid}
      })
    },

    //n Cargo (aircraftid)
    deleteCargos: async (aircraftid: number) => {
      await service.deleteConfigCargosAtAircraft(aircraftid)
      
      await prisma.cargo.deleteMany({
        where: {aircraftid}
      })
    },
    
    //1 ConfigCargo (ConfigCargo.id)
    deleteConfigCargo: async (configcargoid: number) => {
      await prisma.configCargo.delete({
        where: {configcargoid}
      })
    },

    //n CongfCargo (Config.id)
    deleteConfigCargosAtCargo: async (cargoid: number) => {
      await prisma.configCargo.deleteMany({
        where: {cargoid}
      })
    },

    //n configcarogs(configid)
    deleteConfigCargosAtConfig: async (configid: number) => {
      await prisma.configCargo.deleteMany({
        where: {configid}
      })
    },

    //n configcargos(aircraftid)
    deleteConfigCargosAtAircraft: async (aircraftid: number) => {
      await prisma.configCargo.deleteMany({
        where: {aircraftid}
      })
    },


}

export default service;
