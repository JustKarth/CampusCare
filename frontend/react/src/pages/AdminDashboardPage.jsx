import { useState, useEffect, useCallback } from 'react';
import { TopNav } from '../components/layout/TopNav';
import { Footer } from '../components/layout/Footer';
import { SEO } from '../components/common/SEO';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { apiRequest } from '../services/apiClient';
import { escapeHtml } from '../utils/escapeHtml';

export function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'users' | 'blogs' | 'reviews' | 'places' | 'fares' | 'resources'
  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);

  // Tab data states
  const [users, setUsers] = useState([]);
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('all');
  const [loadingUsers, setLoadingUsers] = useState(false);

  const [blogs, setBlogs] = useState([]);
  const [loadingBlogs, setLoadingBlogs] = useState(false);

  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(false);

  const [places, setPlaces] = useState([]);
  const [loadingPlaces, setLoadingPlaces] = useState(false);

  const [fares, setFares] = useState([]);
  const [loadingFares, setLoadingFares] = useState(false);

  const [resources, setResources] = useState([]);
  const [loadingResources, setLoadingResources] = useState(false);

  const [notification, setNotification] = useState({ type: '', message: '' });

  const notify = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification({ type: '', message: '' }), 4000);
  };

  // Fetch platform stats
  const fetchStats = useCallback(async () => {
    try {
      setLoadingStats(true);
      const res = await apiRequest('/admin/stats', 'GET', null, true);
      if (res.success) {
        setStats(res.stats);
      }
    } catch (err) {
      notify('error', 'Failed to load platform stats: ' + (err.message || ''));
    } finally {
      setLoadingStats(false);
    }
  }, []);

  // Fetch Users
  const fetchUsers = useCallback(async () => {
    try {
      setLoadingUsers(true);
      const res = await apiRequest(`/admin/users?search=${encodeURIComponent(userSearch)}&role=${userRoleFilter}`, 'GET', null, true);
      if (res.success) {
        setUsers(res.users);
      }
    } catch (err) {
      notify('error', 'Failed to load users');
    } finally {
      setLoadingUsers(false);
    }
  }, [userSearch, userRoleFilter]);

  // Fetch Blogs
  const fetchBlogs = useCallback(async () => {
    try {
      setLoadingBlogs(true);
      const res = await apiRequest('/admin/blogs', 'GET', null, true);
      if (res.success) {
        setBlogs(res.blogs);
      }
    } catch (err) {
      notify('error', 'Failed to load blogs');
    } finally {
      setLoadingBlogs(false);
    }
  }, []);

  // Fetch Reviews
  const fetchReviews = useCallback(async () => {
    try {
      setLoadingReviews(true);
      const res = await apiRequest('/admin/reviews', 'GET', null, true);
      if (res.success) {
        setReviews(res.reviews);
      }
    } catch (err) {
      notify('error', 'Failed to load reviews');
    } finally {
      setLoadingReviews(false);
    }
  }, []);

  // Fetch Places
  const fetchPlaces = useCallback(async () => {
    try {
      setLoadingPlaces(true);
      const res = await apiRequest('/admin/places', 'GET', null, true);
      if (res.success) {
        setPlaces(res.places);
      }
    } catch (err) {
      notify('error', 'Failed to load places');
    } finally {
      setLoadingPlaces(false);
    }
  }, []);

  // Fetch Fares
  const fetchFares = useCallback(async () => {
    try {
      setLoadingFares(true);
      const res = await apiRequest('/admin/fares', 'GET', null, true);
      if (res.success) {
        setFares(res.fares);
      }
    } catch (err) {
      notify('error', 'Failed to load fares');
    } finally {
      setLoadingFares(false);
    }
  }, []);

  // Fetch Resources
  const fetchResources = useCallback(async () => {
    try {
      setLoadingResources(true);
      const res = await apiRequest('/admin/resources', 'GET', null, true);
      if (res.success) {
        setResources(res.resources);
      }
    } catch (err) {
      notify('error', 'Failed to load resources');
    } finally {
      setLoadingResources(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  useEffect(() => {
    if (activeTab === 'users') fetchUsers();
    if (activeTab === 'blogs') fetchBlogs();
    if (activeTab === 'reviews') fetchReviews();
    if (activeTab === 'places') fetchPlaces();
    if (activeTab === 'fares') fetchFares();
    if (activeTab === 'resources') fetchResources();
  }, [activeTab, fetchUsers, fetchBlogs, fetchReviews, fetchPlaces, fetchFares, fetchResources]);

  // Action: Toggle User Role
  const handleToggleRole = async (userId, currentModStatus) => {
    try {
      const res = await apiRequest(`/admin/users/${userId}/role`, 'PUT', { is_moderator: !currentModStatus }, true);
      if (res.success) {
        notify('success', `User moderator status ${!currentModStatus ? 'granted' : 'revoked'}.`);
        fetchUsers();
        fetchStats();
      }
    } catch (err) {
      notify('error', err.message || 'Failed to update user role');
    }
  };

  // Action: Delete User
  const handleDeleteUser = async (userId, userEmail) => {
    if (!window.confirm(`Are you sure you want to PERMANENTLY delete user "${userEmail}" and all their contributions?`)) return;
    try {
      const res = await apiRequest(`/admin/users/${userId}`, 'DELETE', null, true);
      if (res.success) {
        notify('success', `User ${userEmail} deleted.`);
        fetchUsers();
        fetchStats();
      }
    } catch (err) {
      notify('error', err.message || 'Failed to delete user');
    }
  };

  // Action: Delete Blog
  const handleDeleteBlog = async (blogId, title) => {
    if (!window.confirm(`Delete blog post "${title}"?`)) return;
    try {
      const res = await apiRequest(`/admin/blogs/${blogId}`, 'DELETE', null, true);
      if (res.success) {
        notify('success', 'Blog post deleted.');
        fetchBlogs();
        fetchStats();
      }
    } catch (err) {
      notify('error', err.message || 'Failed to delete blog');
    }
  };

  // Action: Delete Review
  const handleDeleteReview = async (placeId, userId, placeName) => {
    if (!window.confirm(`Delete this review for "${placeName}"?`)) return;
    try {
      const res = await apiRequest(`/admin/reviews/${placeId}/${userId}`, 'DELETE', null, true);
      if (res.success) {
        notify('success', 'Review deleted.');
        fetchReviews();
        fetchStats();
      }
    } catch (err) {
      notify('error', err.message || 'Failed to delete review');
    }
  };

  // Action: Delete Place
  const handleDeletePlace = async (placeId, placeName) => {
    if (!window.confirm(`Remove spot "${placeName}" from Local Guide?`)) return;
    try {
      const res = await apiRequest(`/admin/places/${placeId}`, 'DELETE', null, true);
      if (res.success) {
        notify('success', `Spot "${placeName}" removed.`);
        fetchPlaces();
        fetchStats();
      }
    } catch (err) {
      notify('error', err.message || 'Failed to delete spot');
    }
  };

  // Action: Delete Fare
  const handleDeleteFare = async (fareId) => {
    if (!window.confirm('Delete this community fare report?')) return;
    try {
      const res = await apiRequest(`/admin/fares/${fareId}`, 'DELETE', null, true);
      if (res.success) {
        notify('success', 'Fare report deleted.');
        fetchFares();
        fetchStats();
      }
    } catch (err) {
      notify('error', err.message || 'Failed to delete fare');
    }
  };

  // Action: Delete Resource
  const handleDeleteResource = async (resourceId, title) => {
    if (!window.confirm(`Delete resource "${title}"?`)) return;
    try {
      const res = await apiRequest(`/admin/resources/${resourceId}`, 'DELETE', null, true);
      if (res.success) {
        notify('success', 'Academic resource deleted.');
        fetchResources();
        fetchStats();
      }
    } catch (err) {
      notify('error', err.message || 'Failed to delete resource');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-text-primary">
      <SEO title="Admin Console" description="CampusCare platform governance, moderation, and controls." />
      <TopNav />

      <main className="flex-1 p-4 sm:p-6 md:p-10 max-w-7xl mx-auto w-full space-y-6 fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
          <div>
            <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-widest mb-1">
              <span>🛡️</span>
              <span>Super Administrator Governance</span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight flex items-center gap-3">
              <span>CampusCare Admin Console</span>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">
                Full Control
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-text-secondary mt-1">
              Monitor community engagement, moderate student content, audit transit fares, and control user permissions.
            </p>
          </div>

          <button
            onClick={() => {
              fetchStats();
              if (activeTab === 'users') fetchUsers();
              if (activeTab === 'blogs') fetchBlogs();
              if (activeTab === 'reviews') fetchReviews();
              if (activeTab === 'places') fetchPlaces();
              if (activeTab === 'fares') fetchFares();
              if (activeTab === 'resources') fetchResources();
              notify('success', 'Console data refreshed!');
            }}
            className="btn-outline text-xs px-4 py-2 self-start sm:self-auto flex items-center gap-1.5"
          >
            <span>🔄</span>
            <span>Refresh All Data</span>
          </button>
        </div>

        {/* Floating Notification */}
        {notification.message && (
          <div
            className={`p-3.5 rounded-xl border text-xs font-semibold flex items-center justify-between animate-fadeIn ${
              notification.type === 'success'
                ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
                : 'bg-rose-500/15 border-rose-500/30 text-rose-400'
            }`}
          >
            <span>{notification.message}</span>
            <button onClick={() => setNotification({ type: '', message: '' })} className="hover:text-white">✕</button>
          </div>
        )}

        {/* Top Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="card-glass p-4 rounded-2xl border border-white/10 space-y-1 text-center sm:text-left">
            <span className="text-xl">👥</span>
            <p className="text-[11px] text-text-secondary uppercase tracking-wider font-semibold">Students</p>
            <p className="text-2xl font-black text-white">{stats ? stats.totalUsers : '...'}</p>
            <p className="text-[10px] text-text-secondary">Total Registered</p>
          </div>

          <div className="card-glass p-4 rounded-2xl border border-white/10 space-y-1 text-center sm:text-left">
            <span className="text-xl">✍️</span>
            <p className="text-[11px] text-text-secondary uppercase tracking-wider font-semibold">Blogs</p>
            <p className="text-2xl font-black text-primary">{stats ? stats.totalBlogs : '...'}</p>
            <p className="text-[10px] text-text-secondary">Community Posts</p>
          </div>

          <div className="card-glass p-4 rounded-2xl border border-white/10 space-y-1 text-center sm:text-left">
            <span className="text-xl">📍</span>
            <p className="text-[11px] text-text-secondary uppercase tracking-wider font-semibold">Spots</p>
            <p className="text-2xl font-black text-blue-400">{stats ? stats.totalPlaces : '...'}</p>
            <p className="text-[10px] text-text-secondary">Local Guide</p>
          </div>

          <div className="card-glass p-4 rounded-2xl border border-white/10 space-y-1 text-center sm:text-left">
            <span className="text-xl">💬</span>
            <p className="text-[11px] text-text-secondary uppercase tracking-wider font-semibold">Reviews</p>
            <p className="text-2xl font-black text-amber-400">{stats ? stats.totalReviews : '...'}</p>
            <p className="text-[10px] text-text-secondary">Student Feedback</p>
          </div>

          <div className="card-glass p-4 rounded-2xl border border-white/10 space-y-1 text-center sm:text-left">
            <span className="text-xl">🛺</span>
            <p className="text-[11px] text-text-secondary uppercase tracking-wider font-semibold">Fares</p>
            <p className="text-2xl font-black text-emerald-400">{stats ? stats.totalFares : '...'}</p>
            <p className="text-[10px] text-text-secondary">Transit Points</p>
          </div>

          <div className="card-glass p-4 rounded-2xl border border-white/10 space-y-1 text-center sm:text-left">
            <span className="text-xl">📖</span>
            <p className="text-[11px] text-text-secondary uppercase tracking-wider font-semibold">Resources</p>
            <p className="text-2xl font-black text-purple-400">{stats ? stats.totalResources : '...'}</p>
            <p className="text-[10px] text-text-secondary">Study Materials</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-white/10 no-scrollbar">
          {[
            { id: 'overview', label: '📊 Overview', count: null },
            { id: 'users', label: '👥 Students & Roles', count: stats?.totalUsers },
            { id: 'blogs', label: '✍️ Blogs Moderation', count: stats?.totalBlogs },
            { id: 'reviews', label: '💬 Reviews Moderation', count: stats?.totalReviews },
            { id: 'places', label: '📍 Local Spots', count: stats?.totalPlaces },
            { id: 'fares', label: '🛺 Fare Reports', count: stats?.totalFares },
            { id: 'resources', label: '📖 Study Materials', count: stats?.totalResources },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 flex-shrink-0 ${
                activeTab === tab.id
                  ? 'bg-primary text-white shadow-lg shadow-primary/25'
                  : 'bg-white/5 text-text-secondary hover:bg-white/10 hover:text-white'
              }`}
            >
              <span>{tab.label}</span>
              {tab.count != null && (
                <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                  activeTab === tab.id ? 'bg-black/30 text-white' : 'bg-white/10 text-text-secondary'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="card-glass p-6 rounded-2xl border border-white/10 space-y-3">
                <h3 className="font-bold text-base text-white flex items-center gap-2">
                  <span>⚡</span>
                  <span>Quick Administrator Actions</span>
                </h3>
                <p className="text-xs text-text-secondary">Frequently used moderation controls across the platform:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                  <button
                    onClick={() => setActiveTab('users')}
                    className="p-3 rounded-xl bg-card hover:bg-white/10 border border-white/10 text-left transition-all group"
                  >
                    <p className="text-xs font-bold text-white group-hover:text-primary">Manage Students</p>
                    <p className="text-[10px] text-text-secondary">Promote mods or remove accounts</p>
                  </button>

                  <button
                    onClick={() => setActiveTab('reviews')}
                    className="p-3 rounded-xl bg-card hover:bg-white/10 border border-white/10 text-left transition-all group"
                  >
                    <p className="text-xs font-bold text-white group-hover:text-amber-400">Review Moderation</p>
                    <p className="text-[10px] text-text-secondary">Audit student reviews on spots</p>
                  </button>

                  <button
                    onClick={() => setActiveTab('blogs')}
                    className="p-3 rounded-xl bg-card hover:bg-white/10 border border-white/10 text-left transition-all group"
                  >
                    <p className="text-xs font-bold text-white group-hover:text-purple-400">Blog Moderation</p>
                    <p className="text-[10px] text-text-secondary">Review & delete community posts</p>
                  </button>

                  <button
                    onClick={() => setActiveTab('fares')}
                    className="p-3 rounded-xl bg-card hover:bg-white/10 border border-white/10 text-left transition-all group"
                  >
                    <p className="text-xs font-bold text-white group-hover:text-emerald-400">Audit Fare Reports</p>
                    <p className="text-[10px] text-text-secondary">Purge trolling or outlier fares</p>
                  </button>
                </div>
              </div>

              <div className="card-glass p-6 rounded-2xl border border-white/10 space-y-3">
                <h3 className="font-bold text-base text-white flex items-center gap-2">
                  <span>ℹ️</span>
                  <span>Platform Access Information</span>
                </h3>
                <div className="space-y-2 text-xs text-text-secondary leading-relaxed">
                  <p>
                    <span className="font-bold text-white">Role Hierarchy:</span> Super Administrators have unilateral access to edit user roles, delete malicious accounts, remove false fare calculations, and delete inappropriate content.
                  </p>
                  <p>
                    <span className="font-bold text-white">Account Promotion CLI:</span> To grant admin access to any student account from the server terminal:
                  </p>
                  <pre className="p-2.5 rounded-lg bg-black/50 text-primary-light font-mono text-[11px] border border-white/10 overflow-x-auto">
                    node scripts/create-admin.js student@mnnit.ac.in
                  </pre>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: STUDENTS & USERS */}
        {activeTab === 'users' && (
          <div className="card-glass p-6 rounded-2xl border border-white/10 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2 flex-1 max-w-md">
                <input
                  type="text"
                  placeholder="Search students by name, email, reg no..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className="w-full px-3.5 py-2 bg-card rounded-xl border border-white/15 text-xs text-white focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={userRoleFilter}
                  onChange={(e) => setUserRoleFilter(e.target.value)}
                  className="px-3 py-2 bg-card rounded-xl border border-white/15 text-xs text-white focus:outline-none"
                >
                  <option value="all">All Roles</option>
                  <option value="student">Students Only</option>
                  <option value="moderator">Moderators Only</option>
                  <option value="admin">Admins Only</option>
                </select>
                <button
                  onClick={fetchUsers}
                  className="btn-primary text-xs px-3.5 py-2 rounded-xl"
                >
                  Filter
                </button>
              </div>
            </div>

            {loadingUsers ? (
              <div className="py-12 flex justify-center"><LoadingSpinner size="md" className="text-primary" /></div>
            ) : users.length === 0 ? (
              <p className="text-center py-8 text-xs text-text-secondary">No users found matching your criteria.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 text-text-secondary uppercase text-[10px]">
                      <th className="py-2.5 px-3">Student</th>
                      <th className="py-2.5 px-3">Reg No & Course</th>
                      <th className="py-2.5 px-3">College</th>
                      <th className="py-2.5 px-3">Role</th>
                      <th className="py-2.5 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {users.map((u) => (
                      <tr key={u.user_id} className="hover:bg-white/5 transition-colors">
                        <td className="py-3 px-3">
                          <p className="font-bold text-white">{u.first_name} {u.last_name || ''}</p>
                          <p className="text-[11px] text-text-secondary">{u.email}</p>
                        </td>
                        <td className="py-3 px-3">
                          <p className="font-semibold text-text-primary">{u.reg_no || 'N/A'}</p>
                          <p className="text-[11px] text-text-secondary">{u.course_name || 'N/A'} {u.graduation_year ? `('${u.graduation_year.toString().slice(-2)})` : ''}</p>
                        </td>
                        <td className="py-3 px-3 text-text-secondary">{u.college_name || 'Campus'}</td>
                        <td className="py-3 px-3">
                          {u.is_admin ? (
                            <span className="px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 font-bold text-[10px] border border-amber-400/30">
                              🛡️ Admin
                            </span>
                          ) : u.is_moderator ? (
                            <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-bold text-[10px] border border-purple-500/30">
                              ⭐ Moderator
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full bg-white/10 text-text-secondary text-[10px]">
                              Student
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-3 text-right space-x-1.5">
                          {!u.is_admin && (
                            <button
                              onClick={() => handleToggleRole(u.user_id, u.is_moderator)}
                              className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-[11px] font-semibold transition-all"
                            >
                              {u.is_moderator ? 'Revoke Mod' : 'Make Mod'}
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteUser(u.user_id, u.email)}
                            className="px-2.5 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-[11px] font-semibold transition-all border border-rose-500/30"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: BLOGS MODERATION */}
        {activeTab === 'blogs' && (
          <div className="card-glass p-6 rounded-2xl border border-white/10 space-y-4">
            <h3 className="font-bold text-base text-white">Student Community Blogs</h3>
            {loadingBlogs ? (
              <div className="py-12 flex justify-center"><LoadingSpinner size="md" className="text-primary" /></div>
            ) : blogs.length === 0 ? (
              <p className="text-center py-8 text-xs text-text-secondary">No blogs found.</p>
            ) : (
              <div className="space-y-3">
                {blogs.map((b) => (
                  <div key={b.blog_id} className="p-4 rounded-xl bg-card/60 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-white/20 transition-all">
                    <div className="space-y-1 max-w-2xl">
                      <h4 className="text-sm font-bold text-white">{escapeHtml(b.blog_title)}</h4>
                      <p className="text-xs text-text-secondary line-clamp-2">{escapeHtml(b.blog_content)}</p>
                      <div className="flex items-center gap-3 text-[11px] text-text-secondary/70 pt-1">
                        <span>By {b.first_name || 'Student'} ({b.author_email})</span>
                        <span>•</span>
                        <span>💬 {b.comment_count} comments</span>
                        <span>•</span>
                        <span>❤️ {b.like_count} likes</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 self-start sm:self-auto flex-shrink-0">
                      <a
                        href={`/blogs/${b.blog_id}`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold"
                      >
                        View
                      </a>
                      <button
                        onClick={() => handleDeleteBlog(b.blog_id, b.blog_title)}
                        className="px-3 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 text-xs font-semibold"
                      >
                        Delete Post
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: REVIEWS MODERATION */}
        {activeTab === 'reviews' && (
          <div className="card-glass p-6 rounded-2xl border border-white/10 space-y-4">
            <h3 className="font-bold text-base text-white">Local Guide Student Reviews</h3>
            {loadingReviews ? (
              <div className="py-12 flex justify-center"><LoadingSpinner size="md" className="text-primary" /></div>
            ) : reviews.length === 0 ? (
              <p className="text-center py-8 text-xs text-text-secondary">No written reviews found.</p>
            ) : (
              <div className="space-y-3">
                {reviews.map((r, i) => (
                  <div key={i} className="p-4 rounded-xl bg-card/60 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-xs">{escapeHtml(r.place_name)}</span>
                        <span className="text-amber-400 font-bold text-xs">★ {r.rating}</span>
                      </div>
                      <p className="text-xs text-text-primary italic">&ldquo;{escapeHtml(r.review_text)}&rdquo;</p>
                      <p className="text-[11px] text-text-secondary">By {r.first_name || 'Senior'} ({r.email})</p>
                    </div>
                    <button
                      onClick={() => handleDeleteReview(r.place_id, r.user_id, r.place_name)}
                      className="px-3 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 text-xs font-semibold self-start sm:self-auto flex-shrink-0"
                    >
                      Delete Review
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 5: LOCAL SPOTS */}
        {activeTab === 'places' && (
          <div className="card-glass p-6 rounded-2xl border border-white/10 space-y-4">
            <h3 className="font-bold text-base text-white">Local Guide Places & Facilities</h3>
            {loadingPlaces ? (
              <div className="py-12 flex justify-center"><LoadingSpinner size="md" className="text-primary" /></div>
            ) : places.length === 0 ? (
              <p className="text-center py-8 text-xs text-text-secondary">No places found.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 text-text-secondary uppercase text-[10px]">
                      <th className="py-2.5 px-3">Spot Name</th>
                      <th className="py-2.5 px-3">Category</th>
                      <th className="py-2.5 px-3">Address & Coords</th>
                      <th className="py-2.5 px-3">Rating</th>
                      <th className="py-2.5 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {places.map((p) => (
                      <tr key={p.place_id} className="hover:bg-white/5 transition-colors">
                        <td className="py-3 px-3 font-bold text-white">{escapeHtml(p.place_name)}</td>
                        <td className="py-3 px-3 text-primary">{p.category_name || 'Spot'}</td>
                        <td className="py-3 px-3 text-text-secondary">
                          <p>{escapeHtml(p.address || 'Prayagraj')}</p>
                          {p.lat && p.lng && (
                            <p className="text-[10px] text-emerald-400">GPS: {Number(p.lat).toFixed(4)}, {Number(p.lng).toFixed(4)}</p>
                          )}
                        </td>
                        <td className="py-3 px-3 font-semibold text-amber-400">
                          {p.average_rating ? `★ ${Number(p.average_rating).toFixed(1)} (${p.total_ratings})` : 'New'}
                        </td>
                        <td className="py-3 px-3 text-right">
                          <button
                            onClick={() => handleDeletePlace(p.place_id, p.place_name)}
                            className="px-2.5 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-[11px] font-semibold border border-rose-500/30"
                          >
                            Remove Spot
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 6: FARE REPORTS AUDIT */}
        {activeTab === 'fares' && (
          <div className="card-glass p-6 rounded-2xl border border-white/10 space-y-4">
            <h3 className="font-bold text-base text-white">Community Fare Submissions</h3>
            {loadingFares ? (
              <div className="py-12 flex justify-center"><LoadingSpinner size="md" className="text-primary" /></div>
            ) : fares.length === 0 ? (
              <p className="text-center py-8 text-xs text-text-secondary">No fares reported yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 text-text-secondary uppercase text-[10px]">
                      <th className="py-2.5 px-3">Route</th>
                      <th className="py-2.5 px-3">Price</th>
                      <th className="py-2.5 px-3">Vehicle</th>
                      <th className="py-2.5 px-3">Notes & Submitter</th>
                      <th className="py-2.5 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {fares.map((f) => (
                      <tr key={f.fare_id} className="hover:bg-white/5 transition-colors">
                        <td className="py-3 px-3 font-semibold text-white">
                          {f.from_place_name} ➔ {f.to_place_name}
                        </td>
                        <td className="py-3 px-3 font-black text-emerald-400 text-sm">₹{f.fare_amount}</td>
                        <td className="py-3 px-3 capitalize text-primary font-bold">{f.vehicle_type}</td>
                        <td className="py-3 px-3 text-text-secondary">
                          <p className="italic">&ldquo;{escapeHtml(f.notes || 'No notes')}&rdquo;</p>
                          <p className="text-[10px] opacity-70">By {f.submitter_email || 'Student'}</p>
                        </td>
                        <td className="py-3 px-3 text-right">
                          <button
                            onClick={() => handleDeleteFare(f.fare_id)}
                            className="px-2.5 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-[11px] font-semibold border border-rose-500/30"
                          >
                            Delete Fare
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 7: STUDY MATERIALS */}
        {activeTab === 'resources' && (
          <div className="card-glass p-6 rounded-2xl border border-white/10 space-y-4">
            <h3 className="font-bold text-base text-white">Academic Resources & Notes</h3>
            {loadingResources ? (
              <div className="py-12 flex justify-center"><LoadingSpinner size="md" className="text-primary" /></div>
            ) : resources.length === 0 ? (
              <p className="text-center py-8 text-xs text-text-secondary">No resources found.</p>
            ) : (
              <div className="space-y-3">
                {resources.map((r) => (
                  <div key={r.resource_id} className="p-4 rounded-xl bg-card/60 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <h4 className="text-sm font-bold text-white">{escapeHtml(r.resource_title)}</h4>
                      <p className="text-xs text-text-secondary">{escapeHtml(r.resource_description || 'No description')}</p>
                      <a href={r.resource_link} target="_blank" rel="noreferrer" className="text-[11px] text-primary hover:underline block truncate max-w-md">
                        {r.resource_link}
                      </a>
                    </div>
                    <button
                      onClick={() => handleDeleteResource(r.resource_id, r.resource_title)}
                      className="px-3 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 text-xs font-semibold self-start sm:self-auto flex-shrink-0"
                    >
                      Delete Resource
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
