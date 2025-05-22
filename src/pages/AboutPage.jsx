import Navbar from "../components/Navbar";

const AboutPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-16">
        <div className="max-w-7xl mx-auto px-6 sm:px-4 lg:px-2">
          <h1 className="text-4xl font-bold mb-8">Sobre Nós</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-lg text-gray-600 mb-6">
              Bem-vindo à nossa loja online! Somos dedicados a proporcionar a melhor experiência 
              de compra para nossos clientes com uma ampla seleção de produtos de qualidade.
            </p>
            
            <div className="grid md:grid-cols-2 gap-8 mt-12">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-xl font-semibold mb-4">Nossa Missão</h3>
                <p className="text-gray-600">
                  Fornecer aos nossos clientes produtos da mais alta qualidade a preços competitivos,
                  enquanto entregamos um serviço excepcional ao cliente.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-xl font-semibold mb-4">Nossa Visão</h3>
                <p className="text-gray-600">
                  Nos tornar o destino online mais confiável para produtos de qualidade e criar
                  relacionamentos duradouros com nossos clientes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* <Footer /> */}
    </div>
  );
};

export default AboutPage;
