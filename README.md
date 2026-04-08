# 🌾 Smart Farm Kenya

An AI-powered farming assistant designed specifically for Kenyan smallholder farmers. This web application helps farmers diagnose crop diseases, get personalized fertilizer recommendations, receive dairy farming advice, and access weather-based farming insights using advanced AI technologies.

## ✨ Features

### 🖼️ Plant Disease Diagnosis
- Upload crop images for instant disease analysis
- AI-powered identification of diseases and pests
- Severity assessment and treatment recommendations
- Support for multiple Kenyan crops

### 🥛 Dairy Farming Assistant
- AI-powered veterinary advice for dairy cows
- Symptom analysis and diagnosis
- Treatment recommendations and feeding advice
- Emergency situation detection

### 🌱 Fertilizer Recommendations
- Soil health analysis based on crop type and symptoms
- Personalized fertilizer suggestions
- Organic and inorganic options
- Cost-effective solutions for Kenyan farmers

### 🌤️ Weather-Based Farming Advice
- Real-time weather data integration
- Farming activity recommendations based on weather
- Warning systems for adverse conditions
- County-specific weather insights

### 📚 Farming History
- Track diagnosis and recommendation history
- Learning from past interactions
- Data-driven farming insights

## 🛠️ Tech Stack

### Frontend
- **React.js** - Modern JavaScript library for building user interfaces
- **Axios** - HTTP client for API requests
- **CSS3** - Styling and responsive design

### Backend
- **Node.js** - JavaScript runtime environment
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database for data storage
- **Mongoose** - MongoDB object modeling

### AI & APIs
- **Google Gemini AI** - Advanced language model for farming advice
- **Open-Meteo API** - Free weather data service
- **Cloudinary** - Image upload and storage

## 🚀 Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas account (or local MongoDB)
- Google AI Studio API key
- Git

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/smart-farm-ke.git
   cd smart-farm-ke
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the backend directory:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=your_mongodb_connection_string
   GEMINI_API_KEY=your_google_gemini_api_key
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   ```

4. **Start the backend server**
   ```bash
   npm run dev
   ```

### Frontend Setup

1. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

2. **Start the development server**
   ```bash
   npm start
   ```

3. **Access the application**
   Open [http://localhost:3000](http://localhost:3000) in your browser

## 📡 API Endpoints

### Plant Diagnosis
- `POST /api/diagnose` - Upload image for disease analysis

### Dairy Assistant
- `POST /api/dairy` - Get dairy farming advice

### Fertilizer Recommendations
- `POST /api/fertilizer` - Get fertilizer recommendations

### Weather Insights
- `POST /api/weather` - Get weather-based farming advice

### History
- `GET /api/history` - Retrieve farming history
- `POST /api/history` - Save farming session

## 🎯 Usage

1. **Navigate to the application** in your web browser
2. **Choose your farming need**:
   - Upload crop images for disease diagnosis
   - Describe dairy cow symptoms for veterinary advice
   - Specify crop and soil conditions for fertilizer recommendations
   - Select your county for weather-based insights
3. **Receive AI-powered recommendations** tailored for Kenyan farming conditions
4. **Save and track** your farming history for future reference

## 🔧 Configuration

### API Keys Setup

1. **Google Gemini API**:
   - Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create a new API key
   - Add to `.env` as `GEMINI_API_KEY`

2. **MongoDB Atlas**:
   - Create account at [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Set up a free cluster
   - Get connection string for `MONGODB_URI`

3. **Cloudinary** (Optional):
   - Sign up at [Cloudinary](https://cloudinary.com)
   - Get cloud name, API key, and secret
   - Configure in `.env` for image uploads

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/your-feature-name`
3. **Make your changes** and test thoroughly
4. **Commit your changes**: `git commit -m 'Add some feature'`
5. **Push to the branch**: `git push origin feature/your-feature-name`
6. **Open a Pull Request**

### Development Guidelines
- Follow existing code style and structure
- Add comments for complex logic
- Test your changes before submitting
- Update documentation as needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Kenyan Ministry of Agriculture** for farming insights and data
- **Google AI** for providing powerful language models
- **Open-Meteo** for reliable weather data
- **MongoDB Atlas** for database hosting
- **Cloudinary** for image processing services

## 📞 Support

For support, questions, or feedback:
- Create an issue on GitHub
- Contact the development team
- Join our community discussions

## 🌟 Future Enhancements

- [ ] Mobile application development
- [ ] Offline functionality for rural areas
- [ ] Integration with local agricultural extension services
- [ ] Multi-language support (Swahili, local dialects)
- [ ] SMS-based advisory system
- [ ] Market price integration
- [ ] Pest monitoring and alerts
- [ ] Soil testing partnerships

---

**Built with ❤️ for Kenyan farmers by the Smart Farm Kenya team**

*Empowering smallholder farmers with AI-driven agricultural solutions* 🌾🇰🇪