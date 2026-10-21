# Método 3 Acordes — Landing Page de Alta Conversão 🎸✝️

Landing page otimizada e responsiva para o infoproduto **"Método Louvor em 3 Acordes"**, desenvolvida para cristãos iniciantes que desejam aprender a tocar louvores no violão de forma rápida, sem pestanas e sem teorias complicadas.

---

## 🚀 Destaques da Nova Versão

- **Mecanismo Único (Dedos Âncora):** Diagramas SVG anatômicos demonstrando a transição facilitada entre Sol (G), Dó com Nona (C9) e Ré (D).
- **Stack de Oferta Irresistível:** Ancoragem de R$ 355 por apenas **R$ 27,90** com 4 Super Bônus Inclusos.
- **Tabela Comparativa:** Aulas tradicionais vs. YouTube vs. Método 3 Acordes.
- **Mobile First & Sticky CTA Bar:** Botão fixo no rodapé no mobile para conversão com um toque.
- **Rastreamento Avançado de Vendas:**
  - Repasse automático de parâmetros UTM (`utm_source`, `utm_medium`, `utm_campaign`, etc.) para o checkout da Cakto.
  - Meta Pixel (`1289702746464363`) com rastreamento de `PageView` e `InitiateCheckout`.
  - UTMify integrado (`pixelId = 6ad3dc4dc5ff596d9a5f4f9d`).
- **Garantia Blindada de 7 Dias:** Risco zero na Cakto com selo de garantia incondicional.
- **Prova Social Dinâmica:** Notificação rotativa no canto inferior simulando vendas recentes reais em cidades brasileiras.

---

## 🔗 Integrações

- **Checkout Cakto:** `https://pay.cakto.com.br/wtd6not_1074745`
- **Domínio de Produção:** `https://metodo3acordes.shop/`

---

## 📁 Estrutura de Arquivos

```
metodo3acordes/
├── index.html                           # Landing page completa (HTML5 + Tailwind + JS)
├── assets/
│   ├── hero-violao-biblia-BblVi23x.jpg  # Imagem da primeira dobra
│   ├── mockup-ebook-CsRDhrHR.jpg        # Mockup 3D da apostila e bônus
│   ├── familia-louvor-CSSx-gn5.jpg      # Foto de culto doméstico em família
│   └── favicon.ico                      # Ícone do site
└── README.md
```

---

## ⚡ Como Rodar Localmente

Basta abrir o arquivo `index.html` em qualquer navegador ou rodar um servidor HTTP simples:

```bash
# Com Python 3
python3 -m http.server 8080

# Ou com Node / npx
npx serve .
```

---

## 🌐 Como Publicar (Deploy)

Você pode conectar este repositório diretamente na **Vercel**, **Cloudflare Pages** ou **Netlify**:
1. Conecte sua conta do GitHub.
2. Selecione o repositório `metodo3acordes`.
3. Framework preset: **Other / Static HTML** (Build command vazio, Output directory: `./`).
4. Aponte seu domínio personalizado `metodo3acordes.shop` nas configurações de DNS!
