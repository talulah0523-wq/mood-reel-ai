import type { Film, FilmFeatures, MoodKey } from "./catalog";

export type ReferenceAspect = "画面与氛围" | "人物关系" | "故事主题" | "节奏" | "情绪余韵" | "说不清，就是喜欢";
export type ReferencePriority = "current-mood" | "closer-reference";

type MoodNeeds = {
  stimulationMax: number | null;
  pacingTarget: number | null;
  emotionalWeightMax: number | null;
  conflictLevelMax: number | null;
  accessibilityMin: number | null;
};

export type MoodProfile = {
  rawText: string;
  keys: MoodKey[];
  label: string;
  avoidLabel: string;
  maxDuration: number | null;
  explicitAvoids: string[];
  needs: MoodNeeds;
};

export type RecommendationExplanation = {
  viewingFeel: string;
  moodMatch: string;
  caution: string;
};

export type RecommendationResult = {
  film: Film;
  filmId: string;
  score: number;
  explanation: RecommendationExplanation;
  matchedMoods: MoodKey[];
  features: FilmFeatures;
  scoreBreakdown: { mood: number; reference: number; quality: number; diversity: number };
};

const moodLabels: Record<MoodKey, string> = {
  calm: "低刺激的平静",
  distant: "一段远方的故事",
  restart: "温和的重新出发",
  light: "不费力的轻盈",
  warm: "温柔的陪伴",
  romantic: "一点真实的心动",
  cathartic: "完整的情绪释放",
  exciting: "更强的节奏",
  curious: "值得投入的悬念",
  angry: "有出口的力量",
  nostalgic: "回到熟悉的旧时光",
  solitude: "适合独处",
  wonder: "更大的想象空间",
};

function stableHash(value: string) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return Math.abs(hash >>> 0);
}

export function filmId(film: Film) {
  return film.id ?? `film-${stableHash(`${film.original}|${film.year}`)}`;
}

function clampLevel(value: number): 1 | 2 | 3 | 4 | 5 {
  return Math.max(1, Math.min(5, Math.round(value))) as 1 | 2 | 3 | 4 | 5;
}

export function getFilmFeatures(film: Film): FilmFeatures {
  if (film.features) return film.features;
  const text = `${film.tags.join(" ")} ${film.caution} ${film.reason} ${(film.genres ?? []).join(" ")}`.toLowerCase();
  const stimulation = /高能|动作|战斗|恐怖|惊悚|强烈|action|horror|war/.test(text) ? 5 : /冒险|悬疑|奇幻|科幻|thriller|adventure|fantasy|sci-fi/.test(text) ? 4 : /明亮|喜剧|动画|comedy|animation/.test(text) ? 2 : 1;
  const pacing = /推进快|高能|动作|紧张|action|thriller|horror/.test(text) ? 5 : /轻快|喜剧|冒险|comedy|adventure/.test(text) ? 4 : /慢节奏|缓慢|留白|极简/.test(text) ? 1 : 3;
  const emotionalWeight = /绝望|自伤|创伤|持续压抑|疾病|失去|战争|辱骂|精神控制|高压/.test(text) ? 5 : /沉重|现实困境|犯罪|后劲|war|horror|crime/.test(text) ? 4 : film.moods.includes("cathartic") ? 4 : film.moods.includes("light") ? 1 : 2;
  const conflictLevel = /战斗|动作|暴力|对抗|谋杀|战争|高压|action|war|horror|thriller/.test(text) ? 5 : /悬疑|犯罪|反转|crime|mystery/.test(text) ? 4 : /戏剧冲突较少|几乎没有戏剧冲突/.test(text) ? 1 : 2;
  const accessibility = /好进入|轻松|明亮|幽默|目标清楚|喜剧|comedy|animation/.test(text) ? 5 : /进入较慢|留白较多|需要持续注意|设定信息较多/.test(text) ? 2 : 3;
  return { stimulation, pacing, emotionalWeight, conflictLevel, accessibility };
}

