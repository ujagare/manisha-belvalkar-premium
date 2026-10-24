-- Keep the public storefront catalog aligned with the October 2026 offering list.
insert into public.products
  (slug, title, subtitle, description, category, price, sale_price, badge, image, details, featured, sort_order, is_active)
values
  ('shakti-oracle-deck', 'Card Deck', 'SHAKTI Oracle Deck', 'Inspired by the sacred 51 Shakti Peethas, the Shakti Oracle Cards are a powerful tool for connecting with the divine feminine. Created from Dr. Manisha S. Belvalkar''s profound experiences and meditations with the Goddesses, this beautifully illustrated deck offers daily guidance, positivity, and spiritual insights.', 'oracle', 1899, null, 'Best Seller', '/images/shakti-cards-and-book.webp', '["52 beautifully illustrated cards depicting the Shaktipeeth Goddesses","Information booklet with guidance on how to use the cards","Beautiful box set for the cards","Daily guidance, positivity & divine feminine wisdom"]'::jsonb, true, 10, true),
  ('shakti-deck-guidebook', 'Shakti Book', 'SHAKTI guidebook for daily practice', 'The companion SHAKTI guidebook holds the wisdom of the 51 Shakti Peethas for your daily spiritual practice.', 'oracle', 1999, null, 'Guidebook', '/images/shakti-goddess-oracle-book.png', '["Companion guidebook","Daily spiritual practice","Inspired by 51 Shakti Peethas","Gift-ready sacred keepsake"]'::jsonb, false, 20, true),
  ('sacred-salt-frame', 'Magic Salt', 'Cleanse your space with Himalayan crystal salt', 'A handcrafted Himalayan crystal salt frame infused with intention for space clearing, protection and gentle energy cleansing.', 'ritual', 699, null, 'Handcrafted', '/images/magic-salt.png', '["Authentic Himalayan crystal salt","Handcrafted with intention","For space clearing & protection","Altar & decor ready"]'::jsonb, false, 30, true),
  ('vastu-healing-frames', 'Vastu Healing Frames', 'Healing frames for balanced spaces', 'Intention-led Vastu healing frames created to support harmony, protection and energetic balance in your home or work space.', 'ritual', 7419, null, 'Vastu', '/images/vastu-healing-frame.jpeg', '["For home and work spaces","Created with healing intention","Supports energetic balance","Ready for sacred placement"]'::jsonb, false, 40, true),
  ('abundance-rituals', 'Abundance Rituals', 'Ritual support for prosperity and flow', 'Guided abundance rituals designed to invite prosperity, gratitude and aligned flow into your everyday spiritual practice.', 'ritual', 15000, null, 'Ritual', '/images/abundance-ritual.png', '["Prosperity-focused ritual guidance","Simple steps for home practice","Created with intention","Supports gratitude and flow"]'::jsonb, false, 50, true),
  ('good-luck-rituals', 'Good Luck Rituals', 'One year of ritual support for blessings and luck', 'Good Luck Rituals created to support blessings, positivity and auspicious beginnings through focused spiritual practice.', 'ritual', 24000, null, 'Ritual', '/images/home-cards/positive-energy.webp', '["Effect for one year","For blessings and new beginnings","Positive intention practice","Guided ritual format"]'::jsonb, false, 60, true),
  ('good-health-rituals', 'Good Health Rituals', 'Ritual support for wellness and balance', 'Good Health Rituals created to support wellness, calm and energetic balance through gentle guided spiritual practice.', 'ritual', 9999, null, 'Ritual', '/images/home-cards/healing-session.webp', '["Wellness-focused ritual guidance","Supports calm and balance","Gentle spiritual practice","Created with healing intention"]'::jsonb, false, 70, true),
  ('protection-rituals', 'Protection Rituals', 'Ritual support for protection and energetic boundaries', 'Guided protection rituals created to support a calm, protected space and stronger energetic boundaries through focused spiritual practice.', 'ritual', 9999, null, 'Ritual', '/images/protection-ritual.png', '["Protection-focused ritual guidance","Supports energetic boundaries","For home and personal practice","Created with healing intention"]'::jsonb, false, 80, true),
  ('tarot-reading', 'Tarot Reading', 'Personal guidance and clarity through Tarot', 'A personal Tarot reading for clear, reflective guidance around your present questions, patterns and next steps.', 'ritual', 24000, null, 'Reading', '/images/home-cards/tarot-consultation.webp', '["Personal Tarot guidance","Clarity for present questions","Reflective and intuitive reading","Focused next-step guidance"]'::jsonb, false, 90, true)
on conflict (slug) do update set
  title = excluded.title,
  subtitle = excluded.subtitle,
  description = excluded.description,
  category = excluded.category,
  price = excluded.price,
  sale_price = excluded.sale_price,
  badge = excluded.badge,
  image = excluded.image,
  details = excluded.details,
  featured = excluded.featured,
  sort_order = excluded.sort_order,
  is_active = excluded.is_active;

-- The storefront displays final prices only; remove legacy sale/offer pricing.
update public.products set sale_price = null where sale_price is not null;
