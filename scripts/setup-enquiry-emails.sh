#!/usr/bin/env bash
# One-time setup for Virgo enquiry emails. Run it yourself, from the project
# folder, in your Mac's Terminal (it uses your own AWS and Supabase logins):
#
#   cd ~/Documents/askvirgo && bash scripts/setup-enquiry-emails.sh
#
# What it does, in order (safe to run again; each step skips what's done):
#   1. Database: records the original table's migration as already applied,
#      then applies the two new ones (enquiry types + the email trigger).
#   2. AWS: creates an IAM user "virgo-ses-sender" that can ONLY send email
#      through SES, and an access key for it.
#   3. Supabase: stores that key and the inbox address as function secrets.
#   4. Supabase: deploys the notify-email function.
#
# Nothing is printed that you'd need to copy: the key goes straight into
# Supabase's secret store.

set -euo pipefail

PROJECT_REF="jqxauqujvolknsanxswc"     # Supabase project "arm-website"
REGION="eu-west-2"
NOTIFY_TO="${NOTIFY_TO:-hello@askvirgo.co.uk}"   # where enquiries are sent
IAM_USER="virgo-ses-sender"

cd "$(dirname "$0")/.."
step() { printf '\n\033[1m%s\033[0m\n' "$*"; }

step "1/4  Database changes"
npx supabase link --project-ref "$PROJECT_REF" >/dev/null
# The original table was created outside the CLI, so its migration is marked
# as applied rather than run again.
npx supabase migration repair --status applied 20260411151822 --remote --yes >/dev/null 2>&1 || true
npx supabase db push --remote --yes

step "2/4  AWS sending-only user"
if ! aws iam get-user --user-name "$IAM_USER" >/dev/null 2>&1; then
  aws iam create-user --user-name "$IAM_USER" >/dev/null
fi
aws iam put-user-policy --user-name "$IAM_USER" --policy-name ses-send-only --policy-document "{
  \"Version\": \"2012-10-17\",
  \"Statement\": [{
    \"Effect\": \"Allow\",
    \"Action\": [\"ses:SendEmail\", \"ses:SendRawEmail\"],
    \"Resource\": \"*\",
    \"Condition\": { \"StringLike\": { \"ses:FromAddress\": \"*@askvirgo.co.uk\" } }
  }]
}"
# Replace any earlier key so only one is ever active.
for k in $(aws iam list-access-keys --user-name "$IAM_USER" --query 'AccessKeyMetadata[].AccessKeyId' --output text); do
  aws iam delete-access-key --user-name "$IAM_USER" --access-key-id "$k"
done
read -r KEY_ID KEY_SECRET < <(aws iam create-access-key --user-name "$IAM_USER" \
  --query 'AccessKey.[AccessKeyId,SecretAccessKey]' --output text)

step "3/4  Function secrets"
npx supabase secrets set --remote="$PROJECT_REF" --yes \
  AWS_ACCESS_KEY_ID="$KEY_ID" AWS_SECRET_ACCESS_KEY="$KEY_SECRET" \
  AWS_REGION="$REGION" NOTIFY_TO="$NOTIFY_TO" >/dev/null
unset KEY_ID KEY_SECRET

step "4/4  Deploy the email function"
npx supabase functions deploy notify-email --remote="$PROJECT_REF" --no-verify-jwt --yes

step "Done. Enquiries will be emailed to $NOTIFY_TO."
echo "Tell Claude \"done\" and it will send a test enquiry and check the email arrived."
