// Initial mock reports for campus waste management
const INITIAL_REPORTS = [
  {
    id: 'RPT-1001',
    title: 'Overflowing Recycling Bin Near Main Library',
    category: 'Overflowing Bin',
    location: 'Central Library - East Entrance',
    severity: 'High',
    description: 'Blue recycling bin is completely full with plastic bottles overflowing onto the pathway.',
    imageUrl: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=600&auto=format&fit=crop&q=80',
    status: 'Pending',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    reportedBy: 'Alex Chen (Student ID: #8821)',
    assignedTeam: 'Zone A Sanitation',
    adminNotes: ''
  },
  {
    id: 'RPT-1002',
    title: 'Discarded E-Waste & Cable Pile',
    category: 'Hazardous / E-Waste',
    location: 'Engineering Building B - Room 204 Outer Corridor',
    severity: 'Medium',
    description: 'Old computer monitors and broken power cables left unattended in the hallway.',
    imageUrl: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=600&auto=format&fit=crop&q=80',
    status: 'In Progress',
    createdAt: new Date(Date.now() - 3600000 * 18).toISOString(),
    reportedBy: 'Priya Sharma (Student ID: #9042)',
    assignedTeam: 'Tech Facility Team',
    adminNotes: 'Tech team notified for safe e-waste extraction.'
  },
  {
    id: 'RPT-1003',
    title: 'Cardboard Packaging Pile Left Outside Cafeteria',
    category: 'Unsegregated Litter',
    location: 'Student Union Cafeteria Rear Loading Dock',
    severity: 'Urgent',
    description: 'Large stack of un-flattened delivery cardboard boxes blocking emergency exit doorway.',
    imageUrl: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=600&auto=format&fit=crop&q=80',
    status: 'Resolved',
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
    reportedBy: 'Marcus Vance (Student ID: #7719)',
    assignedTeam: 'Recycling Logistics',
    adminNotes: 'Cardboard collected, flattened, and sent to campus recycling center.'
  }
];

export const DEMO_USERS = {
  students: [
    {
      id: 'STU-8821',
      name: 'Alex Chen',
      email: 'alex.chen@campus.edu',
      role: 'student',
      roleTitle: 'Eco-Club Representative',
      department: 'Computer Science & Environmental Eng.',
      hostel: 'North Quad Residences - Hall 3',
      ecoPoints: 380,
      scansCount: 19,
      password: 'password123',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
    },
    {
      id: 'STU-9042',
      name: 'Priya Sharma',
      email: 'priya.sharma@campus.edu',
      role: 'student',
      roleTitle: 'Campus Green Ambassador',
      department: 'Biotechnology & Life Sciences',
      hostel: 'Greenwood Hall - Suite 12',
      ecoPoints: 240,
      scansCount: 12,
      password: 'password123',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80'
    }
  ],
  admins: [
    {
      id: 'ADM-1044',
      name: 'Dr. Arthur Vance',
      email: 'a.vance@campus.facilities.edu',
      role: 'admin',
      roleTitle: 'Director of Facilities & Sustainability',
      department: 'Campus Facilities & Operations',
      clearance: 'Level 4 - Full Dispatch Authority',
      securityCode: 'ADMIN2026',
      password: 'password123',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
    },
    {
      id: 'ADM-2091',
      name: 'Elena Rostova',
      email: 'e.rostova@campus.facilities.edu',
      role: 'admin',
      roleTitle: 'Sanitation Lead & Hazardous Control',
      department: 'Campus Sanitation & Safety Division',
      clearance: 'Level 3 - Zone Operations Supervisor',
      securityCode: 'ADMIN2026',
      password: 'password123',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
    }
  ]
};

const STORAGE_KEYS = {
  REPORTS: 'waste_wise_campus_reports',
  POINTS: 'waste_wise_eco_points',
  SCANS_COUNT: 'waste_wise_scans_count',
  USER_ROLE: 'waste_wise_active_role',
  CURRENT_USER: 'waste_wise_current_user',
  REGISTERED_USERS: 'waste_wise_registered_users'
};

export const getStoredReports = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.REPORTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(INITIAL_REPORTS));
      return INITIAL_REPORTS;
    }
    return JSON.parse(raw);
  } catch (e) {
    return INITIAL_REPORTS;
  }
};

export const saveReport = (newReport) => {
  const reports = getStoredReports();
  const reportObj = {
    id: `RPT-${Math.floor(1000 + Math.random() * 9000)}`,
    createdAt: new Date().toISOString(),
    status: 'Pending',
    adminNotes: '',
    ...newReport
  };
  const updated = [reportObj, ...reports];
  localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(updated));
  addEcoPoints(50); // Award 50 points for submitting a campus report
  return reportObj;
};

export const updateReportStatus = (reportId, newStatus, adminNotes = '') => {
  const reports = getStoredReports();
  const updated = reports.map(rpt => {
    if (rpt.id === reportId) {
      return { ...rpt, status: newStatus, adminNotes: adminNotes || rpt.adminNotes };
    }
    return rpt;
  });
  localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(updated));
  return updated;
};

export const getEcoPoints = () => {
  try {
    const user = getCurrentUser();
    if (user && typeof user.ecoPoints === 'number') {
      return user.ecoPoints;
    }
    const pts = localStorage.getItem(STORAGE_KEYS.POINTS);
    return pts ? parseInt(pts, 10) : 380;
  } catch (e) {
    return 380;
  }
};

