import * as Label from "@radix-ui/react-label";
import * as Checkbox from "@radix-ui/react-checkbox";
import * as Slider from "@radix-ui/react-slider";
import { Search, FunnelX, Check } from 'lucide-react';

const Filter = ({
  selectedCategory,
  onCategoryChange,
  selectedPrice,
  onPriceChange,
  selectedSearch,
  onSearchChange,
  minMaxRange,
  categories = []
}) => {

  const handleCategoryClick = (categoryId) => {
    // Se a categoria clicada já for a selecionada, limpa o filtro.
    // Senão, seleciona a nova categoria.
    const newCategory = selectedCategory === categoryId ? "" : categoryId;
    onCategoryChange(newCategory);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold">Filtros</h2>
        <button
          onClick={() => {
            onPriceChange([minMaxRange[0], minMaxRange[1]]);
            onCategoryChange("");
            onSearchChange("");
          }}
          className="flex items-center text-sm text-gray-500 hover:text-gray-800"
        >
          <FunnelX className="h-4 w-4 mr-1" />
          Limpar
        </button>
      </div>

      <div className="mb-6">
        <Label.Root htmlFor="search" className="font-medium mb-2 block text-sm">Busca</Label.Root>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            id="search"
            type="text"
            placeholder="Buscar produtos..."
            className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-lg"
            value={selectedSearch}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>

      <div className="mb-6">
        <h3 className="font-medium mb-3 text-sm">Categorias</h3>
        <div className="space-y-3">
          {categories.map((category) => (
            <div key={category._id} className="flex items-center">
              <Checkbox.Root
                id={category._id}
                // A prop 'checked' determina se a caixa está marcada
                checked={selectedCategory === category._id}
                // 'onCheckedChange' é a função que será chamada ao clicar
                onCheckedChange={() => handleCategoryClick(category._id)}
                className="h-4 w-4 border border-gray-300 rounded-sm data-[state=checked]:bg-blue-600 data-[state=checked]:text-white"
              >
                <Checkbox.Indicator>
                  <Check className="h-4 w-4" />
                </Checkbox.Indicator>
              </Checkbox.Root>
              <Label.Root htmlFor={category._id} className="ml-2 text-sm cursor-pointer select-none">
                {category.name}
              </Label.Root>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <h3 className="font-medium mb-3 text-sm">Preço</h3>
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
          {/* O key aqui pode ser o índice pois a ordem nunca muda (são sempre 2 alças) */}
          {selectedPrice.map((_, idx) => (
            <Slider.Thumb key={idx} className="block w-5 h-5 bg-white border-2 border-blue-600 rounded-full cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-400" />
          ))}
        </Slider.Root>
        <div className="flex items-center justify-between mt-2 text-sm text-gray-600">
          <span>R$ {selectedPrice[0]}</span>
          <span>R$ {selectedPrice[1]}</span>
        </div>
      </div>
    </div>
  );
};

export default Filter;