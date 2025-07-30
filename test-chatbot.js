// Test script for Gemini chatbot integration
// Run with: node test-chatbot.js

const testMessage = {
  message: "Tell me about Shivam's projects",
  conversationHistory: []
};

async function testChatbot() {
  try {
    console.log('🤖 Testing Gemini Chatbot Integration');
    console.log('=====================================');
    
    // Test API status
    console.log('1. Testing API status...');
    const statusResponse = await fetch('http://localhost:3000/api/chat');
    const statusData = await statusResponse.json();
    
    if (statusData.status === 'active') {
      console.log('✅ API Status: Active');
      console.log(`📦 Version: ${statusData.version}`);
    } else {
      console.log('❌ API Status: Inactive');
      return;
    }
    
    // Test chatbot message
    console.log('\n2. Testing chatbot response...');
    const chatResponse = await fetch('http://localhost:3000/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testMessage)
    });
    
    const chatData = await chatResponse.json();
    
    if (chatResponse.ok) {
      console.log('✅ Chatbot Response: Success');
      console.log(`🎯 Intent: ${chatData.intent}`);
      console.log(`💬 Response: ${chatData.message.substring(0, 100)}...`);
    } else {
      console.log('❌ Chatbot Response: Failed');
      console.log(`Error: ${chatData.error}`);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.log('\n💡 Make sure the development server is running:');
    console.log('   npm run dev');
  }
}

// Check if we're running in Node.js environment
if (typeof window === 'undefined') {
  // Node.js environment - need to install node-fetch
  console.log('⚠️  This test requires a browser environment or node-fetch');
  console.log('📝 To test manually:');
  console.log('   1. Run: npm run dev');
  console.log('   2. Open: http://localhost:3000');
  console.log('   3. Click the chatbot icon');
  console.log('   4. Ask: "Tell me about your projects"');
} else {
  // Browser environment
  testChatbot();
}

module.exports = { testChatbot };
