import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { gigsApi } from '../api/gigsApi';
import { tasksApi } from '../api/tasksApi';
import { GigCard } from '../components/gigs/GigCard';
import { TaskCard } from '../components/tasks/TaskCard';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';
import { SkillMatcherModal } from '../components/matching/SkillMatcherModal';
import { ProposalModal } from '../components/tasks/ProposalModal';
import { use3DTilt } from '../hooks/use3DTilt';
import { 
  FiSearch, 
  FiAward, 
  FiShield, 
  FiCheckCircle, 
  FiArrowRight, 
  FiZap, 
  FiClock, 
  FiCode, 
  FiTrendingUp,
  FiTerminal
} from 'react-icons/fi';
import { HiSparkles } from 'react-icons/hi2';

// Curated campus fallback items to ensure the UI is vibrant even before backend seeding
const FALLBACK_CAMPUS_GIGS = [
  {
    id: 'demo-1',
    title: 'React & Tailwind Component Debugging & Responsive Mobile Polish',
    description: 'Fix messy layouts, responsive flexbox bugs, and optimize re-renders for student web projects in 24 hours.',
    price: 25.00,
    category: { name: 'Frontend Dev' },
    seller: { id: 's1', full_name: 'Alex Rivera', university_name: 'Stanford CS' },
  },
  {
    id: 'demo-2',
    title: 'Python Web Scraper & Clean Pandas Dataset Pipeline for Research',
    description: 'Automated Beautifulsoup / Selenium scripts to harvest research data and clean into CSV/JSON format.',
    price: 35.00,
    category: { name: 'Data & Scripting' },
    seller: { id: 's2', full_name: 'Marcus Chen', university_name: 'MIT EECS' },
  },
  {
    id: 'demo-3',
    title: 'Modern Figma Mobile App UI Prototyping & Design System',
    description: 'Clean Figma layouts, interactive micro-animations, and reusable design tokens for university project pitches.',
    price: 45.00,
    category: { name: 'UI/UX Design' },
    seller: { id: 's3', full_name: 'Elena Rostova', university_name: 'Berkeley Design' },
  },
  {
    id: 'demo-4',
    title: 'LaTeX Academic Report & Thesis Template Typesetting',
    description: 'Turn your messy Word doc or Markdown drafts into IEEE / ACM publication-grade LaTeX documents.',
    price: 20.00,
    category: { name: 'Academic Tech' },
    seller: { id: 's4', full_name: 'Devon Patel', university_name: 'Georgia Tech' },
  },
  {
    id: 'demo-5',
    title: 'FastAPI Backend Endpoint Integration & REST API Bug Fixes',
    description: 'Build asynchronous endpoints, Pydantic validation schemas, and database session models with clean tests.',
    price: 40.00,
    category: { name: 'Backend Dev' },
    seller: { id: 's5', full_name: 'Sofia Gomez', university_name: 'Carnegie Mellon' },
  },
  {
    id: 'demo-6',
    title: 'Machine Learning Model Fine-Tuning & PyTorch Inference Script',
    description: 'Implement transfer learning on HuggingFace or PyTorch models for course project deliverables.',
    price: 50.00,
    category: { name: 'AI & ML' },
    seller: { id: 's6', full_name: 'Liam Zhang', university_name: 'UW Madison' },
  },
];

const FALLBACK_CAMPUS_TASKS = [
  {
    id: 'task-demo-1',
    title: 'Need a Python script to parse 500 PDF lab sensor logs into Excel',
    description: 'Looking for a peer to write a clean script parsing tabular columns from lab sensor export files. Need this within 24 hours.',
    budget: 30.00,
    status: 'open',
  },
  {
    id: 'task-demo-2',
    title: 'Debug React hydration mismatch and dark mode toggle flashing',
    description: 'Quick 1-hour task: Help me identify why my local storage theme flashes white on reload in my Vite app.',
    budget: 20.00,
    status: 'open',
  },
  {
    id: 'task-demo-3',
    title: 'Convert Figma desktop prototype into clean Tailwind HTML/CSS components',
    description: 'Need 4 landing sections coded up with vanilla HTML/CSS or React + Tailwind. Components must be modular.',
    budget: 65.00,
    status: 'open',
  },
  {
    id: 'task-demo-4',
    title: 'Write SQL query optimization for a PostgreSQL course project schema',
    description: 'Queries are timing out with large join tables. Need someone with solid indexing knowledge to optimize query plans.',
    budget: 35.00,
    status: 'open',
  },
];

