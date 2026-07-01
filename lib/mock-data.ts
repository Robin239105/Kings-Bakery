import { images } from "./images";

export interface Review {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  date: string;
  comment: string;
  verified: boolean;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  category: "Cakes" | "Tarts" | "Pastries" | "Macarons";
  description: string;
  longDescription: string;
  images: string[];
  dietary: ("Gluten-Free" | "Vegan" | "Nut-Free")[];
  ingredients: string[];
  allergens: string[];
  storage: string;
  rating: number;
  reviews: Review[];
}

export interface TastingBox {
  id: string;
  name: string;
  slug: string;
  price: number;
  description: string;
  longDescription: string;
  image: string;
  itemCount: number;
  contents: { name: string; qty: number; slug?: string }[];
  customizableItems: {
    originalName: string;
    options: string[];
  }[];
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  category: "Technique" | "Ingredients" | "Behind the Scenes" | "Seasonal";
  excerpt: string;
  content: string; // HTML-like string with rich formatting
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  date: string;
  readTime: string;
  image: string;
}

// -------------------------------------------------------------
// SEEDED DATA
// -------------------------------------------------------------

export const mockReviews: Review[] = [
  {
    id: "r1",
    name: "Arthur Pendragon",
    avatar: images.testimonialAvatar1,
    rating: 5,
    date: "2026-06-15",
    comment: "The Chocolate Gold Leaf Tart is a masterclass in balance. The crust is perfectly thin and crisp, and the ganache is smooth as silk. Exceptional.",
    verified: true,
  },
  {
    id: "r2",
    name: "Guinevere Vance",
    avatar: images.testimonialAvatar2,
    rating: 5,
    date: "2026-06-20",
    comment: "Ordered a box of Macarons for a high-end corporate event. The rose and lychee notes were subtle, and the shells had the perfect chew. My guests were amazed.",
    verified: true,
  },
  {
    id: "r3",
    name: "Lancelot Du Lac",
    avatar: images.testimonialAvatar3,
    rating: 5,
    date: "2026-06-24",
    comment: "I have tried croissants in Paris, Tokyo, and New York. The lamination on KingsBakery's Almond Croissant competes with the absolute best in the world.",
    verified: true,
  },
  {
    id: "r4",
    name: "Genevieve Roche",
    avatar: images.testimonialAvatar4,
    rating: 4,
    date: "2026-06-25",
    comment: "Stunning presentation. The box alone feels like a luxury jewelry packaging. The Vanilla Cheesecake is incredibly light yet decadent.",
    verified: true,
  }
];

