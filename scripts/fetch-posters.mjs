import { access, mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const pageSource = await readFile(path.join(root, "app/page.tsx"), "utf8");
const catalogSource = await readFile(path.join(root, "app/catalog.ts"), "utf8");
const featuredSource = pageSource.slice(0, pageSource.indexOf("const films: Film[]"));

const films = [];
for (const match of featuredSource.matchAll(
  /title:\s*"([^"]+)",[\s\S]*?original:\s*"([^"]+)",[\s\S]*?year:\s*"(\d{4})"/g,
)) {
  films.push({ title: match[1], original: match[2], year: match[3] });
}
for (const match of catalogSource.matchAll(
  /\["([^"]+)",\s*"([^"]+)",\s*"(\d{4})",\s*"[^"]+",\s*"[^"]+"\]/g,
)) {
  films.push({ title: match[1], original: match[2], year: match[3] });
}

const uniqueFilms = [...new Map(films.map((film) => [film.title, film])).values()];
if (uniqueFilms.length !== 200) {
  throw new Error(`Expected 200 unique films, found ${uniqueFilms.length}.`);
}

const posterDirectory = path.join(root, "public/posters");
await mkdir(posterDirectory, { recursive: true });

const requestHeaders = {
  "User-Agent": "Mozilla/5.0 (compatible; MoodReelPosterCollector/1.0)",
};

const posterOverrides = {
  朝圣之路: {
    matchedTitle: "The Way",
    imageFile: "uaRfG7n92IiuYcKLl7LJo2gr6qO.jpg",
    searchUrl: "https://www.themoviedb.org/movie/59468-the-way",
  },
  转山: {
    matchedTitle: "One Mile Above",
    imageFile: "lQW5zxfu0AtvmMsHpiACXLzBl0d.jpg",
    searchUrl: "https://www.themoviedb.org/movie/136779",
  },
  眼镜: {
    matchedTitle: "Glasses",
    imageFile: "m1SyPPx9gvHFLNKZbad1VqohyW0.jpg",
    searchUrl: "https://www.themoviedb.org/search?query=Megane%20y%3A2007",
  },
  素媛: {
    matchedTitle: "Hope",
    imageFile: "x9yjkm9gIz5qI5fJMUTfBnWiB2o.jpg",
    searchUrl: "https://www.themoviedb.org/movie/255709",
  },
  房间: {
    matchedTitle: "Room",
    imageFile: "2hHDMeYyZjbGWn0BeNH1cTMxuM7.jpg",
    searchUrl: "https://www.themoviedb.org/movie/264644-room",
  },
  地心引力: {
    matchedTitle: "Gravity",
    imageFile: "kZ2nZw8D681aphje8NJi8EfbL1U.jpg",
    searchUrl: "https://www.themoviedb.org/movie/49047-gravity",
  },
};

function decodeHtml(value) {
  return value
    .replaceAll("&#39;", "'")
    .replaceAll("&#x27;", "'")
    .replaceAll("&#8217;", "'")
    .replaceAll("&amp;", "&")
    .replaceAll("&quot;", '"');
}

function normalizeTitle(value) {
  return decodeHtml(value)
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9\u3400-\u9fff]/g, "");
}

async function findPoster(film) {
  if (posterOverrides[film.title]) return posterOverrides[film.title];

  for (const searchText of [
    `${film.original} y:${film.year}`,
    film.original,
    film.title,
  ]) {
    const query = encodeURIComponent(searchText);
    const searchUrl = `https://www.themoviedb.org/search/movie?query=${query}`;
    let response;
    for (let attempt = 0; attempt < 5; attempt += 1) {
      response = await fetch(searchUrl, {
        headers: requestHeaders,
      });
      if (response.status !== 429) break;
      await new Promise((resolve) => setTimeout(resolve, 5_000 * (attempt + 1)));
    }
    if (!response?.ok) throw new Error(`Search failed with ${response?.status}`);

    const html = await response.text();
    const candidates = [...html.matchAll(
      /<img alt="([^"]+)"[^>]+srcset="[^"]*\/t\/p\/w188_and_h282_face\/([^" ]+)[\s\S]{0,1600}?class="release_date[^>]*>([^<]+)/g,
    )].map((result) => ({
      matchedTitle: decodeHtml(result[1]),
      imageFile: result[2],
      year: result[3].match(/\d{4}/)?.[0],
    }));
    const result = candidates.find((candidate) =>
      candidate.year === film.year &&
      [film.original, film.title].some((title) =>
        normalizeTitle(candidate.matchedTitle) === normalizeTitle(title)
      )
    );
    if (result) {
      return {
        matchedTitle: result.matchedTitle,
        imageFile: result.imageFile,
        searchUrl,
      };
    }
  }
  throw new Error("No poster result");
}

async function downloadPoster(film, index) {
  const match = await findPoster(film);
  const extension = path.extname(match.imageFile).toLowerCase() || ".jpg";
  const filename = `film-${String(index + 1).padStart(3, "0")}${extension}`;
  const imageUrl = `https://media.themoviedb.org/t/p/w342/${match.imageFile}`;
  const response = await fetch(imageUrl, { headers: requestHeaders });
  if (!response.ok) throw new Error(`Image download failed with ${response.status}`);

  const image = Buffer.from(await response.arrayBuffer());
  if (image.length < 1_000) throw new Error("Downloaded image is unexpectedly small");
  await writeFile(path.join(posterDirectory, filename), image);

  return {
    ...film,
    matchedTitle: match.matchedTitle,
    poster: `/posters/${filename}`,
    source: match.searchUrl,
  };
}

let previousResults = [];
try {
  previousResults = JSON.parse(
    await readFile(path.join(posterDirectory, "manifest.json"), "utf8"),
  );
} catch {}

const results = new Array(uniqueFilms.length);
let nextIndex = 0;

async function worker() {
  while (nextIndex < uniqueFilms.length) {
    const index = nextIndex++;
    const film = uniqueFilms[index];
    try {
      const previous = previousResults[index];
      if (previous?.poster && !previous.error && !posterOverrides[film.title]) {
        await access(path.join(root, "public", previous.poster));
        results[index] = previous;
        continue;
      }
      results[index] = await downloadPoster(film, index);
      process.stdout.write(`✓ ${index + 1}/200 ${film.title}\n`);
    } catch (error) {
      results[index] = { ...film, error: error.message };
      process.stderr.write(`✗ ${index + 1}/200 ${film.title}: ${error.message}\n`);
    }
  }
}

await Promise.all(Array.from({ length: 2 }, () => worker()));

const failures = results.filter((item) => item.error);
await writeFile(
  path.join(posterDirectory, "manifest.json"),
  `${JSON.stringify(results, null, 2)}\n`,
);

if (failures.length) {
  throw new Error(`${failures.length} posters could not be matched. See public/posters/manifest.json.`);
}

const posterMap = Object.fromEntries(results.map(({ title, poster }) => [title, poster]));
await writeFile(
  path.join(root, "app/posters.ts"),
  `// Generated by scripts/fetch-posters.mjs. Do not edit by hand.\n` +
    `const posters: Record<string, string> = ${JSON.stringify(posterMap, null, 2)};\n\n` +
    `export function posterFor(title: string): string | undefined {\n` +
    `  return posters[title];\n` +
    `}\n`,
);
