export interface UserProfile {
  name: string;
  role: string;
  email: string;
  avatar: string;
  status: 'online' | 'offline' | 'busy';
}

export interface StatMetric {
  id: string;
  label: string;
  value: string;
  change: string;
  isPositive: boolean;
  color: 'orange' | 'purple' | 'blue' | 'green' | 'pink';
  icon: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  techStack: string;
  description: string;
  progress: number;
  priority: 'High' | 'Medium' | 'Low';
  status: 'In Progress' | 'Completed' | 'On Hold';
  dueDate: string;
  color: 'blue' | 'green' | 'purple' | 'cyan' | 'orange' | 'pink';
  team: { name: string; avatar: string }[];
  extraTeamCount?: number;
}

export interface TaskItem {
  id: string;
  title: string;
  project: string;
  projectIcon?: string;
  category: string;
  dueDate: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'To Do' | 'In Progress' | 'Review' | 'Completed';
  assignee: { name: string; avatar: string };
  completed?: boolean;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Developer' | 'Designer' | 'Product Lead';
  projectsCount: number;
  tasksCount: number;
  status: 'Active' | 'Offline';
  joinedDate: string;
  avatar: string;
}

export interface ClientItem {
  id: string;
  name: string;
  email: string;
  company: string;
  projectsCount: number;
  status: 'Active' | 'In Progress' | 'Completed';
  totalSpent: string;
  avatar: string;
}

export interface InvoiceItem {
  id: string;
  invoiceNumber: string;
  client: { name: string; avatar: string };
  project: string;
  amount: string;
  status: 'Paid' | 'Pending' | 'Overdue' | 'Cancelled';
  issueDate: string;
  dueDate: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  day: number;
  time: string;
  type: 'Meeting' | 'Review' | 'Kickoff' | 'Call' | 'Release' | 'Deadline' | 'Delivery';
  color: 'purple' | 'green' | 'orange' | 'blue' | 'red';
}

export interface ActivityItem {
  id: string;
  user: { name: string; avatar: string };
  action: string;
  target: string;
  timestamp: string;
  type: 'created' | 'completed' | 'updated';
  color: 'orange' | 'purple' | 'green' | 'blue';
}

// -----------------------------------------------------------------------------
// Sample Datasets Matching the Theme PNGs
// -----------------------------------------------------------------------------

export const CURRENT_USER: UserProfile = {
  name: 'John Developer',
  role: 'Admin',
  email: 'john@todedev.com',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  status: 'online',
};

export const PRO_PLAN_INFO = {
  planName: 'Pro Plan',
  duration: '12 Months · 4 Developers',
  buttonText: 'Manage Plan',
};

export const OVERVIEW_METRICS: StatMetric[] = [
  {
    id: 'projects',
    label: 'Total Projects',
    value: '12',
    change: '+33%',
    isPositive: true,
    color: 'orange',
    icon: 'Code2',
  },
  {
    id: 'members',
    label: 'Team Members',
    value: '4',
    change: '+0%',
    isPositive: true,
    color: 'purple',
    icon: 'Users',
  },
  {
    id: 'tasks',
    label: 'Total Tasks',
    value: '24',
    change: '+20%',
    isPositive: true,
    color: 'blue',
    icon: 'CheckCircle2',
  },
  {
    id: 'progress',
    label: 'Progress',
    value: '76%',
    change: '+12%',
    isPositive: true,
    color: 'green',
    icon: 'BarChart2',
  },
];

