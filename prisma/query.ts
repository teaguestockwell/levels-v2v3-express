import {Request} from 'express'
import {client as prisma} from './client'
import atob from 'atob'
import {
  Aircraft,
  Cargo,
  Config,
  ConfigCargo,
  Glossary,
  Tank,
  User,
} from '@prisma/client'
import {v4} from 'uuid'

export const query = {
  readAirsAtReqShallow: async (req: Request, roleGT: number): Promise<Aircraft[]> => {
    const name = query.readName(req)

    const getAirs = async () => {
      const users = await prisma.user.findMany({
        where: {
          name: name,
          role: {gt: roleGT},
        },
        include: {
          aircraft: {
            include: {
              // configs is included in shallow because the ui app bar should know when a new config is available
              configs: true,
              // cargos are included because they need to be selected from when an admin is modifying config cargo
              cargos: true
            }
          }
        },
      })

      if(users){
        return users.map(u => u.aircraft)
      }
      return []
  }

    let airs = await getAirs()

    // give em the demo aircraft
    if(!airs.length){
      await query.upsertUser({
        name,
        role: 1,
        updated: new Date(),
        updatedBy: 'developer',
        aircraftId: 3,
        userId: 0,
      })
      airs = await getAirs()
    }

    return airs
  },


  readAirsAtReq: async (req: Request, roleGT: number): Promise<Aircraft[]> => {
    const name = query.readName(req)

    const getAirs = async () => {
      const users = await prisma.user.findMany({
        where: {
          name: name,
          role: {gt: roleGT},
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
            },
          },
        },
      })

      if(users){
        return users.map(u => u.aircraft)
      }
      return []
  }

    let airs = await getAirs()

    // give em the demo aircraft
    if(!airs.length){
      await query.upsertUser({
        name,
        role: 1,
        updated: new Date(),
        updatedBy: 'developer',
        aircraftId: 3,
        userId: 0,
      })
      airs = await getAirs()
    }

    return airs
  },
  //////////////////////////////UPDATE || CREATE////////////////////////////
  //////////////////////////////UPSERT//////////////////////////////////////

  updateAircraftHash: async (aircraftId: number): Promise<string> => {
    return (await prisma.aircraft.update({
      where: {aircraftId},
      data: {
        deepHashId: v4()
      }
    })).deepHashId
  },

  upsertUser: async (user: User): Promise<User> => {
    return prisma.user.upsert({
      where: {userId: user.userId},
      update: user,
      create: {
        updatedBy: user.updatedBy,
        updated: user.updated,
        aircraft: {connect: {aircraftId: user.aircraftId}},
        name: (user.name as string).toLowerCase().trim(),
        role: user.role,
      },
    })

    // no not update the deep hash because the last updated query does not return users

  },

  upsertConfigShallow: async (config: Config): Promise<Config> => {
    const upserted = await prisma.config.upsert({
      where: {configId: config.configId},
      update: config,
      create: {
        updated: config.updated,
        updatedBy: config.updatedBy,
        aircraft: {connect: {aircraftId: config.aircraftId}},
        name: config.name,
      },
    })

    query.updateAircraftHash(upserted.aircraftId)

    return upserted
  },

  upsertConfigCargoShallow: async (configCargo: ConfigCargo): Promise<ConfigCargo> => {
    const upserted = await prisma.configCargo.upsert({
      where: {configCargoId: configCargo.configCargoId},
      update: {
        // an user may change the cargo type within a config,
        // however, th UI will prevent them from changing the aircraft, or config
        cargo: {connect: {cargoId: configCargo.cargoId}},
        fs: configCargo.fs,
        qty: configCargo.qty,
        updated: configCargo.updated,
        updatedBy: configCargo.updatedBy,
      },
      create: {
        updated: configCargo.updated,
        updatedBy: configCargo.updatedBy,
        config: {connect: {configId: configCargo.configId}},
        aircraft: {connect: {aircraftId: configCargo.aircraftId}},
        cargo: {connect: {cargoId: configCargo.cargoId}},
        fs: configCargo.fs,
        qty: configCargo.qty,
      },
    })

    query.updateAircraftHash(upserted.aircraftId)

    return upserted
  },

  upsertAircraftShallow: async (
    aircraft: Aircraft,
    reqUser: User
  ): Promise<Aircraft> => {
    let upserted
    // CREATE
    if (aircraft.aircraftId == 0) {
      upserted = await prisma.aircraft.create({
        data: {
          updatedBy: reqUser.name,
          updated: aircraft.updated,
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
          deepHashId: v4()
        },
      })

      await prisma.user.create({
        data: {
          updatedBy: reqUser.name,
          updated: aircraft.updated,
          aircraft: {connect: {aircraftId: upserted.aircraftId}},
          name: reqUser.name,
          role: 4,
        },
      })
      // UPDATE
    } else {
      upserted = await prisma.aircraft.update({
        where: {aircraftId: aircraft.aircraftId},
        data: {...aircraft, updatedBy: reqUser.name, updated: new Date(), deepHashId: v4()},
      })
    }
    query.updateAircraftHash(upserted.aircraftId)

    return upserted
  },

  upsertGlossary: async (glossary: Glossary): Promise<Glossary> => {
    const upserted = await prisma.glossary.upsert({
      where: {glossaryId: glossary.glossaryId},
      update: glossary,
      create: {
        updatedBy: glossary.updatedBy,
        updated: glossary.updated,
        aircraft: {connect: {aircraftId: glossary.aircraftId}},
        name: glossary.name,
        body: glossary.body,
      },
    })

    query.updateAircraftHash(upserted.aircraftId)

    return upserted
  },

  upsertTank: async (tank: Tank): Promise<Tank> => {
    if(tank.weightsCSV.split(',').length !== tank.simpleMomsCSV.split(',').length){
      throw new Error('Tank weights must be the same length as tank moments')
    }

    const upserted = await prisma.tank.upsert({
      where: {tankId: tank.tankId},
      update: tank,
      create: {
        updatedBy: tank.updatedBy,
        updated: tank.updated,
        aircraft: {connect: {aircraftId: tank.aircraftId}},
        weightsCSV: tank.weightsCSV,
        simpleMomsCSV: tank.simpleMomsCSV,
        name: tank.name,
      },
    })

    query.updateAircraftHash(upserted.aircraftId)

    return upserted
  },

  upsertCargo: async (cargo: Cargo): Promise<Cargo> => {
    const upserted = await prisma.cargo.upsert({
      where: {cargoId: cargo.cargoId},
      update: cargo,
      create: {
        updated: cargo.updated,
        updatedBy: cargo.updatedBy,
        aircraft: {connect: {aircraftId: cargo.aircraftId}},
        name: cargo.name,
        fs: cargo.fs,
        weight: cargo.weight,
        category: cargo.category
      },
    })

    query.updateAircraftHash(upserted.aircraftId)

    return upserted
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

  readUsersAtAircraftId: async (aircraftId: number): Promise<User[]> => {
    return prisma.user.findMany({
      where: {aircraftId},
    })
  },

  readUserAtName_AircraftId: async (
    name: string,
    aircraftId: number
  ): Promise<User | null> => {
    const aircraftId_name = {aircraftId, name}
    return prisma.user.findUnique({where: {aircraftId_name}}).catch(() => null)
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

  readUserAtUserId: async (userId: number): Promise<User> => {
    return prisma.user.findFirst({where: {userId}})
  },

  readHighestRole: async (req: Request): Promise<number> => {
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

  readUserWithHighestRole: async (req: Request): Promise<User> => {
    const name = query.readName(req)

    const users = await prisma.user.findMany({
      where: {name},
    })

    let highest: User = {
      name: 'no name',
      role: 0,
      aircraftId: 0,
      userId: 0,
      updated: new Date(),
      updatedBy: 'developer',
    }
    users.forEach((u) => {
      if (u.role > highest.role) {
        highest = u
      }
    })

    return highest
  },

  readName: (req: Request): string | null => {
    const auth = req.get('authorization')
    if (auth != null) {
      return JSON.parse(atob(auth.split('.')[1])).email
    } else {
      return null
    }
  },

  // 1 Aircraft(aircraftId)
  /**
   * returns a recursive aircraft object with all nested relations
   */
  readAircraftAtId: async (aircraftId: number): Promise<Aircraft> => {
    return prisma.aircraft.findUnique({
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
  },

  readAircraftAtIdIncludeUsers: async (
    aircraftId: number
  ): Promise<Aircraft> => {
    return prisma.aircraft.findUnique({
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
  },

  readConfigsDeepAtAircraftId: async (
    aircraftId: number
  ): Promise<Config[]> => {
    return prisma.config.findMany({
      where: {aircraftId},
      include: {configCargos: {include: {cargo: true}}},
    })
  },

  // n Aircraft()
  readAircrafts: async (): Promise<Aircraft[]> => {
    return prisma.aircraft.findMany({
      include: {
        cargos: true,
        tanks: true,
        glossarys: true,
        configs: {
          include: {configCargos: {include: {cargo: true}}},
        },
      },
    })
  },

  // readAircraftsAsObj: async (): Promise<{[key: number]: Aircraft}> => {
  //   const ret2: {[key: number]: Aircraft} = {}
  //   ;(await query.readAircrafts()).forEach((a) => (ret2[a.aircraftId] = a))
  //   return ret2
  // },

  // 1 role (endpoint request)
  readUserAtReqAndAircraftId: async (
    req: Request,
    aircraftId: number
  ): Promise<User> => {
    const name = query.readName(req)
    const aircraftId_name = {name, aircraftId}
    return prisma.user.findUnique({where: {aircraftId_name}})
  },

  readGlossaryAtGlossaryId: async (glossaryId: number): Promise<Glossary> => {
    return prisma.glossary.findUnique({where: {glossaryId}})
  },

  readGlossarysAtAircraftId: async (
    aircraftId: number
  ): Promise<Glossary[]> => {
    return prisma.glossary.findMany({where: {aircraftId}})
  },

  readTankAtTankId: async (tankId: number): Promise<Tank> => {
    return prisma.tank.findUnique({where: {tankId}})
  },

  readTanksAtAircraftId: async (aircraftId: number): Promise<Tank[]> => {
    return prisma.tank.findMany({where: {aircraftId}})
  },

  readConfigAtConfigId: async (configId: number): Promise<Config> => {
    return prisma.config.findUnique({
      where: {configId},
    })
  },

  readCargoAtCargoId: async (cargoId: number): Promise<Cargo> => {
    return prisma.cargo.findUnique({
      where: {cargoId},
    })
  },

  readCargosAtAircraftId: async (aircraftId: number): Promise<Cargo[]> => {
    return prisma.cargo.findMany({
      where: {aircraftId},
    })
  },

  readConfigCargoAtConfigCargoId: async (
    configCargoId: number
  ): Promise<ConfigCargo> => {
    return prisma.configCargo.findUnique({where: {configCargoId}})
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readConfigCargosDeepAtConfigId: async (configId: number): Promise<any[]> => {
    return prisma.configCargo.findMany({
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

}
