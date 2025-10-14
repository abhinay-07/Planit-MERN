# Plan It - Your Local Guide

A comprehensive MERN stack web application designed as a trusted local guide for students and residents around VIT-AP University. The app helps users discover places, check verified reviews, plan trips with cost estimation, rent vehicles securely, and stay updated on trending spots and real-time offers.

## 🌟 Features (Per SRS Requirements)

### Core Features
- **Dual Login System**: VIT-AP student verification via VIT email + General public login
- **Verified Reviews & Ratings**: Student reviews marked with verification badges
- **Trip Planning with Google Maps**: Cost & distance estimation, route optimization
- **Peer-to-Peer Vehicle Rentals**: Secure vehicle sharing with owner verification
- **Weekly Trending Spots**: Algorithm-based "Top Picks of the Week"
- **Real-Time Offers**: Business posting system for live deals and discounts
- **Admin Dashboard**: Comprehensive moderation and management system

### User Roles (SRS Compliant)
1. **Students**: Verified via VIT credentials, special review privileges
2. **General Public**: Standard registration and access
3. **Local Businesses**: Can post offers and manage listings
4. **Admin**: Full system moderation and verification control

## 🚀 Tech Stack (SRS Specification)

### Frontend
- **React.js** with hooks and functional components
- **Tailwind CSS** for responsive, utility-first styling
- **React Router** for navigation
- **TanStack Query** for state management
- **Axios** for API calls
- **React Hook Form** for form handling

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** (JSON Web Token) for authentication
- **Bcrypt** for password hashing
- **Google Maps API** for trip planning and routes
- **Email/SMS API** for notifications

### External Integrations
- **Google Maps API**: Route calculation, cost estimation
- **Email API**: VIT verification, notifications
- **SMS API**: Mobile notifications (future scope)
- **Payment Gateway**: Rental payments (future scope)

### Hosting & Deployment
- **Frontend**: Vercel/Netlify
- **Backend**: Render/Heroku
- **Database**: MongoDB Atlas

## 📁 Project Structure

```
PlanIT-MERN/
├── server/                 # Backend Node.js application
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   ├── middleware/        # Custom middleware
│   ├── server.js          # Entry point
│   ├── .env              # Environment variables
│   └── package.json      # Backend dependencies
├── client/                # React frontend application
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── context/       # React context
│   │   └── App.js         # Main App component
│   └── package.json       # Frontend dependencies
├── package.json           # Root package.json
└── README.md             # Project documentation
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)
- Git

### 1. Clone the Repository
```bash
git clone <repository-url>
cd PlanIT-MERN
```

### 2. Install Dependencies
```bash
# Install root dependencies
npm install

# Install backend dependencies
npm run install-server

# Install frontend dependencies
npm run install-client
```

### 3. Environment Setup
Create a `.env` file in the `server` directory:

```env
MONGODB_URI=mongodb://localhost:27017/planit
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d
NODE_ENV=development
PORT=5000

# Cloudinary Configuration (Optional)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email Configuration (Optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

### 4. Database Setup
- Start MongoDB locally or use MongoDB Atlas
- The application will automatically create the database and collections

### 5. Run the Application

#### Development Mode (Both frontend and backend)
```bash
npm run dev
```

#### Run Backend Only
```bash
npm run server
```

#### Run Frontend Only
```bash
npm run client
```

#### Production Build
```bash
npm run build
npm start
```

## 🔧 Available Scripts

- `npm run dev` - Run both client and server in development mode
- `npm run server` - Run backend server only
- `npm run client` - Run React development server only
- `npm run build` - Build React app for production
- `npm run install-all` - Install all dependencies
- `npm start` - Start production server

## 📱 Application Flow

### For Students
1. **Registration**: Provide VIT-AP ID, year, and branch for verification
2. **Verification**: Account pending approval for student-specific features
3. **Browse Places**: View all places with option to filter by student reviews
4. **Write Reviews**: Add authentic reviews with student verification badge
5. **Vehicle Rentals**: Access peer-to-peer rental network
6. **Top Picks**: See trending places among VIT-AP students

### For General Public
1. **Registration**: Standard registration without student verification
2. **Browse Places**: View all places and public reviews
3. **Write Reviews**: Add reviews marked as public user
4. **Vehicle Rentals**: Access verified vehicle rental options
5. **Local Offers**: Browse current deals and discounts

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Places
- `GET /api/places` - Get all places with filters
- `GET /api/places/:id` - Get single place
- `POST /api/places` - Add new place (authenticated)
- `GET /api/places/trending/weekly` - Get weekly trending places

### Reviews
- `GET /api/reviews/place/:placeId` - Get place reviews
- `POST /api/reviews` - Add review (authenticated)

### Vehicles
- `GET /api/vehicles` - Get available vehicles
- `POST /api/vehicles` - Add vehicle (authenticated)
- `GET /api/vehicles/my-vehicles` - Get user's vehicles (authenticated)

### Users
- `GET /api/users/profile` - Get user profile (authenticated)
- `PUT /api/users/profile` - Update profile (authenticated)

### Offers
- `GET /api/offers` - Get current offers

## 🚧 Development Status

### ✅ Completed Features
- User authentication system (dual login)
- Places management with categories
- Review system with user type filtering
- Vehicle rental listings
- Responsive Material-UI design
- JWT-based authentication
- MongoDB integration

### 🔄 In Progress
- Trip planning with cost estimation
- Real-time offers system
- Image upload functionality
- Advanced search and filtering
- Geolocation services

### 📋 Upcoming Features
- Push notifications
- Trip sharing
- Advanced analytics
- Mobile app (React Native)
- Payment integration
- Chat system for vehicle rentals

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Development Team**: Plan It Team
- **Target Audience**: VIT-AP University students and local community

## 📞 Support

For support, email support@planit.com or join our Slack channel.

## 🔗 Links

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **MongoDB**: Default connection on port 27017

---

*Plan It - Making local exploration easier and more trustworthy for the VIT-AP community.*