export function understandNeed(text: string): MoodProfile {
  const value = text.toLowerCase();
  const keys: MoodKey[] = [];
  if (/焦虑|疲惫|累|平静|安静|放空|睡前|低刺激|没有压力/.test(value)) keys.push("calm");
  if (/无聊|远方|旅行|陌生|世界|离开/.test(value)) keys.push("distant");
  if (/重新|出发|希望|行动|振作|改变|卡住/.test(value)) keys.push("restart");
  if (/轻松|开心|打发|好笑|轻快|不费脑|别太费脑|无负担/.test(value)) keys.push("light");
  if (/陪伴|温暖|理解|拥抱|孤独|一个人/.test(value)) keys.push("warm");
  if (/恋爱|爱情|心动|浪漫|暧昧|失恋/.test(value)) keys.push("romantic");
  if (/想哭|大哭|释放|难过|委屈|堵着|悲伤/.test(value)) keys.push("cathartic");
  if (/刺激|高能|紧张|动作|爽|过瘾/.test(value)) keys.push("exciting");
  if (/烧脑|好奇|推理|悬疑|反转|动脑|谜/.test(value)) keys.push("curious");
  if (/生气|愤怒|憋屈|反抗|痛快/.test(value)) keys.push("angry");
  if (/怀旧|从前|过去|童年|故乡|旧时光/.test(value)) keys.push("nostalgic");
  if (/独处|疏离|寂寞|想一个人/.test(value)) keys.push("solitude");
  if (/奇幻|想象|奇观|梦|冒险|没见过/.test(value)) keys.push("wonder");
  if (!keys.length) keys.push("light", "warm");

  const uniqueKeys = [...new Set(keys)];
  const explicitAvoids = [
    /不要.*(沉重|压抑)|不想.*(沉重|压抑)|避开.*(沉重|压抑)/.test(value) ? "沉重" : "",
    /不要.*(暴力|血腥)|不想.*(暴力|血腥)|避开.*(暴力|血腥)/.test(value) ? "暴力" : "",
    /不要.*(恐怖|惊悚)|不想.*(恐怖|惊悚)|避开.*(恐怖|惊悚)/.test(value) ? "恐怖" : "",
  ].filter(Boolean);
  const durationMatch = value.match(/(?:不超过|少于|以内)\s*(\d{2,3})\s*分钟/);
  const maxDuration = durationMatch ? Number(durationMatch[1]) : null;
  const wantsQuiet = uniqueKeys.includes("calm") && !uniqueKeys.some((key) => ["exciting", "angry", "cathartic"].includes(key));
  const wantsEffortless = uniqueKeys.includes("light") || /容易进入|不费脑|无负担/.test(value);
  const needs: MoodNeeds = {
    stimulationMax: wantsQuiet ? 2 : null,
    pacingTarget: wantsQuiet ? 2 : uniqueKeys.includes("exciting") ? 5 : uniqueKeys.includes("light") ? 4 : null,
    emotionalWeightMax: wantsEffortless ? 2 : wantsQuiet ? 3 : null,
    conflictLevelMax: wantsQuiet ? 2 : null,
    accessibilityMin: wantsEffortless ? 4 : wantsQuiet ? 3 : null,
  };

  return {
    rawText: text,
    keys: uniqueKeys,
    label: uniqueKeys.slice(0, 3).map((key) => moodLabels[key]).join(" · "),
    avoidLabel: buildAvoid(uniqueKeys, explicitAvoids, maxDuration),
    maxDuration,
    explicitAvoids,
    needs,
  };
}

