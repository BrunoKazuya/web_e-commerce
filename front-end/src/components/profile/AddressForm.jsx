import { useForm } from 'react-hook-form'; // Imports the useForm hook for form management.
import { z } from 'zod'; // Imports the Zod library for schema validation.
import { zodResolver } from '@hookform/resolvers/zod'; // Imports the resolver to use Zod with react-hook-form.
import { useEffect, useState } from 'react'; // Imports React hooks for side effects and state management.
import InputMask from 'react-input-mask'; // Imports a component for masked inputs.

// Validation schema with Zod
const addressSchema = z.object({
  cep: z.string().length(9, { message: "O CEP deve ter 8 dígitos." }),
  street: z.string().min(3, "O nome da rua é obrigatório."),
  number: z.string().min(1, "O número é obrigatório."),
  complement: z.string().optional(), // Complement is an optional string.
  district: z.string().min(3, "O bairro é obrigatório."),
  city: z.string().min(3, "A cidade é obrigatória."),
  state: z.string().length(2, "Use a sigla do estado (ex: SP)."),
});

const AddressForm = ({ isAdd = true, addressToEdit = {}, onFormSubmit, isSubmitting, onCancel }) => { // Defines the AddressForm component with its props.
  const [cepError, setCepError] = useState(''); // State to hold any error related to the ZIP code API call.

  // React Hook Form setup
  const { register, handleSubmit, watch, setValue, reset, formState: { errors } } = useForm({ // Destructures methods from useForm.
    resolver: zodResolver(addressSchema), // Sets up Zod as the validation resolver.
    defaultValues: addressToEdit // Pre-fills the form with data for editing.
  });

  // 'watch' observes the ZIP code field in real-time
  const cepValue = watch('cep'); // Watches the 'cep' field for changes.

  // useEffect to fetch ZIP code automatically
  useEffect(() => { // Hook to perform side effects based on cepValue changes.
    const cleanCep = cepValue?.replace(/\D/g, '') || ''; // Removes non-digit characters from the ZIP code.
    if (cleanCep.length === 0) { // If the cleaned ZIP code is empty...
        setValue('street', ''); // Clear the street field.
        setValue('district', ''); // Clear the district field.
        setValue('city', ''); // Clear the city field.
        setValue('state', ''); // Clear the state field.
        setCepError(''); // Clear any ZIP code API error.
    }
    
    // Triggers the search when the ZIP code has 8 digits
    if (cleanCep.length === 8) { // If the cleaned ZIP code has 8 digits...
      const fetchCep = async () => { // Define an async function to fetch address data.
        try { // Start a try-catch block for the API call.
          const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`); // Fetches data from the ViaCEP API.
          const data = await response.json(); // Parses the JSON response.

          if (data.erro) { // If the API returns an error property...
            setCepError("CEP não encontrado."); // Set the custom error message.
          } else { // If the API call is successful...
            setValue('street', data.logradouro || '', { shouldValidate: true }); // Set the street value and trigger validation.
            setValue('district', data.bairro || '', { shouldValidate: true }); // Set the district value.
            setValue('city', data.localidade || '', { shouldValidate: true }); // Set the city value.
            setValue('state', data.uf || '', { shouldValidate: true }); // Set the state value.
            setCepError(''); // Clear any previous error message.
          }
        } catch { // If the fetch operation fails...
          setCepError("Erro ao buscar o CEP."); // Set a generic error message.
        }
      };
      fetchCep(); // Call the fetch function.
    }
  }, [cepValue, setValue]); // Dependency array: runs the effect when cepValue or setValue changes.

  // Pre-fills the form for editing
  useEffect(() => { // Another effect to handle pre-filling form on edit.
    if (!isAdd && addressToEdit) { // If in edit mode and address data is available...
      reset(addressToEdit); // Reset the form with the provided data.
    }
  }, [addressToEdit, isAdd, reset]); // Dependency array.

  return ( // Returns the JSX for the form.
    <form onSubmit={handleSubmit(onFormSubmit)} className="border border-gray-200 rounded-lg p-6 mt-4 bg-gray-50"> {/* Form element with submit handler and styling. */}
      <h4 className="font-semibold text-lg mb-4">{isAdd ? 'Adicionar Novo Endereço' : 'Editar Endereço'}</h4> {/* Dynamic form title. */}
      <div className="space-y-4"> {/* Container for form fields. */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4"> {/* Grid layout for inputs. */}
          <div className="space-y-1 md:col-span-1"> {/* ZIP code input container. */}
            <label htmlFor="cep">CEP</label> {/* Label for the ZIP code input. */}
            <InputMask mask="99999-999" {...register("cep")}>
              {(inputProps) => (
                <input
                  {...inputProps}
                  id="cep"
                  type="tel"
                  className={`w-full px-3 py-2 border rounded-lg ${errors.cep ? 'border-red-500' : 'border-gray-300'}`}
                />
              )}
            </InputMask>
            {errors.cep && <p className="text-red-500 text-xs mt-1">{errors.cep.message}</p>} {/* Displays Zod validation error. */}
            {cepError && <p className="text-red-500 text-xs mt-1">{cepError}</p>} {/* Displays API error. */}
          </div>
          <div className="space-y-1 md:col-span-2"> {/* Street input container. */}
            <label htmlFor="street">Rua / Logradouro</label> {/* Label for the street input. */}
            <input id="street" {...register("street")} className={`w-full px-3 py-2 border rounded-lg ${errors.street ? 'border-red-500' : 'border-gray-300'}`} /> {/* Street input. */}
            {errors.street && <p className="text-red-500 text-xs mt-1">{errors.street.message}</p>} {/* Displays validation error. */}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4"> {/* Another grid row. */}
            <div className="space-y-1"> {/* Number input container. */}
              <label htmlFor="number">Número</label> {/* Label for the number input. */}
              <input id="number" {...register("number")} className={`w-full px-3 py-2 border rounded-lg ${errors.number ? 'border-red-500' : 'border-gray-300'}`} /> {/* Number input. */}
              {errors.number && <p className="text-red-500 text-xs mt-1">{errors.number.message}</p>} {/* Displays validation error. */}
            </div>
            <div className="space-y-1 md:col-span-2"> {/* Complement input container. */}
              <label htmlFor="complement">Complemento (opcional)</label> {/* Label for the complement input. */}
              <input id="complement" {...register("complement")} className="w-full px-3 py-2 border rounded-lg border-gray-300" /> {/* Complement input. */}
            </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4"> {/* Another grid row. */}
            <div className="space-y-1"> {/* District input container. */}
              <label htmlFor="district">Bairro</label> {/* Label for the district input. */}
              <input id="district" {...register("district")} className={`w-full px-3 py-2 border rounded-lg ${errors.district ? 'border-red-500' : 'border-gray-300'}`} /> {/* District input. */}
              {errors.district && <p className="text-red-500 text-xs mt-1">{errors.district.message}</p>} {/* Displays validation error. */}
            </div>
            <div className="space-y-1"> {/* City input container. */}
              <label htmlFor="city">Cidade</label> {/* Label for the city input. */}
              <input id="city" {...register("city")} className={`w-full px-3 py-2 border rounded-lg ${errors.city ? 'border-red-500' : 'border-gray-300'}`} /> {/* City input. */}
              {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city.message}</p>} {/* Displays validation error. */}
            </div>
            <div className="space-y-1"> {/* State input container. */}
              <label htmlFor="state">Estado (UF)</label> {/* Label for the state input. */}
              <input id="state" maxLength="2" {...register("state")} className={`w-full px-3 py-2 border rounded-lg ${errors.state ? 'border-red-500' : 'border-gray-300'}`} /> {/* State input with max length of 2. */}
              {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state.message}</p>} {/* Displays validation error. */}
            </div>
        </div>
        <div className="flex justify-end pt-4 gap-4"> {/* Container for action buttons. */}
          {!isAdd && <button type="button" onClick={onCancel} className="px-4 py-2 border rounded-lg hover:bg-gray-100">Cancelar</button>} {/* Cancel button, shown only in edit mode. */}
          <button type="submit" disabled={isSubmitting} className="w-48 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-blue-300"> {/* Submit button. */}
            {isSubmitting ? 'Salvando...' : (isAdd ? 'Adicionar Endereço' : 'Salvar Alterações')} {/* Dynamic button text. */}
          </button>
        </div>
      </div>
    </form>
  );
};

export default AddressForm; // Exports the AddressForm component.