export const mockProducts: Product[] = [
  {
    id: "p1",
    name: "Chocolate Gold Leaf Tart",
    slug: "chocolate-gold-leaf-tart",
    price: 12.00,
    category: "Tarts",
    description: "A dark chocolate ganache infused with Madagascan vanilla, nestled in a cacao sable shell and topped with 24k edible gold leaf.",
    longDescription: "Our signature tart is crafted with single-origin 72% Valrhona dark chocolate. The ganache is slow-emulsified with organic grass-fed cream to achieve a velvet-smooth texture. Each tart is hand-burnished with gold leaf, making it a dramatic crown jewel for any dining experience.",
    images: [images.productChocolateTart, images.productChocolateTartDetail1, images.productChocolateTartDetail2],
    dietary: ["Nut-Free"],
    ingredients: ["Valrhona 72% Dark Chocolate", "Organic Heavy Cream", "Butter", "Wheat Flour", "Sugar", "Cacao Powder", "Madagascan Vanilla Bean", "24k Gold Leaf"],
    allergens: ["Wheat", "Dairy", "Eggs"],
    storage: "Keep refrigerated. Serve slightly chilled. Best consumed within 3 days.",
    rating: 4.9,
    reviews: [mockReviews[0]]
  },
  {
    id: "p2",
    name: "Parisian Rose Macarons",
    slug: "parisian-rose-macarons",
    price: 18.00,
    category: "Macarons",
    description: "Delicate almond meringue shells filled with a white chocolate ganache infused with organic Persian rosewater and lychee.",
    longDescription: "A box of six premium macarons. We stone-grind California almonds to a superfine flour, whipping it with egg whites to create a shell that is crisp on the outside and moist on the inside. The filling balances floral rose notes with the brightness of fresh lychee purée.",
    images: [images.productMacarons, images.productMacaronsDetail1, images.productMacaronsDetail2],
    dietary: ["Gluten-Free"],
    ingredients: ["Almond Flour", "Powdered Sugar", "Egg Whites", "White Chocolate", "Persian Rosewater", "Lychee Purée", "Organic Beet Juice (for color)"],
    allergens: ["Tree Nuts (Almonds)", "Dairy", "Eggs"],
    storage: "Store in a cool place. Consume within 5 days. Do not freeze.",
    rating: 4.8,
    reviews: [mockReviews[1]]
  },
  {
    id: "p3",
    name: "Almond Laminated Croissant",
    slug: "almond-laminated-croissant",
    price: 7.50,
    category: "Pastries",
    description: "Twice-baked butter croissant filled with premium almond frangipane, topped with flaked almonds and dusted with vanilla snow.",
    longDescription: "Our croissants undergo a rigorous 3-day lamination process using AOP Normandy butter to produce 81 distinct, wafer-thin layers. Twice-baked to lock in moisture, it is loaded with a rich almond cream and baked until golden and highly crisp.",
    images: [images.productCroissant, images.productCroissantDetail1, images.productCroissantDetail2],
    dietary: [],
    ingredients: ["Wheat Flour", "AOP Butter", "Almond Meal", "Sugar", "Eggs", "Yeast", "Rum", "Sliced Almonds", "Salt"],
    allergens: ["Wheat", "Dairy", "Eggs", "Tree Nuts (Almonds)"],
    storage: "Store at room temperature. Warm in a 160°C oven for 4 minutes to restore crispness before serving.",
    rating: 4.9,
    reviews: [mockReviews[2]]
  },
  {
    id: "p4",
    name: "Royal Vanilla Cheesecake",
    slug: "royal-vanilla-cheesecake",
    price: 14.00,
    category: "Cakes",
    description: "A silky baked cream cheese mousse infused with three varieties of vanilla, sitting on a gluten-free speculoos crumb crust.",
    longDescription: "This is a modern reinterpretation of the classic cheesecake. We combine French cream cheese with Italian mascarpone, baking it at a low temperature to prevent browning. Infused with Madagascar, Tahitian, and Mexican vanilla beans, it offers an incredibly complex flavor profile.",
    images: [images.productCheesecake, images.productCheesecakeDetail1, images.productCheesecakeDetail2],
    dietary: ["Gluten-Free", "Nut-Free"],
    ingredients: ["French Cream Cheese", "Mascarpone", "Gluten-Free Oat Flour", "Brown Sugar", "Butter", "Vanilla Beans (Tahiti, Madagascar, Mexico)", "Gelatin", "Lemon Zest"],
    allergens: ["Dairy", "Eggs"],
    storage: "Keep refrigerated. Serve cold. Best consumed within 4 days.",
    rating: 4.7,
    reviews: [mockReviews[3]]
  },
  {
    id: "p5",
    name: "Pistachio Praline Eclair",
    slug: "pistachio-praline-eclair",
    price: 8.50,
    category: "Pastries",
    description: "Choux pastry filled with roasted pistachio pastry cream, topped with a white chocolate glaze and toasted Iranian pistachios.",
    longDescription: "Our choux pastry is piped to exact dimensions and baked to maintain a dry, hollow center. We fill it with a velvety pastry cream made from slowly roasted Sicilian pistachios and a layer of crunchy house-made pistachio praline.",
    images: [images.productEclair, images.productEclairDetail1, images.productEclairDetail2],
    dietary: [],
    ingredients: ["Wheat Flour", "Butter", "Eggs", "Milk", "Sicilian Pistachio Paste", "Sugar", "White Chocolate", "Heavy Cream", "Salt"],
    allergens: ["Wheat", "Dairy", "Eggs", "Tree Nuts (Pistachios)"],
    storage: "Keep refrigerated. Best eaten the day of purchase.",
    rating: 4.8,
    reviews: []
  },
  {
    id: "p6",
    name: "Dark Chocolate Sourdough Pastry",
    slug: "dark-chocolate-sourdough-pastry",
    price: 9.00,
    category: "Pastries",
    description: "Wild yeast sourdough pastry laminated with vegan butter and dark chocolate chunks, finished with organic maple glaze.",
    longDescription: "Using our 120-year-old sourdough starter, this pastry has a deep fermented complexity that balances the dark chocolate. We use plant-based butter and single-origin cocoa, creating a rich pastry suitable for vegans.",
    images: [images.productSourdough, images.productSourdoughDetail1, images.productSourdoughDetail2],
    dietary: ["Vegan", "Nut-Free"],
    ingredients: ["Wheat Flour", "Sourdough Starter (Wild Yeast)", "Vegan Butter", "Organic Sugar", "70% Dark Chocolate (Cacao, Cocoa Butter, Sugar)", "Maple Syrup", "Sea Salt"],
    allergens: ["Wheat"],
    storage: "Store at room temperature. Toast lightly for a fresh-baked texture.",
    rating: 4.6,
    reviews: []
  },
  {
    id: "p7",
    name: "Passion Fruit Pavlova",
    slug: "passion-fruit-pavlova",
    price: 15.00,
    category: "Cakes",
    description: "A crisp French meringue shell, soft marshmallow center, filled with fresh passion fruit curd and Chantilly whipped cream.",
    longDescription: "Our Pavlova has a contrast of textures: a brittle meringue shell that yields to a soft, marshmallowy core. It is topped with an intense, tart passion fruit curd that cuts beautifully through the sweet meringue and fresh vanilla cream.",
    images: [images.productPavlova, images.productPavlovaDetail1, images.productPavlovaDetail2],
    dietary: ["Gluten-Free", "Nut-Free"],
    ingredients: ["Sugar", "Egg Whites", "Passion Fruit Purée", "Butter", "Heavy Cream", "Cornstarch", "Vanilla Extract", "Lime Zest"],
    allergens: ["Eggs", "Dairy"],
    storage: "Refrigerate. Eat within 24 hours to prevent the meringue from softening.",
    rating: 4.8,
    reviews: []
  },
  {
    id: "p8",
    name: "Salted Caramel Mille-Feuille",
    slug: "salted-caramel-mille-feuille",
    price: 11.00,
    category: "Pastries",
    description: "Three layers of caramelized puff pastry filled with sea-salted caramel cremeux and white chocolate whipped ganache.",
    longDescription: "The puff pastry is baked under heavy weights to caramelize the sugars and create wafer-thin, super-crispy sheets. We sandwich these sheets with a rich salted caramel cream made with premium Guérande sea salt.",
    images: [images.productMilleFeuille, images.productMilleFeuilleDetail1, images.productMilleFeuilleDetail2],
    dietary: ["Nut-Free"],
    ingredients: ["Wheat Flour", "AOP Butter", "Sugar", "Milk", "Cream", "Guérande Sea Salt", "Gelatin", "Egg Yolks"],
    allergens: ["Wheat", "Dairy", "Eggs"],
    storage: "Keep refrigerated. Best enjoyed within 24 hours for maximum crispness.",
    rating: 4.9,
    reviews: []
  },
  {
    id: "p9",
    name: "Classic Butter Croissant",
    slug: "classic-butter-croissant",
    price: 6.00,
    category: "Pastries",
    description: "Classic AOP Normandy butter croissant, showcasing distinct honeycomb lamination structure and a deep golden crust.",
    longDescription: "This croissant represents the pure art of lamination. Prepared over three days, our chefs carefully laminate high-butterfat AOP butter with leavened dough. The result is a buttery, airy croissant that shatters delightfully upon first bite.",
    images: [images.productCroissant, images.productCroissantDetail2, images.productCroissantDetail1],
    dietary: ["Nut-Free"],
    ingredients: ["Wheat Flour", "AOP Butter", "Sugar", "Yeast", "Milk", "Salt", "Egg Wash"],
    allergens: ["Wheat", "Dairy", "Eggs"],
    storage: "Store at room temperature. Heat in a 160°C oven for 3-5 minutes to restore texture.",
    rating: 5.0,
    reviews: []
  },
  {
    id: "p10",
    name: "Raspberry Pistachio Tart",
    slug: "raspberry-pistachio-tart",
    price: 13.00,
    category: "Tarts",
    description: "Pistachio frangipane baked in a sweet pastry shell, topped with a pistachio pastry cream and glazed fresh raspberries.",
    longDescription: "A beautiful combination of colors and textures. The sweet pastry shell holds a layer of pistachio frangipane, topped with silky pistachio cream, and finished with fresh raspberries filled with a tart raspberry gel.",
    images: [images.productRaspberryTart, images.productRaspberryTartDetail1, images.productRaspberryTartDetail2],
    dietary: [],
    ingredients: ["Wheat Flour", "Pistachio Paste", "Butter", "Almond Meal", "Sugar", "Eggs", "Fresh Raspberries", "Pectin", "Salt"],
    allergens: ["Wheat", "Dairy", "Eggs", "Tree Nuts (Pistachios, Almonds)"],
    storage: "Keep refrigerated. Consumed within 2 days.",
    rating: 4.7,
    reviews: []
  },
  {
    id: "p11",
    name: "Matcha Sesame Choux",
    slug: "matcha-sesame-choux",
    price: 8.00,
    category: "Pastries",
    description: "A crunchy sesame-craquelin choux filled with a velvety Uji Matcha whipped ganache and black sesame praline paste.",
    longDescription: "A modern East Asian flavor profile. The choux shell is topped with a black sesame craquelin crust before baking. Inside is a vibrant green ganache using premium Japanese ceremonial Uji Matcha, surrounding a liquid black sesame core.",
    images: [images.productChoux, images.productChouxDetail1, images.productChouxDetail2],
    dietary: [],
    ingredients: ["Wheat Flour", "Butter", "Sugar", "Eggs", "Uji Matcha Powder", "Black Sesame Seeds", "Cream", "White Chocolate", "Salt"],
    allergens: ["Wheat", "Dairy", "Eggs", "Sesame"],
    storage: "Keep refrigerated. Serve cold. Best eaten fresh.",
    rating: 4.9,
    reviews: []
  },
  {
    id: "p12",
    name: "Hazelnut Praline Entremet",
    slug: "hazelnut-praline-entremet",
    price: 16.00,
    category: "Cakes",
    description: "Layers of hazelnut dacquoise, crunchy praline feuilletine, and a milk chocolate mousse, coated in a glossy caramel mirror glaze.",
    longDescription: "An elaborate, layered entremet displaying technical pastry art. A base of hazelnut dacquoise is topped with a crispy waffle shard praline layer, encased in milk chocolate mousse, and covered in a flawless mirror glaze.",
    images: [images.productEntremet, images.productEntremetDetail1, images.productEntremetDetail2],
    dietary: ["Gluten-Free"],
    ingredients: ["Hazelnut Meal", "Sugar", "Egg Whites", "Milk Chocolate", "Praline Paste", "Gluten-Free Feuilletine", "Cream", "Gelatin", "Gold Powder"],
    allergens: ["Tree Nuts (Hazelnuts)", "Dairy", "Eggs", "Soy (in chocolate)"],
    storage: "Refrigerate. Keep cold. Consume within 3 days.",
    rating: 4.9,
    reviews: []
  },
  {
    id: "p13",
    name: "Blueberry Violet Gateau",
    slug: "blueberry-violet-gateau",
    price: 15.50,
    category: "Cakes",
    description: "Rich white sponge cake layered with sweet wild blueberries, organic violet-infused Chantilly, and crystallized petals.",
    longDescription: "An aromatic and visually stunning cake inspired by Parisian spring. Soft, moist vanilla sponge is layered with fresh wild blueberry compote and a cream delicately flavored with organic violet essence. Hand-decorated with natural candied violet petals.",
    images: ["/images/blueberry_violet_gateau.png"],
    dietary: ["Nut-Free"],
    ingredients: ["Wheat Flour", "Sugar", "Eggs", "Wild Blueberries", "Heavy Cream", "Violet Essence", "Butter", "Baking Powder"],
    allergens: ["Wheat", "Dairy", "Eggs"],
    storage: "Keep refrigerated. Best served slightly below room temperature.",
    rating: 4.8,
    reviews: []
  },
  {
    id: "p14",
    name: "Double Chocolate Truffle Cake",
    slug: "double-chocolate-truffle-cake",
    price: 14.50,
    category: "Cakes",
    description: "Decadent gluten-free dark chocolate cake layered with rich Belgian chocolate truffle ganache and cocoa nib dust.",
    longDescription: "Our chocolate gateau features alternating layers of flourless chocolate sponge and silk-textured Valrhona chocolate mousse. Coated in a glossy dark chocolate mirror glaze and dusted with roasted Ecuadorian cocoa nibs for a satisfying crunch.",
    images: ["/images/double_chocolate_truffle_cake.png"],
    dietary: ["Gluten-Free", "Nut-Free"],
    ingredients: ["Valrhona Chocolate 70%", "Butter", "Eggs", "Sugar", "Cocoa Powder", "Cream", "Cocoa Nibs", "Vanilla"],
    allergens: ["Dairy", "Eggs"],
    storage: "Keep refrigerated. Allow to stand at room temperature for 15 minutes before serving.",
    rating: 4.9,
    reviews: []
  },
  {
    id: "p15",
    name: "Lemon Meringue Tart",
    slug: "lemon-meringue-tart",
    price: 11.50,
    category: "Tarts",
    description: "Zesty organic Meyer lemon curd in a sweet butter shell, topped with a cloud of toasted, silky Italian meringue.",
    longDescription: "A timeless French classic. The crisp, buttery Pâte Sablée shell is loaded with an intensely tangy lemon curd made with organic Meyer lemons. Crowned with clean, whipped Italian meringue that is lightly blowtorched to a golden toast.",
    images: ["/images/lemon_meringue_tart.png"],
    dietary: ["Nut-Free"],
    ingredients: ["Meyer Lemons", "Eggs", "Sugar", "Butter", "Wheat Flour", "Egg Whites", "Salt"],
    allergens: ["Wheat", "Dairy", "Eggs"],
    storage: "Keep refrigerated. Serve cold. Consume within 2 days.",
    rating: 4.7,
    reviews: []
  },
  {
    id: "p16",
    name: "Maldon Salted Pecan Tart",
    slug: "maldon-salted-pecan-tart",
    price: 12.50,
    category: "Tarts",
    description: "Toasted southern pecans cooked in a rich, buttery caramel base, finished with hand-harvested Maldon sea salt flakes.",
    longDescription: "A sweet, nutty tart with exceptional texture. We toast organic pecans to release their oils, then toss them into a rich amber caramel made with fresh Normandy butter and heavy cream. A light sprinkle of Maldon sea salt flakes cuts the sweetness beautifully.",
    images: ["/images/salted_pecan_tart.png"],
    dietary: [],
    ingredients: ["Pecans", "Normandy Butter", "Sugar", "Heavy Cream", "Maldon Salt", "Wheat Flour", "Eggs"],
    allergens: ["Wheat", "Dairy", "Eggs", "Tree Nuts (Pecans)"],
    storage: "Store at room temperature. Best within 5 days.",
    rating: 4.8,
    reviews: []
  },
  {
    id: "p17",
    name: "Wild Blackberry Frangipane Tart",
    slug: "wild-blackberry-frangipane-tart",
    price: 13.50,
    category: "Tarts",
    description: "Sweet almond frangipane baked in a shortbread crust, topped with fresh blackberries and organic lavender glaze.",
    longDescription: "This tart combines a rich, nutty baked almond cream with the brightness of seasonal organic blackberries. Baked until golden brown, then glazed with a light, floral lavender-infused syrup.",
    images: ["/images/blackberry_frangipane_tart.png"],
    dietary: [],
    ingredients: ["Almond Meal", "Butter", "Sugar", "Eggs", "Fresh Blackberries", "Lavender Syrup", "Wheat Flour"],
    allergens: ["Wheat", "Dairy", "Eggs", "Tree Nuts (Almonds)"],
    storage: "Keep refrigerated. Serve at room temperature.",
    rating: 4.6,
    reviews: []
  },
  {
    id: "p18",
    name: "Sicilian Pistachio Macarons",
    slug: "sicilian-pistachio-macarons",
    price: 19.00,
    category: "Macarons",
    description: "Green almond shells filled with a rich, nutty ganache made from slow-roasted Bronte pistachio paste.",
    longDescription: "Our pistachio macarons showcase the pure, unmatched flavor of Sicilian pistachios. Filled with a smooth white chocolate ganache that is slow-emulsified with organic pistachio paste, providing a rich, deeply nutty profile.",
    images: ["/images/sicilian_pistachio_macarons.png"],
    dietary: ["Gluten-Free"],
    ingredients: ["Almond Flour", "Pistachio Paste", "Powdered Sugar", "Egg Whites", "White Chocolate", "Heavy Cream", "Salt"],
    allergens: ["Tree Nuts (Almonds, Pistachios)", "Dairy", "Eggs"],
    storage: "Keep cool. Consume within 5 days.",
    rating: 4.9,
    reviews: []
  },
  {
    id: "p19",
    name: "Belgian Chocolate Macarons",
    slug: "belgian-chocolate-macarons",
    price: 18.50,
    category: "Macarons",
    description: "Chocolate meringue shells filled with a velvety dark Belgian chocolate fudge and cocoa nib infusion.",
    longDescription: "A chocolate lover's dream. Rich, dark cocoa shells are filled with a dense, fudge-like ganache made with 70% dark Belgian chocolate and organic heavy cream, providing a bittersweet finish.",
    images: ["/images/belgian_chocolate_macarons.png"],
    dietary: ["Gluten-Free", "Nut-Free"],
    ingredients: ["Almond Flour", "Cacao Powder", "Powdered Sugar", "Egg Whites", "Belgian Chocolate 70%", "Heavy Cream", "Butter"],
    allergens: ["Tree Nuts (Almonds)", "Dairy", "Eggs"],
    storage: "Keep cool. Consume within 5 days.",
    rating: 4.8,
    reviews: []
  },
  {
    id: "p20",
    name: "Tahitian Vanilla Macarons",
    slug: "tahitian-vanilla-macarons",
    price: 18.00,
    category: "Macarons",
    description: "Vanilla bean meringue shells sandwiched with white chocolate buttercream and Tahitian vanilla bean caviar.",
    longDescription: "Sweet, classic, and elegant. Infused with natural Tahitian vanilla caviar, this macaron is filled with a whipped white chocolate buttercream that provides a fragrant, rich cream profile.",
    images: ["/images/tahitian_vanilla_macarons.png"],
    dietary: ["Gluten-Free"],
    ingredients: ["Almond Flour", "Tahitian Vanilla", "Powdered Sugar", "Egg Whites", "White Chocolate", "Buttercream", "Sugar"],
    allergens: ["Tree Nuts (Almonds)", "Dairy", "Eggs"],
    storage: "Keep cool. Consume within 5 days.",
    rating: 4.8,
    reviews: []
  },
  {
    id: "p21",
    name: "Salted Caramel Macarons",
    slug: "salted-caramel-macarons",
    price: 19.50,
    category: "Macarons",
    description: "Crisp shells filled with a smooth, salted caramel paste made with Guérande fleur de sel.",
    longDescription: "The perfect balance of sweet and salty. Our macarons are filled with a luscious, slow-cooked amber caramel infused with Guérande sea salt and AOP butter, providing a rich buttery chew.",
    images: ["/images/salted_caramel_macarons.png"],
    dietary: ["Gluten-Free"],
    ingredients: ["Almond Flour", "Powdered Sugar", "Egg Whites", "Guérande Sea Salt", "Sugar", "Butter", "Heavy Cream"],
    allergens: ["Tree Nuts (Almonds)", "Dairy", "Eggs"],
    storage: "Keep cool. Consume within 5 days.",
    rating: 4.9,
    reviews: []
  }
];

