-- Dwelio mock data seed (template)
-- Replace the placeholders below with real UUIDs from Supabase Auth users.
-- Example: <LANDLORD_ID> -> 0f2b... (from Auth > Users)

-- REQUIRED: existing user IDs
-- <LANDLORD_ID>
-- <TENANT_ID>
-- <BUYER_ID> (optional)

-- PROFILES
insert into profiles (id, full_name, phone, role, is_verified, nin_submitted)
values
  ('<LANDLORD_ID>', 'Adewale Adebayo', '+234 803 111 2222', 'landlord', true, true),
  ('<TENANT_ID>', 'Tomiwa Bello', '+234 802 333 4444', 'tenant', false, false);

-- PROPERTIES
insert into properties (
  id, landlord_id, title, description, type, property_type, price, price_period,
  bedrooms, bathrooms, address, neighbourhood, city, state, images, video_url,
  is_available, is_featured, views
)
values
  (
    '11111111-1111-1111-1111-111111111111',
    '<LANDLORD_ID>',
    'Modern 2-Bed Flat in Bodija',
    'Bright, secure apartment close to Bodija Market.',
    'rent',
    'flat',
    850000,
    'yearly',
    2,
    2,
    '12 Bodija Estate Road',
    'Bodija',
    'Ibadan',
    'Oyo',
    array['https://images.unsplash.com/placeholder1'],
    null,
    true,
    true,
    32
  ),
  (
    '22222222-2222-2222-2222-222222222222',
    '<LANDLORD_ID>',
    'Cozy 1-Bed Room in Agbowo',
    'Student-friendly room near UI Campus.',
    'rent',
    'room',
    320000,
    'yearly',
    1,
    1,
    '5 Agbowo Lane',
    'Agbowo',
    'Ibadan',
    'Oyo',
    array['https://images.unsplash.com/placeholder2'],
    null,
    true,
    false,
    14
  );

-- MESSAGES
insert into messages (sender_id, receiver_id, property_id, content, is_read)
values
  ('<TENANT_ID>', '<LANDLORD_ID>', '11111111-1111-1111-1111-111111111111', 'Hi, is this still available?', true),
  ('<LANDLORD_ID>', '<TENANT_ID>', '11111111-1111-1111-1111-111111111111', 'Yes, it is. When would you like to view?', false);

-- REVIEWS (assumes a tenancy agreement exists)
insert into reviews (reviewer_id, reviewed_id, property_id, rating, comment)
values
  ('<TENANT_ID>', '<LANDLORD_ID>', '11111111-1111-1111-1111-111111111111', 5, 'Great landlord, smooth process.');

-- TENANCY AGREEMENT
insert into tenancy_agreements (
  id, tenant_id, landlord_id, property_id, start_date, end_date, monthly_rent,
  terms, tenant_signed, landlord_signed
)
values
  (
    '33333333-3333-3333-3333-333333333333',
    '<TENANT_ID>',
    '<LANDLORD_ID>',
    '11111111-1111-1111-1111-111111111111',
    '2026-03-01',
    '2027-02-28',
    70000,
    'Sample tenancy terms for testing.',
    true,
    true
  );

-- PAYMENTS
insert into payments (
  tenant_id, landlord_id, property_id, amount, status, paystack_reference,
  move_in_confirmed, payment_month
)
values
  ('<TENANT_ID>', '<LANDLORD_ID>', '11111111-1111-1111-1111-111111111111', 70000, 'paid', 'TEST_REF_001', true, '2026-03-01');

-- WALLETS
insert into wallets (user_id, balance)
values ('<LANDLORD_ID>', 70000);

-- NOTIFICATIONS
insert into notifications (user_id, type, message, link, is_read)
values
  ('<TENANT_ID>', 'new_message', 'You have a new message from a landlord.', '/messages', false),
  ('<LANDLORD_ID>', 'listing_inquiry', 'A tenant inquired about your listing.', '/dashboard', false);
