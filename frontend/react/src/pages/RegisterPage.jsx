import { RegisterForm } from '../components/auth/RegisterForm';

// Register Page
// Replaces: register.html + auth.js register handler

export function RegisterPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gradient-auth p-4 py-8">
      {/* Brand Logo & Name */}
      <div className="flex flex-col items-center mb-6 text-center">
        <img
          src="/logos/appLogo.jpeg"
          alt="CampusCare Logo"
          className="w-16 h-16 md:w-20 md:h-20 rounded-2xl shadow-2xl border-2 border-white/40 object-cover mb-3 hover:scale-105 transition-transform p-0.5 bg-white/10 backdrop-blur-md"
          onError={(e) => {
            e.target.src = '/appLogo.jpeg';
          }}
        />
        <h1 className="text-white text-3xl font-extrabold tracking-tight">CampusCare</h1>
        <p className="text-white/75 text-sm mt-1">Student Account Registration</p>
      </div>

      <div className="card-glass w-full max-w-2xl shadow-glass">
        <RegisterForm />
      </div>
    </div>
  );
}