export const mockTastingBoxes: TastingBox[] = [
  {
    id: "b1",
    name: "The Royal Box",
    slug: "the-royal-box",
    price: 54.00,
    description: "Our signature luxury box featuring a curation of 12 iconic pastries and macarons for the ultimate tasting experience.",
    longDescription: "Designed for royalty, this box combines our most celebrated creations. It features 12 individual items curated by our pastry chef to present a balance of chocolate, fruit, floral, and nutty notes. Ideal for gifting, events, or a decadent tasting flight.",
    image: images.boxRoyal,
    itemCount: 12,
    contents: [
      { name: "Chocolate Gold Leaf Tart", qty: 3, slug: "chocolate-gold-leaf-tart" },
      { name: "Parisian Rose Macarons", qty: 4, slug: "parisian-rose-macarons" },
      { name: "Pistachio Praline Eclair", qty: 3, slug: "pistachio-praline-eclair" },
      { name: "Classic Butter Croissant", qty: 2, slug: "classic-butter-croissant" }
    ],
    customizableItems: [
      {
        originalName: "Classic Butter Croissant",
        options: ["Almond Laminated Croissant", "Dark Chocolate Sourdough Pastry"]
      },
      {
        originalName: "Pistachio Praline Eclair",
        options: ["Matcha Sesame Choux", "Salted Caramel Mille-Feuille"]
      }
    ]
  },
  {
    id: "b2",
    name: "The Connoisseur's Selection",
    slug: "the-connoisseurs-selection",
    price: 39.00,
    description: "An editorial collection of 8 highly technical, texture-heavy pastries showcasing our kitchen's experimental techniques.",
    longDescription: "A box for the true pastry enthusiast. Focuses on advanced techniques, fermented grains, and delicate textures. Includes a booklet on the science of each piece, detailing hydration ratios and caramelization parameters.",
    image: images.boxConnoisseur,
    itemCount: 8,
    contents: [
      { name: "Salted Caramel Mille-Feuille", qty: 2, slug: "salted-caramel-mille-feuille" },
      { name: "Matcha Sesame Choux", qty: 2, slug: "matcha-sesame-choux" },
      { name: "Almond Laminated Croissant", qty: 2, slug: "almond-laminated-croissant" },
      { name: "Hazelnut Praline Entremet", qty: 2, slug: "hazelnut-praline-entremet" }
    ],
    customizableItems: [
      {
        originalName: "Almond Laminated Croissant",
        options: ["Classic Butter Croissant", "Dark Chocolate Sourdough Pastry"]
      }
    ]
  },
  {
    id: "b3",
    name: "Date Night Duo",
    slug: "date-night-duo",
    price: 18.00,
    description: "A romantic, curated pairing of two individual desserts and two macarons, complete with a custom tasting guide.",
    longDescription: "Make dessert the main event. This intimate box features two of our most beautiful and romantic creations (the Passion Fruit Pavlova and the Chocolate Gold Leaf Tart), along with a matching pair of Parisian Rose Macarons, perfect for sharing.",
    image: images.boxDateNight,
    itemCount: 4,
    contents: [
      { name: "Passion Fruit Pavlova", qty: 1, slug: "passion-fruit-pavlova" },
      { name: "Chocolate Gold Leaf Tart", qty: 1, slug: "chocolate-gold-leaf-tart" },
      { name: "Parisian Rose Macarons", qty: 2, slug: "parisian-rose-macarons" }
    ],
    customizableItems: [
      {
        originalName: "Passion Fruit Pavlova",
        options: ["Royal Vanilla Cheesecake", "Hazelnut Praline Entremet"]
      }
    ]
  },
  {
    id: "b4",
    name: "Seasonal Fruit Box",
    slug: "seasonal-fruit-box",
    price: 45.00,
    description: "A bright, summer-themed box of 10 desserts focusing on fresh fruit curds, local berries, and bright citrus botanicals.",
    longDescription: "Our pastry kitchen partners directly with local organic farms to capture peak harvest flavors. This box celebrates seasonal fruits, with light whipped creams, crisp crusts, and vibrant fruit gels.",
    image: images.boxSeasonal,
    itemCount: 10,
    contents: [
      { name: "Raspberry Pistachio Tart", qty: 3, slug: "raspberry-pistachio-tart" },
      { name: "Passion Fruit Pavlova", qty: 3, slug: "passion-fruit-pavlova" },
      { name: "Parisian Rose Macarons", qty: 4, slug: "parisian-rose-macarons" }
    ],
    customizableItems: [
      {
        originalName: "Raspberry Pistachio Tart",
        options: ["Chocolate Gold Leaf Tart", "Royal Vanilla Cheesecake"]
      }
    ]
  }
];

