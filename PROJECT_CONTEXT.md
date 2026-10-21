# 📘 Contexto do Projeto e Diretrizes de Engenharia

> **Aviso para Agentes de Inteligência Artificial e Desenvolvedores:**  
> Este documento é a **fonte primária de diretrizes técnicas e operacionais** do projeto **Método 3 Acordes**. Qualquer agente de qualquer modelo (Gemini, Claude, GPT, etc.) ou desenvolvedor humano **DEVE** ler, respeitar e aplicar integralmente estes padrões antes de propor, modificar ou aprovar código neste repositório.

---

## 🎯 1. Visão do Produto e Negócio

- **Produto:** Método Louvor em 3 Acordes (Curso digital / Apostila de violão prático focado em música cristã).
- **Público-alvo:** Cristãos (evangélicos e católicos), iniciantes do absoluto zero, pessoas de 30 a 65+ anos que possuem um violão parado e sonham em tocar louvores em casa, no culto doméstico e na congregação.
- **Plataforma de Pagamento:** Cakto (`https://pay.cakto.com.br/wtd6not_1074745`).
- **Oferta:** De R$ 197 por **R$ 27,90** (pagamento único) + 4 Super Bônus inclusos.
- **Domínio Principal:** `https://metodo3acordes.shop/`

---

## 🚦 2. Fluxo Obrigatório de Trabalho (Git, Issues e PRs)

Nenhum código entra diretamente na branch principal (`main`). Todas as alterações devem seguir este ciclo:

```
[Issue no GitHub] ➔ [Feature Branch] ➔ [Validação / Testes] ➔ [Pull Request Padronizado] ➔ [Merge na Main]
```

### A. Categorização Obrigatória de Issues
Toda tarefa deve possuir uma Issue no GitHub categorizada com uma das seguintes labels:
1. `Correção` (Cor Vermelha): Para bugs, quebras visuais, falhas de script ou links inoperantes.
2. `Melhoria` (Cor Azul): Para aprimoramentos de UI/UX, animações, performance, SEO ou copy.
3. `Nova função` (Cor Verde): Para novas páginas, modais, integrações de tracking ou ferramentas.

### B. Estrutura Obrigatória de Todo Pull Request
Todo PR aberto no repositório deve conter obrigatoriamente as 4 seções abaixo:

```markdown
### 📌 Issue Relacionada
Closes #<número_da_issue> (ou Ref #<número>)

### 📝 O que mudou
- Explicação detalhada e concisa das modificações realizadas no código e no design.

### 🧪 Como foi validado
- Procedimentos de teste executados (ex: navegadores testados, viewport mobile 375px/430px, integridade de links, console sem erros, testes automatizados).

### ⚠️ Riscos, limitações e próximos passos
- Possíveis impactos colaterais, limitações conhecidas da solução e ações subsequentes recomendadas.
```

---

## 🎨 3. Diretrizes de UI/UX e Motion Principles

Baseado no framework de **Kyle Zantos / Emil Kowalski / Jakub Krehel**:

### A. Princípios de Movimento
1. **Curvas de Aceleração com Propósito:**
   - Para interações de UI: use `--ease-out: cubic-bezier(0.23, 1, 0.32, 1)`.
   - Evite `ease-in` em componentes de interface (faz o elemento parecer lento e travado).
   - Duração máxima de 180ms a 300ms para micro-interações.
2. **Nunca animar de `scale(0)`:**
   - Comece de `scale(0.95)` combinado com `opacity: 0`.
3. **Feedback Tátil Imediato (Active State):**
   - Em todo botão ou cartão clicável, use `active:scale(0.97)` com transição de 70-100ms.
4. **Respeito a `prefers-reduced-motion`:**
   - Usuários com sensibilidade vestibular devem receber transições suaves de opacidade em vez de movimentos bruscos de translação.

### B. Elementos Obrigatórios de Interface
- **Lazy Loading & Performance:** Imagens abaixo da dobra devem ter `loading="lazy"` e `decoding="async"`. Imagens do Hero usam `loading="eager"` e `fetchpriority="high"`.
- **Skeleton Screens:** Estados de carregamento de imagens e mídias devem apresentar skeleton visual de alta fidelidade com shimmer sutil.
- **Progresso e Feedback Visual:** Botões com feedback tátil, player com barra de áudio animada, toast com tempo de expiração visível.
- **Sensação Nativa no Celular (Mobile-First):**
  - Viewport com `viewport-fit=cover`.
  - Suporte a `safe-area-inset-bottom` em barras fixas.
  - `-webkit-tap-highlight-color: transparent`.
  - `touch-action: manipulation` para eliminar o delay de 300ms do Safari/Chrome.
  - Hover restrito a `@media (hover: hover) and (pointer: fine)`.

---

## 🏛️ 4. Padrões de Arquitetura e Engenharia

1. **Evitar Overengineering:**
   - O projeto é uma landing page de alta conversão. Mantenha o código limpo, rápido e sem dependências pesadas desnecessárias (evitar frameworks inchados quando HTML5 + Tailwind + Vanilla JS entregam nota 100 no PageSpeed).
2. **Evitar Bottlenecks:**
   - Scripts de tracking (Meta Pixel, UTMify, Sentry) devem carregar de forma assíncrona (`async defer`), nunca bloqueando o First Contentful Paint (FCP).
3. **Componentização e Reutilização:**
   - Não recriar componentes já existentes. Mantenha os padrões visuais unificados (mesmas cores de dourado `#F59E0B`, mesmos raios de borda `rounded-2xl`, mesma escala tipográfica).
4. **DRY com Critério:**
   - Centralizar lógicas críticas (como o repasse de parâmetros UTM para a Cakto) em funções modulares.

---

## 🛡️ 5. Segurança, Observabilidade e Conformidade Legal

- **LGPD e CDC:** O site deve dispor de Termos de Uso claros e Política de Privacidade transparente, informando o direito de arrependimento de 7 dias (Art. 49 do CDC) e a plataforma de pagamento (Cakto).
- **Observabilidade:** Monitoramento assíncrono de erros client-side via Sentry para prevenir falhas de checkout silenciosas.
- **Rate Limit e Debounce:** Proteção contra cliques duplos rápidos nos botões de compra.
- **Preservação de UTMs:** Todo link de checkout DEVE anexar automaticamente os parâmetros da URL de origem (`utm_source`, `utm_medium`, `utm_campaign`, etc.) para garantir o rastreamento preciso de campanhas de tráfego pago.
