/**
 * skillDescriptions.js
 * 
 * This file contains categorized descriptions for various skills.
 * It provides custom descriptions based on skill categories and individual skills
 * to enhance the user profile display in /user/username.
 */

// Categorized skills with their corresponding descriptions
const skillCategories = {
  // IT and Development
  "IT": {
    defaultDescription: "Building digital solutions with technical expertise",
    subCategories: {
      // Programming Languages - Enhanced with specific descriptions for each language
      "languages": {
        skills: ["swift", "c", "objective-c", "java", "kotlin", "c#", "go", "python", "javascript", "html5", "css", "php", "sql", "ruby", ".net", "r", "lua"],
        description: "Crafting efficient code across multiple platforms",
        specificDescriptions: {
          "javascript": "Building interactive web applications with modern JavaScript",
          "python": "Developing scalable solutions with Python's versatile ecosystem",
          "java": "Engineering robust, enterprise-grade applications",
          "c#": "Creating Windows and cross-platform applications with .NET",
          "swift": "Crafting intuitive iOS and macOS applications",
          "kotlin": "Building modern Android applications with type safety",
          "go": "Developing high-performance, concurrent systems",
          "ruby": "Creating elegant web applications with Ruby on Rails",
          "php": "Building dynamic web applications and APIs",
          "c": "Programming high-performance systems and embedded software",
          "c++": "Developing performance-critical applications and games",
          "r": "Analyzing data and creating statistical models",
          "typescript": "Building scalable applications with type safety",
          "rust": "Developing memory-safe, concurrent systems",
          "scala": "Building functional JVM applications",
          "objective-c": "Maintaining iOS and macOS legacy applications",
          "perl": "Automating system administration tasks",
          "shell": "Scripting automation for DevOps workflows",
          "sql": "Querying and managing relational databases",
          "lua": "Extending applications and game engines with scripting"
        }
      },
      // Frontend Development - Enhanced with specific framework descriptions
      "frontend": {
        skills: ["react", "vue.js", "angular", "sass", "less", "html5", "css", "javascript", "react.js", "typescript"],
        description: "Creating responsive and interactive user interfaces",
        specificDescriptions: {
          "react": "Building reusable UI components with React's virtual DOM",
          "react.js": "Building reusable UI components with React's virtual DOM",
          "vue.js": "Developing progressive web interfaces with Vue's reactive system",
          "angular": "Creating enterprise-grade SPAs with Angular's comprehensive framework",
          "svelte": "Building high-performance applications with compiled components",
          "next.js": "Creating server-side rendered React applications",
          "nuxt.js": "Building server-side rendered Vue applications",
          "sass": "Writing maintainable CSS with extended functionality",
          "less": "Creating organized stylesheets with dynamic CSS preprocessing",
          "typescript": "Enhancing JavaScript with static type checking"
        }
      },
      
      // Backend Development - Enhanced with specific framework descriptions
      "backend": {
        skills: ["node.js", "django", "flask", "ruby on rails", "express.js", "asp.net", "java", "python", "php"],
        description: "Building robust server-side applications",
        specificDescriptions: {
          "node.js": "Creating scalable, event-driven backends with JavaScript",
          "express.js": "Building flexible web APIs with Node.js",
          "django": "Developing feature-rich web applications following Python's batteries-included approach",
          "flask": "Creating lightweight, customizable web services in Python",
          "ruby on rails": "Building feature-rich web applications following convention over configuration",
          "asp.net": "Developing enterprise-grade applications on Microsoft's platform",
          "spring boot": "Creating production-ready Java applications with minimal configuration",
          "laravel": "Building elegant web applications with PHP's MVC framework",
          "fastapi": "Developing high-performance Python APIs with automatic docs"
        }
      },
      
      // Databases - Enhanced with specific database descriptions
      "database": {
        skills: ["mysql", "postgresql", "mongodb", "redis", "sql", "database management", "olap", "data cube technology"],
        description: "Managing and optimizing database systems",
        specificDescriptions: {
          "mysql": "Managing relational databases with the world's most popular open-source database",
          "postgresql": "Developing with the advanced, extensible open-source relational database",
          "mongodb": "Building applications with flexible, document-based NoSQL databases",
          "redis": "Implementing high-performance caching and real-time data stores",
          "sqlite": "Embedding lightweight, self-contained databases into applications",
          "oracle": "Managing enterprise-grade databases with advanced features",
          "sql server": "Developing with Microsoft's comprehensive database platform",
          "dynamodb": "Building serverless applications with AWS's managed NoSQL database",
          "elasticsearch": "Implementing powerful, distributed search and analytics engines",
          "cassandra": "Creating scalable, distributed NoSQL database systems"
        }
      },
      // APIs and Integration
      "api": {
        skills: ["restful api design", "graphql", "api integration"],
        description: "Connecting systems with seamless data exchange"
      },
      // DevOps
      "devops": {
        skills: ["nginx", "apache", "git", "docker", "kubernetes", "jenkins", "aws", "azure", "google cloud", "ibm cloud", "cloud infrastructure", "containerization", "serverless computing", "aws lambda", "azure functions", "github"],
        description: "Streamlining development and deployment processes"
      },
      // Data Science
      "data_science": {
        skills: ["data analysis", "data preprocessing", "feature engineering", "supervised learning", "unsupervised learning", "deep learning", "natural language processing", "computer vision", "model evaluation", "cross-validation", "hyperparameter tuning", "ensemble learning", "time series analysis", "reinforcement learning", "dimensionality reduction", "data visualization", "tensorflow", "pytorch", "scikit-learn", "jupyter notebooks", "machine learning", "statistical analysis", "tableau", "power bi", "matlab", "sas", "nlp"],
        description: "Extracting insights from complex data sets"
      },
      // Mobile Development
      "mobile": {
        skills: ["android", "ios", "swift", "kotlin", "react native", "flutter", "android/ios software development kit", "android/ios ux and ui", "xcode development"],
        description: "Building engaging mobile applications"
      },
      // Game Development
      "game": {
        skills: ["game design", "game mechanics", "storytelling", "2d game development", "3d game development", "unity", "unreal engine"],
        description: "Creating immersive gaming experiences"
      },
      // Security
      "security": {
        skills: ["network security", "network protocols", "firewalls", "virtual private networks", "vulnerability assessment", "penetration testing", "cloud security", "malware analysis", "intrusion detection", "ceh", "oscp", "cisa", "gcih"],
        description: "Protecting systems and data from security threats"
      },
      // E-commerce
      "ecommerce": {
        skills: ["shopify", "woocommerce", "bigcommerce", "magento", "opencart"],
        description: "Building and optimizing online shopping platforms"
      }
    }
  },
  
  // Project Management
  "Project Management": {
    defaultDescription: "Guiding projects from conception to completion",
    skills: ["project planning and scheduling", "project budgeting", "cost management", "risk management", "project documentation", "project charters", "stakeholder communication plans", "change management", "project closure and evaluation"],
    subCategories: {
      "agile": {
        skills: ["scrum", "agile", "sprint planning", "kanban", "jira", "scrum manager", "agile product manager"],
        description: "Implementing adaptive and iterative project approaches"
      }
    }
  },
  
  // Digital Marketing
  "Digital Marketing": {
    defaultDescription: "Driving brand growth through digital channels",
    skills: ["search engine optimization (seo)", "search engine marketing (sem)", "google ads", "social media marketing", "content marketing", "blog writing", "a/b testing", "marketing automation", "conversion rate optimization (cro)", "user experience (ux) optimization", "influencer marketing"],
    subCategories: {
      "content": {
        skills: ["content marketing", "blog writing", "content strategy"],
        description: "Creating engaging content that connects with audiences"
      },
      "social": {
        skills: ["social media marketing", "influencer marketing", "community management"],
        description: "Building brand presence across social platforms"
      },
      "seo": {
        skills: ["search engine optimization (seo)", "search engine marketing (sem)", "google ads"],
        description: "Optimizing online visibility and search rankings"
      }
    }
  },
  
  // Design
  "Graphic Design": {
    defaultDescription: "Creating visual elements that communicate and inspire",
    skills: ["adobe photoshop", "illustrator", "indesign", "figma", "typography", "layout design", "color theory", "visual brand identities", "illustration", "custom graphics", "image editing and retouching", "print design", "user interface (ui) design", "web design"],
    subCategories: {
      "branding": {
        skills: ["visual brand identities", "logo design", "brand guidelines"],
        description: "Developing consistent and memorable brand identities"
      }
    }
  },
  
  // UI/UX Design
  "UI/UX Design": {
    defaultDescription: "Crafting intuitive and delightful user experiences",
    skills: ["user interviews", "surveys and questionnaires", "usability testing", "information design", "wireframing", "interaction design", "prototyping", "adobe xd", "sketch", "figma", "invision", "typography and layout", "heatmaps: microsoft clarity, hotjar, crazy egg", "data analysis", "google analytics", "mixpanel", "responsive design", "accessibility design"],
    subCategories: {
      "research": {
        skills: ["user interviews", "surveys and questionnaires", "usability testing", "heatmaps"],
        description: "Understanding user needs through research and testing"
      },
      "interaction": {
        skills: ["interaction design", "prototyping", "wireframing"],
        description: "Designing seamless user interactions and flows"
      }
    }
  },
  
  // Sales
  "Sales": {
    defaultDescription: "Driving revenue growth through relationship building",
    skills: ["communication", "negotiation", "listening", "product knowledge", "problem solving", "time management", "relationship building", "resilience", "adaptability", "technology proficiency", "presentation skills", "strategic thinking", "follow-up", "empathy", "closing skills", "networking", "data analysis", "market knowledge", "multilingual skills", "industry knowledge"],
    subCategories: {
      "negotiation": {
        skills: ["negotiation", "closing skills"],
        description: "Securing mutually beneficial agreements"
      },
      "relationship": {
        skills: ["relationship building", "empathy", "listening", "networking"],
        description: "Building and nurturing valuable client relationships"
      }
    }
  },
  
  // Product Management
  "Product Manager": {
    defaultDescription: "Guiding product strategy and development",
    skills: ["product roadmap", "user stories", "market research", "product lifecycle", "stakeholder management", "feature prioritization", "agile methodologies", "product analytics", "competitive analysis", "user testing"],
    subCategories: {
      "technical": {
        skills: ["technical product manager", "algorithm product manager", "iot product manager", "technical architect"],
        description: "Bridging business needs with technical implementation"
      },
      "growth": {
        skills: ["growth product manager", "product marketing manager", "product positioning manager"],
        description: "Driving product adoption and business growth"
      },
      "ux": {
        skills: ["ux product manager"],
        description: "Creating products with exceptional user experiences"
      }
    }
  }
};

