// src/components/profile/ProfileForm.jsx

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from "../../contexts/AuthContext";
import { useUser } from "../../contexts/UserContext";
import { useState, useEffect } from "react";
import InputMask from 'react-input-mask';

// Schema de validação para o perfil
const profileSchema = z.object({
  name: z.string().min(3, "O nome deve ter no mínimo 3 caracteres."),
  email: z.string().email("Formato de e-mail inválido."),
   phone: z.preprocess(
    // Primeiro, limpa tudo que não for dígito
    (val) => String(val).replace(/\D/g, ''),
    // Em seguida, valida a string de dígitos puros
    z.string().min(10, { message: "Telefone inválido, precisa de 10 ou 11 dígitos." })
              .max(11, { message: "Telefone inválido, não pode ter mais de 11 dígitos." })
  ),
});

const ProfileForm = () => {
  const { user, setUser } = useAuth();
  const { updateUserProfile } = useUser();
  const [apiFeedback, setApiFeedback] = useState({ error: '', success: '' });

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(profileSchema),
    // AQUI ESTÁ A CORREÇÃO:
    // Usamos '|| ""' para garantir que, se um campo for nulo ou undefined,
    // ele seja inicializado como uma string vazia.
    defaultValues: {
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
    }
  });

  // Atualiza o formulário se o usuário do contexto mudar
  useEffect(() => {
    // Esta função garante que o formulário seja preenchido com os dados
    // quando eles chegam do AuthContext.
    if(user) {
      reset({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
      });
    }
  }, [user, reset]);

  const handleUpdate = async (data) => {
    setApiFeedback({ error: '', success: '' });
    try {
      const updatedUser = await updateUserProfile(data);
      setUser(updatedUser); // Atualiza o estado global
      setApiFeedback({ success: 'Perfil atualizado com sucesso!' });
    } catch (error) {
      setApiFeedback({ error: error.message || 'Falha ao atualizar o perfil.' });
    }
  };
  console.log(user)
  return (
    <form onSubmit={handleSubmit(handleUpdate)} className="space-y-4">
      {apiFeedback.error && <div className="bg-red-100 text-red-700 p-3 rounded-md text-center">{apiFeedback.error}</div>}
      {apiFeedback.success && <div className="bg-green-100 text-green-700 p-3 rounded-md text-center">{apiFeedback.success}</div>}
      
      <div className="space-y-1">
        <label htmlFor="nameProfile">Nome completo</label>
        <input id="nameProfile" {...register("name")} className="w-full px-3 py-2 border rounded-lg border-gray-300 focus:outline-none focus:border-gray-400" />
        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
      </div>
      <div className="space-y-1">
        <label htmlFor="emailProfile">Email</label>
        <input id="emailProfile" type="email" {...register("email")} className="w-full px-3 py-2 border rounded-lg border-gray-300 focus:outline-none focus:border-gray-400" />
        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
      </div>
      <div className="space-y-1">
        <label htmlFor="phoneProfile">Telefone</label>
        <InputMask mask="(99) 99999-9999" {...register("phone")}>
          {(inputProps) => <input {...inputProps} id="phoneProfile" type="tel" className="w-full px-3 py-2 border rounded-lg border-gray-300 focus:outline-none focus:border-gray-400" />}
        </InputMask>
        {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
      </div>
      
      <button type="submit" disabled={isSubmitting} className="w-full sm:w-auto px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-blue-300">
        {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
      </button>
    </form>
  );
};

export default ProfileForm;