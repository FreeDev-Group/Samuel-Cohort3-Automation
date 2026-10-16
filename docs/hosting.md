# Hosting comparison and recommendation

> Prices checked on the official websites on **13 October 2026**, without being logged in, with the default region of each site. Hostinger's checkout prices were rechecked on **16 October 2026** using the `MM10` coupon for a 12-month subscription. Promotional prices change often: **re-check the checkout page before paying.** Nothing has been bought.

## Recommendation

**Hostinger — "Unlimited" web hosting plan (successor of the former "Business" plan), 12-month term, data center: France (Paris) or the Netherlands.**

- **Year 1 (paid by the FreeDev team): US$ 53.89** — total displayed at checkout for 12 months with coupon `MM10`, checked on 16 October 2026. No purchase made.
- **From year 2 (paid by Seed of Hope / LePhare): US$ 16.99/month on a 12-month renewal = US$ 203.88/year.** Renewal price confirmed at checkout on 16 October 2026. Re-check before purchase, as prices and promotions can change.
- The displayed promotional rate is **US$ 4.49/month**. Multiplying this displayed rate by 12 gives US$ 53.88; the checkout total displayed is US$ 53.89. Use the actual checkout total for budgeting.
- At renewal time, compare the 24- and 48-month terms on the checkout page: longer terms are usually cheaper per month.
- Create the account with a **dedicated project email address** (for example `seedofhope.website@…`), not a personal one. At handover we give that mailbox to Seed of Hope and they change the password and the card.

Why this one:

