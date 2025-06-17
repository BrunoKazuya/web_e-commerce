import * as Label from "@radix-ui/react-label";
import * as Checkbox from "@radix-ui/react-checkbox";
import * as Slider from "@radix-ui/react-slider";
// Filter.jsx
// Recebe a categoria selecionada e a função para alterá-la do componente pai
const Filter = ({
  selectedCategory,
  onCategoryChange,
  selectedPrice,
  onPriceChange,
  selectedSearch,
  onSearchChange,
  minMaxRange,
  categories
}) => {
  // Lista de categorias fixas


  return (
    <div className="bg-white p-6 rounded-lg shadow-md">

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold">Filtros</h2>
        <button
          onClick={() => {
            onPriceChange([minMaxRange[0], minMaxRange[1]]);
            onCategoryChange("");
            onSearchChange("");
          }}
          className="flex items-center text-gray-500 hover:text-gray-700 px-2 py-1 cursor-pointer"
        >
          {/* Ícone de funil */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-funnel-x h-4 w-4 mr-1"
          >
            <path d="M12.531 3H3a1 1 0 0 0-.742 1.67l7.225 7.989A2 2 0 0 1 10 14v6a1 1 0 0 0 .553.895l2 1A1 1 0 0 0 14 21v-7a2 2 0 0 1 .517-1.341l.427-.473" />
            <path d="m16.5 3.5 5 5" />
            <path d="m21.5 3.5-5 5" />
          </svg>
          Limpar
        </button>
      </div>

      {/* Campo de busca (se precisar integrar, passe callback via props) */}
      <div className="mb-6">
        <Label.Root htmlFor="search" className="mb-2 block">
          Busca
        </Label.Root>
        <div className="relative">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-search absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400"
          >
            <path d="m21 21-4.34-4.34" />
            <circle cx="11" cy="11" r="8" />
          </svg>
          <input
            id="search"
            type="text"
            placeholder="Buscar produtos"
            className="w-full pl-10 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400"
            value={selectedSearch}
            onChange={(e) => {
              onSearchChange(e.target.value);
            }}
            // onChange={e => onSearchChange(e.target.value)} // opcional
          />
        </div>
      </div>

      {/* Seção de categorias */}
      <div className="mb-6">
        <h3 className="font-medium mb-3">Categorias</h3>
        <div className="space-y-2">
          {categories.map((category) => (
            <div key={category.slug} className="flex items-center">
              <Checkbox.Root
                id={`${category.slug}`}
                checked={selectedCategory === category.slug}
                onCheckedChange={() =>
                  onCategoryChange(
                    selectedCategory === category.slug ? "" : category.slug
                  )
                }
                className="h-4 w-4 border border-gray-200 rounded-sm flex items-center justify-center cursor-pointer hover:bg-blue-100"
              >
                <Checkbox.Indicator>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </Checkbox.Indicator>
              </Checkbox.Root>
              <Label.Root
                htmlFor={`category-${category.slug}`}
                className="ml-2 text-sm cursor-pointer"
              >
                {category.name}
              </Label.Root>
            </div>
          ))}
        </div>
      </div>

      {/* Slider de preço (se precisar integrar, passe callbacks) */}
       <div className="mb-6">
              <h3 className="font-medium mb-3">Preço</h3>
              <Slider.Root
                value={selectedPrice}
                min={minMaxRange[0]}
                max={minMaxRange[1]}
                step={1}
                onValueChange={onPriceChange}
                className="relative flex items-center select-none touch-none w-full h-5"
              >
                <Slider.Track className="bg-gray-200 relative flex-1 h-1 rounded-full">
                  <Slider.Range className="absolute bg-blue-600 h-full rounded-full" />
                </Slider.Track>
                {selectedPrice.map((_, idx) => (
                  <Slider.Thumb key={idx} className="block w-5 h-5 bg-white border border-gray-200 rounded-full cursor-pointer hover:bg-blue-800" />
                ))}
              </Slider.Root>
              <div className="flex items-center justify-between mt-4"><span className="text-sm">R${selectedPrice[0]}</span><span className="text-sm">R${selectedPrice[1]}</span></div>
            </div>
    </div>
  );
};

export default Filter;
