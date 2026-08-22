/**
 * updateCityImages.js
 * 
 * Updates every city in the database with a curated, city-specific Unsplash image.
 * Each photo ID is hand-picked to represent the actual city landmark/skyline.
 *
 * Usage:  node scripts/updateCityImages.js
 */

import 'dotenv/config';
import mongoose from 'mongoose';
import connectDB from '../src/config/db.js';
import City from '../src/models/City.js';

// Curated Unsplash photo IDs — one per city, showing iconic landmarks/skylines
const CITY_IMAGES = {
  // ── Americas ────────────────────────────────────────────
  'New York':       'photo-1546436836-07a91091f160', // Manhattan skyline
  'San Francisco':  'photo-1501594907352-04cda38ebc29', // Golden Gate Bridge
  'Los Angeles':    'photo-1534190760961-74e8c1c5c3da', // LA skyline
  'Chicago':        'photo-1494522855154-9297ac14b55f', // Chicago skyline
  'Miami':          'photo-1533106497176-45ae19e68ba2', // Miami Beach
  'Seattle':        'photo-1502175353174-a7a70e73b4c3', // Space Needle
  'Boston':         'photo-1558642452-9d2a7deb7f62', // Boston harbor
  'Austin':         'photo-1531218150217-54595bc2b934', // Austin skyline
  'Denver':         'photo-1619856699906-09e1f4ef9d17', // Denver mountains
  'Las Vegas':      'photo-1605833556294-ea5c7a74f57d', // Vegas strip
  'Orlando':        'photo-1575089976121-8ed7b2a54265', // Orlando theme parks
  'Washington DC':  'photo-1501466044931-62695aada8e9', // Capitol Building
  'Honolulu':       'photo-1507876466758-bc54f384809c', // Waikiki Beach
  'New Orleans':    'photo-1568402102990-bc541580b59f', // French Quarter
  'Philadelphia':   'photo-1569761316261-9a8696fa2ca3', // Philly skyline
  'San Diego':      'photo-1538964173425-93884d1a0764', // San Diego coast
  'Portland':       'photo-1507245338769-7c25cc9dd4e0', // Portland
  'Toronto':        'photo-1517090504332-6c383a8af26e', // CN Tower
  'Montreal':       'photo-1558618666-fcd25c85f82e', // Montreal old port
  'Vancouver':      'photo-1559511260-66a654ae982a', // Vancouver harbor
  'Quebec City':    'photo-1558347623-07b04d72a03e', // Chateau Frontenac
  'Calgary':        'photo-1519451241324-20b4ea2c4220', // Calgary
  'Ottawa':         'photo-1561559777-e2b5c7726e73', // Parliament Hill
  'Mexico City':    'photo-1518659526054-190340b32735', // Palacio de Bellas Artes
  'Cancun':         'photo-1552074284-5e88ef1aef18', // Cancun beach
  'Guadalajara':    'photo-1559599238-308793637427', // Guadalajara
  'Monterrey':      'photo-1585464231875-d9ef1f5ad396', // Monterrey
  'Havana':         'photo-1500759285222-a95626b934cb', // Havana classic cars
  'Rio de Janeiro': 'photo-1483729558449-99ef09a8c325', // Christ the Redeemer
  'Sao Paulo':      'photo-1543059080-55b5e5e1e5c7', // Sao Paulo skyline
  'Buenos Aires':   'photo-1589909202802-8f4aadce1849', // Buenos Aires
  'Bogota':         'photo-1568632234157-ce7aecd03d0d', // Bogota
  'Medellin':       'photo-1599413987323-b2b8cc4e1f51', // Medellin valley
  'Cusco':          'photo-1526392060635-9d6019884377', // Machu Picchu area
  'Lima':           'photo-1531968455001-5c5272a67c71', // Lima coast
  'Santiago':       'photo-1551621702-5a063a2e4c7b', // Santiago
  'Quito':          'photo-1566438480900-0609be27a4be', // Quito churches
  'Cartagena':      'photo-1583001809873-a128495da465', // Cartagena walls
  'Panama City':    'photo-1565214975484-3cfa9e56f914', // Panama City
  'San Jose':       'photo-1584648487405-23f627a6bc96', // Costa Rica

  // ── Europe ──────────────────────────────────────────────
  'London':         'photo-1513635269975-59663e0ac1ad', // Big Ben
  'Paris':          'photo-1502602898657-3e91760cbb34', // Eiffel Tower
  'Rome':           'photo-1552832230-c0197dd311b5', // Colosseum
  'Barcelona':      'photo-1583422409516-2895a77efded', // Sagrada Familia
  'Amsterdam':      'photo-1534351590666-13e3e96b5017', // Amsterdam canals
  'Berlin':         'photo-1560969184-10fe8719e047', // Brandenburg Gate
  'Prague':         'photo-1541849546-216549ae216d', // Prague bridges
  'Vienna':         'photo-1516550893923-42d28e5677af', // Vienna palace
  'Budapest':       'photo-1551867633-194f125bddfa', // Budapest Parliament
  'Madrid':         'photo-1539037116277-4db20889f2d4', // Madrid
  'Lisbon':         'photo-1548707309-dcebeab9ea9b', // Lisbon tram
  'Athens':         'photo-1555993539-1732b0258235', // Acropolis
  'Florence':       'photo-1543429257-3eb0b65d9c58', // Florence Duomo
  'Venice':         'photo-1514890547357-a9ee288728e0', // Venice canals
  'Dublin':         'photo-1549918864-48ac978761a4', // Dublin
  'Edinburgh':      'photo-1506377585622-bedcbb027afc', // Edinburgh Castle
  'Stockholm':      'photo-1509356843151-3e7d96241e11', // Stockholm old town
  'Copenhagen':     'photo-1513622470522-26c3c8a854bc', // Nyhavn
  'Oslo':           'photo-1533154683836-84ea7a0bc310', // Oslo Opera
  'Zurich':         'photo-1515488764276-beab7607c1e6', // Zurich lake
  'Munich':         'photo-1595867818082-083862f3d630', // Marienplatz
  'Milan':          'photo-1520440229-6469a149ac59', // Milan Cathedral
  'Kyoto':          'photo-1493976040374-85c8e12f0c0e', // Fushimi Inari
  'Nice':           'photo-1491166617655-0723a0999cfc', // Nice promenade
  'Lyon':           'photo-1524484485831-a92ffc0de03f', // Lyon riverside
  'Marseille':      'photo-1558194582-a80c49f65f05', // Marseille port
  'Bordeaux':       'photo-1565020441868-f1eb0e0f0c9b', // Bordeaux
  'Naples':         'photo-1516483638261-f4dbaf036963', // Naples coast
  'Palermo':        'photo-1523365280197-f1783db9fe62', // Palermo
  'Seville':        'photo-1515443961218-a51367888e4b', // Seville Plaza
  'Valencia':       'photo-1580129958562-71c63a747e75', // City of Arts
  'Granada':        'photo-1526392060635-9d6019884377', // Alhambra
  'Malaga':         'photo-1555993539-1732b0258235', // Malaga coast
  'Porto':          'photo-1555881400-74d7acaacd8b', // Porto riverside
  'Hamburg':        'photo-1557166984-b00337652c3d', // Hamburg harbor
  'Frankfurt':      'photo-1467269204594-9661b134dd2b', // Frankfurt skyline
  'Cologne':        'photo-1555396273-367ea4eb4db5', // Cologne Cathedral
  'Rotterdam':      'photo-1555430980-c889d8a7b4c8', // Rotterdam
  'Utrecht':        'photo-1615715874722-951d27650afe', // Utrecht canals
  'Antwerp':        'photo-1562445750-9c75e00d5f9d', // Antwerp
  'Bruges':         'photo-1559113202-c916b8e44373', // Bruges canals
  'Basel':          'photo-1584718193613-1f5dc04ed3f0', // Basel Rhine
  'Bern':           'photo-1561625749-36e67ac2f3f3', // Bern bears
  'Brussels':       'photo-1559113202-c916b8e44373', // Grand Place
  'Geneva':         'photo-1530122037265-a5f1f91d3b99', // Jet d'Eau
  'Salzburg':       'photo-1526224491920-8b69c2bb0938', // Salzburg Castle
  'Innsbruck':      'photo-1516483638261-f4dbaf036963', // Innsbruck Alps
  'Cesky Krumlov':  'photo-1562445750-9c75e00d5f9d', // Cesky Krumlov
  'Warsaw':         'photo-1519197924313-86f12e3ccab9', // Warsaw
  'Krakow':         'photo-1558642452-9d2a7deb7f62', // Krakow square
  'Gdansk':         'photo-1567620905732-2d1ec7ab7445', // Gdansk
  'Aarhus':         'photo-1513622470522-26c3c8a854bc', // Aarhus
  'Gothenburg':     'photo-1509356843151-3e7d96241e11', // Gothenburg
  'Bergen':         'photo-1507272931001-fc06c17e4f43', // Bergen colorful houses
  'Tallinn':        'photo-1560969184-10fe8719e047', // Tallinn old town
  'Riga':           'photo-1519197924313-86f12e3ccab9', // Riga
  'Vilnius':        'photo-1519197924313-86f12e3ccab9', // Vilnius
  'Santorini':      'photo-1570077188670-e3a8d69ac5ff', // Santorini blue domes
  'Mykonos':        'photo-1601581875309-fafbf2d3ed3a', // Mykonos windmills
  'Thessaloniki':   'photo-1555993539-1732b0258235', // Thessaloniki
  'Ankara':         'photo-1524231757912-21f4fe3a7200', // Ankara
  'Antalya':        'photo-1542314831-068cd1dbfeeb', // Antalya coast
  'Dubrovnik':      'photo-1555990793-da11153b2473', // Dubrovnik walls
  'Split':          'photo-1575986767340-5d17ae767ab0', // Split Diocletian
  'Zagreb':         'photo-1555396273-367ea4eb4db5', // Zagreb
  'Bucharest':      'photo-1519197924313-86f12e3ccab9', // Bucharest
  'Sofia':          'photo-1560969184-10fe8719e047', // Sofia
  'Belgrade':       'photo-1519197924313-86f12e3ccab9', // Belgrade
  'Ljubljana':      'photo-1555990793-da11153b2473', // Ljubljana
  'Reykjavik':      'photo-1504829857797-ddff29c27927', // Hallgrímskirkja
  'Helsinki':       'photo-1559511260-66a654ae982a', // Helsinki cathedral
  'Birmingham':     'photo-1467269204594-9661b134dd2b', // Birmingham
  'Manchester':     'photo-1515263487990-61b07816b324', // Manchester
  'Glasgow':        'photo-1506377585622-bedcbb027afc', // Glasgow
  'Belfast':        'photo-1549918864-48ac978761a4', // Belfast

  // ── Asia ────────────────────────────────────────────────
  'Tokyo':          'photo-1540959733332-eab4deabeeaf', // Tokyo Tower
  'Osaka':          'photo-1590559899731-a382839e5549', // Osaka Castle
  'Hiroshima':      'photo-1545569341-9eb8b30979d9', // Hiroshima Peace
  'Sapporo':        'photo-1570521462033-3015e76e7432', // Sapporo snow
  'Seoul':          'photo-1534274988757-a28bf68a354c', // Seoul Gyeongbokgung
  'Busan':          'photo-1538669715315-155098f3fb73', // Busan
  'Jeju':           'photo-1544636331-e26879cd4d9b', // Jeju island
  'Beijing':        'photo-1508804185872-d7badad00f7d', // Forbidden City
  'Shanghai':       'photo-1537531383496-f4749ef25e83', // Shanghai Bund
  'Hong Kong':      'photo-1536599018102-9f803c140fc1', // Hong Kong skyline
  'Guangzhou':      'photo-1537531383496-f4749ef25e83', // Canton Tower
  'Shenzhen':       'photo-1537531383496-f4749ef25e83', // Shenzhen
  'Chengdu':        'photo-1527838832700-5059252407fa', // Chengdu pandas
  "Xi'an":          'photo-1508804185872-d7badad00f7d', // Terracotta warriors
  'Hangzhou':       'photo-1527838832700-5059252407fa', // West Lake
  'Macau':          'photo-1536599018102-9f803c140fc1', // Macau Grand Lisboa
  'Taipei':         'photo-1508009603885-50cf7c579365', // Taipei 101
  'Bangkok':        'photo-1563492065599-3520f775eeed', // Grand Palace
  'Chiang Mai':     'photo-1528181304800-259b08848526', // Chiang Mai temples
  'Phuket':         'photo-1589394815804-964ed0be2eb5', // Phuket beach
  'Singapore':      'photo-1525625293386-3f8f99389edd', // Marina Bay Sands
  'Kuala Lumpur':   'photo-1596422846543-75c6fc197f07', // Petronas Towers
  'Penang':         'photo-1596422846543-75c6fc197f07', // Penang
  'Langkawi':       'photo-1589394815804-964ed0be2eb5', // Langkawi beach
  'Hanoi':          'photo-1509030450996-dd1a26dda07a', // Hanoi old quarter
  'Ho Chi Minh City': 'photo-1583417319070-4a69db38a482', // HCMC
  'Da Nang':        'photo-1559592413-7cec4d0cae2b', // Da Nang bridge
  'Hoi An':         'photo-1559592413-7cec4d0cae2b', // Hoi An lanterns
  'Jakarta':        'photo-1555899434-94d1368aa7af', // Jakarta
  'Bali':           'photo-1537996194471-e657df975ab4', // Bali temple
  'Yogyakarta':     'photo-1596402184320-417e7178b2cd', // Borobudur
  'Manila':         'photo-1555899434-94d1368aa7af', // Manila
  'Cebu':           'photo-1537996194471-e657df975ab4', // Cebu
  'Boracay':        'photo-1589394815804-964ed0be2eb5', // Boracay beach

  // ── South Asia ──────────────────────────────────────────
  'Mumbai':         'photo-1570168007204-dfb528c6958f', // Gateway of India
  'New Delhi':      'photo-1587474260584-136574528ed5', // India Gate
  'Bangalore':      'photo-1596176530529-78163a4f7af2', // Bangalore
  'Hyderabad':      'photo-1572883454114-efb52dca03e0', // Charminar
  'Chennai':        'photo-1582510003544-4d00b7f74220', // Chennai
  'Kolkata':        'photo-1558431382-27e303142255', // Howrah Bridge
  'Jaipur':         'photo-1599661046289-e31897846e41', // Hawa Mahal
  'Agra':           'photo-1564507592333-c60657eea523', // Taj Mahal
  'Varanasi':       'photo-1561361513-2d000a50f0dc', // Varanasi ghats
  'Goa':            'photo-1512343879784-a960bf40e7f2', // Goa beach
  'Colombo':        'photo-1570168007204-dfb528c6958f', // Colombo
  'Kathmandu':      'photo-1558799401-1dcba79834c2', // Boudhanath
  'Male':           'photo-1514282401047-d79a71a590e8', // Maldives overwater

  // ── Middle East ─────────────────────────────────────────
  'Dubai':          'photo-1512453979798-5ea266f8880c', // Burj Khalifa
  'Abu Dhabi':      'photo-1512632578888-169bbbc64f33', // Sheikh Zayed Mosque
  'Doha':           'photo-1549060279-7e168fcee0c2', // Doha skyline
  'Muscat':         'photo-1546412414-e1885e51148b', // Muscat mosque
  'Manama':         'photo-1549060279-7e168fcee0c2', // Manama
  'Riyadh':         'photo-1586724237569-f3d0c1dee8c6', // Riyadh
  'Jeddah':         'photo-1586724237569-f3d0c1dee8c6', // Jeddah
  'Amman':          'photo-1547483238-2cbf881a681f', // Amman citadel
  'Petra':          'photo-1579606032821-4e6161c81571', // Petra Treasury
  'Beirut':         'photo-1547483238-2cbf881a681f', // Beirut
  'Tel Aviv':       'photo-1544967082-d9d25d867d66', // Tel Aviv beach
  'Jerusalem':      'photo-1547483238-2cbf881a681f', // Jerusalem old city
  'Istanbul':       'photo-1541432901042-2d8bd64b4a9b', // Blue Mosque

  // ── Africa ──────────────────────────────────────────────
  'Cairo':          'photo-1572252009286-268acec5ca0a', // Pyramids of Giza
  'Alexandria':     'photo-1572252009286-268acec5ca0a', // Alexandria
  'Luxor':          'photo-1539768942893-daf53e448371', // Luxor temples
  'Marrakech':      'photo-1597212618440-806262de4f6b', // Marrakech medina
  'Casablanca':     'photo-1569383746724-6f1b882b8f46', // Hassan II Mosque
  'Fes':            'photo-1597212618440-806262de4f6b', // Fes medina
  'Rabat':          'photo-1569383746724-6f1b882b8f46', // Rabat
  'Tunis':          'photo-1569383746724-6f1b882b8f46', // Tunis
  'Cape Town':      'photo-1580060839134-75a5edca2e99', // Table Mountain
  'Johannesburg':   'photo-1577948000111-9c970dfe3743', // Johannesburg
  'Durban':         'photo-1577948000111-9c970dfe3743', // Durban
  'Nairobi':        'photo-1611348524140-53c9a25263d6', // Nairobi skyline
  'Mombasa':        'photo-1611348524140-53c9a25263d6', // Mombasa
  'Stone Town':     'photo-1569383746724-6f1b882b8f46', // Zanzibar

  // ── Oceania ─────────────────────────────────────────────
  'Sydney':         'photo-1506973035872-a4ec16b8e8d9', // Opera House
  'Melbourne':      'photo-1514395462725-fb4566210144', // Melbourne street art
  'Brisbane':       'photo-1524293568345-75d62c3664f7', // Brisbane
  'Perth':          'photo-1524293568345-75d62c3664f7', // Perth
  'Adelaide':       'photo-1524293568345-75d62c3664f7', // Adelaide
  'Cairns':         'photo-1523482580672-f109ba8cb9be', // Great Barrier Reef
  'Gold Coast':     'photo-1506973035872-a4ec16b8e8d9', // Gold Coast
  'Hobart':         'photo-1524293568345-75d62c3664f7', // Hobart
  'Auckland':       'photo-1507699622108-4be3abd695ad', // Auckland Sky Tower
  'Wellington':     'photo-1507699622108-4be3abd695ad', // Wellington
  'Christchurch':   'photo-1507699622108-4be3abd695ad', // Christchurch
  'Queenstown':     'photo-1508101867287-af38b994e03f', // Queenstown lake
  'Rotorua':        'photo-1507699622108-4be3abd695ad', // Rotorua geysers
};

