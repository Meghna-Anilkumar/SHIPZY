import { MenuModel } from "../types/menu.model";

const DEFAULT_MENU = [
  {
    name: "Margherita Pizza",
    description: "Classic pizza with mozzarella, tomato, and fresh basil.",
    price: 299,
    image: "https://images.unsplash.com/photo-1604382355076-af4b0eb60143?q=80&w=800"
  },
  {
    name: "Cheese Burger",
    description: "Juicy grilled patty with cheddar, lettuce, and house sauce.",
    price: 199,
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=800"
  },
  {
    name: "Pasta Alfredo",
    description: "Creamy white sauce pasta with parmesan and herbs.",
    price: 249,
    image: "https://images.unsplash.com/photo-1645112411341-6c4fd023714a?q=80&w=800"
  },
  {
    name: "Veg Loaded Sandwich",
    description: "Toasted sandwich with fresh veggies and cheese.",
    price: 149,
    image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?q=80&w=800"
  },
  {
    name: "Paneer Tikka Wrap",
    description: "Smoky paneer tikka rolled with crunchy salad and mint mayo.",
    price: 219,
    image: "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?q=80&w=800"
  },
  {
    name: "Peri Peri Fries",
    description: "Crispy golden fries tossed in spicy peri peri seasoning.",
    price: 129,
    image: "https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?q=80&w=800"
  },
  {
    name: "Chocolate Lava Cake",
    description: "Warm chocolate cake with a rich molten center.",
    price: 179,
    image: "https://images.unsplash.com/photo-1617305855058-336d24456869?q=80&w=800"
  },
  {
    name: "Farm Fresh Salad Bowl",
    description: "Lettuce, cherry tomatoes, olives, corn, and zesty dressing.",
    price: 189,
    image: "https://images.unsplash.com/photo-1546793665-c74683f339c1?q=80&w=800"
  },
  {
    name: "Masala Lemon Soda",
    description: "Chilled sparkling lemon soda with chatpata masala twist.",
    price: 89,
    image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?q=80&w=800"
  }
];

export const seedMenuIfEmpty = async (): Promise<void> => {
  const existing = await MenuModel.find({}, { name: 1 }).lean();
  const existingNames = new Set(existing.map((item) => item.name.toLowerCase()));
  const missingItems = DEFAULT_MENU.filter((item) => !existingNames.has(item.name.toLowerCase()));

  if (missingItems.length > 0) {
    await MenuModel.insertMany(missingItems);
  }
};
