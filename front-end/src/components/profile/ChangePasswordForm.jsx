  // src/components/profile/ChangePasswordForm.jsx

  import { useForm } from 'react-hook-form';
  import { z } from 'zod';
  import { zodResolver } from '@hookform/resolvers/zod';
  import { useState } from "react";
  import apiClient from "../../utils/apiClient";

  const passwordSchema = z.object({
    currentPassword: z.string().min(1, "Senha atual é obrigatória."),
    newPassword: z.string().min(8, "A nova senha deve ter no mínimo 8 caracteres."),
    confirmNewPassword: z.string(),
  }).refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "As senhas não são iguais.",
    path: ["confirmNewPassword"],
  });

  const ChangePasswordForm = () => {
    const [apiFeedback, setApiFeedback] = useState({ error: '', success: '' });
    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
      resolver: zodResolver(passwordSchema)
    });

    const handleUpdatePassword = async (data) => {
      setApiFeedback({ error: '', success: '' });
      try {
        const result = await apiClient('/users/profile/password', {
          method: 'PUT',
          body: { currentPassword: data.currentPassword, newPassword: data.newPassword }
        });
        setApiFeedback({ success: result.message || "Senha alterada com sucesso!" });
        reset(); // Limpa o formulário
      } catch (err) {
        console.log(err.message)
        setApiFeedback({ error: err.message || "Não foi possível alterar a senha." });
      }
    };

    return (
      <form onSubmit={handleSubmit(handleUpdatePassword)} className="space-y-4">
        {apiFeedback.error && <div className="bg-red-100 text-red-700 p-3 rounded-md text-center">{apiFeedback.error}</div>}
        {apiFeedback.success && <div className="bg-green-100 text-green-700 p-3 rounded-md text-center">{apiFeedback.success}</div>}

        <div className="space-y-1">
          <label htmlFor="currentPassword">Senha atual</label>
          <input id="currentPassword" type="password" {...register("currentPassword")} className="w-full px-3 py-2 border rounded-lg border-gray-300 focus:outline-none focus:border-gray-400" />
          {errors.currentPassword && <p className="text-red-500 text-xs mt-1">{errors.currentPassword.message}</p>}
        </div>
        <div className="space-y-1">
          <label htmlFor="newPassword">Nova senha</label>
          <input id="newPassword" type="password" {...register("newPassword")} className="w-full px-3 py-2 border rounded-lg border-gray-300 focus:outline-none focus:border-gray-400" />
          {errors.newPassword && <p className="text-red-500 text-xs mt-1">{errors.newPassword.message}</p>}
        </div>
        <div className="space-y-1">
          <label htmlFor="confirmNewPassword">Confirme a nova senha</label>
          <input id="confirmNewPassword" type="password" {...register("confirmNewPassword")} className="w-full px-3 py-2 border rounded-lg border-gray-300 focus:outline-none focus:border-gray-400" />
          {errors.confirmNewPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmNewPassword.message}</p>}
        </div>
        
        <button type="submit" disabled={isSubmitting} className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-blue-300">
          {isSubmitting ? 'Atualizando...' : 'Atualizar Senha'}
        </button>
      </form>
    );
  };

  export default ChangePasswordForm;