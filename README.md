# Snap Noti REST APIs

This project was generated using [Express JS](https://github.com/expressjs/express) version 5.2.1 and [Nodemailer](https://github.com/nodemailer/nodemailer) version 8.0.6.

## Installation & Setup

Install dependencies:

```bash
npm install
```

## Environment Variables

The application uses environment variables for configuration. Create a .env file in the project root with the following values:

```env
NODE_ENV=production

PJ_NAME=SnapNoti
VERSION=1.0.0

PORT=8000
SECRET_KEY=$n@pN0t1!
```

## Development server

To start a local development server, run:

```bash
npm start
```

Once the server is running, it will be accessible at: `http://localhost:8000/`. You can use this base URL to test and invoke the available RESTful API endpoints.
