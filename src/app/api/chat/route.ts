import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { PORTFOLIO_KNOWLEDGE } from '@/data/chatbot-knowledge';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// Rate limiting storage (in production, use Redis or similar)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

function getRateLimitKey(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0] : request.ip || 'unknown';
  return ip;
}

function checkRateLimit(key: string): { allowed: boolean; resetTime?: number } {
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute window
  const maxRequests = parseInt(process.env.CHATBOT_RATE_LIMIT || '10');

  const current = rateLimitStore.get(key);
  
  if (!current || now > current.resetTime) {
    rateLimitStore.set(key, { count: 1, resetTime: now + windowMs });
    return { allowed: true };
  }

  if (current.count >= maxRequests) {
    return { allowed: false, resetTime: current.resetTime };
  }

  current.count++;
  return { allowed: true };
}

// Create system prompt with portfolio information
function createSystemPrompt(): string {
  const portfolioData = JSON.stringify(PORTFOLIO_KNOWLEDGE, null, 2);
  
  return `You are Shivam Yadav, a Full-Stack Developer and MCA graduate. You are personally responding to visitors on your portfolio website. Speak in first person as if you are directly talking to the user yourself.

IMPORTANT GUIDELINES:
1. Always use "I", "my", "me" - never refer to yourself in third person
2. Respond as if you are personally having a conversation with the visitor
3. Be friendly, enthusiastic, and professional about your own work
4. Share your experiences, projects, and skills as if telling your own story
5. Only discuss your professional background, skills, projects, education, and experience
6. If asked about unrelated topics, politely redirect to your professional background

SPEAKING STYLE:
- Use first person: "I built", "My experience", "I'm passionate about"
- Be conversational and personable: "I'd love to tell you about..."
- Show enthusiasm: "I'm really excited about this project!"
- Be professional but approachable
- Include personal insights about your work and experiences

YOUR INFORMATION:
${portfolioData}

Remember: You are Shivam Yadav personally responding to questions about your work, not an assistant talking about someone else. Make it feel like a genuine conversation with you directly.`;
}

