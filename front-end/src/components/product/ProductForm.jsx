import { useForm, Controller } from "react-hook-form"; // Imports the useForm hook and Controller component from react-hook-form for form management.
import { z } from "zod"; // Imports the Zod library for schema validation.
import { zodResolver } from "@hookform/resolvers/zod"; // Imports the resolver to use Zod with react-hook-form.
import { useNavigate } from "react-router-dom"; // Imports the hook for programmatic navigation.
import { useEffect, useState } from "react"; // Imports React hooks for side effects and state management.
import CurrencyInput from "react-currency-input-field"; // Imports a component for formatted currency input.

// Product validation schema using Zod.
const productSchema = z.object({
  name: z.string().min(3, "O nome precisa ter no mínimo 3 caracteres."), // Defines the name field: must be a string with a minimum of 3 characters.
  price: z.any() // Start by accepting any type of value.
    .refine(val => val !== null && val !== undefined && val !== '', { // Checks if the value is not null, undefined, or an empty string.
      message: "O preço é obrigatório.", // Custom error message for when the price is missing.
    })
    .transform(val => { // Defines a transformation for the value.
      if (typeof val !== 'string') return val; // If the value is not a string, return it as is.
      const cleanedValue = val.replace(',', '.'); // Ensures the correct decimal format by replacing comma with a dot.
      return parseFloat(cleanedValue); // Parses the cleaned string into a floating-point number.
    })
    .refine(num => !isNaN(num) && num > 0, { // Validates if the resulting number is positive.
      message: "O preço deve ser maior que R$ 0,00.", // Custom error message for invalid price.
    }),
  description: z // Defines the description field.
    .string() // Expects a string.
    .min(10, "A descrição precisa ter no mínimo 10 caracteres."), // Sets a minimum length of 10 characters.
  category: z.string().nonempty("Você deve selecionar uma categoria."), // Defines category: must be a non-empty string.
  inStock: z.coerce.number().int().min(0, "O estoque não pode ser negativo."), // Defines inStock: coerces to an integer, must be at least 0.
  image: z.string().nonempty({ message: "A imagem do produto é obrigatória." }), // Defines image: must be a non-empty string.
});

