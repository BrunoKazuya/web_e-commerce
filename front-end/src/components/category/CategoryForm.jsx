// src/components/category/CategoryForm.jsx

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

// Schema de validação com Zod
const categorySchema = z.object({
  name: z.string().min(3, "O nome precisa ter no mínimo 3 caracteres."),
  slogan: z.string().optional(),
  image: z.string().min(1, { message: "A imagem é obrigatória." }),
});
const CategoryForm = ({
  isAdd = true,
  category = {},
  onFormSubmit,
  isSubmitting,
}) => {
  const navigate = useNavigate();
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState(category?.image || "");
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(categorySchema),
  });

  // Preenche o formulário com os dados da categoria no modo de edição
  useEffect(() => {
    if (!isAdd && category) {
      reset({
        name: category.name,
        slogan: category.slogan,
      });
    }
  }, [category, isAdd, reset]);

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);
    setUploading(true);

    try {
      // Ajuste a URL para a rota específica de categorias
      const res = await fetch("http://localhost:3000/api/upload/categories", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      // Salva o caminho completo retornado pela API
      setValue("image", data.image, { shouldValidate: true });
      setImagePreview(data.image);
    } catch (error) {
      alert(`O upload da imagem falhou: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      <div className="space-y-1">
        <label htmlFor="name" className="block text-sm font-medium">
          Nome da Categoria
        </label>
        <input
          id="name"
          {...register("name")}
          className={`w-full px-3 py-2 border rounded-lg border-gray-300 focus:outline-none focus:border-blue-400 ${
            errors.name ? "border-red-500" : ""
          }`}
        />
        {errors.name && (
          <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-1">
        <label htmlFor="slogan" className="block text-sm font-medium">
          Slogan (opcional)
        </label>
        <input
          id="slogan"
          {...register("slogan")}
          className="w-full px-3 py-2 border rounded-lg border-gray-300 focus:outline-none focus:border-blue-400"
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="image-file" className="block text-sm font-medium">
          Imagem da Categoria
        </label>
        {/* Este input escondido armazena o caminho da imagem para o formulário */}
        <input type="text" {...register("image")} className="hidden" />

        <input
          id="image-file"
          type="file"
          accept="image/png, image/jpeg, image/jpg"
          onChange={uploadFileHandler}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
        {uploading && (
          <p className="text-sm text-blue-600 mt-2">Enviando imagem...</p>
        )}
        {imagePreview && !uploading && (
          <div className="mt-4">
            <img
              src={"http://localhost:3000"+imagePreview}
              alt="Pré-visualização"
              className="h-32 w-32 object-cover rounded-lg"
            />
          </div>
        )}
        {errors.image && (
          <p className="text-red-500 text-xs mt-1">{errors.image.message}</p>
        )}
      </div>

      <div className="flex justify-end pt-4 gap-4">
        <button
          type="button"
          onClick={() => navigate("/dashboard/categorias")}
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
            ? "Adicionar Categoria"
            : "Salvar Alterações"}
        </button>
      </div>
    </form>
  );
};

export default CategoryForm;
