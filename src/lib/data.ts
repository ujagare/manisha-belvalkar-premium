/* ============================================================
   Manisha Belvalkar — Site content
   All copy sourced from manishabelvalkar.com (Wix) and organized
   as typed data so components stay presentational.
   ============================================================ */

export interface Service {
  slug: string;
  title: string;
  category: "tarot" | "wellbeing";
  short: string;
  description: string;
  price: number;
  salePrice?: number;
  badge?: string;
  duration: string;
  features: string[];
  image: string;
  mostBooked?: boolean;
}

export interface Course {
  slug: string;
  title: string;
  duration: string;
  description: string;
  highlights: string[];
  suitableFor: string[];
  image: string;
}

export type ProductCategory = "book" | "oracle" | "ritual";

export interface Product {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  category: ProductCategory;
  price: number;
  salePrice?: number;
  badge?: string;
  image: string;
  details: string[];
  featured?: boolean;
}

export interface MediaItem {
  id: string;
  outlet: string;
  title: string;
  excerpt: string;
  quote?: string;
  image?: string;
}

export interface Testimonial {
  name: string;
  role: string;
  text: string;
}

/* ---------- Brand ---------- */
export const brand = {
  name: "Manisha Belvalkar",
  role: "Spiritual Mentor",
  heroLine: "Guidance For the Soul",
  heroAction: "Choose Yourself",
  tagline:
    "A holistic well-being coach with over 30 years of experience in Tarot Consultation, Soul Purpose Reading, Goddess Attunement, and Chakra Therapy.",
  quote:
    "It is your own commitment to what you want in life that determines your success.",
  phone: "+91 99222 46111",
  phoneHref: "tel:+919922246111",
  email: "manishabelvalkar@gmail.com",
  emailHref: "mailto:manishabelvalkar@gmail.com",
  address: "Mumbai & Pune",
  locations: [
    {
      city: "Mumbai",
      address: "501, New Pushpanjali, Prabhadevi, Mumbai 28",
      mapsHref: "https://www.google.com/maps/search/?api=1&query=New+Pushpanjali+Prabhadevi+Mumbai"
    },
    {
      city: "Pune",
      address: "Pune, Maharashtra",
      mapsHref: "https://www.google.com/maps/search/?api=1&query=Pune+Maharashtra"
    }
  ],
  whatsappHref:
    "https://wa.me/919922246111?text=Hello%20Manisha%2C%20I%20would%20like%20to%20know%20more.",
  mapsHref:
    "https://www.google.com/maps/search/?api=1&query=Prabhadevi+Mumbai",
};

export interface HeroSlide {
  image: string;
  eyebrow: string;
  headline: string;
  headlineHighlight: string;
  tagline: string;
  ctaLabel: string;
  ctaHref: string;
  /** Premium product-showcase slide: book art on the right, copy on the left. */
  bookImage?: string;
  bookTitle?: string;
  bookInfo?: string;
  bookPrice?: string;
  bookBadge?: string;
  /** Render the product art larger than the default book size. */
  bookLarge?: boolean;
}

