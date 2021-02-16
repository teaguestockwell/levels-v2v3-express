import {Request} from 'express'
import {
  Aircraft,
  Cargo,
  Config,
  ConfigCargo,
  General,
  Glossary,
  PrismaClient,
  Tank,
  User,
} from '@prisma/client'
import atob from 'atob'

const prisma = new PrismaClient()

const query = {
  //////////////////////////////READ//////////////////////////////////////

  readFirstUserAtEmail: async (email:string): Promise<User> => {
    return await prisma.user.findFirst({where: {email}})
  },


  readUsersAtAircraftID: async (aircraftid: number): Promise<User[]> => {
    return await prisma.user.findMany({
      where: {aircraftid},
    })
  },

  readUserAtUserWithoutUserId: async (user: User): Promise<User> => {
    const aircraftid_email = {aircraftid: user.aircraftid, email: user.email}
    return await prisma.user.findUnique({
      where: {aircraftid_email},
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
      //console.log('could not read role at user ')
      return 0
    }
  },
  /** if no user => role = 0 */
  readRoleAtAircraftID: async (req: Request, id: number): Promise<number> => {
    const email = query.readEmail(req)
    const aircraftid_email = {aircraftid: id, email: email}

    try {
      const user = await prisma.user.findUnique({
        where: {
          aircraftid_email,
        },
      })

      return user.role
    } catch (e) {
      return 0
    }
  },

  /**
   * given a request, then return all aircraftids
   * that are assined to the users with a role > x
   */
  readAllAircraftIDsOfRoleWhereRoleGreaterThanX: async (
    req: Request,
    x: number
  ): Promise<number[]> => {
    const ret: number[] = []
    const email = query.readEmail(req)

    const users = await prisma.user.findMany({
      where: {
        email: {equals: email},
        role: {gt: x},
      },
    })

    users.forEach((u) => ret.push(u.aircraftid))
    return ret
  },

  readUserAtUserID: async (userid: number): Promise<User> => {
    return await prisma.user.findFirst({where: {userid}})
  },

  readHighestRole: async (req: Request): Promise<number> => {
    ////console.log('read highest role')
    try {
      const email = query.readEmail(req)
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
      //console.log('highest role is 0')
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
  /**
   * returns a recusive aircraft object with all nested relations
   */
  readAircraftAtID: async (id: number): Promise<Aircraft> => {
    //console.log('readOneAircraftAtID: ' + id)

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

  readAircraftAtIDIncludeUsers: async (id: number): Promise<Aircraft> => {
    //console.log('readOneAircraftAtID: ' + id)

    const air = await prisma.aircraft.findUnique({
      where: {id},
      include: {
        cargos: true,
        tanks: true,
        glossarys: true,
        configs: {
          include: {configcargos: {include: {cargo: true}}},
        },
        users: true,
      },
    })
    return air
  },

  // n Aircraft()
  readAircrafts: async (): Promise<Aircraft[]> => {
    //console.log('readAircrafts')

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

  readAircraftsAsMap: async (): Promise<Map<number, Aircraft>> => {
    const ret = new Map<number, Aircraft>()
    const allairs = await query.readAircrafts()
    allairs.forEach((a) => ret.set(a.id, a))
    return ret
  },

  // 1 role (endpoint request)
  readUserAtReqAndAircraftId: async (
    req: Request,
    aircraftid: number
  ): Promise<User> => {
    const reqEmail = query.readEmail(req)
    const aircraftid_email = {email: reqEmail, aircraftid: aircraftid}
    return await prisma.user.findUnique({where: {aircraftid_email}})
  },

  readGeneral: async (role: number): Promise<General> => {
    //console.log('read general')

    const general = await prisma.general.findFirst({
      where: {role},
    })

    return general
  },

  readGlossaryAtGlossaryID: async (glossaryid: number): Promise<Glossary> => {
    return await prisma.glossary.findUnique({where: {glossaryid}})
  },

  
  readGlossarysAtAircraftId: async (aircraftid:number):Promise<Glossary[]> => {
    return await prisma.glossary.findMany({where: {aircraftid}})
  },

  readGlossartAtGlossaryId: async (glossaryid: number):Promise<Glossary> => {
    return await prisma.glossary.findUnique({where:{glossaryid}})
  },

  readTankAtTankID: async (tankid: number): Promise<Tank> => {
    return await prisma.tank.findUnique({where: {tankid}})
  },

  readConfigAtConfigID: async (configid: number): Promise<Config> => {
    return await prisma.config.findUnique({
      where: {configid},
    })
  },

  readCargoAtCargoID: async (cargoid: number): Promise<Cargo> => {
    return await prisma.cargo.findUnique({
      where: {cargoid},
    })
  },

  readConfigCargoAtCargoConfigID: async (
    configcargoid: number
  ): Promise<ConfigCargo> => {
    return await prisma.configCargo.findUnique({where: {configcargoid}})
  },

  //////////////////////////////UPSERT//////////////////////////////////////

   upsertUser: async (user: User): Promise<void> => {
    await prisma.user.upsert({
      where: {userid: user.userid},
      update: user,
      create: {
        aircraft: {connect: {id: user.aircraftid}},
        email: user.email,
        role: user.role,
      },
    })
  },

  upsertAircraftShallow: async (aircraft: Aircraft, reqUser:User): Promise<void> => {
    if(aircraft.id == 0){
      const newair = await prisma.aircraft.create({
        data: aircraft
      })
      await prisma.user.create({
        data:{
          email: reqUser.email,
          role: 4,
          aircraft: {connect:{id: newair.id}}
        }
      })
  } else{
    await prisma.aircraft.update({
      where: {id: aircraft.id},
      data: aircraft,
    })
  }
},

  upsertGlossary: async (glossary: Glossary):Promise<void> => {
    await prisma.glossary.upsert({
      where: {glossaryid: glossary.glossaryid},
      update: glossary,
      create: {
        aircraft: {connect: {id: glossary.aircraftid}},
        title: glossary.title,
        body: glossary.body
      }
    })
  },

  //////////////////////////////DELETE//////////////////////////////////////

  // 1 Aircraft cascade to all relashionships/recursive (Aircraft.id)
  deleteAircraft: async (aircraftid: number): Promise<void> => {
    await query.deleteGlossarys(aircraftid)
    await query.deleteTanks(aircraftid)
    await query.deleteConfigs(aircraftid)
    await query.deleteCargos(aircraftid)
    await query.deleteUsers(aircraftid)
    await prisma.aircraft.delete({where: {id: aircraftid}})
  },

  // n User (aircraftid)
  deleteUsers: async (aircraftid: number): Promise<void> => {
    await prisma.user.deleteMany({
      where: {aircraftid},
    })
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
    await query.deleteConfigCargosAtConfig(configid)

    await prisma.config.delete({
      where: {configid},
    })
  },

  // n config(aircraftid)
  deleteConfigs: async (aircraftid: number): Promise<void> => {
    await query.deleteConfigCargosAtAircraft(aircraftid)

    await prisma.config.deleteMany({
      where: {aircraftid},
    })
  },

  // 1 Cargo (Cargo.id)
  deleteCargo: async (cargoid: number): Promise<void> => {
    await query.deleteConfigCargosAtCargo(cargoid)

    await prisma.cargo.delete({
      where: {cargoid},
    })
  },

  // n Cargo (aircraftid)
  deleteCargos: async (aircraftid: number): Promise<void> => {
    await query.deleteConfigCargosAtAircraft(aircraftid)

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

export default query
