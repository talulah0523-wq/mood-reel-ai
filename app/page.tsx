"use client";

import { FormEvent, useMemo, useState } from "react";
import { catalogAdditions, type Film, type MoodKey } from "./catalog";
import { posterFor } from "./posters";
import {
  filmId,
  recommendFilms,
  referenceConflict,
  understandNeed,
  type ReferenceAspect,
  type ReferencePriority,
} from "./recommendation-engine";

const featuredFilms: Film[] = [
  {
    title: "驾驶我的车",
    original: "Drive My Car",
    year: "2021",
    country: "日本",
    duration: "179 分钟",
    quote: "它不催你走出来，只是陪你把没有说完的话慢慢说完。",
    reason:
      "克制的镜头与平稳的行车节奏，会给焦虑留出呼吸空间；人物带着各自的缺口同行，不急着给出答案。",
    caution: "片长近三小时，适合今晚不赶时间的你。",
    tags: ["缓慢", "克制", "公路", "余韵"],
    moods: ["calm", "distant"],
    poster: "poster-drive",
  },
  {
    title: "海街日记",
    original: "Our Little Sister",
    year: "2015",
    country: "日本",
    duration: "128 分钟",
    quote: "像在初夏的房子里坐一会儿，生活仍有细小的甜。",
    reason:
      "海风、梅子和四季让画面安静下来。故事没有猛烈转折，人物之间的善意一点点生长，适合收拢杂乱的心。",
    caution: "情绪非常轻，期待强情节时可能会觉得平淡。",
    tags: ["温柔", "日常", "女性", "夏天"],
    moods: ["calm", "light"],
    features: { stimulation: 1, pacing: 2, emotionalWeight: 1, conflictLevel: 1, accessibility: 5 },
    poster: "poster-sea",
  },
  {
    title: "完美的日子",
    original: "Perfect Days",
    year: "2023",
    country: "日本 / 德国",
    duration: "124 分钟",
    quote: "重复的日常里，也藏着可以被看见的光。",
    reason:
      "树影、磁带与固定的生活秩序，把注意力带回当下。它不会强行振奋你，而是展示一种安稳生活的可能。",
    caution: "叙事极简，更像跟随一个人安静地生活几天。",
    tags: ["日常", "秩序", "独处", "东京"],
    moods: ["calm", "restart"],
    poster: "poster-days",
  },
  {
    title: "帕特森",
    original: "Paterson",
    year: "2016",
    country: "美国",
    duration: "118 分钟",
    quote: "平凡不是停滞，它也可以是一首正在写的诗。",
    reason:
      "一周的重复被拍得温柔而有韵律。主角观察身边的人与物，能让无聊慢慢变成对生活细节的好奇。",
    caution: "几乎没有戏剧冲突，适合愿意慢下来的时刻。",
    tags: ["诗意", "日常", "低刺激", "幽默"],
    moods: ["calm", "light"],
    poster: "poster-paterson",
  },
  {
    title: "哥伦布",
    original: "Columbus",
    year: "2017",
    country: "美国",
    duration: "104 分钟",
    quote: "有时，一座陌生的城能替人保管暂时说不清的迷茫。",
    reason:
      "建筑构图与大量留白让画面有秩序感，两个停在原地的人互相倾听。它很适合想看一个远方故事、又不愿被情节推着跑的时候。",
    caution: "对话和静止镜头较多，整体非常安静。",
    tags: ["建筑", "倾听", "留白", "异乡"],
    moods: ["calm", "distant"],
    poster: "poster-columbus",
  },
  {
    title: "小森林 夏秋篇",
    original: "Little Forest: Summer/Autumn",
    year: "2014",
    country: "日本",
    duration: "111 分钟",
    quote: "先好好吃饭，答案可以晚一点再来。",
    reason:
      "做饭、劳作和季节变化构成舒缓节奏。它把抽象的焦虑落到具体的双手与食物上，带来踏实的恢复感。",
    caution: "生活流明显，美食与劳作比主线剧情更重要。",
    tags: ["美食", "自然", "独居", "四季"],
    moods: ["calm", "restart"],
    poster: "poster-forest",
  },
  {
    title: "托斯卡纳艳阳下",
    original: "Under the Tuscan Sun",
    year: "2003",
    country: "美国 / 意大利",
    duration: "113 分钟",
    quote: "重启不一定要准备好，也可以从推开一扇窗开始。",
    reason:
      "明亮的托斯卡纳与重新修缮的房子，把人生重启拍得具体。故事轻盈，适合想离开原地一会儿、补充一点希望。",
    caution: "带有浪漫喜剧质感，现实感相对轻。",
    tags: ["重启", "旅行", "明亮", "浪漫"],
    moods: ["restart", "distant", "light"],
    poster: "poster-tuscany",
  },
  {
    title: "白日梦想家",
    original: "The Secret Life of Walter Mitty",
    year: "2013",
    country: "美国",
    duration: "114 分钟",
    quote: "如果今天太闷，就先借一段远行把世界重新打开。",
    reason:
      "冰岛与高山带来开阔感，节奏明快但不吵闹。它把停滞感转化为一次小小的出发，适合无聊或需要行动力的时候。",
    caution: "励志色彩较明显，想要纯粹平静时可选更克制的片。",
    tags: ["远行", "冒险", "开阔", "行动"],
    moods: ["distant", "restart"],
    poster: "poster-walter",
  },
  {
    title: "弗兰西丝·哈",
    original: "Frances Ha",
    year: "2012",
    country: "美国",
    duration: "86 分钟",
    quote: "迷路、笨拙、赶不上别人，也不妨碍你继续成为自己。",
    reason:
      "轻快的黑白影像承接了成长里的尴尬和失速。人物不完美却有生命力，适合想被理解、又不想看得太沉重。",
    caution: "主角的慌乱感很真实，焦虑很强时可能略有共振。",
    tags: ["成长", "友情", "轻快", "城市"],
    moods: ["light", "restart"],
    poster: "poster-frances",
  },
  {
    title: "爱在黎明破晓前",
    original: "Before Sunrise",
    year: "1995",
    country: "美国 / 奥地利",
    duration: "101 分钟",
    quote: "有些相遇不需要承诺，也足以让一个夜晚变得很长。",
    reason: "两个人在陌生城市里边走边聊，浪漫来自真实的好奇与靠近。适合想心动，又不想被甜腻情节包围的时候。",
    caution: "以对话为主，期待明显剧情转折时可能觉得慢。",
    tags: ["心动", "散步", "对话", "维也纳"],
    moods: ["romantic", "warm", "distant"],
    poster: "poster-tuscany",
  },
  {
    title: "时空恋旅人",
    original: "About Time",
    year: "2013",
    country: "英国",
    duration: "123 分钟",
    quote: "真正值得重来一次的，常常只是普通的一天。",
    reason: "它从爱情走向家人与日常，把遗憾轻轻放进时间里。适合想被温暖，也想重新珍惜眼前生活的时候。",
    caution: "家庭线的情绪后劲比浪漫喜剧的外表更重。",
    tags: ["爱情", "家人", "时间", "珍惜"],
    moods: ["romantic", "warm", "restart", "cathartic"],
    poster: "poster-sea",
  },
  {
    title: "花样年华",
    original: "In the Mood for Love",
    year: "2000",
    country: "中国香港",
    duration: "98 分钟",
    quote: "没有说出口的感情，也会在走廊和雨夜里留下形状。",
    reason: "颜色、音乐与反复经过的狭窄空间，把克制的心动拍得具体。适合怀旧、独处，或想感受一段未完成的爱。",
    caution: "情感始终克制，没有直接的释放与圆满。",
    tags: ["克制", "怀旧", "光影", "错过"],
    moods: ["romantic", "nostalgic", "solitude"],
    poster: "poster-drive",
  },
  {
    title: "天使爱美丽",
    original: "Amélie",
    year: "2001",
    country: "法国",
    duration: "122 分钟",
    quote: "世界没有突然变好，只是有人偷偷给它加了一点颜色。",
    reason: "俏皮的视觉、细小的善意和带点古怪的幽默，会把注意力从沉闷中拉出来。适合想开心一点、重新喜欢生活。",
    caution: "童话感与风格化很强，不追求完全写实。",
    tags: ["法式", "奇想", "善意", "明亮"],
    moods: ["light", "warm", "romantic", "wonder"],
    poster: "poster-tuscany",
  },
  {
    title: "阳光小美女",
    original: "Little Miss Sunshine",
    year: "2006",
    country: "美国",
    duration: "101 分钟",
    quote: "一家人可以乱成一团，也依然朝同一个方向推车。",
    reason: "失败、争吵和荒诞被装进一辆黄色小巴，最后变成笨拙但可靠的陪伴。适合想笑，也想看一家人重新站在一起。",
    caution: "含死亡与家庭冲突，但整体落点温暖。",
    tags: ["公路", "家庭", "荒诞", "失败"],
    moods: ["light", "warm", "restart"],
    poster: "poster-walter",
  },
  {
    title: "初恋这首情歌",
    original: "Sing Street",
    year: "2016",
    country: "爱尔兰",
    duration: "106 分钟",
    quote: "先组一支乐队吧，至于未来，可以边唱边想。",
    reason: "少年、音乐与逃离现实的冲劲，把迷茫转化为创造。适合想轻快一点，或需要被推着迈出第一步。",
    caution: "青春片气质明显，部分家庭情节略苦涩。",
    tags: ["音乐", "青春", "创造", "出发"],
    moods: ["light", "restart", "romantic"],
    poster: "poster-frances",
  },
  {
    title: "布达佩斯大饭店",
    original: "The Grand Budapest Hotel",
    year: "2014",
    country: "美国 / 德国",
    duration: "99 分钟",
    quote: "在秩序崩塌以前，仍有人认真地把香水喷好。",
    reason: "精确构图、快速节奏和一本正经的幽默，能迅速把注意力带进另一个世界。适合无聊、好奇，想换换脑子。",
    caution: "风格高度设计化，人物情感藏在喜剧和冒险之后。",
    tags: ["对称", "冒险", "黑色幽默", "童话"],
    moods: ["light", "curious", "distant", "wonder"],
    poster: "poster-columbus",
  },
  {
    title: "瞬息全宇宙",
    original: "Everything Everywhere All at Once",
    year: "2022",
    country: "美国",
    duration: "139 分钟",
    quote: "世界再混乱，也可以选择用温柔对抗。",
    reason: "高密度奇想把家庭压力、失败感和代际冲突炸开，再重新拼成理解。适合情绪很多、想哭也想痛快一次。",
    caution: "剪辑和信息量很大，疲惫或怕吵时不一定合适。",
    tags: ["多元宇宙", "家庭", "释放", "疯狂"],
    moods: ["cathartic", "exciting", "warm", "wonder"],
    poster: "poster-days",
  },
  {
    title: "头脑特工队",
    original: "Inside Out",
    year: "2015",
    country: "美国",
    duration: "95 分钟",
    quote: "难过不是需要被删除的故障，它也在保护你。",
    reason: "它把复杂情绪变成可以看见和理解的角色，让想哭、委屈或混乱都有位置。适合需要允许自己难过的时候。",
    caution: "动画外表轻盈，但关于成长与失去的部分很容易触动。",
    tags: ["情绪", "成长", "想哭", "理解"],
    moods: ["cathartic", "warm", "curious"],
    poster: "poster-sea",
  },
  {
    title: "海边的曼彻斯特",
    original: "Manchester by the Sea",
    year: "2016",
    country: "美国",
    duration: "137 分钟",
    quote: "有些伤不会被解决，但人仍可以继续把一天过完。",
    reason: "它不美化创伤，也不逼人物振作。适合心里堵着、想让悲伤被诚实看见，而不是被快速安慰的时候。",
    caution: "非常沉重，涉及死亡、创伤与无法修复的失去。",
    tags: ["创伤", "冬天", "克制", "释放"],
    moods: ["cathartic", "solitude"],
    poster: "poster-columbus",
  },
  {
    title: "燃烧女子的肖像",
    original: "Portrait of a Lady on Fire",
    year: "2019",
    country: "法国",
    duration: "122 分钟",
    quote: "被认真看见过一次，就足以改变记忆的温度。",
    reason: "凝视、海风与安静燃烧的情感，让心动和失去同时成立。适合想看成熟爱情，或需要一次克制的情绪释放。",
    caution: "节奏缓慢，结局留有强烈遗憾。",
    tags: ["女性", "凝视", "海岛", "遗憾"],
    moods: ["romantic", "cathartic", "solitude"],
    poster: "poster-drive",
  },
  {
    title: "疯狂的麦克斯：狂暴之路",
    original: "Mad Max: Fury Road",
    year: "2015",
    country: "澳大利亚 / 美国",
    duration: "120 分钟",
    quote: "有时不需要想通，只需要一路冲出去。",
    reason: "持续向前的动作、机械轰鸣和明确反抗，会替愤怒找到出口。适合想看得痛快，不想再分析自己的时候。",
    caution: "动作强度极高，暴力场面和噪声很多。",
    tags: ["动作", "逃亡", "反抗", "高能"],
    moods: ["exciting", "angry", "distant"],
    poster: "poster-walter",
  },
  {
    title: "蜘蛛侠：平行宇宙",
    original: "Spider-Man: Into the Spider-Verse",
    year: "2018",
    country: "美国",
    duration: "117 分钟",
    quote: "没人会先准备好，迈出去的那一下才是开始。",
    reason: "漫画质感、音乐和成长弧线都充满动能。适合低落时补充勇气，或只是想被漂亮画面和节奏点燃。",
    caution: "视觉信息密集，偏头痛或极度疲惫时可能太刺激。",
    tags: ["动画", "成长", "高能", "英雄"],
    moods: ["exciting", "restart", "light", "wonder"],
    poster: "poster-days",
  },
  {
    title: "利刃出鞘",
    original: "Knives Out",
    year: "2019",
    country: "美国",
    duration: "130 分钟",
    quote: "所有人都在演，真相却藏在最不起眼的善意里。",
    reason: "谜案推进快、人物鲜明又带幽默，既能动脑又不会过分压抑。适合无聊、想投入一个聪明故事。",
    caution: "人物很多，前段需要记住关系。",
    tags: ["推理", "群像", "反转", "幽默"],
    moods: ["curious", "light", "exciting"],
    poster: "poster-paterson",
  },
  {
    title: "致命魔术",
    original: "The Prestige",
    year: "2006",
    country: "美国 / 英国",
    duration: "130 分钟",
    quote: "你一直在看，却未必看见真正发生的事。",
    reason: "执念、竞争和层层揭开的结构会持续调动注意力。适合想烧脑、想暂时离开日常烦恼的时候。",
    caution: "整体阴暗，人物关系充满敌意与牺牲。",
    tags: ["悬疑", "执念", "结构", "反转"],
    moods: ["curious", "exciting", "angry"],
    poster: "poster-drive",
  },
  {
    title: "降临",
    original: "Arrival",
    year: "2016",
    country: "美国 / 加拿大",
    duration: "116 分钟",
    quote: "知道结局以后，你还会选择走进这段时间吗？",
    reason: "科幻谜题最终落在人如何理解时间、语言和爱。适合好奇、想被震撼，也愿意留一点空间给悲伤。",
    caution: "氛围低沉，包含关于失去的核心情节。",
    tags: ["科幻", "语言", "时间", "余韵"],
    moods: ["curious", "cathartic", "wonder"],
    poster: "poster-columbus",
  },
  {
    title: "她",
    original: "Her",
    year: "2013",
    country: "美国",
    duration: "126 分钟",
    quote: "孤独不是没有人在身边，而是渴望被真正理解。",
    reason: "柔软的色彩与亲密的声音，把科技外壳里的孤独拍得温柔。适合想被陪伴，也愿意触碰关系里的距离。",
    caution: "情绪柔软但后劲偏伤感，并非轻松爱情片。",
    tags: ["孤独", "亲密", "未来", "告别"],
    moods: ["solitude", "romantic", "cathartic", "warm"],
    poster: "poster-tuscany",
  },
  {
    title: "重庆森林",
    original: "Chungking Express",
    year: "1994",
    country: "中国香港",
    duration: "102 分钟",
    quote: "城市里的人擦肩而过，也会在某个瞬间彼此照亮。",
    reason: "手持影像、流行音乐和两段错位的爱情，让孤独既轻盈又浪漫。适合怀旧、失恋，或想感受城市夜色。",
    caution: "叙事松散跳跃，更重感觉而不是完整情节。",
    tags: ["城市", "怀旧", "失恋", "轻盈"],
    moods: ["nostalgic", "romantic", "light", "solitude"],
    poster: "poster-frances",
  },
  {
    title: "天堂电影院",
    original: "Cinema Paradiso",
    year: "1988",
    country: "意大利 / 法国",
    duration: "124 分钟",
    quote: "离开故乡以后，电影替我们保存那些已经回不去的时光。",
    reason: "童年、故乡和电影院共同构成一封长长的告别信。适合怀旧、想哭，或想重新想起自己为什么喜欢电影。",
    caution: "后段情绪浓度高，对离别敏感时容易大哭。",
    tags: ["电影", "故乡", "童年", "告别"],
    moods: ["nostalgic", "cathartic", "warm"],
    poster: "poster-paterson",
  },
  {
    title: "帕丁顿熊2",
    original: "Paddington 2",
    year: "2017",
    country: "英国 / 法国",
    duration: "103 分钟",
    quote: "如果我们善待别人，世界也许会变得不那么硬。",
    reason: "色彩、幽默和毫不羞涩的善良，让人短暂相信温柔有用。适合疲惫、孤独，或只想轻松地被照顾一下。",
    caution: "家庭电影气质明显，冲突简单而童话化。",
    tags: ["善良", "家庭", "英伦", "轻松"],
    moods: ["warm", "light"],
    poster: "poster-sea",
  },
  {
    title: "小偷家族",
    original: "Shoplifters",
    year: "2018",
    country: "日本",
    duration: "121 分钟",
    quote: "没有血缘的人，也可能认真地给过彼此一个家。",
    reason: "它用生活细节观察家庭、贫困和依赖，温暖与刺痛始终同时存在。适合想看真实人物，也想被复杂的爱触动。",
    caution: "涉及儿童处境与家庭分离，结尾并不轻松。",
    tags: ["家庭", "社会", "日常", "复杂"],
    moods: ["warm", "cathartic", "solitude"],
    poster: "poster-forest",
  },
  {
    title: "午餐盒",
    original: "The Lunchbox",
    year: "2013",
    country: "印度 / 法国 / 德国",
    duration: "104 分钟",
    quote: "送错的一份午餐，也可能抵达一个孤独的人。",
    reason: "书信、食物与城市通勤构成安静的连接。适合孤独、想听远方故事，或期待一种不喧闹的浪漫。",
    caution: "节奏舒缓，关系的结局保持开放。",
    tags: ["书信", "食物", "孟买", "陪伴"],
    moods: ["warm", "romantic", "solitude", "distant"],
    poster: "poster-tuscany",
  },
  {
    title: "坠入",
    original: "The Fall",
    year: "2006",
    country: "美国 / 印度",
    duration: "117 分钟",
    quote: "故事可以很美，也可以藏着讲故事的人没有说出的痛。",
    reason: "真实取景创造出梦境般的远方，童话与成人的绝望互相照见。适合想看视觉奇观，也愿意承受一点忧伤。",
    caution: "涉及自伤念头与绝望，低落很深时请谨慎选择。",
    tags: ["奇观", "童话", "远方", "想象"],
    moods: ["wonder", "cathartic", "distant"],
    poster: "poster-walter",
  },
  {
    title: "千与千寻",
    original: "Spirited Away",
    year: "2001",
    country: "日本",
    duration: "125 分钟",
    quote: "害怕也没关系，你仍然可以记住自己的名字。",
    reason: "陌生世界的奇观背后，是一个孩子逐渐学会勇敢与告别。适合想冒险、想被想象力带走，也需要一点成长力量。",
    caution: "部分怪物和父母变形场面可能让敏感观众不安。",
    tags: ["动画", "奇幻", "成长", "冒险"],
    moods: ["wonder", "distant", "restart", "warm"],
    poster: "poster-forest",
  },
  {
    title: "楚门的世界",
    original: "The Truman Show",
    year: "1998",
    country: "美国",
    duration: "103 分钟",
    quote: "当熟悉的生活开始露出裂缝，你会不会走向那扇门？",
    reason: "它用轻巧设定讨论真实、观看与选择。适合好奇、对现状起疑，或需要一点走出既定轨道的勇气。",
    caution: "被监视和被操控的设定可能引发不适。",
    tags: ["真实", "自由", "寓言", "选择"],
    moods: ["curious", "restart", "light"],
    poster: "poster-days",
  },
  {
    title: "爆裂鼓手",
    original: "Whiplash",
    year: "2014",
    country: "美国",
    duration: "107 分钟",
    quote: "野心可以把人推向舞台，也可能把人吞掉。",
    reason: "鼓点、剪辑和对抗把压抑转成高度集中的能量。适合愤怒、想看得痛快，或需要一场紧绷的胜负。",
    caution: "包含持续辱骂、精神控制与强烈压力，不适合需要安慰时观看。",
    tags: ["音乐", "野心", "对抗", "高压"],
    moods: ["exciting", "angry", "curious"],
    features: { stimulation: 5, pacing: 5, emotionalWeight: 4, conflictLevel: 5, accessibility: 5 },
    poster: "poster-drive",
  },
];

