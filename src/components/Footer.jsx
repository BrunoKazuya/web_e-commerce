

const Footer = () => {
    return ( 

        <footer className="bg-gray-50 pt-12 pb-8">
            <div className="max-w-7xl mx-auto px-6 sm:px-4 lg:px-2">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Buy things</h3>
                        <p className="text-gary-600 text-sm">
                            Compre itens de forma fácil e rápida direto para sua casa
                        </p>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Compras</h3>
                        <ul>
                            <li><a href="/produtos" className="text-gray-600 hover:text-primary">Todos os produtos</a></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Atendimento</h3>
                        <ul>
                            <li><a href="/contato" className="text-gray-600 hover:text-primary">Contato</a></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Sobre</h3>
                            <a href="/sobre" className="text-gray-600 hover:text-primary">Nossa história</a>
                    </div>
                </div>

                <div className="border-t border-gray-200 mt-12 pt-8">
                    <p>
                    &#169; Todos direitos reservados
                    </p>
                </div>
            </div>        
        </footer>

        

     );
}
 
export default Footer;