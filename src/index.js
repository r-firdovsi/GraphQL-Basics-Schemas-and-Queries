import { GraphQLServer } from "graphql-yoga";

// Scalar types (Single value) - String, Boolean, Int, Float, ID

//Demo user data
const users = [{
   id: '1',
    name: 'Firdovsi',
    email: 'r-firdovsi@hotmail.com',
    age: 21
}, {
    id: '2',
    name: 'Tamerlan',
    email: 'tamerlan@mail.ru',
    age: 27
}];

//Demo posts data
const posts = [{
    id: '21',
    title: 'History of Lenovo',
    body: 'Lenovo the best and very big company',
    published: 2016,
    author: '1'
}, {
    id: '20',
    title: 'History of Laravel',
    body: 'Laravel Best PHP Framework',
    published: 2019,
    author: '2'
}, {
    id: '19',
    title: 'GraphQL The Best',
    body: 'GraphQL very fast and useful way work with data',
    published: 2019,
    author: '1'
}];

const comments = [
    {
        id: '25',
        text: 'The best course',
        author: '2',
        post: '21'
    },
    {
        id: '65',
        text: 'Yes okey you true',
        author: '1',
        post: '20'
    },
    {
        id: '12',
        text: 'First Comments',
        author: '2',
        post: '19'
    }
];

// Type definations (schema)
const typeDefs = `
    type Query {
        users(query: String): [User!]!
        me: User!
        posts(query: String): [Post!]!
        comments: [Comment!]!
    }
    
    type User {
        id: ID!
        name: String!
        email: String!
        age: Int
        posts: [Post!]!
        comments: [Comment!]
    }
    
    type Post {
        id: ID!
        title: String!
        body: String!
        published: Int!
        author: User!
        comments: [Comment!]
    }
    
    type Comment {
        id: ID!
        text: String!
        author: User!
        post: Post!
    }    
`;

// Resolvers
const resolvers = {
  Query: {
      users(parent, args, ctx, info) {
        if (!args.query) {
            return users
        }

        return users.filter((user) => {
            return user.name.toLowerCase().includes(args.query.toLowerCase())
        })
      },
    me() {
        return {
            id: 'OX255',
            name: 'Firdovsi',
            email: 'r-firdovsi@hotmail.com',
            age: 21
        }
    },
      posts(parent, args, ctx, info) {
          if(!args.query) {
              return posts
          }

          return posts.filter((post) => {
              const isTitleMatch =   post.title.toLowerCase().includes(args.query.toLowerCase());
              const isBodyMatch = post.body.toLowerCase().includes(args.query.toLowerCase());
              return isTitleMatch || isBodyMatch
          });
      },
      comments(parent, args, ctx, info) {
          return comments;
      }
  },
    Post: {
      author(parent, args, ctx, info) {
        return users.find((user) => {
            return user.id === parent.author
        })
      },
        comments (parent, args, ctx, info) {
          return comments.filter((comment) => {
              return comment.post === parent.id
          })
        }
    },
    User: {
      posts(parent, args, ctx, info) {
        return posts.filter((post) => {
            return post.author === parent.id
        })
      },
        comments (parent, args, ctx, info) {
          return comments.filter((comment) => {
              return comment.author === parent.id
          })
        }
    },
    Comment: {
      author(parent, args, ctx, info) {
          return users.find((user) => {
              return user.id === parent.author
          })
      },
        post(parent, args, ctx, info) {
          return posts.find((post) => {
              return post.id === parent.post
          })
        }
    }
};

const server = new GraphQLServer({
    typeDefs,
    resolvers
});

server.start(() => {
   console.log('The server is  up');
});