export const PROJECTS_LIST: ProjectItem[] = [
  {
    id: 'p-1',
    title: 'Mobile App',
    techStack: 'Flutter · Android · iOS',
    description: 'A cross-platform mobile application with modern UI and real-time features.',
    progress: 85,
    priority: 'High',
    status: 'In Progress',
    dueDate: 'Due: Oct 28, 2026',
    color: 'blue',
    team: [
      { name: 'John Developer', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&fit=crop&q=80' },
      { name: 'Sarah Designer', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&fit=crop&q=80' },
      { name: 'Ahmed Coder', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&fit=crop&q=80' },
    ],
    extraTeamCount: 2,
  },
  {
    id: 'p-2',
    title: 'E-Commerce',
    techStack: 'Next.js · Node.js',
    description: 'A modern e-commerce platform with payments, orders, and admin panel.',
    progress: 100,
    priority: 'Medium',
    status: 'Completed',
    dueDate: 'Due: Oct 20, 2026',
    color: 'green',
    team: [
      { name: 'John Developer', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&fit=crop&q=80' },
      { name: 'Ahmed Coder', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&fit=crop&q=80' },
    ],
  },
  {
    id: 'p-3',
    title: 'Admin Dashboard',
    techStack: 'React · Express',
    description: 'A powerful admin dashboard to manage users, data, and analytics.',
    progress: 60,
    priority: 'High',
    status: 'In Progress',
    dueDate: 'Due: Nov 5, 2026',
    color: 'purple',
    team: [
      { name: 'John Developer', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&fit=crop&q=80' },
      { name: 'Youssef Dev', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&fit=crop&q=80' },
    ],
    extraTeamCount: 1,
  },
  {
    id: 'p-4',
    title: 'Landing Page',
    techStack: 'React · Tailwind',
    description: 'A responsive landing page for a SaaS product with high conversion.',
    progress: 100,
    priority: 'Low',
    status: 'Completed',
    dueDate: 'Due: Oct 15, 2026',
    color: 'cyan',
    team: [
      { name: 'Sarah Designer', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&fit=crop&q=80' },
      { name: 'Ahmed Coder', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&fit=crop&q=80' },
    ],
  },
  {
    id: 'p-5',
    title: 'API Integration',
    techStack: 'Node.js · REST API',
    description: 'Integrate third-party APIs and build secure endpoints.',
    progress: 75,
    priority: 'Medium',
    status: 'In Progress',
    dueDate: 'Due: Oct 30, 2026',
    color: 'orange',
    team: [
      { name: 'John Developer', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&fit=crop&q=80' },
      { name: 'Ahmed Coder', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&fit=crop&q=80' },
    ],
  },
  {
    id: 'p-6',
    title: 'UI Design System',
    techStack: 'Figma · Tailwind',
    description: 'A reusable UI component library with design tokens and documentation.',
    progress: 50,
    priority: 'Medium',
    status: 'In Progress',
    dueDate: 'Due: Nov 10, 2026',
    color: 'pink',
    team: [
      { name: 'Sarah Designer', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&fit=crop&q=80' },
      { name: 'Youssef Dev', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&fit=crop&q=80' },
    ],
  },
];

export const TASKS_LIST: TaskItem[] = [
  // To Do (4)
  {
    id: 't-1',
    title: 'Setup project repository',
    project: 'Mobile App',
    category: 'Web App',
    dueDate: 'Oct 25',
    priority: 'High',
    status: 'To Do',
    assignee: { name: 'John Developer', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&fit=crop&q=80' },
    completed: false,
  },
  {
    id: 't-2',
    title: 'Create UI components',
    project: 'UI Kit',
    category: 'UI Kit',
    dueDate: 'Oct 26',
    priority: 'Medium',
    status: 'To Do',
    assignee: { name: 'Ahmed Coder', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&fit=crop&q=80' },
    completed: false,
  },
  {
    id: 't-3',
    title: 'Configure auth providers',
    project: 'Admin Dashboard',
    category: 'Security',
    dueDate: 'Oct 27',
    priority: 'High',
    status: 'To Do',
    assignee: { name: 'Youssef Dev', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&fit=crop&q=80' },
    completed: false,
  },
  {
    id: 't-4',
    title: 'Setup email notifications',
    project: 'E-Commerce',
    category: 'Backend',
    dueDate: 'Oct 28',
    priority: 'Low',
    status: 'To Do',
    assignee: { name: 'Sarah Designer', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&fit=crop&q=80' },
    completed: false,
  },

  // In Progress (6)
  {
    id: 't-5',
    title: 'Design dashboard UI',
    project: 'Admin Dashboard',
    category: 'Dashboard',
    dueDate: 'Oct 28',
    priority: 'High',
    status: 'In Progress',
    assignee: { name: 'Sarah Designer', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&fit=crop&q=80' },
    completed: false,
  },
  {
    id: 't-6',
    title: 'Integrate API endpoints',
    project: 'Mobile App',
    category: 'Backend',
    dueDate: 'Oct 29',
    priority: 'Medium',
    status: 'In Progress',
    assignee: { name: 'John Developer', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&fit=crop&q=80' },
    completed: false,
  },
  {
    id: 't-7',
    title: 'Optimize image assets',
    project: 'Landing Page',
    category: 'Performance',
    dueDate: 'Oct 29',
    priority: 'Low',
    status: 'In Progress',
    assignee: { name: 'Ahmed Coder', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&fit=crop&q=80' },
    completed: false,
  },
  {
    id: 't-8',
    title: 'Database indexing & query audit',
    project: 'API Integration',
    category: 'Database',
    dueDate: 'Oct 30',
    priority: 'High',
    status: 'In Progress',
    assignee: { name: 'Youssef Dev', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&fit=crop&q=80' },
    completed: false,
  },
  {
    id: 't-9',
    title: 'Create invoice generator export',
    project: 'Admin Dashboard',
    category: 'Billing',
    dueDate: 'Nov 01',
    priority: 'Medium',
    status: 'In Progress',
    assignee: { name: 'John Developer', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&fit=crop&q=80' },
    completed: false,
  },
  {
    id: 't-10',
    title: 'Implement Dark / Light theme persist',
    project: 'UI Kit',
    category: 'Theme',
    dueDate: 'Nov 02',
    priority: 'Medium',
    status: 'In Progress',
    assignee: { name: 'Sarah Designer', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&fit=crop&q=80' },
    completed: false,
  },

  // Review (3)
  {
    id: 't-11',
    title: 'Code review & testing',
    project: 'E-Commerce',
    category: 'Testing',
    dueDate: 'Oct 30',
    priority: 'Medium',
    status: 'Review',
    assignee: { name: 'Ahmed Coder', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&fit=crop&q=80' },
    completed: false,
  },
  {
    id: 't-12',
    title: 'Update documentation',
    project: 'UI Kit',
    category: 'Docs',
    dueDate: 'Oct 30',
    priority: 'Low',
    status: 'Review',
    assignee: { name: 'Sarah Designer', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&fit=crop&q=80' },
    completed: false,
  },
  {
    id: 't-13',
    title: 'QA automated test suite',
    project: 'API Integration',
    category: 'QA',
    dueDate: 'Oct 31',
    priority: 'High',
    status: 'Review',
    assignee: { name: 'Youssef Dev', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&fit=crop&q=80' },
    completed: false,
  },

  // Completed (11)
  {
    id: 't-14',
    title: 'Landing page design',
    project: 'Landing Page',
    category: 'Design',
    dueDate: 'Oct 15',
    priority: 'High',
    status: 'Completed',
    assignee: { name: 'Sarah Designer', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&fit=crop&q=80' },
    completed: true,
  },
  {
    id: 't-15',
    title: 'Fix responsive issues',
    project: 'Landing Page',
    category: 'Frontend',
    dueDate: 'Oct 16',
    priority: 'Medium',
    status: 'Completed',
    assignee: { name: 'Ahmed Coder', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&fit=crop&q=80' },
    completed: true,
  },
  {
    id: 't-16',
    title: 'Setup Gumroad checkout modal',
    project: 'Landing Page',
    category: 'Payments',
    dueDate: 'Oct 17',
    priority: 'High',
    status: 'Completed',
    assignee: { name: 'John Developer', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&fit=crop&q=80' },
    completed: true,
  },
];

export const TEAM_MEMBERS: TeamMember[] = [
  {
    id: 'tm-1',
    name: 'John Developer',
    email: 'john@todedev.com',
    role: 'Admin',
    projectsCount: 12,
    tasksCount: 24,
    status: 'Active',
    joinedDate: 'Oct 1, 2026',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&fit=crop&q=80',
  },
  {
    id: 'tm-2',
    name: 'Sarah Designer',
    email: 'sarah@todedev.com',
    role: 'Developer',
    projectsCount: 8,
    tasksCount: 16,
    status: 'Active',
    joinedDate: 'Oct 5, 2026',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&fit=crop&q=80',
  },
  {
    id: 'tm-3',
    name: 'Ahmed Coder',
    email: 'ahmed@todedev.com',
    role: 'Developer',
    projectsCount: 6,
    tasksCount: 12,
    status: 'Active',
    joinedDate: 'Oct 7, 2026',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&fit=crop&q=80',
  },
  {
    id: 'tm-4',
    name: 'Youssef Dev',
    email: 'youssef@todedev.com',
    role: 'Developer',
    projectsCount: 5,
    tasksCount: 9,
    status: 'Active',
    joinedDate: 'Oct 10, 2026',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&fit=crop&q=80',
  },
];

export const CLIENTS_LIST: ClientItem[] = [
  {
    id: 'c-1',
    name: 'Michael Brown',
    email: 'michael@company.com',
    company: 'TechVision',
    projectsCount: 3,
    status: 'Active',
    totalSpent: '$6,500',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&fit=crop&q=80',
  },
  {
    id: 'c-2',
    name: 'Emma Wilson',
    email: 'emma@bright.com',
    company: 'Bright Labs',
    projectsCount: 2,
    status: 'Active',
    totalSpent: '$4,200',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&fit=crop&q=80',
  },
  {
    id: 'c-3',
    name: 'David Miller',
    email: 'david@nextapp.com',
    company: 'NextApp',
    projectsCount: 4,
    status: 'In Progress',
    totalSpent: '$7,800',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&fit=crop&q=80',
  },
  {
    id: 'c-4',
    name: 'James Taylor',
    email: 'james@creativestudio.com',
    company: 'Creative Studio',
    projectsCount: 1,
    status: 'Active',
    totalSpent: '$2,500',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=120&fit=crop&q=80',
  },
  {
    id: 'c-5',
    name: 'Sophia Clark',
    email: 'sophia@inovate.com',
    company: 'Inovate Ltd',
    projectsCount: 2,
    status: 'Completed',
    totalSpent: '$3,750',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&fit=crop&q=80',
  },
];

export const INVOICES_LIST: InvoiceItem[] = [
  {
    id: 'inv-1',
    invoiceNumber: 'INV-0042',
    client: {
      name: 'Michael Brown',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&fit=crop&q=80',
    },
    project: 'Mobile App',
    amount: '$6,500',
    status: 'Paid',
    issueDate: 'Oct 1, 2026',
    dueDate: 'Oct 8, 2026',
  },
  {
    id: 'inv-2',
    invoiceNumber: 'INV-0041',
    client: {
      name: 'Emma Wilson',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&fit=crop&q=80',
    },
    project: 'E-Commerce',
    amount: '$4,200',
    status: 'Pending',
    issueDate: 'Oct 3, 2026',
    dueDate: 'Oct 10, 2026',
  },
  {
    id: 'inv-3',
    invoiceNumber: 'INV-0040',
    client: {
      name: 'David Miller',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&fit=crop&q=80',
    },
    project: 'Landing Page',
    amount: '$2,500',
    status: 'Paid',
    issueDate: 'Sep 28, 2026',
    dueDate: 'Oct 5, 2026',
  },
  {
    id: 'inv-4',
    invoiceNumber: 'INV-0039',
    client: {
      name: 'James Taylor',
      avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=80&fit=crop&q=80',
    },
    project: 'UI Design',
    amount: '$3,750',
    status: 'Overdue',
    issueDate: 'Sep 20, 2026',
    dueDate: 'Sep 27, 2026',
  },
  {
    id: 'inv-5',
    invoiceNumber: 'INV-0038',
    client: {
      name: 'Sophia Clark',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&fit=crop&q=80',
    },
    project: 'API Integration',
    amount: '$5,800',
    status: 'Paid',
    issueDate: 'Sep 15, 2026',
    dueDate: 'Sep 22, 2026',
  },
];

export const CALENDAR_EVENTS: CalendarEvent[] = [
  { id: 'ev-1', title: 'Team Meeting', day: 1, time: '10:00 AM - 11:00 AM', type: 'Meeting', color: 'purple' },
  { id: 'ev-2', title: 'UI Review', day: 3, time: '2:00 PM - 3:00 PM', type: 'Review', color: 'green' },
  { id: 'ev-3', title: 'Project Kickoff', day: 6, time: '2:00 PM - 3:00 PM', type: 'Kickoff', color: 'orange' },
  { id: 'ev-4', title: 'Client Call', day: 9, time: '4:00 PM - 4:30 PM', type: 'Call', color: 'blue' },
  { id: 'ev-5', title: 'Sprint Planning', day: 13, time: '11:00 AM - 12:30 PM', type: 'Meeting', color: 'purple' },
  { id: 'ev-6', title: 'Release v1.2', day: 15, time: '9:00 AM', type: 'Release', color: 'green' },
  { id: 'ev-7', title: 'Design Review', day: 18, time: '3:00 PM - 4:00 PM', type: 'Review', color: 'orange' },
  { id: 'ev-8', title: 'Progress Update', day: 20, time: '10:00 AM - 10:30 AM', type: 'Meeting', color: 'blue' },
  { id: 'ev-9', title: 'Code Review', day: 23, time: '4:00 PM - 5:00 PM', type: 'Review', color: 'purple' },
  { id: 'ev-10', title: 'Project Deadline', day: 27, time: '5:00 PM', type: 'Deadline', color: 'green' },
  { id: 'ev-11', title: 'Final Delivery', day: 30, time: '6:00 PM', type: 'Delivery', color: 'red' },
];

export const ACTIVITY_FEED: ActivityItem[] = [
  {
    id: 'act-1',
    user: {
      name: 'Sarah Designer',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&fit=crop&q=80',
    },
    action: 'updated the project',
    target: 'Mobile App',
    timestamp: '5 min ago',
    type: 'updated',
    color: 'orange',
  },
  {
    id: 'act-2',
    user: {
      name: 'Ahmed Coder',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&fit=crop&q=80',
    },
    action: 'completed task',
    target: 'Design UI',
    timestamp: '20 min ago',
    type: 'completed',
    color: 'green',
  },
  {
    id: 'act-3',
    user: {
      name: 'Youssef Dev',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&fit=crop&q=80',
    },
    action: 'created a new task',
    target: 'API Integration',
    timestamp: '45 min ago',
    type: 'created',
    color: 'blue',
  },
];

export const DASHBOARD_NAV_ITEMS = [
  { id: 'overview', label: 'Dashboard', href: '/dashboard', icon: 'Home' },
  { id: 'projects', label: 'Projects', href: '/dashboard/projects', icon: 'Layers', badge: 12 },
  { id: 'tasks', label: 'Tasks', href: '/dashboard/tasks', icon: 'CheckSquare', badge: 24 },
  { id: 'team', label: 'Team', href: '/dashboard/team', icon: 'Users' },
  { id: 'clients', label: 'Clients', href: '/dashboard/clients', icon: 'UserCheck' },
  { id: 'invoices', label: 'Invoices', href: '/dashboard/invoices', icon: 'CreditCard' },
  { id: 'reports', label: 'Reports', href: '/dashboard/reports', icon: 'BarChart2' },
  { id: 'calendar', label: 'Calendar', href: '/dashboard/calendar', icon: 'Calendar' },
  { id: 'settings', label: 'Settings', href: '/dashboard/settings', icon: 'Settings' },
];