const films: Film[] = [...featuredFilms, ...catalogAdditions].map((film) => ({
  ...film,
  poster: posterFor(film.title) ?? film.poster,
}));

const quickMoodGroups = [
  [
    { label: "想开心一点", value: "想开心一点，别太费脑" },
    { label: "想安静下来", value: "疲惫，只想安静下来" },
    { label: "想痛快哭一场", value: "心里堵着，想痛快哭一场" },
    { label: "想被陪伴", value: "有点孤独，想被温柔陪伴" },
    { label: "想重新出发", value: "有点卡住，想重新出发" },
    { label: "想暂时逃开", value: "想暂时离开现实，去一个远方" },
  ],
  [
    { label: "想谈场恋爱", value: "想看一场真实的心动和浪漫" },
    { label: "想看点刺激的", value: "有点无聊，想看点刺激的" },
    { label: "想动动脑子", value: "好奇，想看点烧脑的" },
    { label: "想回到从前", value: "有点怀旧，想回到从前" },
    { label: "想一个人待会", value: "想一个人安静地待一会儿" },
    { label: "想去奇妙世界", value: "想去一个没见过的奇妙世界" },
  ],
];

const allQuickMoods = quickMoodGroups.flat();

const referenceAspects: ReferenceAspect[] = ["画面与氛围", "人物关系", "故事主题", "节奏", "情绪余韵", "说不清，就是喜欢"];

