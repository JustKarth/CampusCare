const pool = require('../config/database');
const User = require('../models/User');

/**
 * AI Guide Controller
 * Handles conversational queries over CampusCare data:
 * - Academic Resources (Notes, syllabus, department drives)
 * - Campus Transit & Fares (Auto/rickshaw benchmarks, routes)
 * - Local Guide (Food, health, hangouts, services with distance & ratings)
 * - Community Blogs & Experiences
 * - Profile & Academic Help
 */

// Quick suggestions for students
const getSuggestions = async (req, res) => {
  try {
    const suggestions = [
      '🛺 What is the auto fare from campus to Railway Station?',
      '📖 Where can I find Computer Science study materials?',
      '🍕 Recommend good food spots near MNNIT',
      '🏥 Which hospitals or clinics are closest to campus?',
      '✍️ What are students sharing in recent blogs?',
      '👤 How do I update my profile details or avatar?'
    ];
    res.json({ success: true, suggestions });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch suggestions' });
  }
};

// Main chat query handler
const chat = async (req, res) => {
  try {
    const { message, history = [] } = req.body;
    if (!message || !message.trim()) {
      return res.status(400).json({ success: false, message: 'Message is required.' });
    }

    const userId = req.user.userId;
    const userDetails = await User.findByIdWithDetails(userId);
    const collegeId = userDetails ? userDetails.college_id : 1;
    const collegeName = userDetails ? userDetails.college_name : 'MNNIT Allahabad';
    const studentName = userDetails ? userDetails.first_name : 'Student';

    const cleanMsg = message.trim().toLowerCase();

    // 1. Fetch relevant database context
    const [resources] = await pool.execute(
      'SELECT resource_title, resource_description, resource_link FROM academic_resources WHERE college_id = ?',
      [collegeId]
    );

    const [places] = await pool.execute(
      `SELECT p.place_name, p.place_description, p.address, p.distance, p.phone, c.category_name,
              COALESCE(AVG(r.rating), 0) as avg_rating, COUNT(r.user_id) as review_count
       FROM places p
       JOIN local_guide_categories c ON p.category_id = c.category_id
       LEFT JOIN place_rating r ON p.place_id = r.place_id
       WHERE p.college_id = ?
       GROUP BY p.place_id`,
      [collegeId]
    );

    const [fares] = await pool.execute(
      `SELECT from_place_name as from_location, to_place_name as to_location,
              vehicle_type, notes as time_of_day, fare_amount
       FROM fares
       WHERE college_id = ?
       ORDER BY fare_id DESC LIMIT 40`,
      [collegeId]
    );

    const [blogs] = await pool.execute(
      `SELECT b.blog_id, b.blog_title, SUBSTRING(b.blog_content, 1, 140) as preview, u.first_name
       FROM blog b
       JOIN user_profiles u ON b.user_id = u.user_id
       WHERE b.college_id = ?
       ORDER BY b.created_at DESC LIMIT 5`,
      [collegeId]
    );

    const [courses] = await pool.execute(
      'SELECT course_name FROM courses WHERE college_id = ?',
      [collegeId]
    );

    // 2. Check if GEMINI_API_KEY is available in environment
    if (process.env.GEMINI_API_KEY) {
      try {
        const geminiResponse = await callGeminiLLM({
          apiKey: process.env.GEMINI_API_KEY,
          message,
          history,
          studentName,
          collegeName,
          resources,
          places,
          fares,
          blogs,
          courses
        });

        if (geminiResponse) {
          return res.json({
            success: true,
            reply: geminiResponse.text,
            actions: geminiResponse.actions || []
          });
        }
      } catch (geminiErr) {
        console.warn('Gemini API call error, falling back to embedded domain engine:', geminiErr.message);
      }
    }

    // 3. Embedded Smart Domain Engine (Fallback or Default)
    const response = evaluateDomainQuery({
      cleanMsg,
      rawMsg: message,
      studentName,
      collegeName,
      resources,
      places,
      fares,
      blogs,
      courses
    });

    return res.json({
      success: true,
      reply: response.reply,
      actions: response.actions || []
    });

  } catch (error) {
    console.error('AI Guide chat error:', error);
    res.status(500).json({
      success: false,
      message: 'AI Guide encountered an error answering your question. Please try again.'
    });
  }
};

/**
 * Embedded Smart Domain Engine
 * Evaluates queries against live MySQL database data
 */
