# 🎨 Assets Folder Structure

## 📁 Folder Organization

```
assets/
├── images/
│   ├── places/          # Restaurant, tourist spot images
│   ├── vehicles/        # Car, bike, rental vehicle images  
│   ├── users/           # User profile pictures, avatars
│   ├── icons/           # App icons, custom icons
│   └── logos/           # Plan It logo, partner logos
├── fonts/               # Custom fonts (if needed)
└── styles/              # Additional CSS/SCSS files
```

## 🖼️ How to Add Images

### **Step 1: Add Image Files**
Place your images in the appropriate folders:
- **Places**: `assets/images/places/restaurant1.jpg`
- **Vehicles**: `assets/images/vehicles/car1.png`
- **User Photos**: `assets/images/users/profile1.jpg`
- **Icons**: `assets/images/icons/star.svg`
- **Logos**: `assets/images/logos/planit-logo.png`

### **Step 2: Import in Components**
```javascript
// Example imports
import logo from '../../assets/images/logos/planit-logo.png';
import carImage from '../../assets/images/vehicles/car1.jpg';
import restaurantImage from '../../assets/images/places/restaurant1.jpg';
import userAvatar from '../../assets/images/users/avatar1.png';
```

### **Step 3: Use in JSX**
```javascript
// In your React components
<img src={logo} alt="Plan It Logo" className="w-32 h-auto" />
<img src={carImage} alt="Rental Car" className="w-full h-48 object-cover rounded-lg" />
<div className="bg-cover bg-center" style={{backgroundImage: `url(${restaurantImage})`}}>
```

## 🎯 Recommended Image Formats

### **For Web Performance:**
- **Photos**: `.jpg` or `.webp` (smaller file size)
- **Graphics with transparency**: `.png`
- **Icons**: `.svg` (scalable, small size)
- **Logos**: `.svg` or `.png`

### **Recommended Sizes:**
- **Place images**: 800x600px or 1200x800px
- **Vehicle images**: 800x600px
- **User avatars**: 200x200px (square)
- **Icons**: 24x24px, 32x32px, 48x48px
- **Logos**: 300x100px (3:1 ratio)

## 📱 Example Usage in Components

### **Places Component:**
```javascript
import restaurantImg from '../../assets/images/places/restaurant.jpg';

const PlaceCard = ({ place }) => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden">
    <img 
      src={place.image || restaurantImg} 
      alt={place.name}
      className="w-full h-48 object-cover"
    />
    <div className="p-4">
      <h3 className="text-lg font-semibold">{place.name}</h3>
    </div>
  </div>
);
```

### **Navbar with Logo:**
```javascript
import logo from '../../assets/images/logos/planit-logo.png';

const Navbar = () => (
  <nav className="bg-white shadow-sm">
    <div className="flex items-center">
      <img src={logo} alt="Plan It" className="h-8 w-auto" />
      <span className="ml-2 text-xl font-bold text-blue-600">Plan It</span>
    </div>
  </nav>
);
```

## 🚀 Best Practices

1. **📏 Optimize Images**: Compress images before adding to reduce bundle size
2. **📱 Use Responsive Images**: Provide different sizes for different screen sizes
3. **♿ Alt Text**: Always include descriptive alt text for accessibility
4. **🎯 Lazy Loading**: Use lazy loading for images below the fold
5. **📦 Code Splitting**: Import images only where needed

## 🛠️ Tools for Image Optimization

- **Online**: TinyPNG, ImageOptim, Squoosh
- **Build Tools**: webpack-image-loader (already configured in Create React App)
- **Format Conversion**: Convert to WebP for better compression

## 🎨 Example Images You Can Add

### **For Places:**
- Restaurant interiors/exteriors
- Tourist attractions
- Local landmarks
- Food images
- Scenic views

### **For Vehicles:**
- Car models available for rent
- Bikes and scooters
- Vehicle interiors
- Rental company logos

### **For Users:**
- Default avatar placeholders
- VIT campus images
- Student life photos

Your assets folder is now ready to use! 🎉