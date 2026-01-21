import { RegisterForm } from '../components/auth/RegisterForm';

// Register Page
// Replaces: register.html + auth.js register handler

export function RegisterPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 p-4 py-8">
      <h2 className="text-white text-2xl font-semibold mb-6">Student Registration</h2>
      <div className="bg-white rounded-2xl p-8 w-full max-w-2xl shadow-2xl">
        <RegisterForm />
      </div>
    </div>
  );
}
