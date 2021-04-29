const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const dayjs = require('dayjs')

let cities = ["stockholm", "örebro"]
 
let sampleList = [
  {
    city: "stockholm",
    time: dayjs("2021-04-21T17:07:59Z").valueOf(),
    temperature: 13.2,
    humidity: 38.1,
    wind: 4.4,
    precipitation: 1.2
  },
  {
    city: "stockholm",
    time: dayjs("2021-04-21T17:07:59Z").valueOf(),
    temperature: 11.0,
    humidity: 32.0,
    wind: 1.1,
    precipitation: 1.2
  },
  {
    city: "stockholm",
    time: dayjs("2021-04-21T17:07:59Z").valueOf(),
    temperature: 10.2,
    humidity: 34.4,
    wind: 2.1,
    precipitation: 2.2
  },
  {
    city: "örebro",
    time: dayjs("2021-04-21T17:07:59Z").valueOf(),
    temperature: 13.2,
    humidity: 38.1,
    wind: 4.4,
    precipitation: 1.2
  },
  {
    city: "örebro",
    time: dayjs("2021-04-21T17:07:59Z").valueOf(),
    temperature: 11.0,
    humidity: 32.0,
    wind: 1.1,
    precipitation: 1.2
  },
  {
    city: "örebro",
    time: dayjs("2021-04-21T17:07:59Z").valueOf(),
    temperature: 10.2,
    humidity: 34.4,
    wind: 2.1,
    precipitation: 2.2
  }
];

// Construct a schema, using GraphQL schema language
var schema = buildSchema(`
  type Query {
    cities: [String!]
    search(city: String!, dateStart: String!, dateEnd: String!): [Sample!]
  }

  type Sample {
    city: String!
    time: String!
    temperature: Float!
    humidity: Float!
    wind: Float!
    precipitation: Float!
  }
`);
 
// The root provides a resolver function for each API endpoint
var root = {};

root.cities = () => {
  return cities;
};

root.search = (args) => {
  const { city, dateStart, dateEnd } = args;
  let s = dayjs(dateStart);
  let e = dayjs(dateEnd);

  console.log(city, s.toISOString(), e.toISOString());
  console.log(sampleList);
  console.log(s.valueOf(), e.valueOf());

  return sampleList
    .filter(i => i.city == city
      && s.valueOf() <= i.time && i.time <= e.valueOf());
};
 
var app = express();
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));
app.listen(4000);
console.log('Running a GraphQL API server at http://localhost:4000/graphql');

/*
{
  cities,
  search(city:"stockholm", date:"2021-04-21" ){
    city
    time
    temperature
    humidity
    wind
    precipitation
  }
}
*/
