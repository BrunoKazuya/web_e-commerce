import { Link } from "react-router-dom";
import * as Tabs from "@radix-ui/react-tabs";
import * as Label from "@radix-ui/react-label";
import Navbar from "../components/Navbar";
import { useState } from "react";

const AuthPage = () => {
  
  const [isLogin, setIsLogin] = useState(true);

  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 sm:px-4 lg:px-2 py-16">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8">
          <Tabs.Root defaultValue="login" className="space-y-8">
            <Tabs.List className="grid grid-cols-2 mb-8 w-full bg-gray-100 rounded-lg p-1">
              <Tabs.Trigger
                value="login"
                className={`py-2 text-center cursor-pointer ${isLogin ? "bg-white text-black" : "text-gray-400"} rounded-lg`}
                onClick={() => {if (!isLogin) {
                    setIsLogin(!isLogin)
                }}}
              >
                Entrar
              </Tabs.Trigger>
              <Tabs.Trigger
                value="register"
                className={`py-2 text-center cursor-pointer ${!isLogin ? "bg-white text-black" : "text-gray-400"} rounded-lg`}
                onClick={() => {if (isLogin) {
                    setIsLogin(!isLogin)
                }}}
              >
                Cadastrar
              </Tabs.Trigger>
            </Tabs.List>

            {/* LOGIN */}
            <Tabs.Content value="login" className="space-y-6">
              <h2 className="text-2xl font-bold mb-6 text-center">
                Bem-vindo de volta
              </h2>
              <form className="space-y-6">
                <div className="space-y-2">
                  <Label.Root
                    htmlFor="email"
                    className="block text-sm font-medium"
                  >
                    E-mail
                  </Label.Root>
                  <input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
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
                    className="w-full px-3 py-2 border-gray-300 border rounded-lg"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-800 cursor-pointer"
                >
                  Entrar
                </button>
              </form>
            </Tabs.Content>

            {/* REGISTER */}
            <Tabs.Content value="register" className="space-y-6">
              <h2 className="text-2xl font-bold mb-6 text-center">
                Criar uma conta
              </h2>
              <form className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label.Root
                      htmlFor="firstName"
                      className="block text-sm font-medium"
                    >
                      Nome
                    </Label.Root>
                    <input
                      id="firstName"
                      placeholder="João"
                      required
                      className="w-full px-3 py-2 border rounded-lg border-gray-300"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label.Root
                      htmlFor="lastName"
                      className="block text-sm font-medium"
                    >
                      Sobrenome
                    </Label.Root>
                    <input
                      id="lastName"
                      placeholder="Silva"
                      required
                      className="w-full px-3 py-2 border rounded-lg border-gray-300"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label.Root
                    htmlFor="registerEmail"
                    className="block text-sm font-medium"
                  >
                    E-mail
                  </Label.Root>
                  <input
                    id="registerEmail"
                    type="email"
                    placeholder="seu@email.com"
                    required
                    className="w-full px-3 py-2 border rounded-lg border-gray-300"
                  />
                </div>

                <div className="space-y-2">
                  <Label.Root
                    htmlFor="registerPassword"
                    className="block text-sm font-medium"
                  >
                    Senha
                  </Label.Root>
                  <input
                    id="registerPassword"
                    type="password"
                    placeholder="••••••••"
                    required
                    className="w-full px-3 py-2 border rounded-lg border-gray-300"
                  />
                </div>

                <div className="space-y-2">
                  <Label.Root
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium"
                  >
                    Confirmar Senha
                  </Label.Root>
                  <input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    required
                    className="w-full px-3 py-2 border rounded-lg border-gray-300"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-800 cursor-pointer"
                >
                  Cadastrar
                </button>
              </form>
            </Tabs.Content>
          </Tabs.Root>
        </div>
      </div>
      {/* <Footer /> */}
    </>
  );
};

export default AuthPage;
