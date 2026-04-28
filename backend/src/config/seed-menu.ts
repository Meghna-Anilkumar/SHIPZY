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
  }
];

export const seedMenuIfEmpty = async (): Promise<void> => {
  const count = await MenuModel.countDocuments();
  if (count === 0) {
    await MenuModel.insertMany(DEFAULT_MENU);
  }
};
