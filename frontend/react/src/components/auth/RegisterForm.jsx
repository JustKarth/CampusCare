import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthOperations } from '../../hooks/useAuth';
import { useDropdownData } from '../../hooks/useDropdownData';
import { ErrorMessage } from '../common/ErrorMessage';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { validateRegistrationForm } from '../../utils/validation';

// Register Form component
// Replaces: register.html form + auth.js register handler

export function RegisterForm() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirm_password: '',
    reg_no: '',
    first_name: '',
    middle_name: '',
    last_name: '',
    course_id: '',
    graduation_year: '',
    date_of_birth: '',
    native_state_id: '',
    native_city: '',
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const { register, loading, error } = useAuthOperations();
  const { courses, states, loading: dropdownLoading, error: dropdownError } = useDropdownData();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear field error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    const validation = validateRegistrationForm(formData);
    if (!validation.isValid) {
      setFieldErrors(validation.errors);
      return;
    }

    setFieldErrors({});

    // Build payload (exclude confirm_password, convert numbers)
    const payload = {
      email: formData.email.trim(),
      password: formData.password,
      reg_no: formData.reg_no.trim(),
      first_name: formData.first_name.trim(),
      middle_name: formData.middle_name.trim() || undefined,
      last_name: formData.last_name.trim(),
      course_id: formData.course_id ? parseInt(formData.course_id, 10) : undefined,
      graduation_year: formData.graduation_year ? parseInt(formData.graduation_year, 10) : undefined,
      date_of_birth: formData.date_of_birth,
      native_state_id: formData.native_state_id ? parseInt(formData.native_state_id, 10) : undefined,
      native_city: formData.native_city.trim() || undefined,
    };

    await register(payload);
  };

  const getFieldError = (fieldName) => fieldErrors[fieldName] || '';

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl space-y-4 fade-up">
      <ErrorMessage message={error || dropdownError} />

      {dropdownLoading && (
        <div className="flex items-center justify-center py-4">
          <LoadingSpinner size="sm" className="text-blue-600" />
          <span className="ml-2 text-gray-600">Loading form options...</span>
        </div>
      )}

      <div>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="College Email"
          required
          disabled={loading}
          className={`w-full px-4 py-3 rounded-lg border transition-all disabled:opacity-50 ${
            getFieldError('email')
              ? 'border-red-300 focus:ring-red-500'
              : 'border-gray-300 focus:ring-pink-500'
          } focus:outline-none focus:ring-2 focus:border-transparent focus:shadow-[0_0_0_3px_rgba(255,79,154,0.2)]`}
        />
        {getFieldError('email') && (
          <p className="text-red-600 text-sm mt-1">{getFieldError('email')}</p>
        )}
      </div>

      <input
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        placeholder="Password"
        required
        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent focus:shadow-[0_0_0_3px_rgba(255,79,154,0.2)] transition-all disabled:opacity-50"
        disabled={loading}
      />

      <input
        type="password"
        name="confirm_password"
        value={formData.confirm_password}
        onChange={handleChange}
        placeholder="Confirm Password"
        required
        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent focus:shadow-[0_0_0_3px_rgba(255,79,154,0.2)] transition-all disabled:opacity-50"
        disabled={loading}
      />

      <input
        type="text"
        name="reg_no"
        value={formData.reg_no}
        onChange={handleChange}
        placeholder="Registration Number"
        required
        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent focus:shadow-[0_0_0_3px_rgba(255,79,154,0.2)] transition-all disabled:opacity-50"
        disabled={loading}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          type="text"
          name="first_name"
          value={formData.first_name}
          onChange={handleChange}
          placeholder="First Name"
          required
          className="px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500"
        />
        <input
          type="text"
          name="middle_name"
          value={formData.middle_name}
          onChange={handleChange}
          placeholder="Middle Name (optional)"
          className="px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500"
        />
        <input
          type="text"
          name="last_name"
          value={formData.last_name}
          onChange={handleChange}
          placeholder="Last Name"
          required
          className="px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <select
            name="course_id"
            value={formData.course_id}
            onChange={handleChange}
            required
            disabled={loading || dropdownLoading}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent focus:shadow-[0_0_0_3px_rgba(255,79,154,0.2)] transition-all disabled:opacity-50"
          >
            <option value="">Select Course</option>
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.name}
              </option>
            ))}
          </select>
        </div>
        <input
          type="number"
          name="graduation_year"
          value={formData.graduation_year}
          onChange={handleChange}
          placeholder="Graduation Year"
          required
          className="px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500"
          disabled={loading}
        />
      </div>

      <input
        type="date"
        name="date_of_birth"
        value={formData.date_of_birth}
        onChange={handleChange}
        required
        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent focus:shadow-[0_0_0_3px_rgba(255,79,154,0.2)] transition-all disabled:opacity-50"
        disabled={loading}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <select
            name="native_state_id"
            value={formData.native_state_id}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent focus:shadow-[0_0_0_3px_rgba(255,79,154,0.2)] transition-all disabled:opacity-50"
            disabled={loading || dropdownLoading}
          >
            <option value="">Select State (optional)</option>
            {states.map((state) => (
              <option key={state.id} value={state.id}>
                {state.name}
              </option>
            ))}
          </select>
        </div>
        <input
          type="text"
          name="native_city"
          value={formData.native_city}
          onChange={handleChange}
          placeholder="Native City (optional)"
          className="px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500"
          disabled={loading}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 gradient-auth text-white rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <LoadingSpinner size="sm" className="text-white" />
            <span>Registering...</span>
          </>
        ) : (
          'Register'
        )}
      </button>

      <div className="text-center pt-4 border-t border-gray-200">
        <p className="text-gray-600 text-sm mb-3">Already have an account?</p>
        <Link 
          to="/login" 
          className="inline-block w-full py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-[1.02]"
        >
          Sign In to Your Account
        </Link>
      </div>
    </form>
  );
}
