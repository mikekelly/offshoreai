// register.* — read-only access to Jersey statutory registers (PRD §7.3).
//
// JFSC public register, Jersey companies register, charities register.
// Some surfaces are screen-scraped with caching (cheerio for HTML
// parsing); results are clearly marked "scraped, accessed at T".
// v1 launches read-only; never writes to any government system.

import { z } from "zod";
import { helpBlock, isoDate } from "./common.js";

export const registerKind = z.enum(["jfsc", "companies", "charities"]);
export type RegisterKind = z.infer<typeof registerKind>;

export const provenance = z.enum(["api", "scraped"]);

// ===========================================================================
// 1. register.lookupCompany
// ===========================================================================

export const lookupCompanyInput = z.object({
  identifier: z.string().min(1).describe("Company number (e.g. '12345') or registered name (exact or fuzzy)."),
  matchMode: z.enum(["exact", "fuzzy"]).default("exact"),
});

export const lookupCompanyResult = z.object({
  candidates: z.array(z.object({
    registeredNumber: z.string(),
    registeredName: z.string(),
    type: z.string().describe("Public / private / cell / LLC / LLP / partnership variant per Companies Law 1991."),
    status: z.string().describe("Active / dissolved / in liquidation / continuance out."),
    incorporatedOn: isoDate.nullable(),
    registeredAddress: z.string().nullable(),
    provenance,
    fetchedAt: isoDate,
  })),
  help: helpBlock,
});
export type LookupCompanyResultType = z.infer<typeof lookupCompanyResult>;

export const lookupCompanyDescription = `
Look up a Jersey-registered entity in the JFSC companies registry by
registered number or by name (exact or fuzzy match). Returns the
public-record fields only — beneficial ownership data is held in the
non-public FSDI register and is not exposed by this tool.

Use when: a user names a specific Jersey company and you need its
basic registry data (number, type, status, incorporation date); you
are verifying a corpus citation that references a specific entity;
the question turns on whether an entity is still active vs dissolved
or in continuance-out.

Do NOT use this for beneficial-ownership questions — the BO register
is non-public; the corpus has the regulatory framework but no live
BO lookups. Do NOT use it for foreign companies — the registry is
Jersey-only. Do NOT rely on fuzzy matches for high-stakes
identification; ask the user to confirm the registered number when
ambiguous.

Relationships: pairs with register.lookupJfscPermission when the
question is "does this entity hold a regulated permission". Pairs
with corpus.getFile on jersey/companies/ for the legal framework
governing whatever the registry surfaces. Pairs with
primarySource.fetch on the JFSC registry URL when the user wants
the live HTML evidence rather than the cached scrape.

Returns: candidate entities with their public registry fields and a
provenance flag (api vs scraped). For scraped results, always
surface the fetchedAt timestamp to the user — registry contents
can change between fetches.
`.trim();

// ===========================================================================
// 2. register.lookupCharity
// ===========================================================================

export const lookupCharityInput = z.object({
  identifier: z.string().min(1).describe("Charity number or registered name (exact or fuzzy)."),
  matchMode: z.enum(["exact", "fuzzy"]).default("exact"),
});

export const lookupCharityResult = z.object({
  candidates: z.array(z.object({
    charityNumber: z.string(),
    registeredName: z.string(),
    section: z.enum(["general", "restricted", "historic"]).describe("Three sections of the Jersey charity register per Charities Law 2014."),
    purposes: z.array(z.string()),
    status: z.string(),
    registeredOn: isoDate.nullable(),
    provenance,
    fetchedAt: isoDate,
  })),
  help: helpBlock,
});
export type LookupCharityResultType = z.infer<typeof lookupCharityResult>;

export const lookupCharityDescription = `
Look up a Jersey-registered charity by charity number or name. The
Jersey charity register has three sections (general, restricted,
historic) per the Charities Law 2014; the section is included in
the response because it materially affects what the charity can
publish about itself and what donors / regulators see.

Use when: a user names a Jersey-registered charity and you need its
registry data; you are verifying a corpus citation about charitable
purposes or public-benefit; the question turns on which section of
the register the charity sits in.

Do NOT use this for non-Jersey charities (the UK Charity Commission
register and Irish CRA register are different surfaces, not covered
here). Do NOT rely on charity registration to prove tax-exempt
status under Article 115 ITL — that is a separate Revenue Jersey
determination; cite the corpus's tax/charities files for the
interaction rules.

Relationships: pairs with corpus.getFile on jersey/charities/ for
the regulatory framework. Pairs with primarySource.fetch on the
Charity Commissioner's register URL for the live HTML.

Returns: candidate charities with section, purposes, status, and
provenance. Surface the section to the user — donors and regulators
treat the three sections very differently.
`.trim();

// ===========================================================================
// 3. register.lookupJfscPermission
// ===========================================================================

export const lookupJfscPermissionInput = z.object({
  entityName: z.string().min(1),
  permissionClass: z.enum([
    "tcb",
    "fund-services-business",
    "investment-business",
    "general-insurance-mediation",
    "money-services-business",
    "banking-business",
    "insurance-business",
  ]).optional().describe("Restrict to a single regulated-activity class; omit for all classes."),
});

export const lookupJfscPermissionResult = z.object({
  matches: z.array(z.object({
    entityName: z.string(),
    registeredNumber: z.string().nullable(),
    permissionClasses: z.array(z.string()),
    principalPersons: z.array(z.string()).describe("Public principal-person names per JFSC register."),
    conditions: z.array(z.string()).describe("Public conditions on the permission, if any."),
    provenance,
    fetchedAt: isoDate,
  })),
  help: helpBlock,
});
export type LookupJfscPermissionResultType = z.infer<typeof lookupJfscPermissionResult>;

export const lookupJfscPermissionDescription = `
Look up an entity in the JFSC public register of regulated-permission
holders. Optionally filter by permission class (TCB,
fund-services-business, investment-business, GIMB, MSB,
banking-business, insurance-business). Surfaces public-record fields
only; the JFSC's internal supervisory data is not exposed.

Use when: a user asks whether a named entity holds a JFSC
permission, or which permission classes it holds; you are
verifying a corpus citation that references a regulated entity;
the question turns on whether a principal person is on the public
register.

Do NOT use this for fitness-and-properness questions — the
fit-and-proper test is JFSC-internal; the public register only
shows that someone passed it as of a date, not the underlying
data. Do NOT use it to enumerate the full population of TCB
licensees — the register UI does not support bulk export; the
corpus file jersey/financial-regulation/jfsc.md covers the
population-level summary.

Relationships: pairs with register.lookupCompany when you want
both the corporate and the regulatory picture for the same entity.
Pairs with corpus.getFile on jersey/financial-regulation/ for the
legal framework. Pairs with primarySource.fetch on the JFSC
register page for live evidence.

Returns: matching entities with their permission classes, public
principal persons, and any public conditions. For principal-person
hits, never editorialise about competence — public-register
presence is a binary signal only.
`.trim();
