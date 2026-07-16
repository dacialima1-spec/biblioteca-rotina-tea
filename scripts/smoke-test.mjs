import { spawn } from "node:child_process";
import { readFile } from "node:fs/promises";

const port = 3100;
const server = spawn(process.execPath, ["node_modules/next/dist/bin/next", "start", "-H", "127.0.0.1", "-p", String(port)], {
  cwd: process.cwd(),
  env: { ...process.env, HOSTNAME: "127.0.0.1", PORT: String(port) },
  stdio: ["ignore", "pipe", "pipe"]
});

let output = "";
server.stdout.on("data", (chunk) => { output += chunk.toString(); });
server.stderr.on("data", (chunk) => { output += chunk.toString(); });

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const content = JSON.parse(await readFile("content/recursos-completos.json", "utf8"));
const resourcePaths = content.recursos.map((resource) => [resource.id, resource.arquivoVisual, resource.arquivoImpressao]);
const uniquePdfs = [...new Set(content.recursos.map((resource) => resource.arquivoImpressao))];
const paths = [
  "/",
  "/biblioteca",
  "/favoritos",
  "/registros",
  "/manifest.webmanifest",
  "/personagens/nino.svg",
  ...resourcePaths.flatMap(([id, image]) => [`/recurso/${id}`, `/registrar/${id}`, image]),
  ...uniquePdfs
];

let exitCode = 0;
try {
  let ready = false;
  for (let attempt = 0; attempt < 30; attempt += 1) {
    await wait(200);
    try {
      const response = await fetch(`http://127.0.0.1:${port}/`);
      if (response.ok) { ready = true; break; }
    } catch {}
  }
  if (!ready) throw new Error(`Servidor não iniciou.\n${output}`);

  const results = [];
  for (const path of paths) {
    const response = await fetch(`http://127.0.0.1:${port}${path}`);
    results.push({ path, status: response.status, contentType: response.headers.get("content-type") });
    if (!response.ok) throw new Error(`${path} retornou ${response.status}`);
  }
  console.log(JSON.stringify({
    status: "aprovado",
    paginasEAtivosValidados: results.length,
    recursosValidados: resourcePaths.length,
    pdfsValidados: uniquePdfs.length,
    falhas: []
  }, null, 2));
} catch (error) {
  exitCode = 1;
  console.error(error);
} finally {
  server.kill("SIGTERM");
  await wait(150);
  process.exit(exitCode);
}