export const heroSlides: HeroSlide[] = [
  {
    image: "/images/hero-home-bg.png",
    eyebrow: "SHAKTI Collection",
    headline: "Messages – Daily Guidance from the",
    headlineHighlight: "Divine Feminine",
    tagline:
      "52 beautifully illustrated oracle cards born from Dr. Manisha's meditations with the Goddesses of the sacred 51 Shakti Peethas — daily guidance, positivity and spiritual insight in your hands.",
    ctaLabel: "Buy Now",
    ctaHref: "/checkout/product/shakti-oracle-deck",
    bookImage: "/images/shakti-book-front.png",
    bookTitle: "SHAKTI Oracle Deck",
    bookInfo: "Inspired by 51 Shakti Peethas · Guidebook included",
    bookPrice: "₹2,993",
    bookBadge: "Best Seller",
  },
  {
    image: "/images/hero-home-bg.png",
    eyebrow: "SHAKTI Collection",
    headline: "Deck & Guidebook",
    headlineHighlight: "Together",
    tagline:
      "The complete SHAKTI experience — a beautifully illustrated 52-card oracle deck paired with its companion guidebook, holding the wisdom of the 51 Shakti Peethas for your daily practice.",
    ctaLabel: "Buy Now",
    ctaHref: "/checkout/product/shakti-oracle-deck",
    bookImage: "/images/shakti-cards-and-book.png",
    bookTitle: "SHAKTI Deck + Guidebook",
    bookInfo: "Complete set · Cards & companion book",
    bookPrice: "₹2,993",
    bookBadge: "Complete Set",
    bookLarge: true,
  },
  {
    image: "/images/hero-home-bg.png",
    eyebrow: "SHAKTI Collection",
    headline: "The Sacred",
    headlineHighlight: "Combo",
    tagline:
      "Gift the divine — the SHAKTI Oracle Deck and guidebook presented together as one sacred combo, handcrafted with intention and blessed before it reaches your altar.",
    ctaLabel: "Buy Now",
    ctaHref: "/checkout/product/shakti-oracle-deck",
    bookImage: "/images/shakti-combo-book.png",
    bookTitle: "SHAKTI Combo Pack",
    bookInfo: "Deck + Guidebook · Gift-ready packaging",
    bookPrice: "₹2,993",
    bookBadge: "Sacred Combo",
    bookLarge: true,
  },
  {
    image: "/images/hero-home-bg.png",
    eyebrow: "Sacred Rituals",
    headline: "Cleanse & Protect",
    headlineHighlight: "Your Space",
    tagline:
      "A handcrafted Himalayan crystal salt frame infused with intention — place it near your entrance, altar or meditation corner to hold your space calm, clear and protected.",
    ctaLabel: "Buy Now",
    ctaHref: "/checkout/product/sacred-salt-frame",
    bookImage: "/images/shakti-salt-frame.png",
    bookTitle: "Sacred Salt Frame",
    bookInfo: "Himalayan crystal salt · Handcrafted",
    bookPrice: "₹899",
    bookBadge: "Handcrafted",
    bookLarge: true,
  },
];

/* ---------- Services ---------- */
export const services: Service[] = [
  {
    slug: "soul-purpose-reading",
    title: "Soul Purpose Reading",
    category: "tarot",
    short:
      "Discover the higher purpose of your journey through a profound Tarot session.",
    description:
      "Discover the higher purpose of your journey through a profound Tarot session, unlocking insights into your soul's calling and the steps to align with it.",
    price: 24000,
    duration: "90 minutes",
    features: [
      "Deep soul-level reading",
      "Insights into your life's calling",
      "Actionable steps to align with your purpose",
      "Personalized guidance & remedies",
    ],
    image: "/images/tarot.jpg",
  },
  {
    slug: "tarot-consultation-30",
    title: "Tarot Consultation",
    category: "tarot",
    short:
      "Quick, actionable insights into your current challenges and decisions.",
    description:
      "Get quick, actionable insights into your current challenges and decisions with a concise and focused Tarot reading designed to bring clarity and guidance.",
    price: 15000,
    duration: "30 minutes",
    features: [
      "Focused question-based reading",
      "Clarity on a specific challenge",
      "Empowered decision-making guidance",
    ],
    image: "/images/tarot.jpg",
  },
  {
    slug: "tarot-consultation-60",
    title: "Tarot Consultation",
    category: "tarot",
    short: "A deeper exploration of multiple aspects of your life's questions.",
    description:
      "Dive deeper into your life's questions and receive a detailed exploration of multiple aspects, empowering you with clear answers and holistic guidance.",
    price: 24000,
    duration: "60 minutes",
    mostBooked: true,
    features: [
      "Multi-aspect deep reading",
      "Relationships, career & growth",
      "Holistic guidance & remedies",
      "Clear answers to complex questions",
    ],
    image: "/images/tarot.jpg",
  },
  {
    slug: "goddess-attunement",
    title: "Goddess Attunement",
    category: "wellbeing",
    short: "Connect with the divine feminine energy through sacred attunement.",
    description:
      "A powerful practice to connect with Goddess energy, align with divine feminine wisdom, and receive spiritual guidance and blessings for your journey.",
    price: 24000,
    duration: "90 minutes",
    badge: "New",
    features: [
      "Sacred attunement with Goddess energy",
      "Divine feminine connection",
      "Spiritual guidance & blessings",
      "Personalized practices for continued connection",
    ],
    image: "/images/candle.jpg",
  },
  {
    slug: "well-being-program",
    title: "Well-being Program",
    category: "wellbeing",
    short: "A guided program to navigate life with confidence and balance.",
    description:
      "A comprehensive well-being program designed to help you navigate life with confidence, balancing your energy across mind, body and spirit.",
    price: 24000,
    duration: "Multi-session program",
    badge: "New",
    features: [
      "Personalized energy assessment",
      "Guided healing sessions",
      "Ongoing support & tools",
    ],
    image: "/images/home-cards/wellbeing-program.png",
  },
];