export const mockBlogPosts: BlogPost[] = [
  {
    id: "post1",
    title: "The Physics of Lamination: Engineering 81 Butter Layers",
    slug: "physics-of-lamination",
    category: "Technique",
    excerpt: "Why AOP Normandy butter, temperature precision, and the number 81 are the structural secrets to the perfect flaky croissant.",
    content: `
      <h2>The Mathematics of the Perfect Croissant</h2>
      <p>Lamination is the process of alternating layers of dough (détrempe) and butter (beurrage) through a series of precise folds. The goal is to create a structure that, when baked, rises into a light, honeycomb-like crumb. But how many layers are optimal?</p>
      <p>In classical pastry, the standard formula is a "double turn" followed by a "single turn," repeated to yield exactly <strong>81 layers of butter</strong> separated by 82 layers of dough. If you fold too few times, the butter pools during baking, resulting in a greasy, heavy pastry. If you fold too many times (for example, exceeding 243 layers), the butter layers become so thin that they merge into the dough, turning the croissant into brioche.</p>
      
      <blockquote>"Pastry is not an art that uses chemistry; it is chemistry that requires an artistic eye." <br/>— Head Pastry Chef, KingsBakery</blockquote>

      <h2>Step-by-Step Lamination Guide</h2>
      <p>Below is the precise technical process our kitchen uses to laminate our daily croissants:</p>
      <ol>
        <li><strong>Détrempe Preparation:</strong> Mix flour, yeast, sugar, water, and salt. Knead lightly. Retard the dough in the freezer at -5°C for 2 hours, then in the fridge at 4°C overnight to arrest fermentation and relax the gluten.</li>
        <li><strong>Beurrage Slab:</strong> Roll cold AOP Normandy butter (82% butterfat) into a perfect square. The butter must be exactly 12°C—pliable like clay, but not melting.</li>
        <li><strong>The Encasement:</strong> Place the butter square diagonally on the rolled dough. Fold the corners of the dough over the butter to seal it completely.</li>
        <li><strong>The First Turn (Double Fold):</strong> Roll the dough into a rectangle three times its length. Fold the outer edges in to meet in the middle, then fold the entire block in half (like a book). Rest in the fridge at 2°C for 1 hour.</li>
        <li><strong>The Second Turn (Single Fold):</strong> Roll the rested dough lengthwise again. Fold it in thirds (like a business letter). Rest in the fridge for another hour before rolling out to final thickness (4mm) and cutting.</li>
      </ol>

      <h2>The Role of Steam</h2>
      <p>When the laminated dough enters our deck ovens at 190°C, the water trapped inside the butter layers vaporizes rapidly. This steam pressure pushes the dough layers upward. Simultaneously, the butter melts, frying the adjacent dough sheets from the inside out and setting the structure. The result is the golden, shattered crust we obsession over.</p>
    `,
    author: {
      name: "Chef Marcus King",
      role: "Founder & Head Chef",
      avatar: images.aboutTeam1
    },
    date: "2026-06-18",
    readTime: "6 min read",
    image: images.blogHero6
  },
  {
    id: "post2",
    title: "The Science of Tempering Chocolate: Crystals and Viscosity",
    slug: "science-of-tempering-chocolate",
    category: "Technique",
    excerpt: "Understanding Beta-V crystals. A molecular deep-dive into how temperature manipulation creates the shiny, snapping chocolate finish.",
    content: `
      <h2>The Molecular Structure of Cocoa Butter</h2>
      <p>Tempering chocolate is not just about melting; it is a controlled crystallization process. Cocoa butter contains triacylglycerols, which can crystallize into six different polymorphic forms (designated Form I through Form VI), each with different melting points and stabilities.</p>
      <p>For pastry work, we seek exclusively <strong>Form V (Beta-V) crystals</strong>. Form V crystals melt at 33.8°C. They provide chocolate with its signature characteristics: a glossy surface finish, a clean snap when broken, and a melting point that sits just below human body temperature, allowing it to melt instantly on the tongue.</p>

      <blockquote>"Tempering is the art of crystal selection. We destroy all unstable configurations to allow the Beta-V crystals to lock together."</blockquote>

      <h2>The Three-Step Tempering Curve</h2>
      <p>For our Valrhona 72% dark chocolate, we follow a strict thermal curve:</p>
      <ol>
        <li><strong>Melting (45°C - 50°C):</strong> Melt the chocolate completely to destroy all pre-existing crystal structures in the cocoa butter. Do not exceed 55°C, or the sugars will burn.</li>
        <li><strong>Cooling / Seeding (27°C - 28°C):</strong> Cool the chocolate rapidly while agitating. This induces the growth of both Form IV and Form V crystal nuclei.</li>
        <li><strong>Reheating (31°C - 32°C):</strong> Gently raise the temperature back to 31.5°C. This melts away the unstable Form IV crystals (melting point 27.3°C), leaving a high concentration of stable Form V crystals ready to align.</li>
      </ol>

      <h2>The Snap Test</h2>
      <p>Before casting the chocolate onto our sables, we dip a metal spatula into the tempered pool. At room temperature (20°C), the chocolate must set completely within 3 minutes, showing a satin shine and no streaks. If it takes longer, or displays white bloom, the temper has failed, and the crystals must be reset.</p>
    `,
    author: {
      name: "Dr. Clara Dupont",
      role: "Pastry R&D Chemist",
      avatar: images.aboutTeam2
    },
    date: "2026-06-20",
    readTime: "5 min read",
    image: images.blogHero2
  },
  {
    id: "post3",
    title: "Maillard Reaction & Oven Spring in Yeast Fermentations",
    slug: "maillard-reaction-and-oven-spring",
    category: "Behind the Scenes",
    excerpt: "How complex sugars and heat combine to create caramelization profiles, and how steam control preserves volume in high-hydration baking.",
    content: `
      <h2>The Chemistry of Crust and Color</h2>
      <p>The delicious, nutty aroma and deep brown color of our sourdough pastries are the result of the Maillard reaction—a chemical reaction between amino acids and reducing sugars that occurs under high heat. Unlike pure caramelization (which only involves sugars), the Maillard reaction produces hundreds of complex flavor compounds that define artisan baking.</p>
      <p>To maximize this reaction, our doughs undergo long cold fermentation. This allows enzymes (amylases) to break starch molecules down into simple sugars, and proteases to break proteins into amino acids, priming the dough for the oven's heat.</p>

      <h2>Oven Spring Sequence</h2>
      <ol>
        <li><strong>Enzyme Acceleration (30°C - 45°C):</strong> As the loaf enters the hot oven, yeast activity peaks, releasing carbon dioxide rapidly.</li>
        <li><strong>Starch Gelatinization (55°C - 65°C):</strong> Yeast dies. Starches absorb water and swell, setting the internal structure.</li>
        <li><strong>Protein Coagulation (70°C - 80°C):</strong> Gluten proteins solidify, locking the dough's expanded volume into place.</li>
        <li><strong>Crust Pyrolysis (140°C - 190°C):</strong> Moisture evaporates from the surface, initiating the Maillard reaction and final caramelization.</li>
      </ol>

      <h2>The Role of Steam Injection</h2>
      <p>In our deck ovens, we inject superheated steam during the first 10 minutes of baking. The steam condenses on the cold dough, releasing latent heat and keeping the outer skin elastic. This allows the loaf to expand fully (the 'oven spring') without cracking. It also dissolves surface starches, which dry into a thin, glassy, and exceptionally crispy crust.</p>
    `,
    author: {
      name: "Chef Marcus King",
      role: "Founder & Head Chef",
      avatar: images.aboutTeam1
    },
    date: "2026-06-22",
    readTime: "8 min read",
    image: images.blogHero3
  },
  {
    id: "post4",
    title: "Acids, Pectin, and Gelation: Fruit Curds Demystified",
    slug: "acids-pectin-gelation-fruit-curds",
    category: "Ingredients",
    excerpt: "A look into the molecular gelation of fruit purées, understanding pH ranges, and balancing sugar to create clean, sharp fruit gels.",
    content: `
      <h2>Setting Curds Without Starchiness</h2>
      <p>In luxury pastry, fruit fillings must taste intense and clean. Using starch (like cornstarch) to thicken a fruit filling coats the palate, masking the delicate volatile oils of fresh berries. Instead, we rely on the molecular properties of pectin and acid gelation.</p>
      <p>Pectin is a structural carbohydrate found in fruit cell walls. To form a stable gel, pectin molecules require acid (to neutralize their negative charges, letting them aggregate) and sugar (to bind water molecules, forcing pectin out of solution and into a three-dimensional network).</p>

      <h2>Formulating the Perfect Passion Fruit Curd</h2>
      <p>For our Passion Fruit Pavlova, we target a precise pH of 3.2. Passion fruit is naturally rich in citric acid, providing the perfect environment for gelation. We combine the fruit pulp with egg yolks and sugar, heating gently to 82°C to coagulate the egg proteins, then whisking in cold butter to create a silky, stable emulsion.</p>

      <h2>The Gelation Procedure</h2>
      <ol>
        <li><strong>Purée Concentration:</strong> Heat the fruit pulp to 40°C to activate natural enzymes.</li>
        <li><strong>Pectin Dispersion:</strong> Premix dry pectin with sugar to prevent clumping, then rain it into the warm purée while whisking.</li>
        <li><strong>Thermal Activation:</strong> Bring the mixture to a boil (100°C) for exactly 1 minute. Pectin molecules must be fully hydrated and dissolved to cross-link.</li>
        <li><strong>Acid Adjustments:</strong> Add a splash of fresh lemon or lime juice to drop the pH if the fruit sweetness is too dominant.</li>
      </ol>
    `,
    author: {
      name: "Dr. Clara Dupont",
      role: "Pastry R&D Chemist",
      avatar: images.aboutTeam2
    },
    date: "2026-06-24",
    readTime: "6 min read",
    image: images.blogHero4
  },
  {
    id: "post5",
    title: "Surface Tension and Light Reflection in Mirror Glazes",
    slug: "surface-tension-mirror-glazes",
    category: "Behind the Scenes",
    excerpt: "The physics of flawless mirror finishes. Controlling bubble formation, gelatin bloom strengths, and emulsion temperatures.",
    content: `
      <h2>The Optics of a Perfect Mirror Glaze</h2>
      <p>A mirror glaze (glaçage miroir) must reflect its surroundings like polished glass. This property relies on creating a perfectly homogeneous emulsion of fat, water, and sugars with no trapped air bubbles.</p>
      <p>The glaze is an emulsion of white chocolate, sweetened condensed milk, sugar, water, and gelatin. Gelatin provides the elastic structure that wraps around the dessert, while the fats in the white chocolate scatter light, providing depth and opacity.</p>

      <h2>Controlling the Variables</h2>
      <ul>
        <li><strong>Bloom Strength:</strong> We use exclusively 200-bloom gold gelatin sheets. This specific bloom strength yields a gel that is stable at room temperature but melts instantly in the mouth, avoiding a rubbery mouthfeel.</li>
        <li><strong>Emulsification Temp:</strong> We blend the glaze using a high-shear immersion blender at 40°C, keeping the blade completely submerged to avoid incorporating air.</li>
        <li><strong>Pouring Temperature:</strong> The glaze must be cooled to exactly 32°C before pouring. If it is poured too hot (e.g. 35°C), it will melt the mousse beneath it and run off, leaving a thin, transparent coat. If it is poured too cold (29°C), it will set too fast, leaving uneven drips and ripples.</li>
      </ul>

      <h2>The Application Protocol</h2>
      <p>The entremet cake must be frozen solid (-22°C) when glazed. The extreme temperature difference causes the gelatin in the glaze to set instantly on contact, locking in a glassy, level finish with zero surface distortion.</p>
    `,
    author: {
      name: "Chef Marcus King",
      role: "Founder & Head Chef",
      avatar: images.aboutTeam1
    },
    date: "2026-06-26",
    readTime: "4 min read",
    image: images.blogHero5
  },
  {
    id: "post6",
    title: "Sourcing Organic Grains: Gluten Strength and Hydration",
    slug: "sourcing-organic-grains",
    category: "Ingredients",
    excerpt: "An investigation into stone-ground wheat varieties, protein content percentages, and how enzymatic activity affects long fermentation.",
    content: `
      <h2>The Flour Sourcing Obsession</h2>
      <p>Flour is not just a powder; it is a complex biological engine. For our pastries and breads, we source heritage organic grain varieties from local mills. These wheats are stone-ground at low speeds, preserving the grain's germ and bran, which are rich in natural oils, vitamins, and wild yeasts.</p>
      <p>However, stone-ground heritage flours possess highly active enzymes and lower, more fragile gluten structures compared to industrial steel-roller white flour. Baking with them requires a deep understanding of protein quality and hydration limits.</p>

      <h2>Gluten Matrix Mechanics</h2>
      <p>When water is added to flour, two proteins—gliadin (which gives dough extensibility) and glutenin (which gives elasticity)—combine to form a gluten matrix. In our laminated doughs, we require a strong, elastic matrix that can hold the butter layers without tearing.</p>
      <p>We blend two specific grains: a high-protein winter wheat (13.5% protein) for structural strength, and an ancient grain spelled (11% protein) for its nutty flavor profile and high solubility. This blend allows us to target an overall hydration level of 64% in our croissants, ensuring they bake up airy and light.</p>
    `,
    author: {
      name: "Dr. Clara Dupont",
      role: "Pastry R&D Chemist",
      avatar: images.aboutTeam2
    },
    date: "2026-06-27",
    readTime: "7 min read",
    image: images.blogHero1
  }
];

