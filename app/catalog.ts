export type MoodKey =
  | "calm"
  | "distant"
  | "restart"
  | "light"
  | "warm"
  | "romantic"
  | "cathartic"
  | "exciting"
  | "curious"
  | "angry"
  | "nostalgic"
  | "solitude"
  | "wonder";

export type FilmFeatures = {
  stimulation: 1 | 2 | 3 | 4 | 5;
  pacing: 1 | 2 | 3 | 4 | 5;
  emotionalWeight: 1 | 2 | 3 | 4 | 5;
  conflictLevel: 1 | 2 | 3 | 4 | 5;
  accessibility: 1 | 2 | 3 | 4 | 5;
};

export type Film = {
  id?: string;
  title: string;
  original: string;
  year: string;
  country: string;
  duration: string;
  quote: string;
  reason: string;
  caution: string;
  tags: string[];
  moods: MoodKey[];
  poster: string;
  genres?: string[];
  synopsis?: string;
  rating?: number;
  popularity?: number;
  features?: FilmFeatures;
  dataSource?: "curated-metadata" | "imdb-dataset";
};

type FilmSeed = readonly [
  title: string,
  original: string,
  year: string,
  country: string,
  duration: string,
];

type CatalogGroup = {
  moods: MoodKey[];
  tags: string[];
  features: FilmFeatures;
  note: string;
  reason: string;
  caution: string;
  films: FilmSeed[];
};

