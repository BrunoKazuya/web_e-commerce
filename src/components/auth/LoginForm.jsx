import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import * as Label from "@radix-ui/react-label";


const LoginForm = () => {
  const { login } = useAuth();

  const [emailLogin, setEmailLogin] = useState("");
  const [passwordLogin, setPasswordLogin] = useState("");
  const [errorLogin, setErrorLogin] = useState(false);
  const navigate = useNavigate();
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (login(emailLogin, passwordLogin)) {
      navigate("/");
    } else {
      setErrorLogin(true);
      setPasswordLogin("")
    }
  };
  return (
    <>
      <h2 className="text-2xl font-bold mb-6 text-center">
        Bem-vindo de volta
      </h2>
      {errorLogin && (
        <div className="bg-red-200 w-full text-red-500 py-2 rounded-lg text-center">
          Credenciais inválidas
        </div>
      )}
      <form onSubmit={handleLoginSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label.Root htmlFor="email" className="block text-sm font-medium">
            E-mail
          </Label.Root>
          <input
            id="email"
            type="email"
            placeholder="seu@email.com"
            required
            onChange={(e) => setEmailLogin(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-400"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label.Root
              htmlFor="password"
              className="block text-sm font-medium"
            >
              Senha
            </Label.Root>
            <Link
              to="/forgot-password"
              className="text-sm text-blue-600 hover:underline"
            >
              Esqueceu a senha?
            </Link>
          </div>
          <input
            id="password"
            type="password"
            placeholder="••••••••"
            required
            value={passwordLogin}
            onChange={(e) => setPasswordLogin(e.target.value)}
            className="w-full px-3 py-2 border-gray-300 border rounded-lg focus:outline-none focus:border-gray-400"
          />
        </div>

        <button
          type="submit"
          className="w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-800 cursor-pointer"
        >
          Entrar
        </button>
      </form>
    </>
  );
};

export default LoginForm;
