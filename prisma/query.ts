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
  //////////////////////////////UPDATE || CREATE////////////////////////////
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

  upsertConfigShallow: async (config: Config): Promise<void> => {
    await prisma.config.upsert({
      where: {configid: config.configid},
      update: config,
      create: {
        aircraft: {connect: {id: config.aircraftid}},
        name: config.name,
      },
    })
  },

  upsertConfigCargoShallow: async (configcargo: ConfigCargo): Promise<void> => {
    await prisma.configCargo.upsert({
      where: {configcargoid: configcargo.configcargoid},
      update: {
        // an user may change the cargo type within a config,
        // however, th UI will prevent them from changing the aircraft, or config
        cargo: {connect: {cargoid: configcargo.cargoid}},
        fs: configcargo.fs,
        qty: configcargo.qty,
      },
      create: {
        config: {connect: {configid: configcargo.configid}},
        aircraft: {connect: {id: configcargo.aircraftid}},
        cargo: {connect: {cargoid: configcargo.cargoid}},
        fs: configcargo.fs,
        qty: configcargo.qty,
      },
    })
  },

  upsertAircraftShallow: async (
    aircraft: Aircraft,
    reqUser: User
  ): Promise<void> => {
    // CREATE
    if (aircraft.id == 0) {
      const newAir = await prisma.aircraft.create({
        data: {
          name: aircraft.name,
          fs0: aircraft.fs0,
          fs1: aircraft.fs1,
          mom0: aircraft.mom0,
          mom1: aircraft.mom1,
          weight0: aircraft.weight0,
          weight1: aircraft.weight1,
          cargoweight1: aircraft.cargoweight1,
          lemac: aircraft.lemac,
          mac: aircraft.mac,
          mommultiplyer: aircraft.mommultiplyer,
        },
      })

      await prisma.user.create({
        data: {
          aircraft: {connect: {id: newAir.id}},
          email: reqUser.email,
          role: 4,
        },
      })
      // UPDATE
    } else {
      await prisma.aircraft.update({
        where: {id: aircraft.id},
        data: aircraft,
      })
    }
  },

  upsertGlossary: async (glossary: Glossary): Promise<void> => {
    await prisma.glossary.upsert({
      where: {glossaryid: glossary.glossaryid},
      update: glossary,
      create: {
        aircraft: {connect: {id: glossary.aircraftid}},
        title: glossary.title,
        body: glossary.body,
      },
    })
  },

  upsertTank: async (tank: Tank): Promise<void> => {
    await prisma.tank.upsert({
      where: {tankid: tank.tankid},
      update: tank,
      create: {
        aircraft: {connect: {id: tank.aircraftid}},
        weights: tank.weights,
        simplemoms: tank.simplemoms,
        name: tank.name,
      },
    })
  },

  upsertCargo: async (cargo: Cargo): Promise<void> => {
    await prisma.cargo.upsert({
      where: {cargoid: cargo.cargoid},
      update: cargo,
      create: {
        aircraft: {connect: {id: cargo.aircraftid}},
        name: cargo.name,
        fs: cargo.fs,
        weight: cargo.weight,
      },
    })
  },

  upsertGeneral: async (general: General): Promise<void> => {
    await prisma.general.upsert({
      where: {role: general.role},
      update: general,
      create: general,
    })
  },

  //////////////////////////////READ//////////////////////////////////////

  readFirstUserAtEmail: async (email: string): Promise<User> => {
    return await prisma.user.findFirst({where: {email}})
  },

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
      return 0
    }
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

  readConfigsDeepAtAircraftID: async (
    aircraftid: number
  ): Promise<Config[]> => {
    return await prisma.config.findMany({
      where: {aircraftid},
      include: {configcargos: {include: {cargo: true}}},
    })
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
    return await prisma.general.findFirst({
      where: {role},
    })
  },

  readGlossaryAtGlossaryID: async (glossaryid: number): Promise<Glossary> => {
    return await prisma.glossary.findUnique({where: {glossaryid}})
  },

  readGlossarysAtAircraftId: async (
    aircraftid: number
  ): Promise<Glossary[]> => {
    return await prisma.glossary.findMany({where: {aircraftid}})
  },

  readGlossartAtGlossaryId: async (glossaryid: number): Promise<Glossary> => {
    return await prisma.glossary.findUnique({where: {glossaryid}})
  },

  readTankAtTankID: async (tankid: number): Promise<Tank> => {
    return await prisma.tank.findUnique({where: {tankid}})
  },

  readTanksAtAircraftId: async (aircraftid: number): Promise<Tank[]> => {
    return await prisma.tank.findMany({where: {aircraftid}})
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

  readCargosAtAircraftId: async (aircraftid: number): Promise<Cargo[]> => {
    return await prisma.cargo.findMany({
      where: {aircraftid},
    })
  },

  readConfigCargoAtConfigCargoId: async (
    configcargoid: number
  ): Promise<ConfigCargo> => {
    return await prisma.configCargo.findUnique({where: {configcargoid}})
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readConfigCargosDeepAtConfigId: async (configid: number): Promise<any[]> => {
    return await prisma.configCargo.findMany({
      where: {configid},
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

  deleteGeneral: async (role: number): Promise<void> => {
    await prisma.general.delete({
      where: {role},
    })
  },
}

export default query
