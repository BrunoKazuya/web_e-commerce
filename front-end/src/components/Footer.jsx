const Footer = () => { // Defines the Footer functional component.
    return ( // Returns the JSX to be rendered.

        <footer className="bg-gray-50 pt-12 pb-8"> {/* Footer element with background color and padding styles. */}
            <div className="max-w-7xl mx-auto px-6 sm:px-4 lg:px-2"> {/* Centered container with max-width and horizontal padding. */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8"> {/* Grid layout for the footer links, responsive for different screen sizes. */}
                    <div> {/* First column of the footer grid. */}
                        <h3 className="text-lg font-semibold mb-4">Buy things</h3> {/* Title for the site description section. */}
                        <p className="text-gary-600 text-sm"> {/* Paragraph with a short description of the site. */}
                            Compre itens de forma fácil e rápida direto para sua casa
                        </p>
                    </div>
                    <div> {/* Second column of the footer grid. */}
                        <h3 className="text-lg font-semibold mb-4">Compras</h3> {/* Title for the shopping links section. */}
                        <ul> {/* Unordered list for the links. */}
                            <li><a href="/produtos" className="text-gray-600 hover:text-primary">Todos os produtos</a></li> {/* Link to the all products page. */}
                        </ul>
                    </div>
                    <div> {/* Third column of the footer grid. */}
                        <h3 className="text-lg font-semibold mb-4">Atendimento</h3> {/* Title for the customer service links section. */}
                        <ul> {/* Unordered list for the links. */}
                            <li><a href="/contato" className="text-gray-600 hover:text-primary">Contato</a></li> {/* Link to the contact page. */}
                        </ul>
                    </div>
                    <div> {/* Fourth column of the footer grid. */}
                        <h3 className="text-lg font-semibold mb-4">Sobre</h3> {/* Title for the about section. */}
                            <a href="/sobre" className="text-gray-600 hover:text-primary">Nossa história</a> {/* Link to the about page. */}
                    </div>
                </div>

                <div className="border-t border-gray-200 mt-12 pt-8"> {/* Bottom section of the footer with a top border. */}
                    <p> {/* Paragraph for the copyright notice. */}
                    &#169; Todos direitos reservados
                    </p>
                </div>
            </div>      
        </footer>

    );
}
 
export default Footer; // Exports the Footer component for use in other parts of the application.