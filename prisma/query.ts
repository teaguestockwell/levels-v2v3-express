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
  //////////////////////////////CREATE//////////////////////////////////////

  // 1 User (User)
  createUser: async (user: User): Promise<User> => {
    return await prisma.user.create({
      data: user,
    })
  },

  //** create 1 aircraft with relationships from deep air object */
  createAircraftFromEntireAircraft: async (
    aircraft: Aircraft
  ): Promise<void> => {
    await prisma.aircraft.create({data: aircraft})
  },

  // 1 Aircraft (Aircraft)
  createAircraftShallow: async (aircraft: Aircraft): Promise<void> => {
    await prisma.aircraft.create({data: aircraft})
  },

  // 1 Glossary (aircraftname,title,body)
  // 1 Tank (aircraftname,name,weights,simplemoms)
  // 1 Config (aircraftname,name)
  // 1 Cargo (aircraftname,name,weight,fs?)
  // 1 ConfigCargo (configid,aircraftid,name,weight,fs,qty)

  //////////////////////////////READ//////////////////////////////////////

  // n admins(aircraftid)
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

  readRoleAtAircraftID: async (req: Request, id: number): Promise<number> => {
    const email = await query.readEmail(req)
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
    const email = await query.readEmail(req)

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

  // upsert
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

  //////////////////////////////UPDATE//////////////////////////////////////
  updateAircraftShallow: async (aircraft: Aircraft): Promise<void> => {
    await prisma.aircraft.update({
      where: {id: aircraft.id},
      data: aircraft,
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
