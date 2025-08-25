import React, { useState, useEffect, createContext, useContext } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { format, addDays, subDays } from 'date-fns';
import { Home, ClipboardList, TrendingUp, User, LogOut, ArrowRight, BookOpen, Clock, BarChart2, Star, CheckSquare, Layers, Search, Filter, UploadCloud, X } from 'lucide-react';

// Mock API Functions to simulate backend calls.
// These functions simulate latency, successful responses, and failures.
const MockAPI = (() => {
  let mockUsers = new Map();
  let mockCourses = new Map();
  let mockAssignments = new Map();
  let mockAnalytics = new Map();

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  // Seeds initial mock data for a new user
  const seedData = (userId: string) => {
    if (mockUsers.has(userId)) return;

    mockUsers.set(userId, {
      id: userId,
      name: 'Student User',
      email: `${userId}@example.com`,
      avatarUrl: 'https://placehold.co/100x100/A0D2DB/000000?text=SU',
      enrollmentStatus: 'Active',
      currentStreak: 7,
      totalCourses: 3,
      preferences: {
        notificationsEnabled: true,
        preferredStudyTimes: ['Morning', 'Evening'],
      },
    });

    const coursesData = [
      { id: '1', title: 'React Fundamentals', instructorName: 'Jane Doe', rating: 4.8, thumbnailUrl: 'https://placehold.co/400x225/A0D2DB/000000?text=React', progressPercentage: 80, lessonsCompleted: 7, totalLessons: 12, timeRemaining: '2 hrs', difficulty: 'Beginner', category: 'Programming', prerequisites: [] },
      { id: '2', title: 'Advanced Tailwind CSS', instructorName: 'John Smith', rating: 4.9, thumbnailUrl: 'https://placehold.co/400x225/A2B4AB/000000?text=Tailwind', progressPercentage: 45, lessonsCompleted: 9, totalLessons: 20, timeRemaining: '30 min', difficulty: 'Intermediate', category: 'Design', prerequisites: [] },
      { id: '3', title: 'Data Structures in JS', instructorName: 'Sarah Lee', rating: 4.7, thumbnailUrl: 'https://placehold.co/400x225/9F7AEA/000000?text=Data+Structures', progressPercentage: 15, lessonsCompleted: 2, totalLessons: 15, timeRemaining: '5 hrs', difficulty: 'Advanced', category: 'Programming', prerequisites: [] },
    ];
    mockCourses.set(userId, coursesData);

    const assignmentsData = [
      { id: '1', courseName: 'React Fundamentals', assignmentName: 'Create your first component', dueDate: '2025-09-01', status: 'In Progress', pointsPossible: 100, pointsEarned: null, submissionHistory: [], description: 'Build a basic React component that displays a welcome message and a counter.' },
      { id: '2', courseName: 'Advanced Tailwind CSS', assignmentName: 'Responsive Layout Exercise', dueDate: '2025-08-25', status: 'Submitted', pointsPossible: 100, pointsEarned: 95, submissionHistory: [{ submittedAt: '2025-08-24T10:00:00Z', fileUrl: '#', feedback: 'Great work! The layout is fully responsive.', rubric: {} }], description: 'Create a responsive landing page using Tailwind CSS utility classes.' },
      { id: '3', courseName: 'Data Structures in JS', assignmentName: 'Implement a linked list', dueDate: '2025-08-30', status: 'Overdue', pointsPossible: 100, pointsEarned: null, submissionHistory: [], description: 'Write a class for a singly linked list with methods for insertion and deletion.' },
    ];
    mockAssignments.set(userId, assignmentsData);

    const analyticsData = {
      totalStudyHours: 125,
      coursesCompleted: 5,
      currentStreak: 7,
      longestStreak: 21,
      charts: {
        studyHoursLast30Days: Array.from({ length: 30 }, (_, i) => ({
          date: format(subDays(new Date(), 29 - i), 'MMM d'),
          hours: Math.floor(Math.random() * 3) + 1,
        })),
        hoursByCategory: [
          { category: 'Programming', hours: 80 },
          { category: 'Design', hours: 30 },
          { category: 'Business', hours: 15 },
        ],
        completionRates: [
          { courseName: 'React Fundamentals', completionPercentage: 80 },
          { courseName: 'Advanced Tailwind CSS', completionPercentage: 45 },
          { courseName: 'Data Structures in JS', completionPercentage: 15 },
        ],
        activityHeatmap: Array.from({ length: 365 }, (_, i) => ({
          date: format(subDays(new Date(), 364 - i), 'yyyy-MM-dd'),
          activity: Math.floor(Math.random() * 4), // 0-3 for activity level
        })),
      },
      achievements: [
        { name: 'First Course Completed', description: 'Complete your first course', unlocked: true },
        { name: '7-Day Streak', description: 'Log in for 7 consecutive days', unlocked: true },
        { name: 'High Scorer', description: 'Achieve an average grade of 90% or higher on assignments', unlocked: false },
        { name: 'Master of React', description: 'Complete all React courses', unlocked: false },
      ],
    };
    mockAnalytics.set(userId, analyticsData);
  };

  return {
    async login(email: string, password: string) {
      await delay(500);
      if (email === 'test@example.com' && password === 'password123') {
        const userId = email.split('@')[0];
        seedData(userId);
        return mockUsers.get(userId);
      }
      throw new Error('Invalid email or password');
    },
    async register(email: string, password: string) {
      await delay(500);
      if (mockUsers.has(email)) {
        throw new Error('User already exists');
      }
      const userId = email.split('@')[0];
      seedData(userId);
      return mockUsers.get(userId);
    },
    async get(endpoint: string, userId: string) {
      await delay(300);
      seedData(userId);
      switch (endpoint) {
        case `/api/users/${userId}`:
          return mockUsers.get(userId);
        case `/api/courses/enrolled`:
          return mockCourses.get(userId);
        case `/api/assignments`:
          return mockAssignments.get(userId);
        case `/api/analytics`:
          return mockAnalytics.get(userId);
        case `/api/recommendations`:
          return [
            { id: '4', title: 'Intro to UI/UX', instructorName: 'Anna Williams', rating: 4.6, thumbnailUrl: 'https://placehold.co/400x225/9F7AEA/000000?text=UI%2FUX', progressPercentage: 0, lessonsCompleted: 0, totalLessons: 10, timeRemaining: '8 hrs', difficulty: 'Beginner', category: 'Design', prerequisites: [] },
            { id: '5', title: 'Python for Data Science', instructorName: 'Chris Evans', rating: 5.0, thumbnailUrl: 'https://placehold.co/400x225/A2B4AB/000000?text=Python', progressPercentage: 0, lessonsCompleted: 0, totalLessons: 15, timeRemaining: '10 hrs', difficulty: 'Intermediate', category: 'Programming', prerequisites: [] },
          ];
        default:
          throw new Error(`Endpoint not found: ${endpoint}`);
      }
    },
    async put(endpoint: string, data: any, userId: string) {
      await delay(300);
      seedData(userId);
      if (endpoint.startsWith(`/api/assignments/`)) {
        const assignmentId = endpoint.split('/').pop();
        const assignments = mockAssignments.get(userId);
        if (assignments) {
          const assignmentIndex = assignments.findIndex(a => a.id === assignmentId);
          if (assignmentIndex !== -1) {
            assignments[assignmentIndex] = { ...assignments[assignmentIndex], ...data };
            return assignments[assignmentIndex];
          }
        }
      }
      throw new Error('Update failed');
    }
  };
})();