1. **Automatic deployment from GitHub works out of the box**: SSH + rsync on port 65002, no IP allow-list. (o2switch blocks SSH except for at most 5 allow-listed IPs, which does not work with GitHub's changing runner IPs.)
2. **Everything the mentees need is in one simple panel (hPanel)**: one-click WordPress, staging, daily backups with one-click restore, free SSL, mailboxes, Git, SSH and WP-CLI.
3. **Support and interface in French** (hostinger.fr), which matters for Seed of Hope in Bukavu after handover; Namecheap only supports English.
4. **Visa accepted.** No mobile money option was found on any of the three providers.

The budget alternative is **Namecheap Stellar Plus** (about half the price over 3 years, according to the original comparison). It is a valid choice if cost matters more than French support and built-in staging. See the comparison below.

## Comparison

| Criteria | **Hostinger Unlimited (ex-Business)** | **o2switch Cloud.** | **Namecheap Stellar Plus** |
| --- | --- | --- | --- |
| Year-1 price, 12-month term | **US$ 53.89** (US$ 4.49/mo displayed; checkout total with coupon `MM10`, checked 16 October 2026) | **€22.32 excl. VAT** (€1.86/mo) — €26.78 incl. 20% French VAT [^vat] | **US$ 35.76** (US$ 2.98/mo) |
| Renewal price | US$ 16.99/mo (US$ 203.88/yr on 12 months) | €16.00 excl. VAT/mo, billed yearly (€192.00/yr) | US$ 7.88/mo (US$ 94.56/yr) |
| **Real cost over 1 year** | **US$ 53.89** | **€22.32** excl. VAT | **US$ 35.76** |
| **Real cost over 3 years** (1-yr term, renewed twice) | **US$ 461.65** (US$ 53.89 + 2 × US$ 203.88) | **€406.32** excl. VAT | **US$ 224.88** |
| Cheapest 3-year route | 48-month term displayed at **US$ 172.32 for 4 years** with coupon `MM10` on 16 October 2026; renewal displayed at US$ 16.99/mo. Recheck at checkout. | Same (annual billing only) | 2-year term US$ 54.72, then 1 yr at US$ 94.56 = US$ 149.28 |
| Your earlier figures | "3.99 $/mo over 48 months, renews 16.99 $" — older promotional rate; the current page displayed US$ 172.32 for 48 months with coupon `MM10` and US$ 4.49/mo for the 12-month offer. | "≈27 € TTC year 1, then 16 € HT/mo" — **correct according to the original comparison** | "≈2.48 $/mo year 1" — **outdated according to the original comparison: now 2.98 $/mo** (yearly) |
| Minimum commitment | 1 month (US$ 18.99/mo, no discount) | 12 months (annual payment only) | 1 month (US$ 7.88/mo, no discount) |
| Money-back | 30 days | 30 days | 30 days (not with the free trial) |
| SSH / WP-CLI | Yes (port 65002), WP-CLI preinstalled | Yes, **but only from ≤ 5 allow-listed IPs** ✗ for GitHub Actions | Yes (jailed shell) |
| Git deployment | hPanel Git + SSH/rsync from GitHub Actions | cPanel Git Version Control (SSH allow-list issue) | cPanel Git Version Control + SSH/rsync |
| Staging | Yes, built-in WordPress staging (Business tier and above) | Yes, "WPTiger" pre-production | Via Softaculous (less integrated) |
| Daily backups | Yes, daily + restore in hPanel | Yes, daily, 45 days kept (Cloud.) | AutoBackup: 1/day, keeps 6 daily, 3 weekly, 5 monthly (25 GB cap) + server backups twice a week |
| Free SSL | Yes (Let's Encrypt, automatic) | Yes (Let's Encrypt) | Yes (automatic installation) |
| Email | Unlimited mailboxes — **free for year 1 only** | Unlimited mailboxes | Unlimited mailboxes |
| Free domain | Year 1 only | Included every year (Cloud./Pro.) | Year 1 only |
| Server location | Choice at order: FR, DE, NL, LT, UK, US, BR, IN, ID, MY | Clermont-Ferrand, France only | US, UK, EU, Singapore |
| Speed for Central & East Africa | Same for all three: no African data center; Europe is the best choice (traffic from Bukavu and Kampala mostly goes through European exchange points). Hostinger's CDN also has a Johannesburg point of presence. | Europe (France) | Europe |
| Payment methods | Visa/Mastercard, PayPal (varies by country); no mobile money found | Card (at checkout) | Visa, Mastercard, Amex, PayPal, Bitcoin |
| Support in French | **Yes** (hostinger.fr, 24/7 chat) | **Yes** (French company, 24/7, phone) | No (English 24/7 chat) |
| Control panel | hPanel (simplest for beginners) | cPanel | cPanel |
| Handover to the client | Easy if the account uses a project email: hand over the mailbox, change password + card. hPanel also lets you grant access to another account. | Change of account holder through support | Hosting can be moved to another Namecheap account through support |

[^vat]: o2switch shows prices excluding VAT; the VAT rate is computed at checkout according to the customer's country. A customer outside the EU (DRC, Uganda) will most likely pay no French VAT. To be confirmed at checkout.

## Speed for Bukavu and Kampala: practical advice

- Choose a **European** data center (Paris or Netherlands) at order time.
- Keep pages light (already done: no jQuery, self-hosted fonts, WebP images, lazy loading).
- Optional, free: put the domain behind **Cloudflare's free plan** (CDN with African points of presence), without adding any WordPress plugin. To be decided with the client once the domain exists.

## What to buy (do not buy before Samuel's approval)

1. Plan: **Hostinger Web Hosting → Unlimited → 12 months**.
2. Account email: the dedicated project mailbox (not a personal one).
3. Domain: only if Seed of Hope does not already own one (open question in `docs/project-brief.md`).
4. Payment: the team's Visa card. Do not save the card for automatic renewal if the client takes over in year 2.
5. Data center: France or the Netherlands.
6. **Price checked on 16 October 2026:** US$ 53.89 total for the 12-month term with coupon `MM10`; renewal displayed at US$ 16.99/month (US$ 203.88/year). Recheck both prices on the actual purchase day.

### Purchase-day checklist

Prices were checked on 16 October 2026, but the purchase-day checks below remain incomplete. Recheck the prices and settings when the team is authorized to buy.

- [ ] Price checked on the day of purchase
- [ ] Dedicated project email used
- [ ] Data center set to France or the Netherlands
- [ ] Automatic renewal turned off
- [ ] Invoice saved in the shared drive

## Sources (original comparison checked 13 October 2026; Hostinger checkout rechecked 16 October 2026)

- Hostinger web hosting plans and prices (12/24/48-month terms): https://www.hostinger.com/web-hosting
- Hostinger WordPress hosting plans: https://www.hostinger.com/wordpress-hosting
- Hostinger SSH (port 65002) and rsync: https://www.hostinger.com/support/how-to-use-rsync-to-sync-files-and-directories-at-hostinger/ ; https://www.hostinger.com/support/1583245-how-to-connect-to-a-hosting-plan-via-ssh-in-hostinger/
- Hostinger WordPress staging: https://www.hostinger.com/support/5720286-how-to-create-a-wordpress-staging-environment-in-hostinger/
- Hostinger server locations: https://www.hostinger.com/support/1583267-where-are-hostinger-servers-located/
- Hostinger payment methods: https://www.hostinger.com/support/1583236-what-payment-methods-are-available-at-hostinger/
- o2switch plans and prices (Grow./Cloud./Pro.): https://www.o2switch.fr/hebergement-illimite/
- o2switch SSH allow-list ("Autorisation SSH", 5 exceptions max): https://faq.o2switch.fr/cpanel/outils/exception-parefeu/ ; https://faq.o2switch.fr/guides/webmastering/connexion-ssh/
- Namecheap shared hosting prices (monthly/yearly/bi-yearly) and payment options: https://www.namecheap.com/hosting/shared/
- Namecheap AutoBackup: https://www.namecheap.com/hosting/autobackup/ ; https://www.namecheap.com/support/knowledgebase/article.aspx/10103/2210/how-to-use-autobackup-cpanel-plugin/
