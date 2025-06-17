// src/components/profile/AddressForm.jsx (Versão Final)

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import InputMask from 'react-input-mask';

// 1. Schema de validação com Zod
const addressSchema = z.object({
  cep: z.string().length(9, { message: "O CEP deve ter 8 dígitos." }), // O formato da máscara é '99999-999'
  street: z.string().min(3, "O nome da rua é obrigatório."),
  number: z.string().min(1, "O número é obrigatório."),
  complement: z.string().optional(),
  district: z.string().min(3, "O bairro é obrigatório."),
  city: z.string().min(3, "A cidade é obrigatória."),
  state: z.string().length(2, "Use a sigla do estado (ex: SP)."),
});

const AddressForm = ({ isAdd = true, addressToEdit = {}, onFormSubmit, isSubmitting, onCancel }) => {
  const [cepError, setCepError] = useState('');

  // 2. Configuração do React Hook Form
  const { register, handleSubmit, watch, setValue, reset, formState: { errors } } = useForm({
    resolver: zodResolver(addressSchema),
    defaultValues: addressToEdit // Preenche com os dados para edição
  });

  // 3. 'watch' observa o campo CEP em tempo real
  const cepValue = watch('cep');

  // 4. useEffect para buscar o CEP automaticamente
  useEffect(() => {
    // Limpa os campos se o CEP for apagado
    const cleanCep = cepValue?.replace(/\D/g, '') || '';
    if (cleanCep.length === 0) {
        setValue('street', '');
        setValue('district', '');
        setValue('city', '');
        setValue('state', '');
        setCepError('');
    }
    
    // Dispara a busca quando o CEP tem 8 dígitos
    if (cleanCep.length === 8) {
      const fetchCep = async () => {
        try {
          const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
          const data = await response.json();

          if (data.erro) {
            setCepError("CEP não encontrado.");
          } else {
            // 5. Usa 'setValue' para preencher os campos do formulário
            setValue('street', data.logradouro || '', { shouldValidate: true });
            setValue('district', data.bairro || '', { shouldValidate: true });
            setValue('city', data.localidade || '', { shouldValidate: true });
            setValue('state', data.uf || '', { shouldValidate: true });
            setCepError('');
          }
        } catch {
          setCepError("Erro ao buscar o CEP.");
        }
      };
      fetchCep();
    }
  }, [cepValue, setValue]);

  // Preenche o formulário para edição
  useEffect(() => {
    if (!isAdd && addressToEdit) {
      reset(addressToEdit);
    }
  }, [addressToEdit, isAdd, reset]);

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="border border-gray-200 rounded-lg p-6 mt-4 bg-gray-50">
      <h4 className="font-semibold text-lg mb-4">{isAdd ? 'Adicionar Novo Endereço' : 'Editar Endereço'}</h4>
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1 md:col-span-1">
            <label htmlFor="cep">CEP</label>
            <InputMask mask="99999-999" {...register("cep")}>
              {(inputProps) => <input {...inputProps} id="cep" type="tel" className={`w-full px-3 py-2 border rounded-lg ${errors.cep ? 'border-red-500' : 'border-gray-300'}`} />}
            </InputMask>
            {errors.cep && <p className="text-red-500 text-xs mt-1">{errors.cep.message}</p>}
            {cepError && <p className="text-red-500 text-xs mt-1">{cepError}</p>}
          </div>
          <div className="space-y-1 md:col-span-2">
            <label htmlFor="street">Rua / Logradouro</label>
            <input id="street" {...register("street")} className={`w-full px-3 py-2 border rounded-lg ${errors.street ? 'border-red-500' : 'border-gray-300'}`} />
            {errors.street && <p className="text-red-500 text-xs mt-1">{errors.street.message}</p>}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label htmlFor="number">Número</label>
              <input id="number" {...register("number")} className={`w-full px-3 py-2 border rounded-lg ${errors.number ? 'border-red-500' : 'border-gray-300'}`} />
              {errors.number && <p className="text-red-500 text-xs mt-1">{errors.number.message}</p>}
            </div>
            <div className="space-y-1 md:col-span-2">
              <label htmlFor="complement">Complemento (opcional)</label>
              <input id="complement" {...register("complement")} className="w-full px-3 py-2 border rounded-lg border-gray-300" />
            </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label htmlFor="district">Bairro</label>
              <input id="district" {...register("district")} className={`w-full px-3 py-2 border rounded-lg ${errors.district ? 'border-red-500' : 'border-gray-300'}`} />
              {errors.district && <p className="text-red-500 text-xs mt-1">{errors.district.message}</p>}
            </div>
            <div className="space-y-1">
              <label htmlFor="city">Cidade</label>
              <input id="city" {...register("city")} className={`w-full px-3 py-2 border rounded-lg ${errors.city ? 'border-red-500' : 'border-gray-300'}`} />
              {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city.message}</p>}
            </div>
            <div className="space-y-1">
              <label htmlFor="state">Estado (UF)</label>
              <input id="state" maxLength="2" {...register("state")} className={`w-full px-3 py-2 border rounded-lg ${errors.state ? 'border-red-500' : 'border-gray-300'}`} />
              {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state.message}</p>}
            </div>
        </div>
        <div className="flex justify-end pt-4 gap-4">
          {!isAdd && <button type="button" onClick={onCancel} className="px-4 py-2 border rounded-lg hover:bg-gray-100">Cancelar</button>}
          <button type="submit" disabled={isSubmitting} className="w-48 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-blue-300">
            {isSubmitting ? 'Salvando...' : (isAdd ? 'Adicionar Endereço' : 'Salvar Alterações')}
          </button>
        </div>
      </div>
    </form>
  );
};

export default AddressForm;