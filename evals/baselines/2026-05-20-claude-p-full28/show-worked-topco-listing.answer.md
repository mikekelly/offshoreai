All files are dated within the last week (well inside the 180-day freshness window), so no staleness flag is needed. Here's the walkthrough drawn from the corpus.

## Setting up a Jersey TopCo above your UK Opco, listing on the LSE

The end-state is a simple two-tier stack: public investors hold shares in a **Jersey TopCo**, which in turn owns 100% of your **UK operating company**, with the TopCo's shares admitted to the LSE (`knowledge/jersey/use-cases/founder-entrepreneur/worked-example-jersey-topco-uk-listing.md`).

```
        Public investors
              |
        [Jersey TopCo]  ← listed on LSE
              |
        [UK Opco Ltd]   ← trading business
```

One structural point worth flagging up front: because **the UK does not permit outbound continuance (re-domiciliation) to Jersey**, you can't simply migrate the existing UK company's seat. The standard route is to incorporate a *new* Jersey TopCo and slot it above the UK company via a share-for-share exchange — the "UK-Newco-Jersey approach" (`knowledge/jersey/use-cases/founder-entrepreneur/migration-pre-ipo.md`).

### Step 1 — Incorporate the Jersey TopCo
A Jersey **public company limited by shares** under the Companies (Jersey) Law 1991. Practical features: no-par-value issued shares are common (Jersey reformed away from authorised capital), at least two directors initially, a Jersey-resident corporate services provider for the registered office, and beneficial-ownership details lodged on the (private) Companies Registry. Incorporation takes roughly **1–3 days** (`knowledge/jersey/use-cases/founder-entrepreneur/worked-example-jersey-topco-uk-listing.md`).

### Step 2 — Share-for-share exchange
The UK shareholders exchange their UK Opco shares for new Jersey TopCo shares (typically 1:1). TopCo issues shares to them; they transfer their UK shares to TopCo; TopCo ends up owning 100% of the UK company. Tax points the corpus raises:
- **UK CGT**: TCGA s.135 share-for-share rollover relief is generally available (subject to anti-avoidance), deferring the gain.
- **UK stamp duty**: 0.5% potentially payable on transfer of the UK shares to TopCo, though reliefs may apply for genuine reorganisations — structure carefully to avoid "stamp duty leakage."
- **Jersey**: no Jersey tax event (no general CGT) (`knowledge/jersey/use-cases/founder-entrepreneur/worked-example-jersey-topco-uk-listing.md`).

### Step 3 — TopCo tax position
TopCo is Jersey-resident (incorporated there, managed and controlled there via Jersey-resident directors). Under the zero-ten regime it pays **0%** corporate income tax as a generic holding company (10% is for financial-services firms, 20% for utilities/property income etc.). There is also **no Jersey withholding tax** on dividends and **no Jersey CGT/IHT** at company or shareholder level (`knowledge/jersey/use-cases/founder-entrepreneur/worked-example-jersey-topco-uk-listing.md`, `knowledge/jersey/use-cases/founder-entrepreneur/why-jersey-topco.md`).

### Step 4 — Economic substance
The Taxation (Companies — Economic Substance) (Jersey) Law 2019 applies. A TopCo that *only* holds subsidiary shares falls under the **pure equity-holding** classification, which carries a **reduced substance test**: basic Companies-Law compliance (registered office, director/secretary, statutory records, annual confirmation) plus adequate people and premises — usually met by standard service-provider arrangements. Watch for "drift": adding intra-group lending pulls you into the financing classification (full substance), and holding IP pulls you into IP business (full substance) (`knowledge/jersey/use-cases/founder-entrepreneur/substance-for-topco.md`). A purely paper presence will be challenged (`knowledge/jersey/use-cases/founder-entrepreneur/why-jersey-topco.md`).

