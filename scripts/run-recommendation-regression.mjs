import assert from "node:assert/strict";
import { resolve } from "node:path";
import { createServer } from "vite";

const root = resolve(import.meta.dirname, "..");
const server = await createServer({ root, configFile: false, server: { middlewareMode: true }, appType: "custom", logLevel: "silent" });

try {
  const engine = await server.ssrLoadModule("/app/recommendation-engine.ts");
  const film = (title, original, features, moods = ["calm"], tags = ["剧情"]) => ({
    title,
    original,
    year: "2020",
    country: "测试地区",
    duration: "100 分钟",
    quote: "测试概括",
    reason: "基于结构化电影特征生成的测试推荐理由。",
    caution: "测试提醒。",
    tags,
    moods,
    poster: "poster-days",
    genres: tags,
    synopsis: "用于推荐回归测试的结构化电影简介，不作为真实电影事实展示。",
    rating: 7,
    features,
  });
  const calmSlow = Array.from({ length: 15 }, (_, index) => film(`安静电影${index + 1}`, `Calm ${index + 1}`, { stimulation: 1, pacing: index % 3 === 0 ? 3 : 2, emotionalWeight: 2, conflictLevel: 1, accessibility: 4 }, ["calm", "warm"], ["日常", "剧情"]));
  const clearRhythm = film("清晰节奏", "Clear Rhythm", { stimulation: 2, pacing: 5, emotionalWeight: 2, conflictLevel: 2, accessibility: 5 }, ["restart"], ["音乐", "成长"]);
  const elephant = film("大象席地而坐", "An Elephant Sitting Still", { stimulation: 1, pacing: 1, emotionalWeight: 5, conflictLevel: 4, accessibility: 1 }, ["calm", "solitude"], ["压抑", "创伤"]);
  const whiplash = film("爆裂鼓手", "Whiplash", { stimulation: 5, pacing: 5, emotionalWeight: 4, conflictLevel: 5, accessibility: 5 }, ["exciting", "angry"], ["音乐", "高压"]);
  const library = [...calmSlow, clearRhythm, elephant, whiplash];
  const profile = engine.understandNeed("想安静下来，不要太沉重");
  const currentMood = engine.recommendFilms(library, profile, whiplash, ["节奏"], "current-mood", 0);
  const closerReference = engine.recommendFilms(library, profile, whiplash, ["节奏"], "closer-reference", 0);
  const currentTop = currentMood.slice(0, 5).map((item) => item.film.title);
  const referenceTop = closerReference.slice(0, 5).map((item) => item.film.title);

  assert.ok(currentMood.length >= 15, "安静心情应有足够候选支持连续五批");
  assert.equal(currentMood.some((item) => item.film.title === "大象席地而坐"), false, "高情绪负担电影必须被硬过滤");
  assert.equal(currentMood.some((item) => item.features.emotionalWeight > 3), false, "结果不能包含超过情绪负担上限的电影");
  assert.equal(new Set(currentMood.slice(0, 15).map((item) => item.filmId)).size, 15, "连续五批所需的15部电影不得重复");
  assert.notDeepEqual(currentMood.slice(0, 3).map((item) => item.filmId), closerReference.slice(0, 3).map((item) => item.filmId), `更接近参考电影必须真实改变排序；当前=${currentTop.join("/")}，参考=${referenceTop.join("/")}`);
  const currentRhythmRank = currentMood.findIndex((item) => item.film.title === "清晰节奏");
  const closerRhythmRank = closerReference.findIndex((item) => item.film.title === "清晰节奏");
  assert.ok(closerRhythmRank >= 0 && closerRhythmRank < currentRhythmRank, "参考电影优先模式应提升清晰、有推动力的节奏候选");
  console.log("推荐回归通过：硬过滤、参考权重和连续五批去重均正常。");
} finally {
  await server.close();
}
