import {Request, Response} from 'express'
import {Aircraft, General, PrismaClient, User} from '@prisma/client'
import atob from 'atob'

const prisma = new PrismaClient()

const service = {
  // create
  // 1 User (email,aircraftid, role)
  upsertUser: async (user: User): Promise<void> => {
    const userid = user.userid

    await prisma.user.upsert({
      // this will throw if admin updates email to non unique aircraft id email combo
      where: {userid},
      update: user,
      create: {
        aircraftid: user.aircraftid,
        email: user.email,
        role: user.role,
      },
    })
  },
  // 1 Aircraft (name,fs0,fs1,mom0,mom1,weight0,weight1,cargoweight1,lemac,mac,mommultiplier)
  // 1 Glossary (aircraftname,title,body)
  // 1 Tank (aircraftname,name,weights,simplemoms)
  // 1 Config (aircraftname,name)
  // 1 Cargo (aircraftname,name,weight,fs?)
  // 1 ConfigCargo (configid,aircraftid,name,weight,fs,qty)

  // read
  // n admins(aircraftid)
  readUsersAtAircraftID: async (aircraftid: number): Promise<User[]> => {
    return await prisma.user.findMany({
      where: {aircraftid},
    })
  },

  readRoleAtUserID: async (userid: number): Promise<number> => {
    try {
      await prisma.user
        .findFirst({
          where: {userid},
        })
        .then((u) => {
          return u.role
        })
    } catch (e) {
      console.log('could not read role at user ')
      return 0
    }
  },

  readUserAtUserID: async (userid: number): Promise<User> => {
    return await prisma.user.findFirst({where: {userid}})
  },

  // //1 bool (req, aircraftid)

  // 1 bool (req, role, aircraftid)
  readIsReqRoleAtAircraftGreaterThan: async (
    req: Request,
    role: number,
    aircraftid: number
  ): Promise<boolean> => {
    console.log('isRoleAtAircraft')
    try {
      const reqUser = await service.readUserAtReqAndAircraftId(req, aircraftid)
      if (reqUser.role > role) {
        console.log('request role: ' + reqUser.role + ' > ' + role)
        return true
      } else {
        console.log('request role: ' + reqUser.role + ' < ' + role)
        return false
      }
    } catch (e) {
      console.log('not role at aircraft ' + aircraftid)
    }
    return false
  },

  readHighestRole: async (req: Request): Promise<number> => {
    console.log('read highest role')
    try {
      const email = service.readEmail(req)
      if (email != null) {
        const users = await prisma.user.findMany({
          where: {email},
        })

        let highest = 0
        users.forEach((u) => {
          if (u.role > highest) {
            highest = u.role
          }
        })
        return highest
      }
    } catch (e) {
      console.log('highest role is 0')
    }
    return 0
  },

  readEmail: (req: Request): string | null => {
    const auth = req.get('authorization')
    if (auth != null) {
      const jwt = JSON.parse(atob(auth.split('.')[1]))
      const email: string = jwt.email
      return email
    } else {
      return null
    }
  },

  // 1 Aircraft(id)
  readAircraftAtID: async (id: number): Promise<Aircraft> => {
    console.log('readOneAircraftAtID: ' + id)

    const air = await prisma.aircraft.findUnique({
      where: {id},
      include: {
        cargos: true,
        tanks: true,
        glossarys: true,
        configs: {
          include: {configcargos: {include: {cargo: true}}},
        },
      },
    })

    return air
  },

  // n Aircraft()
  readAircrafts: async (req: Request): Promise<Aircraft[]> => {
    console.log('readAircrafts')

    const airs = await prisma.aircraft.findMany({
      include: {
        cargos: true,
        tanks: true,
        glossarys: true,
        configs: {
          include: {configcargos: {include: {cargo: true}}},
        },
      },
    })

    return airs
  },

  // 1 role (endpoint request)
  readUserAtReqAndAircraftId: async (
    req: Request,
    aircraftid: number
  ): Promise<User> => {
    const reqEmail = service.readEmail(req)
    const aircraftid_email = {email: reqEmail, aircraftid: aircraftid}
    return await prisma.user.findUnique({where: {aircraftid_email}})
  },

  // //1 person (endpoint request)
  // readPerson: async (req: Request) => {
  //   console.log('readOnePerson')

  //   try{

  //     const auth = req.get('authorization')
  //     if(auth !=null ){
  //     const jwt = JSON.parse(atob(auth.split('.')[1]))
  //     const email:string = jwt.email

  //     const person = await prisma.auth.findUnique({
  //       where: {email}
  //     })

  //       if(person != null){return person}
  //     }
  //   } catch(e) {console.log(e)}
  // },

  readGeneral: async (role: number): Promise<General> => {
    console.log('read general')

    const general = await prisma.general.findFirst({
      where: {role},
    })

    return general
  },

  // update

  // delete
  // 1 Aircraft cascade to all relashionships/recursive (Aircraft.id)
  deleteAircraft: async (aircraftid: number): Promise<void> => {
    await service.deleteGlossarys(aircraftid)
    await service.deleteTanks(aircraftid)
    await service.deleteConfigs(aircraftid)
    await service.deleteCargos(aircraftid)
  },

  // 1 Glossary (Glossary.id)
  deleteGlossary: async (glossaryid: number): Promise<void> => {
    await prisma.glossary.delete({
      where: {glossaryid},
    })
  },

  // n glossary
  deleteGlossarys: async (aircraftid: number): Promise<void> => {
    await prisma.glossary.deleteMany({
      where: {aircraftid},
    })
  },

  // 1 Tank (Tank.id)
  deleteTank: async (tankid: number): Promise<void> => {
    await prisma.tank.delete({
      where: {tankid},
    })
  },

  // n tank
  deleteTanks: async (aircraftid: number): Promise<void> => {
    await prisma.tank.deleteMany({
      where: {aircraftid},
    })
  },

  // 1 Config (Config.id)
  deleteConfig: async (configid: number): Promise<void> => {
    await service.deleteConfigCargosAtConfig(configid)

    await prisma.config.delete({
      where: {configid},
    })
  },

  // n config(aircraftid)
  deleteConfigs: async (aircraftid: number): Promise<void> => {
    await service.deleteConfigCargosAtAircraft(aircraftid)

    await prisma.config.deleteMany({
      where: {aircraftid},
    })
  },

  // 1 Cargo (Cargo.id)
  deleteCargo: async (cargoid: number): Promise<void> => {
    await service.deleteConfigCargosAtCargo(cargoid)

    await prisma.cargo.delete({
      where: {cargoid},
    })
  },

  // n Cargo (aircraftid)
  deleteCargos: async (aircraftid: number): Promise<void> => {
    await service.deleteConfigCargosAtAircraft(aircraftid)

    await prisma.cargo.deleteMany({
      where: {aircraftid},
    })
  },

  // 1 ConfigCargo (ConfigCargo.id)
  deleteConfigCargo: async (configcargoid: number): Promise<void> => {
    await prisma.configCargo.delete({
      where: {configcargoid},
    })
  },

  // n CongfCargo (Config.id)
  deleteConfigCargosAtCargo: async (cargoid: number): Promise<void> => {
    await prisma.configCargo.deleteMany({
      where: {cargoid},
    })
  },

  // n configcarogs(configid)
  deleteConfigCargosAtConfig: async (configid: number): Promise<void> => {
    await prisma.configCargo.deleteMany({
      where: {configid},
    })
  },

  // n configcargos(aircraftid)
  deleteConfigCargosAtAircraft: async (aircraftid: number): Promise<void> => {
    await prisma.configCargo.deleteMany({
      where: {aircraftid},
    })
  },

  // 1 User
  deleteUserAtUserid: async (userid: number): Promise<void> => {
    await prisma.user.delete({
      where: {userid},
    })
  },
}

export default service