function evaluateDomainQuery({ cleanMsg, rawMsg, studentName, collegeName, resources, places, fares, blogs, courses }) {
  const actions = [];

  // 1. CONVERSATIONAL & CHATGPT-LIKE EXPANDED INTELLIGENCE

  // G1. Chit-chat & Greetings
  if (cleanMsg === 'hi' || cleanMsg === 'hello' || cleanMsg === 'hey' || cleanMsg === 'hii' || cleanMsg.startsWith('hi ') || cleanMsg.startsWith('hello ') || cleanMsg.startsWith('hey ')) {
    return {
      reply: `Hey ${studentName}! 😊 Great to chat with you.\n\nI'm **AI Guide**, your personal campus assistant for **${collegeName}**. Think of me like ChatGPT, but specially trained on everything happening around campus!\n\nHere are some things you can ask me:\n• *"What's the auto fare to Railway Station?"*\n• *"Where can I get CSE notes and past exam papers?"*\n• *"Recommend good food spots near Teliyarganj"*\n• *"How should I prepare for semester exams?"*\n• *"Tell me how to start learning Data Structures"*\n\nHow's your day going? What can I help you with today?`,
      actions: [
        { label: 'Fare Calculator', path: '/fare-analysis', icon: '🛺' },
        { label: 'Study Resources', path: '/resources', icon: '📖' },
        { label: 'Local Food Spots', path: '/local-guide', icon: '🍕' }
      ]
    };
  }

  if (cleanMsg.includes('how are you') || cleanMsg.includes('how r u') || cleanMsg.includes('whats up') || cleanMsg.includes("what's up")) {
    return {
      reply: `I'm doing fantastic, ${studentName}! Thanks for asking. 😄\n\nI'm here and ready to help you navigate campus life, find study materials, check ride fares, or even talk about your engineering coursework.\n\nWhat's on your mind right now?`,
      actions: [
        { label: 'Fare Calculator', path: '/fare-analysis', icon: '🛺' },
        { label: 'Study Notes', path: '/resources', icon: '📖' }
      ]
    };
  }

  if (cleanMsg.includes('who are you') || cleanMsg.includes('what are you') || cleanMsg.includes('what can you do')) {
    return {
      reply: `I am **AI Guide** 🤖 — your smart AI companion built directly into CampusCare.\n\n### Here's what I can do for you:\n1. 🛺 **Transit & Fares:** Give you verified auto, tempo, and e-rickshaw fares around Prayagraj to prevent getting overcharged.\n2. 📖 **Academic Resources:** Provide direct Google Drive links to subject notes, syllabus, and previous year exam questions.\n3. 🍕 **Local Recommendations:** Recommend top-rated eateries, tea stalls, pharmacies, and hangouts around campus with live ratings.\n4. ✍️ **Student Experiences:** Share insights from student blogs, seniors' tips, and campus culture.\n5. 💡 **Study & Tech Help:** Answer academic questions, give study advice, explain coding concepts, and guide you through college life.\n\nFeel free to ask me anything!`,
      actions: [
        { label: 'Study Drives', path: '/resources', icon: '📖' },
        { label: 'Fare Rates', path: '/fare-analysis', icon: '🛺' },
        { label: 'Local Guide', path: '/local-guide', icon: '📍' }
      ]
    };
  }

  if (cleanMsg.includes('thank') || cleanMsg.includes('thx') || cleanMsg.includes('thanks')) {
    return {
      reply: `You're very welcome, ${studentName}! Happy to help anytime. 🚀\n\nIf you ever need anything else — whether it's finding a place to eat or studying for your next quiz — just ping me!`,
      actions: []
    };
  }

  if (cleanMsg.includes('joke') || cleanMsg.includes('make me laugh')) {
    const jokes = [
      `Why do programmers prefer dark mode?\n\nBecause light attracts bugs! 🐛😄`,
      `There are 10 types of people in the world:\n\nThose who understand binary, and those who don't! 💻`,
      `Why was the JavaScript developer sad?\n\nBecause they didn't 'null' their emotions and kept getting 'undefined' feelings! 😂`,
      `A SQL query walks into a bar, walks up to two tables and asks...\n\n*"Can I join you?"* 🍻`
    ];
    const picked = jokes[Math.floor(Math.random() * jokes.length)];
    return {
      reply: `${picked}\n\nNeed any help with your actual coursework or college stuff now?`,
      actions: [{ label: 'Study Resources', path: '/resources', icon: '📖' }]
    };
  }

  // G2. Tips for Freshers / First Year
  if (cleanMsg.includes('fresher') || cleanMsg.includes('first year') || cleanMsg.includes('1st year') || cleanMsg.includes('new student')) {
    return {
      reply: `Welcome to **${collegeName}**! 🎓 Here is essential advice every fresher should know:

1. **Academic Foundation:** Your 1st year CGPA is the easiest to build and hardest to pull up later. Aim for **8.0+** early on!
2. **Explore Clubs & Activities:** Join technical clubs (Robotics, Coding, Aero) and cultural clubs in your first semester to build your network and soft skills.
3. **Getting Around:** Never pay more than ₹20–₹30 for shared autos to Civil Lines. Check our **Fare Calculator** before heading out!
4. **Food & Hangouts:** Teliyarganj market right outside the gate has affordable stationery, snacks, and printout shops.
5. **Seniors are your best resource:** Don't hesitate to reach out for guidance on subjects, professors, and projects.

Feel free to ask me for 1st-year notes or local recommendations!`,
      actions: [
        { label: 'First Year Drives', path: '/resources', icon: '📖' },
        { label: 'Campus Fares', path: '/fare-analysis', icon: '🛺' }
      ]
    };
  }

  // G3. Exam Preparation & CGPA Strategy
  if (cleanMsg.includes('exam') || cleanMsg.includes('midsem') || cleanMsg.includes('endsem') || cleanMsg.includes('study tip') || cleanMsg.includes('cgpa') || cleanMsg.includes('prepare') || cleanMsg.includes('how to study')) {
    return {
      reply: `Here is a proven strategy for acing semester exams at **${collegeName}**:

### 🎯 1. Master the Previous Year Papers (PYQs)
At MNNIT, professors often repeat concepts and question structures from the past 3–5 years. Solve at least 3 years of PYQs before entering the exam hall.

### 📚 2. Use Class Notes & Teacher Slides First
Most exam questions are directly grounded in what was covered on the board or in department slides. Check our **Resources** tab for shared Google Drive folders with batch notes.

### ⏱️ 3. The 80/20 Rule for Engineering
Focus 80% of your energy on the 20% of high-weightage topics (derivations, standard algorithms, numerical formulas).

### 💡 4. Maintain Consistent Attendance
Aim for above 75% attendance so you don't face debarment issues or stress during admit card generation.

Would you like direct links to notes for your specific branch? Just tell me your department (e.g. CSE, ECE, Mechanical)!`,
      actions: [
        { label: 'Access Branch Notes', path: '/resources', icon: '📖' }
      ]
    };
  }

  // G4. Placements, Coding, & Internships
  if (cleanMsg.includes('placement') || cleanMsg.includes('internship') || cleanMsg.includes('dsa') || cleanMsg.includes('coding') || cleanMsg.includes('leetcode')) {
    return {
      reply: `Here is a recommended roadmap for tech placements & internships:

### 1. Language Mastery (Choose C++ or Java)
• Master OOP concepts, pointers/memory, and standard library (C++ STL or Java Collections).

### 2. Data Structures & Algorithms (Core)
• **Beginner:** Arrays, Strings, Recursion, Sorting, Binary Search.
• **Intermediate:** Linked Lists, Stacks, Queues, Binary Trees, BSTs.
• **Advanced:** Heaps, Graphs (BFS/DFS, Dijkstra), Dynamic Programming (1D & 2D).

### 3. Core CS Subjects (Mandatory for technical rounds)
• Operating Systems (Processes, Threads, Deadlocks, Virtual Memory)
• DBMS (SQL queries, Normalization, ACID properties, Indexing)
• Computer Networks (OSI layers, TCP/UDP, IP addressing, HTTP/HTTPS)

### 4. Projects
• Build 2 quality full-stack or systems projects with clean Git commits and live deployment.

Start solving 2–3 problems daily on LeetCode or GeeksforGeeks! Need notes on OS or DBMS?`,
      actions: [{ label: 'Study Resources', path: '/resources', icon: '📖' }]
    };
  }

  // G5. Technical Concept Explanations
  if (cleanMsg.includes('time complexity') || cleanMsg.includes('big o')) {
    return {
      reply: `**Time Complexity** describes how the runtime of an algorithm scales as the input size ($n$) increases:

• **$O(1)$ — Constant Time:** Runtime doesn't depend on input size (e.g., accessing an array index \`arr[0]\`).
• **$O(\\log n)$ — Logarithmic Time:** Problem size is halved at each step (e.g., **Binary Search**).
• **$O(n)$ — Linear Time:** Directly proportional to elements (e.g., single loop scanning an array).
• **$O(n \\log n)$ — Linearithmic Time:** Typical for efficient comparison sorting (e.g., **Merge Sort**, **Heap Sort**).
• **$O(n^2)$ — Quadratic Time:** Nested loops over data (e.g., **Bubble Sort**, brute force pair checking).
• **$O(2^n)$ — Exponential Time:** Recursive doubling (e.g., naive recursive Fibonacci).

Always aim for $O(n \\log n)$ or better for competitive programming and interview problems!`,
      actions: []
    };
  }

  if (cleanMsg.includes('binary search')) {
    return {
      reply: `### Binary Search Explained 🔍

**Binary Search** is an efficient algorithm to find a target value in a **sorted array** in **$O(\\log n)$** time:

1. Look at the middle element: \`mid = low + (high - low) / 2\`
2. If \`arr[mid] == target\`, you've found it!
3. If \`target < arr[mid]\`, narrow search to the left half (\`high = mid - 1\`).
4. If \`target > arr[mid]\`, narrow search to the right half (\`low = mid + 1\`).

**Key condition:** The array **MUST be sorted**! It's exponentially faster than linear scan ($O(n)$) for large inputs.`,
      actions: []
    };
  }

  if (cleanMsg.includes('hostel') || cleanMsg.includes('mess') || cleanMsg.includes('room')) {
    return {
      reply: `Here are quick tips for hostel life at **${collegeName}**:

• **Mess Food:** If the mess menu doesn't suit your taste on a particular day, Teliyarganj has great affordable food joints like Pandit Ji Canteen, Sai Fast Food, and roadside chaat.
• **Laundry & Essentials:** Local laundry services visit hostels weekly. Keep a small electric kettle and basic first-aid supplies handy in your room.
• **Late Night Study:** The central library and hostel study rooms are open late during midsem and endsem weeks.
• **Hostel WiFi/LAN:** Make sure to register your MAC address with the campus computer center to get full-speed LAN access.`,
      actions: [
        { label: 'Nearby Food Spots', path: '/local-guide', icon: '🍕' },
        { label: 'Campus Fares', path: '/fare-analysis', icon: '🛺' }
      ]
    };
  }

  // 2. TRANSIT & FARE ANALYSIS
  const transitKeywords = ['fare', 'auto', 'rickshaw', 'tempo', 'taxi', 'station', 'junction', 'subedarganj', 'civil lines', 'sangam', 'distance', 'travel', 'price', 'rate', 'cost', 'how much'];
  const isTransit = transitKeywords.some(kw => cleanMsg.includes(kw));

  if (isTransit) {
    let matchedFares = [];
    let target = '';

    if (cleanMsg.includes('junction') || cleanMsg.includes('prayagraj jn') || cleanMsg.includes('station') || cleanMsg.includes('railway')) {
      target = 'Prayagraj Junction';
      matchedFares = fares.filter(f => (f.to_location || '').toLowerCase().includes('junction') || (f.to_location || '').toLowerCase().includes('station'));
    } else if (cleanMsg.includes('subedarganj')) {
      target = 'Subedarganj Railway Station';
      matchedFares = fares.filter(f => (f.to_location || '').toLowerCase().includes('subedarganj'));
    } else if (cleanMsg.includes('civil lines')) {
      target = 'Civil Lines';
      matchedFares = fares.filter(f => (f.to_location || '').toLowerCase().includes('civil lines'));
    } else if (cleanMsg.includes('sangam')) {
      target = 'Sangam';
      matchedFares = fares.filter(f => (f.to_location || '').toLowerCase().includes('sangam'));
    } else {
      matchedFares = fares.slice(0, 5);
    }

    actions.push({
      label: 'Open Fare Calculator',
      path: '/fare-analysis',
      icon: '🛺',
      destination: target || 'Prayagraj Junction'
    });

    if (matchedFares.length > 0) {
      const amounts = matchedFares.map(f => Number(f.fare_amount)).filter(n => !isNaN(n));
      const minFare = Math.min(...amounts);
      const maxFare = Math.max(...amounts);
      const avgFare = Math.round(amounts.reduce((a, b) => a + b, 0) / amounts.length);

      let text = `Here are the verified transit rates from **${collegeName}**${target ? ` to **${target}**` : ''}:\n\n`;
      text += `• **Expected Range:** ₹${minFare} – ₹${maxFare} (Average: ₹${avgFare})\n`;
      text += `• **Typical Vehicles:** Auto Rickshaw, E-Rickshaw, Sharing Tempo\n\n`;
      text += `**Recent Community Reports:**\n`;
      matchedFares.slice(0, 3).forEach(f => {
        text += `• From *${f.from_location}* to *${f.to_location}*: **₹${f.fare_amount}** via ${f.vehicle_type} (${f.time_of_day || 'Day'})\n`;
      });
      text += `\n💡 *Tip: You can use our Fare Analysis map to plan routes and check live distance calculations.*`;
      return { reply: text, actions };
    }

    return {
      reply: `For travel around ${collegeName}, typical auto fares range between ₹20–₹40 for shared rides to Civil Lines, and ₹80–₹150 for direct autos to Prayagraj Junction or Subedarganj. You can calculate the exact fare and view the interactive map using our Fare Calculator!`,
      actions
    };
  }

  // 3. ACADEMIC RESOURCES & NOTES
  const academicKeywords = ['notes', 'resource', 'study material', 'syllabus', 'drive', 'pyq', 'past paper', 'question paper'];
  const isAcademic = academicKeywords.some(kw => cleanMsg.includes(kw)) ||
    /\b(cse|ece|electrical|mechanical|civil|chemical|biotech|pie)\b/i.test(cleanMsg);

  if (isAcademic) {
    actions.push({
      label: 'Browse Academic Resources',
      path: '/resources',
      icon: '📖'
    });

    let matchedResource = null;
    if (cleanMsg.includes('computer') || /\b(cse|coding)\b/i.test(cleanMsg)) {
      matchedResource = resources.find(r => r.resource_title.toLowerCase().includes('computer'));
    } else if (cleanMsg.includes('electronic') || /\b(ece)\b/i.test(cleanMsg)) {
      matchedResource = resources.find(r => r.resource_title.toLowerCase().includes('electronic'));
    } else if (cleanMsg.includes('electrical') || /\b(ee)\b/i.test(cleanMsg)) {
      matchedResource = resources.find(r => r.resource_title.toLowerCase().includes('electrical'));
    } else if (cleanMsg.includes('mechanical') || /\b(me|mech)\b/i.test(cleanMsg)) {
      matchedResource = resources.find(r => r.resource_title.toLowerCase().includes('mechanical'));
    } else if (cleanMsg.includes('civil') || /\b(ce)\b/i.test(cleanMsg)) {
      matchedResource = resources.find(r => r.resource_title.toLowerCase().includes('civil'));
    } else if (cleanMsg.includes('chemical') || /\b(ched)\b/i.test(cleanMsg)) {
      matchedResource = resources.find(r => r.resource_title.toLowerCase().includes('chemical'));
    } else if (cleanMsg.includes('biotech')) {
      matchedResource = resources.find(r => r.resource_title.toLowerCase().includes('biotech'));
    } else if (cleanMsg.includes('first year') || cleanMsg.includes('1st year') || cleanMsg.includes('fresher')) {
      matchedResource = resources.find(r => r.resource_title.toLowerCase().includes('first year'));
    }

    if (matchedResource) {
      let text = `Here are the academic study resources for **${matchedResource.resource_title}**:\n\n`;
      text += `📄 **Description:** ${matchedResource.resource_description}\n`;
      text += `🔗 **Direct Folder Link:** [Access Google Drive Folder](${matchedResource.resource_link})\n\n`;
      text += `You can also access all branches and open electives on the **Resources** page.`;
      return { reply: text, actions };
    }

    let text = `CampusCare provides curated academic study drives across all departments at **${collegeName}**:\n\n`;
    resources.slice(0, 5).forEach(r => {
      text += `• **${r.resource_title}**: [Open Folder](${r.resource_link})\n`;
    });
    text += `\nClick below to access the full repository of previous year papers, subject notes, and slides!`;
    return { reply: text, actions };
  }

  // C. LOCAL GUIDE (Food, Healthcare, Hangouts, Shops)
  const placeKeywords = ['food', 'eat', 'restaurant', 'cafe', 'hospital', 'clinic', 'doctor', 'medicine', 'arcade', 'cinema', 'movie', 'shopping', 'store', 'hangout', 'hostel', 'spots', 'places', 'local guide', 'visit'];
  const isPlace = placeKeywords.some(kw => cleanMsg.includes(kw));

  if (isPlace) {
    actions.push({
      label: 'Explore Local Guide',
      path: '/local-guide',
      icon: '📍'
    });

    let filtered = places;
    let category = '';

    if (cleanMsg.includes('food') || cleanMsg.includes('eat') || cleanMsg.includes('cafe') || cleanMsg.includes('restaurant')) {
      category = 'Food';
      filtered = places.filter(p => p.category_name.toLowerCase().includes('food'));
    } else if (cleanMsg.includes('hospital') || cleanMsg.includes('doctor') || cleanMsg.includes('health') || cleanMsg.includes('clinic')) {
      category = 'Healthcare';
      filtered = places.filter(p => p.category_name.toLowerCase().includes('health'));
    } else if (cleanMsg.includes('hangout') || cleanMsg.includes('hotspot') || cleanMsg.includes('visit')) {
      category = 'Local Hotspots';
      filtered = places.filter(p => p.category_name.toLowerCase().includes('hotspot') || p.category_name.toLowerCase().includes('arcade') || p.category_name.toLowerCase().includes('cinema'));
    }

    if (filtered.length > 0) {
      let text = `Here are popular ${category ? `**${category}** ` : ''}recommendations near **${collegeName}**:\n\n`;
      filtered.slice(0, 4).forEach(p => {
        const ratingStr = p.avg_rating > 0 ? ` ⭐ ${Number(p.avg_rating).toFixed(1)}/5` : '';
        const distStr = p.distance ? ` (${p.distance} km)` : '';
        text += `• **${p.place_name}**${distStr}${ratingStr}\n  *${p.place_description || p.address}*\n`;
      });
      text += `\nYou can filter by categories, read student reviews, and get ride fares directly on the **Local Guide** tab.`;
      return { reply: text, actions };
    }

    return {
      reply: `Our Local Guide covers the best food joints, medical centers, tech repair shops, and weekend hangouts around campus. Click below to view all locations on the interactive map!`,
      actions
    };
  }

  // D. COMMUNITY BLOGS & DISCUSSIONS
  const blogKeywords = ['blog', 'post', 'article', 'senior', 'experience', 'discussion', 'culture', 'fest', 'event', 'club'];
  const isBlog = blogKeywords.some(kw => cleanMsg.includes(kw));

  if (isBlog) {
    actions.push({
      label: 'Read Student Blogs',
      path: '/blogs',
      icon: '✍️'
    });

    let text = `Here are some active student blog discussions from the **${collegeName}** community:\n\n`;
    if (blogs.length > 0) {
      blogs.forEach(b => {
        text += `• **${b.blog_title}** by ${b.first_name || 'Student'}\n  "${b.preview}..."\n`;
      });
    } else {
      text += `No recent blog entries found yet. You can be the first to share your campus experiences!`;
    }
    return { reply: text, actions };
  }

  // E. PROFILE & ACCOUNT HELP
  const profileKeywords = ['profile', 'avatar', 'name', 'password', 'edit', 'reg no', 'registration number', 'account'];
  const isProfile = profileKeywords.some(kw => cleanMsg.includes(kw));

  if (isProfile) {
    actions.push({
      label: 'Edit Profile',
      path: '/profile',
      icon: '👤'
    });
    return {
      reply: `You can customize your profile anytime! Head over to the **Profile** page to:\n• Change your avatar (Fox, Eagle, Dragon, Serpent, Unicorn)\n• Edit personal info (Name, DOB, Native State, City)\n• Update academic info (Graduation year, Course, Registration Number)\n• Check your role permissions (Student, Moderator, Admin).`,
      actions
    };
  }

  // F. COURSES & ACADEMICS
  if (cleanMsg.includes('course') || cleanMsg.includes('branch') || cleanMsg.includes('degree') || cleanMsg.includes('b.tech') || cleanMsg.includes('m.tech')) {
    let text = `**${collegeName}** offers comprehensive undergraduate and postgraduate degree programs:\n\n`;
    courses.slice(0, 8).forEach(c => {
      text += `• ${c.course_name}\n`;
    });
    text += `\nNeed study notes for any of these branches? Check out the Resources section!`;
    actions.push({ label: 'View Resources', path: '/resources', icon: '📖' });
    return { reply: text, actions };
  }

  // G. CONVERSATIONAL & CHATGPT-LIKE EXPANDED INTELLIGENCE

  // G1. Chit-chat & Greetings
  if (cleanMsg === 'hi' || cleanMsg === 'hello' || cleanMsg === 'hey' || cleanMsg === 'hii' || cleanMsg.startsWith('hi ') || cleanMsg.startsWith('hello ')) {
    return {
      reply: `Hey ${studentName}! 😊 Great to chat with you.\n\nI'm **AI Guide**, your personal campus assistant for **${collegeName}**. Think of me like ChatGPT, but specially trained on everything happening around campus!\n\nHere are some things you can ask me:\n• *"What's the auto fare to Railway Station?"*\n• *"Where can I get CSE notes and past exam papers?"*\n• *"Recommend good food spots near Teliyarganj"*\n• *"How should I prepare for semester exams?"*\n• *"Tell me how to start learning Data Structures"*\n\nHow's your day going? What can I help you with today?`,
      actions: [
        { label: 'Fare Calculator', path: '/fare-analysis', icon: '🛺' },
        { label: 'Study Resources', path: '/resources', icon: '📖' },
        { label: 'Local Food Spots', path: '/local-guide', icon: '🍕' }
      ]
    };
  }

  if (cleanMsg.includes('how are you') || cleanMsg.includes('how r u') || cleanMsg.includes('whats up') || cleanMsg.includes("what's up")) {
    return {
      reply: `I'm doing fantastic, ${studentName}! Thanks for asking. 😄\n\nI'm here and ready to help you navigate campus life, find study materials, check ride fares, or even talk about your engineering coursework.\n\nWhat's on your mind right now?`,
      actions: [
        { label: 'Fare Calculator', path: '/fare-analysis', icon: '🛺' },
        { label: 'Study Notes', path: '/resources', icon: '📖' }
      ]
    };
  }

  if (cleanMsg.includes('who are you') || cleanMsg.includes('what are you') || cleanMsg.includes('what can you do')) {
    return {
      reply: `I am **AI Guide** 🤖 — your smart AI companion built directly into CampusCare.\n\n### Here's what I can do for you:\n1. 🛺 **Transit & Fares:** Give you verified auto, tempo, and e-rickshaw fares around Prayagraj to prevent getting overcharged.\n2. 📖 **Academic Resources:** Provide direct Google Drive links to subject notes, syllabus, and previous year exam questions.\n3. 🍕 **Local Recommendations:** Recommend top-rated eateries, tea stalls, pharmacies, and hangouts around campus with live ratings.\n4. ✍️ **Student Experiences:** Share insights from student blogs, seniors' tips, and campus culture.\n5. 💡 **Study & Tech Help:** Answer academic questions, give study advice, explain coding concepts, and guide you through college life.\n\nFeel free to ask me anything!`,
      actions: [
        { label: 'Study Drives', path: '/resources', icon: '📖' },
        { label: 'Fare Rates', path: '/fare-analysis', icon: '🛺' },
        { label: 'Local Guide', path: '/local-guide', icon: '📍' }
      ]
    };
  }

  if (cleanMsg.includes('thank') || cleanMsg.includes('thx') || cleanMsg.includes('thanks')) {
    return {
      reply: `You're very welcome, ${studentName}! Happy to help anytime. 🚀\n\nIf you ever need anything else — whether it's finding a place to eat or studying for your next quiz — just ping me!`,
      actions: []
    };
  }

  if (cleanMsg.includes('joke') || cleanMsg.includes('make me laugh')) {
    const jokes = [
      `Why do programmers prefer dark mode?\n\nBecause light attracts bugs! 🐛😄`,
      `There are 10 types of people in the world:\n\nThose who understand binary, and those who don't! 💻`,
      `Why was the JavaScript developer sad?\n\nBecause they didn't 'null' their emotions and kept getting 'undefined' feelings! 😂`,
      `A SQL query walks into a bar, walks up to two tables and asks...\n\n*"Can I join you?"* 🍻`
    ];
    const picked = jokes[Math.floor(Math.random() * jokes.length)];
    return {
      reply: `${picked}\n\nNeed any help with your actual coursework or college stuff now?`,
      actions: [{ label: 'Study Resources', path: '/resources', icon: '📖' }]
    };
  }

  // G2. Exam Preparation & CGPA Strategy
  if (cleanMsg.includes('exam') || cleanMsg.includes('midsem') || cleanMsg.includes('endsem') || cleanMsg.includes('study tip') || cleanMsg.includes('cgpa') || cleanMsg.includes('prepare')) {
    actions.push({ label: 'Access Branch Notes', path: '/resources', icon: '📖' });
    return {
      reply: `Here is a proven strategy for acing semester exams at **${collegeName}**:

### 🎯 1. Master the Previous Year Papers (PYQs)
At MNNIT, professors often repeat concepts and question structures from past 3–5 years. Solve at least 3 years of PYQs before entering the exam hall.

### 📚 2. Use Class Notes & Teacher Slides First
Most exam questions are directly grounded in what was covered on the board or in department slides. Check our **Resources** tab for shared Google Drive folders with batch notes.

### ⏱️ 3. The 80/20 Rule for Engineering
Focus 80% of your energy on the 20% of high-weightage topics (derivations, standard algorithms, numerical formulas).

### 💡 4. Maintain Consistent Attendance
Aim for above 75% attendance so you don't face debarment issues or stress during admit card generation.

Would you like direct links to notes for your specific branch? Just tell me your department (e.g. CSE, ECE, Mechanical)!`,
      actions
    };
  }

  // G3. Tips for Freshers / First Year
  if (cleanMsg.includes('fresher') || cleanMsg.includes('first year') || cleanMsg.includes('1st year') || cleanMsg.includes('new student')) {
    actions.push(
      { label: 'First Year Drives', path: '/resources', icon: '📖' },
      { label: 'Campus Fares', path: '/fare-analysis', icon: '🛺' }
    );
    return {
      reply: `Welcome to **${collegeName}**! 🎓 Here is essential advice every fresher should know:

1. **Academic Foundation:** Your 1st year CGPA is the easiest to build and hardest to pull up later. Aim for **8.0+** early on!
2. **Explore Clubs & Activities:** Join technical clubs (Robotics, Coding, Aero) and cultural clubs in your first semester to build your network and soft skills.
3. **Getting Around:** Never pay more than ₹20–₹30 for shared autos to Civil Lines. Check our **Fare Calculator** before heading out!
4. **Food & Hangouts:** Teliyarganj market right outside the gate has affordable stationery, snacks, and printout shops.
5. **Seniors are your best resource:** Don't hesitate to reach out for guidance on subjects, professors, and projects.

Feel free to ask me for 1st-year notes or local recommendations!`,
      actions
    };
  }

  // G4. Placements, Coding, & Internships
  if (cleanMsg.includes('placement') || cleanMsg.includes('internship') || cleanMsg.includes('dsa') || cleanMsg.includes('coding') || cleanMsg.includes('leetcode')) {
    return {
      reply: `Here is a recommended roadmap for tech placements & internships:

### 1. Language Mastery (Choose C++ or Java)
• Master OOP concepts, pointers/memory, and standard library (C++ STL or Java Collections).

### 2. Data Structures & Algorithms (Core)
• **Beginner:** Arrays, Strings, Recursion, Sorting, Binary Search.
• **Intermediate:** Linked Lists, Stacks, Queues, Binary Trees, BSTs.
• **Advanced:** Heaps, Graphs (BFS/DFS, Dijkstra), Dynamic Programming (1D & 2D).

### 3. Core CS Subjects (Mandatory for rounds)
• Operating Systems (Processes, Threads, Deadlocks, Virtual Memory)
• DBMS (SQL queries, Normalization, ACID properties, Indexing)
• Computer Networks (OSI layers, TCP/UDP, IP addressing, HTTP/HTTPS)

### 4. Projects
• Build 2 quality full-stack or systems projects with clean Git commits and live deployment.

Start solving 2–3 problems daily on LeetCode or GeeksforGeeks! Need notes on OS or DBMS?`,
      actions: [{ label: 'Study Resources', path: '/resources', icon: '📖' }]
    };
  }

  // G5. Technical Concept Explanations
  if (cleanMsg.includes('time complexity') || cleanMsg.includes('big o')) {
    return {
      reply: `**Time Complexity** describes how the runtime of an algorithm scales as the input size ($n$) increases:

• **$O(1)$ — Constant Time:** Runtime doesn't depend on input size. (e.g., accessing an array index \`arr[0]\`).
• **$O(\\log n)$ — Logarithmic Time:** Problem size is halved at each step. (e.g., **Binary Search**).
• **$O(n)$ — Linear Time:** Directly proportional to elements. (e.g., single loop scanning an array).
• **$O(n \\log n)$ — Linearithmic Time:** Typical for efficient comparison sorting (e.g., **Merge Sort**, **Heap Sort**).
• **$O(n^2)$ — Quadratic Time:** Nested loops over data (e.g., **Bubble Sort**, brute force pair checking).
• **$O(2^n)$ — Exponential Time:** Recursive doubling (e.g., naive recursive Fibonacci).

Always aim for $O(n \\log n)$ or better for competitive programming and interview problems!`,
      actions: []
    };
  }

  if (cleanMsg.includes('binary search')) {
    return {
      reply: `### Binary Search Explained 🔍

**Binary Search** is an efficient algorithm to find a target value in a **sorted array** in **$O(\\log n)$** time:

1. Look at the middle element: \`mid = low + (high - low) / 2\`
2. If \`arr[mid] == target\`, you've found it!
3. If \`target < arr[mid]\`, narrow search to the left half (\`high = mid - 1\`).
4. If \`target > arr[mid]\`, narrow search to the right half (\`low = mid + 1\`).

**Key condition:** The array **MUST be sorted**! It's exponentially faster than linear scan ($O(n)$) for large inputs.`,
      actions: []
    };
  }

  if (cleanMsg.includes('hostel') || cleanMsg.includes('mess') || cleanMsg.includes('room')) {
    return {
      reply: `Here are quick tips for hostel life at **${collegeName}**:

• **Mess Food:** If the mess menu doesn't suit your taste on a particular day, Teliyarganj has great affordable food joints like Pandit Ji Canteen, Sai Fast Food, and roadside chaat.
• **Laundry & Essentials:** Local laundry services visit hostels weekly. Keep a small electric kettle and basic first-aid supplies handy in your room.
• **Late Night Study:** The central library and hostel study rooms are open late during midsem and endsem weeks.
• **Hostel WiFi/LAN:** Make sure to register your MAC address with the campus computer center to get full-speed LAN access.`,
      actions: [
        { label: 'Nearby Food Spots', path: '/local-guide', icon: '🍕' },
        { label: 'Campus Fares', path: '/fare-analysis', icon: '🛺' }
      ]
    };
  }

  // G6. GENERAL / GREETING FALLBACK
  actions.push(
    { label: 'Fare Calculator', path: '/fare-analysis', icon: '🛺' },
    { label: 'Local Guide', path: '/local-guide', icon: '📍' },
    { label: 'Study Notes', path: '/resources', icon: '📖' }
  );

  return {
    reply: `Hello ${studentName}! I am your **AI Guide** for CampusCare.

I can chat with you about anything regarding campus life, engineering studies, or getting around:
• 🛺 **Transit & Fares:** Verified auto/rickshaw fares and travel tips around Prayagraj.
• 📍 **Local Spots:** Good food, medical clinics, and hangout locations near campus.
• 📖 **Academic Resources:** Google Drive folders for past papers, slides, and branch notes.
• ✍️ **Student Blogs:** Senior tips, club experiences, and campus stories.
• 💡 **Study & Code:** Tips for exams, CGPA management, and coding concepts.

What would you like to discuss today?`,
    actions
  };
}

