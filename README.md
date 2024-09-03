# ShortMe

ShortMe is a URL shortener project built with [Next.js](https://nextjs.org/), MySQL, and TypeScript.

[![wakatime](https://wakatime.com/badge/user/8300a2f0-77bf-425e-bf9d-5ceed008c503/project/41c0349b-0963-419b-a6c5-fd1ca710984f.svg)](https://wakatime.com/badge/user/8300a2f0-77bf-425e-bf9d-5ceed008c503/project/41c0349b-0963-419b-a6c5-fd1ca710984f)

## Getting Started

To get started with the project locally, follow these steps:

1. **Clone the repository:**

    ```bash
    git clone https://github.com/kibaofficial/shortme.git
    ```

2. **Install dependencies:**

    ```bash
    cd shortme
    npm install
    # or
    yarn install
    # or
    pnpm install
    # or
    bun install
    ```

3. **Set up the database:**

    - Ensure that you have MySQL (or MariaDB) installed.
    - Import the database schema by running the `GenerateDB.sql` file located in the `src/utils` directory into your database.
    - Create a `.env` file in the root directory of the project with the following content:

    ```env
    # Hosting configuration
    NEXT_PUBLIC_HOSTNAME=http://localhost:3000

    # Debugging
    DEBUG=false

    # Database configuration
    DB_HOST="localhost"
    DB_USER="shortme"
    DB_PASS="shortme"
    DB_NAME="shortme"
    ```

4. **Start the development server:**

    ```bash
    npm run dev
    # or
    yarn dev
    # or
    pnpm dev
    # or
    bun dev
    ```

5. **View the project in your browser:**

    Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Usage

Once you've reached the home page, you can use the navbar to navigate to the authentication page where you can register a new user.
This will create a new user entry in the database (see [API.ts](src/api/api.ts) & [register route](src/api/routes/register.ts)).

After registering, simply log in, and you'll be redirected to the Dashboard page. Here, you can create a new shortened link.

The code and the original URL will then be saved in the database.

You can use your shortened URL like this:
  
```http://localhost:3000/ShortCodeHere```

## Next.js

To learn more about Next.js, check out the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - Learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - An interactive Next.js tutorial.
- [Next.js GitHub Repository](https://github.com/vercel/next.js/) - Your feedback and contributions are welcome!

## TypeScript

To learn more about TypeScript, check out the following resources:

- [TypeScript Documentation](https://www.typescriptlang.org/docs/) - Learn about TypeScript features and API.
- [Learn TypeScript](https://www.learn-ts.org/) - An interactive TypeScript tutorial.
- [TypeScript GitHub Repository](https://github.com/microsoft/TypeScript/) - Your feedback and contributions are welcome!

## License

This project is licensed under the [MIT License](LICENSE).
