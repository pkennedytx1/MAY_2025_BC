#!/bin/bash

# Holy Grail Aviation Weather App - Setup Script

echo "🚁 Setting up Holy Grail Aviation Weather App..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    echo "Visit: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js found: $(node --version)"

# Setup Backend
echo "📦 Setting up backend..."
cd backend

if [ ! -d "node_modules" ]; then
    echo "Installing backend dependencies..."
    npm install
    if [ $? -eq 0 ]; then
        echo "✅ Backend dependencies installed successfully"
    else
        echo "❌ Failed to install backend dependencies"
        exit 1
    fi
else
    echo "✅ Backend dependencies already installed"
fi

cd ..

# Setup Frontend
echo "📦 Setting up frontend..."
cd frontend

# Check if we need to install any frontend dependencies
if [ ! -f "package-lock.json" ] && [ ! -f "yarn.lock" ]; then
    echo "Frontend uses vanilla JavaScript - no additional dependencies needed"
fi

cd ..

echo ""
echo "🎉 Setup complete!"
echo ""
echo "To start the application:"
echo "1. Start the backend server:"
echo "   cd backend && npm run dev"
echo ""
echo "2. Open the frontend:"
echo "   Open frontend/index.html in your browser"
echo "   Or use: cd frontend && python -m http.server 8007"
echo ""
echo "3. The app will be available at:"
echo "   Frontend: http://localhost:8007"
echo "   Backend API: http://localhost:5001"
echo ""
echo "🌤️ Happy weather tracking!"