/**
 * Get a description for a given skill
 * 
 * @param {string} skill - The skill to get a description for
 * @returns {string} - A contextual description of the skill
 */
export function getSkillDescription(skill) {
  if (!skill) return "Technical expertise and specialized knowledge";
  
  const skillLower = skill.toLowerCase();
  
  // First check for specific programming language descriptions
  for (const categoryKey in skillCategories) {
    const category = skillCategories[categoryKey];
    
    if (category.subCategories) {
      // Check each subcategory for specific descriptions
      for (const subCategoryKey in category.subCategories) {
        const subCategory = category.subCategories[subCategoryKey];
        
        // First check if there are specific descriptions for this subcategory
        if (subCategory.specificDescriptions) {
          for (const specificSkill in subCategory.specificDescriptions) {
            if (skillLower.includes(specificSkill.toLowerCase())) {
              return subCategory.specificDescriptions[specificSkill];
            }
          }
        }
        
        // If no specific description matched, check general subcategory match
        if (subCategory.skills && subCategory.skills.some(s => skillLower.includes(s.toLowerCase()))) {
          return subCategory.description;
        }
      }
    }
    
    // Check main category skills
    if (category.skills && category.skills.some(s => skillLower.includes(s.toLowerCase()))) {
      return category.defaultDescription;
    }
  }
  
  // Special cases and common skills
  if (skillLower.includes('oracle') || skillLower.includes('database')) {
    return "Managing and optimizing Oracle database systems";
  }
  
  if (skillLower.includes('cloud') || skillLower.includes('aws') || skillLower.includes('azure')) {
    return "Building and managing cloud infrastructure";
  }
  
  if (skillLower.includes('ai') || skillLower.includes('machine learning')) {
    return "Implementing artificial intelligence solutions";
  }
  
  // Fallback for unknown skills
  return "Applying specialized knowledge to solve complex problems";
}