const catalogGroups: CatalogGroup[] = [
  {
    moods: ["calm", "warm"],
    tags: ["日常", "低刺激", "生活感", "慢节奏"],
    features: { stimulation: 1, pacing: 2, emotionalWeight: 2, conflictLevel: 1, accessibility: 4 },
    note: "让日常细节慢慢显影，电影不催促你得出答案。",
    reason: "它把注意力放在生活的纹理与人物之间的距离上，适合想安静下来、又希望保留一点温度的晚上。",
    caution: "节奏舒缓，戏剧冲突较少，更适合愿意慢慢进入的时候。",
    films: [
      ["东京物语", "Tokyo Story", "1953", "日本", "136 分钟"],
      ["晚春", "Late Spring", "1949", "日本", "108 分钟"],
      ["秋刀鱼之味", "An Autumn Afternoon", "1962", "日本", "113 分钟"],
      ["步履不停", "Still Walking", "2008", "日本", "115 分钟"],
      ["澄沙之味", "Sweet Bean", "2015", "日本", "113 分钟"],
      ["幸福的面包", "Bread of Happiness", "2012", "日本", "114 分钟"],
      ["南极料理人", "The Chef of South Polar", "2009", "日本", "125 分钟"],
      ["河畔须臾", "Riverside Mukolitta", "2021", "日本", "120 分钟"],
      ["山中的汤姆先生", "Tom-san in the Countryside", "2015", "日本", "117 分钟"],
      ["眼镜", "Megane", "2007", "日本", "106 分钟"],
      ["海鸥食堂", "Kamome Diner", "2006", "日本 / 芬兰", "102 分钟"],
      ["人生果实", "Life Is Fruity", "2017", "日本", "91 分钟"],
      ["春宵苦短，少女前进吧！", "Night Is Short, Walk on Girl", "2017", "日本", "92 分钟"],
      ["在京都小住", "Chotto Kyoto ni Sundemita", "2019", "日本", "93 分钟"],
      ["记我的母亲", "Chronicle of My Mother", "2011", "日本", "118 分钟"],
    ],
  },
  {
    moods: ["light", "warm"],
    tags: ["轻松", "明亮", "幽默", "好进入"],
    features: { stimulation: 2, pacing: 4, emotionalWeight: 1, conflictLevel: 1, accessibility: 5 },
    note: "轻盈不是回避现实，而是把呼吸的空间重新留出来。",
    reason: "叙事清楚、人物有亲和力，能较快进入状态。适合想松一口气，又不想只看热闹的时候。",
    caution: "整体偏明亮，期待复杂沉重主题时可能会觉得不够深入。",
    films: [
      ["雨中曲", "Singin' in the Rain", "1952", "美国", "103 分钟"],
      ["摩登时代", "Modern Times", "1936", "美国", "87 分钟"],
      ["罗马假日", "Roman Holiday", "1953", "美国", "118 分钟"],
      ["怦然心动", "Flipped", "2010", "美国", "90 分钟"],
      ["实习生", "The Intern", "2015", "美国", "121 分钟"],
      ["好好先生", "Yes Man", "2008", "美国 / 英国", "104 分钟"],
      ["欢乐好声音", "Sing", "2016", "美国", "108 分钟"],
      ["疯狂动物城", "Zootopia", "2016", "美国", "108 分钟"],
      ["落魄大厨", "Chef", "2014", "美国", "114 分钟"],
      ["伴娘", "Bridesmaids", "2011", "美国", "125 分钟"],
      ["博物馆奇妙夜", "Night at the Museum", "2006", "美国 / 英国", "108 分钟"],
      ["摇滚校园", "School of Rock", "2003", "美国 / 德国", "109 分钟"],
      ["王牌播音员", "Anchorman", "2004", "美国", "94 分钟"],
      ["你好，李焕英", "Hi, Mom", "2021", "中国", "128 分钟"],
      ["人生路不熟", "Godspeed", "2023", "中国", "100 分钟"],
    ],
  },
  {
    moods: ["distant", "wonder", "restart"],
    tags: ["远方", "旅行", "公路", "开阔感"],
    features: { stimulation: 3, pacing: 3, emotionalWeight: 2, conflictLevel: 2, accessibility: 4 },
    note: "换一片风景，也换一种看待当下的距离。",
    reason: "空间变化推动人物重新认识自己，画面与旅程感都很明确。适合想暂时离开熟悉生活、听一个远方故事的时候。",
    caution: "旅程比结论更重要，部分段落会保留停顿与留白。",
    films: [
      ["末路狂花", "Thelma & Louise", "1991", "美国 / 英国", "130 分钟"],
      ["摩托日记", "The Motorcycle Diaries", "2004", "阿根廷 / 美国", "126 分钟"],
      ["荒野生存", "Into the Wild", "2007", "美国", "148 分钟"],
      ["朝圣之路", "The Way", "2010", "美国 / 西班牙", "123 分钟"],
      ["菊次郎的夏天", "Kikujiro", "1999", "日本", "122 分钟"],
      ["练习曲", "Island Etude", "2006", "中国台湾", "108 分钟"],
      ["转山", "Kora", "2011", "中国", "90 分钟"],
      ["走出非洲", "Out of Africa", "1985", "美国", "161 分钟"],
      ["澳洲乱世情", "Australia", "2008", "澳大利亚 / 美国", "165 分钟"],
      ["沙漠之花", "Desert Flower", "2009", "英国 / 德国", "120 分钟"],
      ["少年斯派维的奇异旅行", "The Young and Prodigious T.S. Spivet", "2013", "法国 / 加拿大", "105 分钟"],
      ["追鹰日记", "Brothers of the Wind", "2015", "奥地利", "98 分钟"],
      ["沙漠驼影", "Tracks", "2013", "澳大利亚", "112 分钟"],
      ["回来的路", "The Way Back", "2010", "美国", "133 分钟"],
      ["伴你高飞", "Fly Away Home", "1996", "美国", "107 分钟"],
    ],
  },
  {
    moods: ["restart", "warm"],
    tags: ["重新出发", "成长", "行动力", "希望"],
    features: { stimulation: 2, pacing: 3, emotionalWeight: 2, conflictLevel: 2, accessibility: 4 },
    note: "变化不一定轰轰烈烈，也可以从下一步开始。",
    reason: "人物从受阻到行动的路径清晰，情绪会逐渐打开。适合想重新找回一点方向与推动力的时候。",
    caution: "部分作品的励志结构比较明确，偏好暧昧留白时需留意。",
    films: [
      ["肖申克的救赎", "The Shawshank Redemption", "1994", "美国", "142 分钟"],
      ["阿甘正传", "Forrest Gump", "1994", "美国", "142 分钟"],
      ["当幸福来敲门", "The Pursuit of Happyness", "2006", "美国", "117 分钟"],
      ["心灵捕手", "Good Will Hunting", "1997", "美国", "126 分钟"],
      ["死亡诗社", "Dead Poets Society", "1989", "美国", "128 分钟"],
      ["叫我第一名", "Front of the Class", "2008", "美国", "95 分钟"],
      ["国王的演讲", "The King's Speech", "2010", "英国 / 美国", "118 分钟"],
      ["隐藏人物", "Hidden Figures", "2016", "美国", "127 分钟"],
      ["垫底辣妹", "Flying Colors", "2015", "日本", "117 分钟"],
      ["跳出我天地", "Billy Elliot", "2000", "英国", "110 分钟"],
      ["灵魂冲浪人", "Soul Surfer", "2011", "美国", "106 分钟"],
      ["卡特教练", "Coach Carter", "2005", "美国 / 德国", "136 分钟"],
      ["点球成金", "Moneyball", "2011", "美国", "133 分钟"],
      ["追梦赤子心", "Rudy", "1993", "美国", "114 分钟"],
      ["永不妥协", "Erin Brockovich", "2000", "美国", "131 分钟"],
    ],
  },
  {
    moods: ["romantic", "warm", "nostalgic"],
    tags: ["爱情", "心动", "关系", "余韵"],
    features: { stimulation: 2, pacing: 3, emotionalWeight: 2, conflictLevel: 2, accessibility: 4 },
    note: "靠近一个人，也是在重新辨认自己。",
    reason: "关系中的试探、靠近与错过都有具体质感。适合想看真实心动，而不是只看爱情标签的时候。",
    caution: "并非所有关系都有圆满结论，部分作品的后劲较长。",
    films: [
      ["爱在日落黄昏时", "Before Sunset", "2004", "美国 / 法国", "80 分钟"],
      ["爱在午夜降临前", "Before Midnight", "2013", "美国 / 希腊", "109 分钟"],
      ["甜蜜蜜", "Comrades: Almost a Love Story", "1996", "中国香港", "118 分钟"],
      ["秋天的童话", "An Autumn's Tale", "1987", "中国香港", "98 分钟"],
      ["北京遇上西雅图", "Finding Mr. Right", "2013", "中国", "123 分钟"],
      ["诺丁山", "Notting Hill", "1999", "英国 / 美国", "124 分钟"],
      ["恋恋笔记本", "The Notebook", "2004", "美国", "123 分钟"],
      ["卡萨布兰卡", "Casablanca", "1942", "美国", "102 分钟"],
      ["傲慢与偏见", "Pride & Prejudice", "2005", "英国 / 法国", "129 分钟"],
      ["赎罪", "Atonement", "2007", "英国 / 法国", "123 分钟"],
      ["五尺天涯", "Five Feet Apart", "2019", "美国", "116 分钟"],
      ["你的名字。", "Your Name.", "2016", "日本", "106 分钟"],
      ["蓝色情人节", "Blue Valentine", "2010", "美国", "112 分钟"],
      ["爱乐之城", "La La Land", "2016", "美国", "128 分钟"],
      ["情书", "Love Letter", "1995", "日本", "117 分钟"],
    ],
  },
  {
    moods: ["cathartic", "warm"],
    tags: ["情绪释放", "亲情", "现实感", "后劲"],
    features: { stimulation: 2, pacing: 3, emotionalWeight: 5, conflictLevel: 3, accessibility: 3 },
    note: "让情绪有出口，但不把眼泪当作唯一目的。",
    reason: "情感建立在具体人物与处境上，释放感来自理解过程。适合心里有积压、愿意认真看完一个故事的时候。",
    caution: "包含疾病、失去或现实困境等内容，情绪状态较脆弱时请谨慎选择。",
    films: [
      ["寻梦环游记", "Coco", "2017", "美国", "105 分钟"],
      ["忠犬八公的故事", "Hachi: A Dog's Tale", "2009", "美国 / 英国", "93 分钟"],
      ["美丽人生", "Life Is Beautiful", "1997", "意大利", "116 分钟"],
      ["辛德勒的名单", "Schindler's List", "1993", "美国", "195 分钟"],
      ["我不是药神", "Dying to Survive", "2018", "中国", "117 分钟"],
      ["送你一朵小红花", "A Little Red Flower", "2020", "中国", "128 分钟"],
      ["滚蛋吧！肿瘤君", "Go Away Mr. Tumor", "2015", "中国", "128 分钟"],
      ["唐山大地震", "Aftershock", "2010", "中国", "135 分钟"],
      ["素媛", "Hope", "2013", "韩国", "123 分钟"],
      ["7号房的礼物", "Miracle in Cell No. 7", "2013", "韩国", "127 分钟"],
      ["房间", "Room", "2015", "爱尔兰 / 加拿大", "118 分钟"],
      ["何以为家", "Capernaum", "2018", "黎巴嫩", "126 分钟"],
      ["狩猎", "The Hunt", "2012", "丹麦 / 瑞典", "115 分钟"],
      ["告白", "Confessions", "2010", "日本", "106 分钟"],
      ["亲爱的", "Dearest", "2014", "中国", "130 分钟"],
    ],
  },
  {
    moods: ["exciting", "curious"],
    tags: ["高能", "类型片", "推进快", "沉浸"],
    features: { stimulation: 5, pacing: 5, emotionalWeight: 3, conflictLevel: 5, accessibility: 5 },
    note: "把注意力交给银幕，让节奏带你向前。",
    reason: "目标清楚、场面调度和叙事推进都有力度。适合有点无聊，想迅速进入一个高能世界的时候。",
    caution: "声音、冲突或紧张感较强，睡前和低刺激需求下不建议优先选择。",
    films: [
      ["碟中谍4", "Mission: Impossible – Ghost Protocol", "2011", "美国", "133 分钟"],
      ["盗梦空间", "Inception", "2010", "美国 / 英国", "148 分钟"],
      ["黑客帝国", "The Matrix", "1999", "美国 / 澳大利亚", "136 分钟"],
      ["速度与激情5", "Fast Five", "2011", "美国", "130 分钟"],
      ["极盗车神", "Baby Driver", "2017", "英国 / 美国", "113 分钟"],
      ["王牌特工：特工学院", "Kingsman: The Secret Service", "2014", "英国 / 美国", "129 分钟"],
      ["明日边缘", "Edge of Tomorrow", "2014", "美国 / 加拿大", "113 分钟"],
      ["源代码", "Source Code", "2011", "美国 / 加拿大", "93 分钟"],
      ["火星救援", "The Martian", "2015", "美国 / 英国", "144 分钟"],
      ["地心引力", "Gravity", "2013", "英国 / 美国", "91 分钟"],
      ["敦刻尔克", "Dunkirk", "2017", "英国 / 美国", "106 分钟"],
      ["1917", "1917", "2019", "英国 / 美国", "119 分钟"],
      ["壮志凌云2：独行侠", "Top Gun: Maverick", "2022", "美国", "131 分钟"],
      ["逃出绝命镇", "Get Out", "2017", "美国", "104 分钟"],
      ["寂静之地", "A Quiet Place", "2018", "美国", "90 分钟"],
    ],
  },
  {
    moods: ["curious", "exciting"],
    tags: ["推理", "悬念", "线索", "反转"],
    features: { stimulation: 3, pacing: 4, emotionalWeight: 3, conflictLevel: 4, accessibility: 3 },
    note: "让好奇心接管两个小时，跟着线索继续看下去。",
    reason: "信息释放有层次，线索能够被追踪，谜面之外仍有人物与主题。适合想动脑、又不想面对无效复杂的时候。",
    caution: "需要持续注意细节；疲惫或容易被剧透时，建议换一个状态再看。",
    films: [
      ["十二怒汉", "12 Angry Men", "1957", "美国", "96 分钟"],
      ["七宗罪", "Se7en", "1995", "美国", "127 分钟"],
      ["记忆碎片", "Memento", "2000", "美国", "113 分钟"],
      ["禁闭岛", "Shutter Island", "2010", "美国", "138 分钟"],
      ["看不见的客人", "The Invisible Guest", "2016", "西班牙", "106 分钟"],
      ["控方证人", "Witness for the Prosecution", "1957", "美国", "116 分钟"],
      ["东方快车谋杀案", "Murder on the Orient Express", "2017", "美国 / 英国", "114 分钟"],
      ["彗星来的那一夜", "Coherence", "2013", "美国 / 英国", "89 分钟"],
      ["前目的地", "Predestination", "2014", "澳大利亚", "97 分钟"],
      ["恐怖游轮", "Triangle", "2009", "英国 / 澳大利亚", "99 分钟"],
      ["蝴蝶效应", "The Butterfly Effect", "2004", "美国 / 加拿大", "113 分钟"],
      ["万能钥匙", "The Skeleton Key", "2005", "美国 / 德国", "104 分钟"],
      ["目击者之追凶", "Who Killed Cock Robin", "2017", "中国台湾", "117 分钟"],
      ["误杀", "Sheep Without a Shepherd", "2019", "中国", "112 分钟"],
      ["消失的爱人", "Gone Girl", "2014", "美国", "149 分钟"],
    ],
  },
  {
    moods: ["nostalgic", "warm", "cathartic"],
    tags: ["旧时光", "成长", "记忆", "故乡"],
    features: { stimulation: 2, pacing: 2, emotionalWeight: 4, conflictLevel: 3, accessibility: 3 },
    note: "记忆并不完整，但它会替我们保留当时的光线。",
    reason: "时间、地点与人物关系都有清晰质感。适合想回到从前，或重新看一眼自己从哪里走来的时候。",
    caution: "怀旧感常伴随失去与告别，可能会带来较长余韵。",
    films: [
      ["美国往事", "Once Upon a Time in America", "1984", "美国 / 意大利", "229 分钟"],
      ["牯岭街少年杀人事件", "A Brighter Summer Day", "1991", "中国台湾", "237 分钟"],
      ["一一", "Yi Yi", "2000", "中国台湾 / 日本", "173 分钟"],
      ["童年往事", "A Time to Live, A Time to Die", "1985", "中国台湾", "138 分钟"],
      ["城南旧事", "My Memories of Old Beijing", "1983", "中国", "88 分钟"],
      ["站台", "Platform", "2000", "中国 / 法国", "154 分钟"],
      ["钢的琴", "The Piano in a Factory", "2010", "中国", "107 分钟"],
      ["阳光灿烂的日子", "In the Heat of the Sun", "1994", "中国", "134 分钟"],
      ["芳华", "Youth", "2017", "中国", "136 分钟"],
      ["那些年，我们一起追的女孩", "You Are the Apple of My Eye", "2011", "中国台湾", "110 分钟"],
      ["请以你的名字呼唤我", "Call Me by Your Name", "2017", "意大利 / 法国", "132 分钟"],
      ["八月迷情", "August Rush", "2007", "美国", "114 分钟"],
      ["岁月神偷", "Echoes of the Rainbow", "2010", "中国香港", "117 分钟"],
      ["相爱相亲", "Love Education", "2017", "中国 / 中国台湾", "121 分钟"],
      ["山河故人", "Mountains May Depart", "2015", "中国 / 法国", "126 分钟"],
    ],
  },
  {
    moods: ["solitude", "calm"],
    tags: ["独处", "留白", "观察", "慢节奏"],
    features: { stimulation: 1, pacing: 1, emotionalWeight: 3, conflictLevel: 2, accessibility: 2 },
    note: "电影不替你打破沉默，只陪你把沉默看得更清楚。",
    reason: "人物距离、空间和停顿构成主要情绪。适合想一个人待会儿，并愿意接受开放感受的晚上。",
    caution: "留白较多、进入较慢；想要明确情节推进时不建议优先选择。",
    films: [
      ["迷失东京", "Lost in Translation", "2003", "美国 / 日本", "102 分钟"],
      ["在云端", "Up in the Air", "2009", "美国", "109 分钟"],
      ["独自在夜晚的海边", "On the Beach at Night Alone", "2017", "韩国", "101 分钟"],
      ["地球最后的夜晚", "Long Day's Journey Into Night", "2018", "中国 / 法国", "138 分钟"],
      ["路边野餐", "Kaili Blues", "2015", "中国", "110 分钟"],
      ["大象席地而坐", "An Elephant Sitting Still", "2018", "中国", "234 分钟"],
      ["野草莓", "Wild Strawberries", "1957", "瑞典", "91 分钟"],
      ["第七封印", "The Seventh Seal", "1957", "瑞典", "96 分钟"],
      ["冬眠", "Winter Sleep", "2014", "土耳其 / 法国", "196 分钟"],
      ["远方", "Uzak", "2002", "土耳其", "110 分钟"],
      ["诗", "Poetry", "2010", "韩国", "139 分钟"],
      ["蜂蜜之地", "Honeyland", "2019", "北马其顿", "89 分钟"],
      ["无人知晓", "Nobody Knows", "2004", "日本", "141 分钟"],
      ["骑士", "The Rider", "2017", "美国", "104 分钟"],
      ["无依之地", "Nomadland", "2020", "美国", "108 分钟"],
    ],
  },
  {
    moods: ["wonder", "distant"],
    tags: ["奇想", "世界观", "冒险", "视觉"],
    features: { stimulation: 4, pacing: 3, emotionalWeight: 2, conflictLevel: 3, accessibility: 4 },
    note: "暂时离开现实尺度，去一个更大的世界里走一圈。",
    reason: "世界观、视觉想象与人物旅程彼此支撑。适合想去奇妙世界，又希望故事仍有情感落点的时候。",
    caution: "设定信息较多，部分作品包含战斗、黑暗童话或较强感官刺激。",
    films: [
      ["指环王1：护戒使者", "The Lord of the Rings: The Fellowship of the Ring", "2001", "新西兰 / 美国", "178 分钟"],
      ["哈利·波特与魔法石", "Harry Potter and the Sorcerer's Stone", "2001", "美国 / 英国", "152 分钟"],
      ["潘神的迷宫", "Pan's Labyrinth", "2006", "西班牙 / 墨西哥", "118 分钟"],
      ["大鱼", "Big Fish", "2003", "美国", "125 分钟"],
      ["雨果", "Hugo", "2011", "美国 / 英国", "126 分钟"],
      ["少年派的奇幻漂流", "Life of Pi", "2012", "美国 / 中国台湾", "127 分钟"],
      ["星际穿越", "Interstellar", "2014", "美国 / 英国", "169 分钟"],
      ["机器人总动员", "WALL·E", "2008", "美国", "98 分钟"],
      ["龙猫", "My Neighbor Totoro", "1988", "日本", "86 分钟"],
      ["哈尔的移动城堡", "Howl's Moving Castle", "2004", "日本", "119 分钟"],
      ["幽灵公主", "Princess Mononoke", "1997", "日本", "134 分钟"],
      ["天空之城", "Castle in the Sky", "1986", "日本", "125 分钟"],
      ["凯尔经的秘密", "The Secret of Kells", "2009", "爱尔兰 / 法国", "75 分钟"],
      ["狼行者", "Wolfwalkers", "2020", "爱尔兰 / 英国", "103 分钟"],
      ["生命之书", "The Book of Life", "2014", "美国 / 墨西哥", "95 分钟"],
    ],
  },
];

const posterStyles = [
  "poster-drive",
  "poster-sea",
  "poster-days",
  "poster-paterson",
  "poster-columbus",
  "poster-forest",
  "poster-tuscany",
  "poster-walter",
  "poster-frances",
];

export const catalogAdditions: Film[] = catalogGroups.flatMap((group, groupIndex) =>
  group.films.map(([title, original, year, country, duration], filmIndex) => ({
    title,
    original,
    year,
    country,
    duration,
    quote: group.note,
    reason: group.reason,
    caution: group.caution,
    tags: group.tags,
    moods: group.moods,
    features: title === "大象席地而坐"
      ? { stimulation: 1, pacing: 1, emotionalWeight: 5, conflictLevel: 4, accessibility: 1 }
      : group.features,
    poster: posterStyles[(groupIndex * 3 + filmIndex) % posterStyles.length],
  })),
);