export default function Home() {
  const [mood, setMood] = useState("");
  const [selectedMoods, setSelectedMoods] = useState<string[]>([]);
  const [referenceQuery, setReferenceQuery] = useState("");
  const [referenceFilmId, setReferenceFilmId] = useState<string | null>(null);
  const [selectedAspects, setSelectedAspects] = useState<ReferenceAspect[]>([]);
  const [referencePriority, setReferencePriority] = useState<ReferencePriority>("current-mood");
  const [submittedMood, setSubmittedMood] = useState<string | null>(null);
  const [submittedReferenceId, setSubmittedReferenceId] = useState<string | null>(null);
  const [submittedAspects, setSubmittedAspects] = useState<ReferenceAspect[]>([]);
  const [submittedPriority, setSubmittedPriority] = useState<ReferencePriority>("current-mood");
  const [round, setRound] = useState(0);
  const [seenFilmIds, setSeenFilmIds] = useState<string[]>([]);
  const [lastBatchFilmIds, setLastBatchFilmIds] = useState<string[]>([]);
  const [shuffleNotice, setShuffleNotice] = useState("");
  const [moodGroup, setMoodGroup] = useState(0);
  const [individualRounds, setIndividualRounds] = useState([0, 0, 0]);
  const [expandedCards, setExpandedCards] = useState([false, false, false]);
  const [chosenFilmId, setChosenFilmId] = useState<string | null>(null);
  const [copiedTitle, setCopiedTitle] = useState<string | null>(null);
  const [replacementNotice, setReplacementNotice] = useState<{ index: number; previousTitle: string } | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const liveMoodText = [mood.trim(), ...selectedMoods].filter(Boolean).join("；");
  const liveProfile = useMemo(() => liveMoodText ? understandNeed(liveMoodText) : null, [liveMoodText]);
  const selectedReference = useMemo(() => films.find((film) => filmId(film) === referenceFilmId) ?? null, [referenceFilmId]);
  const submittedReference = useMemo(() => films.find((film) => filmId(film) === submittedReferenceId) ?? null, [submittedReferenceId]);
  const moodReading = useMemo(() => submittedMood ? understandNeed(submittedMood) : null, [submittedMood]);
  const recommendationPool = useMemo(
    () => moodReading ? recommendFilms(films, moodReading, submittedReference, submittedAspects, submittedPriority, round) : [],
    [moodReading, submittedReference, submittedAspects, submittedPriority, round],
  );
  const availableRecommendationPool = useMemo(() => {
    const seen = new Set(seenFilmIds);
    const lastBatch = new Set(lastBatchFilmIds);
    const fresh = recommendationPool.filter((result) => !seen.has(result.filmId));
    const older = recommendationPool.filter((result) => seen.has(result.filmId) && !lastBatch.has(result.filmId));
    const lastResort = recommendationPool.filter((result) => lastBatch.has(result.filmId));
    return [...fresh, ...older, ...lastResort];
  }, [recommendationPool, seenFilmIds, lastBatchFilmIds]);
  const recommendations = useMemo(() => [0, 1, 2].map((index) => (
    availableRecommendationPool[(index + (individualRounds[index] ?? 0) * 3) % Math.max(1, availableRecommendationPool.length)]
  )).filter(Boolean), [availableRecommendationPool, individualRounds]);
  const referenceSuggestions = useMemo(() => {
    const value = referenceQuery.trim().toLowerCase();
    if (!value || referenceFilmId) return [];
    return films.filter((film) => `${film.title} ${film.original}`.toLowerCase().includes(value)).slice(0, 6);
  }, [referenceQuery, referenceFilmId]);
  const hasReferenceConflict = Boolean(liveProfile && selectedReference && referenceConflict(liveProfile, selectedReference));
  const cardRoles = ["最容易进入", "最贴近线索", "最有意外感"];
  const canSubmit = mood.trim().length > 0 || selectedMoods.length > 0;

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!canSubmit) return;
    setSubmittedMood(liveMoodText);
    setSubmittedReferenceId(referenceFilmId);
    setSubmittedAspects(selectedAspects);
    setSubmittedPriority(referencePriority);
    setRound(0);
    setSeenFilmIds([]);
    setLastBatchFilmIds([]);
    setShuffleNotice("");
    setIndividualRounds([0, 0, 0]);
    setExpandedCards([false, false, false]);
    setChosenFilmId(null);
    setCopiedTitle(null);
    setReplacementNotice(null);
    setFeedback(null);
    window.setTimeout(() => document.querySelector("#recommendations")?.scrollIntoView({ behavior: "smooth" }), 50);
  }

  function toggleQuickMood(value: string) {
    setSelectedMoods((current) => current.includes(value)
      ? current.filter((item) => item !== value)
      : [...current, value]);
  }

  function reshuffle() {
    const currentIds = recommendations.map((result) => result.filmId);
    const nextSeenCount = new Set([...seenFilmIds, ...currentIds]).size;
    setSeenFilmIds((current) => [...new Set([...current, ...currentIds])]);
    setLastBatchFilmIds(currentIds);
    setRound((value) => value + 1);
    setIndividualRounds([0, 0, 0]);
    setExpandedCards([false, false, false]);
    setChosenFilmId(null);
    setCopiedTitle(null);
    setReplacementNotice(null);
    setFeedback(null);
    setShuffleNotice(`已换一批 · 本次会话已避开 ${nextSeenCount} 部看过的电影`);
  }

  function replaceFilm(index: number) {
    const previousFilm = recommendations[index]?.film;
    setIndividualRounds((value) => value.map((item, itemIndex) => itemIndex === index ? item + 1 : item));
    setExpandedCards((value) => value.map((item, itemIndex) => itemIndex === index ? false : item));
    setChosenFilmId((value) => value === (previousFilm ? filmId(previousFilm) : null) ? null : value);
    setCopiedTitle(null);
    if (previousFilm) {
      setReplacementNotice({ index, previousTitle: previousFilm.title });
      window.setTimeout(() => {
        setReplacementNotice((current) => current?.index === index && current.previousTitle === previousFilm.title ? null : current);
      }, 5000);
    }
    setFeedback(null);
  }

  function undoReplacement(index: number) {
    setIndividualRounds((value) => value.map((item, itemIndex) => itemIndex === index ? Math.max(0, item - 1) : item));
    setExpandedCards((value) => value.map((item, itemIndex) => itemIndex === index ? false : item));
    setReplacementNotice(null);
  }

  async function copyFilmTitle(title: string) {
    try {
      await navigator.clipboard.writeText(title);
      setCopiedTitle(title);
    } catch {
      setCopiedTitle(null);
    }
  }

  function adjustMood() {
    document.querySelector("#mood")?.scrollIntoView({ behavior: "smooth", block: "center" });
    window.setTimeout(() => document.querySelector<HTMLTextAreaElement>("#mood")?.focus(), 450);
  }

  function selectReference(film: Film) {
    setReferenceFilmId(filmId(film));
    setReferenceQuery(film.title);
    setSelectedAspects([]);
    setReferencePriority("current-mood");
  }

  function toggleReferenceAspect(aspect: ReferenceAspect) {
    setSelectedAspects((current) => current.includes(aspect) ? current.filter((item) => item !== aspect) : [...current, aspect]);
  }

  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="MOOD REEL 首页">
          <span className="brand-mark" aria-hidden="true"><b>M</b><b>R</b><i /><i /></span>
          <span>
            <strong>MOOD REEL</strong>
            <small>让此刻，遇见一部电影</small>
          </span>
        </a>
        <nav aria-label="主要导航">
          <a href="#how">如何推荐</a>
          <a href="#recommendations">今晚三部</a>
          <span className="issue-pill"><i /> 推荐系统体验版</span>
        </nav>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy">
          <p className="eyebrow"><span>VOL. 01</span> FILMS FOR THIS MOMENT</p>
          <h1>为此刻的心情，<br /><em>找一部电影。</em></h1>
          <p className="intro">
            想笑、想哭、想心动，或者只是想暂时离开现实一会儿。说说现在的心情，我们从画面、节奏和故事里，为今晚挑出三种可能。
          </p>
          <div className="edition-note" aria-label="电影库说明">
            <span>电影数据库</span>
            <strong>电影数据持续更新</strong>
          </div>
        </div>

        <div className="matcher-wrap">
          <span className="tape tape-one" aria-hidden="true" />
          <span className="tape tape-two" aria-hidden="true" />
          <form className="matcher" onSubmit={handleSubmit}>
            <div className="card-heading">
              <span>01</span>
              <div>
                <p className="step-label">YOUR MOOD</p>
                <h2>说说你现在的心情</h2>
                <p>一句话就够了，没有标准答案。</p>
              </div>
            </div>

            <label htmlFor="mood">此刻的心情</label>
            <textarea
              id="mood"
              value={mood}
              onChange={(event) => setMood(event.target.value)}
              placeholder="比如：有点累，想安静下来；或者想看点轻松的……"
              maxLength={120}
            />
            <div className="quick-moods" aria-label="快速选择心情">
              {quickMoodGroups[moodGroup].map((item) => (
                <button
                  key={item.label}
                  type="button"
                  className={selectedMoods.includes(item.value) ? "is-selected" : ""}
                  aria-pressed={selectedMoods.includes(item.value)}
                  onClick={() => toggleQuickMood(item.value)}
                >
                  {item.label}
                </button>
              ))}
            </div>
            <button className="mood-cycle" type="button" onClick={() => setMoodGroup((value) => (value + 1) % quickMoodGroups.length)}>
              换一组心情 →
            </button>
            {selectedMoods.length > 0 && (
              <div className="selected-moods" aria-label="已选择的心情">
                <span>已选择</span>
                {selectedMoods.map((value) => {
                  const item = allQuickMoods.find((moodItem) => moodItem.value === value);
                  return (
                    <button key={value} type="button" onClick={() => toggleQuickMood(value)} aria-label={`移除${item?.label ?? value}`}>
                      {item?.label ?? value}<b aria-hidden="true">×</b>
                    </button>
                  );
                })}
              </div>
            )}

            <label htmlFor="reference">一部曾经打动你的电影 <span>选填</span></label>
            <div className="reference-search">
              <input
                id="reference"
                role="combobox"
                aria-expanded={referenceSuggestions.length > 0}
                aria-controls="reference-options"
                aria-autocomplete="list"
                value={referenceQuery}
                onChange={(event) => { setReferenceQuery(event.target.value); setReferenceFilmId(null); }}
                placeholder="搜索片名，比如《爆裂鼓手》"
              />
              {referenceSuggestions.length > 0 && (
                <div className="reference-options" id="reference-options" role="listbox">
                  {referenceSuggestions.map((film) => (
                    <button key={filmId(film)} type="button" role="option" aria-selected="false" onClick={() => selectReference(film)}>
                      <strong>{film.title}</strong><span>{film.year} · {film.original}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <p className="reference-principle">现在的心情决定今晚看什么，喜欢过的电影帮助我们了解你怎么看电影。</p>
            {selectedReference && (
              <div className="reference-selected" role="status">
                <div><span>已选参考电影</span><strong>{selectedReference.title} · {selectedReference.year}</strong><small>{selectedReference.original}</small></div>
                <button type="button" onClick={() => { setReferenceFilmId(null); setReferenceQuery(""); setSelectedAspects([]); }}>移除</button>
              </div>
            )}
            {referenceQuery.trim() && !referenceFilmId && referenceSuggestions.length === 0 && (
              <p className="reference-fallback" role="status">未在当前电影库中找到，将保留为普通文字偏好，不会虚构电影信息。</p>
            )}
            {selectedReference && (
              <fieldset className="reference-aspects">
                <legend>它为什么打动你？<span>非必填</span></legend>
                <div>
                  {referenceAspects.map((aspect) => (
                    <button key={aspect} type="button" aria-pressed={selectedAspects.includes(aspect)} className={selectedAspects.includes(aspect) ? "is-selected" : ""} onClick={() => toggleReferenceAspect(aspect)}>{aspect}</button>
                  ))}
                </div>
              </fieldset>
            )}
            {hasReferenceConflict && selectedReference && (
              <div className="reference-conflict" role="status">
                <p>{referencePriority === "current-mood"
                  ? `你现在的观影需求与《${selectedReference.title}》的情绪强度不同。这次优先现在的心情，只参考它打动你的方式。`
                  : `这次会更接近《${selectedReference.title}》的${selectedAspects.length ? selectedAspects.join("、") : "节奏与情绪特征"}，但仍避开当前心情明确排除的高负担与高冲突。`}</p>
                <div>
                  <button type="button" aria-pressed={referencePriority === "current-mood"} className={referencePriority === "current-mood" ? "is-selected" : ""} onClick={() => setReferencePriority("current-mood")}>以现在的心情为主</button>
                  <button type="button" aria-pressed={referencePriority === "closer-reference"} className={referencePriority === "closer-reference" ? "is-selected" : ""} onClick={() => setReferencePriority("closer-reference")}>更接近这部电影</button>
                </div>
              </div>
            )}
            {!canSubmit && <p className="input-guidance">写一句，或选择一种心情</p>}
            <button className="primary-button" type="submit" disabled={!canSubmit}>
              <span>看看今晚的三部</span><b aria-hidden="true">→</b>
            </button>
            <p className="privacy-note">不定义你的心情，也不剧透电影。</p>
          </form>
        </div>
      </section>

      {submittedMood && moodReading && <>
      <section className="reading" id="how">
        <div className="section-number">02</div>
        <div className="reading-title">
          <p className="eyebrow">MOOD TRANSLATION</p>
          <h2>此刻的观影线索</h2>
        </div>
        <div className="reading-result">
          <span>适合靠近</span>
          <strong>{moodReading.label}</strong>
          <p>
            {submittedReference
              ? submittedPriority === "closer-reference"
                ? `更接近《${submittedReference.title}》的${submittedAspects.length ? submittedAspects.join("、") : "节奏与情绪特征"}，同时继续避开过度压抑、高情绪负担与高强度冲突。`
                : `当前心情优先；参考《${submittedReference.title}》的${submittedAspects.length ? submittedAspects.join("、") : "类型、节奏与情绪特征"}，但不默认寻找同类型电影。`
              : "我们把你的描述整理成情绪浓度、叙事速度、人物距离和想象力，再沿着这些线索寻找电影。"}
          </p>
        </div>
        <div className="reading-avoid">
          <span>暂时避开</span>
          <p>{moodReading.avoidLabel}</p>
        </div>
        <div className="pipeline" aria-label="推荐流程">
          <span>01 理解需求</span><i>→</i><span>02 召回候选</span><i>→</i><span>03 过滤排序与多样性</span><i>→</i><span>04 生成解释</span>
        </div>
      </section>

      <section className="recommendations" id="recommendations">
        <div className="reel-bridge"><span />沿着这些线索，找到今晚的三部。<span /></div>
        <div className="section-head">
          <div>
            <p className="eyebrow"><span>03</span> TONIGHT&apos;S REEL</p>
            <h2>今晚的三部</h2>
            <p className="section-summary">不是预测你会喜欢什么，而是说明它们为什么适合现在。</p>
            <div className="result-basis">
              <span>选片线索：{moodReading.label}{submittedReference ? ` · ${submittedPriority === "closer-reference" ? "参考电影优先" : "当前心情优先"}` : ""}</span>
              <button type="button" onClick={adjustMood}>修改心情</button>
            </div>
          </div>
          <button className="shuffle" type="button" onClick={reshuffle}>
            <span aria-hidden="true">↻</span> 换一批
          </button>
        </div>
        {shuffleNotice && <p className="shuffle-notice" role="status" aria-live="polite">{shuffleNotice}</p>}

        <div className="film-grid">
          {recommendations.map((result, index) => {
            const film = result.film;
            return (
            <article className={`film-card ${chosenFilmId === result.filmId ? "is-chosen" : ""}`} key={`${result.filmId}-${round}-${individualRounds[index]}`}>
              <div className="poster">
                <span className="poster-title" aria-hidden="true">{film.title}</span>
                <i className="poster-light" aria-hidden="true" />
                <img
                  className="poster-image"
                  src={film.poster}
                  alt={`${film.title}电影海报`}
                  loading="lazy"
                  onError={(event) => {
                    event.currentTarget.hidden = true;
                  }}
                />
                <span className="poster-index">0{index + 1}</span>
                <span className="card-role">{cardRoles[index]}</span>
              </div>
              <div className="film-content">
                <div className="film-meta">{[film.year, film.country, film.duration].filter(Boolean).join(" · ")}</div>
                <h3>{film.title}</h3>
                <p className="original-title">{film.original}</p>
                <div className="feature-strip" aria-label={`${film.title}的观影特征`}>
                  <span>刺激 {result.features.stimulation}/5</span>
                  <span>节奏 {result.features.pacing}/5</span>
                  <span>负担 {result.features.emotionalWeight}/5</span>
                  <span>冲突 {result.features.conflictLevel}/5</span>
                  <span>易进入 {result.features.accessibility}/5</span>
                </div>
                <div className="editorial-note"><span>产品生成概括 · 非电影原句</span><p>{result.explanation.viewingFeel}</p></div>
                <div className="why">
                  <span>为什么适合此刻</span>
                  <p>{result.explanation.moodMatch}</p>
                </div>
                <div className="film-tags">
                  {film.tags.map((tag) => <span key={tag}>{tag}</span>)}
                </div>
                {expandedCards[index] && <div className="film-detail"><span>看前提醒</span><p>{result.explanation.caution}</p></div>}
                <div className="film-actions">
                  <button className="watch-button" type="button" onClick={() => { setChosenFilmId(result.filmId); setCopiedTitle(null); }}>
                    {chosenFilmId === result.filmId ? "已选定 ✓" : "今晚看它"}
                  </button>
                  <button type="button" onClick={() => replaceFilm(index)}>换一部</button>
                  <button
                    type="button"
                    aria-expanded={expandedCards[index]}
                    onClick={() => setExpandedCards((value) => value.map((item, itemIndex) => itemIndex === index ? !item : item))}
                  >
                    {expandedCards[index] ? "收起提醒" : "看前提醒"}
                  </button>
                </div>
                {replacementNotice?.index === index && (
                  <div className="replacement-notice" role="status">
                    <span>已换一部</span><button type="button" onClick={() => undoReplacement(index)}>撤销</button>
                  </div>
                )}
                {chosenFilmId === result.filmId && (
                  <div className="selection-followup" role="status">
                    <strong>《{film.title}》{film.duration ? ` · ${film.duration}` : ""}</strong>
                    <div>
                      <button type="button" onClick={() => copyFilmTitle(film.title)}>
                        {copiedTitle === film.title ? "已复制 ✓" : "复制片名"}
                      </button>
                      <a
                        href={`https://www.google.com/search?q=${encodeURIComponent(`${film.title} 在哪看 正版`)}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        搜索观看渠道 ↗
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </article>
          );})}
        </div>

        <div className="feedback-box">
          <div>
            <span className="feedback-kicker">看完再回来</span>
            <h3>这组三部，贴近你的心情吗？</h3>
            <p>{feedback || "你的反馈，会让下一次选片更贴近你。"}</p>
          </div>
          <div className="feedback-actions">
            <button type="button" onClick={() => setFeedback("已记录：下次继续沿着相近的情绪浓度和节奏选片。")}>很贴近</button>
            <button type="button" onClick={() => setFeedback("已记录：下次减少情绪负担，增加明亮感。")}>有点太沉重</button>
            <button type="button" onClick={() => setFeedback("已记录：下次保留当前气质，提高叙事推进。")}>节奏太慢</button>
            <button type="button" onClick={() => setFeedback("已记录：下次换一组选片线索重新尝试。")}>不太对味</button>
          </div>
        </div>
      </section>
      </>}

      <footer>
        <div className="brand footer-brand">
          <span className="brand-mark" aria-hidden="true"><b>M</b><b>R</b><i /><i /></span>
          <span><strong>MOOD REEL</strong><small>让此刻，遇见一部电影</small></span>
        </div>
        <p>为此刻的心情，找一部电影。</p>
        <p className="prototype-note">年份、片长与原始片名来自电影数据源 · 推荐概括由产品生成 · 不提供播放资源</p>
      </footer>
    </main>
  );
}
