#!/bin/bash

# Holy Grail Aviation Weather App - Start Script

echo "🚁 Starting Holy Grail Aviation Weather App..."

# Check if backend is already running
if curl -s http://localhost:5001/api/health > /dev/null; then
    echo "✅ Backend is already running on port 5001"
else
    echo "🚀 Starting backend server..."
    cd backend
    PORT=5001 npm run dev &
    BACKEND_PID=$!
    cd ..
    
    # Wait for backend to start
    echo "⏳ Waiting for backend to start..."
    sleep 3
    
    # Check if backend started successfully
    if curl -s http://localhost:5001/api/health > /dev/null; then
        echo "✅ Backend started successfully"
    else
        echo "❌ Failed to start backend"
        exit 1
    fi
fi

echo ""
echo "🌤️ Backend API is running at: http://localhost:5001"
echo "📱 Open frontend/index.html in your browser to use the app"
echo ""
echo "💡 Tip: You can also serve the frontend with:"
echo "   cd frontend && python -m http.server 8007"
echo "   Then visit: http://localhost:8007"
echo ""
echo "Press Ctrl+C to stop the backend server"
echo ""

# Keep the script running and show backend logs
wait $BACKEND_PID
