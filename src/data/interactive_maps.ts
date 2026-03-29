

export interface MapIndexEntry {
  id: string;
  key: string;
  filename: string;
  name: string;
  normalizedName: string;
  nameId: string;
  wiki: string;
  description: string;
  players: string;
  raidDuration: number;
  enemies: string[];
}

export const mapIndex: MapIndexEntry[] = [
  {
    id: '5714dc692459777137212e12',
    key: 'streets-of-tarkov',
    filename: 'streets-of-tarkov',
    name: '塔科夫街区',
    normalizedName: 'streets-of-tarkov',
    nameId: 'TarkovStreets',
    wiki: 'https://escapefromtarkov.fandom.com/wiki/Streets_of_Tarkov',
    description: '塔科夫市中心拥有所有诸如银行，购物中心和旅馆等大都市需要的便利设施。',
    players: '12-16',
    raidDuration: 50,
    enemies: [
      'Scav',
      '狙击手',
      'Kollontay',
      ' 保镖 (Assault)',
      ' 保镖 (Security)',
      'Kaban',
      'Kaban Guard',
      ' 保镖 (Close1)',
      ' 保镖 (Close2)',
    ],
  },
  {
    id: '653e6760052c01c1c805532f',
    key: 'ground-zero',
    filename: 'ground-zero',
    name: '中心区',
    normalizedName: 'ground-zero',
    nameId: 'Sandbox',
    wiki: 'https://escapefromtarkov.fandom.com/wiki/Ground_Zero',
    description: '塔科夫的经济中心，也是TerraGroup的总部驻地。这里就是一切开始的地方。',
    players: '9-10',
    raidDuration: 35,
    enemies: [],
  },
  {
    id: '65b8d6f5cdde2479cb2a3125',
    key: 'ground-zero',
    filename: 'ground-zero-2',
    name: '中心区 21+',
    normalizedName: 'ground-zero-21',
    nameId: 'Sandbox_high',
    wiki: 'https://escapefromtarkov.fandom.com/wiki/Ground_Zero',
    description: 'The business center of Tarkov. This is where TerraGroup was headquartered. This is where it all began.',
    players: '9-12',
    raidDuration: 35,
    enemies: [
      'Kollontay',
      ' 保镖 (Security)',
      '邪教徒牧师',
      '邪教徒战士',
    ],
  },
  {
    id: '56f40101d2720b2a4d8b45d6',
    key: 'customs',
    filename: 'customs',
    name: '海关',
    normalizedName: 'customs',
    nameId: 'bigmap',
    wiki: 'https://escapefromtarkov.fandom.com/wiki/Customs',
    description: '一个位于工厂附近的大型工业园区。此区域设有海关站、燃料储存设施、办公室、宿舍以及其它基础设施。',
    players: '10-12',
    raidDuration: 40,
    enemies: [
      'Death Knight',
      'Big Pipe',
      'Birdeye',
      'Reshala',
      'Reshala Guard',
      '邪教徒牧师',
      '邪教徒战士',
    ],
  },
  {
    id: '55f2d3fd4bdc2d5f408b4567',
    key: 'factory',
    filename: 'factory',
    name: '工厂',
    normalizedName: 'factory',
    nameId: 'factory4_day',
    wiki: 'https://escapefromtarkov.fandom.com/wiki/Factory',
    description: '16 号化工厂的厂区和设施曾被非法租用给 Terra Group 公司。这个工厂在“契约战争”期间成为了 USEC 和 BEAR 双方争夺塔科夫市工业区控制权的激战战场。\n\n随着之后的混乱加剧，工厂变成了幸存的市民、Scav 和各种武装人员的避风港，其中也包括残存的 USEC 和 BEAR 行动人员。',
    players: '5-6',
    raidDuration: 20,
    enemies: [
      'Scav',
      'Tagilla',
    ],
  },
  {
    id: '59fc81d786f774390775787e',
    key: 'factory',
    filename: 'factory-5',
    name: '夜间工厂',
    normalizedName: 'night-factory',
    nameId: 'factory4_night',
    wiki: 'https://escapefromtarkov.fandom.com/wiki/Factory',
    description: '16 号化工厂的厂区和设施曾被非法租用给 Terra Group 公司。这个工厂在“契约战争”期间成为了 USEC 和 BEAR 双方争夺塔科夫市工业区控制权的激战战场。\n\n随着之后的混乱加剧，工厂变成了幸存的市民、Scav 和各种武装人员的避风港，其中也包括残存的 USEC 和 BEAR 行动人员。',
    players: '5-6',
    raidDuration: 25,
    enemies: [
      'Scav',
      'Tagilla',
      '邪教徒牧师',
      '邪教徒战士',
    ],
  },
  {
    id: '5714dbc024597771384a510d',
    key: 'interchange',
    filename: 'interchange',
    name: '立交桥',
    normalizedName: 'interchange',
    nameId: 'Interchange',
    wiki: 'https://escapefromtarkov.fandom.com/wiki/Interchange',
    description: '南部立交桥是城市交通系统的关键点。这个战略要地连接着塔科夫的海港区和市郊工业区。位于立交桥区域中心的是一个巨型 ULTRA 购物中心，曾被用作 EMERCOM 疏散行动的主基地。',
    players: '10-14',
    raidDuration: 40,
    enemies: [
      'Killa',
    ],
  },
  {
    id: '5b0fc42d86f7744a585f9105',
    key: 'the-lab',
    filename: 'the-lab',
    name: '实验室',
    normalizedName: 'the-lab',
    nameId: 'laboratory',
    wiki: 'https://escapefromtarkov.fandom.com/wiki/The_Lab',
    description: '错综复杂的Terragroup地下实验室是一个隐藏在塔科夫市中心之下的机密项目。官方从未承认过这个研究中心的存在，但是零散的信息显示，这个研究中心一直用于化学、物理学、生物学及其它高科技领域的研发、测试和模拟。',
    players: '8-10',
    raidDuration: 35,
    enemies: [
      '掠夺者',
    ],
  },
  {
    id: '5704e4dad2720bb55b8b4567',
    key: 'lighthouse',
    filename: 'lighthouse',
    name: '灯塔',
    normalizedName: 'lighthouse',
    nameId: 'Lighthouse',
    wiki: 'https://escapefromtarkov.fandom.com/wiki/Lighthouse',
    description: '位于达尔尼海角的灯塔是通往塔科夫的路上极为重要的一处战略据点。在契约战争期间，灯塔曾是USEC们的主要登陆地点，同时也作为他们的行动基地。冲突结束之后，Scav们看中了这里，直到灯塔的老东家们回到这里，这些人打算驻扎在塔科夫，建立属于他们的新秩序。',
    players: '10-12',
    raidDuration: 40,
    enemies: [
      'Zryachiy',
      'Zryachiy Guard',
      'Death Knight',
      'Big Pipe',
      'Birdeye',
      '游荡者',
    ],
  },
  {
    id: '5704e5fad2720bc05b8b4567',
    key: 'reserve',
    filename: 'reserve',
    name: '储备站',
    normalizedName: 'reserve',
    nameId: 'RezervBase',
    wiki: 'https://escapefromtarkov.fandom.com/wiki/Reserve',
    description: '根据都市传说，这个联邦国家储备局的秘密基地有足够维持多年的物资，包括食物、药物和其他资源，足以在全面核战争中生存下来。',
    players: '9-11',
    raidDuration: 40,
    enemies: [
      'Scav',
      'Glukhar',
      'Glukhar Guard (Assault)',
      'Glukhar Guard (Security)',
      'Glukhar Guard (Scout)',
      '掠夺者',
    ],
  },
  {
    id: '5704e554d2720bac5b8b456e',
    key: 'shoreline',
    filename: 'shoreline',
    name: '海岸线',
    normalizedName: 'shoreline',
    nameId: 'Shoreline',
    wiki: 'https://escapefromtarkov.fandom.com/wiki/Shoreline',
    description: '临近港口的海岸线占塔科夫郊区的很大一部分。 \n\n这个区域包含被废弃的村庄、现代化私人住宅、遍布海岸线的船运设施、加油站、气象观测站、通讯基站及其他商业设施。海岸线的核心区域是“Azure Coast”疗养院。这个疗养院由数栋奢华的建筑组成，由附近的水电站提供独立供电。为了准备塔科夫港口的撤离行动，这里曾被TerraGroup及其相关部门用作临时员工宿舍。',
    players: '10-14',
    raidDuration: 45,
    enemies: [
      'Death Knight',
      'Big Pipe',
      'Birdeye',
      'Sanitar',
      'Sanitar Guard',
      '邪教徒牧师',
      '邪教徒战士',
    ],
  },
  {
    id: '5704e3c2d2720bac5b8b4567',
    key: 'woods',
    filename: 'woods',
    name: '森林',
    normalizedName: 'woods',
    nameId: 'Woods',
    wiki: 'https://escapefromtarkov.fandom.com/wiki/Woods',
    description: 'Priozersk自然保护区最近被西北联邦行政区纳入特区野生动物保护区。',
    players: '10-14',
    raidDuration: 40,
    enemies: [
      'Death Knight',
      'Big Pipe',
      'Birdeye',
      'Shturman',
      'Shturman Guard',
      '邪教徒牧师',
      '邪教徒战士',
    ],
  },
];

const mapDataCache = new Map<string, InteractiveMap.Data>();

export async function loadMapData(id: string): Promise<InteractiveMap.Data | null> {
  if (mapDataCache.has(id)) {
    return mapDataCache.get(id);
  }

  const entry = mapIndex.find((m) => m.id === id);
  if (!entry) return null;

  try {
    const module = await import(`./maps/${entry.filename}.json`);
    const data = module.default;
    mapDataCache.set(id, data);
    return data;
  } catch (err) {
    console.error(`Failed to load map data for ${entry.filename}:`, err);
    return null;
  }
}

export function preloadMapData(id: string): void {
  if (!mapDataCache.has(id)) {
    loadMapData(id);
  }
}

export function clearMapDataCache(id?: string): void {
  if (id) {
    mapDataCache.delete(id);
  } else {
    mapDataCache.clear();
  }
}

export default mapIndex;
