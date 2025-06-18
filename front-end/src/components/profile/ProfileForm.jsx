import { useForm } from 'react-hook-form'; // Imports the useForm hook for form management.
import { z } from 'zod'; // Imports the Zod library for schema validation.
import { zodResolver } from '@hookform/resolvers/zod'; // Imports the resolver to use Zod with react-hook-form.
import { useAuth } from "../../contexts/AuthContext"; // Imports a custom hook to access authentication context.
import { useUser } from "../../contexts/UserContext"; // Imports a custom hook to access user data functions.
import { useState, useEffect } from "react"; // Imports React hooks for state and side effects.
import InputMask from 'react-input-mask'; // Imports a component for masked inputs.

// Validation schema for the profile
const profileSchema = z.object({
  name: z.string().min(3, "O nome deve ter no mínimo 3 caracteres."), // Validates the name field.
  email: z.string().email("Formato de e-mail inválido."), // Validates the email field.
  phone: z.preprocess( // Defines custom preprocessing for the phone field.
    (val) => String(val).replace(/\D/g, ''), // Removes all non-digit characters.
    z.string().min(10, { message: "Telefone inválido, precisa de 10 ou 11 dígitos." }) // Validates the cleaned string to have 10 or 11 digits.
             .max(11, { message: "Telefone inválido, não pode ter mais de 11 dígitos." })
  ),
});

const ProfileForm = () => { // Defines the ProfileForm component.
  const { user, setUser } = useAuth(); // Destructures user data and setter from the Auth context.
  const { updateUserProfile } = useUser(); // Destructures the update function from the User context.
  const [apiFeedback, setApiFeedback] = useState({ error: '', success: '' }); // State to hold feedback messages from the API.

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({ // Destructures methods from useForm.
    resolver: zodResolver(profileSchema), // Configures the form to use the Zod schema.
    defaultValues: { // Sets the default values for the form fields.
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
    }
  });

  // Updates the form if the user from the context changes
  useEffect(() => { // Hook to sync the form with context data.
    if(user) { // Checks if user data is available.
      reset({ // Resets the form with the latest user data.
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
      });
    }
  }, [user, reset]); // Dependency array: runs the effect when user or reset changes.

  const handleUpdate = async (data) => { // Defines an async function to handle form submission.
    setApiFeedback({ error: '', success: '' }); // Resets previous feedback.
    try { // Starts a try-catch block for the API call.
      const updatedUser = await updateUserProfile(data); // Calls the update function from the context.
      setUser(updatedUser); // Updates the global state in the Auth context.
      setApiFeedback({ success: 'Perfil atualizado com sucesso!' }); // Sets a success message.
    } catch (error) { // If the update fails...
      setApiFeedback({ error: error.message || 'Falha ao atualizar o perfil.' }); // Sets an error message.
    }
  };
  return ( // Returns the JSX for the form.
    <form onSubmit={handleSubmit(handleUpdate)} className="space-y-4"> {/* Form element with submit handler and styling. */}
      {apiFeedback.error && <div className="bg-red-100 text-red-700 p-3 rounded-md text-center">{apiFeedback.error}</div>} {/* Displays API error message. */}
      {apiFeedback.success && <div className="bg-green-100 text-green-700 p-3 rounded-md text-center">{apiFeedback.success}</div>} {/* Displays API success message. */}
      
      <div className="space-y-1"> {/* Container for the name input. */}
        <label htmlFor="nameProfile">Nome completo</label> {/* Label for the input. */}
        <input id="nameProfile" {...register("name")} className="w-full px-3 py-2 border rounded-lg border-gray-300 focus:outline-none focus:border-gray-400" /> {/* Name input field. */}
        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>} {/* Displays validation error. */}
      </div>
      <div className="space-y-1"> {/* Container for the email input. */}
        <label htmlFor="emailProfile">Email</label> {/* Label for the input. */}
        <input id="emailProfile" type="email" {...register("email")} className="w-full px-3 py-2 border rounded-lg border-gray-300 focus:outline-none focus:border-gray-400" /> {/* Email input field. */}
        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>} {/* Displays validation error. */}
      </div>
      <div className="space-y-1"> {/* Container for the phone input. */}
        <label htmlFor="phoneProfile">Telefone</label> {/* Label for the input. */}
       <InputMask mask="(99) 99999-9999" {...register("phone")}>
          {(inputProps) => (
            <input 
              {...inputProps} 
              id="registerPhone" 
              type="tel" 
              className={`w-full px-3 py-2 border rounded-lg border-gray-300 focus:outline-none focus:border-gray-400 ${errors.phone ? 'border-red-500' : ''}`} 
            />
          )}
        </InputMask>
        {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>} {/* Displays validation error. */}
      </div>
      
      <button type="submit" disabled={isSubmitting} className="w-full sm:w-auto px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-blue-300"> {/* Submit button. */}
        {isSubmitting ? 'Salvando...' : 'Salvar Alterações'} {/* Dynamic button text. */}
      </button>
    </form>
  );
};

export default ProfileForm; // Exports the component.