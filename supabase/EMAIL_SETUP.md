# Email on every enquiry — setup (one-time, ~10 min)

Sends an email to **zigmagrs@yahoo.in** whenever a form is submitted (a new row lands in `public.enquiries`). Uses a free Resend account + the `notify-enquiry` Edge Function.

## 1. Resend (email sender)
1. Sign up free at https://resend.com (3,000 emails/month free).
2. **API Keys → Create API Key** → copy it (starts with `re_`).
3. (Optional but recommended) **Domains → Add domain** `manakpetroleum.com` and add the DNS records Resend shows, so email comes **from** your domain. Until then it sends from `onboarding@resend.dev`, which still delivers to your inbox.

## 2. Deploy the Edge Function (no CLI needed)
1. Supabase Dashboard → **Edge Functions → Deploy a new function**.
2. Name it exactly **`notify-enquiry`**.
3. Paste the contents of `supabase/functions/notify-enquiry/index.ts` and deploy.

## 3. Add the secret
Supabase Dashboard → **Edge Functions → Manage secrets** → add:
- `RESEND_API_KEY` = the `re_...` key from step 1
- (optional) `NOTIFY_FROM` = `Manak Petroleum <hello@manakpetroleum.com>` once your domain is verified in Resend

## 4. Fire it on every new enquiry
Supabase Dashboard → **Database → Webhooks → Create a new hook**:
- Table: **enquiries**, Events: **Insert**
- Type: **Supabase Edge Functions** → select **notify-enquiry**
- Save.

## 5. Test
Submit any form on the live site → you should get an email within a few seconds. If not, check **Edge Functions → notify-enquiry → Logs**.
