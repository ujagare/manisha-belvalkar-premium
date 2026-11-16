-- Migration: Inventory stock seed, duplicate enrollments prevention, and refund deduplication
-- 1. Ensure every product in public.products has an active default variant in public.product_variants
insert into public.product_variants (product_id, sku, title, amount_subunits, stock_on_hand, reserved_stock, is_active)
select 
  p.id,
  p.slug || '-std' as sku,
  p.title as title,
  round(coalesce(p.sale_price, p.price, 0) * 100)::bigint as amount_subunits,
  50 as stock_on_hand,
  0 as reserved_stock,
  true as is_active
from public.products p
where not exists (
  select 1 from public.product_variants pv where pv.product_id = p.id
);

-- 2. Prevent duplicate active/pending course enrollments for recorded courses (where cohort_id is null)
create unique index if not exists course_enrollments_user_course_cohort_null_idx
on public.course_enrollments (user_id, course_slug)
where cohort_id is null and status in ('active', 'pending');

-- 3. Prevent duplicate active refund requests on the same order
create unique index if not exists refunds_single_active_request_per_order_idx
on public.refunds (order_id)
where status in ('requested', 'approved', 'processing', 'processed');
