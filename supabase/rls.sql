-- Dwelio RLS policies (Phase 0.5)

-- profiles
create policy "profiles_select_own"
on profiles for select
using (auth.uid() = id);

create policy "profiles_insert_own"
on profiles for insert
with check (auth.uid() = id);

create policy "profiles_update_own"
on profiles for update
using (auth.uid() = id);

-- properties
create policy "properties_select_available"
on properties for select
using (is_available = true or landlord_id = auth.uid());

create policy "properties_insert_landlord"
on properties for insert
with check (auth.uid() = landlord_id);

create policy "properties_update_landlord"
on properties for update
using (auth.uid() = landlord_id);

create policy "properties_delete_landlord"
on properties for delete
using (auth.uid() = landlord_id);

-- reviews
create policy "reviews_select_public"
on reviews for select
using (true);

create policy "reviews_insert_reviewer"
on reviews for insert
with check (auth.uid() = reviewer_id);

create policy "reviews_update_reviewer"
on reviews for update
using (auth.uid() = reviewer_id);

create policy "reviews_delete_reviewer"
on reviews for delete
using (auth.uid() = reviewer_id);

-- messages
create policy "messages_select_participants"
on messages for select
using (auth.uid() = sender_id or auth.uid() = receiver_id);

create policy "messages_insert_sender"
on messages for insert
with check (auth.uid() = sender_id);

create policy "messages_update_participants"
on messages for update
using (auth.uid() = sender_id or auth.uid() = receiver_id);

-- payments
create policy "payments_select_participants"
on payments for select
using (auth.uid() = tenant_id or auth.uid() = landlord_id);

create policy "payments_insert_tenant"
on payments for insert
with check (auth.uid() = tenant_id);

create policy "payments_update_participants"
on payments for update
using (auth.uid() = tenant_id or auth.uid() = landlord_id);

-- tenancy_agreements
create policy "agreements_select_participants"
on tenancy_agreements for select
using (auth.uid() = tenant_id or auth.uid() = landlord_id);

create policy "agreements_insert_participants"
on tenancy_agreements for insert
with check (auth.uid() = tenant_id or auth.uid() = landlord_id);

create policy "agreements_update_participants"
on tenancy_agreements for update
using (auth.uid() = tenant_id or auth.uid() = landlord_id);