// TypeScript Type Definitions
interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  enrollmentStatus: string;
  currentStreak: number;
  totalCourses: number;
  preferences: {
    notificationsEnabled: boolean;
    preferredStudyTimes: string[];
  };
}

interface Course {
  id: string;
  title: string;
  instructorName: string;
  rating: number;
  thumbnailUrl: string;
  progressPercentage: number;
  lessonsCompleted: number;
  totalLessons: number;
  timeRemaining: string;
  difficulty: string;
  category: string;
  prerequisites: string[];
}

interface Assignment {
  id: string;
  courseName: string;
  assignmentName: string;
  dueDate: string;
  status: 'Not Started' | 'In Progress' | 'Submitted' | 'Graded' | 'Overdue' | 'Upcoming';
  pointsPossible: number;
  pointsEarned: number | null;
  submissionHistory: {
    submittedAt: string;
    fileUrl: string;
    feedback: string;
    rubric: object;
  }[];
  description: string;
}

interface AnalyticsData {
  totalStudyHours: number;
  coursesCompleted: number;
  currentStreak: number;
  longestStreak: number;
  charts: {
    studyHoursLast30Days: { date: string; hours: number }[];
    hoursByCategory: { category: string; hours: number }[];
    completionRates: { courseName: string; completionPercentage: number }[];
    activityHeatmap: { date: string; activity: number }[];
  };
  achievements: {
    name: string;
    description: string;
    unlocked: boolean;
  }[];
}

