import { RegisterForm } from '../components/auth/RegisterForm';

// Register Page
// Replaces: register.html + auth.js register handler

export function RegisterPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gradient-auth p-4 py-8">
      <h2 className="text-white text-2xl font-semibold mb-6 tracking-tight">Student Registration</h2>
      <div className="card-glass w-full max-w-2xl shadow-glass">
        <RegisterForm />
      </div>
    </div>
  );
}
