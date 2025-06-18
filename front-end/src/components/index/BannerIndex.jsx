/**
 * A simple, static presentational component that displays the main hero banner for the homepage.
 * It does not receive any props and has no internal state.
 */
const BannerIndex = () => {
  // The return statement contains the JSX (HTML-like syntax) to be rendered by the component.
  return (
    // The main container for the banner section.
    // Tailwind CSS classes are used for styling: a relative position, a right-facing gradient background, and vertical padding.
    <section className="relative bg-gradient-to-r from-blue-600 to-indigo-700 py-24 sm:py-32">
      
      {/* A container div to enforce a maximum width, center the content horizontally (mx-auto), and apply padding. */}
      <div className="max-w-7xl mx-auto px-6 sm:px-4 lg:px-2 text-center space-y-4">
        
        {/* The main heading (H1) of the banner with specific text styling. */}
        <h1 className="text-5xl font-bold text-white">
          Bem-vindo a Buy Things
        </h1>
        
        {/* The subheading or descriptive paragraph (p) for the banner. */}
        <p className="text-white font-light text-lg">
          Descubra produtos incríveis para todas as necessidades com frete
          grátis em compras acima de R$250
        </p>
        
      </div>
    </section>
  );
};

// Export the component as the default export of this file, allowing it to be imported in other files.
export default BannerIndex;