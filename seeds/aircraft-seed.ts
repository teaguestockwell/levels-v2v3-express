import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();



async function C_17_ER(){

  
  await prisma.aircraft.create({
  data: {

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

    cargos: {create:
      [{
        name: 'Water Container (5 Gallon)',
        fs: 358,
        weight: 40,
      },
      {
        name: 'Std 2 gal liquid container',
        fs: 260,
        weight: 25,
      },
      {
        name: 'Hot Cup',
        fs: 260,
        weight: 3,
      },
      {
        name: 'Human Waste Clean-up kit',
        fs: 280,
        weight: 5,
      },
      {
        name: 'Blanket Large',
        fs: 280,
        weight: 3.5,
      },
      {
        name: 'Pillow Large w/Case',
        fs: 280,
        weight: 2,
      },
      {
        name: 'Blanket Small',
        fs: -1,
        weight: 1,
      },
      {
        name: 'Pillow Small w/Case',
        fs: -1,
        weight: 0.5,
      },
      {
        name: 'Expendable Supplies',
        fs: 260,
        weight: 10,
      },
      {
        name: 'Passenger Demo Kit',
        fs: 380,
        weight: 3,
      },
      {
        name: 'Pax info cards (102)',
        fs: 280,
        weight: 3,
      },
      {
        name: 'ATGL (Serviced)',
        fs: 401,
        weight: 3620,
      },
      {
        name: 'LPU-6P Infant Cot',
        fs: 280,
        weight: 4,
      },
      {
        name: 'A/C Life Preserver',
        fs: -1,
        weight: 1.5,
      },
      {
        name: 'Protective clothing kit',
        fs: 280,
        weight: 36,
      },
      {
        name: 'BA-22 Parachute',
        fs: 280,
        weight: 28,
      },
      {
        name: 'LPU-10P',
        fs: 280,
        weight: 4,
      },
      {
        name: 'EPOS',
        fs: -1,
        weight: 2,
      },
      {
        name: 'PBE',
        fs: 280,
        weight: 5,
      },
      {
        name: 'Survival Vest',
        fs: 280,
        weight: 11.5,
      },
      {
        name: 'Aircrew Body Armor (Level IIIA)',
        fs: 280,
        weight: 8.5,
      },
      {
        name: '60 Hz Backup Converter',
        fs: 252,
        weight: 43,
      },
      {
        name: 'Additional Aeromedical Stations',
        fs: -1,
        weight: 66,
      },
      {
        name: 'Seat Pallets DV (5 Seats/Pallet)',
        fs: -1,
        weight: 591,
      },
      {
        name: 'Seat Pallets DV (10 Seats/pallet)',
        fs: -1,
        weight: 767,
      },
      {
        name: 'Seat Pallets Mass (15 Seats/pallet)',
        fs: -1,
        weight: 943,
      },
      {
        name: 'Flares/Flare Cans (Note 1)',
        fs: 744,
        weight: 255,
      },
      {
        name: 'Flare Hazard Placards (Note 1)',
        fs: 400,
        weight: 20,
      },
      {
        name: 'Aircraft Armor (Note 1)',
        fs: 217,
        weight: 1125,
      },
      {
        name: 'SLIP (unoccupied)',
        fs: -1,
        weight: 1350,
      },
      {
        name: 'SLICC Berthing Capsule',
        fs: 580,
        weight: 3790,
      },
      {
        name: 'SLICC Conference Capsule',
        fs: 685,
        weight: 4660,
      }]
    },

    configs:{create:
      [{
        name: 'AE-1',
        configcargos: {create:
          [{
            name: 'Water container',
            weight: 40,
            fs: 358,
            qty: 3,
            aircraft: {connect: {name: 'C-17A-ER'}}
          }

          ]
        }

      }

      ]
    } 



    
    

  } 
  
})
  const airs = await prisma.aircraft.findMany({
        include: {
          cargos: true,
          tanks: true,
          glossarys: true
        },
  })

  console.log(airs)
}


// async function cargoTest(){
//   cargo = []

//  cargo[0] = await prisma.cargo.create({
//    {
//      name: 'Water Container (5 Gallon)',
//      fs: 358,
//      weight: 40,
//    }
//  })

//  cargo[1] = await prisma.cargo.create({
//   {
//     name: 'Std 2 gal liquid container',
//     fs: 260,
//     weight: 25,
//   }
// })

// cargo[2] = await prisma.cargo.create({
//   {
//     name: 'Hot Cup',
//     fs: 260,
//     weight: 3,
//   }
// })

// cargo[3] = await prisma.cargo.create({
//   {
//     name: 'Human Waste Clean-up kit',
//     fs: 280,
//     weight: 5,
//   }
// })

// cargo[4] = await prisma.cargo.create({
//   {
//     name: 'Blanket Large',
//     fs: 280,
//     weight: 3.5,
//   }
// })

