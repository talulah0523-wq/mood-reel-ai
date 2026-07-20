"use client";

import { FormEvent, useMemo, useState } from "react";

type MoodKey = "calm" | "distant" | "restart" | "light";

type Film = {
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
};

const films: Film[] = [
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
    tags: ["治愈", "日常", "女性", "夏天"],
    moods: ["calm", "light"],
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
];

const quickMoods = [
  "有点焦虑，想平静下来",
  "无聊，想看看远方",
  "很累，不想被教育",
  "迷茫，想重新出发",
];

function readMood(text: string): { keys: MoodKey[]; label: string } {
  const value = text.toLowerCase();
  const keys: MoodKey[] = [];
  if (/焦虑|迷茫|累|难过|平静|安静|治愈|低落/.test(value)) keys.push("calm");
  if (/无聊|远方|故事|旅行|陌生|世界|离开/.test(value)) keys.push("distant");
  if (/重新|出发|希望|行动|振作|改变|卡住/.test(value)) keys.push("restart");
  if (/轻松|打发|好笑|轻快|不想被教育/.test(value)) keys.push("light");
  if (!keys.length) keys.push("calm");
  const labels: Record<MoodKey, string> = {
    calm: "低刺激的平静",
    distant: "一段远方的故事",
    restart: "温和的重新出发",
    light: "不费力的轻盈",
  };
  return { keys, label: keys.map((key) => labels[key]).join(" · ") };
}

