import * as Tabs from "@radix-ui/react-tabs";

import Navbar from "../components/Navbar";
import { useState } from "react";
import Footer from "../components/Footer";
import LoginForm from "../components/auth/LoginForm";
import RegisterForm from "../components/auth/RegisterForm";
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
                className={`py-2 text-center cursor-pointer ${
                  isLogin ? "bg-white text-black" : "text-gray-400"
                } rounded-lg`}
                onClick={() => {
                  if (!isLogin) {
                    setIsLogin(!isLogin);
                  }
                }}
              >
                Entrar
              </Tabs.Trigger>
              <Tabs.Trigger
                value="register"
                className={`py-2 text-center cursor-pointer ${
                  !isLogin ? "bg-white text-black" : "text-gray-400"
                } rounded-lg`}
                onClick={() => {
                  if (isLogin) {
                    setIsLogin(!isLogin);
                  }
                }}
              >
                Cadastrar
              </Tabs.Trigger>
            </Tabs.List>

            {/* LOGIN */}
            <Tabs.Content value="login" className="space-y-6">
              <LoginForm/>
            </Tabs.Content>

            {/* REGISTER */}
            <Tabs.Content value="register" className="space-y-6">
              <RegisterForm/>
            </Tabs.Content>
          </Tabs.Root>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AuthPage;
