import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main(){

  //create aircraft, glossary, tanks
  const air1 = await prisma.aircraft.create({
    data:{
      name : 'C-17A-ER',
    fs0 : 80.5,
    fs1: 2168,
    mom0: 9999,
    mom1: 50000,
    weight0: 260000,
    weight1: 300000,
    cargoweight1: 300000,
    lemac: 793.6,
    mac: 309.5,
    mommultiplyer: 10000,

    glossarys: {create: 
      [{
        title: 'MAC',
        body: 'The distance between the leading and trailing edge of the wing is known as the chord. If the leading edge and trailing edge are parallel, the chord of the wing is constant along the wing’s length. However, because the wings on the C17 are both tapered and swept, the chord changes along the span of the wing. The average length of the chord is known as the mean aerodynamic chord (MAC). The MAC of the C17 is 309.5in 1C-17A-5-2(2-28)',
      },
      {
        title: 'Chart C',
        body: 'The Chart C is a record of the aircraft weight and balance that is continuously updated by a qualified weight and balance technician. Some equipment is provided by the manufacturer during aircraft delivery to the Air Force and is included in the aircraft\'s basic weight. Further, To standardize equipment and its location, items listed in Addenda A Table 2.1 are included in the basic weight of the aircraft.',
      },
      {
        title: '%MAC',
        body: 'The Percent Mean Aerodynamic Chord identifies where the center or gravity is along the chord of the wing. 0% MAC is located at the LEMAC, and 100% MAC is at the TEMAC(Trailing Edge Mean Aerodynamic Chord). The formula for calculating %MAC is (Balance Arm - LEMAC) / MAC) X 100 1C-17A-5-2(2-28).',
      },
      {
        title: 'Reference Datum',
        body: 'The reference datum is a point located 80.5in forward of the nose of the C17. 1C-17A-5-2(2-28)',
      },
      {
        title: 'Fuselage Station (FS)',
        body: 'An imaginary plane, that runs along the length of the aircraft. It is identified by its distance from the reference datum in inches. FS 0 starts at the reference datum. 1C-17A-5-2(2-28)',
      },
      {
        title: 'Balance Arm',
        body: 'The balance arm is the horizontal distance between the reference datum and the center or gravity. Balance arm = total simplified moment X 10,000 / total weight lb.',
      },
      {
        title: 'Addenda A',
        body: 'Configurations with common items, such as sidewall seat life vests, are listed in the Addenda A chapter 3. The weight and moment of these common configurations or their items can be added as cargo into the calculator. For the most accurate calculation, if the item is not accounted for in the Chart C, not listed in Addenda A table 2.1 as equipment that is included in the aircraft basic weight, add its weight and FS into the calculator. https://static.e-publishing.af.mil/production/1/af_a3/publication/afman11-2c-17v3add-a/afman11-2c-17v3add-a.pdf',
      },
      {
        title: 'Moment',
        body: 'The moment of an item is weight in lb multiplied by its arm(distance from the reference datum). Moment is measured in inch-pounds. Moment = Weight in lb x arm. Simplified moment = moment/10000. The moment of fuel is measured in simplified moment and can be found in tables 2-5 or 2-9 for ER jets. The weight and moment of items can be found in AFI 11-2C17V3ADD-A and 1C-17A-5-2',
      },
      {
        title: 'Lemac',
        body: 'The Leading Edge of the Mean Aerodynamic Chord or LEMAC is a measurement of how far the leading edge of the wing is from the reference datum. For swept-wing aircraft, the LEMAC is an average of the distance the leading edge of the wing is from the reference datum. The LEMAC of the C17 is located 793.6in from the reference datum. 1C-17A-5-2(2-28)',
      }]
    },

    tanks:{create:
      [{
        name: 'Tank 1',
        weights: '250, 500, 750, 1000, 1250, 1500, 1750, 2000, 2250, 2500, 2750, 3000, 3250, 3500, 3750, 4000, 4250, 4500, 4750, 5000, 5250, 5500, 5750, 6000, 6250, 6500, 6750, 7000, 7250, 7500, 7750, 8000, 8250, 8500, 8750, 9000, 9250, 9500, 9750, 10000, 10250, 10500, 10750, 11000, 11250, 11500, 11750, 12000, 12250, 12500, 12750, 13000, 13250, 13500, 13750, 14000, 14250, 14500, 14750, 15000, 15250, 15500, 15750, 16000, 16250, 16500, 16750, 17000, 17250, 17500, 17750, 18000, 18250, 18500, 18750, 19000, 19250, 19500, 19750, 20000, 20250, 20500, 20750, 21000, 21250, 21500, 21750, 22000, 22250, 22500, 22750, 23000, 23250, 23500, 23750, 24000, 24250, 24500, 24750, 25000, 25250, 25500, 25750, 26000, 26250, 26500, 26750, 27000, 27250, 27500, 27750, 28000, 28250, 28500, 28750, 29000, 29250, 29500, 29750, 30000, 30250, 30500, 30750, 31000, 31250, 31500, 31750, 32000, 32250, 32500, 32750, 33000, 33250, 33500, 33750, 34000, 34250, 34500, 34750, 35000, 35250, 35500, 35750, 36000, 36250, 36500, 36750, 37000, 37250, 37500, 37750, 37760',
        simplemoms: '28, 56, 84, 112, 140, 168, 196, 222, 248, 274, 300, 326, 353, 379, 405, 430, 456, 482, 508, 534, 559, 585, 610, 636, 661, 687, 712, 738, 763, 789, 814, 839, 864, 889, 915, 940, 965, 990, 1016, 1041, 1066, 1091, 1116, 1141, 1166, 1190, 1215, 1240, 1265, 1290, 1315, 1340, 1365, 1390, 1414, 1439, 1464, 1489, 1514, 1538, 1563, 1588, 1612, 1637, 1662, 1686, 1711, 1736, 1760, 1785, 1810, 1834, 1859, 1883, 1908, 1932, 1957, 1982, 2006, 2031, 2055, 2080, 2104, 2129, 2153, 2178, 2202, 2227, 2251, 2276, 2300, 2325, 2349, 2373, 2398, 2422, 2447, 2471, 2495, 2520, 2544, 2569, 2593, 2617, 2641, 2665, 2689, 2713, 2737, 2761, 2785, 2809, 2833, 2857, 2881, 2905, 2929, 2953, 2977, 3001, 3024, 3048, 3072, 3096, 3119, 3143, 3167, 3191, 3214, 3238, 3262, 3285, 3309, 3332, 3356, 3379, 3403, 3427, 3450, 3474, 3497, 3520, 3543, 3566, 3590, 3613, 3636, 3659, 3682, 3705, 3729, 3730',
      },
      {
        name: 'Tank 2 ER',
        weights: '250, 500, 750, 1000, 1250, 1500, 1750, 2000, 2250, 2500, 2750, 3000, 3250, 3500, 3750, 4000, 4250, 4500, 4750, 5000, 5250, 5500, 5750, 6000, 6250, 6500, 6750, 7000, 7250, 7500, 7750, 8000, 8250, 8500, 8750, 9000, 9250, 9500, 9750, 10000, 10250, 10500, 10750, 11000, 11250, 11500, 11750, 12000, 12250, 12500, 12750, 13000, 13250, 13500, 13750, 14000, 14250, 14500, 14750, 15000, 15250, 15500, 15750, 16000, 16250, 16500, 16750, 17000, 17250, 17500, 17750, 18000, 18250, 18500, 18750, 19000, 19250, 19500, 19750, 20000, 20250, 20500, 20750, 21000, 21250, 21500, 21750, 22000, 22250, 22500, 22750, 23000, 23250, 23500, 23750, 24000, 24250, 24500, 24750, 25000, 25250, 25500, 25750, 26000, 26250, 26500, 26750, 27000, 27250, 27500, 27750, 28000, 28250, 28500, 28750, 29000, 29250, 29500, 29750, 30000, 30250, 30500, 30750, 31000, 31250, 31500, 31750, 32000, 32250, 32500, 32750, 33000, 33250, 33500, 33750, 34000, 34250, 34500, 34750, 35000, 35250, 35500, 35750, 36000, 36250, 36500, 36750, 37000, 37250, 37500, 37750, 38240, 38740, 39240, 39740, 40240, 40740, 41240, 41740, 42240, 42740, 43240, 43740, 44240, 44740, 45240, 45740, 46240, 46740, 47240, 47740, 48240, 48740, 49240, 49740, 50240, 50740, 51240, 51740, 52240, 52740, 53240, 53740, 54240, 54740, 55240, 55740, 56240, 56740, 57240, 57740, 58240, 58740, 59240, 59740, 60240, 60740, 61240, 61740, 62240, 62740, 63240, 63640, 64240, 64740, 65240, 65740, 66240, 66740, 67240, 67740, 68240, 68740, 69240, 69740, 70240, 70740, 71240, 71740, 72240, 72740, 73240, 73740, 74240, 74640, 75240, 75740, 76240, 76740, 77240, 77740, 78240, 78740, 79240, 79740, 80240, 80740, 81240, 81740, 82240, 82740, 83240, 83740, 84240, 84540',
        simplemoms: '21, 43, 64, 85, 107, 128, 149, 170, 191, 213, 234, 255, 276, 297, 318, 339, 359, 380, 401, 421, 441, 461, 481, 501, 521, 541, 561, 581, 600, 620, 640, 660, 679, 699, 719, 739, 758, 778, 797, 817, 837, 857, 876, 896, 916, 935, 955, 975, 994, 1014, 1033, 1053, 1073, 1093, 1112, 1132, 1152, 1171, 1191, 1210, 1230, 1250, 1270, 1289, 1309, 1329, 1348, 1368, 1387, 1407, 1427, 1446, 1466, 1486, 1506, 1525, 1545, 1564, 1584, 1604, 1623, 1643, 1663, 1682, 1702, 1721, 1741, 1760, 1780, 1799, 1819, 1839, 1858, 1878, 1897, 1917, 1936, 1956, 1976, 1995, 2014, 2034, 2053, 2072, 2091, 2111, 2130, 2149, 2168, 2187, 2206, 2225, 2244, 2262, 2285, 2308, 2330, 2353, 2376, 2399, 2422, 2444, 2466, 2489, 2511, 2534, 2557, 2579, 2602, 2625, 2647, 2669, 2692, 2714, 2736, 2758, 2781, 2803, 2826, 2848, 2870, 2893, 2915, 2937, 2959, 2982, 3004, 3026, 3049, 3071, 3094, 3137, 3182, 3227, 3271, 3316, 3361, 3405, 3450, 3494, 3539, 3583, 3628, 3672, 3717, 3761, 3805, 3850, 3894, 3939, 3983, 4027, 4072, 4116, 4159, 4203, 4246, 4289, 4332, 4375, 4419, 4462, 4505, 4548, 4589, 4631, 4672, 4713, 4755, 4796, 4837, 4879, 4920, 4961, 5003, 5044, 5085, 5127, 5168, 5209, 5250, 5290, 5330, 5370, 5411, 5451, 5491, 5531, 5571, 5611, 5648, 5684, 5720, 5756, 5792, 5828, 5864, 5900, 5935, 5971, 6007, 6043, 6079, 6115, 6151, 6187, 6222, 6258, 6294, 6329, 6365, 6401, 6437, 6473, 6509, 6545, 6581, 6616, 6652, 6687, 6723, 6758, 6794, 6829, 6850',
      },
      {
        name: 'Tank 3 ER',
        weights: '250, 500, 750, 1000, 1250, 1500, 1750, 2000, 2250, 2500, 2750, 3000, 3250, 3500, 3750, 4000, 4250, 4500, 4750, 5000, 5250, 5500, 5750, 6000, 6250, 6500, 6750, 7000, 7250, 7500, 7750, 8000, 8250, 8500, 8750, 9000, 9250, 9500, 9750, 10000, 10250, 10500, 10750, 11000, 11250, 11500, 11750, 12000, 12250, 12500, 12750, 13000, 13250, 13500, 13750, 14000, 14250, 14500, 14750, 15000, 15250, 15500, 15750, 16000, 16250, 16500, 16750, 17000, 17250, 17500, 17750, 18000, 18250, 18500, 18750, 19000, 19250, 19500, 19750, 20000, 20250, 20500, 20750, 21000, 21250, 21500, 21750, 22000, 22250, 22500, 22750, 23000, 23250, 23500, 23750, 24000, 24250, 24500, 24750, 25000, 25250, 25500, 25750, 26000, 26250, 26500, 26750, 27000, 27250, 27500, 27750, 28000, 28250, 28500, 28750, 29000, 29250, 29500, 29750, 30000, 30250, 30500, 30750, 31000, 31250, 31500, 31750, 32000, 32250, 32500, 32750, 33000, 33250, 33500, 33750, 34000, 34250, 34500, 34750, 35000, 35250, 35500, 35750, 36000, 36250, 36500, 36750, 37000, 37250, 37500, 37750, 38240, 38740, 39240, 39740, 40240, 40740, 41240, 41740, 42240, 42740, 43240, 43740, 44240, 44740, 45240, 45740, 46240, 46740, 47240, 47740, 48240, 48740, 49240, 49740, 50240, 50740, 51240, 51740, 52240, 52740, 53240, 53740, 54240, 54740, 55240, 55740, 56240, 56740, 57240, 57740, 58240, 58740, 59240, 59740, 60240, 60740, 61240, 61740, 62240, 62740, 63240, 63640, 64240, 64740, 65240, 65740, 66240, 66740, 67240, 67740, 68240, 68740, 69240, 69740, 70240, 70740, 71240, 71740, 72240, 72740, 73240, 73740, 74240, 74640, 75240, 75740, 76240, 76740, 77240, 77740, 78240, 78740, 79240, 79740, 80240, 80740, 81240, 81740, 82240, 82740, 83240, 83740, 84240, 84540',
        simplemoms: '21, 43, 64, 85, 107, 128, 149, 170, 191, 213, 234, 255, 276, 297, 318, 339, 359, 380, 401, 421, 441, 461, 481, 501, 521, 541, 561, 581, 600, 620, 640, 660, 679, 699, 719, 739, 758, 778, 797, 817, 837, 857, 876, 896, 916, 935, 955, 975, 994, 1014, 1033, 1053, 1073, 1093, 1112, 1132, 1152, 1171, 1191, 1210, 1230, 1250, 1270, 1289, 1309, 1329, 1348, 1368, 1387, 1407, 1427, 1446, 1466, 1486, 1506, 1525, 1545, 1564, 1584, 1604, 1623, 1643, 1663, 1682, 1702, 1721, 1741, 1760, 1780, 1799, 1819, 1839, 1858, 1878, 1897, 1917, 1936, 1956, 1976, 1995, 2014, 2034, 2053, 2072, 2091, 2111, 2130, 2149, 2168, 2187, 2206, 2225, 2244, 2262, 2285, 2308, 2330, 2353, 2376, 2399, 2422, 2444, 2466, 2489, 2511, 2534, 2557, 2579, 2602, 2625, 2647, 2669, 2692, 2714, 2736, 2758, 2781, 2803, 2826, 2848, 2870, 2893, 2915, 2937, 2959, 2982, 3004, 3026, 3049, 3071, 3094, 3137, 3182, 3227, 3271, 3316, 3361, 3405, 3450, 3494, 3539, 3583, 3628, 3672, 3717, 3761, 3805, 3850, 3894, 3939, 3983, 4027, 4072, 4116, 4159, 4203, 4246, 4289, 4332, 4375, 4419, 4462, 4505, 4548, 4589, 4631, 4672, 4713, 4755, 4796, 4837, 4879, 4920, 4961, 5003, 5044, 5085, 5127, 5168, 5209, 5250, 5290, 5330, 5370, 5411, 5451, 5491, 5531, 5571, 5611, 5648, 5684, 5720, 5756, 5792, 5828, 5864, 5900, 5935, 5971, 6007, 6043, 6079, 6115, 6151, 6187, 6222, 6258, 6294, 6329, 6365, 6401, 6437, 6473, 6509, 6545, 6581, 6616, 6652, 6687, 6723, 6758, 6794, 6829, 6850'
      },
      {
        name: 'Tank 4',
        weights: '250, 500, 750, 1000, 1250, 1500, 1750, 2000, 2250, 2500, 2750, 3000, 3250, 3500, 3750, 4000, 4250, 4500, 4750, 5000, 5250, 5500, 5750, 6000, 6250, 6500, 6750, 7000, 7250, 7500, 7750, 8000, 8250, 8500, 8750, 9000, 9250, 9500, 9750, 10000, 10250, 10500, 10750, 11000, 11250, 11500, 11750, 12000, 12250, 12500, 12750, 13000, 13250, 13500, 13750, 14000, 14250, 14500, 14750, 15000, 15250, 15500, 15750, 16000, 16250, 16500, 16750, 17000, 17250, 17500, 17750, 18000, 18250, 18500, 18750, 19000, 19250, 19500, 19750, 20000, 20250, 20500, 20750, 21000, 21250, 21500, 21750, 22000, 22250, 22500, 22750, 23000, 23250, 23500, 23750, 24000, 24250, 24500, 24750, 25000, 25250, 25500, 25750, 26000, 26250, 26500, 26750, 27000, 27250, 27500, 27750, 28000, 28250, 28500, 28750, 29000, 29250, 29500, 29750, 30000, 30250, 30500, 30750, 31000, 31250, 31500, 31750, 32000, 32250, 32500, 32750, 33000, 33250, 33500, 33750, 34000, 34250, 34500, 34750, 35000, 35250, 35500, 35750, 36000, 36250, 36500, 36750, 37000, 37250, 37500, 37750, 37760',
        simplemoms: '28, 56, 84, 112, 140, 168, 196, 222, 248, 274, 300, 326, 353, 379, 405, 430, 456, 482, 508, 534, 559, 585, 610, 636, 661, 687, 712, 738, 763, 789, 814, 839, 864, 889, 915, 940, 965, 990, 1016, 1041, 1066, 1091, 1116, 1141, 1166, 1190, 1215, 1240, 1265, 1290, 1315, 1340, 1365, 1390, 1414, 1439, 1464, 1489, 1514, 1538, 1563, 1588, 1612, 1637, 1662, 1686, 1711, 1736, 1760, 1785, 1810, 1834, 1859, 1883, 1908, 1932, 1957, 1982, 2006, 2031, 2055, 2080, 2104, 2129, 2153, 2178, 2202, 2227, 2251, 2276, 2300, 2325, 2349, 2373, 2398, 2422, 2447, 2471, 2495, 2520, 2544, 2569, 2593, 2617, 2641, 2665, 2689, 2713, 2737, 2761, 2785, 2809, 2833, 2857, 2881, 2905, 2929, 2953, 2977, 3001, 3024, 3048, 3072, 3096, 3119, 3143, 3167, 3191, 3214, 3238, 3262, 3285, 3309, 3332, 3356, 3379, 3403, 3427, 3450, 3474, 3497, 3520, 3543, 3566, 3590, 3613, 3636, 3659, 3682, 3705, 3729, 3730',
      }]
    },
    }
  })


  //create cargo
  const air1c1 = await prisma.cargo.create({
    data:{
      name: 'Water Container (5 Gallon)',
      fs: 358,
      weight: 40,
      aircraft: {connect:{id:1}}
    }
  })

  const air1c2 = await prisma.cargo.create({
    data:{
      name: 'Std 2 gal liquid container',
      weight: 25,
      fs: 260,
      aircraft: {connect:{id:1}}
    }
  })

  const air1c3 = await prisma.cargo.create({
    data:{
      name: 'Hot Cup',
      fs: 260,
      weight: 3,
      aircraft: {connect:{id:1}}
    }
  })

  const air1c4 = await prisma.cargo.create({
    data:{
      name: 'Human Waste Clean-up kit',
      fs: 280,
      weight: 5,
      aircraft: {connect:{id:1}}
    }
  })

  const air1c5 = await prisma.cargo.create({
    data:{
      name: 'Blanket Large',
      fs: 280,
      weight: 3.5,
      aircraft: {connect:{id:1}}
    }
  })

  const air1c6 = await prisma.cargo.create({
    data:{
      name: 'Pillow Large w/Case',
      fs: 280,
      weight: 2,
      aircraft: {connect:{id:1}}
    }
  })

  const air1c7 = await prisma.cargo.create({
    data:{
      name: 'Blanket Small',
      fs: -1,
      weight: 1,
      aircraft: {connect:{id:1}}
    }
  })

  const air1c8 = await prisma.cargo.create({
    data:{
      name: 'Pillow Small w/Case',
        fs: -1,
        weight: 0.5,
      aircraft: {connect:{id:1}}
    }
  })

  const air1c9 = await prisma.cargo.create({
    data:{
      name: 'Expendable Supplies',
      fs: 260,
      weight: 10,
      aircraft: {connect:{id:1}}
    }
  })

  const air1c10 = await prisma.cargo.create({
    data:{
      name: 'Passenger Demo Kit',
      fs: 380,
      weight: 3,
      aircraft: {connect:{id:1}}
    }
  })

  const air1c11 = await prisma.cargo.create({
    data:{
      name: 'Pax info cards (102)',
      fs: 280,
      weight: 3,
      aircraft: {connect:{id:1}}
    }
  })

  const air1c12 = await prisma.cargo.create({
    data:{
      name: 'ATGL (Serviced)',
      fs: 401,
      weight: 3620,
      aircraft: {connect:{id:1}}
    }
  })

  const air1c13 = await prisma.cargo.create({
    data:{
      name: 'LPU-6P Infant Cot',
      fs: 280,
      weight: 4,
      aircraft: {connect:{id:1}}
    }
  })

  const air1c14 = await prisma.cargo.create({
    data:{
      name: 'A/C Life Preserver',
      fs: -1,
      weight: 1.5,
      aircraft: {connect:{id:1}}
    }
  })

  const air1c15 = await prisma.cargo.create({
    data:{
      name: 'Protective clothing kit',
      fs: 280,
      weight: 36,
      aircraft: {connect:{id:1}}
    }
  })

  const air1c16 = await prisma.cargo.create({
    data:{
      name: 'BA-22 Parachute',
      fs: 280,
      weight: 28,
      aircraft: {connect:{id:1}}
    }
  })

  const air1c17 = await prisma.cargo.create({
    data:{
      name: 'LPU-10P',
      fs: 280,
      weight: 4,
      aircraft: {connect:{id:1}}
    }
  })

  const air1c18 = await prisma.cargo.create({
    data:{
      name: 'EPOS',
      fs: -1,
      weight: 2,
      aircraft: {connect:{id:1}}
    }
  })

  const air1c19 = await prisma.cargo.create({
    data:{
      name: 'PBE',
      fs: 280,
      weight: 5,
      aircraft: {connect:{id:1}}
    }
  })

  const air1c20 = await prisma.cargo.create({
    data:{
      name: 'Survival Vest',
      fs: 280,
      weight: 11.5,
      aircraft: {connect:{id:1}}
    }
  })

  const air1c21 = await prisma.cargo.create({
    data:{
      name: 'Aircrew Body Armor (Level IIIA)',
      fs: 280,
      weight: 8.5,
      aircraft: {connect:{id:1}}
    }
  })

  const air1c22 = await prisma.cargo.create({
    data:{
      name: '60 Hz Backup Converter',
      fs: 252,
      weight: 43,
      aircraft: {connect:{id:1}}
    }
  })

  const air1c23 = await prisma.cargo.create({
    data:{
      name: 'Additional Aeromedical Stations',
      fs: -1,
      weight: 66,
      aircraft: {connect:{id:1}}
    }
  })

  const air1c24 = await prisma.cargo.create({
    data:{
      name: 'Seat Pallets DV (5 Seats/Pallet)',
      fs: -1,
      weight: 591,
      aircraft: {connect:{id:1}}
    }
  })

  const air1c25 = await prisma.cargo.create({
    data:{
      name: 'Seat Pallets DV (10 Seats/pallet)',
      fs: -1,
      weight: 767,
      aircraft: {connect:{id:1}}
    }
  })

  const air1c26 = await prisma.cargo.create({
    data:{
      name: 'Seat Pallets Mass (15 Seats/pallet)',
      fs: -1,
      weight: 943,
      aircraft: {connect:{id:1}}
    }
  })

  const air1c27 = await prisma.cargo.create({
    data:{
      name: 'Flares/Flare Cans (Note 1)',
      fs: 744,
      weight: 255,
      aircraft: {connect:{id:1}}
    }
  })

  const air1c28 = await prisma.cargo.create({
    data:{
      name: 'Flare Hazard Placards (Note 1)',
      fs: 400,
      weight: 20,
      aircraft: {connect:{id:1}}
    }
  })

  const air1c29 = await prisma.cargo.create({
    data:{
      name: 'Aircraft Armor (Note 1)',
      fs: 217,
      weight: 1125,
      aircraft: {connect:{id:1}}
    }
  })

  const air1c30 = await prisma.cargo.create({
    data:{
      name: 'SLIP (unoccupied)',
      fs: -1,
      weight: 1350,
      aircraft: {connect:{id:1}}
    }
  })

  const air1c31 = await prisma.cargo.create({
    data:{
      name: 'SLICC Berthing Capsule',
      fs: 580,
      weight: 3790,
      aircraft: {connect:{id:1}}
    }
  })

  const air1c32 = await prisma.cargo.create({
    data:{
      name: 'SLICC Conference Capsule',
      fs: 685,
      weight: 4660,
      aircraft: {connect:{id:1}}
    }
  })

  const air1c33 = await prisma.cargo.create({
    data:{
      name: 'MX TO File',
      fs: 305,
      weight: 30,
      aircraft: {connect:{id:1}}
    }
  })

  const air1c34 = await prisma.cargo.create({
    data:{
      name: 'Kit, Passenger service',
      fs: 280,
      weight: 10,
      aircraft: {connect:{id:1}}
    }
  })


  //create configs

  const air1config1 = await prisma.config.create({
    data:{
      aircraft: {connect: {id:1}},
      name: 'AE-1',
      configcargos: {create:[

        // stewards equipment tot weight 277, tot mom 12.4
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:1}}, //water container
          fs: 358,
          qty: 3,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:2}}, //std 2 gal liquid
          fs: 260,
          qty: 1,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:3}}, // hot cup
          fs: 260,
          qty: 1,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:4}}, // hw clean up kit
          fs: 280,
          qty: 1,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:5}}, // blanket large
          fs: 280,
          qty: 6,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:6}}, //pilllow lrg with case
          fs: 280,
          qty: 6,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:7}}, // blanket small
          fs: 744,
          qty: 54,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:8}}, // pillow small w case
          fs: 744,
          qty: 54,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:9}}, // expendables
          fs: 260,
          qty: 1,
        },
        
        //emergency equip tot weight 612, tot mom 35.6
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:17}}, // lpu 10p
          fs: 280,
          qty: 2,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:13}}, // lpu 6
          fs: 280,
          qty: 3,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:14}}, // ac life pres
          fs: 744,
          qty: 110,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:15}}, // pck
          fs: 280,
          qty: 1,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:18}}, // epos
          fs: 744,
          qty: 102,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:19}}, // pbe
          fs: 744,
          qty: 6,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:16}}, // parachute
          fs: 280,
          qty: 2,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:21}}, // bod armor
          fs: 280,
          qty: 5,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:20}}, // survial vest
          fs: 280,
          qty: 5,
        },

        //extra equip tot weight 1430, tot mom 45.1
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:33}}, // to file
          fs: 305,
          qty: 1,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:29}}, // acft armor
          fs: 217,
          qty: 1,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:27}}, // flarees/ flare cans
          fs: 744,
          qty: 6,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:28}}, // flare pacards
          fs: 400,
          qty: 4,
        },

      ]}
    }
  })


  const air1config2 = await prisma.config.create({
    data:{
      aircraft: {connect: {id:1}},
      name: 'AE-2',
      configcargos: {create:[

        // stewards equipment tot weight 3897 tot mom 157.5
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:1}}, //water container
          fs: 358,
          qty: 3,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:2}}, //std 2 gal liquid
          fs: 260,
          qty: 1,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:3}}, // hot cup
          fs: 260,
          qty: 1,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:4}}, // hw clean up kit
          fs: 280,
          qty: 1,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:5}}, // blanket large
          fs: 280,
          qty: 6,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:6}}, //pilllow lrg with case
          fs: 280,
          qty: 6,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:7}}, // blanket small
          fs: 744,
          qty: 54,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:8}}, // pillow small w case
          fs: 744,
          qty: 54,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:9}}, // expendables
          fs: 260,
          qty: 1,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:12}}, // atgl
          fs: 401,
          qty: 1,
        },
        
        //emergency equip tot weight 612, tot mom 35.6
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:17}}, // lpu 10p
          fs: 280,
          qty: 2,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:13}}, // lpu 6
          fs: 280,
          qty: 3,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:14}}, // ac life pres
          fs: 744,
          qty: 110,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:15}}, // pck
          fs: 280,
          qty: 1,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:18}}, // epos
          fs: 744,
          qty: 102,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:19}}, // pbe
          fs: 744,
          qty: 6,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:16}}, // parachute
          fs: 280,
          qty: 2,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:21}}, // bod armor
          fs: 280,
          qty: 5,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:20}}, // survial vest
          fs: 280,
          qty: 5,
        },

        //extra equip tot weight 1430, tot mom 45.1
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:33}}, // to file
          fs: 305,
          qty: 1,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:29}}, // acft armor
          fs: 217,
          qty: 1,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:27}}, // flarees/ flare cans
          fs: 744,
          qty: 6,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:28}}, // flare pacards
          fs: 400,
          qty: 4,
        },

      ]}
    }
  })


  const air1config3 = await prisma.config.create({
    data:{
      aircraft: {connect: {id:1}},
      name: 'AE-3',
      configcargos: {create:[

        // stewards equipment tot weight 282, tot mom 12.6 //pas service
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:1}}, //water container
          fs: 358,
          qty: 3,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:2}}, //std 2 gal liquid
          fs: 260,
          qty: 1,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:3}}, // hot cup
          fs: 260,
          qty: 1,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:34}}, // pass service
          fs: 280,
          qty: 1,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:5}}, // blanket large
          fs: 280,
          qty: 6,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:6}}, //pilllow lrg with case
          fs: 280,
          qty: 6,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:7}}, // blanket small
          fs: 744,
          qty: 54,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:8}}, // pillow small w case
          fs: 744,
          qty: 54,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:9}}, // expendables
          fs: 260,
          qty: 1,
        },
        
        //emergency equip tot weight 612, tot mom 35.6
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:17}}, // lpu 10p
          fs: 280,
          qty: 2,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:13}}, // lpu 6
          fs: 280,
          qty: 3,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:14}}, // ac life pres
          fs: 744,
          qty: 110,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:15}}, // pck
          fs: 280,
          qty: 1,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:18}}, // epos
          fs: 744,
          qty: 102,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:19}}, // pbe
          fs: 744,
          qty: 6,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:16}}, // parachute
          fs: 280,
          qty: 2,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:21}}, // bod armor
          fs: 280,
          qty: 5,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:20}}, // survial vest
          fs: 280,
          qty: 5,
        },

        //extra equip tot weight 1430, tot mom 45.1
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:33}}, // to file
          fs: 305,
          qty: 1,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:29}}, // acft armor
          fs: 217,
          qty: 1,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:27}}, // flarees/ flare cans
          fs: 744,
          qty: 6,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:28}}, // flare pacards
          fs: 400,
          qty: 4,
        },

      ]}
    }
  })

  const air1config4 = await prisma.config.create({
    data:{
      aircraft: {connect: {id:1}},
      name: 'AEC-1',
      configcargos: {create:[

        // stewards equipment tot weight 3897 tot mom 157.5
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:1}}, //water container
          fs: 358,
          qty: 3,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:2}}, //std 2 gal liquid
          fs: 260,
          qty: 1,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:3}}, // hot cup
          fs: 260,
          qty: 1,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:4}}, // hw clean up
          fs: 280,
          qty: 1,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:5}}, // blanket large
          fs: 280,
          qty: 6,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:6}}, //pilllow lrg with case
          fs: 280,
          qty: 6,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:7}}, // blanket small
          fs: 744,
          qty: 54,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:8}}, // pillow small w case
          fs: 744,
          qty: 54,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:9}}, // expendables
          fs: 260,
          qty: 1,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:12}}, // atgl
          fs: 401,
          qty: 1,
        },
        
        //emergency equip tot weight 612, tot mom 35.6
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:17}}, // lpu 10p
          fs: 280,
          qty: 2,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:13}}, // lpu 6
          fs: 280,
          qty: 3,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:14}}, // ac life pres
          fs: 744,
          qty: 110,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:15}}, // pck
          fs: 280,
          qty: 1,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:18}}, // epos
          fs: 744,
          qty: 102,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:19}}, // pbe
          fs: 744,
          qty: 6,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:16}}, // parachute
          fs: 280,
          qty: 2,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:21}}, // bod armor
          fs: 280,
          qty: 5,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:20}}, // survial vest
          fs: 280,
          qty: 5,
        },

        //extra equip tot weight 1430, tot mom 45.1
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:33}}, // to file
          fs: 305,
          qty: 1,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:29}}, // acft armor
          fs: 217,
          qty: 1,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:27}}, // flarees/ flare cans
          fs: 744,
          qty: 6,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:28}}, // flare pacards
          fs: 400,
          qty: 4,
        },

      ]}
    }
  })

  const air1config5 = await prisma.config.create({
    data:{
      aircraft: {connect: {id:1}},
      name: 'C-1',
      configcargos: {create:[

        // stewards equipment tot weight 277, tot mom 12.4
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:1}}, //water container
          fs: 358,
          qty: 3,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:2}}, //std 2 gal liquid
          fs: 260,
          qty: 1,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:3}}, // hot cup
          fs: 260,
          qty: 1,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:4}}, // hw clean up kit
          fs: 280,
          qty: 1,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:5}}, // blanket large
          fs: 280,
          qty: 6,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:6}}, //pilllow lrg with case
          fs: 280,
          qty: 6,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:7}}, // blanket small
          fs: 744,
          qty: 54,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:8}}, // pillow small w case
          fs: 744,
          qty: 54,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:9}}, // expendables
          fs: 260,
          qty: 1,
        },
        
        //emergency equip tot weight 612, tot mom 35.6
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:17}}, // lpu 10p
          fs: 280,
          qty: 2,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:13}}, // lpu 6
          fs: 280,
          qty: 3,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:14}}, // ac life pres
          fs: 744,
          qty: 110,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:15}}, // pck
          fs: 280,
          qty: 1,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:18}}, // epos
          fs: 744,
          qty: 102,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:19}}, // pbe
          fs: 744,
          qty: 6,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:16}}, // parachute
          fs: 280,
          qty: 2,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:21}}, // bod armor
          fs: 280,
          qty: 5,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:20}}, // survial vest
          fs: 280,
          qty: 5,
        },

        //extra equip tot weight 1430, tot mom 45.1
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:33}}, // to file
          fs: 305,
          qty: 1,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:29}}, // acft armor
          fs: 217,
          qty: 1,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:27}}, // flarees/ flare cans
          fs: 744,
          qty: 6,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:28}}, // flare pacards
          fs: 400,
          qty: 4,
        },

      ]}
    }
  })

  const air1config6 = await prisma.config.create({
    data:{
      aircraft: {connect: {id:1}},
      name: 'C-2',
      configcargos: {create:[

        // stewards equipment tot weight 277, tot mom 12.4
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:1}}, //water container
          fs: 358,
          qty: 3,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:2}}, //std 2 gal liquid
          fs: 260,
          qty: 1,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:3}}, // hot cup
          fs: 260,
          qty: 1,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:4}}, // hw clean up kit
          fs: 280,
          qty: 1,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:5}}, // blanket large
          fs: 280,
          qty: 6,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:6}}, //pilllow lrg with case
          fs: 280,
          qty: 6,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:7}}, // blanket small
          fs: 744,
          qty: 54,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:8}}, // pillow small w case
          fs: 744,
          qty: 54,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:9}}, // expendables
          fs: 260,
          qty: 1,
        },
        
        //emergency equip tot weight 612, tot mom 35.6
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:17}}, // lpu 10p
          fs: 280,
          qty: 2,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:13}}, // lpu 6
          fs: 280,
          qty: 3,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:14}}, // ac life pres
          fs: 744,
          qty: 110,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:15}}, // pck
          fs: 280,
          qty: 1,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:18}}, // epos
          fs: 744,
          qty: 102,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:19}}, // pbe
          fs: 744,
          qty: 6,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:16}}, // parachute
          fs: 280,
          qty: 2,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:21}}, // bod armor
          fs: 280,
          qty: 5,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:20}}, // survial vest
          fs: 280,
          qty: 5,
        },

        //extra equip tot weight 1430, tot mom 45.1
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:33}}, // to file
          fs: 305,
          qty: 1,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:29}}, // acft armor
          fs: 217,
          qty: 1,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:27}}, // flarees/ flare cans
          fs: 744,
          qty: 6,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:28}}, // flare pacards
          fs: 400,
          qty: 4,
        },

      ]}
    }
  })


  const air1config7 = await prisma.config.create({
    data:{
      aircraft: {connect: {id:1}},
      name: 'C-3',
      configcargos: {create:[

        // stewards equipment tot weight 277, tot mom 12.4
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:1}}, //water container
          fs: 358,
          qty: 3,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:2}}, //std 2 gal liquid
          fs: 260,
          qty: 1,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:3}}, // hot cup
          fs: 260,
          qty: 1,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:4}}, // hw clean up kit
          fs: 280,
          qty: 1,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:5}}, // blanket large
          fs: 280,
          qty: 6,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:6}}, //pilllow lrg with case
          fs: 280,
          qty: 6,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:7}}, // blanket small
          fs: 744,
          qty: 54,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:8}}, // pillow small w case
          fs: 744,
          qty: 54,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:9}}, // expendables
          fs: 260,
          qty: 1,
        },
        
        //emergency equip tot weight 612, tot mom 35.6
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:17}}, // lpu 10p
          fs: 280,
          qty: 2,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:13}}, // lpu 6
          fs: 280,
          qty: 3,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:14}}, // ac life pres
          fs: 744,
          qty: 110,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:15}}, // pck
          fs: 280,
          qty: 1,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:18}}, // epos
          fs: 744,
          qty: 102,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:19}}, // pbe
          fs: 744,
          qty: 6,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:16}}, // parachute
          fs: 280,
          qty: 2,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:21}}, // bod armor
          fs: 280,
          qty: 5,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:20}}, // survial vest
          fs: 280,
          qty: 5,
        },

        //extra equip tot weight 1430, tot mom 45.1
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:33}}, // to file
          fs: 305,
          qty: 1,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:29}}, // acft armor
          fs: 217,
          qty: 1,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:27}}, // flarees/ flare cans
          fs: 744,
          qty: 6,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:28}}, // flare pacards
          fs: 400,
          qty: 4,
        },

      ]}
    }
  })


  const air1config8 = await prisma.config.create({
    data:{
      aircraft: {connect: {id:1}},
      name: 'P-1',
      configcargos: {create:[

        // stewards equipment tot weight 3897, tot mom 157.5
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:1}}, //water container
          fs: 358,
          qty: 3,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:2}}, //std 2 gal liquid
          fs: 260,
          qty: 1,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:3}}, // hot cup
          fs: 260,
          qty: 1,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:4}}, // hw clean up kit
          fs: 280,
          qty: 1,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:5}}, // blanket large
          fs: 280,
          qty: 6,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:6}}, //pilllow lrg with case
          fs: 280,
          qty: 6,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:7}}, // blanket small
          fs: 744,
          qty: 54,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:8}}, // pillow small w case
          fs: 744,
          qty: 54,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:9}}, // expendables
          fs: 260,
          qty: 1,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:12}}, // atgl
          fs: 401,
          qty: 1,
        },
        
        //emergency equip tot weight 612, tot mom 35.6
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:17}}, // lpu 10p
          fs: 280,
          qty: 2,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:13}}, // lpu 6
          fs: 280,
          qty: 3,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:14}}, // ac life pres
          fs: 744,
          qty: 110,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:15}}, // pck
          fs: 280,
          qty: 1,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:18}}, // epos
          fs: 744,
          qty: 102,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:19}}, // pbe
          fs: 744,
          qty: 6,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:16}}, // parachute
          fs: 280,
          qty: 2,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:21}}, // bod armor
          fs: 280,
          qty: 5,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:20}}, // survial vest
          fs: 280,
          qty: 5,
        },

        //extra equip tot weight 1430, tot mom 45.1
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:33}}, // to file
          fs: 305,
          qty: 1,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:29}}, // acft armor
          fs: 217,
          qty: 1,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:27}}, // flarees/ flare cans
          fs: 744,
          qty: 6,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:28}}, // flare pacards
          fs: 400,
          qty: 4,
        },

      ]}
    }
  })

  const air1config9 = await prisma.config.create({
    data:{
      aircraft: {connect: {id:1}},
      name: 'SP-X',
      configcargos: {create:[

        // stewards equipment tot weight 277, tot mom 12.4
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:1}}, //water container
          fs: 358,
          qty: 3,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:2}}, //std 2 gal liquid
          fs: 260,
          qty: 1,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:3}}, // hot cup
          fs: 260,
          qty: 1,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:4}}, // hw clean up kit
          fs: 280,
          qty: 1,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:5}}, // blanket large
          fs: 280,
          qty: 6,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:6}}, //pilllow lrg with case
          fs: 280,
          qty: 6,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:7}}, // blanket small
          fs: 744,
          qty: 54,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:8}}, // pillow small w case
          fs: 744,
          qty: 54,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:9}}, // expendables
          fs: 260,
          qty: 1,
        },
        
        //emergency equip tot weight 612, tot mom 35.6
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:17}}, // lpu 10p
          fs: 280,
          qty: 2,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:13}}, // lpu 6
          fs: 280,
          qty: 3,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:14}}, // ac life pres
          fs: 744,
          qty: 110,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:15}}, // pck
          fs: 280,
          qty: 1,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:18}}, // epos
          fs: 744,
          qty: 102,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:19}}, // pbe
          fs: 744,
          qty: 6,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:16}}, // parachute
          fs: 280,
          qty: 2,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:21}}, // bod armor
          fs: 280,
          qty: 5,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:20}}, // survial vest
          fs: 280,
          qty: 5,
        },

        //extra equip tot weight 1430, tot mom 45.1
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:33}}, // to file
          fs: 305,
          qty: 1,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:29}}, // acft armor
          fs: 217,
          qty: 1,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:27}}, // flarees/ flare cans
          fs: 744,
          qty: 6,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:28}}, // flare pacards
          fs: 400,
          qty: 4,
        },

      ]}
    }
  })

  const air1config10 = await prisma.config.create({
    data:{
      aircraft: {connect: {id:1}},
      name: 'CP-X',
      configcargos: {create:[

        // stewards equipment tot weight 277, tot mom 12.4
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:1}}, //water container
          fs: 358,
          qty: 3,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:2}}, //std 2 gal liquid
          fs: 260,
          qty: 1,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:3}}, // hot cup
          fs: 260,
          qty: 1,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:4}}, // hw clean up kit
          fs: 280,
          qty: 1,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:5}}, // blanket large
          fs: 280,
          qty: 6,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:6}}, //pilllow lrg with case
          fs: 280,
          qty: 6,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:7}}, // blanket small
          fs: 744,
          qty: 54,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:8}}, // pillow small w case
          fs: 744,
          qty: 54,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:9}}, // expendables
          fs: 260,
          qty: 1,
        },
        
        //emergency equip tot weight 612, tot mom 35.6
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:17}}, // lpu 10p
          fs: 280,
          qty: 2,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:13}}, // lpu 6
          fs: 280,
          qty: 3,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:14}}, // ac life pres
          fs: 744,
          qty: 110,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:15}}, // pck
          fs: 280,
          qty: 1,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:18}}, // epos
          fs: 744,
          qty: 102,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:19}}, // pbe
          fs: 744,
          qty: 6,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:16}}, // parachute
          fs: 280,
          qty: 2,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:21}}, // bod armor
          fs: 280,
          qty: 5,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:20}}, // survial vest
          fs: 280,
          qty: 5,
        },

        //extra equip tot weight 1430, tot mom 45.1
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:33}}, // to file
          fs: 305,
          qty: 1,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:29}}, // acft armor
          fs: 217,
          qty: 1,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:27}}, // flarees/ flare cans
          fs: 744,
          qty: 6,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:28}}, // flare pacards
          fs: 400,
          qty: 4,
        },

      ]}
    }
  })

  const air1config11 = await prisma.config.create({
    data:{
      aircraft: {connect: {id:1}},
      name: 'ADP-1',
      configcargos: {create:[

        // stewards equipment tot weight 277, tot mom 12.4
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:1}}, //water container
          fs: 358,
          qty: 3,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:2}}, //std 2 gal liquid
          fs: 260,
          qty: 1,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:3}}, // hot cup
          fs: 260,
          qty: 1,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:4}}, // hw clean up kit
          fs: 280,
          qty: 1,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:5}}, // blanket large
          fs: 280,
          qty: 6,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:6}}, //pilllow lrg with case
          fs: 280,
          qty: 6,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:7}}, // blanket small
          fs: 744,
          qty: 54,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:8}}, // pillow small w case
          fs: 744,
          qty: 54,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:9}}, // expendables
          fs: 260,
          qty: 1,
        },
        
        //emergency equip tot weight 612, tot mom 35.6
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:17}}, // lpu 10p
          fs: 280,
          qty: 2,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:13}}, // lpu 6
          fs: 280,
          qty: 3,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:14}}, // ac life pres
          fs: 744,
          qty: 110,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:15}}, // pck
          fs: 280,
          qty: 1,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:18}}, // epos
          fs: 744,
          qty: 102,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:19}}, // pbe
          fs: 744,
          qty: 6,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:16}}, // parachute
          fs: 280,
          qty: 2,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:21}}, // bod armor
          fs: 280,
          qty: 5,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:20}}, // survial vest
          fs: 280,
          qty: 5,
        },

        //extra equip tot weight 1430, tot mom 45.1
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:33}}, // to file
          fs: 305,
          qty: 1,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:29}}, // acft armor
          fs: 217,
          qty: 1,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:27}}, // flarees/ flare cans
          fs: 744,
          qty: 6,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:28}}, // flare pacards
          fs: 400,
          qty: 4,
        },

      ]}
    }
  })

  const air1config12 = await prisma.config.create({
    data:{
      aircraft: {connect: {id:1}},
      name: 'ADP-2',
      configcargos: {create:[

        // stewards equipment tot weight 277, tot mom 12.4
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:1}}, //water container
          fs: 358,
          qty: 3,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:2}}, //std 2 gal liquid
          fs: 260,
          qty: 1,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:3}}, // hot cup
          fs: 260,
          qty: 1,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:4}}, // hw clean up kit
          fs: 280,
          qty: 1,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:5}}, // blanket large
          fs: 280,
          qty: 6,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:6}}, //pilllow lrg with case
          fs: 280,
          qty: 6,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:7}}, // blanket small
          fs: 744,
          qty: 54,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:8}}, // pillow small w case
          fs: 744,
          qty: 54,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:9}}, // expendables
          fs: 260,
          qty: 1,
        },
        
        //emergency equip tot weight 612, tot mom 35.6
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:17}}, // lpu 10p
          fs: 280,
          qty: 2,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:13}}, // lpu 6
          fs: 280,
          qty: 3,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:14}}, // ac life pres
          fs: 744,
          qty: 110,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:15}}, // pck
          fs: 280,
          qty: 1,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:18}}, // epos
          fs: 744,
          qty: 102,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:19}}, // pbe
          fs: 744,
          qty: 6,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:16}}, // parachute
          fs: 280,
          qty: 2,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:21}}, // bod armor
          fs: 280,
          qty: 5,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:20}}, // survial vest
          fs: 280,
          qty: 5,
        },

        //extra equip tot weight 1430, tot mom 45.1
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:33}}, // to file
          fs: 305,
          qty: 1,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:29}}, // acft armor
          fs: 217,
          qty: 1,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:27}}, // flarees/ flare cans
          fs: 744,
          qty: 6,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:28}}, // flare pacards
          fs: 400,
          qty: 4,
        },

      ]}
    }
  })

  const air1config13 = await prisma.config.create({
    data:{
      aircraft: {connect: {id:1}},
      name: 'ADP-3',
      configcargos: {create:[

        // stewards equipment tot weight 3897, tot mom 157.5
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:1}}, //water container
          fs: 358,
          qty: 3,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:2}}, //std 2 gal liquid
          fs: 260,
          qty: 1,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:3}}, // hot cup
          fs: 260,
          qty: 1,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:4}}, // hw clean up kit
          fs: 280,
          qty: 1,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:5}}, // blanket large
          fs: 280,
          qty: 6,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:6}}, //pilllow lrg with case
          fs: 280,
          qty: 6,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:7}}, // blanket small
          fs: 744,
          qty: 54,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:8}}, // pillow small w case
          fs: 744,
          qty: 54,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:9}}, // expendables
          fs: 260,
          qty: 1,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:12}}, // atgl
          fs: 401,
          qty: 1,
        },
        
        //emergency equip tot weight 612, tot mom 35.6
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:17}}, // lpu 10p
          fs: 280,
          qty: 2,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:13}}, // lpu 6
          fs: 280,
          qty: 3,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:14}}, // ac life pres
          fs: 744,
          qty: 110,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:15}}, // pck
          fs: 280,
          qty: 1,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:18}}, // epos
          fs: 744,
          qty: 102,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:19}}, // pbe
          fs: 744,
          qty: 6,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:16}}, // parachute
          fs: 280,
          qty: 2,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:21}}, // bod armor
          fs: 280,
          qty: 5,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:20}}, // survial vest
          fs: 280,
          qty: 5,
        },

        //extra equip tot weight 1430, tot mom 45.1
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:33}}, // to file
          fs: 305,
          qty: 1,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:29}}, // acft armor
          fs: 217,
          qty: 1,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:27}}, // flarees/ flare cans
          fs: 744,
          qty: 6,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:28}}, // flare pacards
          fs: 400,
          qty: 4,
        },

      ]}
    }
  })

  const air1config14 = await prisma.config.create({
    data:{
      aircraft: {connect: {id:1}},
      name: 'ADC-1',
      configcargos: {create:[

        // stewards equipment tot weight 277, tot mom 12.4
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:1}}, //water container
          fs: 358,
          qty: 3,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:2}}, //std 2 gal liquid
          fs: 260,
          qty: 1,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:3}}, // hot cup
          fs: 260,
          qty: 1,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:4}}, // hw clean up kit
          fs: 280,
          qty: 1,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:5}}, // blanket large
          fs: 280,
          qty: 6,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:6}}, //pilllow lrg with case
          fs: 280,
          qty: 6,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:7}}, // blanket small
          fs: 744,
          qty: 54,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:8}}, // pillow small w case
          fs: 744,
          qty: 54,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:9}}, // expendables
          fs: 260,
          qty: 1,
        },
        
        //emergency equip tot weight 612, tot mom 35.6
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:17}}, // lpu 10p
          fs: 280,
          qty: 2,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:13}}, // lpu 6
          fs: 280,
          qty: 3,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:14}}, // ac life pres
          fs: 744,
          qty: 110,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:15}}, // pck
          fs: 280,
          qty: 1,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:18}}, // epos
          fs: 744,
          qty: 102,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:19}}, // pbe
          fs: 744,
          qty: 6,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:16}}, // parachute
          fs: 280,
          qty: 2,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:21}}, // bod armor
          fs: 280,
          qty: 5,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:20}}, // survial vest
          fs: 280,
          qty: 5,
        },

        //extra equip tot weight 1430, tot mom 45.1
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:33}}, // to file
          fs: 305,
          qty: 1,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:29}}, // acft armor
          fs: 217,
          qty: 1,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:27}}, // flarees/ flare cans
          fs: 744,
          qty: 6,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:28}}, // flare pacards
          fs: 400,
          qty: 4,
        },

      ]}
    }
  })

  const air1config15 = await prisma.config.create({
    data:{
      aircraft: {connect: {id:1}},
      name: 'ADC-2',
      configcargos: {create:[

        // stewards equipment tot weight 277, tot mom 12.4
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:1}}, //water container
          fs: 358,
          qty: 3,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:2}}, //std 2 gal liquid
          fs: 260,
          qty: 1,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:3}}, // hot cup
          fs: 260,
          qty: 1,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:4}}, // hw clean up kit
          fs: 280,
          qty: 1,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:5}}, // blanket large
          fs: 280,
          qty: 6,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:6}}, //pilllow lrg with case
          fs: 280,
          qty: 6,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:7}}, // blanket small
          fs: 744,
          qty: 54,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:8}}, // pillow small w case
          fs: 744,
          qty: 54,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:9}}, // expendables
          fs: 260,
          qty: 1,
        },
        
        //emergency equip tot weight 612, tot mom 35.6
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:17}}, // lpu 10p
          fs: 280,
          qty: 2,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:13}}, // lpu 6
          fs: 280,
          qty: 3,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:14}}, // ac life pres
          fs: 744,
          qty: 110,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:15}}, // pck
          fs: 280,
          qty: 1,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:18}}, // epos
          fs: 744,
          qty: 102,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:19}}, // pbe
          fs: 744,
          qty: 6,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:16}}, // parachute
          fs: 280,
          qty: 2,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:21}}, // bod armor
          fs: 280,
          qty: 5,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:20}}, // survial vest
          fs: 280,
          qty: 5,
        },

        //extra equip tot weight 1430, tot mom 45.1
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:33}}, // to file
          fs: 305,
          qty: 1,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:29}}, // acft armor
          fs: 217,
          qty: 1,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:27}}, // flarees/ flare cans
          fs: 744,
          qty: 6,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:28}}, // flare pacards
          fs: 400,
          qty: 4,
        },

      ]}
    }
  })

  const air1config16 = await prisma.config.create({
    data:{
      aircraft: {connect: {id:1}},
      name: 'CDS-1',
      configcargos: {create:[

        // stewards equipment tot weight 277, tot mom 12.4
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:1}}, //water container
          fs: 358,
          qty: 3,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:2}}, //std 2 gal liquid
          fs: 260,
          qty: 1,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:3}}, // hot cup
          fs: 260,
          qty: 1,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:4}}, // hw clean up kit
          fs: 280,
          qty: 1,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:5}}, // blanket large
          fs: 280,
          qty: 6,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:6}}, //pilllow lrg with case
          fs: 280,
          qty: 6,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:7}}, // blanket small
          fs: 744,
          qty: 54,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:8}}, // pillow small w case
          fs: 744,
          qty: 54,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:9}}, // expendables
          fs: 260,
          qty: 1,
        },
        
        //emergency equip tot weight 612, tot mom 35.6
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:17}}, // lpu 10p
          fs: 280,
          qty: 2,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:13}}, // lpu 6
          fs: 280,
          qty: 3,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:14}}, // ac life pres
          fs: 744,
          qty: 110,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:15}}, // pck
          fs: 280,
          qty: 1,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:18}}, // epos
          fs: 744,
          qty: 102,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:19}}, // pbe
          fs: 744,
          qty: 6,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:16}}, // parachute
          fs: 280,
          qty: 2,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:21}}, // bod armor
          fs: 280,
          qty: 5,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:20}}, // survial vest
          fs: 280,
          qty: 5,
        },

        //extra equip tot weight 1430, tot mom 45.1
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:33}}, // to file
          fs: 305,
          qty: 1,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:29}}, // acft armor
          fs: 217,
          qty: 1,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:27}}, // flarees/ flare cans
          fs: 744,
          qty: 6,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:28}}, // flare pacards
          fs: 400,
          qty: 4,
        },

      ]}
    }
  })

  const air1config17 = await prisma.config.create({
    data:{
      aircraft: {connect: {id:1}},
      name: 'DV-1',
      configcargos: {create:[

        // stewards equipment tot weight 3897, tot mom 157.5
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:1}}, //water container
          fs: 358,
          qty: 3,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:2}}, //std 2 gal liquid
          fs: 260,
          qty: 1,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:3}}, // hot cup
          fs: 260,
          qty: 1,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:4}}, // hw clean up kit
          fs: 280,
          qty: 1,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:5}}, // blanket large
          fs: 280,
          qty: 6,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:6}}, //pilllow lrg with case
          fs: 280,
          qty: 6,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:7}}, // blanket small
          fs: 744,
          qty: 54,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:8}}, // pillow small w case
          fs: 744,
          qty: 54,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:9}}, // expendables
          fs: 260,
          qty: 1,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:12}}, // atgl
          fs: 401,
          qty: 1,
        },
        
        //emergency equip tot weight 612, tot mom 35.6
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:17}}, // lpu 10p
          fs: 280,
          qty: 2,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:13}}, // lpu 6
          fs: 280,
          qty: 3,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:14}}, // ac life pres
          fs: 744,
          qty: 110,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:15}}, // pck
          fs: 280,
          qty: 1,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:18}}, // epos
          fs: 744,
          qty: 102,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:19}}, // pbe
          fs: 744,
          qty: 6,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:16}}, // parachute
          fs: 280,
          qty: 2,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:21}}, // bod armor
          fs: 280,
          qty: 5,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:20}}, // survial vest
          fs: 280,
          qty: 5,
        },

        //extra equip tot weight 1430, tot mom 45.1
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:33}}, // to file
          fs: 305,
          qty: 1,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:29}}, // acft armor
          fs: 217,
          qty: 1,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:27}}, // flarees/ flare cans
          fs: 744,
          qty: 6,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:28}}, // flare pacards
          fs: 400,
          qty: 4,
        },

      ]}
    }
  })

  const air1config18 = await prisma.config.create({
    data:{
      aircraft: {connect: {id:1}},
      name: 'SD-1',
      configcargos: {create:[

        // stewards equipment tot weight 3897, tot mom 157.5
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:1}}, //water container
          fs: 358,
          qty: 3,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:2}}, //std 2 gal liquid
          fs: 260,
          qty: 1,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:3}}, // hot cup
          fs: 260,
          qty: 1,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:4}}, // hw clean up kit
          fs: 280,
          qty: 1,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:5}}, // blanket large
          fs: 280,
          qty: 6,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:6}}, //pilllow lrg with case
          fs: 280,
          qty: 6,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:7}}, // blanket small
          fs: 744,
          qty: 54,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:8}}, // pillow small w case
          fs: 744,
          qty: 54,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:9}}, // expendables
          fs: 260,
          qty: 1,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:12}}, // atgl
          fs: 401,
          qty: 1,
        },
        
        //emergency equip tot weight 612, tot mom 35.6
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:17}}, // lpu 10p
          fs: 280,
          qty: 2,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:13}}, // lpu 6
          fs: 280,
          qty: 3,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:14}}, // ac life pres
          fs: 744,
          qty: 110,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:15}}, // pck
          fs: 280,
          qty: 1,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:18}}, // epos
          fs: 744,
          qty: 102,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:19}}, // pbe
          fs: 744,
          qty: 6,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:16}}, // parachute
          fs: 280,
          qty: 2,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:21}}, // bod armor
          fs: 280,
          qty: 5,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:20}}, // survial vest
          fs: 280,
          qty: 5,
        },

        //extra equip tot weight 1430, tot mom 45.1
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:33}}, // to file
          fs: 305,
          qty: 1,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:29}}, // acft armor
          fs: 217,
          qty: 1,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:27}}, // flarees/ flare cans
          fs: 744,
          qty: 6,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:28}}, // flare pacards
          fs: 400,
          qty: 4,
        },

      ]}
    }
  })

  const air1config19 = await prisma.config.create({
    data:{
      aircraft: {connect: {id:1}},
      name: 'SLC-1',
      configcargos: {create:[

        // stewards equipment tot weight 13697, tot mom 802.6
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:1}}, //water container
          fs: 358,
          qty: 3,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:2}}, //std 2 gal liquid
          fs: 260,
          qty: 1,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:3}}, // hot cup
          fs: 260,
          qty: 1,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:4}}, // hw clean up kit
          fs: 280,
          qty: 1,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:5}}, // blanket large
          fs: 280,
          qty: 6,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:6}}, //pilllow lrg with case
          fs: 280,
          qty: 6,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:7}}, // blanket small
          fs: 744,
          qty: 54,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:8}}, // pillow small w case
          fs: 744,
          qty: 54,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:9}}, // expendables
          fs: 260,
          qty: 1,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:12}}, // atgl
          fs: 401,
          qty: 1,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:31}}, // slicc berth
          fs: 401,
          qty: 1,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:32}}, // slic confence
          fs: 401,
          qty: 1,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:30}}, // slip
          fs: 401,
          qty: 1,
        },
        
        //emergency equip tot weight 612, tot mom 35.6
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:17}}, // lpu 10p
          fs: 280,
          qty: 2,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:13}}, // lpu 6
          fs: 280,
          qty: 3,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:14}}, // ac life pres
          fs: 744,
          qty: 110,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:15}}, // pck
          fs: 280,
          qty: 1,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:18}}, // epos
          fs: 744,
          qty: 102,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:19}}, // pbe
          fs: 744,
          qty: 6,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:16}}, // parachute
          fs: 280,
          qty: 2,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:21}}, // bod armor
          fs: 280,
          qty: 5,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:20}}, // survial vest
          fs: 280,
          qty: 5,
        },

        //extra equip tot weight 1430, tot mom 45.1
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:33}}, // to file
          fs: 305,
          qty: 1,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:29}}, // acft armor
          fs: 217,
          qty: 1,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:27}}, // flarees/ flare cans
          fs: 744,
          qty: 6,
        },
        {
          aircraft: {connect: {id:1}},
          cargo: {connect: {cargoid:28}}, // flare pacards
          fs: 400,
          qty: 4,
        },

      ]}
    }
  })

  //connect cargo to aircraft
  await prisma.aircraft.update({
    data: {
      cargos: {connect:[
        {cargoid:1},
        {cargoid:2},
        {cargoid:3},
        {cargoid:4},
        {cargoid:5},
        {cargoid:6},
        {cargoid:7},
        {cargoid:8},
        {cargoid:9},
        {cargoid:10},
        {cargoid:11},
        {cargoid:12},
        {cargoid:13},
        {cargoid:14},
        {cargoid:15},
        {cargoid:16},
        {cargoid:17},
        {cargoid:18},
        {cargoid:19},
        {cargoid:20},
        {cargoid:21},
        {cargoid:22},
        {cargoid:23},
        {cargoid:24},
        {cargoid:25},
        {cargoid:26},
        {cargoid:27},
        {cargoid:28},
        {cargoid:29},
        {cargoid:30},
        {cargoid:31},
        {cargoid:32},
        {cargoid:33},
        {cargoid:34},
      ]}
    },
    where: {id:1}
  })

  //connect config to aircarft
  await prisma.aircraft.update({
    data:{
      configs:{connect: [
        {configid:1},
        {configid:2},
        {configid:3},
        {configid:4},
        {configid:5},
        {configid:6},
        {configid:7},
        {configid:8},
        {configid:9},
        {configid:10},
        {configid:11},
        {configid:12},
        {configid:13},
        {configid:14},
        {configid:15},
        {configid:16},
        {configid:17},
        {configid:18},
        {configid:19},
      ]}
    },
    where: {id:1}
  })



  //create aircraft, glossary, tanks
  const air2 = await prisma.aircraft.create({
    data:{
    name : 'C-17A',
    fs0 : 80.5,
    fs1: 2168,
    mom0: 9999,
    mom1: 50000,
    weight0: 260000,
    weight1: 300000,
    cargoweight1: 300000,
    lemac: 793.6,
    mac: 309.5,
    mommultiplyer: 10000,

    glossarys: {create: 
      [{
        title: 'MAC',
        body: 'The distance between the leading and trailing edge of the wing is known as the chord. If the leading edge and trailing edge are parallel, the chord of the wing is constant along the wing’s length. However, because the wings on the C17 are both tapered and swept, the chord changes along the span of the wing. The average length of the chord is known as the mean aerodynamic chord (MAC). The MAC of the C17 is 309.5in 1C-17A-5-2(2-28)',
      },
      {
        title: 'Chart C',
        body: 'The Chart C is a record of the aircraft weight and balance that is continuously updated by a qualified weight and balance technician. Some equipment is provided by the manufacturer during aircraft delivery to the Air Force and is included in the aircraft\'s basic weight. Further, To standardize equipment and its location, items listed in Addenda A Table 2.1 are included in the basic weight of the aircraft.',
      },
      {
        title: '%MAC',
        body: 'The Percent Mean Aerodynamic Chord identifies where the center or gravity is along the chord of the wing. 0% MAC is located at the LEMAC, and 100% MAC is at the TEMAC(Trailing Edge Mean Aerodynamic Chord). The formula for calculating %MAC is (Balance Arm - LEMAC) / MAC) X 100 1C-17A-5-2(2-28).',
      },
      {
        title: 'Reference Datum',
        body: 'The reference datum is a point located 80.5in forward of the nose of the C17. 1C-17A-5-2(2-28)',
      },
      {
        title: 'Fuselage Station (FS)',
        body: 'An imaginary plane, that runs along the length of the aircraft. It is identified by its distance from the reference datum in inches. FS 0 starts at the reference datum. 1C-17A-5-2(2-28)',
      },
      {
        title: 'Balance Arm',
        body: 'The balance arm is the horizontal distance between the reference datum and the center or gravity. Balance arm = total simplified moment X 10,000 / total weight lb.',
      },
      {
        title: 'Addenda A',
        body: 'Configurations with common items, such as sidewall seat life vests, are listed in the Addenda A chapter 3. The weight and moment of these common configurations or their items can be added as cargo into the calculator. For the most accurate calculation, if the item is not accounted for in the Chart C, not listed in Addenda A table 2.1 as equipment that is included in the aircraft basic weight, add its weight and FS into the calculator. https://static.e-publishing.af.mil/production/1/af_a3/publication/afman11-2c-17v3add-a/afman11-2c-17v3add-a.pdf',
      },
      {
        title: 'Moment',
        body: 'The moment of an item is weight in lb multiplied by its arm(distance from the reference datum). Moment is measured in inch-pounds. Moment = Weight in lb x arm. Simplified moment = moment/10000. The moment of fuel is measured in simplified moment and can be found in tables 2-5 or 2-9 for ER jets. The weight and moment of items can be found in AFI 11-2C17V3ADD-A and 1C-17A-5-2',
      },
      {
        title: 'Lemac',
        body: 'The Leading Edge of the Mean Aerodynamic Chord or LEMAC is a measurement of how far the leading edge of the wing is from the reference datum. For swept-wing aircraft, the LEMAC is an average of the distance the leading edge of the wing is from the reference datum. The LEMAC of the C17 is located 793.6in from the reference datum. 1C-17A-5-2(2-28)',
      }]
    },

    tanks:{create:
      [{
        name: 'Tank 1',
        weights: '250, 500, 750, 1000, 1250, 1500, 1750, 2000, 2250, 2500, 2750, 3000, 3250, 3500, 3750, 4000, 4250, 4500, 4750, 5000, 5250, 5500, 5750, 6000, 6250, 6500, 6750, 7000, 7250, 7500, 7750, 8000, 8250, 8500, 8750, 9000, 9250, 9500, 9750, 10000, 10250, 10500, 10750, 11000, 11250, 11500, 11750, 12000, 12250, 12500, 12750, 13000, 13250, 13500, 13750, 14000, 14250, 14500, 14750, 15000, 15250, 15500, 15750, 16000, 16250, 16500, 16750, 17000, 17250, 17500, 17750, 18000, 18250, 18500, 18750, 19000, 19250, 19500, 19750, 20000, 20250, 20500, 20750, 21000, 21250, 21500, 21750, 22000, 22250, 22500, 22750, 23000, 23250, 23500, 23750, 24000, 24250, 24500, 24750, 25000, 25250, 25500, 25750, 26000, 26250, 26500, 26750, 27000, 27250, 27500, 27750, 28000, 28250, 28500, 28750, 29000, 29250, 29500, 29750, 30000, 30250, 30500, 30750, 31000, 31250, 31500, 31750, 32000, 32250, 32500, 32750, 33000, 33250, 33500, 33750, 34000, 34250, 34500, 34750, 35000, 35250, 35500, 35750, 36000, 36250, 36500, 36750, 37000, 37250, 37500, 37750, 37760',
        simplemoms: '28, 56, 84, 112, 140, 168, 196, 222, 248, 274, 300, 326, 353, 379, 405, 430, 456, 482, 508, 534, 559, 585, 610, 636, 661, 687, 712, 738, 763, 789, 814, 839, 864, 889, 915, 940, 965, 990, 1016, 1041, 1066, 1091, 1116, 1141, 1166, 1190, 1215, 1240, 1265, 1290, 1315, 1340, 1365, 1390, 1414, 1439, 1464, 1489, 1514, 1538, 1563, 1588, 1612, 1637, 1662, 1686, 1711, 1736, 1760, 1785, 1810, 1834, 1859, 1883, 1908, 1932, 1957, 1982, 2006, 2031, 2055, 2080, 2104, 2129, 2153, 2178, 2202, 2227, 2251, 2276, 2300, 2325, 2349, 2373, 2398, 2422, 2447, 2471, 2495, 2520, 2544, 2569, 2593, 2617, 2641, 2665, 2689, 2713, 2737, 2761, 2785, 2809, 2833, 2857, 2881, 2905, 2929, 2953, 2977, 3001, 3024, 3048, 3072, 3096, 3119, 3143, 3167, 3191, 3214, 3238, 3262, 3285, 3309, 3332, 3356, 3379, 3403, 3427, 3450, 3474, 3497, 3520, 3543, 3566, 3590, 3613, 3636, 3659, 3682, 3705, 3729, 3730',
      },
      {
        name: 'Tank 2',
        weights: '250, 500, 750, 1000, 1250, 1500, 1750, 2000, 2250, 2500, 2750, 3000, 3250, 3500, 3750, 4000, 4250, 4500, 4750, 5000, 5250, 5500, 5750, 6000, 6250, 6500, 6750, 7000, 7250, 7500, 7750, 8000, 8250, 8500, 8750, 9000, 9250, 9500, 9750, 10000, 10250, 10500, 10750, 11000, 11250, 11500, 11750, 12000, 12250, 12500, 12750, 13000, 13250, 13500, 13750, 14000, 14250, 14500, 14750, 15000, 15250, 15500, 15750, 16000, 16250, 16500, 16750, 17000, 17250, 17500, 17750, 18000, 18250, 18500, 18750, 19000, 19250, 19500, 19750, 20000, 20250, 20500, 20750, 21000, 21250, 21500, 21750, 22000, 22250, 22500, 22750, 23000, 23250, 23500, 23750, 24000, 24250, 24500, 24750, 25000, 25250, 25500, 25750, 26000, 26250, 26500, 26750, 27000, 27250, 27500, 27750, 28000, 28250, 28500, 28750, 29000, 29250, 29500, 29750, 30000, 30250, 30500, 30750, 31000, 31250, 31500, 31750, 32000, 32250, 32500, 32750, 33000, 33250, 33500, 33750, 34000, 34250, 34500, 34750, 35000, 35250, 35500, 35750, 36000, 36250, 36500, 36750, 37000, 37250, 37500, 37750, 38240, 38740, 39240, 39740, 40240, 40740, 41240, 41740, 42240, 42740, 43240, 43740, 44240, 44740, 45240, 45740, 46240, 46740, 47240, 47740, 48240, 48740, 49240, 49740, 50240, 50740, 51240, 51740, 52240, 52640',
        simplemoms: '21, 43, 64, 85, 107, 128, 149, 170, 191, 213, 234, 255, 276, 297, 318, 338, 359, 379, 400, 420, 440, 460, 480, 500, 520, 540, 560, 580, 600, 619, 639, 659, 679, 698, 718, 738, 758, 777, 797, 817, 836, 856, 876, 895, 915, 935, 954, 974, 994, 1013, 1033, 1053, 1072, 1092, 1112, 1131, 1151, 1171, 1190, 1210, 1230, 1249, 1269, 1289, 1308, 1328, 1348, 1367, 1387, 1407, 1426, 1446, 1466, 1485, 1505, 1525, 1544, 1564, 1584, 1603, 1623, 1643, 1662, 1682, 1701, 1721, 1740, 1760, 1780, 1799, 1819, 1838, 1858, 1877, 1897, 1916, 1936, 1955, 1975, 1994, 2013, 2033, 2052, 2072, 2095, 2118, 2141, 2164, 2187, 2209, 2232, 2255, 2277, 2300, 2322, 2345, 2367, 2390, 2412, 2435, 2457, 2480, 2502, 2524, 2547, 2569, 2592, 2614, 2636, 2659, 2681, 2703, 2725, 2748, 2770, 2792, 2815, 2837, 2859, 2882, 2904, 2926, 2948, 2971, 2993, 3015, 3038, 3060, 3082, 3104, 3127, 3170, 3215, 3260, 3304, 3349, 3393, 3438, 3483, 3527, 3571, 3615, 3660, 3704, 3748, 3792, 3836, 3880, 3924, 3969, 4013, 4057, 4101, 4144, 4186, 4227, 4268, 4309, 4350, 4391, 4424',
      },
      {
        name: 'Tank 3',
        weights: '250, 500, 750, 1000, 1250, 1500, 1750, 2000, 2250, 2500, 2750, 3000, 3250, 3500, 3750, 4000, 4250, 4500, 4750, 5000, 5250, 5500, 5750, 6000, 6250, 6500, 6750, 7000, 7250, 7500, 7750, 8000, 8250, 8500, 8750, 9000, 9250, 9500, 9750, 10000, 10250, 10500, 10750, 11000, 11250, 11500, 11750, 12000, 12250, 12500, 12750, 13000, 13250, 13500, 13750, 14000, 14250, 14500, 14750, 15000, 15250, 15500, 15750, 16000, 16250, 16500, 16750, 17000, 17250, 17500, 17750, 18000, 18250, 18500, 18750, 19000, 19250, 19500, 19750, 20000, 20250, 20500, 20750, 21000, 21250, 21500, 21750, 22000, 22250, 22500, 22750, 23000, 23250, 23500, 23750, 24000, 24250, 24500, 24750, 25000, 25250, 25500, 25750, 26000, 26250, 26500, 26750, 27000, 27250, 27500, 27750, 28000, 28250, 28500, 28750, 29000, 29250, 29500, 29750, 30000, 30250, 30500, 30750, 31000, 31250, 31500, 31750, 32000, 32250, 32500, 32750, 33000, 33250, 33500, 33750, 34000, 34250, 34500, 34750, 35000, 35250, 35500, 35750, 36000, 36250, 36500, 36750, 37000, 37250, 37500, 37750, 38240, 38740, 39240, 39740, 40240, 40740, 41240, 41740, 42240, 42740, 43240, 43740, 44240, 44740, 45240, 45740, 46240, 46740, 47240, 47740, 48240, 48740, 49240, 49740, 50240, 50740, 51240, 51740, 52240, 52640',
        simplemoms: '21, 43, 64, 85, 107, 128, 149, 170, 191, 213, 234, 255, 276, 297, 318, 338, 359, 379, 400, 420, 440, 460, 480, 500, 520, 540, 560, 580, 600, 619, 639, 659, 679, 698, 718, 738, 758, 777, 797, 817, 836, 856, 876, 895, 915, 935, 954, 974, 994, 1013, 1033, 1053, 1072, 1092, 1112, 1131, 1151, 1171, 1190, 1210, 1230, 1249, 1269, 1289, 1308, 1328, 1348, 1367, 1387, 1407, 1426, 1446, 1466, 1485, 1505, 1525, 1544, 1564, 1584, 1603, 1623, 1643, 1662, 1682, 1701, 1721, 1740, 1760, 1780, 1799, 1819, 1838, 1858, 1877, 1897, 1916, 1936, 1955, 1975, 1994, 2013, 2033, 2052, 2072, 2095, 2118, 2141, 2164, 2187, 2209, 2232, 2255, 2277, 2300, 2322, 2345, 2367, 2390, 2412, 2435, 2457, 2480, 2502, 2524, 2547, 2569, 2592, 2614, 2636, 2659, 2681, 2703, 2725, 2748, 2770, 2792, 2815, 2837, 2859, 2882, 2904, 2926, 2948, 2971, 2993, 3015, 3038, 3060, 3082, 3104, 3127, 3170, 3215, 3260, 3304, 3349, 3393, 3438, 3483, 3527, 3571, 3615, 3660, 3704, 3748, 3792, 3836, 3880, 3924, 3969, 4013, 4057, 4101, 4144, 4186, 4227, 4268, 4309, 4350, 4391, 4424'
      },
      {
        name: 'Tank 4',
        weights: '250, 500, 750, 1000, 1250, 1500, 1750, 2000, 2250, 2500, 2750, 3000, 3250, 3500, 3750, 4000, 4250, 4500, 4750, 5000, 5250, 5500, 5750, 6000, 6250, 6500, 6750, 7000, 7250, 7500, 7750, 8000, 8250, 8500, 8750, 9000, 9250, 9500, 9750, 10000, 10250, 10500, 10750, 11000, 11250, 11500, 11750, 12000, 12250, 12500, 12750, 13000, 13250, 13500, 13750, 14000, 14250, 14500, 14750, 15000, 15250, 15500, 15750, 16000, 16250, 16500, 16750, 17000, 17250, 17500, 17750, 18000, 18250, 18500, 18750, 19000, 19250, 19500, 19750, 20000, 20250, 20500, 20750, 21000, 21250, 21500, 21750, 22000, 22250, 22500, 22750, 23000, 23250, 23500, 23750, 24000, 24250, 24500, 24750, 25000, 25250, 25500, 25750, 26000, 26250, 26500, 26750, 27000, 27250, 27500, 27750, 28000, 28250, 28500, 28750, 29000, 29250, 29500, 29750, 30000, 30250, 30500, 30750, 31000, 31250, 31500, 31750, 32000, 32250, 32500, 32750, 33000, 33250, 33500, 33750, 34000, 34250, 34500, 34750, 35000, 35250, 35500, 35750, 36000, 36250, 36500, 36750, 37000, 37250, 37500, 37750, 37760',
        simplemoms: '28, 56, 84, 112, 140, 168, 196, 222, 248, 274, 300, 326, 353, 379, 405, 430, 456, 482, 508, 534, 559, 585, 610, 636, 661, 687, 712, 738, 763, 789, 814, 839, 864, 889, 915, 940, 965, 990, 1016, 1041, 1066, 1091, 1116, 1141, 1166, 1190, 1215, 1240, 1265, 1290, 1315, 1340, 1365, 1390, 1414, 1439, 1464, 1489, 1514, 1538, 1563, 1588, 1612, 1637, 1662, 1686, 1711, 1736, 1760, 1785, 1810, 1834, 1859, 1883, 1908, 1932, 1957, 1982, 2006, 2031, 2055, 2080, 2104, 2129, 2153, 2178, 2202, 2227, 2251, 2276, 2300, 2325, 2349, 2373, 2398, 2422, 2447, 2471, 2495, 2520, 2544, 2569, 2593, 2617, 2641, 2665, 2689, 2713, 2737, 2761, 2785, 2809, 2833, 2857, 2881, 2905, 2929, 2953, 2977, 3001, 3024, 3048, 3072, 3096, 3119, 3143, 3167, 3191, 3214, 3238, 3262, 3285, 3309, 3332, 3356, 3379, 3403, 3427, 3450, 3474, 3497, 3520, 3543, 3566, 3590, 3613, 3636, 3659, 3682, 3705, 3729, 3730',
      }]
    },
    }})



  //create cargo
  const air2c1 = await prisma.cargo.create({
    data:{
      name: 'Water Container (5 Gallon)',
      fs: 358,
      weight: 40,
      aircraft: {connect:{id:2}}
    }
  })

  const air2c2 = await prisma.cargo.create({
    data:{
      name: 'Std 2 gal liquid container',
      weight: 25,
      fs: 260,
      aircraft: {connect:{id:2}}
    }
  })

  const air2c3 = await prisma.cargo.create({
    data:{
      name: 'Hot Cup',
      fs: 260,
      weight: 3,
      aircraft: {connect:{id:2}}
    }
  })

  const air2c4 = await prisma.cargo.create({
    data:{
      name: 'Human Waste Clean-up kit',
      fs: 280,
      weight: 5,
      aircraft: {connect:{id:2}}
    }
  })

  const air2c5 = await prisma.cargo.create({
    data:{
      name: 'Blanket Large',
      fs: 280,
      weight: 3.5,
      aircraft: {connect:{id:2}}
    }
  })

  const air2c6 = await prisma.cargo.create({
    data:{
      name: 'Pillow Large w/Case',
      fs: 280,
      weight: 2,
      aircraft: {connect:{id:2}}
    }
  })

  const air2c7 = await prisma.cargo.create({
    data:{
      name: 'Blanket Small',
      fs: -1,
      weight: 1,
      aircraft: {connect:{id:2}}
    }
  })

  const air2c8 = await prisma.cargo.create({
    data:{
      name: 'Pillow Small w/Case',
        fs: -1,
        weight: 0.5,
      aircraft: {connect:{id:2}}
    }
  })

  const air2c9 = await prisma.cargo.create({
    data:{
      name: 'Expendable Supplies',
      fs: 260,
      weight: 10,
      aircraft: {connect:{id:2}}
    }
  })

  const air2c10 = await prisma.cargo.create({
    data:{
      name: 'Passenger Demo Kit',
      fs: 380,
      weight: 3,
      aircraft: {connect:{id:2}}
    }
  })

  const air2c11 = await prisma.cargo.create({
    data:{
      name: 'Pax info cards (102)',
      fs: 280,
      weight: 3,
      aircraft: {connect:{id:2}}
    }
  })

  const air2c12 = await prisma.cargo.create({
    data:{
      name: 'ATGL (Serviced)',
      fs: 401,
      weight: 3620,
      aircraft: {connect:{id:2}}
    }
  })

  const air2c13 = await prisma.cargo.create({
    data:{
      name: 'LPU-6P Infant Cot',
      fs: 280,
      weight: 4,
      aircraft: {connect:{id:2}}
    }
  })

  const air2c14 = await prisma.cargo.create({
    data:{
      name: 'A/C Life Preserver',
      fs: -1,
      weight: 1.5,
      aircraft: {connect:{id:2}}
    }
  })

  const air2c15 = await prisma.cargo.create({
    data:{
      name: 'Protective clothing kit',
      fs: 280,
      weight: 36,
      aircraft: {connect:{id:2}}
    }
  })

  const air2c16 = await prisma.cargo.create({
    data:{
      name: 'BA-22 Parachute',
      fs: 280,
      weight: 28,
      aircraft: {connect:{id:2}}
    }
  })

  const air2c17 = await prisma.cargo.create({
    data:{
      name: 'LPU-10P',
      fs: 280,
      weight: 4,
      aircraft: {connect:{id:2}}
    }
  })

  const air2c18 = await prisma.cargo.create({
    data:{
      name: 'EPOS',
      fs: -1,
      weight: 2,
      aircraft: {connect:{id:2}}
    }
  })

  const air2c19 = await prisma.cargo.create({
    data:{
      name: 'PBE',
      fs: 280,
      weight: 5,
      aircraft: {connect:{id:2}}
    }
  })

  const air2c20 = await prisma.cargo.create({
    data:{
      name: 'Survival Vest',
      fs: 280,
      weight: 11.5,
      aircraft: {connect:{id:2}}
    }
  })

  const air2c21 = await prisma.cargo.create({
    data:{
      name: 'Aircrew Body Armor (Level IIIA)',
      fs: 280,
      weight: 8.5,
      aircraft: {connect:{id:2}}
    }
  })

  const air2c22 = await prisma.cargo.create({
    data:{
      name: '60 Hz Backup Converter',
      fs: 252,
      weight: 43,
      aircraft: {connect:{id:2}}
    }
  })

  const air2c23 = await prisma.cargo.create({
    data:{
      name: 'Additional Aeromedical Stations',
      fs: -1,
      weight: 66,
      aircraft: {connect:{id:2}}
    }
  })

  const air2c24 = await prisma.cargo.create({
    data:{
      name: 'Seat Pallets DV (5 Seats/Pallet)',
      fs: -1,
      weight: 591,
      aircraft: {connect:{id:2}}
    }
  })

  const air2c25 = await prisma.cargo.create({
    data:{
      name: 'Seat Pallets DV (10 Seats/pallet)',
      fs: -1,
      weight: 767,
      aircraft: {connect:{id:2}}
    }
  })

  const air2c26 = await prisma.cargo.create({
    data:{
      name: 'Seat Pallets Mass (15 Seats/pallet)',
      fs: -1,
      weight: 943,
      aircraft: {connect:{id:2}}
    }
  })

  const air2c27 = await prisma.cargo.create({
    data:{
      name: 'Flares/Flare Cans (Note 1)',
      fs: 744,
      weight: 255,
      aircraft: {connect:{id:2}}
    }
  })

  const air2c28 = await prisma.cargo.create({
    data:{
      name: 'Flare Hazard Placards (Note 1)',
      fs: 400,
      weight: 20,
      aircraft: {connect:{id:2}}
    }
  })

  const air2c29 = await prisma.cargo.create({
    data:{
      name: 'Aircraft Armor (Note 1)',
      fs: 217,
      weight: 1125,
      aircraft: {connect:{id:2}}
    }
  })

  const air2c30 = await prisma.cargo.create({
    data:{
      name: 'SLIP (unoccupied)',
      fs: -1,
      weight: 1350,
      aircraft: {connect:{id:2}}
    }
  })

  const air2c31 = await prisma.cargo.create({
    data:{
      name: 'SLICC Berthing Capsule',
      fs: 580,
      weight: 3790,
      aircraft: {connect:{id:2}}
    }
  })

  const air2c32 = await prisma.cargo.create({
    data:{
      name: 'SLICC Conference Capsule',
      fs: 685,
      weight: 4660,
      aircraft: {connect:{id:2}}
    }
  })

  const air2c33 = await prisma.cargo.create({
    data:{
      name: 'MX TO File',
      fs: 305,
      weight: 30,
      aircraft: {connect:{id:2}}
    }
  })

  const air2c34 = await prisma.cargo.create({
    data:{
      name: 'Kit, Passenger service',
      fs: 280,
      weight: 10,
      aircraft: {connect:{id:2}}
    }
  })


  //create configs
  const air2config1 = await prisma.config.create({
    data:{
      aircraft: {connect: {id:2}},
      name: 'AE-1',
      configcargos: {create:[

        // stewards equipment tot weight 277, tot mom 12.4
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:35}}, //water container
          fs: 358,
          qty: 3,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:36}}, //std 2 gal liquid
          fs: 260,
          qty: 1,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:37}}, // hot cup
          fs: 260,
          qty: 1,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:38}}, // hw clean up kit
          fs: 280,
          qty: 1,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:39}}, // blanket large
          fs: 280,
          qty: 6,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:40}}, //pilllow lrg with case
          fs: 280,
          qty: 6,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:41}}, // blanket small
          fs: 744,
          qty: 54,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:42}}, // pillow small w case
          fs: 744,
          qty: 54,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:43}}, // expendables
          fs: 260,
          qty: 1,
        },
        
        //emergency equip tot weight 612, tot mom 35.6
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:51}}, // lpu 10p
          fs: 280,
          qty: 2,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:47}}, // lpu 6
          fs: 280,
          qty: 3,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:48}}, // ac life pres
          fs: 744,
          qty: 110,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:49}}, // pck
          fs: 280,
          qty: 1,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:52}}, // epos
          fs: 744,
          qty: 102,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:53}}, // pbe
          fs: 744,
          qty: 6,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:50}}, // parachute
          fs: 280,
          qty: 2,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:55}}, // bod armor
          fs: 280,
          qty: 5,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:54}}, // survial vest
          fs: 280,
          qty: 5,
        },

        //extra equip tot weight 1430, tot mom 45.1
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:67}}, // to file
          fs: 305,
          qty: 1,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:63}}, // acft armor
          fs: 217,
          qty: 1,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:61}}, // flarees/ flare cans
          fs: 744,
          qty: 6,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:62}}, // flare pacards
          fs: 400,
          qty: 4,
        },

      ]}
    }
  })


  const air2config2 = await prisma.config.create({
    data:{
      aircraft: {connect: {id:2}},
      name: 'AE-2',
      configcargos: {create:[

        // stewards equipment tot weight 3897 tot mom 157.5
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:35}}, //water container
          fs: 358,
          qty: 3,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:36}}, //std 2 gal liquid
          fs: 260,
          qty: 1,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:37}}, // hot cup
          fs: 260,
          qty: 1,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:38}}, // hw clean up kit
          fs: 280,
          qty: 1,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:39}}, // blanket large
          fs: 280,
          qty: 6,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:40}}, //pilllow lrg with case
          fs: 280,
          qty: 6,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:41}}, // blanket small
          fs: 744,
          qty: 54,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:42}}, // pillow small w case
          fs: 744,
          qty: 54,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:43}}, // expendables
          fs: 260,
          qty: 1,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:46}}, // atgl
          fs: 401,
          qty: 1,
        },
        
        //emergency equip tot weight 612, tot mom 35.6
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:51}}, // lpu 10p
          fs: 280,
          qty: 2,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:47}}, // lpu 6
          fs: 280,
          qty: 3,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:48}}, // ac life pres
          fs: 744,
          qty: 110,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:49}}, // pck
          fs: 280,
          qty: 1,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:52}}, // epos
          fs: 744,
          qty: 102,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:53}}, // pbe
          fs: 744,
          qty: 6,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:50}}, // parachute
          fs: 280,
          qty: 2,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:55}}, // bod armor
          fs: 280,
          qty: 5,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:54}}, // survial vest
          fs: 280,
          qty: 5,
        },

        //extra equip tot weight 1430, tot mom 45.1
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:67}}, // to file
          fs: 305,
          qty: 1,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:63}}, // acft armor
          fs: 217,
          qty: 1,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:61}}, // flarees/ flare cans
          fs: 744,
          qty: 6,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:62}}, // flare pacards
          fs: 400,
          qty: 4,
        },

      ]}
    }
  })


  const air2config3 = await prisma.config.create({
    data:{
      aircraft: {connect: {id:2}},
      name: 'AE-3',
      configcargos: {create:[

        // stewards equipment tot weight 282, tot mom 12.6 //pas service
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:35}}, //water container
          fs: 358,
          qty: 3,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:36}}, //std 2 gal liquid
          fs: 260,
          qty: 1,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:37}}, // hot cup
          fs: 260,
          qty: 1,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:68}}, // pass service
          fs: 280,
          qty: 1,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:39}}, // blanket large
          fs: 280,
          qty: 6,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:40}}, //pilllow lrg with case
          fs: 280,
          qty: 6,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:41}}, // blanket small
          fs: 744,
          qty: 54,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:42}}, // pillow small w case
          fs: 744,
          qty: 54,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:43}}, // expendables
          fs: 260,
          qty: 1,
        },
        
        //emergency equip tot weight 612, tot mom 35.6
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:51}}, // lpu 10p
          fs: 280,
          qty: 2,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:47}}, // lpu 6
          fs: 280,
          qty: 3,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:48}}, // ac life pres
          fs: 744,
          qty: 110,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:49}}, // pck
          fs: 280,
          qty: 1,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:52}}, // epos
          fs: 744,
          qty: 102,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:53}}, // pbe
          fs: 744,
          qty: 6,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:50}}, // parachute
          fs: 280,
          qty: 2,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:55}}, // bod armor
          fs: 280,
          qty: 5,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:54}}, // survial vest
          fs: 280,
          qty: 5,
        },

        //extra equip tot weight 1430, tot mom 45.1
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:67}}, // to file
          fs: 305,
          qty: 1,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:63}}, // acft armor
          fs: 217,
          qty: 1,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:61}}, // flarees/ flare cans
          fs: 744,
          qty: 6,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:62}}, // flare pacards
          fs: 400,
          qty: 4,
        },

      ]}
    }
  })

  const air2config4 = await prisma.config.create({
    data:{
      aircraft: {connect: {id:2}},
      name: 'AEC-1',
      configcargos: {create:[

        // stewards equipment tot weight 3897 tot mom 157.5
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:35}}, //water container
          fs: 358,
          qty: 3,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:36}}, //std 2 gal liquid
          fs: 260,
          qty: 1,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:37}}, // hot cup
          fs: 260,
          qty: 1,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:38}}, // hw clean up
          fs: 280,
          qty: 1,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:39}}, // blanket large
          fs: 280,
          qty: 6,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:40}}, //pilllow lrg with case
          fs: 280,
          qty: 6,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:41}}, // blanket small
          fs: 744,
          qty: 54,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:42}}, // pillow small w case
          fs: 744,
          qty: 54,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:43}}, // expendables
          fs: 260,
          qty: 1,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:46}}, // atgl
          fs: 401,
          qty: 1,
        },
        
        //emergency equip tot weight 612, tot mom 35.6
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:51}}, // lpu 10p
          fs: 280,
          qty: 2,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:47}}, // lpu 6
          fs: 280,
          qty: 3,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:48}}, // ac life pres
          fs: 744,
          qty: 110,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:49}}, // pck
          fs: 280,
          qty: 1,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:52}}, // epos
          fs: 744,
          qty: 102,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:53}}, // pbe
          fs: 744,
          qty: 6,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:50}}, // parachute
          fs: 280,
          qty: 2,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:55}}, // bod armor
          fs: 280,
          qty: 5,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:54}}, // survial vest
          fs: 280,
          qty: 5,
        },

        //extra equip tot weight 1430, tot mom 45.1
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:67}}, // to file
          fs: 305,
          qty: 1,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:63}}, // acft armor
          fs: 217,
          qty: 1,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:61}}, // flarees/ flare cans
          fs: 744,
          qty: 6,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:62}}, // flare pacards
          fs: 400,
          qty: 4,
        },

      ]}
    }
  })

  const air2config5 = await prisma.config.create({
    data:{
      aircraft: {connect: {id:2}},
      name: 'C-1',
      configcargos: {create:[

        // stewards equipment tot weight 277, tot mom 12.4
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:35}}, //water container
          fs: 358,
          qty: 3,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:36}}, //std 2 gal liquid
          fs: 260,
          qty: 1,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:37}}, // hot cup
          fs: 260,
          qty: 1,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:38}}, // hw clean up kit
          fs: 280,
          qty: 1,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:39}}, // blanket large
          fs: 280,
          qty: 6,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:40}}, //pilllow lrg with case
          fs: 280,
          qty: 6,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:41}}, // blanket small
          fs: 744,
          qty: 54,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:42}}, // pillow small w case
          fs: 744,
          qty: 54,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:43}}, // expendables
          fs: 260,
          qty: 1,
        },
        
        //emergency equip tot weight 612, tot mom 35.6
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:51}}, // lpu 10p
          fs: 280,
          qty: 2,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:47}}, // lpu 6
          fs: 280,
          qty: 3,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:48}}, // ac life pres
          fs: 744,
          qty: 110,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:49}}, // pck
          fs: 280,
          qty: 1,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:52}}, // epos
          fs: 744,
          qty: 102,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:53}}, // pbe
          fs: 744,
          qty: 6,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:50}}, // parachute
          fs: 280,
          qty: 2,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:55}}, // bod armor
          fs: 280,
          qty: 5,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:54}}, // survial vest
          fs: 280,
          qty: 5,
        },

        //extra equip tot weight 1430, tot mom 45.1
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:67}}, // to file
          fs: 305,
          qty: 1,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:63}}, // acft armor
          fs: 217,
          qty: 1,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:61}}, // flarees/ flare cans
          fs: 744,
          qty: 6,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:62}}, // flare pacards
          fs: 400,
          qty: 4,
        },

      ]}
    }
  })

  const air2config6 = await prisma.config.create({
    data:{
      aircraft: {connect: {id:2}},
      name: 'C-2',
      configcargos: {create:[

        // stewards equipment tot weight 277, tot mom 12.4
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:35}}, //water container
          fs: 358,
          qty: 3,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:36}}, //std 2 gal liquid
          fs: 260,
          qty: 1,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:37}}, // hot cup
          fs: 260,
          qty: 1,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:38}}, // hw clean up kit
          fs: 280,
          qty: 1,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:39}}, // blanket large
          fs: 280,
          qty: 6,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:40}}, //pilllow lrg with case
          fs: 280,
          qty: 6,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:41}}, // blanket small
          fs: 744,
          qty: 54,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:42}}, // pillow small w case
          fs: 744,
          qty: 54,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:43}}, // expendables
          fs: 260,
          qty: 1,
        },
        
        //emergency equip tot weight 612, tot mom 35.6
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:51}}, // lpu 10p
          fs: 280,
          qty: 2,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:47}}, // lpu 6
          fs: 280,
          qty: 3,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:48}}, // ac life pres
          fs: 744,
          qty: 110,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:49}}, // pck
          fs: 280,
          qty: 1,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:52}}, // epos
          fs: 744,
          qty: 102,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:53}}, // pbe
          fs: 744,
          qty: 6,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:50}}, // parachute
          fs: 280,
          qty: 2,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:55}}, // bod armor
          fs: 280,
          qty: 5,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:54}}, // survial vest
          fs: 280,
          qty: 5,
        },

        //extra equip tot weight 1430, tot mom 45.1
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:67}}, // to file
          fs: 305,
          qty: 1,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:63}}, // acft armor
          fs: 217,
          qty: 1,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:61}}, // flarees/ flare cans
          fs: 744,
          qty: 6,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:62}}, // flare pacards
          fs: 400,
          qty: 4,
        },

      ]}
    }
  })


  const air2config7 = await prisma.config.create({
    data:{
      aircraft: {connect: {id:2}},
      name: 'C-3',
      configcargos: {create:[

        // stewards equipment tot weight 277, tot mom 12.4
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:35}}, //water container
          fs: 358,
          qty: 3,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:36}}, //std 2 gal liquid
          fs: 260,
          qty: 1,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:37}}, // hot cup
          fs: 260,
          qty: 1,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:38}}, // hw clean up kit
          fs: 280,
          qty: 1,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:39}}, // blanket large
          fs: 280,
          qty: 6,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:40}}, //pilllow lrg with case
          fs: 280,
          qty: 6,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:41}}, // blanket small
          fs: 744,
          qty: 54,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:42}}, // pillow small w case
          fs: 744,
          qty: 54,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:43}}, // expendables
          fs: 260,
          qty: 1,
        },
        
        //emergency equip tot weight 612, tot mom 35.6
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:51}}, // lpu 10p
          fs: 280,
          qty: 2,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:47}}, // lpu 6
          fs: 280,
          qty: 3,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:48}}, // ac life pres
          fs: 744,
          qty: 110,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:49}}, // pck
          fs: 280,
          qty: 1,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:52}}, // epos
          fs: 744,
          qty: 102,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:53}}, // pbe
          fs: 744,
          qty: 6,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:50}}, // parachute
          fs: 280,
          qty: 2,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:55}}, // bod armor
          fs: 280,
          qty: 5,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:54}}, // survial vest
          fs: 280,
          qty: 5,
        },

        //extra equip tot weight 1430, tot mom 45.1
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:67}}, // to file
          fs: 305,
          qty: 1,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:63}}, // acft armor
          fs: 217,
          qty: 1,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:61}}, // flarees/ flare cans
          fs: 744,
          qty: 6,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:62}}, // flare pacards
          fs: 400,
          qty: 4,
        },

      ]}
    }
  })


  const air2config8 = await prisma.config.create({
    data:{
      aircraft: {connect: {id:2}},
      name: 'P-1',
      configcargos: {create:[

        // stewards equipment tot weight 3897, tot mom 157.5
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:35}}, //water container
          fs: 358,
          qty: 3,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:36}}, //std 2 gal liquid
          fs: 260,
          qty: 1,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:37}}, // hot cup
          fs: 260,
          qty: 1,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:38}}, // hw clean up kit
          fs: 280,
          qty: 1,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:39}}, // blanket large
          fs: 280,
          qty: 6,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:40}}, //pilllow lrg with case
          fs: 280,
          qty: 6,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:41}}, // blanket small
          fs: 744,
          qty: 54,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:42}}, // pillow small w case
          fs: 744,
          qty: 54,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:43}}, // expendables
          fs: 260,
          qty: 1,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:46}}, // atgl
          fs: 401,
          qty: 1,
        },
        
        //emergency equip tot weight 612, tot mom 35.6
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:51}}, // lpu 10p
          fs: 280,
          qty: 2,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:47}}, // lpu 6
          fs: 280,
          qty: 3,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:48}}, // ac life pres
          fs: 744,
          qty: 110,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:49}}, // pck
          fs: 280,
          qty: 1,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:52}}, // epos
          fs: 744,
          qty: 102,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:53}}, // pbe
          fs: 744,
          qty: 6,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:50}}, // parachute
          fs: 280,
          qty: 2,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:55}}, // bod armor
          fs: 280,
          qty: 5,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:54}}, // survial vest
          fs: 280,
          qty: 5,
        },

        //extra equip tot weight 1430, tot mom 45.1
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:67}}, // to file
          fs: 305,
          qty: 1,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:63}}, // acft armor
          fs: 217,
          qty: 1,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:61}}, // flarees/ flare cans
          fs: 744,
          qty: 6,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:62}}, // flare pacards
          fs: 400,
          qty: 4,
        },

      ]}
    }
  })

  const air2config9 = await prisma.config.create({
    data:{
      aircraft: {connect: {id:2}},
      name: 'SP-X',
      configcargos: {create:[

        // stewards equipment tot weight 277, tot mom 12.4
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:35}}, //water container
          fs: 358,
          qty: 3,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:36}}, //std 2 gal liquid
          fs: 260,
          qty: 1,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:37}}, // hot cup
          fs: 260,
          qty: 1,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:38}}, // hw clean up kit
          fs: 280,
          qty: 1,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:39}}, // blanket large
          fs: 280,
          qty: 6,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:40}}, //pilllow lrg with case
          fs: 280,
          qty: 6,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:41}}, // blanket small
          fs: 744,
          qty: 54,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:42}}, // pillow small w case
          fs: 744,
          qty: 54,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:43}}, // expendables
          fs: 260,
          qty: 1,
        },
        
        //emergency equip tot weight 612, tot mom 35.6
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:51}}, // lpu 10p
          fs: 280,
          qty: 2,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:47}}, // lpu 6
          fs: 280,
          qty: 3,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:48}}, // ac life pres
          fs: 744,
          qty: 110,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:49}}, // pck
          fs: 280,
          qty: 1,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:52}}, // epos
          fs: 744,
          qty: 102,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:53}}, // pbe
          fs: 744,
          qty: 6,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:50}}, // parachute
          fs: 280,
          qty: 2,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:55}}, // bod armor
          fs: 280,
          qty: 5,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:54}}, // survial vest
          fs: 280,
          qty: 5,
        },

        //extra equip tot weight 1430, tot mom 45.1
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:67}}, // to file
          fs: 305,
          qty: 1,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:63}}, // acft armor
          fs: 217,
          qty: 1,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:61}}, // flarees/ flare cans
          fs: 744,
          qty: 6,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:62}}, // flare pacards
          fs: 400,
          qty: 4,
        },

      ]}
    }
  })

  const air2config10 = await prisma.config.create({
    data:{
      aircraft: {connect: {id:2}},
      name: 'CP-X',
      configcargos: {create:[

        // stewards equipment tot weight 277, tot mom 12.4
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:35}}, //water container
          fs: 358,
          qty: 3,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:36}}, //std 2 gal liquid
          fs: 260,
          qty: 1,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:37}}, // hot cup
          fs: 260,
          qty: 1,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:38}}, // hw clean up kit
          fs: 280,
          qty: 1,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:39}}, // blanket large
          fs: 280,
          qty: 6,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:40}}, //pilllow lrg with case
          fs: 280,
          qty: 6,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:41}}, // blanket small
          fs: 744,
          qty: 54,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:42}}, // pillow small w case
          fs: 744,
          qty: 54,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:43}}, // expendables
          fs: 260,
          qty: 1,
        },
        
        //emergency equip tot weight 612, tot mom 35.6
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:51}}, // lpu 10p
          fs: 280,
          qty: 2,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:47}}, // lpu 6
          fs: 280,
          qty: 3,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:48}}, // ac life pres
          fs: 744,
          qty: 110,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:49}}, // pck
          fs: 280,
          qty: 1,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:52}}, // epos
          fs: 744,
          qty: 102,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:53}}, // pbe
          fs: 744,
          qty: 6,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:50}}, // parachute
          fs: 280,
          qty: 2,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:55}}, // bod armor
          fs: 280,
          qty: 5,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:54}}, // survial vest
          fs: 280,
          qty: 5,
        },

        //extra equip tot weight 1430, tot mom 45.1
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:67}}, // to file
          fs: 305,
          qty: 1,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:63}}, // acft armor
          fs: 217,
          qty: 1,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:61}}, // flarees/ flare cans
          fs: 744,
          qty: 6,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:62}}, // flare pacards
          fs: 400,
          qty: 4,
        },

      ]}
    }
  })

  const air2config11 = await prisma.config.create({
    data:{
      aircraft: {connect: {id:2}},
      name: 'ADP-1',
      configcargos: {create:[

        // stewards equipment tot weight 277, tot mom 12.4
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:35}}, //water container
          fs: 358,
          qty: 3,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:36}}, //std 2 gal liquid
          fs: 260,
          qty: 1,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:37}}, // hot cup
          fs: 260,
          qty: 1,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:38}}, // hw clean up kit
          fs: 280,
          qty: 1,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:39}}, // blanket large
          fs: 280,
          qty: 6,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:40}}, //pilllow lrg with case
          fs: 280,
          qty: 6,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:41}}, // blanket small
          fs: 744,
          qty: 54,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:42}}, // pillow small w case
          fs: 744,
          qty: 54,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:43}}, // expendables
          fs: 260,
          qty: 1,
        },
        
        //emergency equip tot weight 612, tot mom 35.6
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:51}}, // lpu 10p
          fs: 280,
          qty: 2,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:47}}, // lpu 6
          fs: 280,
          qty: 3,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:48}}, // ac life pres
          fs: 744,
          qty: 110,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:49}}, // pck
          fs: 280,
          qty: 1,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:52}}, // epos
          fs: 744,
          qty: 102,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:53}}, // pbe
          fs: 744,
          qty: 6,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:50}}, // parachute
          fs: 280,
          qty: 2,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:55}}, // bod armor
          fs: 280,
          qty: 5,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:54}}, // survial vest
          fs: 280,
          qty: 5,
        },

        //extra equip tot weight 1430, tot mom 45.1
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:67}}, // to file
          fs: 305,
          qty: 1,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:63}}, // acft armor
          fs: 217,
          qty: 1,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:61}}, // flarees/ flare cans
          fs: 744,
          qty: 6,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:62}}, // flare pacards
          fs: 400,
          qty: 4,
        },

      ]}
    }
  })

  const air2config12 = await prisma.config.create({
    data:{
      aircraft: {connect: {id:2}},
      name: 'ADP-2',
      configcargos: {create:[

        // stewards equipment tot weight 277, tot mom 12.4
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:35}}, //water container
          fs: 358,
          qty: 3,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:36}}, //std 2 gal liquid
          fs: 260,
          qty: 1,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:37}}, // hot cup
          fs: 260,
          qty: 1,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:38}}, // hw clean up kit
          fs: 280,
          qty: 1,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:39}}, // blanket large
          fs: 280,
          qty: 6,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:40}}, //pilllow lrg with case
          fs: 280,
          qty: 6,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:41}}, // blanket small
          fs: 744,
          qty: 54,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:42}}, // pillow small w case
          fs: 744,
          qty: 54,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:43}}, // expendables
          fs: 260,
          qty: 1,
        },
        
        //emergency equip tot weight 612, tot mom 35.6
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:51}}, // lpu 10p
          fs: 280,
          qty: 2,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:47}}, // lpu 6
          fs: 280,
          qty: 3,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:48}}, // ac life pres
          fs: 744,
          qty: 110,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:49}}, // pck
          fs: 280,
          qty: 1,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:52}}, // epos
          fs: 744,
          qty: 102,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:53}}, // pbe
          fs: 744,
          qty: 6,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:50}}, // parachute
          fs: 280,
          qty: 2,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:55}}, // bod armor
          fs: 280,
          qty: 5,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:54}}, // survial vest
          fs: 280,
          qty: 5,
        },

        //extra equip tot weight 1430, tot mom 45.1
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:67}}, // to file
          fs: 305,
          qty: 1,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:63}}, // acft armor
          fs: 217,
          qty: 1,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:61}}, // flarees/ flare cans
          fs: 744,
          qty: 6,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:62}}, // flare pacards
          fs: 400,
          qty: 4,
        },

      ]}
    }
  })

  const air2config13 = await prisma.config.create({
    data:{
      aircraft: {connect: {id:2}},
      name: 'ADP-3',
      configcargos: {create:[

        // stewards equipment tot weight 3897, tot mom 157.5
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:35}}, //water container
          fs: 358,
          qty: 3,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:36}}, //std 2 gal liquid
          fs: 260,
          qty: 1,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:37}}, // hot cup
          fs: 260,
          qty: 1,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:38}}, // hw clean up kit
          fs: 280,
          qty: 1,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:39}}, // blanket large
          fs: 280,
          qty: 6,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:40}}, //pilllow lrg with case
          fs: 280,
          qty: 6,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:41}}, // blanket small
          fs: 744,
          qty: 54,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:42}}, // pillow small w case
          fs: 744,
          qty: 54,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:43}}, // expendables
          fs: 260,
          qty: 1,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:46}}, // atgl
          fs: 401,
          qty: 1,
        },
        
        //emergency equip tot weight 612, tot mom 35.6
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:51}}, // lpu 10p
          fs: 280,
          qty: 2,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:47}}, // lpu 6
          fs: 280,
          qty: 3,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:48}}, // ac life pres
          fs: 744,
          qty: 110,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:49}}, // pck
          fs: 280,
          qty: 1,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:52}}, // epos
          fs: 744,
          qty: 102,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:53}}, // pbe
          fs: 744,
          qty: 6,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:50}}, // parachute
          fs: 280,
          qty: 2,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:55}}, // bod armor
          fs: 280,
          qty: 5,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:54}}, // survial vest
          fs: 280,
          qty: 5,
        },

        //extra equip tot weight 1430, tot mom 45.1
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:67}}, // to file
          fs: 305,
          qty: 1,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:63}}, // acft armor
          fs: 217,
          qty: 1,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:61}}, // flarees/ flare cans
          fs: 744,
          qty: 6,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:62}}, // flare pacards
          fs: 400,
          qty: 4,
        },

      ]}
    }
  })

  const air2config14 = await prisma.config.create({
    data:{
      aircraft: {connect: {id:2}},
      name: 'ADC-1',
      configcargos: {create:[

        // stewards equipment tot weight 277, tot mom 12.4
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:35}}, //water container
          fs: 358,
          qty: 3,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:36}}, //std 2 gal liquid
          fs: 260,
          qty: 1,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:37}}, // hot cup
          fs: 260,
          qty: 1,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:38}}, // hw clean up kit
          fs: 280,
          qty: 1,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:39}}, // blanket large
          fs: 280,
          qty: 6,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:40}}, //pilllow lrg with case
          fs: 280,
          qty: 6,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:41}}, // blanket small
          fs: 744,
          qty: 54,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:42}}, // pillow small w case
          fs: 744,
          qty: 54,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:43}}, // expendables
          fs: 260,
          qty: 1,
        },
        
        //emergency equip tot weight 612, tot mom 35.6
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:51}}, // lpu 10p
          fs: 280,
          qty: 2,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:47}}, // lpu 6
          fs: 280,
          qty: 3,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:48}}, // ac life pres
          fs: 744,
          qty: 110,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:49}}, // pck
          fs: 280,
          qty: 1,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:52}}, // epos
          fs: 744,
          qty: 102,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:53}}, // pbe
          fs: 744,
          qty: 6,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:50}}, // parachute
          fs: 280,
          qty: 2,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:55}}, // bod armor
          fs: 280,
          qty: 5,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:54}}, // survial vest
          fs: 280,
          qty: 5,
        },

        //extra equip tot weight 1430, tot mom 45.1
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:67}}, // to file
          fs: 305,
          qty: 1,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:63}}, // acft armor
          fs: 217,
          qty: 1,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:61}}, // flarees/ flare cans
          fs: 744,
          qty: 6,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:62}}, // flare pacards
          fs: 400,
          qty: 4,
        },

      ]}
    }
  })

  const air2config15 = await prisma.config.create({
    data:{
      aircraft: {connect: {id:2}},
      name: 'ADC-2',
      configcargos: {create:[

        // stewards equipment tot weight 277, tot mom 12.4
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:35}}, //water container
          fs: 358,
          qty: 3,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:36}}, //std 2 gal liquid
          fs: 260,
          qty: 1,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:37}}, // hot cup
          fs: 260,
          qty: 1,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:38}}, // hw clean up kit
          fs: 280,
          qty: 1,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:39}}, // blanket large
          fs: 280,
          qty: 6,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:40}}, //pilllow lrg with case
          fs: 280,
          qty: 6,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:41}}, // blanket small
          fs: 744,
          qty: 54,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:42}}, // pillow small w case
          fs: 744,
          qty: 54,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:43}}, // expendables
          fs: 260,
          qty: 1,
        },
        
        //emergency equip tot weight 612, tot mom 35.6
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:51}}, // lpu 10p
          fs: 280,
          qty: 2,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:47}}, // lpu 6
          fs: 280,
          qty: 3,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:48}}, // ac life pres
          fs: 744,
          qty: 110,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:49}}, // pck
          fs: 280,
          qty: 1,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:52}}, // epos
          fs: 744,
          qty: 102,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:53}}, // pbe
          fs: 744,
          qty: 6,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:50}}, // parachute
          fs: 280,
          qty: 2,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:55}}, // bod armor
          fs: 280,
          qty: 5,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:54}}, // survial vest
          fs: 280,
          qty: 5,
        },

        //extra equip tot weight 1430, tot mom 45.1
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:67}}, // to file
          fs: 305,
          qty: 1,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:63}}, // acft armor
          fs: 217,
          qty: 1,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:61}}, // flarees/ flare cans
          fs: 744,
          qty: 6,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:62}}, // flare pacards
          fs: 400,
          qty: 4,
        },

      ]}
    }
  })

  const air2config16 = await prisma.config.create({
    data:{
      aircraft: {connect: {id:2}},
      name: 'CDS-1',
      configcargos: {create:[

        // stewards equipment tot weight 277, tot mom 12.4
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:35}}, //water container
          fs: 358,
          qty: 3,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:36}}, //std 2 gal liquid
          fs: 260,
          qty: 1,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:37}}, // hot cup
          fs: 260,
          qty: 1,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:38}}, // hw clean up kit
          fs: 280,
          qty: 1,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:39}}, // blanket large
          fs: 280,
          qty: 6,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:40}}, //pilllow lrg with case
          fs: 280,
          qty: 6,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:41}}, // blanket small
          fs: 744,
          qty: 54,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:42}}, // pillow small w case
          fs: 744,
          qty: 54,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:43}}, // expendables
          fs: 260,
          qty: 1,
        },
        
        //emergency equip tot weight 612, tot mom 35.6
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:51}}, // lpu 10p
          fs: 280,
          qty: 2,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:47}}, // lpu 6
          fs: 280,
          qty: 3,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:48}}, // ac life pres
          fs: 744,
          qty: 110,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:49}}, // pck
          fs: 280,
          qty: 1,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:52}}, // epos
          fs: 744,
          qty: 102,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:53}}, // pbe
          fs: 744,
          qty: 6,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:50}}, // parachute
          fs: 280,
          qty: 2,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:55}}, // bod armor
          fs: 280,
          qty: 5,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:54}}, // survial vest
          fs: 280,
          qty: 5,
        },

        //extra equip tot weight 1430, tot mom 45.1
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:67}}, // to file
          fs: 305,
          qty: 1,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:63}}, // acft armor
          fs: 217,
          qty: 1,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:61}}, // flarees/ flare cans
          fs: 744,
          qty: 6,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:62}}, // flare pacards
          fs: 400,
          qty: 4,
        },

      ]}
    }
  })

  const air2config17 = await prisma.config.create({
    data:{
      aircraft: {connect: {id:2}},
      name: 'DV-1',
      configcargos: {create:[

        // stewards equipment tot weight 3897, tot mom 157.5
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:35}}, //water container
          fs: 358,
          qty: 3,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:36}}, //std 2 gal liquid
          fs: 260,
          qty: 1,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:37}}, // hot cup
          fs: 260,
          qty: 1,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:38}}, // hw clean up kit
          fs: 280,
          qty: 1,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:39}}, // blanket large
          fs: 280,
          qty: 6,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:40}}, //pilllow lrg with case
          fs: 280,
          qty: 6,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:41}}, // blanket small
          fs: 744,
          qty: 54,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:42}}, // pillow small w case
          fs: 744,
          qty: 54,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:43}}, // expendables
          fs: 260,
          qty: 1,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:46}}, // atgl
          fs: 401,
          qty: 1,
        },
        
        //emergency equip tot weight 612, tot mom 35.6
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:51}}, // lpu 10p
          fs: 280,
          qty: 2,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:47}}, // lpu 6
          fs: 280,
          qty: 3,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:48}}, // ac life pres
          fs: 744,
          qty: 110,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:49}}, // pck
          fs: 280,
          qty: 1,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:52}}, // epos
          fs: 744,
          qty: 102,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:53}}, // pbe
          fs: 744,
          qty: 6,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:50}}, // parachute
          fs: 280,
          qty: 2,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:55}}, // bod armor
          fs: 280,
          qty: 5,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:54}}, // survial vest
          fs: 280,
          qty: 5,
        },

        //extra equip tot weight 1430, tot mom 45.1
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:67}}, // to file
          fs: 305,
          qty: 1,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:63}}, // acft armor
          fs: 217,
          qty: 1,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:61}}, // flarees/ flare cans
          fs: 744,
          qty: 6,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:62}}, // flare pacards
          fs: 400,
          qty: 4,
        },

      ]}
    }
  })

  const air2config18 = await prisma.config.create({
    data:{
      aircraft: {connect: {id:2}},
      name: 'SD-1',
      configcargos: {create:[

        // stewards equipment tot weight 3897, tot mom 157.5
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:35}}, //water container
          fs: 358,
          qty: 3,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:36}}, //std 2 gal liquid
          fs: 260,
          qty: 1,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:37}}, // hot cup
          fs: 260,
          qty: 1,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:38}}, // hw clean up kit
          fs: 280,
          qty: 1,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:39}}, // blanket large
          fs: 280,
          qty: 6,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:40}}, //pilllow lrg with case
          fs: 280,
          qty: 6,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:41}}, // blanket small
          fs: 744,
          qty: 54,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:42}}, // pillow small w case
          fs: 744,
          qty: 54,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:43}}, // expendables
          fs: 260,
          qty: 1,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:46}}, // atgl
          fs: 401,
          qty: 1,
        },
        
        //emergency equip tot weight 612, tot mom 35.6
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:51}}, // lpu 10p
          fs: 280,
          qty: 2,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:47}}, // lpu 6
          fs: 280,
          qty: 3,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:48}}, // ac life pres
          fs: 744,
          qty: 110,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:49}}, // pck
          fs: 280,
          qty: 1,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:52}}, // epos
          fs: 744,
          qty: 102,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:53}}, // pbe
          fs: 744,
          qty: 6,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:50}}, // parachute
          fs: 280,
          qty: 2,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:55}}, // bod armor
          fs: 280,
          qty: 5,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:54}}, // survial vest
          fs: 280,
          qty: 5,
        },

        //extra equip tot weight 1430, tot mom 45.1
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:67}}, // to file
          fs: 305,
          qty: 1,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:63}}, // acft armor
          fs: 217,
          qty: 1,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:61}}, // flarees/ flare cans
          fs: 744,
          qty: 6,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:62}}, // flare pacards
          fs: 400,
          qty: 4,
        },

      ]}
    }
  })

  const air2config19 = await prisma.config.create({
    data:{
      aircraft: {connect: {id:2}},
      name: 'SLC-1',
      configcargos: {create:[

        // stewards equipment tot weight 13697, tot mom 802.6
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:35}}, //water container
          fs: 358,
          qty: 3,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:36}}, //std 2 gal liquid
          fs: 260,
          qty: 1,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:37}}, // hot cup
          fs: 260,
          qty: 1,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:38}}, // hw clean up kit
          fs: 280,
          qty: 1,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:39}}, // blanket large
          fs: 280,
          qty: 6,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:40}}, //pilllow lrg with case
          fs: 280,
          qty: 6,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:41}}, // blanket small
          fs: 744,
          qty: 54,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:42}}, // pillow small w case
          fs: 744,
          qty: 54,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:43}}, // expendables
          fs: 260,
          qty: 1,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:46}}, // atgl
          fs: 401,
          qty: 1,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:65}}, // slicc berth
          fs: 401,
          qty: 1,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:66}}, // slic confence
          fs: 401,
          qty: 1,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:64}}, // slip
          fs: 401,
          qty: 1,
        },
        
        //emergency equip tot weight 612, tot mom 35.6
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:51}}, // lpu 10p
          fs: 280,
          qty: 2,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:47}}, // lpu 6
          fs: 280,
          qty: 3,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:48}}, // ac life pres
          fs: 744,
          qty: 110,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:49}}, // pck
          fs: 280,
          qty: 1,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:52}}, // epos
          fs: 744,
          qty: 102,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:53}}, // pbe
          fs: 744,
          qty: 6,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:50}}, // parachute
          fs: 280,
          qty: 2,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:55}}, // bod armor
          fs: 280,
          qty: 5,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:54}}, // survial vest
          fs: 280,
          qty: 5,
        },

        //extra equip tot weight 1430, tot mom 45.1
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:67}}, // to file
          fs: 305,
          qty: 1,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:63}}, // acft armor
          fs: 217,
          qty: 1,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:61}}, // flarees/ flare cans
          fs: 744,
          qty: 6,
        },
        {
          aircraft: {connect: {id:2}},
          cargo: {connect: {cargoid:62}}, // flare pacards
          fs: 400,
          qty: 4,
        },

      ]}
    }
  })

  //connect cargo to aircraft
  await prisma.aircraft.update({
    data: {
      cargos: {connect:[
        {cargoid:35},
        {cargoid:36},
        {cargoid:37},
        {cargoid:38},
        {cargoid:39},
        {cargoid:40},
        {cargoid:41},
        {cargoid:42},
        {cargoid:43},
        {cargoid:44},
        {cargoid:45},
        {cargoid:46},
        {cargoid:47},
        {cargoid:48},
        {cargoid:49},
        {cargoid:50},
        {cargoid:51},
        {cargoid:52},
        {cargoid:53},
        {cargoid:54},
        {cargoid:55},
        {cargoid:56},
        {cargoid:57},
        {cargoid:58},
        {cargoid:59},
        {cargoid:60},
        {cargoid:61},
        {cargoid:62},
        {cargoid:63},
        {cargoid:64},
        {cargoid:65},
        {cargoid:66},
        {cargoid:67},
        {cargoid:68},
      ]}
    },
    where: {id:2}
  })

  //connect config to aircarft
  await prisma.aircraft.update({
    data:{
      configs:{connect: [
        {configid:20},
        {configid:21},
        {configid:22},
        {configid:23},
        {configid:24},
        {configid:25},
        {configid:26},
        {configid:27},
        {configid:28},
        {configid:29},
        {configid:30},
        {configid:31},
        {configid:32},
        {configid:33},
        {configid:34},
        {configid:35},
        {configid:36},
        {configid:37},
        {configid:38},
      ]}
    },
    where: {id:2}
  })



  //create admins
  await prisma.auth.create({
    data: {
      email: 'teague.stockwell@us.af.mil',
      role: 'DB',
      //DB's dont need aircraft id they own them all
    }
  })

  //create general
  await prisma.general.create({
    data: {
      role: 'ADMIN',
      title: 'Disclaimer',
      body: 'Please be reminded that this app is intended for reference, and education purposes only. While careful consideration has been taken creating this app, we do not warrant, represent or guarantee that the material published on this app, as well as the calculations made, are in all respects accurate, complete or current. To the extent permitted by law, we exclude any liability, including any liability for negligence,  for loss, damage, or bodily injury arising from the reliance on material and calculations made in this application. It is your sole responsibility to make sure all proper measures are taken to ensure safety.',
      icondatas: [59478,57360], //flutter material icon data
      urls: ['https://forms.gle/Bbqvubn6gwC6fRnc8','https://tsappdevelopment.github.io/hellohtml/']
    }
  })

  await prisma.general.create({
    data: {
      role: 'DB',
      title: 'Disclaimer',
      body: 'Please be reminded that this app is intended for reference, and education purposes only. While careful consideration has been taken creating this app, we do not warrant, represent or guarantee that the material published on this app, as well as the calculations made, are in all respects accurate, complete or current. To the extent permitted by law, we exclude any liability, including any liability for negligence,  for loss, damage, or bodily injury arising from the reliance on material and calculations made in this application. It is your sole responsibility to make sure all proper measures are taken to ensure safety.',
      icondatas: [59478,57360], //flutter material icon data
      urls: ['https://forms.gle/Bbqvubn6gwC6fRnc8','https://tsappdevelopment.github.io/hellohtml/']
    }
  })

  await prisma.general.create({
    data: {
      role: 'USER',
      title: 'Disclaimer',
      body: 'Please be reminded that this app is intended for reference, and education purposes only. While careful consideration has been taken creating this app, we do not warrant, represent or guarantee that the material published on this app, as well as the calculations made, are in all respects accurate, complete or current. To the extent permitted by law, we exclude any liability, including any liability for negligence,  for loss, damage, or bodily injury arising from the reliance on material and calculations made in this application. It is your sole responsibility to make sure all proper measures are taken to ensure safety.',
      icondatas: [59478,57360], //flutter material icon data
      urls: ['https://forms.gle/Bbqvubn6gwC6fRnc8','https://tsappdevelopment.github.io/hellohtml/']
    }
  })
}        

main()
  .catch(e => {throw e})
  .finally(async () =>  await prisma.$disconnect())