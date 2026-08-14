# AI Search Readiness (GEO) — Evidence Log

**Score: 10/100** · Audited 2026-08-14

## AI crawler access — blocked by default

From the live `robots.txt` (Cloudflare managed):

```
User-agent: *
Content-Signal: search=yes,ai-train=no,use=reference
Allow: /
```

| Crawler | Platform | Status |
|---|---|---|
| GPTBot | ChatGPT / OpenAI | **Disallow: /** |
| ClaudeBot | Claude / Anthropic | **Disallow: /** |
| Google-Extended | Gemini grounding & training | **Disallow: /** |
| CCBot | Common Crawl (feeds many models) | **Disallow: /** |
| Applebot-Extended | Apple Intelligence | **Disallow: /** |
| Bytespider | ByteDance / Doubao | **Disallow: /** |
| meta-externalagent | Meta AI | **Disallow: /** |
| Amazonbot | Alexa / Rufus | **Disallow: /** |
| Googlebot | **Google Search** | Allowed ✓ |
| Bingbot | **Bing Search** | Allowed ✓ |

Core search indexing is unaffected — Googlebot and Bingbot are allowed, and `Content-Signal: search=yes` explicitly permits search indexing. What is blocked is AI-mediated discovery: Manokamana cannot currently be cited by ChatGPT, Claude, Perplexity, or Meta AI.

Note the nuance on Google AI Overviews: `Google-Extended` governs Gemini training and grounding, **not** core Search indexing. AI Overviews draw partly on the standard Search index, so some AI Overview exposure survives. The overall stance, however, is maximally restrictive.

This is Cloudflare's default AI-blocking posture, wrapped in `# BEGIN/END Cloudflare Managed content` markers. It was almost certainly enabled by a Cloudflare dashboard toggle rather than a considered content-licensing decision.

## The compounding problem

Even if every crawler above were allowed, they would mostly see nothing. The raw HTML is 942 bytes with an empty `<div id="root">`. AI crawlers that do not execute JavaScript — which is most of them — would index an empty page.

**Both problems must be fixed together.** Opening `robots.txt` without prerendering achieves nothing; prerendering without opening `robots.txt` achieves nothing for AI. Either fix alone is wasted work.

## Citability of the content itself

This is the frustrating part: the content is unusually well suited to AI citation, and none of it is reachable.

AI engines quote self-contained passages that answer a question directly. This site has several:

- **Definitional opener** — *"Hire purchase is one of the most common ways Nepalis own a vehicle or machine without paying the full price up front. You take delivery today, use the asset immediately, and pay for it in fixed monthly instalments over an agreed term."* Textbook citable passage.
- **A quotable heuristic** — *"your income should be at least twice the EMI amount"* — a specific, memorable rule that AI answers love to attribute.
- **Five FAQ pairs** on the homepage in clean Q&A form — the single most citation-friendly structure there is.
- **Document checklists** — enumerable, factual, low-ambiguity.
- **Structured service categories** with concrete asset lists.

The writing quality is not the bottleneck. Access is.

## llms.txt

`/llms.txt` returns the SPA shell (HTTP 200, `text/html`) rather than a real file.

Worth adding **only if** AI crawler access is opened. Be clear-eyed about it: Google Search ignores `llms.txt` entirely, adoption among AI platforms is inconsistent, and it is not a ranking factor. It is a low-cost bet on an emerging convention, not a fix.

## Brand mention signals

Not measurable in this audit — no DataForSEO or LLM-mention-tracking credentials configured. Off-site brand mentions in Nepali finance media, business directories, and MV Dugar Group coverage would be the main lever for AI visibility independent of crawler access, since AI models cite entities they have encountered across many sources, not only via direct crawl.

## The decision to make

| Option | AI discovery | Training exposure |
|---|---|---|
| Keep blocking (status quo) | None | None |
| **Allow citation crawlers, keep `ai-train=no`** | GPTBot, ClaudeBot, PerplexityBot can cite with attribution | Still restricted |
| Allow all | Maximum | Full |

The middle option is what I would recommend for a local lender competing on trust and referral — but it is a business call about content licensing, not a technical default, and it should be made explicitly.

Note that this decision becomes unavoidable at the moment you write your own `public/robots.txt` (Action Plan 1.2), since that file overrides Cloudflare's managed one. Decide before you ship it, not after.
