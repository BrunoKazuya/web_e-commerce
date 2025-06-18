// Import hooks from react-router-dom for navigation.
import { useNavigate, useLocation } from "react-router-dom";
// Import useState hook from React to manage local component state.
import { useState } from "react";
// Import the custom authentication context to access the login function.
import { useAuth } from "../../contexts/AuthContext";
// Import React Hook Form for efficient form state management and validation.
import { useForm } from 'react-hook-form';
// Import Zod for schema-based validation.
import { z } from 'zod';
// Import the resolver that connects Zod with React Hook Form.
import { zodResolver } from '@hookform/resolvers/zod';

// Define the validation schema for the login form using Zod.
const loginSchema = z.object({
  email: z.string().email({ message: "Por favor, insira um e-mail válido." }),
  password: z.string().min(1, { message: "A senha não pode estar em branco." }),
});

const LoginForm = () => {
  // Get the login function from the authentication context.
  const { login } = useAuth();
  // Get navigation functions from react-router-dom.
  const navigate = useNavigate();
  const location = useLocation();
  // Determine the page to redirect to after successful login. Defaults to homepage.
  const from = location.state?.from?.pathname || "/";

  // Local state to hold any error messages returned from the API.
  const [apiError, setApiError] = useState("");
  
  // Initialize react-hook-form with the Zod resolver.
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(loginSchema),
  });

  // This function is called only when the form validation is successful.
  const handleLogin = async (data) => {
    // Clear any previous API errors.
    setApiError("");
    // Call the async login function from the context.
    const result = await login(data.email, data.password);
    // If the login was successful, navigate to the intended page.
    if (result.success) {
      navigate(from, { replace: true });
    } else {
      // If it failed, set the API error message to display to the user.
      setApiError(result.message || "Credenciais inválidas");
    }
  };

  return (
    <>
      <h2 className="text-2xl font-bold mb-6 text-center">Bem-vindo de volta</h2>
      {/* Conditionally render the API error message if it exists. */}
      {apiError && (
        <div className="bg-red-100 text-red-700 p-3 rounded-md text-center mb-4">{apiError}</div>
      )}
      {/* The form's onSubmit is now handled by react-hook-form's handleSubmit. */}
      <form onSubmit={handleSubmit(handleLogin)} className="space-y-6">
        <div className="space-y-1">
          <label htmlFor="email">E-mail</label>
          <input
            id="email"
            type="email"
            placeholder="seu@email.com"
            // The 'register' function connects this input to the form state and validation.
            {...register("email")}
            className={`w-full px-3 py-2 border rounded-lg border-gray-300 focus:outline-none focus:border-gray-400 ${errors.email ? 'border-red-500' : ''}`}
          />
          {/* Conditionally render the validation error message for this field. */}
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
        </div>
        <div className="space-y-1">
          {/* Label for the password field was added for better accessibility. */}
          <label htmlFor="password">Senha</label>
          <input
            id="password"
            type="password"
            placeholder="••••••••"
            {...register("password")}
            className={`w-full px-3 py-2 border rounded-lg border-gray-300 focus:outline-none focus:border-gray-400 ${errors.password ? 'border-red-500' : ''}`}
          />
          {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
        </div>
        {/* The button is disabled automatically while the form is submitting. */}
        <button type="submit" disabled={isSubmitting} className="w-full py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-blue-300">
          {isSubmitting ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </>
  );
};

export default LoginForm;