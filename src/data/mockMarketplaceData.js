import { DEFAULT_CAMPUS_CATEGORIES } from './categoriesData';

export const INITIAL_CAMPUS_GIGS = [
  {
    id: 'gig-demo-1',
    title: 'React & Tailwind Component Debugging & Responsive Mobile Polish',
    description: 'Fix messy layouts, responsive flexbox bugs, and optimize re-renders for student web projects in 24 hours. Full code review and Git PR included.',
    price: 25.00,
    category_id: 1,
    category: { id: 1, name: 'Web & Software Development', icon: '💻' },
    seller_id: 101,
    seller: { id: 101, full_name: 'Alex Rivera', university_name: 'Stanford University (CS)', email: 'alex@stanford.edu' },
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    turnaround_days: 1,
    rating: 5.0,
    reviews_count: 14,
  },
  {
    id: 'gig-demo-2',
    title: 'Python Web Scraper & Clean Pandas Dataset Pipeline for Research',
    description: 'Automated BeautifulSoup / Selenium scripts to harvest research data and clean into structured CSV/JSON formats with Jupyter Notebook documentation.',
    price: 35.00,
    category_id: 2,
    category: { id: 2, name: 'Python Scripts & Data Analysis', icon: '🐍' },
    seller_id: 102,
    seller: { id: 102, full_name: 'Marcus Chen', university_name: 'MIT EECS', email: 'marcus@mit.edu' },
    created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
    turnaround_days: 2,
    rating: 4.9,
    reviews_count: 9,
  },
  {
    id: 'gig-demo-3',
    title: 'Modern Figma Mobile App UI Prototyping & Interactive Design System',
    description: 'Clean Figma layouts, interactive micro-animations, and reusable design tokens for university project pitches, student hackathons, and research presentations.',
    price: 45.00,
    category_id: 3,
    category: { id: 3, name: 'UI/UX & Graphic Design', icon: '🎨' },
    seller_id: 103,
    seller: { id: 103, full_name: 'Elena Rostova', university_name: 'UC Berkeley Design Lab', email: 'elena@berkeley.edu' },
    created_at: new Date(Date.now() - 86400000 * 4).toISOString(),
    turnaround_days: 3,
    rating: 5.0,
    reviews_count: 22,
  },
  {
    id: 'gig-demo-4',
    title: 'LaTeX Academic Report & Thesis Template Typesetting (IEEE / ACM)',
    description: 'Turn messy Word docs or Markdown drafts into IEEE / ACM publication-grade LaTeX documents with BibTeX reference formatting and equation vector figures.',
    price: 20.00,
    category_id: 4,
    category: { id: 4, name: 'Academic Tech & LaTeX Typesetting', icon: '📄' },
    seller_id: 104,
    seller: { id: 104, full_name: 'Devon Patel', university_name: 'Georgia Tech', email: 'devon@gatech.edu' },
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    turnaround_days: 1,
    rating: 4.8,
    reviews_count: 11,
  },
  {
    id: 'gig-demo-5',
    title: 'FastAPI Backend Endpoint Integration & REST API Bug Fixes',
    description: 'Build asynchronous endpoints, Pydantic validation schemas, and database session models with clean unit tests and Swagger documentation.',
    price: 40.00,
    category_id: 1,
    category: { id: 1, name: 'Web & Software Development', icon: '💻' },
    seller_id: 105,
    seller: { id: 105, full_name: 'Sofia Gomez', university_name: 'Carnegie Mellon University', email: 'sofia@cmu.edu' },
    created_at: new Date(Date.now() - 86400000 * 6).toISOString(),
    turnaround_days: 2,
    rating: 5.0,
    reviews_count: 17,
  },
  {
    id: 'gig-demo-6',
    title: 'Machine Learning Model Fine-Tuning & PyTorch Inference Script',
    description: 'Implement transfer learning on HuggingFace or PyTorch models for course project deliverables, hyperparameter tuning, and metric visualization.',
    price: 50.00,
    category_id: 5,
    category: { id: 5, name: 'AI & Machine Learning', icon: '🤖' },
    seller_id: 106,
    seller: { id: 106, full_name: 'Liam Zhang', university_name: 'UW Madison', email: 'liam@wisc.edu' },
    created_at: new Date(Date.now() - 86400000 * 7).toISOString(),
    turnaround_days: 3,
    rating: 4.9,
    reviews_count: 8,
  },
];

