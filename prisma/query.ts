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

export const prisma = new PrismaClient()

const query = {

  readAirsAtReq: async (req: Request, roleGT: number): Promise<Aircraft[]> => {
    const name = await query.readName(req)
    
    return (await prisma.user.findMany({
      where: {
        name: name,
        role: {gt: roleGT}
      },
      include: {
        aircraft: {
          include: {
          cargos: true,
          tanks: true,
          glossarys: true,
          configs: {
            include: {configCargos: {include: {cargo: true}}},
          },
        }
        },
      },
      
    })).map(u => u.aircraft)
  },
  //////////////////////////////UPDATE || CREATE////////////////////////////
  //////////////////////////////UPSERT//////////////////////////////////////

  upsertUser: async (user: User): Promise<void> => {
    await prisma.user.upsert({
      where: {userId: user.userId},
      update: user,
      create: {
        aircraft: {connect: {aircraftId: user.aircraftId}},
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
        aircraft: {connect: {aircraftId: config.aircraftId}},
        name: config.name,
      },
    })
  },

  upsertConfigCargoShallow: async (configCargo: ConfigCargo): Promise<void> => {
    await prisma.configCargo.upsert({
      where: {configCargoId: configCargo.configCargoId},
      update: {
        // an user may change the cargo type within a config,
        // however, th UI will prevent them from changing the aircraft, or config
        cargo: {connect: {cargoId: configCargo.cargoId}},
        fs: configCargo.fs,
        qty: configCargo.qty,
      },
      create: {
        config: {connect: {configId: configCargo.configId}},
        aircraft: {connect: {aircraftId: configCargo.aircraftId}},
        cargo: {connect: {cargoId: configCargo.cargoId}},
        fs: configCargo.fs,
        qty: configCargo.qty,
      },
    })
  },

  upsertAircraftShallow: async (
    aircraft: Aircraft,
    reqUser: User
  ): Promise<void> => {
    // CREATE
    if (aircraft.aircraftId == 0) {
      const newAir = await prisma.aircraft.create({
        data: {
          name: aircraft.name,
          fs0: aircraft.fs0,
          fs1: aircraft.fs1,
          mom0: aircraft.mom0,
          mom1: aircraft.mom1,
          weight0: aircraft.weight0,
          weight1: aircraft.weight1,
          cargoWeight1: aircraft.cargoWeight1,
          lemac: aircraft.lemac,
          mac: aircraft.mac,
          momMultiplyer: aircraft.momMultiplyer,
        },
      })

      await prisma.user.create({
        data: {
          aircraft: {connect: {aircraftId: newAir.aircraftId}},
          name: reqUser.name,
          role: 4,
        },
      })
      // UPDATE
    } else {
      await prisma.aircraft.update({
        where: {aircraftId: aircraft.aircraftId},
        data: aircraft,
      })
    }
  },

  upsertGlossary: async (glossary: Glossary): Promise<void> => {
    await prisma.glossary.upsert({
      where: {glossaryId: glossary.glossaryId},
      update: glossary,
      create: {
        aircraft: {connect: {aircraftId: glossary.aircraftId}},
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
        aircraft: {connect: {aircraftId: tank.aircraftId}},
        weightsCSV: tank.weightsCSV,
        simpleMomsCSV: tank.simpleMomsCSV,
        name: tank.name,
      },
    })
  },

  upsertCargo: async (cargo: Cargo): Promise<void> => {
    await prisma.cargo.upsert({
      where: {cargoId: cargo.cargoId},
      update: cargo,
      create: {
        aircraft: {connect: {aircraftId: cargo.aircraftId}},
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
  readAircraftIdAtTankId: async (tankId: number): Promise<number> => {
    return (await prisma.tank.findFirst({where: {tankId}})).aircraftId
  },

  readAircraftIdAtUserid: async (userId: number): Promise<number> => {
    return (await prisma.user.findFirst({where: {userId}})).aircraftId
  },

  readAircraftIdAtGlossaryId: async (glossaryId: number): Promise<number> => {
    return (await prisma.glossary.findFirst({where: {glossaryId}})).aircraftId
  },

  readAircraftIdAtConfigid: async (configId: number): Promise<number> => {
    return (await prisma.config.findFirst({where: {configId}})).aircraftId
  },

  readAircraftIdAtCargoid: async (cargoId: number): Promise<number> => {
    return (await prisma.cargo.findFirst({where: {cargoId}})).aircraftId
  },

  readAircraftIdAtConfigCargoid: async (
    configCargoId: number
  ): Promise<number> => {
    return (await prisma.configCargo.findFirst({where: {configCargoId}}))
      .aircraftId
  },

  readFirstUserAtName: async (name: string): Promise<User> => {
    return await prisma.user.findFirst({where: {name}})
  },

  readUsersAtAircraftId: async (aircraftId: number): Promise<User[]> => {
    return await prisma.user.findMany({
      where: {aircraftId},
    })
  },

  readRoleAtUserId: async (userId: number): Promise<number> => {
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
  readRoleAtAircraftId: async (
    req: Request,
    aircraftId: number
  ): Promise<number> => {
    const name = query.readName(req)
    const aircraftId_name = {aircraftId, name}

    try {
      const user = await prisma.user.findUnique({
        where: {
          aircraftId_name,
        },
      })
      return user.role
    } catch (e) {
      return 0
    }
  },

  /**
   * given a request, then return all aircraftIds
   * that are assigned to the users with a role > x
   */
  readAllAircraftIdsOfRoleWhereRoleGreaterThanX: async (
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

  readUserAtUserId: async (userId: number): Promise<User> => {
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

  // 1 Aircraft(aircraftId)
  /**
   * returns a recursive aircraft object with all nested relations
   */
  readAircraftAtId: async (aircraftId: number): Promise<Aircraft> => {
    //console.log('readOneAircraftAtId: ' + aircraftId)

    const air = await prisma.aircraft.findUnique({
      where: {aircraftId},
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

  readAircraftAtIdIncludeUsers: async (
    aircraftId: number
  ): Promise<Aircraft> => {
    //console.log('readOneAircraftAtId: ' + aircraftId)

    const air = await prisma.aircraft.findUnique({
      where: {aircraftId},
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

  readConfigsDeepAtAircraftId: async (
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

  readAircraftsAsObj: async (): Promise<{[key:number]:Aircraft}> => {
    const ret2: {[key:number]:Aircraft} = {};
    (await query.readAircrafts()).forEach(a => ret2[a.aircraftId] = a)
    return ret2
  },

  // 1 role (endpoint request)
  readUserAtReqAndAircraftId: async (
    req: Request,
    aircraftId: number
  ): Promise<User> => {
    const name = query.readName(req)
    const aircraftId_name = {name, aircraftId}
    return await prisma.user.findUnique({where: {aircraftId_name}})
  },

  readGeneral: async (role: number): Promise<General> => {
    return await prisma.general.findFirst({
      where: {role},
    })
  },

  readGlossaryAtGlossaryId: async (glossaryId: number): Promise<Glossary> => {
    return await prisma.glossary.findUnique({where: {glossaryId}})
  },

  readGlossarysAtAircraftId: async (
    aircraftId: number
  ): Promise<Glossary[]> => {
    return await prisma.glossary.findMany({where: {aircraftId}})
  },

  readTankAtTankId: async (tankId: number): Promise<Tank> => {
    return await prisma.tank.findUnique({where: {tankId}})
  },

  readTanksAtAircraftId: async (aircraftId: number): Promise<Tank[]> => {
    return await prisma.tank.findMany({where: {aircraftId}})
  },

  readConfigAtConfigId: async (configId: number): Promise<Config> => {
    return await prisma.config.findUnique({
      where: {configId},
    })
  },

  readCargoAtCargoId: async (cargoId: number): Promise<Cargo> => {
    return await prisma.cargo.findUnique({
      where: {cargoId},
    })
  },

  readCargosAtAircraftId: async (aircraftId: number): Promise<Cargo[]> => {
    return await prisma.cargo.findMany({
      where: {aircraftId},
    })
  },

  readConfigCargoAtConfigCargoId: async (
    configCargoId: number
  ): Promise<ConfigCargo> => {
    return await prisma.configCargo.findUnique({where: {configCargoId}})
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readConfigCargosDeepAtConfigId: async (configId: number): Promise<any[]> => {
    return await prisma.configCargo.findMany({
      where: {configId},
      include: {cargo: true},
    })
  },

  //////////////////////////////DELETE//////////////////////////////////////

  // 1 Aircraft cascade to all relationships/recursive (Aircraft.aircraftId)
  deleteAircraft: async (aircraftId: number): Promise<void> => {
    await query.deleteGlossarys(aircraftId)
    await query.deleteTanks(aircraftId)
    await query.deleteConfigs(aircraftId)
    await query.deleteCargos(aircraftId)
    await query.deleteUsers(aircraftId)
    await prisma.aircraft.delete({where: {aircraftId: aircraftId}})
  },

  // n User (aircraftId)
  deleteUsers: async (aircraftId: number): Promise<void> => {
    await prisma.user.deleteMany({
      where: {aircraftId},
    })
  },

  // 1 Glossary (Glossary.aircraftId)
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

  // 1 Tank (Tank.aircraftId)
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

  // 1 Config (Config.aircraftId)
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

  // 1 Cargo (Cargo.aircraftId)
  deleteCargo: async (cargoId: number): Promise<void> => {
    await query.deleteConfigCargosAtCargo(cargoId)

    await prisma.cargo.delete({
      where: {cargoId},
    })
  },

  // n Cargo (aircraftId)
  deleteCargos: async (aircraftId: number): Promise<void> => {
    await query.deleteConfigCargosAtAircraft(aircraftId)

    await prisma.cargo.deleteMany({
      where: {aircraftId},
    })
  },

  // 1 ConfigCargo (ConfigCargo.aircraftId)
  deleteConfigCargo: async (configCargoId: number): Promise<void> => {
    await prisma.configCargo.delete({
      where: {configCargoId},
    })
  },

  // n ConfigCargo (Config.aircraftId)
  deleteConfigCargosAtCargo: async (cargoId: number): Promise<void> => {
    await prisma.configCargo.deleteMany({
      where: {cargoId},
    })
  },

  // n configCargos(configId)
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