/**
 * Get an emoji icon for a given skill category
 * 
 * @param {string} skill - The skill to get an emoji for
 * @returns {string} - An appropriate emoji for the skill
 */
export function getSkillEmoji(skill) {
  if (!skill) return "🔧";
  
  const skillLower = skill.toLowerCase();
  
  // Programming languages
  if (skillLower.includes('python') || skillLower.includes('java') || 
      skillLower.includes('javascript') || skillLower.includes('c++') || 
      skillLower.includes('ruby') || skillLower.includes('go') || 
      skillLower.includes('php') || skillLower.includes('swift') || 
      skillLower.includes('kotlin')) {
    return "👨‍💻";
  }
  
  // Data science & Analytics
  if (skillLower.includes('data') || skillLower.includes('analytics') || 
      skillLower.includes('machine learning') || skillLower.includes('ai') || 
      skillLower.includes('statistics') || skillLower.includes('tensorflow') || 
      skillLower.includes('pytorch')) {
    return "📊";
  }
  
  // Design
  if (skillLower.includes('design') || skillLower.includes('ui') || 
      skillLower.includes('ux') || skillLower.includes('figma') || 
      skillLower.includes('sketch') || skillLower.includes('photoshop') || 
      skillLower.includes('illustrator')) {
    return "🎨";
  }
  
  // Cloud & DevOps
  if (skillLower.includes('cloud') || skillLower.includes('aws') || 
      skillLower.includes('azure') || skillLower.includes('devops') || 
      skillLower.includes('docker') || skillLower.includes('kubernetes') || 
      skillLower.includes('jenkins')) {
    return "☁️";
  }
  
  // Databases
  if (skillLower.includes('sql') || skillLower.includes('database') || 
      skillLower.includes('mongodb') || skillLower.includes('mysql') || 
      skillLower.includes('postgresql') || skillLower.includes('oracle')) {
    return "🗄️";
  }
  
  // Web development
  if (skillLower.includes('web') || skillLower.includes('html') || 
      skillLower.includes('css') || skillLower.includes('react') || 
      skillLower.includes('angular') || skillLower.includes('vue')) {
    return "🌐";
  }
  
  // Mobile development
  if (skillLower.includes('android') || skillLower.includes('ios') || 
      skillLower.includes('mobile') || skillLower.includes('react native') || 
      skillLower.includes('flutter')) {
    return "📱";
  }
  
  // Project management
  if (skillLower.includes('project') || skillLower.includes('agile') || 
      skillLower.includes('scrum') || skillLower.includes('management') || 
      skillLower.includes('product')) {
    return "📋";
  }
  
  // Security
  if (skillLower.includes('security') || skillLower.includes('hacking') || 
      skillLower.includes('firewall') || skillLower.includes('encryption') || 
      skillLower.includes('penetration testing')) {
    return "🔒";
  }
  
  // Marketing
  if (skillLower.includes('marketing') || skillLower.includes('seo') || 
      skillLower.includes('content') || skillLower.includes('social media') || 
      skillLower.includes('email marketing')) {
    return "📣";
  }
  
  // Sales
  if (skillLower.includes('sales') || skillLower.includes('negotiation') || 
      skillLower.includes('closing') || skillLower.includes('presentation')) {
    return "🤝";
  }
  
  // Integration
  if (skillLower.includes('integration') || skillLower.includes('api') || 
      skillLower.includes('microservices') || skillLower.includes('connecting')) {
    return "🔄";
  }
  
  // Game development
  if (skillLower.includes('game') || skillLower.includes('unity') || 
      skillLower.includes('unreal')) {
    return "🎮";
  }
  
  // Analytics/Technical skills (general fallback)
  return "🔧";
}

export default { getSkillDescription, getSkillEmoji };