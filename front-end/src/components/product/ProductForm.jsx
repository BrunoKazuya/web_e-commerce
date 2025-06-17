// src/components/product/ProductForm.jsx (Final com Validação)

import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react"; // <-- A IMPORTAÇÃO QUE FALTAVA
import CurrencyInput from "react-currency-input-field";
// Schema de validação para o produto
const productSchema = z.object({
  name: z.string().min(3, "O nome precisa ter no mínimo 3 caracteres."),
  price: z.any() // 1. Começamos aceitando qualquer tipo de valor
    .refine(val => val !== null && val !== undefined && val !== '', {
      // 2. Primeira validação: garantir que o campo não está vazio.
      // Esta é a nossa mensagem customizada para "Required".
      message: "O preço é obrigatório.",
    })
    .transform(val => {
      // 3. Se não estiver vazio, tentamos transformar em um número.
      // Isso lida com o valor que vem do CurrencyInput (ex: "123.45").
      if (typeof val !== 'string') return val;
      const cleanedValue = val.replace(',', '.'); // Garante o formato decimal correto
      return parseFloat(cleanedValue);
    })
    .refine(num => !isNaN(num) && num > 0, {
      // 4. Finalmente, validamos se o número resultante é positivo.
      message: "O preço deve ser maior que R$ 0,00.",
    }),
  description: z
    .string()
    .min(10, "A descrição precisa ter no mínimo 10 caracteres."),
  category: z.string().nonempty("Você deve selecionar uma categoria."),
  inStock: z.coerce.number().int().min(0, "O estoque não pode ser negativo."),
  image: z.string().nonempty({ message: "A imagem do produto é obrigatória." }),
});

const ProductForm = ({
  isAdd = true,
  product = {},
  categories = [],
  onFormSubmit,
  isSubmitting,
}) => {
  const navigate = useNavigate();
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(productSchema),
  });

  // Preenche o formulário com os dados do produto quando em modo de edição
  useEffect(() => {
    if (!isAdd && product) {
      reset({
        name: product.name,
        price: product.price,
        description: product.description,
        category: product.category?._id || product.category,
        inStock: product.inStock,
        image: product.image,
      });
    }
  }, [product, isAdd, reset]);

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);
    setUploading(true);

    try {
      // Chamada direta com fetch para a rota de upload de produtos
      const res = await fetch(`http://localhost:3000/api/upload/products`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      // Salva o caminho da imagem retornado pela API no estado do formulário
      setValue("image", data.image, { shouldValidate: true });
      // Atualiza a pré-visualização com a nova imagem
      setImagePreview(`http://localhost:3000/${data.image}`);
    } catch (error) {
      alert(`O upload da imagem falhou: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-1">
          <label htmlFor="name">Nome do produto</label>
          <input
            id="name"
            {...register("name")}
            className="w-full px-3 py-2 border rounded-lg border-gray-300 focus:outline-none focus:border-gray-400"
          />
          {errors.name && (
            <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
          )}
        </div>
        <div className="space-y-1">
          <label htmlFor="price">Preço</label>
          <Controller
            name="price"
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <CurrencyInput
                id="price"
                name="price"
                placeholder="R$ 0,00"
                value={value || ""}
                // onValueChange nos dá o valor como string ('123.45') ou undefined
                onValueChange={(val) => {
                  // Se o usuário apagar o campo, 'val' será undefined. Passamos null para o hook-form.
                  onChange(val === undefined ? null : val);
                }}
                onBlur={onBlur}
                intlConfig={{ locale: "pt-BR", currency: "BRL" }}
                decimalScale={2}
                className="w-full px-3 py-2 border rounded-lg border-gray-300 focus:outline-none focus:border-gray-400"
              />
            )}
          />
          {errors.price && (
            <p className="text-red-500 text-xs mt-1">{errors.price.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-1">
        <label htmlFor="description">Descrição</label>
        <textarea
          id="description"
          rows={4}
          {...register("description")}
          className="w-full px-3 py-2 border rounded-lg border-gray-300 focus:outline-none focus:border-gray-400"
        />
        {errors.description && (
          <p className="text-red-500 text-xs mt-1">
            {errors.description.message}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-1">
          <label htmlFor="category">Categoria</label>
          <select
            id="category"
            {...register("category")}
            className="w-full px-3 py-2 border rounded-lg border-gray-300 focus:outline-none focus:border-gray-400"
          >
            <option value="">Selecione...</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="text-red-500 text-xs mt-1">
              {errors.category.message}
            </p>
          )}
        </div>
        <div className="space-y-1">
          <label htmlFor="image-upload" className="block text-sm font-medium">
            Imagem do Produto
          </label>

          {/* Este input fica oculto e é usado pelo react-hook-form para validação */}
          <input type="text" {...register("image")} className="hidden" />

          <input
            id="image-upload"
            type="file"
            accept="image/*"
            onChange={uploadFileHandler}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          {uploading && (
            <p className="text-sm text-blue-600 mt-2">Enviando imagem...</p>
          )}

          {/* Pré-visualização da Imagem */}
          {imagePreview && !uploading && (
            <div className="mt-4">
              <p className="text-xs text-gray-500 mb-1">Pré-visualização:</p>
              <img
                src={imagePreview}
                alt="Pré-visualização"
                className="h-32 w-32 object-cover rounded-lg border p-1"
              />
            </div>
          )}

          {errors.image && (
            <p className="text-red-500 text-xs mt-1">{errors.image.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-1">
        <label htmlFor="inStock">Quantidade em estoque</label>
        <input
          id="inStock"
          type="number"
          {...register("inStock")}
          className="w-full px-3 py-2 border rounded-lg border-gray-300 focus:outline-none focus:border-gray-400"
        />
        {errors.inStock && (
          <p className="text-red-500 text-xs mt-1">{errors.inStock.message}</p>
        )}
      </div>

      <div className="flex justify-end pt-4 gap-4">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="px-4 py-2 border rounded-lg hover:bg-gray-100"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-48 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-blue-300"
        >
          {isSubmitting
            ? "Salvando..."
            : isAdd
            ? "Adicionar Produto"
            : "Salvar Alterações"}
        </button>
      </div>
    </form>
  );
};

export default ProductForm;
