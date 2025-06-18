import * as Tabs from "@radix-ui/react-tabs"; // Imports all components from the Radix UI Tabs library.
import Navbar from "../components/Navbar"; // Imports the Navbar component.
import { useState } from "react"; // Imports the useState hook from React.
import Footer from "../components/Footer"; // Imports the Footer component.
import LoginForm from "../components/auth/LoginForm"; // Imports the login form component.
import RegisterForm from "../components/auth/RegisterForm"; // Imports the registration form component.

const AuthPage = () => { // Defines the AuthPage functional component.
  const [isLogin, setIsLogin] = useState(true); // State to track whether the login or register tab is active.
  return ( // Returns the JSX for the page.
    <> {/* React Fragment to return multiple top-level elements. */}
      <Navbar /> {/* Renders the navigation bar. */}
      <div className="max-w-7xl mx-auto px-6 sm:px-4 lg:px-2 py-16"> {/* Main content container with padding. */}
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8"> {/* Centered card for the authentication forms. */}
          <Tabs.Root defaultValue="login" className="space-y-8"> {/* Root component for the tabs functionality. */}
            <Tabs.List className="grid grid-cols-2 mb-8 w-full bg-gray-100 rounded-lg p-1"> {/* List of tab triggers. */}
              <Tabs.Trigger // The trigger for the "Login" tab.
                value="login" // Associates this trigger with the 'login' content.
                className={`py-2 text-center cursor-pointer ${ // Dynamically applies classes based on the active tab.
                  isLogin ? "bg-white text-black" : "text-gray-400"
                } rounded-lg`}
                onClick={() => { // Click handler to switch to the login tab.
                  if (!isLogin) {
                    setIsLogin(!isLogin);
                  }
                }}
              >
                Entrar
              </Tabs.Trigger>
              <Tabs.Trigger // The trigger for the "Register" tab.
                value="register" // Associates this trigger with the 'register' content.
                className={`py-2 text-center cursor-pointer ${ // Dynamically applies classes.
                  !isLogin ? "bg-white text-black" : "text-gray-400"
                } rounded-lg`}
                onClick={() => { // Click handler to switch to the register tab.
                  if (isLogin) {
                    setIsLogin(!isLogin);
                  }
                }}
              >
                Cadastrar
              </Tabs.Trigger>
            </Tabs.List>

            <Tabs.Content value="login" className="space-y-6"> {/* Content area for the login tab. */}
              <LoginForm/> {/* Renders the LoginForm component. */}
            </Tabs.Content>

            <Tabs.Content value="register" className="space-y-6"> {/* Content area for the register tab. */}
              <RegisterForm/> {/* Renders the RegisterForm component. */}
            </Tabs.Content>
          </Tabs.Root>
        </div>
      </div>
      <Footer /> {/* Renders the footer. */}
    </>
  );
};

export default AuthPage; // Exports the AuthPage component.