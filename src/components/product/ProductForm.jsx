import * as Label from "@radix-ui/react-label";
import { useState } from "react";

const ProductForm = ({
  isAdd = true,
  add = () => {},
  product = {},
  update = () => {},
}) => {
  const [name, setName] = useState(product?.name || "");
  const [price, setPrice] = useState(product?.price || "");
  const [description, setDescription] = useState(product?.description || "");
  const [category, setCategory] = useState(product?.category || "");
  const [url, setUrl] = useState(product?.url || "");
  const [stock, setStock] = useState(product?.stock || "");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isAdd) {
      const newProduct = {
        id: 1,
        name: name,
        price: Number(price),
        description: description,
        image: url,
        category: category,
        featured: true,
        inStock: Number(stock),
        rating: 4.8,
      };
      add(newProduct);
      setName("");
      setPrice("");
      setDescription("");
      setCategory("");
      setStock("");
      setUrl("");
    } else {
      product = {
        ...product,
        name: name,
        price: Number(price),
        description: description,
        image: url,
        category: category,
        featured: true,
        inStock: Number(stock),
        rating: 4.8,
      };
      update(product);
    }
  };
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="space-y-2">
          <Label.Root htmlFor="name" className="block text-sm font-medium">
            Nome do produto
          </Label.Root>
          <input
            id="name"
            type="text"
            placeholder="Digite o nome do produto"
            required
            onChange={(e) => setName(e.target.value)}
            value={name}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-400"
          />
        </div>
        <div className="space-y-2">
          <Label.Root htmlFor="price" className="block text-sm font-medium">
            Preço (R$)
          </Label.Root>
          <input
            id="price"
            type="number"
            placeholder="0,00"
            required
            onChange={(e) => setPrice(e.target.value)}
            value={price}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-400"
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label.Root htmlFor="description" className="block text-sm font-medium">
          Descrição
        </Label.Root>
        <textarea
          id="description"
          placeholder="Digite a descrição do produto"
          required
          onChange={(e) => setDescription(e.target.value)}
          value={description}
          className="w-full px-3 py-2 border-gray-300 border rounded-lg focus:outline-none focus:border-gray-400"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="space-y-2">
          <Label.Root htmlFor="category" className="block text-sm font-medium">
            Categoria
          </Label.Root>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="py-2 px-3 border border-gray-200 rounded-md text-sm w-full focus:outline-none focus:border-gray-400"
          >
            <option value="">Selecione uma categoria</option>
            <option value="esporte">Esporte</option>
            <option value="eletronico">Eletrônico</option>
            <option value="moda">Moda</option>
            <option value="casa">Casa</option>
          </select>
        </div>
        <div className="space-y-2">
          <Label.Root htmlFor="url" className="block text-sm font-medium">
            URL da imagem
          </Label.Root>
          <input
            id="url"
            type="text"
            placeholder="Digite a url da imagem"
            required
            onChange={(e) => setUrl(e.target.value)}
            value={url}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-400"
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label.Root htmlFor="stock" className="block text-sm font-medium">
          Quantidade em estoque
        </Label.Root>
        <input
          id="stock"
          type="number"
          placeholder="Digite a quantidade em estoque"
          required
          onChange={(e) => setStock(e.target.value)}
          value={stock}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-400"
        />
      </div>
      <button
        type="submit"
        className="w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-800 cursor-pointer"
      >
        Adicionar produto
      </button>
    </form>
  );
};

export default ProductForm;
