
![wallpaper](https://plus.unsplash.com/premium_photo-1683887034146-c79058dbdcb1?q=80&w=3269&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)




# Kleesia - University Science Forum

Welcome to Kleesia! Kleesia is a dynamic and engaging university science forum designed to foster discussions on various scientific topics. This project leverages modern web development technologies to provide a seamless experience for users to post topics, comment, upvote, share, and sort & filter discussions. The project also supports user memberships to create a personalized experience.

## Tech Stack

- **Frontend**: Next.js
- **Backend**: Next.js API routes
- **ORM**: Prisma ORM
- **Database**: MongoDB Atlas
- **Bundler**: Bun

## Features

- **User Memberships**: Register and manage user profiles.
- **Posting Topics**: Create and manage discussion topics.
- **Commenting**: Engage in discussions through comments.
- **Upvoting**: Upvote topics and comments to highlight popular content.
- **Sharing**: Share interesting topics with peers.
- **Sorting & Filtering**: Sort and filter topics for better navigation.


## Get Started


#### Prerequisites

- Bun
- Node.js
- MongoDB Atlas account

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/kleesia.git
   cd kleesia
   ```

2. **Install dependencies**:
   ```bash
   bun install
   ```

3. **Set up environment variables**:
   Create a `.env` file in the root of the project and add your MongoDB Atlas connection string and other necessary environment variables:
   ```plaintext
   DATABASE_URL="your_mongodb_atlas_connection_string"
   ```

4. **Run database migrations**:
   ```bash
   bun prisma migrate dev
   ```

5. **Start the development server**:
   ```bash
   bun dev
   ```

   The project will be available at `http://localhost:3000`.

6. **To access the data management platform offered by Prisma

```
bun prisma studio
```
The plaform will be available on `http://localhost:5555`


## Acknowledgements

 - [Next Js](https://nextjs.org/docs)
 - [Prisma ORM  🚀](https://www.prisma.io/docs)
 - [Mongo DB](https://www.mongodb.com/docs/atlas)
 