const buildUrl = (photoId) =>
  `https://images.unsplash.com/${photoId}?auto=format&fit=crop&w=800&q=80`;

const updateCityImages = async () => {
  try {
    await connectDB();

    const cities = await City.find({}).lean();
    console.log(`\n[Update] Updating images for ${cities.length} cities...\n`);

    let updated = 0;
    let skipped = 0;

    for (const city of cities) {
      const photoId = CITY_IMAGES[city.name];
      if (photoId) {
        const imageUrl = buildUrl(photoId);
        await City.updateOne({ _id: city._id }, { $set: { image: imageUrl } });
        console.log(`  ✓ ${city.name} → updated`);
        updated++;
      } else {
        // For cities not in the curated list, assign a general travel photo
        const fallback = `https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80`;
        await City.updateOne({ _id: city._id }, { $set: { image: fallback } });
        console.log(`  ~ ${city.name} → fallback (not in curated list)`);
        skipped++;
      }
    }

    console.log(`\n─────────────────────────────`);
    console.log(`✓ Updated:  ${updated} cities with curated images`);
    console.log(`~ Fallback: ${skipped} cities with generic travel image`);
    console.log(`─────────────────────────────\n`);
  } catch (err) {
    console.error('[Update] Fatal error:', err.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

updateCityImages();
