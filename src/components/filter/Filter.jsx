import React, { useState } from "react";

// Filter.jsx
// Recebe a categoria selecionada e a função para alterá-la do componente pai
const Filter = ({ selectedCategory, onCategoryChange, selectedPrice, onPriceChange, selectedSearch,  onSearchChange}) => 
  {
  
  const [search,setSearch] = useState("");
  // Lista de categorias fixas
  const categories = [
    { id: "esporte", name: "Esporte" },
    { id: "casual", name: "Casual" },
    { id: "formal", name: "Formal" },
    { id: "electronics", name: "Electronicos" },
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      {/* Cabeçalho com botão de limpar */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold">Filtros</h2>
        <button
          onClick={() => {
            onPriceChange(1000);
            onCategoryChange("");
            onSearchChange("");
          } 
          }
          className="flex items-center text-gray-500 hover:text-gray-700 px-2 py-1 rounded"
        >
          {/* Ícone de funil */}
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-funnel-x h-4 w-4 mr-1">
            <path d="M12.531 3H3a1 1 0 0 0-.742 1.67l7.225 7.989A2 2 0 0 1 10 14v6a1 1 0 0 0 .553.895l2 1A1 1 0 0 0 14 21v-7a2 2 0 0 1 .517-1.341l.427-.473" />
            <path d="m16.5 3.5 5 5" />
            <path d="m21.5 3.5-5 5" />
          </svg>
          Limpar
        </button>
      </div>

      {/* Campo de busca (se precisar integrar, passe callback via props) */}
      <div className="mb-6">
        <label htmlFor="search" className="mb-2 block">Buscar</label>
        <div className="relative">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-search absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400">
            <path d="m21 21-4.34-4.34" />
            <circle cx="11" cy="11" r="8" />
          </svg>
          <input
            id="search"
            type="text"
            placeholder="Buscar produtos"
            className="w-full pl-10 px-3 py-2 border border-gray-200 rounded-md"
            value={selectedSearch}
            onChange={e => {onSearchChange(e.target.value)}}
            // onChange={e => onSearchChange(e.target.value)} // opcional
          />
        </div>
      </div>

      {/* Seção de categorias */}
      <div className="mb-6">
        <h3 className="font-medium mb-3">Categorias</h3>
        <div className="space-y-2">
          {categories.map(cat => (
            <label key={cat.id} className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={selectedCategory === cat.id}
                onChange={() =>
                  onCategoryChange(selectedCategory === cat.id ? "" : cat.id)
                }
                className="h-4 w-4 border border-gray-200 rounded-sm mr-2 hover:bg-blue-200"
              />
              <span className="text-sm">{cat.name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Slider de preço (se precisar integrar, passe callbacks) */}
      <div className="mb-6">
        <h3 className="font-medium mb-3">Preço</h3>
        <input
          type="range"
          min="0"
          max="1000"
          className="w-full"
          value={selectedPrice}
          onChange={e => onPriceChange(Number(e.target.value))}
        />
        <div className="flex items-center justify-between mt-4">
          <span className="text-sm">R$0</span>
          <span className="text-sm">R${selectedPrice}</span>
        </div>
      </div>
    </div>
  );
};

export default Filter;
