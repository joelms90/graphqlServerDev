import {gql, UserInputError, ApolloServer} from 'apollo-server';
import {v1 as uuid} from 'uuid'

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
   enum YesNo {
      YES,
      NO
   }
   
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
      allPersons(phone: YesNo): [Person]!
      findPerson(name: String!): Person
   }

   type Mutation {
      addPerson(
         name: String!
         phone: String
         street: String!
         city: String!
      ): Person
      editNumber(
         name: String!
         phone: String
      ): Person


   }
`;

const resolvers = {
   Query: {
      personCount: () => persons.length,
      allPersons: (root, args) => {
         if(!args.phone) return persons

         const byPhone = person => args.phone === 'YES' ? person.phone : !person.phone

         return persons.filter(byPhone)
      },
      findPerson: (root, args) => {
         const {name} = args
         return persons.find(person => person.name === name)
      }
   },
   Mutation: {
      addPerson: (root, args) => {
         if(persons.find(p => p.name === args.name)){
            throw new UserInputError('Name must be unique', {
               invalidArgs: args.name
            })
         }
         const person = {...args, id: uuid()}
         persons.push(person)
         return person
      },
      editNumber: (root, args) => {
         const personIndex = persons.findIndex(p => p.name === args.name)
         if(personIndex === -1) return null

         const person = persons[personIndex]

         const updatedPerson = {...person, phone: args.phone}
         person[personIndex] = updatedPerson

         return updatedPerson;
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