/* ---------- Courses ---------- */
export const courses: Course[] = [
  {
    slug: "aishwarya-siddhi",
    title: "Aishwarya Siddhi Course",
    duration: "11-day online course",
    description:
      "A sacred journey of invoking Goddess Mahalakshmi and receiving her blessings for abundance, beauty, harmony, and grace. Once you enrol, the most suitable day to begin is decided on the basis of your intent and energy design. Every day you receive instructions in the form of voice notes, texts, and images.",
    highlights: [
      "Remedies and rituals to tap into Goddess Lakshmi's abundance",
      "Yantra, mantra, and techniques to strengthen your wealth attraction capability",
      "Guidance to carry the sadhana into Diwali for more powerful results",
    ],
    suitableFor: [
      "Anyone seeking abundance and prosperity",
      "Those drawn to Goddess Lakshmi's energy",
      "Devotees wanting to deepen their sadhana",
    ],
    image: "/images/aishwarya-siddhi-course.png",
  },
  {
    slug: "shri-vidya",
    title: "Shri Vidya Course",
    duration: "9 classes over two years · monthly · 3 hours",
    description:
      "An online course for opening the door to material and spiritual success. Discover the Mysteries of Shri Vidya — a profound journey designed to gently take you on the sacred path of Shri Vidya, connecting with the Sri Yantra as a living presence and the Goddess Tripura Sundari.",
    highlights: [
      "Understanding Sri Vidya",
      "Deepening Your Connection with Goddess Tripura Sundari",
      "Understanding Sri Yantra's Sacred Geometry",
      "Spiritual and Material Growth",
    ],
    suitableFor: [
      "Serious spiritual seekers",
      "Practitioners of mantra & meditation",
      "Those ready for deep inner work",
    ],
    image: "/images/shri-vidya-course.png",
  },
  {
    slug: "advanced-chakra",
    title: "Advanced Chakra Course",
    duration: "12 classes over two years · every two months · 3 hours",
    description:
      "A two-year immersive program that takes you on a deep journey through the chakras to explore their energy, function, and role in healing and spiritual awakening. With a special focus on kundalini movement, the course includes hands-on exercises, energy healing, and in-depth exploration of each chakra.",
    highlights: [
      "In-Depth Exploration: a profound understanding of each chakra",
      "Kundalini Activation: awaken spiritual energy for accelerated growth",
      "Energy Healing: 24 monthly healing sessions",
      "Holistic Approach: integrate chakra knowledge into daily life",
    ],
    suitableFor: [
      "Students of energy healing",
      "Those experiencing energy blocks",
      "Practitioners wanting advanced tools",
    ],
    image: "/images/advanced-chakra-course.jpg",
  },
  {
    slug: "personalized-wellbeing",
    title: "Personalized Well-being Course",
    duration: "Six-month personalized program",
    description:
      "A deeply personalized journey to help you heal, grow, and thrive. Designed around your unique mental, energetic, and emotional blueprint, it empowers you to navigate life with confidence and positivity through ancient wisdom, practical tools, and modern insights.",
    highlights: [
      "Self-Discovery: understand your unique design, gifts, and talents",
      "Empowerment: master tools to handle life's challenges with ease",
      "Inner Transformation: reprogram your inner narrative for positivity, success, and purpose",
      "Two personalized sessions per month + custom workbooks & energetic support",
    ],
    suitableFor: [
      "Individuals seeking personal transformation",
      "Those who prefer private guidance",
      "Anyone ready to commit to self-growth",
    ],
    image: "/images/personalized-wellbeing-course.jpg",
  },
];