export async function POST(request: NextRequest) {
  try {
    // Check if Gemini API key is configured
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'Chatbot is currently not configured. Please contact Shivam directly.' },
        { status: 503 }
      );
    }

    // Rate limiting
    const rateLimitKey = getRateLimitKey(request);
    const rateLimit = checkRateLimit(rateLimitKey);
    
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { 
          error: 'Rate limit exceeded. Please try again later.',
          resetTime: rateLimit.resetTime 
        },
        { 
          status: 429,
          headers: {
            'Retry-After': Math.ceil(((rateLimit.resetTime || 0) - Date.now()) / 1000).toString()
          }
        }
      );
    }

    const { message, conversationHistory } = await request.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required and must be a string' },
        { status: 400 }
      );
    }

    // Sanitize input - remove potential harmful content
    const sanitizedMessage = message
      .trim()
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
      .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '') // Remove iframe tags
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/data:text\/html/gi, '') // Remove data URLs
      .substring(0, 500); // Ensure length limit

    if (sanitizedMessage.length < 1) {
      return NextResponse.json(
        { error: 'Message content is invalid' },
        { status: 400 }
      );
    }

    // Check conversation history limit
    const maxMessages = parseInt(process.env.CHATBOT_MAX_MESSAGES || '20');
    if (conversationHistory && conversationHistory.length > maxMessages) {
      return NextResponse.json(
        { error: 'Conversation too long. Please start a new conversation.' },
        { status: 400 }
      );
    }

    // Initialize Gemini model with retry logic
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      systemInstruction: createSystemPrompt()
    });

    // Prepare conversation history for Gemini
    const chatHistory = [];
    
    // Add conversation history if available
    if (conversationHistory && Array.isArray(conversationHistory)) {
      for (const msg of conversationHistory.slice(-10)) { // Keep last 10 messages for context
        if (msg.type === 'user') {
          chatHistory.push({
            role: "user",
            parts: [{ text: msg.content }]
          });
        } else if (msg.type === 'assistant') {
          chatHistory.push({
            role: "model",
            parts: [{ text: msg.content }]
          });
        }
      }
    }

    let responseText = '';
    let isGeminiFallback = false;

    // For now, prioritize our high-quality fallback responses since they're comprehensive
    // and specifically crafted for the portfolio. Try Gemini as enhancement for variety.
    
    const shouldUseGemini = Math.random() > 0.3; // 70% chance to try Gemini first
    
    if (shouldUseGemini) {
      try {
        // Try with gemini-1.5-flash first
        let model = genAI.getGenerativeModel({ 
          model: "gemini-1.5-flash",
          systemInstruction: createSystemPrompt()
        });

        let chat = model.startChat({
          history: chatHistory,
          generationConfig: {
            temperature: 0.9,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1200,
          },
        });

        // Generate response with shorter timeout since fallback is high quality
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Request timeout')), 5000)
        );

        const result = await Promise.race([
          chat.sendMessage(sanitizedMessage),
          timeoutPromise
        ]) as any;

        const geminiResponse = result.response.text();
        
        // Use Gemini response if it's substantial and helpful
        if (geminiResponse && geminiResponse.length > 50) {
          responseText = geminiResponse;
        } else {
          // If Gemini response is too short, use our detailed fallback
          throw new Error('Gemini response too brief');
        }

      } catch (geminiError) {
        console.log('Using high-quality fallback response');
        isGeminiFallback = true;
        responseText = generateFallbackResponse(sanitizedMessage, conversationHistory);
      }
    } else {
      // Directly use our high-quality fallback responses
      console.log('Using high-quality local response');
      isGeminiFallback = true;
      responseText = generateFallbackResponse(sanitizedMessage, conversationHistory);
    }

    // Basic intent classification for analytics
    const intent = classifyBasicIntent(message);

    return NextResponse.json({
      message: responseText,
      intent: intent,
      timestamp: new Date().toISOString(),
      sessionId: request.headers.get('x-session-id') || 'anonymous',
      fallback: isGeminiFallback
    });

  } catch (error) {
    console.error('Chat API Error:', error);
    
    // Extract message from request for fallback
    let fallbackMessage = 'Hello';
    let fallbackHistory: any[] = [];
    
    try {
      const body = await request.clone().json();
      fallbackMessage = body.message || 'Hello';
      fallbackHistory = body.conversationHistory || [];
    } catch {
      // Use defaults if we can't parse the request
    }
    
    // Use fallback response for any errors
    const fallbackResponse = generateFallbackResponse(fallbackMessage, fallbackHistory);
    const intent = classifyBasicIntent(fallbackMessage);

    return NextResponse.json({
      message: fallbackResponse,
      intent: intent,
      timestamp: new Date().toISOString(),
      sessionId: request.headers.get('x-session-id') || 'anonymous',
      fallback: true
    });
  }
}

