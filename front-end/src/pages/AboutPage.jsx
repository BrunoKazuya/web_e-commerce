import Navbar from "../components/Navbar"; // Imports the Navbar component.
import Footer from "../components/Footer"; // Imports the Footer component.

const AboutPage = () => { // Defines the AboutPage functional component.
  return ( // Returns the JSX for the page.
    <div className="min-h-screen flex flex-col"> {/* Main container with minimum height to fill the screen and a column flex layout. */}
      <Navbar /> {/* Renders the navigation bar. */}
      
      <main className="flex-1 py-16"> {/* Main content area that grows to fill available space, with vertical padding. */}
        <div className="max-w-7xl mx-auto px-6 sm:px-4 lg:px-2"> {/* Centered container with max-width and horizontal padding. */}
          <h1 className="text-4xl font-bold mb-8">Sobre Nós</h1> {/* Main page heading. */}
          
          <div className="prose prose-lg max-w-none"> {/* Container for formatted text content, using Tailwind's typography plugin. */}
            <p className="text-lg text-gray-600 mb-6"> {/* Introductory paragraph. */}
              Bem-vindo à nossa loja online! Somos dedicados a proporcionar a melhor experiência 
              de compra para nossos clientes com uma ampla seleção de produtos de qualidade.
            </p>
            
            <div className="grid md:grid-cols-2 gap-8 mt-12"> {/* Grid container for mission and vision cards. */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"> {/* Card for "Our Mission". */}
                <h3 className="text-xl font-semibold mb-4">Nossa Missão</h3> {/* Mission heading. */}
                <p className="text-gray-600"> {/* Mission statement paragraph. */}
                  Fornecer aos nossos clientes produtos da mais alta qualidade a preços competitivos,
                  enquanto entregamos um serviço excepcional ao cliente.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"> {/* Card for "Our Vision". */}
                <h3 className="text-xl font-semibold mb-4">Nossa Visão</h3> {/* Vision heading. */}
                <p className="text-gray-600"> {/* Vision statement paragraph. */}
                  Nos tornar o destino online mais confiável para produtos de qualidade e criar
                  relacionamentos duradouros com nossos clientes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer /> {/* Renders the footer. */}
    </div>
  );
};

export default AboutPage; // Exports the AboutPage component.