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

6. **Access the data management platform offered by Prisma**:
   ```
   bun prisma studio
   ```
   The plaform will be available on `http://localhost:5555`

## Documentations

- [Next Js](https://nextjs.org/docs)
- [Prisma ORM 🚀](https://www.prisma.io/docs)
- [Mongo DB](https://www.mongodb.com/docs/atlas)