// Generate human-like fallback responses when Gemini is unavailable
function generateFallbackResponse(message: string, conversationHistory: any[] = []): string {
  const lowerMessage = message.toLowerCase();
  const isFirstMessage = !conversationHistory || conversationHistory.length === 0;
  
  // Greeting responses
  if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey') || lowerMessage.includes('good')) {
    const greetings = [
      "Hello! 👋 Welcome to my portfolio! I'm **Shivam Yadav**, and I'm really excited to share my work with you. Whether you're interested in my **full-stack development projects**, **machine learning expertise**, or **professional journey**, I'd love to tell you all about it! What would you like to know first? 🚀",
      
      "Hi there! 😊 Great to meet you! I'm **Shivam**, a passionate Full-Stack Developer and recent MCA graduate. I've been working on some really exciting projects - from building sophisticated hotel management systems to creating gesture-controlled applications. What aspect of my work interests you most? 💻",
      
      "Hey! 👋 Thanks for checking out my portfolio! I'm **Shivam**, and I love combining **technical expertise with creative problem-solving**. I've worked on everything from React applications to machine learning projects, and I'd be thrilled to share my journey with you! What would you like to explore? ✨",
    ];
    return greetings[Math.floor(Math.random() * greetings.length)];
  }
  
  // Projects related
  if (lowerMessage.includes('project') || lowerMessage.includes('work') || lowerMessage.includes('built') || lowerMessage.includes('created')) {
    return `I've created some projects that I'm really proud of and excited to share with you! 🚀

**🏨 Hotel Management System** - This is one of my most comprehensive projects! I built this enterprise-level platform using **React, Node.js, and MongoDB**. It handles real-time room booking, guest management, staff administration, automated billing, and I integrated **Stripe for seamless payments**. The system manages everything from check-in/check-out to automated email notifications! 
🔗 **Check it out:** [kutkuthotel.me](https://kutkuthotel.me/)

**🎮 Gesture-Controlled Media Player** - This project really showcases my passion for innovation! I created an application that lets you control media playback using just **hand gestures**. I built it with **React, Python, OpenCV, and MediaPipe**, implementing advanced computer vision and machine learning for real-time gesture recognition. Imagine pausing a video with just a wave of your hand! 
🔗 **See it in action:** [gesturecontroll.netlify.app](https://gesturecontroll.netlify.app/)

**🤖 AI Image Enhancer** - I developed this sophisticated machine learning application that dramatically improves image quality using **deep learning algorithms and neural networks**. This project really demonstrates my expertise in AI/ML and how I can apply complex algorithms to solve real-world problems.

**🍽️ MkCaters Website** - I created this polished, full-stack catering service website focusing on modern design principles, responsive layouts, and seamless user experience. It's a perfect example of how I blend aesthetics with functionality!

Each project represents a different challenge I've tackled and showcase my growth as a developer. From enterprise web applications to cutting-edge AI implementations - I love solving complex problems with technology! Which project would you like me to tell you more about? 🤔`;
  }
  
  // Skills related
  if (lowerMessage.includes('skill') || lowerMessage.includes('technology') || lowerMessage.includes('tech') || lowerMessage.includes('language') || lowerMessage.includes('framework')) {
    return `I've built up quite a diverse tech stack over the years, and I'm always excited to learn new technologies! 💻✨

**🎨 Frontend Development:**
• **React.js** - I love working with advanced component architecture, hooks, and state management
• **JavaScript (ES6+)** - I'm proficient in modern JS features, async programming, and DOM manipulation  
• **HTML5 & CSS3** - I focus on semantic markup, responsive design, and smooth animations
• **Tailwind CSS** - I use utility-first styling for custom designs and responsive layouts

**⚡ Backend Development:**
• **Node.js & Express.js** - I build robust RESTful APIs, implement middleware, and create authentication systems
• **Python** - I use it for data processing, machine learning projects, and automation scripts
• **API Development** - I implement JWT authentication, rate limiting, and comprehensive error handling

**🗄️ Database Management:**
• **MongoDB** - I design NoSQL schemas, write aggregation pipelines, and optimize performance
• **MySQL** - I handle relational design, complex queries, and ensure data integrity

**🤖 AI/ML Specialization:**
• **TensorFlow** - I develop deep learning models and neural networks
• **OpenCV** - I work with computer vision, image processing, and real-time analysis
• **MediaPipe** - I implement hand tracking, gesture recognition, and pose estimation
• **Scikit-learn** - I use various machine learning algorithms and handle data preprocessing

**🛠️ Tools & Platforms:**
• **Git & GitHub** - For version control, collaboration, and CI/CD workflows
• **Vercel & Netlify** - I deploy and host applications with performance optimization
• **Development Tools** - I'm proficient with VS Code, debugging tools, and testing frameworks

**🌟 What I'm Passionate About:**
• **Full-Stack Integration** - I love seamlessly connecting frontend and backend systems
• **AI/ML Implementation** - I enjoy bringing cutting-edge technology to real-world projects
• **Problem-Solving** - I approach complex technical challenges with creativity and systematic thinking
• **Performance Optimization** - I focus on building fast, scalable applications

My **recent MCA degree** has given me strong theoretical foundations that perfectly complement my hands-on development experience. This combination helps me tackle both immediate technical challenges and long-term architectural decisions effectively!

What specific technology or area would you like to know more about? I'd love to share my experience with it! 🚀`;
  }
  
  // Experience related
  if (lowerMessage.includes('experience') || lowerMessage.includes('background') || lowerMessage.includes('career') || lowerMessage.includes('internship') || lowerMessage.includes('job')) {
    // Experience related
  if (lowerMessage.includes('experience') || lowerMessage.includes('work') || lowerMessage.includes('job') || lowerMessage.includes('career') || lowerMessage.includes('internship')) {
    return `My professional journey has been incredibly exciting and diverse! Here's what I've been working on: �

**� Current Role:**
I'm currently working as a **Full Stack Developer** where I get to:
• Build and maintain scalable web applications
• Work with both frontend and backend technologies
• Collaborate with cross-functional teams on innovative projects
• Implement cutting-edge solutions using modern tech stacks

**🎓 Educational Journey:**
Just completed my **Master of Computer Applications (MCA)** degree, which has been an amazing experience! The program gave me:
• Deep theoretical understanding of computer science fundamentals
• Hands-on experience with advanced development methodologies
• Strong foundation in data structures, algorithms, and system design
• Exposure to emerging technologies and industry best practices

**🏆 What Makes My Experience Unique:**
• **Academic Excellence** - I've maintained strong performance throughout my MCA program
• **Practical Application** - I consistently bridge the gap between theoretical knowledge and real-world implementation
• **Project Leadership** - I've led multiple complex projects from conception to deployment
• **Continuous Learning** - I'm always exploring new technologies and staying current with industry trends

**💡 Key Achievements:**
• Successfully developed and deployed multiple full-stack applications
• Built innovative AI-powered solutions using machine learning and computer vision
• Created responsive, user-friendly interfaces that provide excellent user experiences
• Implemented robust backend systems with proper security and scalability considerations

**🌟 My Approach:**
I believe in combining strong technical fundamentals with creative problem-solving. My recent academic experience has sharpened my analytical skills, while my development projects have honed my practical abilities. This unique combination allows me to tackle complex challenges with both theoretical depth and practical expertise.

The transition from student to professional developer has been incredibly rewarding, and I'm excited about the opportunities ahead!

What aspect of my experience would you like to know more about? 📈`;
  }
  }
  
  // Contact related
  if (lowerMessage.includes('contact') || lowerMessage.includes('email') || lowerMessage.includes('reach') || lowerMessage.includes('hire') || lowerMessage.includes('available')) {
    return `Absolutely! I'm **actively seeking exciting opportunities** and would love to connect with you! I'm passionate about taking on challenging projects and collaborating with innovative teams. 📧✨

**� Contact Information:**
• **�📧 Email:** [shivamydv.work@gmail.com](mailto:shivamydv.work@gmail.com)
• **� Phone:** +91 7252802931  
• **📍 Location:** Agra, Uttar Pradesh, India
• **🌐 Portfolio:** You're already here exploring my work!

**🚀 Currently Available For:**
✅ **Full-Stack Development Projects** - React, Node.js, Python applications
✅ **Machine Learning & AI Projects** - Computer vision, data analysis, predictive modeling
✅ **Freelance Work** - Custom web applications, automation solutions
✅ **Full-Time Opportunities** - Ready to join innovative teams and companies
✅ **Collaborative Projects** - Open-source contributions, interesting challenges
✅ **Technical Consulting** - Architecture decisions, technology recommendations
✅ **Mentoring & Knowledge Sharing** - Helping others learn and grow

**💡 What Makes Working With Me Special:**
• **Versatile Skill Set** - I can handle everything from frontend UX to backend architecture to ML implementation
• **Problem-Solving Mindset** - I approach challenges creatively and systematically  
• **Continuous Learner** - I'm always staying current with the latest technologies and best practices
• **Professional Communication** - Clear, responsive, and collaborative work style
• **Proven Track Record** - I've successfully delivered projects across multiple domains

**💬 Perfect For Discussing:**
🎯 Web application development projects
🤖 AI/ML integration opportunities  
📊 Data analysis and visualization needs
🔧 Technical architecture and consulting
💼 Full-time career opportunities
🚀 Innovative startup collaborations

I'm **genuinely excited** about new opportunities and bring both technical expertise and enthusiasm to every project. Whether you have a specific project in mind, want to explore potential collaborations, or just want to connect and chat about technology - I'd absolutely love to hear from you!

**Don't hesitate to reach out!** I'm responsive, professional, and always ready for an engaging conversation about technology and opportunities. 🌟`;
  }
  
  // Education related
  if (lowerMessage.includes('education') || lowerMessage.includes('degree') || lowerMessage.includes('study') || lowerMessage.includes('university') || lowerMessage.includes('college')) {
    return `I have a strong educational foundation! 🎓

**Master of Computer Applications (MCA)** - I recently completed this program, which gave me comprehensive knowledge in:
- Advanced Programming Concepts
- Software Engineering
- Database Management Systems
- Machine Learning & AI
- Data Structures & Algorithms
- Web Technologies

My academic background perfectly complements my practical experience from internships and personal projects. The MCA program has enhanced my problem-solving skills and given me deep insights into computer science applications.

This combination of formal education and hands-on experience makes me well-equipped to tackle complex technical challenges!`;
  }
  
  // About Shivam
  if (lowerMessage.includes('about') || lowerMessage.includes('who') || lowerMessage.includes('tell me') || lowerMessage.includes('shivam')) {
    return `Let me tell you about myself! 😊

I'm Shivam Yadav, a passionate **Full-Stack Developer and recent MCA graduate** from Agra, India. I'm someone who truly loves creating innovative solutions that make a real difference!

**What makes me unique:**
🚀 **Versatile Developer** - I'm comfortable with both frontend and backend development
🤖 **AI/ML Enthusiast** - I love integrating machine learning into practical applications
💡 **Problem Solver** - I approach challenges with creativity and technical expertise
📚 **Continuous Learner** - I'm always exploring new technologies and frameworks
🎯 **Results-Driven** - I focus on building applications that provide real value

I've built everything from hotel management systems to gesture-controlled media players, showcasing my ability to work across different domains and technologies.

Currently gaining valuable industry experience as a Frontend Developer while staying active with personal projects and learning new technologies!`;
  }
  
  // Default response for other questions
  const defaultResponses = [
    `That's a great question! While I'd love to give you a more detailed answer, I can tell you about my impressive work in full-stack development, my exciting projects, or my experience in data science and machine learning. 

What specific aspect of my portfolio would you like to explore? 🤔`,
    
    `I can help you learn about my professional background! I'm a talented full-stack developer with experience in React, Node.js, Python, and machine learning.

Would you like to know about:
🚀 My exciting projects
💻 My technical skills
💼 My work experience
📧 How to contact me`,
    
    `Thanks for your interest in my work! I've built some really cool projects and have solid experience in both development and data science.

I'd be happy to tell you more about any specific area - just let me know what interests you most! 😊`
  ];
  
  return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
}

