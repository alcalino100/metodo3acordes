import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const htmlContent = fs.readFileSync(path.join(rootDir, "index.html"), "utf-8");

test("HTML Structure & Head Requirements", () => {
  assert.match(htmlContent, /<!DOCTYPE html>/i, "Deveria ter doctype HTML5");
  assert.match(
    htmlContent,
    /<html\s+lang=["']pt-BR["']/i,
    "Idioma deve ser pt-BR",
  );
  assert.match(
    htmlContent,
    /viewport-fit=cover/i,
    "Viewport deve ter viewport-fit=cover para mobile",
  );
  assert.match(
    htmlContent,
    /<title>.*Método.*3 Acordes.*<\/title>/i,
    "Title deve conter nome do produto",
  );
  assert.match(
    htmlContent,
    /name=["']description["']/i,
    "Deveria ter meta description",
  );
  assert.match(
    htmlContent,
    /property=["']og:title["']/i,
    "Deveria ter OpenGraph title",
  );
  assert.match(
    htmlContent,
    /property=["']og:image["']/i,
    "Deveria ter OpenGraph image",
  );
});

test("Checkout Cakto & Tracking Integration", () => {
  const checkoutUrl = "https://pay.cakto.com.br/wtd6not_1074745";
  assert.ok(
    htmlContent.includes(checkoutUrl),
    "Link de checkout da Cakto deve estar presente",
  );

  // Garantir que o Meta Pixel está configurado com o ID correto
  assert.match(
    htmlContent,
    /1289702746464363/,
    "Meta Pixel ID 1289702746464363 deve estar no código",
  );
  assert.match(
    htmlContent,
    /fbq\(['"]track['"],\s*['"]PageView['"]\)/,
    "PageView do Pixel deve ser disparado",
  );
  assert.match(
    htmlContent,
    /InitiateCheckout/,
    "InitiateCheckout deve ser chamado nos cliques de compra",
  );
});

test("UTM Forwarding Functionality", () => {
  // Simular a lógica de forwardUtms
  function forwardUtms(checkoutBaseUrl, currentSearch) {
    if (!currentSearch) return checkoutBaseUrl;
    const url = new URL(checkoutBaseUrl);
    const searchParams = new URLSearchParams(currentSearch);
    for (const [key, value] of searchParams.entries()) {
      url.searchParams.set(key, value);
    }
    return url.toString();
  }

  const base = "https://pay.cakto.com.br/wtd6not_1074745";
  const search = "?utm_source=facebook&utm_campaign=blackfriday&src=bio";
  const result = forwardUtms(base, search);

  assert.ok(
    result.includes("utm_source=facebook"),
    "Deve preservar utm_source",
  );
  assert.ok(
    result.includes("utm_campaign=blackfriday"),
    "Deve preservar utm_campaign",
  );
  assert.ok(result.includes("src=bio"), "Deve preservar src");
  assert.ok(result.startsWith(base), "Deve manter a base da Cakto intacta");
});

test("Integridade de Ativos Locais (Imagens)", () => {
  const assetRegex = /src=["'](assets\/[^"']+)["']/g;
  const foundAssets = new Set();
  const matches = htmlContent.matchAll(assetRegex);

  for (const match of matches) {
    foundAssets.add(match[1]);
  }

  assert.ok(
    foundAssets.size > 0,
    "Deve haver imagens referenciadas em assets/",
  );

  for (const assetRelPath of foundAssets) {
    const fullPath = path.join(rootDir, assetRelPath);
    assert.ok(
      fs.existsSync(fullPath),
      `Arquivo de imagem referenciado deve existir no disco: ${assetRelPath}`,
    );
  }
});

test("Garantia de Links Seguros (Sem HTTP inseguro)", () => {
  const insecureLinkRegex = /href=["']http:\/\/[^"']+["']/g;
  const matches = htmlContent.match(insecureLinkRegex) || [];
  assert.strictEqual(
    matches.length,
    0,
    `Não deve haver links inseguros HTTP: ${matches.join(", ")}`,
  );
});

test("Seções Críticas do Funil de Vendas Presentes", () => {
  // Hero, Player de Louvor, Método 3 Acordes, Bônus, Depoimentos, Garantia 7 dias, FAQ, CTA
  assert.match(
    htmlContent,
    /R\$\s*27,90/i,
    "Preço da oferta R$ 27,90 deve estar visível",
  );
  assert.match(
    htmlContent,
    /Garantia.*7 Dias/i,
    "Garantia legal de 7 dias (CDC) deve estar presente",
  );
  assert.match(
    htmlContent,
    /Perguntas Frequentes/i,
    "Seção de FAQ deve existir",
  );
  assert.match(htmlContent, /BÔNUS EXCLUSIVOS/i, "Seção de Bônus deve existir");
  assert.match(
    htmlContent,
    /playChordAudio/i,
    "Player interativo de áudio deve estar presente com sintetizador de acordes",
  );
});

test("Motion Principles, Skeletons e Tangibilidade Visual", () => {
  assert.match(
    htmlContent,
    /skeletonShimmer/,
    "Animação de shimmer de skeleton deve estar no CSS",
  );
  assert.match(
    htmlContent,
    /soundwavePulse/,
    "Animação de barras de som (soundwave) deve existir",
  );
  assert.match(
    htmlContent,
    /assets\/mockup-ebook-CsRDhrHR\.jpg/,
    "Mockup 3D deve estar inserido na oferta",
  );
  assert.match(
    htmlContent,
    /audioVisualizer/,
    "Equalizador visual do player de áudio deve estar no DOM",
  );
});

test("Conformidade Legal (CDC Art. 49 e LGPD)", () => {
  assert.match(
    htmlContent,
    /legal-modal/,
    "Modal legal deve estar presente no DOM",
  );
  assert.match(
    htmlContent,
    /openLegalModal/,
    "Função de abertura de modais legais deve existir",
  );
  assert.match(
    htmlContent,
    /Código de Defesa do Consumidor/i,
    "Menção explícita ao CDC deve estar presente",
  );
  assert.match(
    htmlContent,
    /Lei Geral de Proteção de Dados/i,
    "Menção explícita à LGPD deve estar presente",
  );
  assert.match(
    htmlContent,
    /suporte@metodo3acordes\.shop/,
    "E-mail de suporte oficial deve constar nos documentos legais",
  );
});

test("Observabilidade Client-Side (Sentry e Error Boundary)", () => {
  assert.match(
    htmlContent,
    /sentry-cdn\.com/i,
    "Script do SDK do Sentry deve estar incluído de forma assíncrona",
  );
  assert.match(
    htmlContent,
    /captureException/i,
    "Error boundary global deve capturar exceções para o Sentry",
  );
  assert.match(
    htmlContent,
    /unhandledrejection/i,
    "Tratamento de rejeições não capturadas de Promises deve existir",
  );
});

test("Segurança e Sanitização de Parâmetros de Checkout", () => {
  assert.match(
    htmlContent,
    /noopener noreferrer/i,
    "Links de saída devem conter rel noopener noreferrer",
  );
  assert.match(
    htmlContent,
    /RATE_LIMIT_MS/i,
    "Proteção de rate limiting / debounce contra spam de cliques deve existir",
  );
});

test("Tracking Template (Atribuição Avançada e Telemetria)", () => {
  const tJsPath = path.join(rootDir, "assets", "t.js");
  assert.ok(
    fs.existsSync(tJsPath),
    "Script assets/t.js deve existir no projeto",
  );

  assert.match(
    htmlContent,
    /<script[^>]+src=["']assets\/t\.js["']/i,
    "Tag script de assets/t.js deve estar presente no HTML",
  );
  assert.match(
    htmlContent,
    /data-id=["'][^"']+["']/,
    "Atributo data-id deve estar configurado no script de tracking",
  );

  const tJsContent = fs.readFileSync(tJsPath, "utf-8");
  assert.match(
    tJsContent,
    /_rt_vid/,
    "Deve gerar ou recuperar visitorId _rt_vid",
  );
  assert.match(
    tJsContent,
    /_rt_sid/,
    "Deve gerar ou recuperar sessionId _rt_sid",
  );
  assert.match(
    tJsContent,
    /utm_source/,
    "Deve capturar e armazenar parâmetros de UTM",
  );
  assert.match(
    tJsContent,
    /window\.Tracker/,
    "Deve exportar a API pública window.Tracker",
  );
});
