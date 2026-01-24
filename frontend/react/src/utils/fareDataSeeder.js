// Fare Data Seeder
// Creates sample fare data for testing the distribution graph
export const fareDataSeeder = {
  // Sample users with different IDs
  users: [
    { id: 'user1', email: 'student1@college.edu', firstName: 'Rahul', lastName: 'Sharma', collegeId: 1 },
    { id: 'user2', email: 'student2@college.edu', firstName: 'Priya', lastName: 'Patel', collegeId: 1 },
    { id: 'user3', email: 'student3@college.edu', firstName: 'Amit', lastName: 'Kumar', collegeId: 1 },
    { id: 'user4', email: 'student4@college.edu', firstName: 'Neha', lastName: 'Singh', collegeId: 1 },
    { id: 'user5', email: 'student5@college.edu', firstName: 'Vikram', lastName: 'Verma', collegeId: 1 },
    { id: 'user6', email: 'student6@college.edu', firstName: 'Anjali', lastName: 'Gupta', collegeId: 1 },
    { id: 'user7', email: 'student7@college.edu', firstName: 'Rohit', lastName: 'Mishra', collegeId: 1 },
    { id: 'user8', email: 'student8@college.edu', firstName: 'Kavita', lastName: 'Yadav', collegeId: 1 },
    { id: 'user9', email: 'student9@college.edu', firstName: 'Suresh', lastName: 'Reddy', collegeId: 1 },
    { id: 'user10', email: 'student10@college.edu', firstName: 'Pooja', lastName: 'Joshi', collegeId: 1 },
    { id: 'user11', email: 'student11@college.edu', firstName: 'Manish', lastName: 'Agarwal', collegeId: 1 },
    { id: 'user12', email: 'student12@college.edu', firstName: 'Swati', lastName: 'Choudhary', collegeId: 1 }
  ],

  // Prayagraj places with fare data
  placeFares: {
    'sangam': {
      name: 'Sangam',
      displayName: 'Sangam, Prayagraj, Uttar Pradesh, India',
      coordinates: { lat: 25.4333, lng: 81.8333 },
      fareKey: 'sangam',
      type: 'religious',
      class: 'religious',
      fares: [
        { user: 'user1', fare: 45, timestamp: '2024-01-20T08:30:00Z' },
        { user: 'user2', fare: 50, timestamp: '2024-01-20T09:15:00Z' },
        { user: 'user3', fare: 42, timestamp: '2024-01-20T10:00:00Z' },
        { user: 'user4', fare: 48, timestamp: '2024-01-20T11:30:00Z' },
        { user: 'user5', fare: 55, timestamp: '2024-01-20T14:20:00Z' },
        { user: 'user6', fare: 38, timestamp: '2024-01-20T15:45:00Z' },
        { user: 'user7', fare: 52, timestamp: '2024-01-20T16:30:00Z' },
        { user: 'user8', fare: 46, timestamp: '2024-01-20T17:15:00Z' },
        { user: 'user9', fare: 49, timestamp: '2024-01-20T18:00:00Z' },
        { user: 'user10', fare: 41, timestamp: '2024-01-20T19:30:00Z' },
        { user: 'user11', fare: 53, timestamp: '2024-01-20T20:45:00Z' },
        { user: 'user12', fare: 47, timestamp: '2024-01-20T21:30:00Z' }
      ]
    },
    'allahabad-university': {
      name: 'Allahabad University',
      displayName: 'University of Allahabad, Prayagraj, Uttar Pradesh, India',
      coordinates: { lat: 25.4478, lng: 81.8464 },
      fareKey: 'allahabad-university',
      type: 'university',
      class: 'university',
      fares: [
        { user: 'user1', fare: 35, timestamp: '2024-01-20T08:45:00Z' },
        { user: 'user2', fare: 40, timestamp: '2024-01-20T09:30:00Z' },
        { user: 'user3', fare: 38, timestamp: '2024-01-20T10:15:00Z' },
        { user: 'user4', fare: 42, timestamp: '2024-01-20T11:45:00Z' },
        { user: 'user5', fare: 36, timestamp: '2024-01-20T14:30:00Z' },
        { user: 'user6', fare: 44, timestamp: '2024-01-20T15:00:00Z' },
        { user: 'user7', fare: 39, timestamp: '2024-01-20T16:45:00Z' },
        { user: 'user8', fare: 41, timestamp: '2024-01-20T17:30:00Z' },
        { user: 'user9', fare: 37, timestamp: '2024-01-20T18:15:00Z' },
        { user: 'user10', fare: 43, timestamp: '2024-01-20T19:45:00Z' },
        { user: 'user11', fare: 45, timestamp: '2024-01-20T20:30:00Z' },
        { user: 'user12', fare: 40, timestamp: '2024-01-20T21:45:00Z' }
      ]
    },
    'civil-lines': {
      name: 'Civil Lines',
      displayName: 'Civil Lines, Prayagraj, Uttar Pradesh, India',
      coordinates: { lat: 25.4478, lng: 81.8464 },
      fareKey: 'civil-lines',
      type: 'commercial',
      class: 'commercial',
      fares: [
        { user: 'user1', fare: 25, timestamp: '2024-01-20T09:00:00Z' },
        { user: 'user2', fare: 30, timestamp: '2024-01-20T09:45:00Z' },
        { user: 'user3', fare: 28, timestamp: '2024-01-20T10:30:00Z' },
        { user: 'user4', fare: 32, timestamp: '2024-01-20T12:00:00Z' },
        { user: 'user5', fare: 26, timestamp: '2024-01-20T14:45:00Z' },
        { user: 'user6', fare: 34, timestamp: '2024-01-20T15:15:00Z' },
        { user: 'user7', fare: 29, timestamp: '2024-01-20T17:00:00Z' },
        { user: 'user8', fare: 31, timestamp: '2024-01-20T17:45:00Z' },
        { user: 'user9', fare: 27, timestamp: '2024-01-20T18:30:00Z' },
        { user: 'user10', fare: 33, timestamp: '2024-01-20T20:00:00Z' },
        { user: 'user11', fare: 35, timestamp: '2024-01-20T20:45:00Z' },
        { user: 'user12', fare: 30, timestamp: '2024-01-20T21:15:00Z' }
      ]
    },
    'prayagraj-junction': {
      name: 'Prayagraj Junction',
      displayName: 'Prayagraj Junction Railway Station, Prayagraj, Uttar Pradesh, India',
      coordinates: { lat: 25.4478, lng: 81.8464 },
      fareKey: 'prayagraj-junction',
      type: 'railway',
      class: 'railway',
      fares: [
        { user: 'user1', fare: 20, timestamp: '2024-01-20T08:15:00Z' },
        { user: 'user2', fare: 25, timestamp: '2024-01-20T09:00:00Z' },
        { user: 'user3', fare: 22, timestamp: '2024-01-20T10:45:00Z' },
        { user: 'user4', fare: 28, timestamp: '2024-01-20T11:30:00Z' },
        { user: 'user5', fare: 18, timestamp: '2024-01-20T13:30:00Z' },
        { user: 'user6', fare: 24, timestamp: '2024-01-20T15:30:00Z' },
        { user: 'user7', fare: 21, timestamp: '2024-01-20T16:15:00Z' },
        { user: 'user8', fare: 26, timestamp: '2024-01-20T17:00:00Z' },
        { user: 'user9', fare: 19, timestamp: '2024-01-20T18:45:00Z' },
        { user: 'user10', fare: 27, timestamp: '2024-01-20T19:30:00Z' },
        { user: 'user11', fare: 23, timestamp: '2024-01-20T20:15:00Z' },
        { user: 'user12', fare: 25, timestamp: '2024-01-20T21:00:00Z' }
      ]
    },
    'mnnit': {
      name: 'MNNIT',
      displayName: 'MNNIT Allahabad, Prayagraj, Uttar Pradesh, India',
      coordinates: { lat: 25.4478, lng: 81.8464 },
      fareKey: 'mnnit',
      type: 'university',
      class: 'university',
      fares: [
        { user: 'user1', fare: 55, timestamp: '2024-01-20T08:00:00Z' },
        { user: 'user2', fare: 60, timestamp: '2024-01-20T08:30:00Z' },
        { user: 'user3', fare: 52, timestamp: '2024-01-20T09:15:00Z' },
        { user: 'user4', fare: 58, timestamp: '2024-01-20T10:00:00Z' },
        { user: 'user5', fare: 48, timestamp: '2024-01-20T13:00:00Z' },
        { user: 'user6', fare: 62, timestamp: '2024-01-20T14:15:00Z' },
        { user: 'user7', fare: 54, timestamp: '2024-01-20T15:30:00Z' },
        { user: 'user8', fare: 56, timestamp: '2024-01-20T16:45:00Z' },
        { user: 'user9', fare: 50, timestamp: '2024-01-20T17:30:00Z' },
        { user: 'user10', fare: 64, timestamp: '2024-01-20T19:00:00Z' },
        { user: 'user11', fare: 59, timestamp: '2024-01-20T20:30:00Z' },
        { user: 'user12', fare: 57, timestamp: '2024-01-20T21:15:00Z' }
      ]
    },
    'katra': {
      name: 'Katra',
      displayName: 'Katra Market, Prayagraj, Uttar Pradesh, India',
      coordinates: { lat: 25.4478, lng: 81.8464 },
      fareKey: 'katra',
      type: 'commercial',
      class: 'commercial',
      fares: [
        { user: 'user1', fare: 15, timestamp: '2024-01-20T09:30:00Z' },
        { user: 'user2', fare: 20, timestamp: '2024-01-20T10:15:00Z' },
        { user: 'user3', fare: 18, timestamp: '2024-01-20T11:00:00Z' },
        { user: 'user4', fare: 22, timestamp: '2024-01-20T12:30:00Z' },
        { user: 'user5', fare: 12, timestamp: '2024-01-20T14:00:00Z' },
        { user: 'user6', fare: 25, timestamp: '2024-01-20T15:45:00Z' },
        { user: 'user7', fare: 17, timestamp: '2024-01-20T16:30:00Z' },
        { user: 'user8', fare: 19, timestamp: '2024-01-20T17:15:00Z' },
        { user: 'user9', fare: 14, timestamp: '2024-01-20T18:00:00Z' },
        { user: 'user10', fare: 23, timestamp: '2024-01-20T19:30:00Z' },
        { user: 'user11', fare: 21, timestamp: '2024-01-20T20:15:00Z' },
        { user: 'user12', fare: 16, timestamp: '2024-01-20T21:00:00Z' }
      ]
    }
  },

  // Function to seed fare data
  seedFareData() {
    const storageKey = `campuscare_fares_anonymous`;
    
    // Generate fare data for all places
    const allFares = [];
    
    Object.entries(this.placeFares).forEach(([placeKey, placeData]) => {
      placeData.fares.forEach(fareData => {
        const user = this.users.find(u => u.id === fareData.user);
        
        allFares.push({
          id: `${placeKey}-${fareData.user}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          place: {
            name: placeData.name,
            displayName: placeData.displayName,
            coordinates: placeData.coordinates,
            fareKey: placeData.fareKey,
            type: placeData.type,
            class: placeData.class
          },
          fare: fareData.fare,
          currency: 'INR',
          timestamp: fareData.timestamp,
          submittedAt: fareData.timestamp,
          user: user,
          submittedBy: fareData.user,
          userEmail: user?.email || null,
          collegeId: user?.collegeId || null
        });
      });
    });

    // Store in localStorage
    try {
      localStorage.setItem(storageKey, JSON.stringify(allFares));
      console.log(`✅ Seeded ${allFares.length} fare records for ${Object.keys(this.placeFares).length} places`);
      return allFares;
    } catch (error) {
      console.error('❌ Failed to seed fare data:', error);
      return [];
    }
  },

  // Function to clear seeded data
  clearSeededData() {
    const storageKey = `campuscare_fares_anonymous`;
    try {
      localStorage.removeItem(storageKey);
      console.log('✅ Cleared seeded fare data');
    } catch (error) {
      console.error('❌ Failed to clear seeded data:', error);
    }
  },

  // Function to check if data exists
  hasSeededData() {
    const storageKey = `campuscare_fares_anonymous`;
    try {
      const data = localStorage.getItem(storageKey);
      return data && JSON.parse(data).length > 0;
    } catch (error) {
      return false;
    }
  },

  // Function to get seeded data
  getSeededData() {
    const storageKey = `campuscare_fares_anonymous`;
    try {
      const data = localStorage.getItem(storageKey);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      return [];
    }
  }
};
