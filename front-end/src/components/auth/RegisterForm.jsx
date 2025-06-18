import * as Label from "@radix-ui/react-label";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import InputMask from 'react-input-mask';
import { useState } from "react";

// The validation schema defines all rules for the registration form.
const registerSchema = z.object({
  name: z.string().min(3, { message: "O nome deve ter no mínimo 3 caracteres." }),
  email: z.string().email({ message: "Por favor, insira um e-mail válido." }),
  // Preprocess the phone number to remove mask characters before validation.
  phone: z.preprocess(
    (val) => String(val).replace(/\D/g, ''),
    z.string().min(10, { message: "O telefone deve ter 10 ou 11 dígitos." })
  ),
  password: z.string().min(8, { message: "A senha deve ter no mínimo 8 caracteres." }),
  confirmPassword: z.string(),
  // Use .refine for complex validations that involve multiple fields.
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não são iguais.",
  path: ["confirmPassword"], // Specifies which field the error message applies to.
});

const RegisterForm = () => {
  // Get the 'register' function (renamed to 'registerUser' to avoid conflict) from the context.
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  // Local state to display errors coming from the API (e.g., "Email already exists").
  const [apiError, setApiError] = useState('');

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(registerSchema),
  });

  // This handler is called only after Zod validation succeeds.
  const handleRegister = async (data) => {
    setApiError(''); // Clear previous errors.
    try {
      // Call the async register function from the context.
      const result = await registerUser(data.name, data.email, data.password, data.phone);
      if (result.success) {
        navigate("/"); // Navigate to home on successful registration and login.
      } else {
        // If the API returns an error, display it.
        setApiError(result.message || "Não foi possível criar a conta.");
      }
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      setApiError("Ocorreu um erro inesperado.");
    }
  };
  
  return (
    <>
      <h2 className="text-2xl font-bold mb-6 text-center">Criar uma conta</h2>
      {/* Display API errors here instead of using alert(). */}
      {apiError && <div className="bg-red-100 text-red-700 p-3 rounded-md text-center mb-4">{apiError}</div>}
      
      <form onSubmit={handleSubmit(handleRegister)} className="space-y-4">
        <div className="space-y-1">
          <Label.Root htmlFor="name">Nome completo</Label.Root>
          <input id="name" {...register("name")} className={`w-full px-3 py-2 border rounded-lg border-gray-300 focus:outline-none focus:border-gray-400 ${errors.name && 'border-red-500'}`} />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
        </div>

        <div className="space-y-1">
          <Label.Root htmlFor="registerEmail">E-mail</Label.Root>
          <input id="registerEmail" type="email" {...register("email")} className={`w-full px-3 py-2 border rounded-lg border-gray-300 focus:outline-none focus:border-gray-400 ${errors.email && 'border-red-500'}`} />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
        </div>
        
        <div className="space-y-1">
          <Label.Root htmlFor="registerPhone">Telefone</Label.Root>
          {/* InputMask is now correctly integrated with react-hook-form. */}
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
          {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
        </div>
        
        <div className="space-y-1">
          <Label.Root htmlFor="registerPassword">Senha</Label.Root>
          <input id="registerPassword" type="password" {...register("password")} className={`w-full px-3 py-2 border rounded-lg border-gray-300 focus:outline-none focus:border-gray-400 ${errors.password && 'border-red-500'}`} />
          {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
        </div>

        <div className="space-y-1">
          <Label.Root htmlFor="confirmPassword">Confirmar Senha</Label.Root>
          <input id="confirmPassword" type="password" {...register("confirmPassword")} className={`w-full px-3 py-2 border rounded-lg border-gray-300 focus:outline-none focus:border-gray-400 ${errors.confirmPassword && 'border-red-500'}`} />
          {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
        </div>

        <button type="submit" disabled={isSubmitting} className="w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-blue-300">
          {isSubmitting ? "Cadastrando..." : "Cadastrar"}
        </button>
      </form>
    </>
  );
};

export default RegisterForm;