// React Context for global state management
const AuthContext = createContext<{
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
}>({
  user: null,
  isAuthenticated: false,
  login: async () => {},
  logout: () => {},
  updateUser: () => {},
});

const useAuth = () => useContext(AuthContext);

// --- Component Definitions ---

// Reusable Status Badge component
const StatusBadge = ({ status }: { status: Assignment['status'] }) => {
  let colorClass = '';
  switch (status) {
    case 'Not Started': colorClass = 'bg-gray-200 text-gray-800'; break;
    case 'In Progress': colorClass = 'bg-blue-200 text-blue-800'; break;
    case 'Submitted': colorClass = 'bg-yellow-200 text-yellow-800'; break;
    case 'Graded': colorClass = 'bg-green-200 text-green-800'; break;
    case 'Overdue': colorClass = 'bg-red-200 text-red-800'; break;
    case 'Upcoming': colorClass = 'bg-indigo-200 text-indigo-800'; break;
    default: colorClass = 'bg-gray-200 text-gray-800'; break;
  }
  return (
    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${colorClass}`}>
      {status}
    </span>
  );
};

// Reusable Course Card component
const CourseCard = ({ course }: { course: Course }) => (
  <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-transform duration-200 hover:scale-105 hover:shadow-2xl cursor-pointer">
    <img src={course.thumbnailUrl} alt={course.title} className="w-full h-40 object-cover" />
    <div className="p-4">
      <h3 className="text-lg font-bold text-gray-800">{course.title}</h3>
      <p className="text-sm text-gray-600 mt-1">Instructor: {course.instructorName}</p>
      <div className="flex items-center text-sm text-gray-500 mt-2">
        <Star size={16} className="text-yellow-400 mr-1" fill="currentColor" />
        <span>{course.rating}</span>
        <span className="ml-auto text-xs px-2 py-1 rounded-full border border-gray-300">{course.difficulty}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
        <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: `${course.progressPercentage}%` }}></div>
      </div>
      <div className="flex justify-between items-center text-sm text-gray-500 mt-2">
        <span>{course.lessonsCompleted} of {course.totalLessons} lessons</span>
        <span>{course.timeRemaining} remaining</span>
      </div>
      <div className="flex justify-end mt-4">
        <button className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-full shadow-md hover:bg-blue-700 transition-colors">
          Continue Learning
        </button>
      </div>
    </div>
  </div>
);

// Reusable Chart Container
const ChartContainer = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="bg-white p-6 rounded-xl shadow-lg">
    <h3 className="text-xl font-bold mb-4 text-gray-800">{title}</h3>
    <div className="h-64">
      {children}
    </div>
  </div>
);

// --- Page Components ---

const LoginPage = ({ onLoginSuccess }: { onLoginSuccess: (user: User) => void }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoginView, setIsLoginView] = useState(true);
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }
    setIsLoading(true);
    setError('');
    try {
      await login(email, password);
      onLoginSuccess();
    } catch (err: any) {
      setError(err.message || "Failed to log in.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !confirmPassword) {
      setError("All fields are required.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setIsLoading(true);
    setError('');
    try {
      const newUser = await MockAPI.register(email, password);
      // Simulate login after successful registration
      onLoginSuccess(newUser);
    } catch (err: any) {
      setError(err.message || "Failed to sign up.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex items-center justify-center h-screen bg-gray-900 text-gray-900 px-4 py-8 overflow-hidden">
      {/* Background Image Layer */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-30"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=2670&auto=format&fit=crop')" }}
      ></div>

      {/* Login/Signup Form Container with Blur Effect */}
      <div className="relative z-10 bg-white/90 backdrop-blur-md rounded-xl shadow-2xl p-8 max-w-md w-full sm:p-12 transition-all duration-300">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">{isLoginView ? 'Welcome Back' : 'Create an Account'}</h2>
        {error && <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4">{error}</div>}

        {isLoginView ? (
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="you@example.com"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="••••••••"
                required
              />
            </div>
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center">
                <input type="checkbox" className="h-4 w-4 text-blue-600 rounded" />
                <span className="ml-2 text-gray-700">Remember Me</span>
              </label>
              <a href="#" className="text-blue-600 hover:underline">Forgot Password?</a>
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-full hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50"
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>
            <p className="text-center text-sm text-gray-600 mt-4">
              Don't have an account? <a href="#" onClick={() => setIsLoginView(false)} className="text-blue-600 hover:underline">Sign up now!</a>
            </p>
          </form>
        ) : (
          <form onSubmit={handleSignup} className="space-y-6">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="you@example.com"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="••••••••"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="••••••••"
                required
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-green-600 text-white font-bold py-3 px-4 rounded-full hover:bg-green-700 transition-colors duration-200 focus:outline-none focus:ring-4 focus:ring-green-500 focus:ring-opacity-50"
            >
              {isLoading ? 'Creating Account...' : 'Sign Up'}
            </button>
            <p className="text-center text-sm text-gray-600 mt-4">
              Already have an account? <a href="#" onClick={() => setIsLoginView(true)} className="text-blue-600 hover:underline">Sign in!</a>
            </p>
          </form>
        )}
      </div>
    </div>
  );
};

const DashboardPage = ({ user, courses, recommendedCourses }: { user: User, courses: Course[], recommendedCourses: Course[] }) => {
  const [view, setView] = useState<'grid' | 'list'>('grid');

  return (
    <div className="px-8 py-8 space-y-8">
      {/* Header Section */}
      <header className="bg-white p-6 rounded-xl shadow-lg flex flex-col md:flex-row items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.name}!</h1>
          <p className="text-gray-600 mt-2">Let's get learning. You have <span className="font-semibold text-blue-600">{user?.totalCourses}</span> courses enrolled.</p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center space-x-4">
          <div className="text-center">
            <p className="text-4xl font-extrabold text-green-600">{user?.currentStreak}</p>
            <p className="text-sm text-gray-500">Day Streak</p>
          </div>
          <img src={user?.avatarUrl} alt="User Avatar" className="w-16 h-16 rounded-full border-2 border-blue-500" />
        </div>
      </header>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Enrolled Courses Section */}
        <section className="md:col-span-2 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">Your Enrolled Courses</h2>
            <div className="flex items-center space-x-2">
              <button onClick={() => setView('grid')} className={`p-2 rounded-lg ${view === 'grid' ? 'bg-gray-200' : 'bg-transparent'}`}>
                <Layers size={20} />
              </button>
              <button onClick={() => setView('list')} className={`p-2 rounded-lg ${view === 'list' ? 'bg-gray-200' : 'bg-transparent'}`}>
                <ClipboardList size={20} />
              </button>
            </div>
          </div>
          <div className={`grid gap-6 ${view === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
            {courses.map(course => <CourseCard key={course.id} course={course} />)}
          </div>
        </section>

        {/* Recommended Courses Section */}
        <aside className="md:col-span-1 bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Recommended Courses</h2>
          <div className="space-y-4">
            {recommendedCourses.map(course => (
              <div key={course.id} className="flex items-center p-4 bg-gray-50 rounded-lg transition-colors hover:bg-gray-100">
                <img src={course.thumbnailUrl} alt={course.title} className="w-16 h-16 rounded-lg object-cover mr-4" />
                <div>
                  <h3 className="font-semibold text-gray-800">{course.title}</h3>
                  <p className="text-sm text-gray-600">{course.instructorName}</p>
                </div>
                <ArrowRight size={24} className="ml-auto text-blue-600" />
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
};

const AssignmentDetailModal = ({ assignment, onClose, updateAssignment }: { assignment: Assignment, onClose: () => void, updateAssignment: (id: string, updates: Partial<Assignment>) => void }) => {
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string>('');
  const [message, setMessage] = useState<string>('');

  const handleUpload = () => {
    setIsUploading(true);
    setUploadError('');
    setMessage('');
    setTimeout(() => {
      // Simulate API call and update
      try {
        updateAssignment(assignment.id, {
          status: 'Submitted',
          submissionHistory: [...assignment.submissionHistory, { submittedAt: new Date().toISOString(), fileUrl: '#', feedback: '', rubric: {} }],
        });
        setMessage("Assignment submitted successfully!");
        setIsUploading(false);
      } catch (e) {
        setUploadError("Failed to submit. Please try again.");
        setIsUploading(false);
      }
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-900 bg-opacity-75 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full p-6 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <X size={24} />
        </button>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">{assignment.assignmentName}</h2>
        <p className="text-sm text-gray-600 mb-4">Course: <span className="font-semibold">{assignment.courseName}</span></p>

        {uploadError && <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4">{uploadError}</div>}
        {message && <div className="bg-green-100 text-green-700 p-3 rounded-lg mb-4">{message}</div>}

        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Description</h3>
          <div className="p-4 bg-gray-100 rounded-lg text-gray-700">
            <p>{assignment.description}</p>
          </div>
        </div>

        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Submission</h3>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center text-gray-500">
            <UploadCloud size={48} className="mx-auto text-gray-400 mb-2" />
            <p className="font-semibold">Drag & drop your files here</p>
            <p className="text-sm mt-1">or <span className="text-blue-600 cursor-pointer hover:underline">browse files</span></p>
          </div>
          <button
            onClick={handleUpload}
            disabled={isUploading || assignment.status === 'Submitted' || assignment.status === 'Graded'}
            className={`mt-4 w-full py-2 px-4 rounded-full font-semibold transition-colors ${
              isUploading ? 'bg-gray-400' : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {isUploading ? 'Submitting...' : 'Submit Assignment'}
          </button>
        </div>

        {assignment.status === 'Submitted' && (
          <div className="mt-4 p-4 bg-yellow-100 text-yellow-800 rounded-lg">
            <h3 className="font-semibold">Submission History</h3>
            <p className="text-sm">Submitted on: {assignment.submissionHistory[0]?.submittedAt ? new Date(assignment.submissionHistory[0].submittedAt).toLocaleString() : 'N/A'}</p>
          </div>
        )}

        {assignment.status === 'Graded' && (
          <div className="mt-4 p-4 bg-green-100 text-green-800 rounded-lg">
            <h3 className="font-semibold">Feedback</h3>
            <p className="font-bold text-lg">Grade: {assignment.pointsEarned}/{assignment.pointsPossible}</p>
            <p className="text-sm">Instructor feedback: "{assignment.submissionHistory[0]?.feedback}"</p>
          </div>
        )}
      </div>
    </div>
  );
};


const AssignmentsPage = ({ assignments, updateAssignment }: { assignments: Assignment[], updateAssignment: (id: string, updates: Partial<Assignment>) => void }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'ascending' | 'descending' } | null>(null);
  const [modalAssignment, setModalAssignment] = useState<Assignment | null>(null);

  const sortedAssignments = React.useMemo(() => {
    let sortableItems = [...assignments];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        const aVal = (a as any)[sortConfig.key];
        const bVal = (b as any)[sortConfig.key];
        if (aVal < bVal) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (aVal > bVal) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [assignments, sortConfig]);

  const requestSort = (key: string) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const filteredAssignments = sortedAssignments.filter(assignment =>
    assignment.assignmentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    assignment.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    assignment.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const overdueCount = assignments.filter(a => a.status === 'Overdue').length;
  const completedCount = assignments.filter(a => a.status === 'Submitted' || a.status === 'Graded').length;
  const inProgressCount = assignments.filter(a => a.status === 'In Progress').length;
  const totalCount = assignments.length;

  return (
    <div className="px-8 py-8 space-y-8">
      <h1 className="text-3xl font-bold text-gray-900">Assignment Tracker</h1>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-lg flex flex-col items-center">
          <p className="text-4xl font-extrabold text-gray-800">{totalCount}</p>
          <p className="text-sm text-gray-500 mt-1">Total Assignments</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg flex flex-col items-center">
          <p className="text-4xl font-extrabold text-blue-600">{inProgressCount}</p>
          <p className="text-sm text-gray-500 mt-1">In Progress</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg flex flex-col items-center">
          <p className="text-4xl font-extrabold text-green-600">{completedCount}</p>
          <p className="text-sm text-gray-500 mt-1">Completed</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg flex flex-col items-center">
          <p className="text-4xl font-extrabold text-red-600">{overdueCount}</p>
          <p className="text-sm text-gray-500 mt-1">Overdue</p>
        </div>
      </div>

      {/* Assignment List */}
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 space-y-4 sm:space-y-0">
          <div className="relative w-full sm:w-1/3">
            <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search assignments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th onClick={() => requestSort('courseName')} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer">
                  Course
                </th>
                <th onClick={() => requestSort('assignmentName')} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer">
                  Assignment Name
                </th>
                <th onClick={() => requestSort('dueDate')} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer">
                  Due Date
                </th>
                <th onClick={() => requestSort('status')} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Points
                </th>
                <th className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAssignments.length > 0 ? (
                filteredAssignments.map((assignment) => {
                  const dueDate = new Date(assignment.dueDate);
                  const today = new Date();
                  const diffInDays = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
                  let dueDateClass = '';
                  if (diffInDays < 0) dueDateClass = 'text-red-600 font-semibold';
                  else if (diffInDays === 0) dueDateClass = 'text-orange-600 font-semibold';
                  else if (diffInDays <= 7) dueDateClass = 'text-yellow-600 font-semibold';

                  return (
                    <tr key={assignment.id} onClick={() => setModalAssignment(assignment)} className="hover:bg-gray-50 transition-colors cursor-pointer">
                      <td className="px-6 py-4 whitespace-nowrap">{assignment.courseName}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{assignment.assignmentName}</td>
                      <td className={`px-6 py-4 whitespace-nowrap ${dueDateClass}`}>
                        {format(dueDate, 'MMM d, yyyy')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={assignment.status} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {assignment.pointsEarned !== null ? `${assignment.pointsEarned} / ${assignment.pointsPossible}` : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button className="text-blue-600 hover:text-blue-900">View</button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">No assignments found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {modalAssignment && (
        <AssignmentDetailModal
          assignment={modalAssignment}
          onClose={() => setModalAssignment(null)}
          updateAssignment={updateAssignment}
        />
      )}
    </div>
  );
};

const ProgressAnalyticsPage = ({ analyticsData }: { analyticsData: AnalyticsData | null }) => {
  if (!analyticsData) {
    return (
      <div className="flex items-center justify-center px-8 py-8">
        <div className="text-center text-gray-500">Loading analytics data...</div>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  const { totalStudyHours, coursesCompleted, currentStreak, longestStreak, charts, achievements } = analyticsData;
  const completionColors = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#a4de6c'];

  return (
    <div className="px-8 py-8 space-y-8">
      <h1 className="text-3xl font-bold text-gray-900">Student Progress Analytics</h1>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-lg flex flex-col items-center">
          <p className="text-4xl font-extrabold text-gray-800">{totalStudyHours} hrs</p>
          <p className="text-sm text-gray-500 mt-1">Total Study Hours</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg flex flex-col items-center">
          <p className="text-4xl font-extrabold text-blue-600">{coursesCompleted}</p>
          <p className="text-sm text-gray-500 mt-1">Courses Completed</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg flex flex-col items-center">
          <p className="text-4xl font-extrabold text-green-600">{currentStreak}</p>
          <p className="text-sm text-gray-500 mt-1">Current Streak</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg flex flex-col items-center">
          <p className="text-4xl font-extrabold text-red-600">{longestStreak}</p>
          <p className="text-sm text-gray-500 mt-1">Longest Streak</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ChartContainer title="Study Time Last 30 Days">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={charts.studyHoursLast30Days}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="hours" stroke="#8884d8" activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>

        <ChartContainer title="Hours by Category">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={charts.hoursByCategory}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="hours" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>

      {/* Achievement System & Completion Rates */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-bold mb-4 text-gray-800">Your Achievements</h3>
          <div className="space-y-4">
            {achievements.map((achievement, index) => (
              <div key={index} className={`flex items-center p-4 rounded-lg transition-colors ${achievement.unlocked ? 'bg-green-100' : 'bg-gray-100'}`}>
                <CheckSquare size={24} className={`mr-4 ${achievement.unlocked ? 'text-green-600' : 'text-gray-400'}`} />
                <div>
                  <h4 className="font-semibold text-gray-800">{achievement.name}</h4>
                  <p className="text-sm text-gray-500">{achievement.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <ChartContainer title="Course Completion Rates">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={charts.completionRates}
                dataKey="completionPercentage"
                nameKey="courseName"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {charts.completionRates.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={completionColors[index % completionColors.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
    </div>
  );
};

const ProfilePage = ({ user, updateUser }: { user: User | null; updateUser: (updates: Partial<User>) => void }) => {
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setMessage('');
    try {
      await updateUser({ name, email });
      setMessage('Profile updated successfully!');
      setIsEditing(false);
    } catch (err) {
      setError('Failed to update profile.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return <div className="px-8 py-8 text-center text-gray-500">User data not available.</div>;
  }

  return (
    <div className="px-8 py-8 space-y-8">
      <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="flex items-center mb-8">
          <img src={user.avatarUrl} alt="User Avatar" className="w-24 h-24 rounded-full border-4 border-blue-500" />
          <div className="ml-6">
          <h2 className="text-2xl font-bold">{user.name}</h2>
            <p className="text-gray-500">{user.email}</p>
          </div>
        </div>

        {error && <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4">{error}</div>}
        {message && <div className="bg-green-100 text-green-700 p-3 rounded-lg mb-4">{message}</div>}

        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={!isEditing}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={!isEditing}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              />
            </div>
          </div>
          <div className="pt-4">
            {isEditing ? (
              <div className="flex space-x-4">
                <button type="submit" disabled={isLoading} className="bg-blue-600 text-white font-bold py-2 px-4 rounded-full hover:bg-blue-700 disabled:bg-gray-400 transition-colors">
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </button>
                <button type="button" onClick={() => setIsEditing(false)} className="bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-full hover:bg-gray-400 transition-colors">
                  Cancel
                </button>
              </div>
            ) : (
              <button type="button" onClick={() => setIsEditing(true)} className="bg-blue-600 text-white font-bold py-2 px-4 rounded-full hover:bg-blue-700 transition-colors">
                Edit Profile
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

// Component for the mobile bottom navigation bar
const MobileBottomNav = ({ currentPage, onNavClick }: { currentPage: string; onNavClick: (page: string) => void }) => {
  const navItems = [
    { name: 'Dashboard', icon: Home, page: 'dashboard' },
    { name: 'Assignments', icon: ClipboardList, page: 'assignments' },
    { name: 'Progress', icon: TrendingUp, page: 'analytics' },
    { name: 'Profile', icon: User, page: 'profile' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 lg:hidden bg-white shadow-xl border-t border-gray-200">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.page;
          return (
            <button
              key={item.page}
              onClick={() => onNavClick(item.page)}
              className={`flex flex-col items-center justify-center p-2 text-center transition-colors ${isActive ? 'text-blue-600' : 'text-gray-500 hover:text-blue-600'}`}
            >
              <Icon size={24} className="mb-1" />
              <span className="text-xs font-semibold">{item.name}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

// Main App Component
const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<'dashboard' | 'assignments' | 'analytics' | 'profile' | 'login'>('login');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [recommendedCourses, setRecommendedCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const authContextValue = {
    user,
    isAuthenticated,
    login: async (email: string, password: string) => {
      try {
        const userProfile = await MockAPI.login(email, password);
        setUser(userProfile);
        setIsAuthenticated(true);
        // Start data fetching after successful login
        fetchData(userProfile.id);
      } catch (err: any) {
        throw new Error(err.message || 'Login failed.');
      }
    },
    logout: () => {
      setIsAuthenticated(false);
      setUser(null);
      setCurrentPage('login');
    },
    updateUser: async (updates: Partial<User>) => {
      if (!user) return;
      // Optimistic update
      const prevUser = { ...user };
      setUser({ ...prevUser, ...updates });
      try {
        // Here you would call a real API, but we'll use a mock for now
        console.log('Mock API call to update user:', updates);
      } catch (e) {
        // Revert if update fails
        setUser(prevUser);
        throw new Error('Failed to update profile.');
      }
    },
  };
  
  // Effect to handle data fetching after user is authenticated
  const fetchData = async (currentUserId: string) => {
    try {
      setIsLoading(true);
      const fetchedCourses = await MockAPI.get('/api/courses/enrolled', currentUserId);
      const fetchedAssignments = await MockAPI.get('/api/assignments', currentUserId);
      const fetchedAnalytics = await MockAPI.get('/api/analytics', currentUserId);
      const fetchedRecommendations = await MockAPI.get('/api/recommendations', currentUserId);

      setCourses(fetchedCourses);
      setAssignments(fetchedAssignments);
      setAnalyticsData(fetchedAnalytics);
      setRecommendedCourses(fetchedRecommendations);
      setCurrentPage('dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to fetch data.');
    } finally {
      setIsLoading(false);
    }
  };

  const updateAssignment = async (id: string, updates: Partial<Assignment>) => {
    if (!user) {
      setError('User not authenticated.');
      return;
    }
    // Optimistic update
    const prevAssignments = [...assignments];
    setAssignments(assignments.map(a => a.id === id ? { ...a, ...updates } as Assignment : a));

    try {
      await MockAPI.put(`/api/assignments/${id}`, updates, user.id);
    } catch (e) {
      // Revert if update fails
      setAssignments(prevAssignments);
      setError('Failed to update assignment status.');
    }
  };

  const handleLoginSuccess = (userProfile: User) => {
    setUser(userProfile);
    setIsAuthenticated(true);
    setCurrentPage('dashboard');
    if (userProfile.id) {
      fetchData(userProfile.id);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
    setCurrentPage('login');
  };

  // Render content based on authentication and page state
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mb-4"></div>
          <div className="text-center text-gray-500 text-lg">Loading...</div>
        </div>
      );
    }

    if (!isAuthenticated) {
      return <LoginPage onLoginSuccess={handleLoginSuccess} />;
    }

    switch (currentPage) {
      case 'dashboard':
        return <DashboardPage user={user!} courses={courses} recommendedCourses={recommendedCourses} />;
      case 'assignments':
        return <AssignmentsPage assignments={assignments} updateAssignment={updateAssignment} />;
      case 'analytics':
        return <ProgressAnalyticsPage analyticsData={analyticsData} />;
      case 'profile':
        return <ProfilePage user={user} updateUser={authContextValue.updateUser} />;
      default:
        return <DashboardPage user={user!} courses={courses} recommendedCourses={recommendedCourses} />;
    }
  };

  // Main UI layout
  return (
    <AuthContext.Provider value={authContextValue}>
      <div className="font-sans antialiased text-gray-900 bg-gray-100 min-h-screen flex">
        {/* Desktop Sidebar (hidden on small screens) */}
        {isAuthenticated && (
          <aside className="hidden lg:flex w-64 bg-white p-6 flex-col shadow-xl">
            <div className="flex-grow space-y-2">
              <nav className="space-y-1">
                <button onClick={() => setCurrentPage('dashboard')} className={`flex items-center w-full px-4 py-3 rounded-xl transition-colors ${currentPage === 'dashboard' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}>
                  <Home size={20} className="mr-3" />
                  <span className="font-semibold">Dashboard</span>
                </button>
                <button onClick={() => setCurrentPage('assignments')} className={`flex items-center w-full px-4 py-3 rounded-xl transition-colors ${currentPage === 'assignments' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}>
                  <ClipboardList size={20} className="mr-3" />
                  <span className="font-semibold">Assignments</span>
                </button>
                <button onClick={() => setCurrentPage('analytics')} className={`flex items-center w-full px-4 py-3 rounded-xl transition-colors ${currentPage === 'analytics' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}>
                  <TrendingUp size={20} className="mr-3" />
                  <span className="font-semibold">Progress</span>
                </button>
                <button onClick={() => setCurrentPage('profile')} className={`flex items-center w-full px-4 py-3 rounded-xl transition-colors ${currentPage === 'profile' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}>
                  <User size={20} className="mr-3" />
                  <span className="font-semibold">Profile</span>
                </button>
              </nav>
            </div>
            <button onClick={handleLogout} className="mt-auto flex items-center w-full px-4 py-3 text-red-600 font-semibold hover:bg-red-100 rounded-xl transition-colors">
              <LogOut size={20} className="mr-3" />
              Sign Out
            </button>
          </aside>
        )}
        {/* Main content area */}
        <main className="flex-grow flex flex-col pb-16 lg:pb-8">
          {renderContent()}
        </main>
        {/* Mobile bottom navigation (hidden on large screens) */}
        {isAuthenticated && <MobileBottomNav currentPage={currentPage} onNavClick={setCurrentPage} />}
      </div>
    </AuthContext.Provider>
  );
};

export default App;
