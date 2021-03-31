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
      where: {userId: user.userId},
      update: user,
      create: {
        aircraft: {connect: {id: user.aircraftId}},
        name: user.name,
        role: user.role,
      },
    })
  },

  upsertConfigShallow: async (config: Config): Promise<void> => {
    await prisma.config.upsert({
      where: {configId: config.configId},
      update: config,
      create: {
        aircraft: {connect: {id: config.aircraftId}},
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
        config: {connect: {configId: configcargo.configId}},
        aircraft: {connect: {id: configcargo.aircraftId}},
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
          momMultiplyer: aircraft.momMultiplyer,
        },
      })

      await prisma.user.create({
        data: {
          aircraft: {connect: {id: newAir.id}},
          name: reqUser.name,
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
      where: {glossaryId: glossary.glossaryId},
      update: glossary,
      create: {
        aircraft: {connect: {id: glossary.aircraftId}},
        name: glossary.name,
        body: glossary.body,
      },
    })
  },

  upsertTank: async (tank: Tank): Promise<void> => {
    await prisma.tank.upsert({
      where: {tankId: tank.tankId},
      update: tank,
      create: {
        aircraft: {connect: {id: tank.aircraftId}},
        weightsCSV: tank.weightsCSV,
        simpleMomsCSV: tank.simpleMomsCSV,
        name: tank.name,
      },
    })
  },

  upsertCargo: async (cargo: Cargo): Promise<void> => {
    await prisma.cargo.upsert({
      where: {cargoid: cargo.cargoid},
      update: cargo,
      create: {
        aircraft: {connect: {id: cargo.aircraftId}},
        name: cargo.name,
        fs: cargo.fs,
        weight: cargo.weight,
        updated: cargo.updated,
        updatedBy: cargo.updatedBy,
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

  //////// ROLE VERIFICATION //////////////
  readAircraftIdAtTankid: async (tankId: number): Promise<number> => {
    return (await prisma.tank.findFirst({where: {tankId}})).aircraftId
  },

  readAircraftIdAtUserid: async (userId: number): Promise<number> => {
    return (await prisma.user.findFirst({where: {userId}})).aircraftId
  },

  readAircraftIdAtGlossaryid: async (glossaryId: number): Promise<number> => {
    return (await prisma.glossary.findFirst({where: {glossaryId}})).aircraftId
  },

  readAircraftIdAtConfigid: async (configId: number): Promise<number> => {
    return (await prisma.config.findFirst({where: {configId}})).aircraftId
  },

  readAircraftIdAtCargoid: async (cargoid: number): Promise<number> => {
    return (await prisma.cargo.findFirst({where: {cargoid}})).aircraftId
  },

  readAircraftIdAtConfigCargoid: async (
    configcargoid: number
  ): Promise<number> => {
    return (await prisma.configCargo.findFirst({where: {configcargoid}}))
      .aircraftId
  },

  readFirstUserAtname: async (name: string): Promise<User> => {
    return await prisma.user.findFirst({where: {name}})
  },

  readUsersAtAircraftID: async (aircraftId: number): Promise<User[]> => {
    return await prisma.user.findMany({
      where: {aircraftId},
    })
  },

  readRoleAtUserID: async (userId: number): Promise<number> => {
    try {
      await prisma.user
        .findFirst({
          where: {userId},
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
    const name = query.readName(req)
    const aircraftid_name = {aircraftId: id, name: name}

    try {
      const user = await prisma.user.findUnique({
        where: {
          aircraftid_name,
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
    const name = query.readName(req)

    const users = await prisma.user.findMany({
      where: {
        name: {equals: name},
        role: {gt: x},
      },
    })

    users.forEach((u) => ret.push(u.aircraftId))
    return ret
  },

  readUserAtUserID: async (userId: number): Promise<User> => {
    return await prisma.user.findFirst({where: {userId}})
  },

  readHighestRole: async (req: Request): Promise<number> => {
    ////console.log('read highest role')
    try {
      const name = query.readName(req)
      if (name != null) {
        const users = await prisma.user.findMany({
          where: {name},
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

  readName: (req: Request): string | null => {
    const auth = req.get('authorization')
    if (auth != null) {
      const jwt = JSON.parse(atob(auth.split('.')[1]))
      const name: string = jwt.email
      return name
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
          include: {configCargos: {include: {cargo: true}}},
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
          include: {configCargos: {include: {cargo: true}}},
        },
        users: true,
      },
    })
    return air
  },

  readConfigsDeepAtAircraftID: async (
    aircraftId: number
  ): Promise<Config[]> => {
    return await prisma.config.findMany({
      where: {aircraftId},
      include: {configCargos: {include: {cargo: true}}},
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
          include: {configCargos: {include: {cargo: true}}},
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
    aircraftId: number
  ): Promise<User> => {
    const reqname = query.readName(req)
    const aircraftid_name = {name: reqname, aircraftId: aircraftId}
    return await prisma.user.findUnique({where: {aircraftid_name}})
  },

  readGeneral: async (role: number): Promise<General> => {
    return await prisma.general.findFirst({
      where: {role},
    })
  },

  readGlossaryAtGlossaryID: async (glossaryId: number): Promise<Glossary> => {
    return await prisma.glossary.findUnique({where: {glossaryId}})
  },

  readGlossarysAtAircraftId: async (
    aircraftId: number
  ): Promise<Glossary[]> => {
    return await prisma.glossary.findMany({where: {aircraftId}})
  },

  readGlossartAtGlossaryId: async (glossaryId: number): Promise<Glossary> => {
    return await prisma.glossary.findUnique({where: {glossaryId}})
  },

  readTankAtTankID: async (tankId: number): Promise<Tank> => {
    return await prisma.tank.findUnique({where: {tankId}})
  },

  readTanksAtAircraftId: async (aircraftId: number): Promise<Tank[]> => {
    return await prisma.tank.findMany({where: {aircraftId}})
  },

  readConfigAtConfigID: async (configId: number): Promise<Config> => {
    return await prisma.config.findUnique({
      where: {configId},
    })
  },

  readCargoAtCargoID: async (cargoid: number): Promise<Cargo> => {
    return await prisma.cargo.findUnique({
      where: {cargoid},
    })
  },

  readCargosAtAircraftId: async (aircraftId: number): Promise<Cargo[]> => {
    return await prisma.cargo.findMany({
      where: {aircraftId},
    })
  },

  readConfigCargoAtConfigCargoId: async (
    configcargoid: number
  ): Promise<ConfigCargo> => {
    return await prisma.configCargo.findUnique({where: {configcargoid}})
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readConfigCargosDeepAtConfigId: async (configId: number): Promise<any[]> => {
    return await prisma.configCargo.findMany({
      where: {configId},
      include: {cargo: true},
    })
  },

  //////////////////////////////DELETE//////////////////////////////////////

  // 1 Aircraft cascade to all relashionships/recursive (Aircraft.id)
  deleteAircraft: async (aircraftId: number): Promise<void> => {
    await query.deleteGlossarys(aircraftId)
    await query.deleteTanks(aircraftId)
    await query.deleteConfigs(aircraftId)
    await query.deleteCargos(aircraftId)
    await query.deleteUsers(aircraftId)
    await prisma.aircraft.delete({where: {id: aircraftId}})
  },

  // n User (aircraftId)
  deleteUsers: async (aircraftId: number): Promise<void> => {
    await prisma.user.deleteMany({
      where: {aircraftId},
    })
  },

  // 1 Glossary (Glossary.id)
  deleteGlossary: async (glossaryId: number): Promise<void> => {
    await prisma.glossary.delete({
      where: {glossaryId},
    })
  },

  // n glossary
  deleteGlossarys: async (aircraftId: number): Promise<void> => {
    await prisma.glossary.deleteMany({
      where: {aircraftId},
    })
  },

  // 1 Tank (Tank.id)
  deleteTank: async (tankId: number): Promise<void> => {
    await prisma.tank.delete({
      where: {tankId},
    })
  },

  // n tank
  deleteTanks: async (aircraftId: number): Promise<void> => {
    await prisma.tank.deleteMany({
      where: {aircraftId},
    })
  },

  // 1 Config (Config.id)
  deleteConfig: async (configId: number): Promise<void> => {
    await query.deleteConfigCargosAtConfig(configId)

    await prisma.config.delete({
      where: {configId},
    })
  },

  // n config(aircraftId)
  deleteConfigs: async (aircraftId: number): Promise<void> => {
    await query.deleteConfigCargosAtAircraft(aircraftId)

    await prisma.config.deleteMany({
      where: {aircraftId},
    })
  },

  // 1 Cargo (Cargo.id)
  deleteCargo: async (cargoid: number): Promise<void> => {
    await query.deleteConfigCargosAtCargo(cargoid)

    await prisma.cargo.delete({
      where: {cargoid},
    })
  },

  // n Cargo (aircraftId)
  deleteCargos: async (aircraftId: number): Promise<void> => {
    await query.deleteConfigCargosAtAircraft(aircraftId)

    await prisma.cargo.deleteMany({
      where: {aircraftId},
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

  // n configcarogs(configId)
  deleteConfigCargosAtConfig: async (configId: number): Promise<void> => {
    await prisma.configCargo.deleteMany({
      where: {configId},
    })
  },

  // n configCargos(aircraftId)
  deleteConfigCargosAtAircraft: async (aircraftId: number): Promise<void> => {
    await prisma.configCargo.deleteMany({
      where: {aircraftId},
    })
  },

  // 1 User
  deleteUserAtUserid: async (userId: number): Promise<void> => {
    await prisma.user.delete({
      where: {userId},
    })
  },

  deleteGeneral: async (role: number): Promise<void> => {
    await prisma.general.delete({
      where: {role},
    })
  },
}

export default query