export const Home = () => {
  const [featuredGigs, setFeaturedGigs] = useState([]);
  const [recentTasks, setRecentTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [matcherOpen, setMatcherOpen] = useState(false);
  const [selectedTaskForProposal, setSelectedTaskForProposal] = useState(null);
  const navigate = useNavigate();

  // 3D Tilt hook for Hero Showcase Card
  const heroTilt = use3DTilt({ maxTilt: 10, scale: 1.02, glare: true });

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        setLoading(true);
        const [gigsRes, tasksRes] = await Promise.allSettled([
          gigsApi.getGigs({ size: 6, sort_by: 'newest' }),
          tasksApi.getTasks({ size: 4, status_filter: 'open', sort_by: 'newest' }),
        ]);

        if (gigsRes.status === 'fulfilled' && gigsRes.value?.items && gigsRes.value.items.length > 0) {
          setFeaturedGigs(gigsRes.value.items);
        } else {
          setFeaturedGigs(FALLBACK_CAMPUS_GIGS);
        }

        if (tasksRes.status === 'fulfilled' && tasksRes.value?.items && tasksRes.value.items.length > 0) {
          setRecentTasks(tasksRes.value.items);
        } else {
          setRecentTasks(FALLBACK_CAMPUS_TASKS);
        }
      } catch (err) {
        console.error('Failed to load homepage data, using fallback items:', err);
        setFeaturedGigs(FALLBACK_CAMPUS_GIGS);
        setRecentTasks(FALLBACK_CAMPUS_TASKS);
      } finally {
        setLoading(false);
      }
    };

    loadHomeData();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/gigs?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const categories = [
    { label: 'All', query: '' },
    { label: 'React.js', query: 'React' },
    { label: 'Python & Data', query: 'Python' },
    { label: 'UI/UX Design', query: 'UI/UX' },
    { label: 'LaTeX & Writing', query: 'LaTeX' },
    { label: 'FastAPI / Node', query: 'Backend' },
    { label: 'AI & Machine Learning', query: 'AI' },
  ];

  return (
    <div className="space-y-16 sm:space-y-24 py-2 relative overflow-hidden">
      {/* Subtle Background Ambient Mesh (Zero purple - Electric Blue & Emerald) */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-sky-500/10 dark:bg-sky-500/15 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse-glow" />
      <div className="absolute top-80 right-10 w-[450px] h-[450px] bg-emerald-500/10 dark:bg-emerald-500/15 rounded-full blur-3xl pointer-events-none -z-10 animate-float-slow" />
      <div className="absolute top-[900px] left-10 w-[400px] h-[400px] bg-cyan-500/10 dark:bg-cyan-500/15 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* 1. Dynamic Hero Section */}
      <section className="relative rounded-3xl sm:rounded-[2.5rem] border border-base-300 bg-base-100/80 backdrop-blur-xl p-6 sm:p-12 lg:p-16 shadow-xl shadow-sky-500/5 bg-tech-grid overflow-hidden">
        {/* Glowing Top Edge Accent */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary/80 to-transparent" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column: Messaging & Search */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-7 z-10">
            {/* Campus Micro-Task Pill */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <HiSparkles className="text-cyan-500" />
              <span>Campus Peer-to-Peer Freelance Network</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-neutral tracking-tight leading-[1.12]">
              Where Campus Talent Ships{' '}
              <span className="text-gradient-electric">Real Micro-Tasks.</span>
            </h1>

            {/* Subhead with clear identity */}
            <p className="text-sm sm:text-base lg:text-lg text-base-content/75 max-w-xl leading-relaxed font-normal">
              Find peer-verified student developers, UI designers, and lab analysts. Get quick 24-hour turnaround on code fixes, prototypes, and technical tasks.
            </p>

            {/* High-Tech Search Bar */}
            <form onSubmit={handleSearchSubmit} className="space-y-3 max-w-xl">
              <div className="relative flex items-center shadow-lg shadow-primary/5 rounded-2xl bg-base-100 border border-base-300 focus-within:border-primary/60 focus-within:ring-2 focus-within:ring-primary/20 transition-all p-1.5">
                <FiSearch className="absolute left-4.5 text-base-content/40 w-5 h-5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Try: React bug, Python scraper, Figma UI, LaTeX..."
                  className="w-full pl-12 pr-4 py-3 bg-transparent text-sm focus:outline-none text-neutral placeholder:text-base-content/40 font-medium"
                />
                <button
                  type="submit"
                  className="btn btn-primary rounded-xl px-5 sm:px-7 font-bold shadow-md shadow-primary/25 hover:shadow-lg hover:shadow-primary/35 text-white transition-all shrink-0"
                >
                  Find Gigs
                </button>
              </div>

              {/* Category Filter Pills */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="text-xs font-bold text-base-content/60 flex items-center gap-1 mr-1">
                  <FiTrendingUp className="text-primary w-3.5 h-3.5" /> Popular:
                </span>
                {categories.map((cat) => (
                  <button
                    key={cat.label}
                    type="button"
                    onClick={() => {
                      setActiveCategory(cat.label);
                      if (cat.query) {
                        navigate(`/gigs?search=${encodeURIComponent(cat.query)}`);
                      } else {
                        navigate('/gigs');
                      }
                    }}
                    className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition-all duration-200 border ${
                      activeCategory === cat.label
                        ? 'bg-primary text-white border-primary shadow-xs'
                        : 'bg-base-200/80 text-base-content/75 border-base-300 hover:border-primary/40 hover:text-primary hover:bg-base-200'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </form>

            {/* Live Campus Activity Ticker */}
            <div className="pt-2 flex flex-wrap items-center gap-6 text-xs text-base-content/70 border-t border-base-300/80">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="font-semibold text-neutral">1,400+ Verified Peers</span>
              </div>
              <div className="flex items-center gap-2">
                <FiClock className="text-cyan-500 w-4 h-4" />
                <span>&lt; 24h Avg Turnaround</span>
              </div>
              <div className="flex items-center gap-2">
                <FiShield className="text-emerald-500 w-4 h-4" />
                <span>Academic Integrity Pledge</span>
              </div>
            </div>
          </div>

          {/* Right Column: 3D Interactive Floating Showcase */}
          <div className="lg:col-span-5 relative perspective-1000 flex justify-center">
            {/* 3D Main Showcase Card */}
            <div
              style={heroTilt.style}
              {...heroTilt.bind}
              className="relative w-full max-w-sm sm:max-w-md bg-base-100/90 backdrop-blur-2xl rounded-3xl border border-base-300 shadow-2xl p-6 sm:p-7 space-y-5 preserve-3d group cursor-pointer hover:border-primary/50 transition-colors"
            >
              {heroTilt.glareStyle && (
                <div
                  className="absolute inset-0 z-20 pointer-events-none rounded-3xl transition-opacity duration-300"
                  style={heroTilt.glareStyle}
                />
              )}

              {/* Top Bar with Live Campus Tag */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                    Live Verified Peer
                  </span>
                </div>
                <span className="badge badge-primary/10 text-primary border border-primary/20 text-[10px] font-bold px-2 py-0.5">
                  Top 5% Talent
                </span>
              </div>

              {/* Student Profile Preview */}
              <div className="flex items-center gap-3.5">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary via-sky-600 to-cyan-500 text-white flex items-center justify-center font-black text-xl shadow-lg shadow-primary/30 ring-4 ring-primary/10">
                  AR
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-extrabold text-base text-neutral">Alex Rivera</h4>
                    <FiCheckCircle className="text-emerald-500 w-4 h-4" title="Verified University Email" />
                  </div>
                  <p className="text-xs text-base-content/60 font-medium">
                    Stanford University • Computer Science '27
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="badge badge-xs bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 font-bold">
                      ⭐ 4.98 (38 gigs)
                    </span>
                    <span className="text-[11px] text-cyan-600 dark:text-cyan-400 font-bold">
                      MCQ Verified
                    </span>
                  </div>
                </div>
              </div>

              {/* Micro-Task Code / Snippet Showcase Pill */}
              <div className="bg-base-200/80 rounded-2xl p-4 border border-base-300 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-neutral flex items-center gap-1.5">
                    <FiCode className="text-primary" /> Active Service
                  </span>
                  <span className="text-xs font-black text-primary">$25.00</span>
                </div>
                <p className="text-xs text-base-content/80 font-medium line-clamp-2">
                  "React Hook & Component Bug Fixes: useEffect loop debugging, state hydration & fast performance."
                </p>
                <div className="flex items-center gap-1.5 pt-1">
                  <span className="badge badge-ghost text-[10px] font-semibold py-1">React 19</span>
                  <span className="badge badge-ghost text-[10px] font-semibold py-1">Tailwind CSS</span>
                  <span className="badge badge-ghost text-[10px] font-semibold py-1">TypeScript</span>
                </div>
              </div>

              {/* Interactive Matcher Trigger */}
              <div className="pt-1">
                <button
                  onClick={() => setMatcherOpen(true)}
                  className="btn btn-primary btn-sm w-full rounded-xl font-bold gap-2 text-white shadow-md shadow-primary/20 hover:shadow-primary/30"
                >
                  <HiSparkles className="w-4 h-4 text-cyan-200" />
                  Launch Smart Peer Matcher
                </button>
              </div>
            </div>

            {/* Floating 3D Micro-Badges */}
            <div className="absolute -top-4 -right-2 sm:-right-4 p-3 rounded-2xl bg-base-100/95 backdrop-blur-md border border-base-300 shadow-xl hidden sm:flex items-center gap-2.5 animate-float-slow z-20">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold text-lg">
                ⚡
              </div>
              <div className="text-left">
                <div className="text-xs font-black text-neutral">24h Micro-Bounty</div>
                <div className="text-[10px] text-base-content/60">Rapid turnaround guarantee</div>
              </div>
            </div>

            <div className="absolute -bottom-5 -left-2 sm:-left-4 p-3 rounded-2xl bg-base-100/95 backdrop-blur-md border border-base-300 shadow-xl hidden sm:flex items-center gap-2.5 animate-float-reverse z-20">
              <div className="w-8 h-8 rounded-xl bg-cyan-500/10 text-cyan-600 flex items-center justify-center font-bold text-lg">
                🎓
              </div>
              <div className="text-left">
                <div className="text-xs font-black text-neutral">Campus Trust</div>
                <div className="text-[10px] text-base-content/60">Zero-cheating integrity</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Platform Value Props (Modern Tech Grid) */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-7 bg-base-100 rounded-3xl border border-base-300 shadow-sm hover:shadow-md hover:border-primary/40 transition-all duration-300 space-y-3 group">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center text-2xl group-hover:scale-110 transition-transform shadow-xs">
            🎓
          </div>
          <h3 className="font-extrabold text-base text-neutral">Verified University Peers</h3>
          <p className="text-xs text-base-content/70 leading-relaxed">
            Collaborate strictly with peers verified through university email and authenticated campus departments.
          </p>
        </div>

        <div className="p-7 bg-base-100 rounded-3xl border border-base-300 shadow-sm hover:shadow-md hover:border-emerald-500/40 transition-all duration-300 space-y-3 group">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform shadow-xs">
            ⚡
          </div>
          <h3 className="font-extrabold text-base text-neutral">Fast Micro-Tasks</h3>
          <p className="text-xs text-base-content/70 leading-relaxed">
            Need a bug fixed or dataset parsed in 24 hours? Get rapid turnaround with clear milestone tracking.
          </p>
        </div>

        <div className="p-7 bg-base-100 rounded-3xl border border-base-300 shadow-sm hover:shadow-md hover:border-cyan-500/40 transition-all duration-300 space-y-3 group">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center text-xl group-hover:scale-110 transition-transform shadow-xs">
            <FiAward className="w-6 h-6" />
          </div>
          <h3 className="font-extrabold text-base text-neutral">Skill MCQ Assessments</h3>
          <p className="text-xs text-base-content/70 leading-relaxed">
            Pass rigorous tests in React, Python, or Git to unlock gold verification badges on your profile.
          </p>
        </div>

        <div className="p-7 bg-base-100 rounded-3xl border border-base-300 shadow-sm hover:shadow-md hover:border-amber-500/40 transition-all duration-300 space-y-3 group">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center text-xl group-hover:scale-110 transition-transform shadow-xs">
            <FiShield className="w-6 h-6" />
          </div>
          <h3 className="font-extrabold text-base text-neutral">Academic Integrity Pledge</h3>
          <p className="text-xs text-base-content/70 leading-relaxed">
            Peer tutoring, technical debugging, and mentorship only. Strictly zero cheating tolerance.
          </p>
        </div>
      </section>

      {/* 3. Featured Student Gigs Section (3D Tilt Grid) */}
      <section className="space-y-7">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-primary uppercase tracking-wider block">
              Marketplace
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-neutral">
              Featured Student Gigs
            </h2>
            <p className="text-xs sm:text-sm text-base-content/60 mt-1">
              Top-rated micro-services posted by students ready to start immediately.
            </p>
          </div>
          <Link
            to="/gigs"
            className="btn btn-ghost btn-sm text-xs font-bold text-primary gap-1 hover:bg-primary/10 rounded-xl self-start sm:self-auto"
          >
            View All Gigs <FiArrowRight />
          </Link>
        </div>

        {loading ? (
          <LoadingSkeleton type="cards" count={6} />
        ) : featuredGigs.length === 0 ? (
          <div className="text-center py-16 bg-base-100 rounded-3xl border border-dashed border-base-300 space-y-3">
            <p className="text-sm text-base-content/60">No gigs available right now.</p>
            <Link to="/gigs/create" className="btn btn-primary btn-sm rounded-xl text-white font-bold">
              Be the first to post a Gig!
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredGigs.map((gig) => (
              <GigCard key={gig.id} gig={gig} />
            ))}
          </div>
        )}
      </section>

      {/* 4. Smart Skill Matcher Interactive CTA Banner */}
      <section className="relative overflow-hidden p-8 sm:p-12 rounded-3xl sm:rounded-[2.5rem] bg-gradient-to-r from-neutral via-slate-900 to-charcoal-950 text-white shadow-2xl border border-cyan-500/20">
        {/* Futuristic glowing backdrop accent */}
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-primary/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-bold uppercase tracking-wider">
              <HiSparkles /> Smart Peer Matcher
            </div>
            <h3 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
              Can't find the exact gig? Match with campus peers instantly!
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
              Specify your tech stack, required deadline, and budget. Our smart algorithm calculates compatibility scores against available university students.
            </p>
          </div>

          <button
            onClick={() => setMatcherOpen(true)}
            className="btn btn-lg bg-gradient-to-r from-cyan-500 to-sky-500 hover:from-cyan-400 hover:to-sky-400 text-slate-950 border-none font-extrabold rounded-2xl shadow-xl shadow-cyan-500/25 hover:shadow-cyan-500/40 gap-2 shrink-0 transition-all"
          >
            <HiSparkles className="w-5 h-5 text-slate-950" />
            <span>Launch Matcher Calculator</span>
          </button>
        </div>
      </section>

      {/* 5. Open Micro-Tasks Board */}
      <section className="space-y-7">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-emerald-500 uppercase tracking-wider block">
              Earn Fast
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-neutral">
              Open Micro-Tasks Looking for Bids
            </h2>
            <p className="text-xs sm:text-sm text-base-content/60 mt-1">
              Direct student requests waiting for quick proposals. Submit your bid and start working.
            </p>
          </div>
          <Link
            to="/tasks"
            className="btn btn-ghost btn-sm text-xs font-bold text-emerald-600 dark:text-emerald-400 gap-1 hover:bg-emerald-500/10 rounded-xl self-start sm:self-auto"
          >
            Browse All Tasks <FiArrowRight />
          </Link>
        </div>

        {loading ? (
          <LoadingSkeleton type="cards" count={4} />
        ) : recentTasks.length === 0 ? (
          <div className="text-center py-16 bg-base-100 rounded-3xl border border-dashed border-base-300 space-y-3">
            <p className="text-sm text-base-content/60">No open tasks currently.</p>
            <Link to="/tasks/create" className="btn btn-success btn-sm text-white font-bold rounded-xl">
              Post a Micro-Task
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {recentTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onApply={(t) => setSelectedTaskForProposal(t)}
              />
            ))}
          </div>
        )}
      </section>

      {/* 6. Skill Assessment Callout (Interactive Badge Showcase) */}
      <section className="bg-base-100 rounded-3xl sm:rounded-[2.5rem] border border-base-300 p-8 sm:p-12 lg:p-14 shadow-md flex flex-col lg:flex-row items-center justify-between gap-10">
        <div className="space-y-4 max-w-xl text-left">
          <span className="badge badge-accent badge-sm font-extrabold uppercase text-[10px] tracking-wider">
            Verified Skill Badges
          </span>
          <h3 className="text-2xl sm:text-4xl font-black text-neutral tracking-tight">
            Prove Your Skills with Peer MCQ Tests
          </h3>
          <p className="text-xs sm:text-sm text-base-content/75 leading-relaxed font-normal">
            Take a 5-minute technical assessment in React.js, Python, JavaScript, or Git. Score 80%+ to unlock a verified gold badge on your campus profile and receive 3x more micro-task orders.
          </p>
          <div className="pt-2">
            <Link
              to="/skills"
              className="btn btn-primary btn-md rounded-xl font-bold shadow-md shadow-primary/20 hover:shadow-primary/30 text-white gap-2"
            >
              <span>Take Free Skill Assessment</span>
              <FiArrowRight />
            </Link>
          </div>
        </div>

        {/* 4 Interactive Badges */}
        <div className="grid grid-cols-2 gap-4 w-full lg:w-auto shrink-0">
          <div className="p-5 rounded-2xl bg-base-200/60 border border-base-300 text-center space-y-1.5 hover:border-cyan-500/40 hover:shadow-md transition-all">
            <span className="text-3xl block">⚛️</span>
            <div className="font-extrabold text-xs text-neutral">React.js</div>
            <span className="badge badge-xs bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold border-emerald-500/20">
              Gold Verified
            </span>
          </div>
          <div className="p-5 rounded-2xl bg-base-200/60 border border-base-300 text-center space-y-1.5 hover:border-cyan-500/40 hover:shadow-md transition-all">
            <span className="text-3xl block">🐍</span>
            <div className="font-extrabold text-xs text-neutral">Python</div>
            <span className="badge badge-xs bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold border-emerald-500/20">
              Gold Verified
            </span>
          </div>
          <div className="p-5 rounded-2xl bg-base-200/60 border border-base-300 text-center space-y-1.5 hover:border-cyan-500/40 hover:shadow-md transition-all">
            <span className="text-3xl block">⚡</span>
            <div className="font-extrabold text-xs text-neutral">JavaScript</div>
            <span className="badge badge-xs bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold border-emerald-500/20">
              Gold Verified
            </span>
          </div>
          <div className="p-5 rounded-2xl bg-base-200/60 border border-base-300 text-center space-y-1.5 hover:border-cyan-500/40 hover:shadow-md transition-all">
            <span className="text-3xl block">🌿</span>
            <div className="font-extrabold text-xs text-neutral">Git & GitHub</div>
            <span className="badge badge-xs bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold border-emerald-500/20">
              Gold Verified
            </span>
          </div>
        </div>
      </section>

      {/* Skill Matcher Modal */}
      <SkillMatcherModal
        isOpen={matcherOpen}
        onClose={() => setMatcherOpen(false)}
        gigs={featuredGigs}
      />

      {/* Task Proposal Modal */}
      {selectedTaskForProposal && (
        <ProposalModal
          isOpen={!!selectedTaskForProposal}
          task={selectedTaskForProposal}
          onClose={() => setSelectedTaskForProposal(null)}
          onSubmitted={() => {
            setSelectedTaskForProposal(null);
          }}
        />
      )}
    </div>
  );
};
