// lib/images.ts

export const images = {
  // Brand & Section Backgrounds
  hero: "/images/hero_pastry.png", // Custom luxury chocolate dessert close-up
  heroSecondary: "/images/hero_pastry.png", // Custom luxury dessert close-up
  storyChef: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=1200", // Pastry chef hands working dough
  storyKitchen: "/images/about_kitchen.png", // Custom bakery kitchen interior
  textureChocolate: "https://images.unsplash.com/photo-1606312619070-d48b4c652a52?q=80&w=1400", // Macro chocolate texture
  textureCrumb: "https://images.unsplash.com/photo-1612203985729-70726954388c?q=80&w=1400", // Pastry crumbs and texture
  flatlayIngredients: "https://images.unsplash.com/photo-1517433367423-c7e5b0f35086?q=80&w=1400", // Quality baking ingredients flatlay
  illustratedMapPlaceholder: "https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=1200", // Stylized map texture background

  // Products
  productChocolateTart: "/images/chocolate_tart.png", // Custom Chocolate Tart
  productChocolateTartDetail1: "/images/chocolate_tart.png",
  productChocolateTartDetail2: "/images/chocolate_tart.png",

  productMacarons: "/images/pastel_macarons.png", // Custom pastel macarons
  productMacaronsDetail1: "/images/pastel_macarons.png",
  productMacaronsDetail2: "/images/pastel_macarons.png",

  productCroissant: "/images/flaky_croissant.png", // Custom flaky croissants
  productCroissantDetail1: "/images/flaky_croissant.png",
  productCroissantDetail2: "/images/flaky_croissant.png",

  productCheesecake: "/images/berry_cheesecake.png", // Custom Berry cheesecake
  productCheesecakeDetail1: "/images/berry_cheesecake.png",
  productCheesecakeDetail2: "/images/berry_cheesecake.png",

  productEclair: "/images/pistachio_eclair.png", // Custom Eclairs
  productEclairDetail1: "/images/pistachio_eclair.png",
  productEclairDetail2: "/images/pistachio_eclair.png",

  productTastingBox: "/images/assorted_tasting_box.png", // Custom elegant box of treats
  productTastingBoxDetail1: "/images/assorted_tasting_box.png",
  productTastingBoxDetail2: "/images/assorted_tasting_box.png",

  productSourdough: "/images/flaky_croissant.png", // Artisan sourdough fallback
  productSourdoughDetail1: "/images/flaky_croissant.png",
  productSourdoughDetail2: "/images/flaky_croissant.png",

  productPavlova: "/images/berry_cheesecake.png", // Pavlova berry fallback
  productPavlovaDetail1: "/images/berry_cheesecake.png",
  productPavlovaDetail2: "/images/berry_cheesecake.png",

  productMilleFeuille: "/images/caramel_mille_feuille.png", // Custom Mille-feuille
  productMilleFeuilleDetail1: "/images/caramel_mille_feuille.png",
  productMilleFeuilleDetail2: "/images/caramel_mille_feuille.png",

  productRaspberryTart: "/images/chocolate_tart.png", // Raspberry Tart fallback
  productRaspberryTartDetail1: "/images/chocolate_tart.png",
  productRaspberryTartDetail2: "/images/chocolate_tart.png",

  productChoux: "/images/matcha_choux.png", // Custom Matcha Choux
  productChouxDetail1: "/images/matcha_choux.png",
  productChouxDetail2: "/images/matcha_choux.png",

  productEntremet: "/images/hazelnut_entremet.png", // Custom Glazed Entremet
  productEntremetDetail1: "/images/hazelnut_entremet.png",
  productEntremetDetail2: "/images/hazelnut_entremet.png",

  // Tasting Boxes
  boxRoyal: "/images/assorted_tasting_box.png",
  boxConnoisseur: "/images/assorted_tasting_box.png",
  boxDateNight: "/images/assorted_tasting_box.png",
  boxSeasonal: "/images/assorted_tasting_box.png",

  // Blog
  blogHero1: "/images/blog_hero_1.png", // Flour and dough science
  blogHero2: "/images/blog_hero_2.png", // Tempering chocolate macro
  blogHero3: "/images/blog_hero_3.png", // Oven baking rise
  blogHero4: "/images/blog_hero_4.png", // Fruit acids and gelatin chemistry
  blogHero5: "/images/blog_hero_5.png", // Glaze physics & surface tension
  blogHero6: "/images/blog_hero_6.png", // Manual lamination physics

  // Testimonials & Team
  testimonialAvatar1: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200",
  testimonialAvatar2: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200",
  testimonialAvatar3: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200",
  testimonialAvatar4: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200",

  aboutTeam1: "/images/chef_marcus.png", // Founder & Chef
  aboutTeam2: "/images/chef_clara.png", // Food Scientist
  aboutTeam3: "/images/chef_genevieve.png", // Chocolatier
} as const;

export type ImageKey = keyof typeof images;
