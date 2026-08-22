import 'dotenv/config';
import mongoose from 'mongoose';
import connectDB from '../src/config/db.js';
import City from '../src/models/City.js';

const ALIAS_MAP = {
  'Greater London': 'photo-1513635269975-59663e0ac1ad',
  'City of Edinburgh': 'photo-1506377585622-bedcbb027afc',
  'Autonomous City of Buenos Aires': 'photo-1589909202802-8f4aadce1849',
  'Washington': 'photo-1501466044931-62695aada8e9',
  'Quebec': 'photo-1558347623-07b04d72a03e',
  'São Paulo': 'photo-1543059080-55b5e5e1e5c7',
  'Medellín': 'photo-1599413987323-b2b8cc4e1f51',
  'Cuzco': 'photo-1526392060635-9d6019884377',
  'Cancún': 'photo-1552074284-5e88ef1aef18',
  'Málaga': 'photo-1555993539-1732b0258235',
  'Český Krumlov': 'photo-1562445750-9c75e00d5f9d',
  'Thira Municipal Unit': 'photo-1570077188670-e3a8d69ac5ff',
  'City of Zagreb': 'photo-1555396273-367ea4eb4db5',
  'Guangzhou City': 'photo-1537531383496-f4749ef25e83',
  'Hangzhou City': 'photo-1527838832700-5059252407fa',
  'Phuket City Municipality': 'photo-1589394815804-964ed0be2eb5',
  'Hà Nội': 'photo-1509030450996-dd1a26dda07a',
  'Đà Nẵng': 'photo-1559592413-7cec4d0cae2b',
  'Special Capital Region of Jakarta': 'photo-1555899434-94d1368aa7af',
  'New Taipei': 'photo-1508009603885-50cf7c579365',
  'Cebu City': 'photo-1537996194471-e657df975ab4',
  'Malay': 'photo-1589394815804-964ed0be2eb5',
  'Bengaluru': 'photo-1596176530529-78163a4f7af2',
  'Kathmandu Metropolitan City': 'photo-1558799401-1dcba79834c2',
  'Malé': 'photo-1514282401047-d79a71a590e8',
  'Tel-Aviv': 'photo-1544967082-d9d25d867d66',
  'Marrakesh': 'photo-1597212618440-806262de4f6b',
  'Fez': 'photo-1597212618440-806262de4f6b',
  'Mkunazini': 'photo-1569383746724-6f1b882b8f46',
};

const buildUrl = (id) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=800&q=80`;

const fixAliases = async () => {
  await connectDB();
  let fixed = 0;
  for (const [name, photoId] of Object.entries(ALIAS_MAP)) {
    const res = await City.updateOne({ name }, { $set: { image: buildUrl(photoId) } });
    if (res.modifiedCount > 0) { console.log('  ✓ Fixed:', name); fixed++; }
    else { console.log('  ~ Not found:', name); }
  }
  console.log(`\nFixed ${fixed} cities`);
  await mongoose.disconnect();
  process.exit(0);
};

fixAliases();
