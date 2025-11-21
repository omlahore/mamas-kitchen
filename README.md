# Mama's Kitchen 🍽️

A modern, performant web application for displaying and managing a restaurant menu. Built with vanilla JavaScript, Vite, Tailwind CSS, and Firebase.

## ✨ Features

### Public Menu
- **Beautiful Menu Display**: Responsive grid layout showcasing dishes with images
- **Category Navigation**: Filter dishes by category and subcategory
- **Hero Carousel**: Eye-catching image carousel on the homepage
- **Image Lightbox**: Click on dish images to view them in full size
- **Smooth Animations**: GSAP-powered animations for enhanced user experience

### Admin Panel
- **Authentication**: Secure login with Firebase Authentication
- **Dish Management**: Add, edit, and delete menu items
- **Category Management**: Create and organize categories with subcategories
- **Image Upload**: Upload dish images (stored as base64 in Firestore)
- **Chai Options**: Add optional chai pricing to dishes
- **Real-time Updates**: Changes reflect immediately across all users

### Performance Optimizations
- **Code Splitting**: Lazy loading of components for faster initial load
- **Image Optimization**: Lazy loading and proper image attributes
- **Service Worker**: Offline support and caching for production
- **CDN Ready**: Optimized for CDN delivery with proper cache headers
- **PWA Support**: Installable as a Progressive Web App

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher recommended)
- npm or yarn
- Firebase project with:
  - Authentication enabled
  - Firestore database
  - Storage (optional, currently using base64 images)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd mamas-kitchen
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Firebase**
   - The Firebase configuration is already set in `src/firebaseConfig.js`
   - Ensure your Firebase project has:
     - Authentication enabled (Email/Password)
     - Firestore database created
     - Storage bucket configured (if needed)

4. **Set up Firestore Collections**
   - Create a `categories` collection with documents containing:
     - `name` (string)
     - `subcategories` (array of strings)
     - `order` (number) - for sorting
   - Create a `menuItems` collection with documents containing:
     - `name` (string)
     - `desc` (string)
     - `price` (number)
     - `category` (string)
     - `subcategory` (string, optional)
     - `imageUrl` (string)
     - `withChai` (boolean, optional)
     - `chaiPrice` (number, optional)
     - `createdAt` (number) - timestamp

## 📜 Available Scripts

### Development

```bash
# Start development server
npm run dev
```

The app will be available at:
- **Main Menu**: `http://localhost:5173/`
- **Admin Panel**: `http://localhost:5173/admin`

### Production

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

The production build will be in the `dist` folder, optimized and ready for deployment.

## 🏗️ Project Structure

```
mamas-kitchen/
├── public/                 # Static assets
│   ├── hero1.jpg          # Hero images
│   ├── hero2.jpg
│   ├── hero3.jpg
│   ├── logo.png           # Logo
│   ├── sw.js              # Service worker
│   └── manifest.json      # PWA manifest
├── src/
│   ├── components/        # React-like components
│   │   ├── AdminPanel.js  # Admin dashboard
│   │   ├── CategoryNav.js # Category navigation
│   │   ├── HeroCarousel.js # Hero image carousel
│   │   ├── LoginForm.js   # Authentication form
│   │   └── MenuGrid.js    # Menu display
│   ├── services/
│   │   └── imageService.js # Image handling utilities
│   ├── firebaseConfig.js  # Firebase configuration
│   ├── input.css          # Tailwind CSS input
│   └── main.js            # Application entry point
├── index.html             # HTML template
├── package.json           # Dependencies
├── tailwind.config.js     # Tailwind configuration
├── vite.config.js         # Vite configuration
└── vercel.json            # Vercel deployment config
```

## 🛠️ Technologies Used

- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Firebase** - Backend services (Auth, Firestore, Storage)
- **GSAP** - Animation library
- **Vanilla JavaScript** - No framework dependencies

## 🔐 Authentication

### Creating Admin Users

1. Go to Firebase Console → Authentication
2. Enable Email/Password authentication
3. Add a user manually or use the sign-up flow
4. Use those credentials to log in at `/admin`

## 📱 Deployment

### Vercel (Recommended)

1. Push your code to GitHub/GitLab
2. Import the project in Vercel
3. Vercel will automatically detect Vite and configure build settings
4. Deploy!

The `vercel.json` file is already configured with:
- Route rewrites for SPA routing
- Cache headers for optimal performance
- Service worker configuration

### Other Platforms

The app can be deployed to any static hosting service:
- Netlify
- GitHub Pages
- AWS S3 + CloudFront
- Any static file server

Just run `npm run build` and deploy the `dist` folder.

## 🎨 Customization

### Colors

Edit `tailwind.config.js` to customize the brand colors:

```js
theme: {
  extend: {
    colors: {
      brand: {
        50: '#...',
        100: '#...',
        // ... your color palette
      }
    }
  }
}
```

### Fonts

The app uses:
- **Rubik** (Google Fonts) - Main font
- **Questa Grande Black** - Custom font (in `/fonts` folder)

To change fonts, update:
- `src/input.css` - Font imports
- `tailwind.config.js` - Font family configuration

## 🐛 Troubleshooting

### CSS Not Loading
- Make sure the service worker is unregistered in development
- Clear browser cache and hard refresh (Ctrl+Shift+R)
- Check that `src/input.css` is imported in `src/main.js`

### Firebase Connection Issues
- Verify Firebase configuration in `src/firebaseConfig.js`
- Check Firestore security rules
- Ensure Authentication is enabled in Firebase Console

### Service Worker Issues
- Service worker is disabled in development mode
- In production, clear cache if you see old versions
- Check browser console for service worker errors

## 📄 License

This project is private and proprietary.

## 👥 Contributing

This is a private project. For questions or issues, contact the project maintainer.

---

Built with ❤️ for Mama's Kitchen

