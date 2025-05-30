import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {  Mail, Phone, MapPin } from "lucide-react"
import * as Label from "@radix-ui/react-label"
const ContactPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 py-16">
      <div className="max-w-7xl mx-auto px-6 sm:px-4 lg:px-2">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Contato</h1>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Informações de Contato */}
            <div>
              <h2 className="text-2xl font-semibold mb-6">Entre em Contato</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="text-blue-600 h-5 w-5" />
                  <span>suporte@exemplo.com</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="text-blue-600 h-5 w-5" />
                  <span>(11) 99999-9999</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="text-blue-600 h-5 w-5" />
                  <span>Rua da Loja, 123, São Paulo - SP</span>
                </div>
              </div>
            </div>

            {/* Formulário de Contato */}
            <div>
              <form className="space-y-4">
                <div>
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

                <div>
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

                <div>
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

                <button
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
      <Footer />
    </div>
  );
};

export default ContactPage;
