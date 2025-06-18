// Import hooks and components from their respective libraries.
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

// Define the validation schema for the category form using Zod.
const categorySchema = z.object({
  name: z.string().min(3, "O nome precisa ter no mínimo 3 caracteres."),
  slogan: z.string().optional(), // Slogan is not required.
  image: z.string().min(1, { message: "A imagem é obrigatória." }), // Image path is required.
});

/**
 * A reusable form for creating and editing categories.
 * @param {object} props
 * @param {boolean} props.isAdd - Determines if the form is in 'add' or 'edit' mode.
 * @param {object} props.category - The category object for pre-filling the form in edit mode.
 * @param {function} props.onFormSubmit - The callback function to execute on form submission.
 * @param {boolean} props.isSubmitting - A boolean to indicate if the form is currently being submitted.
 */
const CategoryForm = ({
  isAdd = true,
  category = {},
  onFormSubmit,
  isSubmitting,
}) => {
  const navigate = useNavigate();
  // State for managing the image upload loading state.
  const [uploading, setUploading] = useState(false);
  // State for displaying a preview of the uploaded or existing image.
  const [imagePreview, setImagePreview] = useState('');

  // Initialize react-hook-form with the Zod resolver.
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(categorySchema),
  });

  // This effect pre-fills the form fields when in edit mode.
  useEffect(() => {
    if (!isAdd && category) {
      // Use reset to populate the form with the category's data.
      reset({
        name: category.name,
        slogan: category.slogan,
        image: category.image,
      });
      // Set the initial image preview if an image path exists.
      if (category.image) {
        setImagePreview(`http://localhost:3000${category.image}`);
      }
    }
  }, [category, isAdd, reset]);

  // Handles the file upload process.
  const uploadFileHandler = async (e) => {
    // Get the selected file from the input event.
    const file = e.target.files[0];
    if (!file) return;

    // Create a FormData object to send the file.
    const formData = new FormData();
    formData.append("image", file); // The key 'image' must match the backend (multer).
    setUploading(true); // Set loading state to true.

    try {
      // Make a direct fetch call to the dedicated upload route.
      const res = await fetch(`http://localhost:3000/upload/categories`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message); // Throw an error if the API responds with a failure.

      // On success, update the 'image' field in the form state with the returned path.
      setValue("image", data.image, { shouldValidate: true });
      // Update the preview with the newly uploaded image.
      setImagePreview(`http://localhost:3000${data.image}`);

    } catch (error) {
      alert(`O upload da imagem falhou: ${error.message}`);
    } finally {
      setUploading(false); // Set loading state back to false.
    }
  };

  return (
    // The form's onSubmit is controlled by react-hook-form's handleSubmit.
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      <div className="space-y-1">
        <label htmlFor="name" className="block text-sm font-medium">Nome da Categoria</label>
        <input id="name" {...register("name")} className={`w-full px-3 py-2 border rounded-lg ${errors.name ? 'border-red-500' : 'border-gray-300'}`} />
        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
      </div>

      <div className="space-y-1">
        <label htmlFor="slogan" className="block text-sm font-medium">Slogan (opcional)</label>
        <input id="slogan" {...register("slogan")} className="w-full px-3 py-2 border rounded-lg border-gray-300" />
      </div>

      <div className="space-y-1">
        <label htmlFor="image-file" className="block text-sm font-medium">Imagem da Categoria</label>
        {/* This hidden input stores the image path for react-hook-form's state and validation. */}
        <input type="text" {...register("image")} className="hidden" />

        <input
          id="image-file"
          type="file"
          accept="image/*"
          onChange={uploadFileHandler}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
        {uploading && <p className="text-sm text-blue-600 mt-2">Enviando imagem...</p>}
        {imagePreview && !uploading && (
          <div className="mt-4">
            <img src={imagePreview} alt="Pré-visualização" className="h-32 w-32 object-cover rounded-lg" />
          </div>
        )}
        {errors.image && <p className="text-red-500 text-xs mt-1">{errors.image.message}</p>}
      </div>

      <div className="flex justify-end pt-4 gap-4">
        <button type="button" onClick={() => navigate("/dashboard/categorias")} className="px-4 py-2 border rounded-lg hover:bg-gray-100">Cancelar</button>
        <button type="submit" disabled={isSubmitting || uploading} className="w-48 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-blue-300">
          {isSubmitting ? "Salvando..." : isAdd ? "Adicionar Categoria" : "Salvar Alterações"}
        </button>
      </div>
    </form>
  );
};

export default CategoryForm;