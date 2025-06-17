// src/components/auth/RegisterForm.jsx (Versão Final com Validação e Máscara)

import * as Label from "@radix-ui/react-label";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import InputMask from 'react-input-mask'; // Importa a biblioteca de máscara

// 1. Schema de Validação
const registerSchema = z.object({
  name: z.string().min(3, { message: "O nome deve ter no mínimo 3 caracteres." }),
  email: z.string().email({ message: "Por favor, insira um e-mail válido." }),
  phone: z.preprocess(
    // Primeiro, limpa tudo que não for dígito
    (val) => String(val).replace(/\D/g, ''),
    // Em seguida, valida a string de dígitos puros
    z.string().min(10, { message: "Telefone inválido, precisa de 10 ou 11 dígitos." })
              .max(11, { message: "Telefone inválido, não pode ter mais de 11 dígitos." })
  ),
  password: z.string().min(8, { message: "A senha deve ter no mínimo 8 caracteres." }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não são iguais.",
  path: ["confirmPassword"],
});

const RegisterForm = () => {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();

  // 2. Configuração do React Hook Form
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(registerSchema), // Conecta o Zod ao formulário
  });

  const handleRegister = async (data) => {
    // A 'data' aqui já foi validada pelo Zod!
    try {
      const result = await registerUser(data.name, data.email, data.password, data.phone);
      if (result.success) {
        navigate("/");
      } else {
        // Exibe erros que vêm do back-end (ex: e-mail já existe)
        alert(result.message);
      }
    } catch (error) {
      alert("Ocorreu um erro inesperado.");
    }
  };
  
  return (
    <>
      <h2 className="text-2xl font-bold mb-6 text-center">Criar uma conta</h2>
      
      {/* 3. O formulário agora usa o handleSubmit do React Hook Form */}
      <form onSubmit={handleSubmit(handleRegister)} className="space-y-4">
        
        {/* Campo de Nome com Validação */}
        <div className="space-y-1">
          <Label.Root htmlFor="name">Nome completo</Label.Root>
          <input id="name" {...register("name")} className="w-full px-3 py-2 border rounded-lg border-gray-300  focus:outline-none focus:border-gray-400" />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
        </div>

        {/* Campo de E-mail com Validação */}
        <div className="space-y-1">
          <Label.Root htmlFor="registerEmail">E-mail</Label.Root>
          <input id="registerEmail" type="email" {...register("email")} className="w-full px-3 py-2 border rounded-lg border-gray-300  focus:outline-none focus:border-gray-400" />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
        </div>
        
        {/* Campo de Telefone com MÁSCARA */}
        <div className="space-y-1">
          <Label.Root htmlFor="registerPhone">Telefone</Label.Root>
          <InputMask
            mask="(99) 99999-9999"
            id="registerPhone"
            {...register("phone")}
            className="w-full px-3 py-2 border rounded-lg border-gray-300  focus:outline-none focus:border-gray-400"
          />
          {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
        </div>

        {/* Campos de Senha com Validação */}
        <div className="space-y-1">
          <Label.Root htmlFor="registerPassword">Senha</Label.Root>
          <input id="registerPassword" type="password" {...register("password")} className="w-full px-3 py-2 border rounded-lg border-gray-300  focus:outline-none focus:border-gray-400" />
          {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
        </div>

        <div className="space-y-1">
          <Label.Root htmlFor="confirmPassword">Confirmar Senha</Label.Root>
          <input id="confirmPassword" type="password" {...register("confirmPassword")} className="w-full px-3 py-2 border rounded-lg border-gray-300  focus:outline-none focus:border-gray-400" />
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