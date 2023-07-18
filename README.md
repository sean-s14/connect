# Connect Social Media Website

Connect is a simple social media website built using Next.js with TypeScript. It provides users with authentication options using "next-auth," allowing them to sign up using Twitter, GitHub, or Google.

## Features

### Unauthenticated Users

- **Viewing Posts**: Unauthenticated users can view all posts on the home page, click on individual posts to see more details, and visit user profiles.

- **Search**: Unauthenticated users can search for specific users using the search functionality.

### Authenticated Users

In addition to the features available to unauthenticated users, authenticated users have access to the following:

- **Create, Delete, and Reply to Posts**: Authenticated users can create new posts, delete their own posts, and reply to existing posts.

- **Like Posts**: Users can like posts to show their appreciation.

- **Follow Users**: Users can follow other users to receive updates on their posts.

- **Viewing Followed Users' Posts**: Users can view posts made only by the users they follow, providing a personalized feed.

- **Update Profile Information**: Users can update their name, username, email, and profile image to personalize their accounts.

- **Delete Account**: Users have the option to delete their account if desired.

## Technology Stack

The website utilizes the following technologies and tools:

- **Next.js with TypeScript**: Next.js is a popular React framework that simplifies server-side rendering and provides an efficient development environment. TypeScript adds static typing to JavaScript, enhancing productivity and code quality.

- **next-auth**: next-auth is used for authentication, enabling users to sign up and log in using their Twitter, GitHub, or Google accounts.

- **SWR**: SWR is used for data fetching, providing a simplified way to handle lists of data and manage real-time updates.

- **MongoDB with Mongoose**: MongoDB is used as the database, and Mongoose is a MongoDB object modeling tool that simplifies interaction with the database.

- **Supabase**: Supabase is used to store user-uploaded profile images, providing a reliable and scalable solution for storing and retrieving media files.

- **useState, useEffect, useRef, and useReducer**: These hooks from React are utilized for managing component state, side effects, and complex state logic, enhancing the website's interactivity and performance.

- **Pagination**: Pagination is implemented to efficiently retrieve and display large lists of posts and users, improving performance and user experience.

- **Custom Hook for Pagination**: A custom hook is created to handle pagination logic, promoting code reusability and maintainability.

- **GPT-4**: The terms of service and privacy policies are generated using GPT-4, an advanced language model, to ensure legal compliance and enhance user trust.

- **Next.js Cookies**: Next.js cookies are used to implement age verification, allowing only users over the age of 18 to use the app.

## Getting Started

To run the Connect social media website locally, follow these steps:

1. Clone the repository:

   ```
   git clone https://github.com/sean-s14/connect.git
   ```

2. Install dependencies:

   ```
   cd connect
   npm install
   ```

3. Set up environment variables:

   - Create a `.env.local` file in the project root directory.
   - Add the necessary environment variables, including database connection details, authentication providers, Supabase credentials, etc.

4. Start the development server:

   ```
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:3000` to access the Connect social media website.

## Contributing

Contributions are welcome! If you find any issues or want to enhance the website's features, feel free to submit a pull request.

## License

This project is licensed under the [MIT License](LICENSE).

---

This Connect social media website showcases the following skills utilized by the web developer:

- Building web applications using Next.js with TypeScript.
- Implementing authentication with next-auth and social media providers (Twitter, GitHub, Google).
- Fetching data using SWR and handling real-time updates.
- Utilizing MongoDB with Mongoose for data storage and interaction.
- Integrating Supabase for secure storage and retrieval of user-uploaded profile images.
- Leveraging React hooks (useState, useEffect, useRef, useReducer) for state management and complex logic.
- Implementing pagination to handle large datasets efficiently.
- Creating custom hooks for reusable logic.
- Generating terms of service and privacy policies using GPT-4.
- Implementing age verification with Next.js cookies.
- Following best practices for code organization and maintainability.
- Providing clear documentation for others to understand and contribute to the project.

By building Connect, the developer has demonstrated a strong understanding of web development technologies, frontend and backend integration, and best practices for creating a functional and user-friendly social media website.
