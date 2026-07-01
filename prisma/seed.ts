import { PrismaClient, StockStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting seeding process...");

  // 1. Clean existing database records
  console.log("🧹 Cleaning existing data...");
  await prisma.review.deleteMany({});
  await prisma.productImage.deleteMany({});
  await prisma.tastingBoxItem.deleteMany({});
  await prisma.tastingBox.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.dietaryTag.deleteMany({});
  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.deliverySlot.deleteMany({});
  await prisma.blogPost.deleteMany({});
  await prisma.contactSubmission.deleteMany({});
  await prisma.newsletterSubscriber.deleteMany({});
  await prisma.adminUser.deleteMany({});

  // 2. Seed Admin User
  console.log("🔐 Seeding Admin User...");
  const adminEmail = process.env.ADMIN_SEED_EMAIL || "admin@kingsbakery.com";
  const adminPassword = process.env.ADMIN_SEED_PASSWORD || "KingsBakery2026!";
  const passwordHash = bcrypt.hashSync(adminPassword, 10);

  await prisma.adminUser.create({
    data: {
      email: adminEmail,
      name: "Al Amin Robin",
      passwordHash: passwordHash,
      role: "admin",
    },
  });
  console.log(`👤 Admin created. Login: ${adminEmail} / ${adminPassword}`);

  // 3. Seed Categories
  console.log("📁 Seeding Categories...");
  const categoriesList = [
    { slug: "cakes", name: "Cakes" },
    { slug: "tarts", name: "Tarts" },
    { slug: "pastries", name: "Pastries" },
    { slug: "macarons", name: "Macarons" },
  ];

  const categoriesMap: Record<string, string> = {};
  for (const cat of categoriesList) {
    const created = await prisma.category.create({ data: cat });
    categoriesMap[cat.name] = created.id;
  }

  // 4. Seed Dietary Tags
  console.log("🏷 Seeding Dietary Tags...");
  const dietaryTagsList = [
    { label: "Gluten-Free" },
    { label: "Vegan" },
    { label: "Nut-Free" },
    { label: "Dairy-Free" },
  ];

  const dietaryTagsMap: Record<string, string> = {};
  for (const tag of dietaryTagsList) {
    const created = await prisma.dietaryTag.create({ data: tag });
    dietaryTagsMap[tag.label] = created.id;
  }

  // 5. Seed Products (18 products total, 4 in each category, matching mock data)
  console.log("🍰 Seeding Products & Reviews...");
  
  const productsToSeed = [
    // Cakes (4 items)
    {
      name: "Royal Vanilla Cheesecake",
      slug: "royal-vanilla-cheesecake",
      price: 14.00,
      categoryName: "Cakes",
      description: "A silky baked cream cheese mousse infused with three varieties of vanilla, sitting on a gluten-free speculoos crumb crust.",
      longDescription: "This is a modern reinterpretation of the classic cheesecake. We combine French cream cheese with Italian mascarpone, baking it at a low temperature to prevent browning. Infused with Madagascar, Tahitian, and Mexican vanilla beans, it offers an incredibly complex flavor profile.",
      images: ["/images/berry_cheesecake.png"],
      dietary: ["Gluten-Free", "Nut-Free"],
      ingredients: ["French Cream Cheese", "Mascarpone", "Gluten-Free Oat Flour", "Brown Sugar", "Butter", "Vanilla Beans", "Gelatin", "Lemon Zest"],
      allergens: ["Dairy", "Eggs"],
      shelfLifeDays: 4,
      isFeatured: true,
      reviews: [
        { authorName: "Genevieve Roche", rating: 5, comment: "Stunning presentation. The box alone feels like a luxury jewelry packaging. The Vanilla Cheesecake is incredibly light yet decadent." }
      ]
    },
    {
      name: "Passion Fruit Pavlova",
      slug: "passion-fruit-pavlova",
      price: 15.00,
      categoryName: "Cakes",
      description: "A crisp French meringue shell, soft marshmallow center, filled with fresh passion fruit curd and Chantilly whipped cream.",
      longDescription: "Our Pavlova has a contrast of textures: a brittle meringue shell that yields to a soft, marshmallowy core. It is topped with an intense, tart passion fruit curd that cuts beautifully through the sweet meringue and fresh vanilla cream.",
      images: ["/images/berry_cheesecake.png"],
      dietary: ["Gluten-Free", "Nut-Free"],
      ingredients: ["Sugar", "Egg Whites", "Passion Fruit Purée", "Butter", "Heavy Cream", "Cornstarch", "Vanilla Extract", "Lime Zest"],
      allergens: ["Eggs", "Dairy"],
      shelfLifeDays: 1,
      isFeatured: false,
      reviews: [
        { authorName: "Victoria Sterling", rating: 5, comment: "Perfect balance of sweet meringue and sour passion fruit. The textures are absolute heaven!" }
      ]
    },
    {
      name: "Hazelnut Praline Entremet",
      slug: "hazelnut-praline-entremet",
      price: 16.00,
      categoryName: "Cakes",
      description: "Layers of hazelnut dacquoise, crunchy praline feuilletine, and a milk chocolate mousse, coated in a glossy caramel mirror glaze.",
      longDescription: "An elaborate, layered entremet displaying technical pastry art. A base of hazelnut dacquoise is topped with a crispy waffle shard praline layer, encased in milk chocolate mousse, and covered in a flawless mirror glaze.",
      images: ["/images/hazelnut_entremet.png"],
      dietary: ["Gluten-Free"],
      ingredients: ["Hazelnut Meal", "Sugar", "Egg Whites", "Milk Chocolate", "Praline Paste", "Gluten-Free Feuilletine", "Cream", "Gelatin", "Gold Powder"],
      allergens: ["Tree Nuts (Hazelnuts)", "Dairy", "Eggs", "Soy"],
      shelfLifeDays: 3,
      isFeatured: true,
      reviews: []
    },
    {
      name: "Black Forest Gateau",
      slug: "black-forest-gateau",
      price: 15.50,
      categoryName: "Cakes",
      description: "Rich chocolate sponge layers soaked in kirsch syrup, layered with sour Amarena cherries and Chantilly whipped cream.",
      longDescription: "A dark, intense German classic made with single-origin Venezuelan chocolate. Layered with double cream and imported Italian Amarena wild cherries soaked in pure Kirschwasser cherry brandy. The top is finished with dark chocolate curls.",
      images: ["/images/hazelnut_entremet.png"],
      dietary: ["Nut-Free"],
      ingredients: ["Dark Chocolate 64%", "Wheat Flour", "Kirsch Syrup", "Amarena Cherries", "Heavy Cream", "Sugar", "Eggs", "Cacao Powder"],
      allergens: ["Wheat", "Dairy", "Eggs"],
      shelfLifeDays: 3,
      isFeatured: false,
      reviews: []
    },

    // Tarts (4 items)
    {
      name: "Chocolate Gold Leaf Tart",
      slug: "chocolate-gold-leaf-tart",
      price: 12.00,
      categoryName: "Tarts",
      description: "A dark chocolate ganache infused with Madagascan vanilla, nestled in a cacao sable shell and topped with 24k edible gold leaf.",
      longDescription: "Our signature tart is crafted with single-origin 72% Valrhona dark chocolate. The ganache is slow-emulsified with organic grass-fed cream to achieve a velvet-smooth texture. Each tart is hand-burnished with gold leaf, making it a dramatic crown jewel for any dining experience.",
      images: ["/images/chocolate_tart.png"],
      dietary: ["Nut-Free"],
      ingredients: ["Valrhona 72% Dark Chocolate", "Organic Heavy Cream", "Butter", "Wheat Flour", "Sugar", "Cacao Powder", "Madagascan Vanilla Bean", "24k Gold Leaf"],
      allergens: ["Wheat", "Dairy", "Eggs"],
      shelfLifeDays: 3,
      isFeatured: true,
      reviews: [
        { authorName: "Arthur Pendragon", rating: 5, comment: "The Chocolate Gold Leaf Tart is a masterclass in balance. The crust is perfectly thin and crisp, and the ganache is smooth as silk. Exceptional." }
      ]
    },
    {
      name: "Raspberry Pistachio Tart",
      slug: "raspberry-pistachio-tart",
      price: 13.00,
      categoryName: "Tarts",
      description: "Pistachio frangipane baked in a sweet pastry shell, topped with a pistachio pastry cream and glazed fresh raspberries.",
      longDescription: "A beautiful combination of colors and textures. The sweet pastry shell holds a layer of pistachio frangipane, topped with silky pistachio cream, and finished with fresh raspberries filled with a tart raspberry gel.",
      images: ["/images/chocolate_tart.png"],
      dietary: [],
      ingredients: ["Wheat Flour", "Pistachio Paste", "Butter", "Almond Meal", "Sugar", "Eggs", "Fresh Raspberries", "Pectin", "Salt"],
      allergens: ["Wheat", "Dairy", "Eggs", "Tree Nuts (Pistachios, Almonds)"],
      shelfLifeDays: 2,
      isFeatured: false,
      reviews: []
    },
    {
      name: "Lemon Meringue Tart",
      slug: "lemon-meringue-tart",
      price: 11.50,
      categoryName: "Tarts",
      description: "Zesty Meyer lemon curd in a crisp butter pastry shell, crowned with billows of toasted Italian meringue.",
      longDescription: "Our award-winning lemon tart features a sharp and intense curd made from freshly squeezed organic Meyer lemons. The tartness is balanced by the pillowy sweetness of toasted Italian meringue, piped in intricate spirals.",
      images: ["/images/lemon_meringue_tart.png"],
      dietary: ["Nut-Free"],
      ingredients: ["Meyer Lemon Juice", "Sugar", "Butter", "Eggs", "Wheat Flour", "Vanilla Extract", "Salt"],
      allergens: ["Wheat", "Dairy", "Eggs"],
      shelfLifeDays: 2,
      isFeatured: false,
      reviews: []
    },
    {
      name: "Maldon Salted Pecan Tart",
      slug: "maldon-salted-pecan-tart",
      price: 12.50,
      categoryName: "Tarts",
      description: "Toasted southern pecans cooked in a rich, buttery caramel base, finished with hand-harvested Maldon sea salt flakes.",
      longDescription: "A sweet, nutty tart with exceptional texture. We toast organic pecans to release their oils, then toss them into a rich amber caramel made with fresh Normandy butter and heavy cream. A light sprinkle of Maldon sea salt flakes cuts the sweetness beautifully.",
      images: ["/images/salted_pecan_tart.png"],
      dietary: [],
      ingredients: ["Pecans", "Maldon Sea Salt", "Heavy Cream", "Butter", "Wheat Flour", "Sugar", "Egg Yolks"],
      allergens: ["Wheat", "Dairy", "Eggs", "Tree Nuts (Pecans)"],
      shelfLifeDays: 5,
      isFeatured: false,
      reviews: []
    },

    // Pastries (6 items)
    {
      name: "Almond Laminated Croissant",
      slug: "almond-laminated-croissant",
      price: 7.50,
      categoryName: "Pastries",
      description: "Twice-baked butter croissant filled with premium almond frangipane, topped with flaked almonds and dusted with vanilla snow.",
      longDescription: "Our croissants undergo a rigorous 3-day lamination process using AOP Normandy butter to produce 81 distinct, wafer-thin layers. Twice-baked to lock in moisture, it is loaded with a rich almond cream and baked until golden and highly crisp.",
      images: ["/images/flaky_croissant.png"],
      dietary: [],
      ingredients: ["Wheat Flour", "AOP Butter", "Almond Meal", "Sugar", "Eggs", "Yeast", "Rum", "Sliced Almonds", "Salt"],
      allergens: ["Wheat", "Dairy", "Eggs", "Tree Nuts (Almonds)"],
      shelfLifeDays: 3,
      isFeatured: true,
      reviews: [
        { authorName: "Lancelot Du Lac", rating: 5, comment: "I have tried croissants in Paris, Tokyo, and New York. The lamination on KingsBakery's Almond Croissant competes with the absolute best in the world." }
      ]
    },
    {
      name: "Pistachio Praline Eclair",
      slug: "pistachio-praline-eclair",
      price: 8.50,
      categoryName: "Pastries",
      description: "Choux pastry filled with roasted pistachio pastry cream, topped with a white chocolate glaze and toasted Iranian pistachios.",
      longDescription: "Our choux pastry is piped to exact dimensions and baked to maintain a dry, hollow center. We fill it with a velvety pastry cream made from slowly roasted Sicilian pistachios and a layer of crunchy house-made pistachio praline.",
      images: ["/images/pistachio_eclair.png"],
      dietary: [],
      ingredients: ["Wheat Flour", "Butter", "Eggs", "Milk", "Sicilian Pistachio Paste", "Sugar", "White Chocolate", "Heavy Cream", "Salt"],
      allergens: ["Wheat", "Dairy", "Eggs", "Tree Nuts (Pistachios)"],
      shelfLifeDays: 1,
      isFeatured: false,
      reviews: []
    },
    {
      name: "Dark Chocolate Sourdough Pastry",
      slug: "dark-chocolate-sourdough-pastry",
      price: 9.00,
      categoryName: "Pastries",
      description: "Wild yeast sourdough pastry laminated with vegan butter and dark chocolate chunks, finished with organic maple glaze.",
      longDescription: "Using our 120-year-old sourdough starter, this pastry has a deep fermented complexity that balances the dark chocolate. We use plant-based butter and single-origin cocoa, creating a rich pastry suitable for vegans.",
      images: ["/images/flaky_croissant.png"],
      dietary: ["Vegan", "Nut-Free"],
      ingredients: ["Wheat Flour", "Sourdough Starter", "Vegan Butter", "Organic Sugar", "70% Dark Chocolate", "Maple Syrup", "Sea Salt"],
      allergens: ["Wheat"],
      shelfLifeDays: 2,
      isFeatured: false,
      reviews: []
    },
    {
      name: "Salted Caramel Mille-Feuille",
      slug: "salted-caramel-mille-feuille",
      price: 11.00,
      categoryName: "Pastries",
      description: "Three layers of caramelized puff pastry filled with sea-salted caramel cremeux and white chocolate whipped ganache.",
      longDescription: "The puff pastry is baked under heavy weights to caramelize the sugars and create wafer-thin, super-crispy sheets. We sandwich these sheets with a rich salted caramel cream made with premium Guérande sea salt.",
      images: ["/images/caramel_mille_feuille.png"],
      dietary: ["Nut-Free"],
      ingredients: ["Wheat Flour", "AOP Butter", "Sugar", "Milk", "Cream", "Guérande Sea Salt", "Gelatin", "Egg Yolks"],
      allergens: ["Wheat", "Dairy", "Eggs"],
      shelfLifeDays: 1,
      isFeatured: false,
      reviews: []
    },
    {
      name: "Classic Butter Croissant",
      slug: "classic-butter-croissant",
      price: 6.00,
      categoryName: "Pastries",
      description: "Classic AOP Normandy butter croissant, showcasing distinct honeycomb lamination structure and a deep golden crust.",
      longDescription: "This croissant represents the pure art of lamination. Prepared over three days, our chefs carefully laminate high-butterfat AOP butter with leavened dough. The result is a buttery, airy croissant that shatters delightfully upon first bite.",
      images: ["/images/flaky_croissant.png"],
      dietary: ["Nut-Free"],
      ingredients: ["Wheat Flour", "AOP Butter", "Sugar", "Yeast", "Milk", "Salt", "Egg Wash"],
      allergens: ["Wheat", "Dairy", "Eggs"],
      shelfLifeDays: 2,
      isFeatured: false,
      reviews: []
    },
    {
      name: "Matcha Sesame Choux",
      slug: "matcha-sesame-choux",
      price: 8.00,
      categoryName: "Pastries",
      description: "A crunchy sesame-craquelin choux filled with a velvety Uji Matcha whipped ganache and black sesame praline paste.",
      longDescription: "A modern East Asian flavor profile. The choux shell is topped with a black sesame craquelin crust before baking. Inside is a vibrant green ganache using premium Japanese ceremonial Uji Matcha, surrounding a liquid black sesame core.",
      images: ["/images/matcha_choux.png"],
      dietary: [],
      ingredients: ["Wheat Flour", "Butter", "Sugar", "Eggs", "Uji Matcha Powder", "Black Sesame Seeds", "Cream", "White Chocolate", "Salt"],
      allergens: ["Wheat", "Dairy", "Eggs", "Sesame"],
      shelfLifeDays: 1,
      isFeatured: false,
      reviews: []
    },

    // Macarons (4 items)
    {
      name: "Parisian Rose Macarons",
      slug: "parisian-rose-macarons",
      price: 18.00,
      categoryName: "Macarons",
      description: "Delicate almond meringue shells filled with a white chocolate ganache infused with organic Persian rosewater and lychee.",
      longDescription: "A box of six premium macarons. We stone-grind California almonds to a superfine flour, whipping it with egg whites to create a shell that is crisp on the outside and moist on the inside. The filling balances floral rose notes with the brightness of fresh lychee purée.",
      images: ["/images/pastel_macarons.png"],
      dietary: ["Gluten-Free"],
      ingredients: ["Almond Flour", "Powdered Sugar", "Egg Whites", "White Chocolate", "Persian Rosewater", "Lychee Purée", "Organic Beet Juice"],
      allergens: ["Tree Nuts (Almonds)", "Dairy", "Eggs"],
      shelfLifeDays: 5,
      isFeatured: true,
      reviews: [
        { authorName: "Guinevere Vance", rating: 5, comment: "Ordered a box of Macarons for a high-end corporate event. The rose and lychee notes were subtle, and the shells had the perfect chew. My guests were amazed." }
      ]
    },
    {
      name: "Sicilian Pistachio Macarons",
      slug: "sicilian-pistachio-macarons",
      price: 19.00,
      categoryName: "Macarons",
      description: "Stone-ground pistachio meringue shells filled with an intense, nutty Sicilian roasted pistachio paste white chocolate ganache.",
      longDescription: "Premium Italian green macarons filled with a rich, nutty ganache crafted from pure, slow-roasted Bronte pistachios. Each bite offers a fragrant nutty profile with the signature crispy-chewy meringue contrast.",
      images: ["/images/sicilian_pistachio_macarons.png"],
      dietary: ["Gluten-Free"],
      ingredients: ["Almond Flour", "Pistachio Paste", "Powdered Sugar", "Egg Whites", "White Chocolate", "Cream", "Salt"],
      allergens: ["Tree Nuts (Almonds, Pistachios)", "Dairy", "Eggs"],
      shelfLifeDays: 5,
      isFeatured: false,
      reviews: []
    },
    {
      name: "Belgian Chocolate Macarons",
      slug: "belgian-chocolate-macarons",
      price: 18.50,
      categoryName: "Macarons",
      description: "Chocolate meringue shells sandwiched with a rich, velvet-smooth 70% dark Belgian chocolate fudge ganache.",
      longDescription: "For the chocolate purist, these macarons feature a dense, deep cocoa shell loaded with a bitter-sweet ganache made from high-grade Belgian dark chocolate chips, whipped to a smooth fudge-like texture.",
      images: ["/images/belgian_chocolate_macarons.png"],
      dietary: ["Gluten-Free", "Nut-Free"],
      ingredients: ["Almond Flour", "Cacao Powder", "Powdered Sugar", "Egg Whites", "Dark Chocolate 70%", "Heavy Cream", "Butter"],
      allergens: ["Tree Nuts (Almonds)", "Dairy", "Eggs"],
      shelfLifeDays: 5,
      isFeatured: false,
      reviews: []
    },
    {
      name: "Tahitian Vanilla Macarons",
      slug: "tahitian-vanilla-macarons",
      price: 18.00,
      categoryName: "Macarons",
      description: "Delicate vanilla bean shells loaded with a premium white chocolate buttercream infused with organic Tahitian vanilla caviar.",
      longDescription: "Sweet, fragrant, and dotted with vanilla caviar specks. We source our vanilla pods directly from Tahiti to create a sweet buttercream filling that represents the pure essence of natural vanilla cream.",
      images: ["/images/tahitian_vanilla_macarons.png"],
      dietary: ["Gluten-Free"],
      ingredients: ["Almond Flour", "Tahitian Vanilla Bean", "Powdered Sugar", "Egg Whites", "White Chocolate", "Buttercream", "Sugar"],
      allergens: ["Tree Nuts (Almonds)", "Dairy", "Eggs"],
      shelfLifeDays: 5,
      isFeatured: false,
      reviews: []
    },
    {
      name: "Blueberry Violet Gateau",
      slug: "blueberry-violet-gateau",
      price: 15.50,
      categoryName: "Cakes",
      description: "Rich white sponge cake layered with sweet wild blueberries, organic violet-infused Chantilly, and crystallized petals.",
      longDescription: "An aromatic and visually stunning cake inspired by Parisian spring. Soft, moist vanilla sponge is layered with fresh wild blueberry compote and a cream delicately flavored with organic violet essence. Hand-decorated with natural candied violet petals.",
      images: ["/images/blueberry_violet_gateau.png"],
      dietary: ["Nut-Free"],
      ingredients: ["Wheat Flour", "Sugar", "Eggs", "Wild Blueberries", "Heavy Cream", "Violet Essence", "Butter", "Baking Powder"],
      allergens: ["Wheat", "Dairy", "Eggs"],
      shelfLifeDays: 3,
      isFeatured: false,
      reviews: []
    },
    {
      name: "Double Chocolate Truffle Cake",
      slug: "double-chocolate-truffle-cake",
      price: 14.50,
      categoryName: "Cakes",
      description: "Decadent dark chocolate cake layered with rich Belgian chocolate truffle ganache and cocoa nib dust.",
      longDescription: "Our chocolate gateau features alternating layers of flourless chocolate sponge and silk-textured Valrhona chocolate mousse. Coated in a glossy dark chocolate mirror glaze and dusted with roasted Ecuadorian cocoa nibs for a satisfying crunch.",
      images: ["/images/double_chocolate_truffle_cake.png"],
      dietary: ["Gluten-Free", "Nut-Free"],
      ingredients: ["Valrhona Chocolate 70%", "Butter", "Eggs", "Sugar", "Cocoa Powder", "Cream", "Cocoa Nibs", "Vanilla"],
      allergens: ["Dairy", "Eggs"],
      shelfLifeDays: 4,
      isFeatured: false,
      reviews: []
    },
    {
      name: "Wild Blackberry Frangipane Tart",
      slug: "wild-blackberry-frangipane-tart",
      price: 13.50,
      categoryName: "Tarts",
      description: "Sweet almond frangipane baked in a shortbread crust, topped with fresh blackberries and organic lavender glaze.",
      longDescription: "This tart combines a rich, nutty baked almond cream with the brightness of seasonal organic blackberries. Baked until golden brown, then glazed with a light, floral lavender-infused syrup.",
      images: ["/images/blackberry_frangipane_tart.png"],
      dietary: [],
      ingredients: ["Almond Meal", "Butter", "Sugar", "Eggs", "Fresh Blackberries", "Lavender Syrup", "Wheat Flour"],
      allergens: ["Wheat", "Dairy", "Eggs", "Tree Nuts (Almonds)"],
      shelfLifeDays: 3,
      isFeatured: false,
      reviews: []
    },
    {
      name: "Salted Caramel Macarons",
      slug: "salted-caramel-macarons",
      price: 19.50,
      categoryName: "Macarons",
      description: "Crisp shells filled with a smooth, salted caramel paste made with Guérande fleur de sel.",
      longDescription: "The perfect balance of sweet and salty. Our macarons are filled with a luscious, slow-cooked amber caramel infused with Guérande sea salt and AOP butter, providing a rich buttery chew.",
      images: ["/images/salted_caramel_macarons.png"],
      dietary: ["Gluten-Free"],
      ingredients: ["Almond Flour", "Powdered Sugar", "Egg Whites", "Guérande Sea Salt", "Sugar", "Butter", "Heavy Cream"],
      allergens: ["Tree Nuts (Almonds)", "Dairy", "Eggs"],
      shelfLifeDays: 5,
      isFeatured: false,
      reviews: []
    }
  ];

  for (const prod of productsToSeed) {
    const categoryId = categoriesMap[prod.categoryName];
    if (!categoryId) continue;

    // Map dietary tags to database connect objects
    const connectDietary = prod.dietary.map((lbl) => ({
      id: dietaryTagsMap[lbl],
    })).filter((item) => item.id !== undefined);

    const createdProduct = await prisma.product.create({
      data: {
        name: prod.name,
        slug: prod.slug,
        description: prod.description,
        price: prod.price,
        categoryId: categoryId,
        shortTag: prod.isFeatured ? "Best Seller" : "New",
        ingredients: prod.ingredients,
        allergens: prod.allergens,
        shelfLifeDays: prod.shelfLifeDays,
        isFeatured: prod.isFeatured,
        dietaryTags: {
          connect: connectDietary,
        },
      },
    });

    // Create image records for this product
    for (let i = 0; i < prod.images.length; i++) {
      await prisma.productImage.create({
        data: {
          productId: createdProduct.id,
          url: prod.images[i],
          altText: `${prod.name} - View ${i + 1}`,
          sortOrder: i,
        },
      });
    }

    // Create reviews if any
    for (const rev of prod.reviews) {
      await prisma.review.create({
        data: {
          productId: createdProduct.id,
          authorName: rev.authorName,
          rating: rev.rating,
          comment: rev.comment,
          isVerified: true,
        },
      });
    }
  }
  console.log("✅ Products and reviews seeded.");

  // 6. Seed Tasting Boxes
  console.log("🎁 Seeding Tasting Boxes...");
  const tastingBoxesList = [
    {
      name: "The Royal Box",
      slug: "the-royal-box",
      price: 54.00,
      description: "Our signature luxury box featuring a curation of 12 iconic pastries and macarons for the ultimate tasting experience.",
      itemCount: 12,
      heroImageUrl: "/images/assorted_tasting_box.png",
      contents: [
        { name: "Chocolate Gold Leaf Tart", thumbnailUrl: "/images/chocolate_tart.png", isSwappable: false },
        { name: "Parisian Rose Macarons", thumbnailUrl: "/images/pastel_macarons.png", isSwappable: false },
        { name: "Pistachio Praline Eclair", thumbnailUrl: "/images/pistachio_eclair.png", isSwappable: true },
        { name: "Classic Butter Croissant", thumbnailUrl: "/images/flaky_croissant.png", isSwappable: true },
      ],
    },
    {
      name: "The Connoisseur's Selection",
      slug: "the-connoisseurs-selection",
      price: 39.00,
      description: "An editorial collection of 8 highly technical, texture-heavy pastries showcasing our kitchen's experimental techniques.",
      itemCount: 8,
      heroImageUrl: "/images/assorted_tasting_box.png",
      contents: [
        { name: "Salted Caramel Mille-Feuille", thumbnailUrl: "/images/caramel_mille_feuille.png", isSwappable: false },
        { name: "Matcha Sesame Choux", thumbnailUrl: "/images/matcha_choux.png", isSwappable: false },
        { name: "Almond Laminated Croissant", thumbnailUrl: "/images/flaky_croissant.png", isSwappable: true },
        { name: "Hazelnut Praline Entremet", thumbnailUrl: "/images/hazelnut_entremet.png", isSwappable: false },
      ],
    },
    {
      name: "Date Night Duo",
      slug: "date-night-duo",
      price: 18.00,
      description: "A romantic, curated pairing of two individual desserts and two macarons, complete with a custom tasting guide.",
      itemCount: 4,
      heroImageUrl: "/images/assorted_tasting_box.png",
      contents: [
        { name: "Passion Fruit Pavlova", thumbnailUrl: "/images/berry_cheesecake.png", isSwappable: true },
        { name: "Chocolate Gold Leaf Tart", thumbnailUrl: "/images/chocolate_tart.png", isSwappable: false },
        { name: "Parisian Rose Macarons", thumbnailUrl: "/images/pastel_macarons.png", isSwappable: false },
      ],
    },
    {
      name: "Seasonal Fruit Box",
      slug: "seasonal-fruit-box",
      price: 45.00,
      description: "A bright, summer-themed box of 10 desserts focusing on fresh fruit curds, local berries, and bright citrus botanicals.",
      itemCount: 10,
      heroImageUrl: "/images/assorted_tasting_box.png",
      contents: [
        { name: "Raspberry Pistachio Tart", thumbnailUrl: "/images/chocolate_tart.png", isSwappable: true },
        { name: "Passion Fruit Pavlova", thumbnailUrl: "/images/berry_cheesecake.png", isSwappable: false },
        { name: "Parisian Rose Macarons", thumbnailUrl: "/images/pastel_macarons.png", isSwappable: false },
      ],
    },
  ];

  for (const box of tastingBoxesList) {
    const createdBox = await prisma.tastingBox.create({
      data: {
        name: box.name,
        slug: box.slug,
        price: box.price,
        description: box.description,
        itemCount: box.itemCount,
        heroImageUrl: box.heroImageUrl,
      },
    });

    for (const item of box.contents) {
      await prisma.tastingBoxItem.create({
        data: {
          boxId: createdBox.id,
          name: item.name,
          thumbnailUrl: item.thumbnailUrl,
          isSwappable: item.isSwappable,
        },
      });
    }
  }
  console.log("✅ Tasting boxes seeded.");

  // 7. Seed Blog Posts (6 items)
  console.log("📖 Seeding Blog Posts...");
  const blogPostsList = [
    {
      title: "The Physics of Lamination: Engineering 81 Butter Layers",
      slug: "physics-of-lamination",
      category: "Technique",
      excerpt: "Why AOP Normandy butter, temperature precision, and the number 81 are the structural secrets to the perfect flaky croissant.",
      bodyHtml: `
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
      authorName: "Chef Marcus King",
      authorAvatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200",
      readTimeMins: 6,
      isFeatured: true,
      heroImageUrl: "/images/blog_hero_6.png",
    },
    {
      title: "The Science of Tempering Chocolate: Crystals and Viscosity",
      slug: "science-of-tempering-chocolate",
      category: "Technique",
      excerpt: "Understanding Beta-V crystals. A molecular deep-dive into how temperature manipulation creates the shiny, snapping chocolate finish.",
      bodyHtml: `
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
      authorName: "Dr. Clara Dupont",
      authorAvatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200",
      readTimeMins: 5,
      isFeatured: false,
      heroImageUrl: "/images/blog_hero_2.png",
    },
    {
      title: "Maillard Reaction & Oven Spring in Yeast Fermentations",
      slug: "maillard-reaction-and-oven-spring",
      category: "Behind the Scenes",
      excerpt: "How complex sugars and heat combine to create caramelization profiles, and how steam control preserves volume in high-hydration baking.",
      bodyHtml: `
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
      authorName: "Chef Marcus King",
      authorAvatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200",
      readTimeMins: 8,
      isFeatured: false,
      heroImageUrl: "/images/blog_hero_3.png",
    },
    {
      title: "Acids, Pectin, and Gelation: Fruit Curds Demystified",
      slug: "acids-pectin-gelation-fruit-curds",
      category: "Ingredients",
      excerpt: "A look into the molecular gelation of fruit purées, understanding pH ranges, and balancing sugar to create clean, sharp fruit gels.",
      bodyHtml: `
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
      authorName: "Dr. Clara Dupont",
      authorAvatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200",
      readTimeMins: 6,
      isFeatured: false,
      heroImageUrl: "/images/blog_hero_4.png",
    },
    {
      title: "Surface Tension and Light Reflection in Mirror Glazes",
      slug: "surface-tension-mirror-glazes",
      category: "Behind the Scenes",
      excerpt: "The physics of flawless mirror finishes. Controlling bubble formation, gelatin bloom strengths, and emulsion temperatures.",
      bodyHtml: `
        <h2>The Optics of a Perfect Mirror Glaze</h2>
        <p>A mirror glaze (glaçage miroir) must reflect its surroundings like polished glass. This property relies on creating a perfectly homogeneous emulsion of fat, water, and sugars with no trapped air bubbles.</p>
        <p>The glaze is an emulsion of white chocolate, sweetened condensed milk, sugar, water, and gelatin. Gelatin provides the elastic structure that wraps around the dessert, while the fats in the white chocolate scatter light, providing depth and opacity.</p>
        <h2>Controlling the Variables</h2>
        <ul>
          <li><strong>Bloom Strength:</strong> We use exclusively 200-bloom gold gelatin sheets. This specific bloom strength yields a gel that is stable at room temperature but melts instantly in the mouth, avoiding a rubbery mouthfeel.</li>
          <li><strong>Emulsification Temp:</strong> We blend the glaze using a high-shear immersion blender at 40°C, keeping the blade completely submerged to avoid incorporating air.</li>
          <li><strong>Pouring Temperature:</strong> The glaze must be cooled to exactly 32°C before pouring. If it is poured too hot, it will melt the mousse beneath it and run off.</li>
        </ul>
      `,
      authorName: "Chef Marcus King",
      authorAvatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200",
      readTimeMins: 4,
      isFeatured: false,
      heroImageUrl: "/images/blog_hero_5.png",
    },
    {
      title: "Sourcing Organic Grains: Gluten Strength and Hydration",
      slug: "sourcing-organic-grains",
      category: "Ingredients",
      excerpt: "An investigation into stone-ground wheat varieties, protein content percentages, and how enzymatic activity affects long fermentation.",
      bodyHtml: `
        <h2>The Flour Sourcing Obsession</h2>
        <p>Flour is not just a powder; it is a complex biological engine. For our pastries and breads, we source heritage organic grain varieties from local mills. These wheats are stone-ground at low speeds, preserving the grain's germ and bran, which are rich in natural oils, vitamins, and wild yeasts.</p>
        <p>However, stone-ground heritage flours possess highly active enzymes and lower, more fragile gluten structures compared to industrial steel-roller white flour. Baking with them requires a deep understanding of protein quality and hydration limits.</p>
        <h2>Gluten Matrix Mechanics</h2>
        <p>When water is added to flour, two proteins—gliadin and glutenin—combine to form a gluten matrix. In our laminated doughs, we require a strong, elastic matrix that can hold the butter layers without tearing.</p>
      `,
      authorName: "Dr. Clara Dupont",
      authorAvatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200",
      readTimeMins: 7,
      isFeatured: false,
      heroImageUrl: "/images/blog_hero_1.png",
    },
  ];

  for (const post of blogPostsList) {
    await prisma.blogPost.create({ data: post });
  }
  console.log("✅ Blog posts seeded.");

  // 8. Seed Delivery Slots (60 days out, 3 dates fully booked)
  console.log("📆 Seeding Delivery Slots...");
  const today = new Date();
  
  // Choose 3 days to mark fully booked (e.g. 5, 12, and 24 days from now)
  const fullyBookedOffsets = [5, 12, 24];

  for (let i = 0; i < 60; i++) {
    const slotDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + i);
    const isFullyBooked = fullyBookedOffsets.includes(i);
    const bookedCount = isFullyBooked ? 20 : Math.floor(Math.random() * 12); // random bookings up to 12

    await prisma.deliverySlot.create({
      data: {
        date: slotDate,
        isFullyBooked: isFullyBooked,
        capacity: 20,
        bookedCount: bookedCount,
      },
    });
  }
  console.log("✅ Delivery slots seeded successfully.");

  console.log("🎉 Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