/* ---------- Products (sacred tools & treasures) ---------- */
export const products: Product[] = [
  {
    slug: "shakti-oracle-deck",
    title: "SHAKTI Oracle Deck",
    subtitle: "Inspired by 51 Shakti Peethas",
    category: "oracle",
    description:
      "Inspired by the sacred 51 Shakti Peethas, the Shakti Oracle Cards are a powerful tool for connecting with the divine feminine. Created from Dr. Manisha S. Belvalkar's profound experiences and meditations with the Goddesses, this beautifully illustrated deck offers daily guidance, positivity, and spiritual insights.",
    price: 2993,
    salePrice: 3533,
    badge: "Best Seller",
    image: "/images/shakti-oracle-deck-yellow.jpg",
    details: [
      "52 beautifully illustrated cards depicting the Shaktipeeth Goddesses",
      "Information booklet with guidance on how to use the cards",
      "Beautiful box set for the cards",
      "Daily guidance, positivity & divine feminine wisdom",
    ],
    featured: true,
  },
  {
    slug: "shakti-deck-guidebook",
    title: "SHAKTI Deck + Guidebook",
    subtitle: "Complete set · Cards & companion book",
    category: "oracle",
    description:
      "The complete SHAKTI experience — a beautifully illustrated 52-card oracle deck paired with its companion guidebook, holding the wisdom of the 51 Shakti Peethas for your daily practice. Gift-ready sacred packaging.",
    price: 2993,
    salePrice: 3533,
    badge: "Complete Set",
    image: "/images/shakti-cards-and-book.png",
    details: [
      "52 oracle cards",
      "Companion guidebook included",
      "Gift-ready sacred packaging",
      "Inspired by 51 Shakti Peethas",
    ],
  },
  {
    slug: "shakti-combo-pack",
    title: "SHAKTI Combo Pack",
    subtitle: "Deck + Guidebook · Gift-ready packaging",
    category: "oracle",
    description:
      "Gift the divine — the SHAKTI Oracle Deck and guidebook presented together as one sacred combo, handcrafted with intention and blessed before it reaches your altar. A complete spiritual toolkit for daily guidance.",
    price: 2993,
    salePrice: 3533,
    badge: "Sacred Combo",
    image: "/images/shakti-combo-book.png",
    details: [
      "Deck + guidebook combo",
      "Handcrafted with intention",
      "Blessed before shipping",
      "Gift-ready packaging",
    ],
  },
  {
    slug: "sacred-salt-frame",
    title: "Sacred Salt Frame",
    subtitle: "Cleanse your space with Himalayan crystal salt",
    category: "ritual",
    description:
      "A handcrafted Himalayan crystal salt frame infused with intention — a living tool for space clearing, protection and gentle energy cleansing. Place it near your entrance, altar or meditation corner to hold your space calm, clear and protected.",
    price: 899,
    salePrice: 1099,
    badge: "Handcrafted",
    image: "/images/shakti-salt-frame.png",
    details: [
      "Authentic Himalayan crystal salt",
      "Handcrafted with intention",
      "For space clearing & protection",
      "Altar & décor ready",
    ],
  },
];

/** Category labels for the product storefront. */
export const productCategoryLabels: Record<ProductCategory, string> = {
  book: "Books",
  oracle: "Oracle & Tarot",
  ritual: "Sacred Rituals",
};

/** Legacy alias — older imports may still reference `books`. */
export const books: Product[] = products;

/* ---------- Media ---------- */
export const mediaItems: MediaItem[] = [
  {
    id: "success-today",
    outlet: "Success Today",
    title: "Interview in Success Today",
    excerpt:
      "A conversation with Dr. Manisha Belvalkar on her journey, her work, and how Tarot reveals the connection between our inner world and outer reality.",
    quote:
      "As within, so without. This statement is completely accurate when it comes to Tarot reading — our outer reality reflects our inner world.",
    image: "/images/about-success-today.jpg",
  },
  {
    id: "citadel",
    outlet: "Citadel Magazine",
    title: "Feature in Citadel Magazine",
    excerpt:
      "A profile on Manisha's three decades of spiritual practice — from her early exploration of esoteric tools to becoming one of the most trusted Tarot mentors in Mumbai.",
    quote:
      "When people come to me with their problems, I hold a space where they can open their hearts and receive unconditional support.",
    image: "/images/about-article-scanned.jpg",
  },
  {
    id: "health-mag",
    outlet: "The Health Mag",
    title: "Article in The Health Mag",
    excerpt:
      "An exploration of energy healing and Chakra Therapy — and how balancing the body's energy centres supports holistic well-being.",
    quote:
      "Healing begins when we return to balance — across the body, mind and spirit.",
    image: "/images/about-health-mag.jpg",
  },
];