// Simple intent classification for basic analytics
function classifyBasicIntent(message: string): string {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
    return 'greeting';
  }
  if (lowerMessage.includes('project') || lowerMessage.includes('work') || lowerMessage.includes('built')) {
    return 'projects';
  }
  if (lowerMessage.includes('skill') || lowerMessage.includes('technology') || lowerMessage.includes('language')) {
    return 'skills';
  }
  if (lowerMessage.includes('contact') || lowerMessage.includes('email') || lowerMessage.includes('reach')) {
    return 'contact';
  }
  if (lowerMessage.includes('experience') || lowerMessage.includes('background') || lowerMessage.includes('career')) {
    return 'experience';
  }
  if (lowerMessage.includes('education') || lowerMessage.includes('degree') || lowerMessage.includes('study')) {
    return 'education';
  }
  
  return 'general';
}

export async function GET() {
  return NextResponse.json({
    status: 'active',
    message: 'Gemini-powered Portfolio Chatbot is running',
    version: '2.0.0',
    capabilities: [
      'Portfolio information',
      'Project details',
      'Skills and experience',
      'Contact information',
      'Education background'
    ],
    rateLimit: {
      maxRequests: parseInt(process.env.CHATBOT_RATE_LIMIT || '10'),
      windowMs: 60000
    },
    lastUpdated: new Date().toISOString()
  });
}