export const addEcoPoints = (amount) => {
  const current = getEcoPoints();
  const next = current + amount;
  localStorage.setItem(STORAGE_KEYS.POINTS, next.toString());
  
  // Also update active user if present
  const user = getCurrentUser();
  if (user) {
    const updatedUser = { ...user, ecoPoints: next };
    setCurrentUser(updatedUser);
  }
  return next;
};

export const getScanCount = () => {
  try {
    const user = getCurrentUser();
    if (user && typeof user.scansCount === 'number') {
      return user.scansCount;
    }
    const count = localStorage.getItem(STORAGE_KEYS.SCANS_COUNT);
    return count ? parseInt(count, 10) : 19;
  } catch (e) {
    return 19;
  }
};

export const incrementScanCount = () => {
  const current = getScanCount();
  const next = current + 1;
  localStorage.setItem(STORAGE_KEYS.SCANS_COUNT, next.toString());
  
  const user = getCurrentUser();
  if (user) {
    const updatedUser = { ...user, scansCount: next };
    setCurrentUser(updatedUser);
  }
  addEcoPoints(20); // Award 20 points per waste scan
  return next;
};

// ================= AUTHENTICATION & USER MANAGEMENT =================

export const getRegisteredUsers = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.REGISTERED_USERS);
    if (!raw) {
      const allDefaults = [...DEMO_USERS.students, ...DEMO_USERS.admins];
      localStorage.setItem(STORAGE_KEYS.REGISTERED_USERS, JSON.stringify(allDefaults));
      return allDefaults;
    }
    return JSON.parse(raw);
  } catch (e) {
    return [...DEMO_USERS.students, ...DEMO_USERS.admins];
  }
};

export const getCurrentUser = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (!raw) {
      // Default to demo student Alex Chen
      const defaultUser = DEMO_USERS.students[0];
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(defaultUser));
      localStorage.setItem(STORAGE_KEYS.USER_ROLE, defaultUser.role);
      localStorage.setItem(STORAGE_KEYS.POINTS, defaultUser.ecoPoints.toString());
      return defaultUser;
    }
    return JSON.parse(raw);
  } catch (e) {
    return DEMO_USERS.students[0];
  }
};

export const setCurrentUser = (user) => {
  if (!user) {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    return null;
  }
  localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
  localStorage.setItem(STORAGE_KEYS.USER_ROLE, user.role);
  if (user.ecoPoints !== undefined) {
    localStorage.setItem(STORAGE_KEYS.POINTS, user.ecoPoints.toString());
  }
  return user;
};

export const authenticateUser = ({ identifier, password, role, securityCode }) => {
  const allUsers = getRegisteredUsers();
  const cleanId = (identifier || '').trim().toLowerCase();
  
  // Find matching user
  const found = allUsers.find(u => {
    const matchRole = u.role === role;
    const matchEmail = u.email.toLowerCase() === cleanId;
    const matchId = u.id.toLowerCase() === cleanId;
    return matchRole && (matchEmail || matchId);
  });

  if (!found) {
    return {
      success: false,
      message: `No ${role === 'admin' ? 'campus staff/admin' : 'student'} account found matching "${identifier}". Please check your ID or email.`
    };
  }

  // Password check (allow 'password123' or whatever was stored)
  if (found.password && found.password !== password) {
    return {
      success: false,
      message: 'Incorrect password. (Default demo password is password123)'
    };
  }

  // For Admin role: check security authorization code if configured
  if (role === 'admin') {
    const reqCode = found.securityCode || 'ADMIN2026';
    if (securityCode && securityCode.trim().toUpperCase() !== reqCode.toUpperCase()) {
      return {
        success: false,
        message: 'Invalid Admin Security Key. (Authorized key is ADMIN2026)'
      };
    }
  }

  setCurrentUser(found);
  return {
    success: true,
    user: found
  };
};

export const registerUser = ({ name, email, id, role, department, hostel, password, securityCode }) => {
  const allUsers = getRegisteredUsers();
  const cleanEmail = (email || '').trim().toLowerCase();
  const cleanId = (id || '').trim().toUpperCase();

  // Check duplicate
  const exists = allUsers.some(u => 
    u.email.toLowerCase() === cleanEmail || u.id.toUpperCase() === cleanId
  );

  if (exists) {
    return {
      success: false,
      message: 'An account with this email address or ID already exists.'
    };
  }

  if (role === 'admin') {
    if (securityCode?.trim().toUpperCase() !== 'ADMIN2026') {
      return {
        success: false,
        message: 'Invalid Campus Administration Passkey. Authorized registration requires code ADMIN2026.'
      };
    }
  }

  const newUser = {
    id: cleanId,
    name: name.trim(),
    email: cleanEmail,
    role,
    department: department || (role === 'admin' ? 'Campus Facilities & Operations' : 'General Campus Studies'),
    hostel: hostel || (role === 'student' ? 'Main Campus Housing' : undefined),
    roleTitle: role === 'admin' ? 'Sanitation & Facility Staff' : 'Student Eco-Advocate',
    ecoPoints: role === 'student' ? 100 : 0, // 100 Welcome Points
    scansCount: 0,
    password: password || 'password123',
    securityCode: role === 'admin' ? (securityCode || 'ADMIN2026') : undefined,
    avatar: role === 'admin'
      ? 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80'
      : 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80'
  };

  const updatedUsers = [...allUsers, newUser];
  localStorage.setItem(STORAGE_KEYS.REGISTERED_USERS, JSON.stringify(updatedUsers));
  setCurrentUser(newUser);

  return {
    success: true,
    user: newUser
  };
};

export const logoutUser = () => {
  localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  return true;
};
