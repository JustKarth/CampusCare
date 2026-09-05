import { useEffect, useState } from 'react';
import { TopNav } from '../components/layout/TopNav';
import { Footer } from '../components/layout/Footer';
import { useAuthOperations } from '../hooks/useAuth';
import { useAuth as useAuthContext } from '../context/AuthContext';
import { useAvatar } from '../hooks/useAvatar';
import { useDropdownData } from '../hooks/useDropdownData';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ErrorMessage } from '../components/common/ErrorMessage';
import { AvatarSelector } from '../components/profile/AvatarSelector';
import { SEO } from '../components/common/SEO';
import { CollegeLogo } from '../components/common/CollegeLogo';

// Profile Page
// Replaces: profile.html + profile.js

export function ProfilePage() {
  const { user: contextUser } = useAuthContext();
  const { getProfile, updateProfile } = useAuthOperations();
  const { currentAvatar, getAvatarUrl, availableAvatars } = useAvatar();
  const { courses } = useDropdownData();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [avatarError, setAvatarError] = useState(false);

  // Edit states
  const [isEditingPersonal, setIsEditingPersonal] = useState(false);
  const [personalForm, setPersonalForm] = useState({
    firstName: '',
    middleName: '',
    lastName: ''
  });

  const [isEditingAcademic, setIsEditingAcademic] = useState(false);
  const [academicForm, setAcademicForm] = useState({
    courseId: '',
    graduationYear: '',
    regNo: ''
  });

  const [savingPersonal, setSavingPersonal] = useState(false);
  const [savingAcademic, setSavingAcademic] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      const result = await getProfile();
      if (result.success) {
        setUser(result.user);
        setPersonalForm({
          firstName: result.user.firstName || '',
          middleName: result.user.middleName || '',
          lastName: result.user.lastName || ''
        });
        setAcademicForm({
          courseId: result.user.courseId || '',
          graduationYear: result.user.graduationYear || '',
          regNo: result.user.regNo || ''
        });
      } else {
        setError(result.error);
      }
      setLoading(false);
    };

    fetchProfile();
  }, []);

  const showStatus = (type, text) => {
    setStatusMessage({ type, text });
    setTimeout(() => setStatusMessage({ type: '', text: '' }), 4000);
  };

  const handleSavePersonal = async (e) => {
    e.preventDefault();
    if (!personalForm.firstName.trim() || !personalForm.lastName.trim()) {
      showStatus('error', 'First name and last name are required.');
      return;
    }

    setSavingPersonal(true);
    const res = await updateProfile({
      first_name: personalForm.firstName.trim(),
      middle_name: personalForm.middleName.trim() || null,
      last_name: personalForm.lastName.trim()
    });
    setSavingPersonal(false);

    if (res.success) {
      setUser(res.user);
      setIsEditingPersonal(false);
      showStatus('success', 'Personal details updated successfully!');
    } else {
      showStatus('error', res.error || 'Failed to update personal details.');
    }
  };

  const handleSaveAcademic = async (e) => {
    e.preventDefault();
    setSavingAcademic(true);
    const res = await updateProfile({
      course_id: academicForm.courseId ? parseInt(academicForm.courseId, 10) : undefined,
      graduation_year: academicForm.graduationYear ? parseInt(academicForm.graduationYear, 10) : undefined,
      reg_no: academicForm.regNo.trim() || null
    });
    setSavingAcademic(false);

    if (res.success) {
      setUser(res.user);
      setIsEditingAcademic(false);
      showStatus('success', 'Academic information updated successfully!');
    } else {
      showStatus('error', res.error || 'Failed to update academic info.');
    }
  };

  const fullName = user
    ? [user.firstName, user.middleName, user.lastName].filter(Boolean).join(' ')
    : '';

  const avatarUrl = currentAvatar ? getAvatarUrl(currentAvatar) : (availableAvatars.length > 0 ? availableAvatars[0].url : null);

  return (
    <div className="min-h-screen flex flex-col">
      <SEO 
        title="My Profile" 
        description="View and edit your profile information"
        keywords="profile, account, settings"
      />
      <TopNav />
      <main className="flex-1 p-6 md:p-10 fade-in">
        <div className="max-w-5xl mx-auto space-y-6">
          {statusMessage.text && (
            <div
              className={`p-4 rounded-xl border text-sm flex items-center gap-2 animate-fadeIn ${
                statusMessage.type === 'success'
                  ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
                  : 'bg-rose-500/15 border-rose-500/30 text-rose-400'
              }`}
            >
              <span>{statusMessage.type === 'success' ? '✓' : '⚠️'}</span>
              <span>{statusMessage.text}</span>
            </div>
          )}

          {loading ? (
            <div className="card flex items-center justify-center min-h-[400px]">
              <LoadingSpinner size="lg" className="text-primary" />
            </div>
          ) : error ? (
            <ErrorMessage message={error} />
          ) : (
            <div className="space-y-8 fade-in">
              {/* Profile Header Card */}
              <div className="card-glass fade-up">
                <div className="flex flex-col md:flex-row items-center gap-8">
                  {avatarUrl && !avatarError ? (
                    <img
                      src={avatarUrl}
                      alt="Profile avatar"
                      className="w-32 h-32 rounded-full object-cover border-4 border-primary shadow-2xl"
                      onError={() => setAvatarError(true)}
                    />
                  ) : (
                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center border-4 border-primary shadow-2xl">
                      <span className="text-5xl text-white font-bold">
                        {[user?.firstName, user?.lastName].filter(Boolean).map(n => n[0]).join('').toUpperCase() || 'U'}
                      </span>
                    </div>
                  )}
                  <div className="flex-1 text-center md:text-left">
                    <h2 className="text-3xl font-bold text-text-primary mb-2">{fullName || 'User'}</h2>
                    <p className="text-text-secondary text-lg mb-4">{user?.email || 'N/A'}</p>
                    <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                      <span className="badge text-sm">Student</span>
                      {user?.graduationYear && (
                        <span className="badge text-sm">Class of {user.graduationYear}</span>
                      )}
                      {user?.collegeName && (
                        <span className="badge text-sm">{user.collegeName}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Avatar Selection Section */}
              <div className="card fade-up" style={{ animationDelay: '0.1s' }}>
                <AvatarSelector />
              </div>

              {/* Profile Information Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Personal Information Card */}
                <div className="card fade-up" style={{ animationDelay: '0.2s' }}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-text-primary flex items-center gap-2">
                      <span className="text-2xl">👤</span>
                      Personal Information
                    </h3>
                    {!isEditingPersonal ? (
                      <button
                        type="button"
                        onClick={() => {
                          setPersonalForm({
                            firstName: user?.firstName || '',
                            middleName: user?.middleName || '',
                            lastName: user?.lastName || ''
                          });
                          setIsEditingPersonal(true);
                        }}
                        className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-primary border border-primary/30 transition-all flex items-center gap-1.5"
                      >
                        <span>✏️</span>
                        <span>Edit</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setIsEditingPersonal(false)}
                        className="text-xs text-text-secondary hover:text-white px-2 py-1"
                      >
                        Cancel
                      </button>
                    )}
                  </div>

                  {!isEditingPersonal ? (
                    <div className="space-y-4">
                      <div className="p-4 bg-card/50 rounded-lg border border-white/5">
                        <p className="text-xs text-text-secondary uppercase tracking-wide mb-1">Full Name</p>
                        <p className="text-base font-semibold text-text-primary">{fullName || 'N/A'}</p>
                      </div>
                      <div className="p-4 bg-card/50 rounded-lg border border-white/5">
                        <p className="text-xs text-text-secondary uppercase tracking-wide mb-1">Email Address</p>
                        <p className="text-base font-semibold text-text-primary">{user?.email || 'N/A'}</p>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleSavePersonal} className="space-y-4 text-xs">
                      <div>
                        <label className="block font-semibold uppercase tracking-wider text-text-secondary mb-1">
                          First Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={personalForm.firstName}
                          onChange={(e) => setPersonalForm({ ...personalForm, firstName: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-card rounded-xl border border-white/15 text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold uppercase tracking-wider text-text-secondary mb-1">
                          Middle Name (Optional)
                        </label>
                        <input
                          type="text"
                          value={personalForm.middleName}
                          onChange={(e) => setPersonalForm({ ...personalForm, middleName: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-card rounded-xl border border-white/15 text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold uppercase tracking-wider text-text-secondary mb-1">
                          Last Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={personalForm.lastName}
                          onChange={(e) => setPersonalForm({ ...personalForm, lastName: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-card rounded-xl border border-white/15 text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>

                      <div className="flex items-center justify-end gap-2 pt-2">
                        <button
                          type="button"
                          onClick={() => setIsEditingPersonal(false)}
                          className="btn-outline text-xs px-4 py-2"
                          disabled={savingPersonal}
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="btn-primary text-xs px-5 py-2 flex items-center gap-1.5"
                          disabled={savingPersonal}
                        >
                          {savingPersonal ? 'Saving...' : 'Save Changes'}
                        </button>
                      </div>
                    </form>
                  )}
                </div>

                {/* Academic Information Card */}
                <div className="card fade-up" style={{ animationDelay: '0.3s' }}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-text-primary flex items-center gap-2">
                      <span className="text-2xl">🎓</span>
                      Academic Information
                    </h3>
                    {!isEditingAcademic ? (
                      <button
                        type="button"
                        onClick={() => {
                          setAcademicForm({
                            courseId: user?.courseId || '',
                            graduationYear: user?.graduationYear || '',
                            regNo: user?.regNo || ''
                          });
                          setIsEditingAcademic(true);
                        }}
                        className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-primary border border-primary/30 transition-all flex items-center gap-1.5"
                      >
                        <span>✏️</span>
                        <span>Edit</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setIsEditingAcademic(false)}
                        className="text-xs text-text-secondary hover:text-white px-2 py-1"
                      >
                        Cancel
                      </button>
                    )}
                  </div>

                  {!isEditingAcademic ? (
                    <div className="space-y-4">
                      <div className="p-4 bg-card/50 rounded-lg border border-white/5">
                        <p className="text-xs text-text-secondary uppercase tracking-wide mb-1.5">College</p>
                        <div className="flex items-center gap-3">
                          <CollegeLogo
                            collegeId={user?.collegeId}
                            collegeName={user?.collegeName}
                            emailDomain={user?.email}
                            size="lg"
                            className="w-12 h-12 bg-white p-1 rounded-xl shadow-md border border-white/20 flex-shrink-0"
                          />
                          <p className="text-base font-semibold text-text-primary">{user?.collegeName || user?.collegeId || 'N/A'}</p>
                        </div>
                      </div>
                      <div className="p-4 bg-card/50 rounded-lg border border-white/5">
                        <p className="text-xs text-text-secondary uppercase tracking-wide mb-1">Course</p>
                        <p className="text-base font-semibold text-text-primary">{user?.courseName || user?.courseId || 'N/A'}</p>
                      </div>
                      <div className="p-4 bg-card/50 rounded-lg border border-white/5">
                        <p className="text-xs text-text-secondary uppercase tracking-wide mb-1">Graduation Year</p>
                        <p className="text-base font-semibold text-text-primary">{user?.graduationYear || 'N/A'}</p>
                      </div>
                      {user?.regNo && (
                        <div className="p-4 bg-card/50 rounded-lg border border-white/5">
                          <p className="text-xs text-text-secondary uppercase tracking-wide mb-1">Registration Number</p>
                          <p className="text-base font-semibold text-text-primary">{user.regNo}</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <form onSubmit={handleSaveAcademic} className="space-y-4 text-xs">
                      <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                        <p className="text-[11px] text-text-secondary uppercase tracking-wide mb-1">College (Fixed)</p>
                        <p className="text-sm font-semibold text-text-primary">{user?.collegeName || 'NNNIT Allahabad'}</p>
                      </div>

                      <div>
                        <label className="block font-semibold uppercase tracking-wider text-text-secondary mb-1">
                          Course
                        </label>
                        <select
                          value={academicForm.courseId}
                          onChange={(e) => setAcademicForm({ ...academicForm, courseId: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-card rounded-xl border border-white/15 text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                          <option value="">Select your course</option>
                          {courses.map((c) => (
                            <option key={c.course_id} value={c.course_id}>
                              {c.course_name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block font-semibold uppercase tracking-wider text-text-secondary mb-1">
                          Graduation Year
                        </label>
                        <input
                          type="number"
                          min="2020"
                          max="2035"
                          value={academicForm.graduationYear}
                          onChange={(e) => setAcademicForm({ ...academicForm, graduationYear: e.target.value })}
                          placeholder="e.g. 2026"
                          className="w-full px-3.5 py-2.5 bg-card rounded-xl border border-white/15 text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold uppercase tracking-wider text-text-secondary mb-1">
                          Registration Number
                        </label>
                        <input
                          type="text"
                          value={academicForm.regNo}
                          onChange={(e) => setAcademicForm({ ...academicForm, regNo: e.target.value })}
                          placeholder="e.g. 20224050"
                          className="w-full px-3.5 py-2.5 bg-card rounded-xl border border-white/15 text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>

                      <div className="flex items-center justify-end gap-2 pt-2">
                        <button
                          type="button"
                          onClick={() => setIsEditingAcademic(false)}
                          className="btn-outline text-xs px-4 py-2"
                          disabled={savingAcademic}
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="btn-primary text-xs px-5 py-2 flex items-center gap-1.5"
                          disabled={savingAcademic}
                        >
                          {savingAcademic ? 'Saving...' : 'Save Changes'}
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
