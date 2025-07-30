#!/bin/bash

# Gemini Chatbot Setup Script
echo "🤖 Setting up Gemini AI Chatbot for Shivam's Portfolio"
echo "=================================================="

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "❌ .env.local file not found!"
    echo "Please make sure you're in the project root directory."
    exit 1
fi

# Check if API key is already set
if grep -q "GEMINI_API_KEY=your_gemini_api_key_here" .env.local; then
    echo "⚠️  Gemini API key needs to be configured"
    echo ""
    echo "📋 Steps to get your API key:"
    echo "1. Visit: https://makersuite.google.com/app/apikey"
    echo "2. Sign in with your Google account"
    echo "3. Create a new API key"
    echo "4. Copy the API key"
    echo ""
    echo "💡 Then replace 'your_gemini_api_key_here' in .env.local with your actual API key"
    echo ""
    echo "Example:"
    echo "GEMINI_API_KEY=AIzaSyC..."
    
elif grep -q "GEMINI_API_KEY=AIzaSy" .env.local; then
    echo "✅ Gemini API key appears to be configured"
    echo ""
    echo "🚀 Testing chatbot..."
    
    # Start the server in background for testing
    npm run dev &
    SERVER_PID=$!
    
    # Wait for server to start
    sleep 3
    
    # Test the API
    echo "🔄 Testing API endpoint..."
    RESPONSE=$(curl -s http://localhost:3000/api/chat)
    
    if echo "$RESPONSE" | grep -q "Gemini-powered"; then
        echo "✅ Chatbot API is working!"
        echo "🌐 Visit http://localhost:3000 to test the chatbot"
    else
        echo "❌ API test failed. Check your API key."
    fi
    
    # Kill the background server
    kill $SERVER_PID 2>/dev/null
    
else
    echo "✅ Gemini API key is configured"
    echo "🚀 You're ready to use the chatbot!"
fi

echo ""
echo "📚 For more help, see GEMINI_CHATBOT_SETUP.md"