/* ---------- Awards ---------- */
export interface Award {
  title: string;
  description: string;
  image: string;
}

export const awards: Award[] = [
  {
    title: "International Excellence Award",
    description:
      "Receiving the International Excellence Award for Tarot Reading from actor Sonu Sood — an honour recognising her mastery and years of dedicated service.",
    image: "/images/about-portrait-1.png",
  },
];

/* ---------- Testimonials ---------- */
export const testimonials: Testimonial[] = [
  {
    name: "Lakshmi Shetty",
    role: "Restauranteer",
    text: "The impact of Manisha's coaching on my personal life and business has been nothing short of miraculous. Through her insightful guidance, I've been able to align my goals with my vision, leading to extraordinary personal growth and happiness.",
  },
  {
    name: "Priya Deshmukh",
    role: "Homemaker, Pune",
    text: "Her tarot reading was so accurate that I was moved to tears. The clarity I received about my family situation gave me peace I hadn't felt in years.",
  },
  {
    name: "Ananya Iyer",
    role: "Software Engineer, Bengaluru",
    text: "I came sceptical, I left transformed. The chakra healing sessions helped me release years of accumulated stress. My focus and energy have completely changed.",
  },
  {
    name: "Meera Kulkarni",
    role: "Entrepreneur, Nashik",
    text: "Manisha tai's guidance came at a turning point in my business. Every decision she helped me align with has only brought abundance. She is truly gifted.",
  },
  {
    name: "Rachel Fernandes",
    role: "HR Manager, Mumbai",
    text: "The space clearing for our home changed the atmosphere completely. It feels lighter, calmer, happier. My whole family noticed it within days.",
  },
  {
    name: "Kavita Joshi",
    role: "Teacher, Nagpur",
    text: "Her mentoring gave me the confidence to finally put myself first — without guilt. I have learned to honour my own journey. Grateful beyond words.",
  },
  {
    name: "Vikram Malhotra",
    role: "Business Owner, Delhi",
    text: "I consulted her during the most difficult phase of my career. Her reading was precise, practical and deeply reassuring. Things turned around within months.",
  },
  {
    name: "Sneha Patil",
    role: "Doctor, Pune",
    text: "As a doctor I value evidence, but the serenity after her healing sessions is undeniable. My sleep improved, my anxiety dissolved. A beautiful experience.",
  },
  {
    name: "Aditi Rane",
    role: "Chartered Accountant, Mumbai",
    text: "The Shri Vidya course opened a spiritual door I didn't know existed. Manishaji teaches with such patience and depth. It has become the anchor of my day.",
  },
  {
    name: "Sunita Rao",
    role: "Yoga Instructor, Bengaluru",
    text: "I recommend her to every student of mine seeking deeper inner work. Her understanding of energy is profound, and her heart is pure gold.",
  },
];

/* ---------- Shakti ---------- */
export interface ShaktiPillar {
  title: string;
  tagline: string;
  description: string;
  image: string;
}

export const shaktiIntro =
  "Shakti is the divine feminine energy within us all. Through mentoring, healing and sacred wisdom, Dr. Manisha Belvalkar guides seekers to reclaim their power, honour their journey and step into their fullest self.";

export const shaktiPillars: ShaktiPillar[] = [
  {
    title: "Honour Your Essence",
    tagline: "Honour your feminine essence",
    description:
      "A sacred space designed to feel seen, heard and understood as you navigate life's many roles.",
    image: "/images/manisha-portrait.jpg",
  },
  {
    title: "Empowerment",
    tagline: "Reclaim your inner power",
    description:
      "Practical mentoring that helps you own your voice, set loving boundaries and lead your life with confidence.",
    image: "/images/gold-abstract.jpg",
  },
  {
    title: "Self Development",
    tagline: "Grow into your fullest self",
    description:
      "Guided practices for emotional balance, self-awareness and continuous personal evolution.",
    image: "/images/tarot.jpg",
  },
  {
    title: "Divine Support",
    tagline: "Walk with the divine feminine",
    description:
      "Connect with the energy of the Goddesses through Shakti rituals, oracle wisdom and sacred guidance.",
    image: "/images/candle.jpg",
  },
];

