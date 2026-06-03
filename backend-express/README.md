# SAI TECH CNC Machining Website

Premium industrial website for SAI TECH Precision CNC Machining Company.

## Tech Stack

### Backend
- **Runtime**: Node.js with Express.js
- **Database**: MongoDB Atlas / MongoDB
- **ODM**: Mongoose
- **Authentication**: JWT
- **File Upload**: Multer (local storage in `/uploads`)
- **Email**: Nodemailer (Yahoo SMTP)

### Frontend
- **Framework**: React 19
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Components**: Shadcn/UI
- **Icons**: Lucide React

## Backend Structure

```text
backend-express/
|-- data/
|   `-- defaultData.js
|-- lib/
|   |-- database.js
|   |-- payloads.js
|   `-- serializers.js
|-- middleware/
|-- models/
|-- routes/
|-- uploads/
|-- .env
|-- .env.example
`-- server.js
```

## Environment Variables

Use `backend-express/.env`:

```env
PORT=8001
NODE_ENV=development
JWT_SECRET=change_this_to_a_long_random_secret
CORS_ORIGINS=http://127.0.0.1:3000,http://localhost:3000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/?appName=Cluster0
MONGODB_DB_NAME=saitech
EMAIL_USER=
EMAIL_PASS=
```

If your MongoDB connection string does not include a database name, keep `MONGODB_DB_NAME` set so Mongoose connects to the correct database.

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | /api/health | No | Health check |
| POST | /api/auth/login | No | Admin login |
| GET | /api/auth/verify | Yes | Verify token |
| PUT | /api/auth/change-password | Yes | Change admin password |
| GET | /api/home | No | Get home content |
| PUT | /api/home | Yes | Update home content |
| GET | /api/products | No | List products |
| GET | /api/products/:id | No | Get single product |
| POST | /api/products | Yes | Create product |
| PUT | /api/products/:id | Yes | Update product |
| DELETE | /api/products/:id | Yes | Delete product |
| POST | /api/products/:id/images | Yes | Add product image |
| DELETE | /api/products/images/:imageId | Yes | Delete product image |
| GET | /api/services | No | List services |
| GET | /api/services/:id | No | Get single service |
| POST | /api/services | Yes | Create service |
| PUT | /api/services/:id | Yes | Update service |
| DELETE | /api/services/:id | Yes | Delete service |
| GET | /api/machines | No | List machines |
| GET | /api/machines/:id | No | Get single machine |
| POST | /api/machines | Yes | Create machine |
| PUT | /api/machines/:id | Yes | Update machine |
| DELETE | /api/machines/:id | Yes | Delete machine |
| GET | /api/contact | Yes | List messages |
| POST | /api/contact | No | Submit contact form |
| PUT | /api/contact/:id/read | Yes | Mark message as read |
| DELETE | /api/contact/:id | Yes | Delete message |
| GET | /api/client-logos | No | List client logos |
| POST | /api/client-logos | Yes | Create client logo |
| DELETE | /api/client-logos/:id | Yes | Delete client logo |
| POST | /api/upload/:type | Yes | Upload single image |
| POST | /api/upload/:type/multiple | Yes | Upload multiple images |
| POST | /api/seed | No | Seed demo content |

## Admin Credentials

- **Email**: `admin@saitech.com`
- **Password**: `Admin@123`

## Local Development

### Backend

```bash
cd backend-express
npm install
node server.js
```

Optional while developing:

```bash
npm run dev
```

Seed the database after the server starts:

```bash
curl -X POST http://127.0.0.1:8001/api/seed
```

### Frontend

```bash
cd frontend
yarn install
yarn start
```

## Deployment Notes

### Backend

1. Create a MongoDB Atlas database or use an existing MongoDB deployment.
2. Deploy the `backend-express` folder as your web service.
3. Set these environment variables:
   - `MONGODB_URI`
   - `MONGODB_DB_NAME`
   - `JWT_SECRET`
   - `EMAIL_USER`
   - `EMAIL_PASS`
   - `NODE_ENV=production`
   - `CORS_ORIGINS=<your frontend url>`

### Frontend

Set:

- `REACT_APP_BACKEND_URL=<your backend url>`

## Features

- Responsive industrial website with admin panel
- MongoDB-backed CRUD APIs
- JWT authentication
- Multer image uploads
- Contact form with optional PDF attachment
- Seed endpoint for demo content