function buildAvoid(keys: MoodKey[], explicitAvoids: string[], maxDuration: number | null) {
  const explicit = [...explicitAvoids, ...(maxDuration ? [`超过 ${maxDuration} 分钟`] : [])];
  if (explicit.length) return explicit.join(" · ");
  if (keys.includes("angry") || keys.includes("exciting")) return "拖沓平淡 · 无效说教 · 节奏失焦";
  if (keys.includes("romantic")) return "悬浮甜腻 · 强行圆满 · 只有类型相似";
  if (keys.includes("cathartic")) return "廉价煽情 · 突然说教 · 情绪过载";
  if (keys.includes("curious")) return "故弄玄虚 · 信息混乱 · 只剩反转";
  if (keys.includes("light") || keys.includes("calm")) return "持续压抑 · 负担太重 · 高强度冲突";
  return "刻意安慰 · 只有标签相似 · 忽略此刻状态";
}

function durationMinutes(film: Film) {
  return Number(film.duration.match(/\d+/)?.[0] ?? 0);
}

function normalizedCloseness(left: number, right: number) {
  return 1 - Math.abs(left - right) / 4;
}

function tagSimilarity(left: Film, right: Film) {
  const leftTags = new Set([...(left.tags ?? []), ...(left.genres ?? [])]);
  const rightTags = new Set([...(right.tags ?? []), ...(right.genres ?? [])]);
  const shared = [...leftTags].filter((tag) => rightTags.has(tag)).length;
  return shared / Math.max(1, Math.min(leftTags.size, rightTags.size));
}

