import { Icons } from "@/components/icons";
import { HomeIcon, NotebookIcon } from "lucide-react";

export const DATA = {
  name: "Shivam Yadav",
  initials: "SY",
  url: "https://shivamyadav.dev",
  location: "Agra, Uttar Pradesh, India",
  locationLink: "https://www.google.com/maps/place/agra",
  description:
    "Full-Stack Developer & MCA Graduate specializing in React, Node.js, Python, and Machine Learning. Experienced in building scalable web applications, data analytics platforms, and AI-powered solutions. Strong background in both frontend and backend development with proven internship experience at leading organizations.",
  summary:
    "Recent MCA graduate with 6+ months of professional internship experience in Data Science and Analytics. Passionate Full-Stack Developer skilled in React, Node.js, Python, and Machine Learning. Proven track record of building real-world applications and solving complex problems. Ready to contribute to innovative technology teams and drive business growth through scalable software solutions.",
  avatarUrl: "/me.png",
  skills: [
    "React",
    "Node.js",
    "JavaScript",
    "TypeScript",
    "Python",
    "Java",
    "HTML/CSS",
    "TailwindCSS",
    "Bootstrap",
    "SQL",
    "MongoDB",
    "MySQL",
    "Machine Learning",
    "Data Science",
    "Git/GitHub",
    "REST APIs",
    "Problem Solving",
  ],
  navbar: [
    { href: "/", icon: HomeIcon, label: "Home" },
    { href: "/blog", icon: NotebookIcon, label: "Blog" },
  ],
  contact: {
    email: "shivamydv.work@gmail.com",
    tel: "+91 7252802931",
    social: {
      GitHub: {
        name: "GitHub",
        url: "https://github.com/sy17258",
        icon: Icons.github,
        navbar: true,
      },
      LinkedIn: {
        name: "LinkedIn",
        url: "https://www.linkedin.com/in/shivamyadav-sy",
        icon: Icons.linkedin,
        navbar: true,
      },
      email: {
        name: "Send Email",
        url: "mailto:shivamydv.work@gmail.com",
        icon: Icons.email,
        navbar: false,
      },
    },
  },

  work: [
    {
      company: "Truly Virtually",
      href: "https://www.trulyvirtually.com",
      badges: ["Frontend Development", "React", "JavaScript"],
      location: "Remote",
      title: "Frontend Developer",
      logoUrl: "https://media.licdn.com/dms/image/v2/C560BAQE2WX7pTYSv7Q/company-logo_200_200/company-logo_200_200/0/1630642940997/truly_virtually_logo?e=1755734400&v=beta&t=UbaOtUqWktbwz8p8unk3Tol-JdCAc52PCEejyevTdcM",
      start: "January 2025",
      end: "June 2025",
      description:
        "Developed responsive and interactive user interfaces using React.js and modern JavaScript frameworks. Created pixel-perfect designs with CSS3, TailwindCSS, and Bootstrap. Collaborated with design teams to implement user-friendly interfaces and optimized web applications for performance and accessibility. Worked with RESTful APIs to integrate frontend components with backend services.",
    },
    {
      company: "YBI Foundation",
      href: "https://www.ybifoundation.org",
      badges: ["Machine Learning", "Python"],
      location: "Remote",
      title: "Data Science and Machine Learning Intern",
      logoUrl: "https://avatars.githubusercontent.com/u/89171747?s=280&v=4",
      start: "June 2024",
      end: "August 2024",
      description:
        "Worked extensively on machine learning projects focusing on data preprocessing, model development, and deployment. Implemented predictive analytics solutions using Python libraries including scikit-learn, pandas, and numpy. Developed data visualization dashboards and contributed to research projects on ML algorithms optimization.",
    },
    {
      company: "Accenture",
      badges: ["Data Analytics", "Visualization"],
      href: "https://www.accenture.com/in-en",
      location: "Remote",
      title: "Data Analytics and Visualization Intern",
      logoUrl: "https://www.engagement-jeunes.com/logos/11216/x4oKarrkcE8aWqKqYUnQLxUFjoVP8g/Sans%20titre.png",
      start: "April 2024",
      end: "May 2024",
      description:
        "Developed interactive dashboards and business intelligence solutions using modern analytics tools. Analyzed large datasets to extract actionable insights for strategic decision-making. Created comprehensive reports and visualizations that improved data-driven decision processes for stakeholders.",
    },
  ],
  
  education: [
    {
      school: "GLA University",
      href: "https://www.gla.ac.in/",
      degree: "Master of Computer Applications (MCA)",
      logoUrl: "https://yt3.googleusercontent.com/55IMpTfTU1fezTDZb7ZbJ30ghHwuWEzi_JLwfyvReWSi0HWEF_LkGyCizUv9xV6XZ0Tnh4xd=s900-c-k-c0x00ffffff-no-rj",
      start: "2023",
      end: "2025",
    },
    {
      school: "St. John's College",
      href: "https://sjcagra.ac.in/",
      degree: "Bachelor of Computer Science (BCS)",
      logoUrl: "https://almashines.s3.dualstack.ap-southeast-1.amazonaws.com/assets/images/institutes/logo/170x170/1271.jpg?v=1679988291",
      start: "2019",
      end: "2022",
    },
  ],
  
  projects: [
    {
      title: "Hotel Management System",
      href: "https://kutkuthotel.me/",
      dates: "August 2023 - December 2023",
      active: true,
      description:
        "Developed a comprehensive hotel management system with features for room booking, guest management, staff administration, and billing. Implemented real-time room availability tracking, automated check-in/check-out processes, and integrated payment gateway. Features include dashboard analytics, guest history management, and automated email notifications for bookings and confirmations.",
      technologies: [
        "React",
        "Node.js",
        "Express.js",
        "MongoDB",
        "JavaScript",
        "Bootstrap",
        "JWT Authentication",
        "Stripe API",
        "Email Integration",
        "REST APIs",
      ],
      links: [
        {
          type: "Live Website",
          href: "https://kutkuthotel.me/",
        },
        {
          type: "Source Code",
          href: "https://github.com/sy17258/hotelbookingsaasapp",
        },
      ],
      image: "hotel.jpg",
      video: "",
    },
    {
      title: "Gesture-Controlled Media Player",
      href: "https://gesturecontroll.netlify.app/",
      dates: "January 2025 - April 2025",
      active: true,
      description:
        "Developed an innovative media player application that responds to hand gestures using computer vision technology. Integrated OpenCV and MediaPipe for real-time gesture recognition, allowing users to control playback, volume, and navigation without physical interaction. Features include play/pause, volume control, and track navigation through intuitive hand movements.",
      technologies: [
        "React",
        "Python",
        "OpenCV",
        "MediaPipe",
        "TensorFlow",
        "TailwindCSS",
        "JavaScript",
        "Computer Vision",
      ],
      links: [
        {
          type: "Live Demo",
          href: "https://gesturecontroll.netlify.app/",
        },
        {
          type: "Source Code",
          href: "https://github.com/sy17258/-Gesture-controlled-media-player",
        },
      ],
      image: "gesture.jpg",
      video: "",
    },
    {
      title: "AI Image Enhancer Platform",
      href: "https://image-enhanced.vercel.app",
      dates: "October 2024 - December 2024",
      active: true,
      description:
        "Built a comprehensive AI-powered image enhancement platform that automatically improves image quality, resolution, and visual appeal. Integrated advanced machine learning models for noise reduction, super-resolution, and color enhancement. Features batch processing capabilities and real-time preview functionality.",
      technologies: [
        "React",
        "Node.js",
        "Python",
        "TensorFlow",
        "OpenCV",
        "TailwindCSS",
        "REST APIs",
        "Machine Learning",
      ],
      links: [
        {
          type: "Live Demo",
          href: "https://image-enhanced.vercel.app",
        },
        {
          type: "Source Code",
          href: "https://github.com/sy17258/Image_enhancer",
        },
      ],
      image: "enhancer.jpg",
      video: "",
    },
    {
      title: "MkCaters - Catering Management System",
      href: "https://www.mkcaters.com/",
      dates: "January 2024 - September 2024",
      active: true,
      description:
        "Developed a comprehensive catering management platform with features for order management, menu customization, customer relationship management, and payment processing. Implemented responsive design, real-time order tracking, and integrated payment gateway for seamless transactions.",
      technologies: [
        "React",
        "Node.js",
        "JavaScript",
        "TypeScript",
        "MongoDB",
        "Express.js",
        "Bootstrap",
        "Stripe API",
        "REST APIs",
      ],
      links: [
        {
          type: "Live Website",
          href: "https://www.mkcaters.com/",
        },
      ],
      image: "",
      video: "https://cdn.llm.report/openai-demo.mp4",
    },
  ],
  
  hackathons: [
    {
      title: "Smart India Hackathon 2024",
      dates: "September 2024",
      location: "India",
      description:
        "Participated in India's biggest hackathon focusing on innovative solutions for government challenges. Developed a data analytics solution for improving public service delivery.",
      image: "https://pub-83c5db439b40468498f97946200806f7.r2.dev/hackline/hack-western.png",
      links: [],
    },
    {
      title: "College Tech Fest 2023",
      dates: "November 2023",
      location: "GLA University",
      description:
        "Won first place in web development competition by creating a full-stack e-commerce platform with advanced features and modern UI/UX design.",
      image: "https://pub-83c5db439b40468498f97946200806f7.r2.dev/hackline/hack-the-north.png",
      links: [],
    },
  ],
} as const;