function matchFilms(keys: MoodKey[], offset: number) {
  return films
    .map((film, index) => ({
      film,
      score: film.moods.filter((mood) => keys.includes(mood)).length * 10 - ((index + offset) % 7),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(offset % 2, (offset % 2) + 3)
    .map((item) => item.film);
}

export default function Home() {
  const [mood, setMood] = useState("我有点焦虑和迷茫，想慢慢平静下来");
  const [reference, setReference] = useState("世界上最糟糕的人");
  const [submittedMood, setSubmittedMood] = useState(mood);
  const [round, setRound] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);
  const moodReading = useMemo(() => readMood(submittedMood), [submittedMood]);
  const recommendations = useMemo(
    () => matchFilms(moodReading.keys, round),
    [moodReading.keys, round],
  );

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setSubmittedMood(mood.trim() || "想安静地看一部电影");
    setRound(0);
    setFeedback(null);
    window.setTimeout(() => document.querySelector("#recommendations")?.scrollIntoView({ behavior: "smooth" }), 50);
  }

  function reshuffle() {
    setRound((value) => value + 1);
    setFeedback(null);
  }

  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="接住我首页">
          <span className="brand-mark" aria-hidden="true">接</span>
          <span>
            <strong>接住我</strong>
            <small>MOOD REEL</small>
          </span>
        </a>
        <nav aria-label="主要导航">
          <a href="#how">它怎么选</a>
          <a href="#recommendations">今晚的片单</a>
          <span className="issue-pill"><i /> 原型体验版</span>
        </nav>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy">
          <p className="eyebrow"><span>VOL. 01</span> 情绪电影伴侣</p>
          <h1>此刻，你想被怎样的<br /><em>电影接住？</em></h1>
          <p className="intro">
            不必先想清楚类型。说说你现在的心情，也可以留下一部曾经打动你的电影。我们会从画面、节奏、人物和故事里，为这一刻挑出三种恰好的陪伴。
          </p>
          <div className="edition-note" aria-label="本期说明">
            <span>本期主题</span>
            <strong>先理解情绪，再推荐电影</strong>
          </div>
        </div>

        <div className="matcher-wrap">
          <span className="tape tape-one" aria-hidden="true" />
          <span className="tape tape-two" aria-hidden="true" />
          <form className="matcher" onSubmit={handleSubmit}>
            <div className="card-heading">
              <span>01</span>
              <div>
                <h2>告诉我，此刻的你</h2>
                <p>一句话就够了，没有标准答案。</p>
              </div>
            </div>

            <label htmlFor="mood">我现在的心情</label>
            <textarea
              id="mood"
              value={mood}
              onChange={(event) => setMood(event.target.value)}
              placeholder="比如：今天有点焦虑，想看一部能让我慢慢平静下来的电影……"
              maxLength={120}
            />
            <div className="quick-moods" aria-label="快速选择心情">
              {quickMoods.map((item) => (
                <button key={item} type="button" onClick={() => setMood(item)}>{item}</button>
              ))}
            </div>

            <label htmlFor="reference">一部曾经接住你的电影 <span>选填</span></label>
            <input
              id="reference"
              value={reference}
              onChange={(event) => setReference(event.target.value)}
              placeholder="输入片名，比如《世界上最糟糕的人》"
            />
            <button className="primary-button" type="submit">
              <span>为我选三部</span><b aria-hidden="true">→</b>
            </button>
            <p className="privacy-note">不评判你的情绪，也不剧透电影。</p>
          </form>
        </div>
      </section>

      <section className="reading" id="how">
        <div className="section-number">02</div>
        <div className="reading-title">
          <p className="eyebrow">MOOD TRANSLATION</p>
          <h2>我们听见了什么</h2>
        </div>
        <div className="reading-result">
          <span>你的此刻</span>
          <strong>{moodReading.label}</strong>
          <p>
            {reference.trim()
              ? `参考《${reference.trim()}》带来的共鸣感，优先寻找人物真实、节奏有呼吸、结尾保留余韵的电影。`
              : "优先选择有呼吸感、不急着说服你、看完仍留有余韵的电影。"}
          </p>
        </div>
        <div className="reading-avoid">
          <span>这次先避开</span>
          <p>高强度冲突 · 说教式治愈 · 只有标签相似</p>
        </div>
      </section>

      <section className="recommendations" id="recommendations">
        <div className="section-head">
          <div>
            <p className="eyebrow"><span>03</span> TONIGHT&apos;S SELECTION</p>
            <h2>今晚，试试这三部</h2>
            <p>不是“猜你喜欢”，而是它为什么适合现在的你。</p>
          </div>
          <button className="shuffle" type="button" onClick={reshuffle}>
            <span aria-hidden="true">↻</span> 换一批
          </button>
        </div>

        <div className="film-grid">
          {recommendations.map((film, index) => (
            <article className="film-card" key={`${film.title}-${round}`}>
              <div className={`poster ${film.poster}`} role="img" aria-label={`${film.title}的抽象电影海报`}>
                <span className="poster-index">0{index + 1}</span>
                <span className="poster-title">{film.title}</span>
                <i className="poster-light" />
              </div>
              <div className="film-content">
                <div className="film-meta">{film.year} · {film.country} · {film.duration}</div>
                <h3>{film.title}</h3>
                <p className="original-title">{film.original}</p>
                <blockquote>“{film.quote}”</blockquote>
                <div className="why">
                  <span>为什么适合此刻</span>
                  <p>{film.reason}</p>
                </div>
                <div className="film-tags">
                  {film.tags.map((tag) => <span key={tag}>{tag}</span>)}
                </div>
                <details>
                  <summary>看前提醒</summary>
                  <p>{film.caution}</p>
                </details>
              </div>
            </article>
          ))}
        </div>

        <div className="feedback-box">
          <div>
            <span className="feedback-kicker">看完再回来</span>
            <h3>{feedback ? "收到，我会记住这种感觉。" : "这组推荐，接住你了吗？"}</h3>
            <p>{feedback || "你的反馈会成为下一次推荐的重要线索。"}</p>
          </div>
          <div className="feedback-actions">
            <button type="button" onClick={() => setFeedback("接住我了：下次会延续这组电影的情绪浓度与节奏。")}>接住我了</button>
            <button type="button" onClick={() => setFeedback("有点太沉重：下次会减少情绪负担，增加明亮感。")}>有点太沉重</button>
            <button type="button" onClick={() => setFeedback("节奏太慢：下次会保留温柔感，但提高叙事推动力。")}>节奏太慢</button>
          </div>
        </div>
      </section>

      <footer>
        <div className="brand footer-brand">
          <span className="brand-mark" aria-hidden="true">接</span>
          <span><strong>接住我</strong><small>MOOD REEL</small></span>
        </div>
        <p>先理解你的此刻，再推荐一部电影。</p>
        <p className="prototype-note">电影信息为产品原型示例 · 不提供播放资源</p>
      </footer>
    </main>
  );
}
