// src/components/auth/LoginForm.jsx

import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const loginSchema = z.object({
  email: z.string().email({ message: "Por favor, insira um e-mail válido." }),
  password: z.string().min(1, { message: "A senha não pode estar em branco." }),
});

const LoginForm = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const [apiError, setApiError] = useState("");
  
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const handleLogin = async (data) => {
    setApiError("");
    const result = await login(data.email, data.password);
    if (result.success) {
      navigate(from, { replace: true });
    } else {
      setApiError(result.message || "Credenciais inválidas");
    }
  };

  return (
    <>
      <h2 className="text-2xl font-bold mb-6 text-center">Bem-vindo de volta</h2>
      {apiError && (
        <div className="bg-red-100 text-red-700 p-3 rounded-md text-center mb-4">{apiError}</div>
      )}
      <form onSubmit={handleSubmit(handleLogin)} className="space-y-6">
        <div className="space-y-1">
          <label htmlFor="email">E-mail</label>
          <input
            id="email"
            type="email"
            placeholder="seu@email.com"
            {...register("email")}
            className="w-full px-3 py-2 border rounded-lg border-gray-300 focus:outline-none focus:border-gray-400"
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
        </div>
        <div className="space-y-1">
            <div className="flex items-center justify-between">
                <label htmlFor="password">Senha</label>
                <Link to="/esqueci-senha" className="text-sm text-blue-600 hover:underline">Esqueceu a senha?</Link>
            </div>
            <input
                id="password"
                type="password"
                placeholder="••••••••"
                {...register("password")}
                className="w-full px-3 py-2 border rounded-lg border-gray-300 focus:outline-none focus:border-gray-400"
            />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
        </div>
        <button type="submit" disabled={isSubmitting} className="w-full py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-blue-300">
          {isSubmitting ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </>
  );
};

export default LoginForm;