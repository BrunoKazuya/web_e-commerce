import Navbar from "../components/Navbar"; // Imports the Navbar component.
import Footer from "../components/Footer"; // Imports the Footer component.
import {  Mail, Phone, MapPin } from "lucide-react"; // Imports icons from lucide-react.
import * as Label from "@radix-ui/react-label"; // Imports the Label component from Radix UI.

const ContactPage = () => { // Defines the ContactPage component.
  return ( // Returns the JSX for the page.
    <div className="min-h-screen flex flex-col"> {/* Main container to fill the screen height. */}
      <Navbar /> {/* Renders the navigation bar. */}

      <main className="flex-1 py-16"> {/* Main content area that expands. */}
      <div className="max-w-7xl mx-auto px-6 sm:px-4 lg:px-2"> {/* Centered container. */}
        <div className="max-w-4xl mx-auto"> {/* Inner container for content alignment. */}
          <h1 className="text-4xl font-bold mb-8">Contato</h1> {/* Page title. */}

          <div className="grid md:grid-cols-2 gap-12"> {/* Grid layout for contact info and form. */}
            {/* Contact Information */}
            <div>
              <h2 className="text-2xl font-semibold mb-6">Entre em Contato</h2> {/* Section heading. */}
              <div className="space-y-4"> {/* Container for contact details with spacing. */}
                <div className="flex items-center gap-3"> {/* Email info. */}
                  <Mail className="text-blue-600 h-5 w-5" />
                  <span>suporte@exemplo.com</span>
                </div>
                <div className="flex items-center gap-3"> {/* Phone info. */}
                  <Phone className="text-blue-600 h-5 w-5" />
                  <span>(11) 99999-9999</span>
                </div>
                <div className="flex items-center gap-3"> {/* Address info. */}
                  <MapPin className="text-blue-600 h-5 w-5" />
                  <span>Rua da Loja, 123, São Paulo - SP</span>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <form className="space-y-4"> {/* The contact form. */}
                <div> {/* Name field container. */}
                  <Label.Root htmlFor="name" className="block text-sm font-medium mb-1">
                    Nome
                  </Label.Root>
                  <input
                    id="name"
                    type="text"
                    placeholder="Seu nome"
                    className="w-full px-3 py-2 border border-gray-200 rounded-md"
                  />
                </div>

                <div> {/* Email field container. */}
                  <Label.Root htmlFor="email" className="block text-sm font-medium mb-1">
                    E-mail
                  </Label.Root>
                  <input
                    id="email"
                    type="email"
                    placeholder="Seu e-mail"
                    className="w-full px-3 py-2 border border-gray-200 rounded-md"
                  />
                </div>

                <div> {/* Message field container. */}
                  <Label.Root htmlFor="message" className="block text-sm font-medium mb-1">
                    Mensagem
                  </Label.Root>
                  <textarea
                    id="message"
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-200 rounded-md"
                    placeholder="Sua mensagem"
                  />
                </div>

                <button // The submit button.
                  type="submit"
                  className="w-full bg-blue-600 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-800"
                >
                  Enviar Mensagem
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
      <Footer /> {/* Renders the footer. */}
    </div>
  );
};

export default ContactPage; // Exports the component.