export const mockFAQs = [
  {
    category: "Ordering",
    questions: [
      {
        q: "How far in advance do I need to order?",
        a: "Because all our desserts are handcrafted from scratch and require up to 3 days of preparation (especially our laminated pastries), we recommend ordering at least 48 hours in advance. For weekends or holidays, slots fill up quickly, and we close dates when capacity is reached."
      },
      {
        q: "Can I customize a tasting box?",
        a: "Yes. Our curated tasting boxes (such as The Royal Box or Date Night Duo) allow you to swap select items. On the Tasting Box page, you can toggle the customizable slots and choose from an allowed list of alternative desserts to suit your preferences."
      },
      {
        q: "What is your custom cake policy?",
        a: "We offer custom design cakes for weddings, corporate events, and large celebrations. Please contact us via our custom form on the Contact page, or email custom@kingsbakery.com with your date, guest count, and design inspiration. We require a 3-week lead time for custom bakes."
      }
    ]
  },
  {
    category: "Delivery",
    questions: [
      {
        q: "How does delivery work?",
        a: "We deliver using climate-controlled vehicles to ensure your desserts arrive perfectly chilled. During checkout, you can select your delivery date and a specific time slot (e.g. 10 AM - 1 PM). Our driver will call you 15 minutes before arrival."
      },
      {
        q: "Do you offer same-day delivery?",
        a: "Yes, we offer limited same-day delivery in Manhattan for select pastries and cakes in stock. Same-day ordering closes at 12 PM daily, and deliveries are made in our afternoon slot (3 PM - 6 PM)."
      },
      {
        q: "What is the delivery fee?",
        a: "We charge a flat delivery fee of $8.00 within our delivery zone. Deliveries are free for all orders over $75.00."
      }
    ]
  },
  {
    category: "Ingredients & Allergens",
    questions: [
      {
        q: "Do you offer gluten-free or vegan options?",
        a: "We do. Several of our items (like the Royal Vanilla Cheesecake and the Passion Fruit Pavlova) are gluten-free, and we have a vegan Dark Chocolate Sourdough Pastry. All dietary symbols are noted on the bakery item pages. Please note that while we take extreme care, our kitchen processes wheat, nuts, and dairy."
      },
      {
        q: "Where do you source your ingredients?",
        a: "We obsess over quality. We import AOP butter from Normandy, France, chocolate from Valrhona, and vanilla beans from Tahiti and Madagascar. Our fresh berries, organic flour, and dairy are sourced from local partners who practice sustainable farming."
      }
    ]
  }
];