### Step 5 — Pillar Two check
If consolidated group revenue is **≥ EUR 750m**, Pillar Two engages. Jersey's MCIT Law 2025 introduced a 15% QDMTT-equivalent (effective 1 Jan 2025), so TopCo's Jersey income is **topped up to 15%** in Jersey rather than ceded to the UK under the IIR — i.e. the 0% advantage effectively disappears for large groups. Below the threshold, the 0% position holds (`knowledge/jersey/use-cases/founder-entrepreneur/worked-example-jersey-topco-uk-listing.md`, `knowledge/jersey/use-cases/founder-entrepreneur/why-jersey-topco.md`).

### Step 6 — Capital structure for IPO
CJL 1991 gives flexibility useful at IPO stage: multiple share classes (founder / investor / public), treasury shares, redeemable shares, buy-backs, and **capital reductions by special resolution + solvency statement** (no court process). Dual-class (super-voting) structures are permitted subject to protections (`knowledge/jersey/use-cases/founder-entrepreneur/worked-example-jersey-topco-uk-listing.md`).

### Step 7 — List on the LSE
Jersey TopCos are routinely accepted on the LSE Main Market and AIM. The listing-rule overlay sits *on top* of Jersey company law — Jersey law is the floor; the listing rules add further obligations and bind contractually:
- A **prospectus** is required (or an AIM admission document), with Jersey legal opinions and corporate-authority confirmations alongside UK securities counsel.
- The **UK Listing Rules**, Disclosure & Transparency Rules, Market Abuse Regulation (MAR) and Prospectus Regulation apply.
- The **UK Takeover Code** applies to Jersey companies admitted to a UK regulated market.
- Where they conflict, mandatory Jersey law prevails on corporate-law matters (e.g. you can't waive statutory directors' duties), but practical conflict is rare (`knowledge/jersey/use-cases/founder-entrepreneur/worked-example-jersey-topco-uk-listing.md`, `knowledge/jersey/use-cases/founder-entrepreneur/listing-rule-overlay.md`).

### Step 8 — Post-IPO governance and distributions
For Main Market Premium, the **UK Corporate Governance Code** applies (majority independent board, separate Chair/CEO, audit/remuneration/nomination committees, comply-or-explain). AIM is lighter, with a NOMAD providing ongoing guidance. The JFSC does not generally regulate the TopCo itself unless it carries on regulated business; Registry filings (annual return, beneficial ownership) continue, and keeping at least one Jersey-resident director supports substance. Dividends are paid on a **solvency basis** under CJL 1991 (no UK-style distributable-profits test), with 0% Jersey withholding — though UK-resident shareholders still pay UK income tax on dividends received (`knowledge/jersey/use-cases/founder-entrepreneur/worked-example-jersey-topco-uk-listing.md`, `knowledge/jersey/use-cases/founder-entrepreneur/listing-rule-overlay.md`).

### Key pitfalls the corpus flags
Stamp-duty leakage on the exchange; accidentally creating UK tax-residence for TopCo (manage board/decision-making in Jersey); under-estimating when the group will cross the Pillar Two threshold; and treating substance as a paper formality (`knowledge/jersey/use-cases/founder-entrepreneur/worked-example-jersey-topco-uk-listing.md`, `knowledge/jersey/use-cases/founder-entrepreneur/why-jersey-topco.md`).

One caveat: every source here carries `status: draft`, so treat it as orientation rather than verified legal advice — Jersey corporate counsel and UK tax/securities advisers should confirm the specifics.

---

### Files cited
1. `knowledge/jersey/use-cases/founder-entrepreneur/worked-example-jersey-topco-uk-listing.md`
2. `knowledge/jersey/use-cases/founder-entrepreneur/why-jersey-topco.md`
3. `knowledge/jersey/use-cases/founder-entrepreneur/migration-pre-ipo.md`
4. `knowledge/jersey/use-cases/founder-entrepreneur/listing-rule-overlay.md`
5. `knowledge/jersey/use-cases/founder-entrepreneur/substance-for-topco.md`