const ProductForm = ({ // Defines the ProductForm functional component with its props.
  isAdd = true, // Prop to determine if it's an "add" or "edit" form, defaults to true.
  product = {}, // Prop for the product data, defaults to an empty object.
  categories = [], // Prop for the list of categories, defaults to an empty array.
  onFormSubmit, // Prop for the function to be called on form submission.
  isSubmitting, // Prop to indicate if the form is currently being submitted.
}) => {
  const navigate = useNavigate(); // Initializes the navigate function for routing.
  const [uploading, setUploading] = useState(false); // State to track if an image is being uploaded.
  const [imagePreview, setImagePreview] = useState(""); // State to store the URL for the image preview.

  const { // Destructures methods and state from the useForm hook.
    register, // Function to register form inputs.
    handleSubmit, // Function to handle form submission, wrapping our submit handler.
    reset, // Function to reset the form fields.
    control, // Object used to connect controlled components (like Controller).
    setValue, // Function to programmatically set a field's value.
    formState: { errors }, // Object containing form state, including validation errors.
  } = useForm({ // Initializes react-hook-form with configuration.
    resolver: zodResolver(productSchema), // Uses the Zod schema for validation.
  });

  // Populates the form with product data when in edit mode.
  useEffect(() => { // React hook to handle side effects.
    if (!isAdd && product) { // Checks if it's edit mode and if product data exists.
      reset({ // Resets the form with the product's data.
        name: product.name, // Sets the name field.
        price: product.price, // Sets the price field.
        description: product.description, // Sets the description field.
        category: product.category?._id || product.category, // Sets the category, handling nested _id.
        inStock: product.inStock, // Sets the inStock field.
        image: product.image, // Sets the image path field.
      });
    }
  }, [product, isAdd, reset]); // Dependency array: runs the effect when these values change.

  const uploadFileHandler = async (e) => { // Asynchronous function to handle file upload.
    const file = e.target.files[0]; // Gets the first file from the file input.
    if (!file) return; // If no file is selected, do nothing.

    const formData = new FormData(); // Creates a new FormData object to send the file.
    formData.append("image", file); // Appends the file to the FormData.
    setUploading(true); // Sets the uploading state to true.

    try { // Starts a try-catch block for the asynchronous operation.
      const res = await fetch(`http://localhost:3000/api/upload/products`, { // Makes a POST request to the upload API endpoint.
        method: "POST", // Specifies the HTTP method.
        body: formData, // Sets the request body to the FormData object.
      });

      const data = await res.json(); // Parses the JSON response from the server.
      if (!res.ok) throw new Error(data.message); // If the response is not OK, throws an error with the server message.

      setValue("image", data.image, { shouldValidate: true }); // Updates the 'image' field in the form with the returned path and triggers validation.
      setImagePreview(`http://localhost:3000/${data.image}`); // Sets the image preview URL.
    } catch (error) { // Catches any errors during the upload process.
      alert(`O upload da imagem falhou: ${error.message}`); // Shows an alert with the error message.
    } finally { // The finally block always executes after try/catch.
      setUploading(false); // Sets the uploading state back to false.
    }
  };

  return ( // Returns the JSX for the component.
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6"> {/* Form element with submit handler and styling. */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6"> {/* Grid layout for form fields. */}
        <div className="space-y-1"> {/* Container for the name input. */}
          <label htmlFor="name">Nome do produto</label> {/* Label for the product name input. */}
          <input // The product name input field.
            id="name" // HTML id attribute.
            {...register("name")} // Registers the input with react-hook-form.
            className="w-full px-3 py-2 border rounded-lg border-gray-300 focus:outline-none focus:border-gray-400" // Styling classes.
          />
          {errors.name && ( // Conditionally renders the error message if it exists.
            <p className="text-red-500 text-xs mt-1">{errors.name.message}</p> // Displays the validation error message for the name field.
          )}
        </div>
        <div className="space-y-1"> {/* Container for the price input. */}
          <label htmlFor="price">Preço</label> {/* Label for the price input. */}
          <Controller // Wrapper for controlled components.
            name="price" // The name of the field in the form state.
            control={control} // Passes the control object from useForm.
            render={({ field: { onChange, onBlur, value } }) => ( // Render prop to define the input component.
              <CurrencyInput // The currency input component.
                id="price" // HTML id attribute.
                name="price" // HTML name attribute.
                placeholder="R$ 0,00" // Placeholder text.
                value={value || ""} // Sets the input value.
                onValueChange={(val) => { // Handles value changes from the component.
                  onChange(val === undefined ? null : val); // Calls the onChange from react-hook-form, converting undefined to null.
                }}
                onBlur={onBlur} // Handles the blur event.
                intlConfig={{ locale: "pt-BR", currency: "BRL" }} // Configures internationalization for Brazilian currency.
                decimalScale={2} // Sets the number of decimal places to 2.
                className="w-full px-3 py-2 border rounded-lg border-gray-300 focus:outline-none focus:border-gray-400" // Styling classes.
              />
            )}
          />
          {errors.price && ( // Conditionally renders the error message if it exists.
            <p className="text-red-500 text-xs mt-1">{errors.price.message}</p> // Displays the validation error message for the price field.
          )}
        </div>
      </div>

      <div className="space-y-1"> {/* Container for the description textarea. */}
        <label htmlFor="description">Descrição</label> {/* Label for the description. */}
        <textarea // The description textarea field.
          id="description" // HTML id attribute.
          rows={4} // Sets the visible number of lines.
          {...register("description")} // Registers the textarea with react-hook-form.
          className="w-full px-3 py-2 border rounded-lg border-gray-300 focus:outline-none focus:border-gray-400" // Styling classes.
        />
        {errors.description && ( // Conditionally renders the error message if it exists.
          <p className="text-red-500 text-xs mt-1"> {/* Paragraph to display the error. */}
            {errors.description.message} {/* The validation error message. */}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6"> {/* Another grid layout for form fields. */}
        <div className="space-y-1"> {/* Container for the category select dropdown. */}
          <label htmlFor="category">Categoria</label> {/* Label for the category dropdown. */}
          <select // The category dropdown menu.
            id="category" // HTML id attribute.
            {...register("category")} // Registers the select with react-hook-form.
            className="w-full px-3 py-2 border rounded-lg border-gray-300 focus:outline-none focus:border-gray-400" // Styling classes.
          >
            <option value="">Selecione...</option> {/* Default, empty option. */}
            {categories.map((cat) => ( // Maps over the categories array to create options.
              <option key={cat._id} value={cat._id}> {/* An option for each category. */}
                {cat.name} {/* The text displayed for the option is the category name. */}
              </option>
            ))}
          </select>
          {errors.category && ( // Conditionally renders the error message if it exists.
            <p className="text-red-500 text-xs mt-1"> {/* Paragraph to display the error. */}
              {errors.category.message} {/* The validation error message. */}
            </p>
          )}
        </div>
        <div className="space-y-1"> {/* Container for the image upload field. */}
          <label htmlFor="image-upload" className="block text-sm font-medium"> {/* Label for the image upload. */}
            Imagem do Produto
          </label>

          <input type="text" {...register("image")} className="hidden" /> {/* Hidden text input to hold the image path for validation. */}

          <input // The visible file input.
            id="image-upload" // HTML id attribute.
            type="file" // Sets the input type to 'file'.
            accept="image/*" // Restricts file selection to image types.
            onChange={uploadFileHandler} // Calls the upload handler when a file is chosen.
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" // Styling classes.
          />
          {uploading && ( // Conditionally renders a message while uploading.
            <p className="text-sm text-blue-600 mt-2">Enviando imagem...</p> // "Uploading image..." message.
          )}

          {imagePreview && !uploading && ( // Renders the preview if a URL exists and not currently uploading.
            <div className="mt-4"> {/* Container for the preview. */}
              <p className="text-xs text-gray-500 mb-1">Pré-visualização:</p> {/* "Preview:" text. */}
              <img // The image element for the preview.
                src={imagePreview} // Sets the image source to the preview URL.
                alt="Pré-visualização" // Alt text for the image.
                className="h-32 w-32 object-cover rounded-lg border p-1" // Styling for the preview image.
              />
            </div>
          )}

          {errors.image && ( // Conditionally renders the error message if it exists.
            <p className="text-red-500 text-xs mt-1">{errors.image.message}</p> // Displays the validation error message for the image field.
          )}
        </div>
      </div>

      <div className="space-y-1"> {/* Container for the stock quantity input. */}
        <label htmlFor="inStock">Quantidade em estoque</label> {/* Label for the stock quantity. */}
        <input // The stock quantity input field.
          id="inStock" // HTML id attribute.
          type="number" // Sets the input type to 'number'.
          {...register("inStock")} // Registers the input with react-hook-form.
          className="w-full px-3 py-2 border rounded-lg border-gray-300 focus:outline-none focus:border-gray-400" // Styling classes.
        />
        {errors.inStock && ( // Conditionally renders the error message if it exists.
          <p className="text-red-500 text-xs mt-1">{errors.inStock.message}</p> // Displays the validation error message for the inStock field.
        )}
      </div>

      <div className="flex justify-end pt-4 gap-4"> {/* Container for action buttons, aligned to the right. */}
        <button // The "Cancel" button.
          type="button" // Sets the button type to 'button' to prevent form submission.
          onClick={() => navigate(-1)} // Navigates to the previous page on click.
          className="px-4 py-2 border rounded-lg hover:bg-gray-100" // Styling classes.
        >
          Cancelar
        </button>
        <button // The "Submit" button.
          type="submit" // Sets the button type to 'submit'.
          disabled={isSubmitting} // Disables the button if the form is submitting.
          className="w-48 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-blue-300" // Styling classes.
        >
          {isSubmitting // Conditionally sets the button text.
            ? "Salvando..." // If submitting, shows "Saving...".
            : isAdd // Otherwise, checks if it's in "add" mode.
            ? "Adicionar Produto" // If adding, shows "Add Product".
            : "Salvar Alterações"} {/* If editing, shows "Save Changes". */}
        </button>
      </div>
    </form>
  );
};

export default ProductForm; // Exports the component for use in other parts of the application.