/* ---------- Mentoring ---------- */
export interface MentoringArea {
  slug: string;
  title: string;
  short: string;
  description: string;
  features: string[];
  image: string;
}

export const mentoringIntro =
  "Tarot is not fortune-telling — it is a mirror for self-exploration. Through one-on-one mentoring, Dr. Manisha Belvalkar helps you understand yourself, explore your patterns, find clarity and move toward lasting transformation.";

export const mentoringAreas: MentoringArea[] = [
  {
    slug: "mentoring-sessions",
    title: "Mentoring Sessions",
    short: "One-on-one guidance for your life journey.",
    description:
      "Private mentoring sessions tailored to your life stage, questions and growth goals — a supportive space to move forward with clarity.",
    features: [
      "Personalised one-on-one guidance",
      "Clarity on your current life questions",
      "Actionable next steps & accountability",
    ],
    image: "/images/manisha-portrait.jpg",
  },
  {
    slug: "tarot-mentoring",
    title: "Mentoring through Tarot",
    short: "The Tarot as a mirror for self-understanding.",
    description:
      "Use the Tarot as a profound tool for self-exploration — understand your patterns, recognise your gifts and uncover the path ahead.",
    features: [
      "Pattern recognition & self-awareness",
      "Guidance on relationships & career",
      "Empowered, conscious decision-making",
    ],
    image: "/images/tarot.jpg",
  },
  {
    slug: "purification",
    title: "Purification",
    short: "Clear what no longer serves you.",
    description:
      "Sacred rituals and practices to release stuck energy, old patterns and emotional heaviness — creating space for the new.",
    features: [
      "Energetic release & cleansing rituals",
      "Emotional weight & pattern release",
      "Renewal and fresh-start guidance",
    ],
    image: "/images/candle.jpg",
  },
  {
    slug: "self-development",
    title: "Self Development",
    short: "A structured path to becoming your best self.",
    description:
      "Ongoing mentoring that builds emotional intelligence, confidence and life skills — supporting you as you evolve.",
    features: [
      "Confidence & emotional mastery",
      "Habit & mindset transformation",
      "Personal growth road-mapping",
    ],
    image: "/images/hero-home-bg.png",
  },
  {
    slug: "self-exploration",
    title: "Self Exploration",
    short: "Journey inward to know yourself deeply.",
    description:
      "Deep-dive sessions that help you connect with your inner world, values and true desires — so you can live authentically.",
    features: [
      "Inner world & values discovery",
      "Life purpose exploration",
      "Authentic living practices",
    ],
    image: "/images/gold-abstract.jpg",
  },
  {
    slug: "healing-in-mentoring",
    title: "Healing",
    short: "Mentoring that heals, not just advises.",
    description:
      "A heart-centred approach where healing energy meets practical guidance — supporting emotional and energetic wellbeing.",
    features: [
      "Emotional & energetic healing",
      "Compassionate, non-judgemental space",
      "Tools for continued self-healing",
    ],
    image: "/images/books.jpg",
  },
];

/* ---------- Healing ---------- */
export interface HealingService {
  slug: string;
  title: string;
  short: string;
  description: string;
  features: string[];
  image: string;
}

export const healingIntro =
  "Healing is the art of returning to balance. From in-person sessions to distance healing, Dr. Manisha Belvalkar offers a range of gentle, powerful practices to restore harmony across your body, mind and spirit.";

