import  {graphqlHTTP} from "express-graphql";
import {assertInputType} from "graphql";
import {buildSchema} from "graphql";
import express from "express";

// Construct a schema, using GraphQL schema language
let restaurants = [
  {
    id: 1,
    name: "In n Out",
    description:
      "American fast food",
    dishes: [
      {
        name: "Chocolate shake",
        price: 4,
      },
      {
        name: "Vanilla Shake",
        price: 4,
      },
    ],
  },
  {
    id: 2,
    name: "Coffee Roasters",
    description:
      "Coffee house with pastries",
    dishes: [
      {
        name: "Latte",
        price: 6,
      },
      {
        name: "Croissant",
        price: 4,
      },
      {
        name: "Drip coffee",
        price: 2,
      },
    ],
  },
  {
    id: 3,
    name: "Kazunori",
    description:
      "Hand roll sushi bar",
    dishes: [
      {
        name: "Tuna roll",
        price: 5,
      },
      {
        name: "Crab roll ",
        price: 5,
      },
      {
        name: "Salmon roll",
        price: 4,
      },
    ],
  },
];
const schema = buildSchema(`
type Query{
  restaurant(id: Int): restaurant
  restaurants: [restaurant]
},
type restaurant {
  id: Int
  name: String
  description: String
  dishes:[Dish]
}
type Dish{
  name: String
  price: Int
}
input restaurantInput{
  name: String
  description: String
}
type DeleteResponse{
  ok: Boolean!
}
type Mutation{
  setrestaurant(name: String, description: String, id: Int): restaurant
  deleterestaurant(id: Int!): DeleteResponse
  editrestaurant(id: Int!, name: String!): restaurant
}
`);
// The root provides a resolver function for each API endpoint

const root = {
  restaurant: (arg) => restaurants[arg.id],
  restaurants: () => restaurants,
  setrestaurant: ({ input }) => {
    restaurants.push({ name: input.name, description: input.description });
    return input;
  },
  deleterestaurant: ({ id }) => {
    const ok = Boolean(restaurants[id]);
    let delc = restaurants[id];
    restaurants = restaurants.filter((item) => item.id !== id);
    console.log(JSON.stringify(delc));
    return { ok };
  },
  editrestaurant: ({ id, ...restaurant }) => {
    if (!restaurants[id]) {
      throw new Error("This restaurant doesn't exist. Try different ID");
    }
    restaurants[id] = {
      ...restaurants[id],
      ...restaurant,
    };
    return restaurants[id];
  },
};
const app = express();
app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
  })
);
const port = 5501;
app.listen(5501, () => console.log("Running Graphql on Port: " + port + "/graphql"));

export default root;