// cargo[5] = await prisma.cargo.create({
//   {
//     name: 'Pillow Large w/Case',
//     fs: 280,
//     weight: 2,
//   }
// })

// cargo[6] = await prisma.cargo.create({
//   {
//     name: 'Blanket Small',
//     fs: -1,
//     weight: 1,
//   }
// })

// cargo[7] = await prisma.cargo.create({
//   {
//     name: 'Pillow Small w/Case',
//     fs: -1,
//     weight: 0.5,
//   }
// })

// cargo[8] = await prisma.cargo.create({
//   {
//     name: 'Expendable Supplies',
//     fs: 260,
//     weight: 10,
//   }
// })

// cargo[9] = await prisma.cargo.create({
//   {
//     name: 'Passenger Demo Kit',
//     fs: 380,
//     weight: 3,
//   }
// })

// cargo[10] = await prisma.cargo.create({
//   {
//     name: 'Pax info cards (102)',
//     fs: 280,
//     weight: 3,
//   }
// })

// cargo[11] = await prisma.cargo.create({
//   {
//     name: 'ATGL (Serviced)',
//     fs: 401,
//     weight: 3620,
//   }
// })

// cargo[12] = await prisma.cargo.create({
//   {
//     name: 'LPU-6P Infant Cot',
//     fs: 280,
//     weight: 4,
//   }
// })

// cargo[13] = await prisma.cargo.create({
//   {
//     name: 'A/C Life Preserver',
//     fs: -1,
//     weight: 1.5,
//   }
// })

// cargo[14] = await prisma.cargo.create({
//   {
//     name: 'Protective clothing kit',
//     fs: 280,
//     weight: 36,
//   }
// })

// cargo[15] = await prisma.cargo.create({
//   {
//     name: 'BA-22 Parachute',
//     fs: 280,
//     weight: 28,
//   }
// })

// cargo[16] = await prisma.cargo.create({
//   {
//     name: 'LPU-10P',
//     fs: 280,
//     weight: 4,
//   }
// })

// cargo[17] = await prisma.cargo.create({
//   {
//     name: 'EPOS',
//     fs: -1,
//     weight: 2,
//   }
// })

// cargo[18] = await prisma.cargo.create({
//   {
//     name: 'PBE',
//     fs: 280,
//     weight: 5,
//   }
// })

// cargo[19] = await prisma.cargo.create({
//   {
//     name: 'Survival Vest',
//     fs: 280,
//     weight: 11.5,
//   }
// })

// cargo[20] = await prisma.cargo.create({
//   {
//     name: 'Aircrew Body Armor (Level IIIA)',
//     fs: 280,
//     weight: 8.5,
//   }
// })

// cargo[21] = await prisma.cargo.create({
//   {
//     name: '60 Hz Backup Converter',
//     fs: 252,
//     weight: 43,
//   }
// })

// cargo[22] = await prisma.cargo.create({
//   {
//     name: 'Additional Aeromedical Stations',
//     fs: -1,
//     weight: 66,
//   }
// })

// cargo[23] = await prisma.cargo.create({
//   {
//     name: 'Seat Pallets DV (5 Seats/Pallet)',
//     fs: -1,
//     weight: 591,
//   }
// })

// cargo[24] = await prisma.cargo.create({
//   {
//     name: 'Seat Pallets DV (10 Seats/pallet)',
//     fs: -1,
//     weight: 767,
//   }
// })

// cargo[25] = await prisma.cargo.create({
//   {
//     name: 'Seat Pallets Mass (15 Seats/pallet)',
//     fs: -1,
//     weight: 943,
//   }
// })

// cargo[26] = await prisma.cargo.create({
//   {
//     name: 'Flares/Flare Cans (Note 1)',
//     fs: 744,
//     weight: 255,
//   }
// })

// cargo[27] = await prisma.cargo.create({
//   {
//     name: 'Flare Hazard Placards (Note 1)',
//     fs: 400,
//     weight: 20,
//   }
// })

// cargo[28] = await prisma.cargo.create({
//   {
//     name: 'Aircraft Armor (Note 1)',
//     fs: 217,
//     weight: 1125,
//   }
// })

// cargo[29] = await prisma.cargo.create({
//   {
//     name: 'SLIP (unoccupied)',
//     fs: -1,
//     weight: 1350,
//   }
// })

// cargo[30] = await prisma.cargo.create({
//   {
//     name: 'SLICC Berthing Capsule',
//     fs: 580,
//     weight: 3790,
//   }
// })

// cargo[31] = await prisma.cargo.create({
//   {
//     name: 'SLICC Conference Capsule',
//     fs: 685,
//     weight: 4660,
//   }
// })

// console.log(prisma.cargo.findMany())

// }


C_17_ER()
  .catch(e => {throw e})
  .finally(async () =>  await prisma.$disconnect())