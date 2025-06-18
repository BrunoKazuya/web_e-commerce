// Import UI components from the Radix UI library for building accessible components.
import * as Label from "@radix-ui/react-label";
import * as Checkbox from "@radix-ui/react-checkbox";
import * as Slider from "@radix-ui/react-slider";
// Import icons from the lucide-react library.
import { Search, FunnelX, Check } from 'lucide-react';

/**
 * A presentational component that displays filter controls for products.
 * It is fully controlled by its parent component.
 * @param {object} props
 * @param {string} props.selectedCategory - The ID of the currently selected category.
 * @param {function} props.onCategoryChange - Callback function to update the selected category state in the parent.
 * @param {number[]} props.selectedPrice - An array with two numbers [min, max] representing the current price range.
 * @param {function} props.onPriceChange - Callback function to update the price range state in the parent.
 * @param {string} props.selectedSearch - The current search term.
 * @param {function} props.onSearchChange - Callback function to update the search term state in the parent.
 * @param {number[]} props.minMaxRange - An array with the absolute [min, max] possible prices to set slider boundaries.
 * @param {array} props.categories - The list of all available category objects.
 */
const Filter = ({
  selectedCategory,
  onCategoryChange,
  selectedPrice,
  onPriceChange,
  selectedSearch,
  onSearchChange,
  minMaxRange,
  categories = [] // Default to an empty array to prevent errors if categories are not yet loaded.
}) => {

  // Handler for category selection.
  const handleCategoryClick = (categoryId) => {
    // If the clicked category is already the selected one, unselect it by passing an empty string.
    // Otherwise, select the new category by passing its ID.
    const newCategory = selectedCategory === categoryId ? "" : categoryId;
    onCategoryChange(newCategory);
  };

  return (
    // Main container for the filter section with styling.
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">

      {/* Header with "Filters" title and a "Clear" button. */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold">Filtros</h2>
        <button
          // When clicked, this button calls all change handlers with their default values to reset the filters.
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

      {/* Search Input Section */}
      <div className="mb-6">
        <Label.Root htmlFor="search" className="font-medium mb-2 block text-sm">Busca</Label.Root>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            id="search"
            type="text"
            placeholder="Buscar produtos..."
            className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-lg"
            // The input's value is controlled by the parent component's state.
            value={selectedSearch}
            // When the user types, it calls the parent's state update function.
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>

      {/* Categories Section */}
      <div className="mb-6">
        <h3 className="font-medium mb-3 text-sm">Categorias</h3>
        <div className="space-y-3">
          {/* Map over the categories array to render a checkbox for each one. */}
          {categories.map((category) => (
            <div key={category._id} className="flex items-center">
              {/* Radix UI Checkbox component. */}
              <Checkbox.Root
                id={category._id}
                // The 'checked' state is determined by comparing the parent's state with the current category's ID.
                checked={selectedCategory === category._id}
                // When clicked, it calls the local handler to toggle the selection.
                onCheckedChange={() => handleCategoryClick(category._id)}
                className="h-4 w-4 border border-gray-300 rounded-sm data-[state=checked]:bg-blue-600 data-[state=checked]:text-white"
              >
                {/* The visual indicator for a checked state. */}
                <Checkbox.Indicator>
                  <Check className="h-4 w-4" />
                </Checkbox.Indicator>
              </Checkbox.Root>
              {/* The label is associated with the checkbox via the 'htmlFor' attribute for better accessibility. */}
              <Label.Root htmlFor={category._id} className="ml-2 text-sm cursor-pointer select-none">
                {category.name}
              </Label.Root>
            </div>
          ))}
        </div>
      </div>

      {/* Price Slider Section */}
      <div className="mb-6">
        <h3 className="font-medium mb-3 text-sm">Preço</h3>
        {/* Radix UI Slider component for selecting a price range. */}
        <Slider.Root
          value={selectedPrice}
          min={minMaxRange[0]}
          max={minMaxRange[1]}
          step={1}
          // When the slider value changes, it calls the parent's state update function.
          onValueChange={onPriceChange}
          className="relative flex items-center select-none touch-none w-full h-5"
        >
          {/* The visual track of the slider. */}
          <Slider.Track className="bg-gray-200 relative flex-1 h-1 rounded-full">
            {/* The colored range that indicates the selected portion. */}
            <Slider.Range className="absolute bg-blue-600 h-full rounded-full" />
          </Slider.Track>
          {/* Renders the two thumbs (handles) for the range slider. */}
          {selectedPrice.map((_, idx) => (
            <Slider.Thumb key={idx} className="block w-5 h-5 bg-white border-2 border-blue-600 rounded-full cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-400" />
          ))}
        </Slider.Root>
        {/* Displays the current minimum and maximum selected prices. */}
        <div className="flex items-center justify-between mt-2 text-sm text-gray-600">
          <span>R$ {selectedPrice[0]}</span>
          <span>R$ {selectedPrice[1]}</span>
        </div>
      </div>
    </div>
  );
};

export default Filter;