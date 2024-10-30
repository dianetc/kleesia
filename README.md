## Tech Stack

- **Frontend**: Next.js
- **Backend**: Next.js API routes
- **ORM**: Prisma ORM
- **Database**: Postgres 16
- **Bundler**: Bun

## Features

- **User Memberships**: Register and manage user profiles.
- **Creating Topics**: Create and manage discussion topics.
- **Post Papers**: Create post about interesting papers.
- **Commenting**: Engage in discussions through comments.
- **Upvoting**: Upvote posts and comments.
- **Sharing**: Share interesting papers with peers.
- **Sorting & Filtering**: Sort and filter topics for better navigation.

## Get Started

#### Prerequisites

- Bun
- Node.js
- Postgres 16

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
   Create a `.env` file in the root of the project and add your Postgres SQL connection string and other necessary environment variables:

   ```plaintext
   DATABASE_URL="postgresql://[HOST]:[PASSWORD]@[HOST]:[PORT]/[DATABASE]?schema=public"
   ```
   **Note**: You will need to generate a private key (PRIVATE_KEY) to add to your `.env` file. 

4. **Setup Prisma Client**:

   ```bash
   bun prisma generate
   ```

5. **Sync Database Migrations**:

   ```bash
   bun prisma migrate dev
   ```

6. **Start the Development Server**:

   ```bash
   bun dev
   ```

   The project will be available at `http://localhost:3000`.

7. **Access the Data Management Platform offered by Prisma**:
   ```
   bun prisma studio
   ```
   The plaform will be available on `http://localhost:5555`

### Tips and Tricks
0. **Use a browser you dont normally use**:
   At a certain point you may have to clear your cache. It'll be better not to have to do this
   using your day-to-day browser because then you'll be logged out of everything. 

2. **To reset the database**:

   ```bash
   bun prisma migrate reset
   ```
   
3. **To add a dependency**:

   ```bash
   bun add <library>
   ```
4. **To check the status of your migration**

   ```bash
   bun prisma migrate status
   ```
**Note**: On occasion if things are becoming messy, you may have to `rm -rf src/prisma/migrations/` then run a reset. 

## Documentations

- [Next Js](https://nextjs.org/docs)
- [Prisma ORM 🚀](https://www.prisma.io/docs)
- [Postgres SQL](https://www.postgresql.org/docs/current/tutorial-install.html)