export const INITIAL_CAMPUS_TASKS = [
  {
    id: 'task-demo-1',
    title: 'Need a Python script to parse 500 PDF lab sensor logs into Excel',
    description: 'Looking for a peer to write a clean script parsing tabular columns from lab sensor export files. Need this within 24 hours.',
    budget: 30.00,
    category_id: 2,
    category: { id: 2, name: 'Python Scripts & Data Analysis' },
    client_id: 201,
    client: { id: 201, full_name: 'Sarah Jenkins', university_name: 'Stanford EE' },
    status: 'open',
    created_at: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'task-demo-2',
    title: 'Debug React hydration mismatch and dark mode toggle flashing',
    description: 'Quick 1-hour task: Help me identify why my local storage theme flashes white on reload in my Vite app.',
    budget: 20.00,
    category_id: 1,
    category: { id: 1, name: 'Web & Software Development' },
    client_id: 202,
    client: { id: 202, full_name: 'Jordan Lee', university_name: 'MIT EECS' },
    status: 'open',
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: 'task-demo-3',
    title: 'Design 5 pitch deck slides in Figma for our campus startup demo day',
    description: 'Need a visually stunning slide deck for our AI study companion app. Brand palette is cool cyan and charcoal.',
    budget: 45.00,
    category_id: 3,
    category: { id: 3, name: 'UI/UX & Graphic Design' },
    client_id: 203,
    client: { id: 203, full_name: 'Chloe Bennett', university_name: 'UC Berkeley' },
    status: 'open',
    created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
];

// Local Storage Managers
const GIGS_STORAGE_KEY = 'campusgig_local_gigs';
const TASKS_STORAGE_KEY = 'campusgig_local_tasks';

export const getStoredLocalGigs = () => {
  try {
    const raw = localStorage.getItem(GIGS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const saveStoredLocalGig = (gig) => {
  try {
    const current = getStoredLocalGigs();
    const filtered = current.filter((g) => String(g.id) !== String(gig.id));
    const updated = [gig, ...filtered];
    localStorage.setItem(GIGS_STORAGE_KEY, JSON.stringify(updated));
    return gig;
  } catch (err) {
    console.error('Failed to save gig to localStorage:', err);
    return gig;
  }
};

export const updateStoredLocalGig = (id, data) => {
  try {
    const current = getStoredLocalGigs();
    const idx = current.findIndex((g) => String(g.id) === String(id));
    if (idx !== -1) {
      current[idx] = { ...current[idx], ...data, updated_at: new Date().toISOString() };
      localStorage.setItem(GIGS_STORAGE_KEY, JSON.stringify(current));
      return current[idx];
    }
  } catch (err) {
    console.error('Failed to update gig in localStorage:', err);
  }
  return null;
};

export const deleteStoredLocalGig = (id) => {
  try {
    const current = getStoredLocalGigs();
    const filtered = current.filter((g) => String(g.id) !== String(id));
    localStorage.setItem(GIGS_STORAGE_KEY, JSON.stringify(filtered));
    return true;
  } catch (err) {
    console.error('Failed to delete gig from localStorage:', err);
    return false;
  }
};

// Tasks Local Storage Managers
export const getStoredLocalTasks = () => {
  try {
    const raw = localStorage.getItem(TASKS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const saveStoredLocalTask = (task) => {
  try {
    const current = getStoredLocalTasks();
    const filtered = current.filter((t) => String(t.id) !== String(task.id));
    const updated = [task, ...filtered];
    localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(updated));
    return task;
  } catch (err) {
    console.error('Failed to save task to localStorage:', err);
    return task;
  }
};

export const updateStoredLocalTask = (id, data) => {
  try {
    const current = getStoredLocalTasks();
    const idx = current.findIndex((t) => String(t.id) === String(id));
    if (idx !== -1) {
      current[idx] = { ...current[idx], ...data, updated_at: new Date().toISOString() };
      localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(current));
      return current[idx];
    }
  } catch (err) {
    console.error('Failed to update task in localStorage:', err);
  }
  return null;
};

export const deleteStoredLocalTask = (id) => {
  try {
    const current = getStoredLocalTasks();
    const filtered = current.filter((t) => String(t.id) !== String(id));
    localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(filtered));
    return true;
  } catch (err) {
    console.error('Failed to delete task from localStorage:', err);
    return false;
  }
};
