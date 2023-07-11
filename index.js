import {gql, ApolloServer} from 'apollo-server';

const persons = [
   {
      name: "Name 1",
      phone: "53-34-12-12-33",
      street: "Street 1",
      city: "City 1",
      id: "1a345678-123d-123b-1a34-b2345678",
   },
   {
      name: "Name 2",
      phone: "55-34-12-12-33",
      street: "Street 2",
      city: "City 2",
      id: "2a345678-123d-123b-1a34-b2345678",
   },
   {
      name: "Name 3",
      phone: "54-34-12-12-33",
      street: "Street 3",
      city: "City 3",
      id: "3a345678-123d-123b-1a34-b2345678",
   },
];

const typeDefs = gql`
   type Address {
      street: String!
      city: String!
   }

   type Person {
      name: String!
      phone: String
      id: ID!
      address: Address!
   }

   type Query {
      personCount: Int!
      allPersons: [Person]!
      findPerson(name: String!): Person
   }
`;

const resolvers = {
   Query: {
      personCount: () => persons.length,
      allPersons: () => persons,
      findPerson: (root, args) => {
         const {name} = args
         return persons.find(person => person.name === name)
      }
   },
   Person: {
      address: (root) => {
         return {
            street: root.street,
            city: root.city,
         }
      },
   }
}

const server = new ApolloServer({
   typeDefs,
   resolvers,
})

server.listen().then(({url}) => {
   console.log(`Server ready at ${url}`)
});