export const healingServices: HealingService[] = [
  {
    slug: "healing-sessions",
    title: "Energy Healing",
    short: "In-person energy healing with Manisha.",
    description:
      "Personal healing sessions guided by Dr. Manisha Belvalkar — combining energy work, chakra alignment and intuitive insight.",
    features: [
      "Personal energy assessment",
      "Chakra & aura balancing",
      "Intuitive guidance & aftercare",
    ],
    image: "/images/home-cards/healing-session.png",
  },
  {
    slug: "distance-healing",
    title: "Distance Healing",
    short: "Healing energy, wherever you are.",
    description:
      "Receive the same healing care remotely — distance healing works across any location, bringing balance and relief to you at home.",
    features: [
      "Works across any location",
      "Scheduled at your convenience",
      "Follow-up guidance included",
    ],
    image: "/images/home-cards/distance-healing.png",
  },
  {
    slug: "chakra-healing",
    title: "Chakra Healing",
    short: "Balance and align your energy centers.",
    description:
      "Deep chakra balancing to restore flow, clear blockages and harmonize your energy body — bringing vitality, clarity and peace.",
    features: [
      "Complete chakra assessment",
      "Energy blockage clearing",
      "Personalized balancing techniques",
      "Ongoing chakra maintenance guidance",
    ],
    image: "/images/chakra.png",
  },
  {
    slug: "goddess-healing",
    title: "Goddess Healing",
    short: "Healing through divine feminine energy.",
    description:
      "Connect with the healing power of the Goddesses — receiving divine guidance, emotional healing and spiritual support through sacred feminine energy.",
    features: [
      "Divine feminine energy healing",
      "Goddess guidance & blessings",
      "Emotional & spiritual restoration",
      "Sacred practices for self-healing",
    ],
    image: "/images/home-cards/goddess-attunement.png",
  },
  {
    slug: "mind-reprogramming",
    title: "Reprogramming Your Mind (Through Guided Meditation)",
    short: "Transform limiting beliefs through sacred meditation.",
    description:
      "Guided meditation practices designed to gently reprogram limiting beliefs, release mental patterns and create new pathways for positive thinking and empowered living.",
    features: [
      "Guided meditation sessions",
      "Subconscious reprogramming",
      "Release limiting beliefs",
      "Create positive mental patterns",
    ],
    image: "/images/gold-abstract.jpg",
  },
  {
    slug: "positive-energy",
    title: "Positive Energy Giving",
    short: "Fill your space and self with positive energy.",
    description:
      "Practices and rituals to raise your vibration — clearing heaviness and inviting calm, optimism and flow into daily life.",
    features: [
      "Vibration-raising techniques",
      "Daily positive-energy practices",
      "Home & space energising",
    ],
    image: "/images/home-cards/positive-energy.png",
  },
  {
    slug: "chakra-questionnaire",
    title: "Chakra Assessment",
    short: "Begin with understanding your energy.",
    description:
      "A guided chakra assessment that reveals where your energy is balanced and where it needs attention — your starting point for healing.",
    features: [
      "Detailed chakra assessment",
      "Personal energy report",
      "Recommended healing path",
    ],
    image: "/images/home-cards/chakra-assessment.png",
  },
];

/* ---------- Transformation ---------- */
export interface TransformationMonth {
  month: number;
  title: string;
  description: string;
}

export const transformationProgram = {
  slug: "transformation",
  title: "Journey from a Woman to Goddess",
  tagline: "Women Empowerment — a premium flagship journey of personal transformation",
  description:
    "A guided 6-month transformation journey designed for women ready to deeply change their life. Through monthly mentoring, healing, tarot insight and empowerment practices, you will move from where you are to who you are meant to be — stepping into your power, purpose and fullest expression.",
  price: "By consultation",
  duration: "6-month guided program",
  months: [
    {
      month: 1,
      title: "Self Discovery",
      description:
        "Understand who you are at your core — your values, gifts and current energy landscape.",
    },
    {
      month: 2,
      title: "Healing",
      description:
        "Release old patterns, emotional weight and energy blocks that have been holding you back.",
    },
    {
      month: 3,
      title: "Pattern Recognition",
      description:
        "See the repeating patterns in your life and learn how to consciously change them.",
    },
    {
      month: 4,
      title: "Empowerment",
      description:
        "Reclaim your voice, your power and your confidence to make aligned decisions.",
    },
    {
      month: 5,
      title: "Self Development",
      description:
        "Build the habits, mindset and skills that sustain growth beyond the program.",
    },
    {
      month: 6,
      title: "Integration",
      description:
        "Integrate everything — walk into your transformed life with clarity and grace.",
    },
  ],
};

/* ---------- Online Courses ---------- */
export interface OnlineCourse {
  slug: string;
  title: string;
  duration: string;
  level: string;
  description: string;
  highlights: string[];
  image: string;
}