const { GoogleGenAI } = require('@google/genai');

/**
 * Gemini LLM integration — Talks naturally like ChatGPT with deep campus grounding
 */
async function callGeminiLLM({ apiKey, message, history, studentName, collegeName, resources, places, fares, blogs, courses }) {
  const ai = new GoogleGenAI({ apiKey });

  const systemInstruction = `You are "AI Guide", a friendly, knowledgeable, and articulate campus AI companion for CampusCare at ${collegeName} (MNNIT Allahabad).
You speak naturally, warmly, and helpfully just like ChatGPT — conversational, insightful, empathetic to student life, and capable of both deep campus navigation and open-ended dialogue.

Conversation Style:
1. ChatGPT-like Persona: Be conversational, welcoming, clear, and engaging. You can chat casually, answer general technical or academic questions, provide study and productivity tips, discuss coding or engineering problems, or offer friendly advice.
2. Grounded in Campus Data: You have direct access to verified campus data:
   - Study notes and academic Google Drive folders across branches (CSE, ECE, EE, ME, CE, Chemical, Biotech, First Year)
   - Real-world transit and auto/e-rickshaw fares and routes around Prayagraj (Prayagraj Junction, Subedarganj, Civil Lines, Sangam)
   - Verified local guide places (food spots, medical clinics, hospitals, hangouts) with student ratings and distances
   - Community blogs and experiences shared by students and seniors
   - Official degree courses and programs
3. Formatting: Format your responses with clean Markdown (bold key terms, neat bullet points, links where available). Keep answers readable, structured, and pleasant.
4. When relevant, you can recommend platform features:
   - Fares and transit calculator: /fare-analysis
   - Local spots and food: /local-guide
   - Study notes and drives: /resources
   - Community discussions and blogs: /blogs
   - Profile settings: /profile

Live Campus Database Context:
- Academic Resources: ${JSON.stringify(resources.slice(0, 10))}
- Local Places & Reviews: ${JSON.stringify(places.slice(0, 12))}
- Recent Transit Fares: ${JSON.stringify(fares.slice(0, 15))}
- Student Blogs: ${JSON.stringify(blogs.slice(0, 5))}
- College Courses: ${JSON.stringify(courses.map(c => c.course_name))}
Current Student Name: ${studentName || 'Student'}
`;

  // Format multi-turn conversation contents for the model
  const contents = [];
  if (Array.isArray(history) && history.length > 0) {
    for (const h of history.slice(-6)) {
      if (h.text && h.text.trim()) {
        contents.push({
          role: h.sender === 'user' ? 'user' : 'model',
          parts: [{ text: h.text.trim() }]
        });
      }
    }
  }
  contents.push({
    role: 'user',
    parts: [{ text: message }]
  });

  let response;
  try {
    response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents,
      config: {
        systemInstruction,
        temperature: 0.7,
        maxOutputTokens: 1024,
      }
    });
  } catch (primaryErr) {
    // Fallback to gemini-3.7-flash
    response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents,
      config: {
        systemInstruction,
        temperature: 0.7,
        maxOutputTokens: 1024,
      }
    });
  }

  const text = response?.text;
  if (!text) return null;

  // Derive relevant action buttons based on content
  const actions = [];
  const lower = (text + ' ' + message).toLowerCase();
  if (lower.includes('fare') || lower.includes('auto') || lower.includes('rickshaw') || lower.includes('station') || lower.includes('/fare-analysis')) {
    actions.push({ label: 'Open Fare Calculator', path: '/fare-analysis', icon: '🛺' });
  }
  if (lower.includes('place') || lower.includes('food') || lower.includes('hospital') || lower.includes('cafe') || lower.includes('restaurant') || lower.includes('/local-guide')) {
    actions.push({ label: 'Explore Local Guide', path: '/local-guide', icon: '📍' });
  }
  if (lower.includes('resource') || lower.includes('note') || lower.includes('study') || lower.includes('syllabus') || lower.includes('drive') || lower.includes('/resources')) {
    actions.push({ label: 'Browse Study Notes', path: '/resources', icon: '📖' });
  }
  if (lower.includes('blog') || lower.includes('senior') || lower.includes('experience') || lower.includes('/blogs')) {
    actions.push({ label: 'Read Student Blogs', path: '/blogs', icon: '✍️' });
  }

  return { text, actions };
}

module.exports = {
  getSuggestions,
  chat
};