function referenceSimilarity(film: Film, reference: Film | null, aspects: ReferenceAspect[]) {
  if (!reference) return 0;
  const filmFeatures = getFilmFeatures(film);
  const referenceFeatures = getFilmFeatures(reference);
  const selected = aspects.length ? aspects : ["画面与氛围", "人物关系", "故事主题", "节奏", "情绪余韵"] as ReferenceAspect[];
  const values = selected.map((aspect) => {
    if (aspect === "节奏") return normalizedCloseness(filmFeatures.pacing, referenceFeatures.pacing);
    if (aspect === "画面与氛围") return (normalizedCloseness(filmFeatures.stimulation, referenceFeatures.stimulation) + film.moods.filter((mood) => reference.moods.includes(mood)).length / Math.max(1, reference.moods.length)) / 2;
    if (aspect === "人物关系") return (normalizedCloseness(filmFeatures.conflictLevel, referenceFeatures.conflictLevel) + tagSimilarity(film, reference)) / 2;
    if (aspect === "故事主题") return tagSimilarity(film, reference);
    if (aspect === "情绪余韵") return normalizedCloseness(filmFeatures.emotionalWeight, referenceFeatures.emotionalWeight);
    return ["stimulation", "pacing", "emotionalWeight", "conflictLevel", "accessibility"].reduce((sum, key) => sum + normalizedCloseness(filmFeatures[key as keyof FilmFeatures], referenceFeatures[key as keyof FilmFeatures]), 0) / 5;
  });
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function conflictsWithMood(profile: MoodProfile, reference: Film | null) {
  if (!reference) return false;
  const features = getFilmFeatures(reference);
  return Boolean(
    (profile.needs.stimulationMax && features.stimulation > profile.needs.stimulationMax)
    || (profile.needs.emotionalWeightMax && features.emotionalWeight > profile.needs.emotionalWeightMax)
    || (profile.needs.conflictLevelMax && features.conflictLevel > profile.needs.conflictLevelMax)
  );
}

export function referenceConflict(profile: MoodProfile, reference: Film | null) {
  return conflictsWithMood(profile, reference);
}

export function violatesHardFilters(film: Film, profile: MoodProfile) {
  const features = getFilmFeatures(film);
  const searchable = `${film.tags.join(" ")} ${film.caution} ${(film.genres ?? []).join(" ")}`.toLowerCase();
  if (profile.maxDuration && durationMinutes(film) > profile.maxDuration) return true;
  if (profile.needs.stimulationMax && features.stimulation > profile.needs.stimulationMax) return true;
  if (profile.needs.emotionalWeightMax && features.emotionalWeight > profile.needs.emotionalWeightMax) return true;
  if (profile.needs.conflictLevelMax && features.conflictLevel > profile.needs.conflictLevelMax) return true;
  if (profile.needs.accessibilityMin && features.accessibility < profile.needs.accessibilityMin) return true;
  if (profile.explicitAvoids.includes("暴力") && /暴力|血腥|动作|战争|犯罪|高压|action|war|crime/.test(searchable)) return true;
  if (profile.explicitAvoids.includes("恐怖") && /恐怖|惊悚|horror/.test(searchable)) return true;
  if (profile.explicitAvoids.includes("沉重") && (features.emotionalWeight >= 4 || /沉重|压抑|创伤|失去|战争|高压/.test(searchable))) return true;
  return false;
}

function moodFit(film: Film, profile: MoodProfile) {
  const features = getFilmFeatures(film);
  const moodOverlap = film.moods.filter((key) => profile.keys.includes(key)).length / Math.max(1, profile.keys.length);
  const targets: number[] = [];
  if (profile.needs.stimulationMax) targets.push(features.stimulation <= profile.needs.stimulationMax ? 1 : 0);
  if (profile.needs.pacingTarget) targets.push(normalizedCloseness(features.pacing, profile.needs.pacingTarget));
  if (profile.needs.emotionalWeightMax) targets.push(features.emotionalWeight <= profile.needs.emotionalWeightMax ? 1 : 0);
  if (profile.needs.conflictLevelMax) targets.push(features.conflictLevel <= profile.needs.conflictLevelMax ? 1 : 0);
  if (profile.needs.accessibilityMin) targets.push(features.accessibility >= profile.needs.accessibilityMin ? 1 : 0);
  const dimensionFit = targets.length ? targets.reduce((sum, value) => sum + value, 0) / targets.length : moodOverlap;
  return moodOverlap * 0.45 + dimensionFit * 0.55;
}

// Stage 2: broad recall. Reference dimensions can recall candidates even when genres differ.
export function recallCandidates(library: Film[], profile: MoodProfile, reference: Film | null, aspects: ReferenceAspect[]) {
  const uniqueLibrary = [...library.reduce((items, film) => {
    const id = filmId(film);
    if (!items.has(id)) items.set(id, film);
    return items;
  }, new Map<string, Film>()).values()];
  return uniqueLibrary
    .map((film) => {
      const moodOverlap = film.moods.filter((key) => profile.keys.includes(key)).length;
      const referenceFit = referenceSimilarity(film, reference, aspects);
      return { film, recallScore: moodOverlap * 10 + referenceFit * 5 };
    })
    .filter((item) => item.recallScore > 0)
    .sort((a, b) => b.recallScore - a.recallScore)
    .slice(0, Math.min(500, library.length));
}

function featurePhrase(features: FilmFeatures) {
  const stimulation = features.stimulation <= 2 ? "低刺激" : features.stimulation >= 4 ? "较强视听刺激" : "中等刺激";
  const pacing = features.pacing <= 2 ? "舒缓节奏" : features.pacing >= 4 ? "清晰推进" : "适中节奏";
  const weight = features.emotionalWeight <= 2 ? "较轻情绪负担" : features.emotionalWeight >= 4 ? "较重情绪余韵" : "中等情绪重量";
  return `${stimulation}、${pacing}与${weight}`;
}

function makeExplanation(film: Film, profile: MoodProfile, reference: Film | null, aspects: ReferenceAspect[], priority: ReferencePriority): RecommendationExplanation {
  const features = getFilmFeatures(film);
  const tagLine = film.tags.slice(0, 3).join("、") || "人物与故事";
  const groundedSummary = film.reason.split(/[。；]/)[0]?.trim();
  const base = `${groundedSummary ? `${groundedSummary}；` : ""}${tagLine}构成主要观看质地，数据特征呈现${featurePhrase(features)}。`;
  let comparison = `它同时满足当前需求中的刺激度、情绪负担、冲突强度和进入难度门槛。`;
  if (reference) {
    const referenceFeatures = getFilmFeatures(reference);
    if (priority === "closer-reference") {
      const focus = aspects.length ? aspects.join("、") : "节奏与情绪特征";
      comparison = `它更靠近《${reference.title}》的${focus}；同时把冲突从 ${referenceFeatures.conflictLevel}/5 控制到 ${features.conflictLevel}/5，没有取消当前心情的硬性排除条件。`;
    } else {
      comparison = `相比《${reference.title}》，它保留可辨认的叙事韵律，但把刺激从 ${referenceFeatures.stimulation}/5 降到 ${features.stimulation}/5、情绪负担从 ${referenceFeatures.emotionalWeight}/5 降到 ${features.emotionalWeight}/5。`;
    }
  }
  return { viewingFeel: base, moodMatch: comparison, caution: film.caution || "建议先留意影片的节奏与题材强度，再决定是否适合今晚。" };
}

function diversitySimilarity(left: Film, right: Film) {
  const leftFeatures = getFilmFeatures(left);
  const rightFeatures = getFilmFeatures(right);
  const featureSimilarity = (["stimulation", "pacing", "emotionalWeight", "conflictLevel", "accessibility"] as const)
    .reduce((sum, key) => sum + normalizedCloseness(leftFeatures[key], rightFeatures[key]), 0) / 5;
  return featureSimilarity * 0.55 + tagSimilarity(left, right) * 0.45;
}

// Stage 3 + 4: hard filters, weighted ranking, diversity selection, then evidence-based explanations.
export function recommendFilms(
  library: Film[],
  profile: MoodProfile,
  reference: Film | null,
  aspects: ReferenceAspect[],
  priority: ReferencePriority,
  round = 0,
): RecommendationResult[] {
  const recalled = recallCandidates(library, profile, reference, aspects).filter(({ film }) => !violatesHardFilters(film, profile));
  const moodWeight = priority === "closer-reference" ? 35 : 65;
  const referenceWeight = reference ? (priority === "closer-reference" ? 45 : 15) : 0;

  const ranked = recalled.map(({ film }) => {
    const matchedMoods = film.moods.filter((key) => profile.keys.includes(key));
    const mood = moodFit(film, profile) * moodWeight;
    const referenceScore = referenceSimilarity(film, reference, aspects) * referenceWeight;
    const qualityBase = film.rating ? Math.min(1, film.rating / 10) : [film.title, film.original, film.year, film.duration, film.synopsis].filter(Boolean).length / 5;
    const quality = qualityBase * 9 + ((stableHash(`${filmId(film)}|${round}`) % 100) / 100);
    return { film, filmId: filmId(film), matchedMoods, features: getFilmFeatures(film), baseScore: mood + referenceScore + quality, mood, referenceScore, quality };
  }).sort((a, b) => b.baseScore - a.baseScore);

  const selected: Array<typeof ranked[number] & { diversity: number }> = [];
  const pool = [...ranked];
  while (pool.length && selected.length < 36) {
    const best = pool.map((candidate) => {
      const maxSimilarity = selected.length ? Math.max(...selected.map((item) => diversitySimilarity(candidate.film, item.film))) : 0;
      const diversity = 10 * (1 - maxSimilarity);
      return { candidate, diversity, adjusted: candidate.baseScore + diversity };
    }).sort((a, b) => b.adjusted - a.adjusted)[0];
    selected.push({ ...best.candidate, diversity: best.diversity });
    for (let index = pool.length - 1; index >= 0; index -= 1) {
      if (pool[index].filmId === best.candidate.filmId) pool.splice(index, 1);
    }
  }

  return selected.map((item) => ({
    film: item.film,
    filmId: item.filmId,
    score: item.baseScore + item.diversity,
    matchedMoods: item.matchedMoods,
    features: item.features,
    scoreBreakdown: { mood: item.mood, reference: item.referenceScore, quality: item.quality, diversity: item.diversity },
    explanation: makeExplanation(item.film, profile, reference, aspects, priority),
  }));
}