export const onlineCourses: OnlineCourse[] = [
  {
    slug: "tarot-course",
    title: "Tarot Course",
    duration: "Self-paced online course",
    level: "Beginner to Advanced",
    description:
      "Learn to read the Tarot with confidence — from the meanings of the cards to conducting meaningful readings for yourself and others.",
    highlights: [
      "Complete card meanings & spreads",
      "Intuitive reading techniques",
      "Practice readings with feedback",
      "Certificate on completion",
    ],
    image: "/images/tarot.jpg",
  },
  {
    slug: "angel-course",
    title: "Angel Course",
    duration: "Self-paced online course",
    level: "All levels",
    description:
      "Connect with angelic guidance and learn to receive clear, loving messages for yourself and others — a course for the heart.",
    highlights: [
      "Understanding angelic guidance",
      "Oracle & angel card practice",
      "Meditations for connection",
      "Daily guidance rituals",
    ],
    image: "/images/gold-abstract.jpg",
  },
];

/* ---------- App ---------- */
export interface AppFeature {
  title: string;
  description: string;
}

export const appName = "SHAKTI App";
export const appTagline =
  "Your spiritual companion — guidance, healing and wisdom in your pocket.";
export const appFeatures: AppFeature[] = [
  {
    title: "Daily Guidance",
    description: "Oracle card of the day, affirmations and rituals.",
  },
  {
    title: "Book Sessions",
    description: "Schedule mentoring, healing and readings in one tap.",
  },
  {
    title: "Track Your Journey",
    description: "Journal your growth and revisit your transformation.",
  },
  {
    title: "Community",
    description: "Connect with a like-hearted community of seekers.",
  },
];

/* ---------- Community ---------- */
export interface CommunityPillar {
  title: string;
  description: string;
}

export const communityIntro =
  "Growth is sweeter together. Join a community of women and seekers walking the path of self-discovery, healing and empowerment — supported by Dr. Manisha Belvalkar's guidance.";
export const communityPillars: CommunityPillar[] = [
  {
    title: "Sacred Circles",
    description:
      "Regular group gatherings for sharing, healing and connection.",
  },
  {
    title: "Monthly Wisdom",
    description: "Exclusive insights, rituals and practices from Manisha.",
  },
  {
    title: "Q&A with Manisha",
    description: "Live question-and-answer sessions for members.",
  },
  {
    title: "Member-only Events",
    description: "Priority access to workshops and live sessions.",
  },
];

/* ---------- Live ---------- */
export interface LiveEvent {
  title: string;
  description: string;
  format: string;
}

export const liveEvents: LiveEvent[] = [
  {
    title: "Online Sessions",
    description:
      "Live one-on-one and small-group sessions held online — Tarot, healing and mentoring from anywhere.",
    format: "Live · Online",
  },
  {
    title: "Online Workshop — Live",
    description:
      "Interactive live workshops on Tarot, Shakti, healing and self-development with guided practice.",
    format: "Live · Group",
  },
];

/* ---------- Footer / legal ---------- */
export const disclaimer = [
  "The services and courses offered on this website, including Tarot readings, Vastu consultations, Astrology, Numerology, Energy Healing, and other related offerings, are intended for personal growth, spiritual exploration, and general guidance.",
  "These services do not replace professional advice in medical, legal, financial, or psychological matters. Always consult a licensed professional for any concerns in these areas.",
  "Results and experiences may vary based on individual circumstances and effort. While every effort is made to provide accurate and insightful guidance, the outcomes are not guaranteed, and the user is responsible for their own decisions and actions.",
  "By using this website and availing of its services, you acknowledge and agree that these offerings are for informational and self-improvement purposes only.",
];

export const navigation = [
  { label: "Home", href: "/" },
  { label: "Shakti", href: "/shakti" },
  { label: "Mentoring", href: "/mentoring" },
  { label: "Healing", href: "/healing" },
  { label: "Transformation", href: "/transformation" },
  { label: "Courses", href: "/courses" },
  { label: "Products", href: "/products" },
  { label: "Community", href: "/community" },
  { label: "Contact", href: "/contact" },
];

export const footerLinks = [
  { label: "About", href: "/about" },
  { label: "Media", href: "/media" },
  { label: "App", href: "/app" },
  { label: "Live", href: "/live" },
];
