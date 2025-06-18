import { useForm } from 'react-hook-form'; // Imports the useForm hook for form management.
import { z } from 'zod'; // Imports the Zod library for schema validation.
import { zodResolver } from '@hookform/resolvers/zod'; // Imports the resolver to use Zod with react-hook-form.
import { useState } from "react"; // Imports the useState hook for managing component state.
import apiClient from "../../utils/apiClient"; // Imports a pre-configured API client for making HTTP requests.

const passwordSchema = z.object({ // Defines the validation schema for the password form.
  currentPassword: z.string().min(1, "Senha atual é obrigatória."), // Current password must not be empty.
  newPassword: z.string().min(8, "A nova senha deve ter no mínimo 8 caracteres."), // New password must have at least 8 characters.
  confirmNewPassword: z.string(), // Field for confirming the new password.
}).refine((data) => data.newPassword === data.confirmNewPassword, { // Custom refinement to check if passwords match.
  message: "As senhas não são iguais.", // Error message if they don't match.
  path: ["confirmNewPassword"], // Associates the error with the confirmNewPassword field.
});

const ChangePasswordForm = () => { // Defines the ChangePasswordForm component.
  const [apiFeedback, setApiFeedback] = useState({ error: '', success: '' }); // State to hold feedback (error or success messages) from the API.
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({ // Destructures methods from useForm.
    resolver: zodResolver(passwordSchema) // Configures the form to use the Zod schema for validation.
  });

  const handleUpdatePassword = async (data) => { // Defines an async function to handle the form submission.
    setApiFeedback({ error: '', success: '' }); // Resets any previous API feedback.
    try { // Starts a try-catch block for the API call.
      const result = await apiClient('/users/profile/password', { // Makes a PUT request to the password update endpoint.
        method: 'PUT', // Specifies the HTTP method.
        body: { currentPassword: data.currentPassword, newPassword: data.newPassword } // Sends the current and new passwords in the request body.
      });
      setApiFeedback({ success: result.message || "Senha alterada com sucesso!" }); // Sets a success message.
      reset(); // Clears the form fields on success.
    } catch (err) { // If the API call fails...
      console.log(err.message); // Logs the error message to the console.
      setApiFeedback({ error: err.message || "Não foi possível alterar a senha." }); // Sets an error message for the user.
    }
  };

  return ( // Returns the JSX for the form.
    <form onSubmit={handleSubmit(handleUpdatePassword)} className="space-y-4"> {/* Form element with submit handler and styling. */}
      {apiFeedback.error && <div className="bg-red-100 text-red-700 p-3 rounded-md text-center">{apiFeedback.error}</div>} {/* Conditionally renders the API error message. */}
      {apiFeedback.success && <div className="bg-green-100 text-green-700 p-3 rounded-md text-center">{apiFeedback.success}</div>} {/* Conditionally renders the API success message. */}

      <div className="space-y-1"> {/* Container for the current password input. */}
        <label htmlFor="currentPassword">Senha atual</label> {/* Label for the input. */}
        <input id="currentPassword" type="password" {...register("currentPassword")} className="w-full px-3 py-2 border rounded-lg border-gray-300 focus:outline-none focus:border-gray-400" /> {/* Password input field. */}
        {errors.currentPassword && <p className="text-red-500 text-xs mt-1">{errors.currentPassword.message}</p>} {/* Displays validation error. */}
      </div>
      <div className="space-y-1"> {/* Container for the new password input. */}
        <label htmlFor="newPassword">Nova senha</label> {/* Label for the input. */}
        <input id="newPassword" type="password" {...register("newPassword")} className="w-full px-3 py-2 border rounded-lg border-gray-300 focus:outline-none focus:border-gray-400" /> {/* Password input field. */}
        {errors.newPassword && <p className="text-red-500 text-xs mt-1">{errors.newPassword.message}</p>} {/* Displays validation error. */}
      </div>
      <div className="space-y-1"> {/* Container for the confirm new password input. */}
        <label htmlFor="confirmNewPassword">Confirme a nova senha</label> {/* Label for the input. */}
        <input id="confirmNewPassword" type="password" {...register("confirmNewPassword")} className="w-full px-3 py-2 border rounded-lg border-gray-300 focus:outline-none focus:border-gray-400" /> {/* Password input field. */}
        {errors.confirmNewPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmNewPassword.message}</p>} {/* Displays validation error. */}
      </div>
      
      <button type="submit" disabled={isSubmitting} className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-blue-300"> {/* Submit button. */}
        {isSubmitting ? 'Atualizando...' : 'Atualizar Senha'} {/* Dynamic button text based on submission state. */}
      </button>
    </form>
  );
};

export default ChangePasswordForm; // Exports the component.