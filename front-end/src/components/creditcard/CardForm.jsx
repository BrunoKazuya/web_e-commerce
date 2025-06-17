// src/components/checkout/CardForm.jsx (Com campo CVV visual)
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import InputMask from 'react-input-mask';


const currentYear = new Date().getFullYear();
// 1. Adicionamos a validação para o CVV no schema
const cardSchema = z.object({
  cardholderName: z.string().min(3, 'Nome inválido.'),
   cardNumber: z.preprocess(
    // 1. Primeiro, limpa o valor, removendo tudo que não for dígito
    (val) => String(val).replace(/\D/g, ''),
    
    // 2. Em seguida, aplica as regras na string de dígitos puros
    z.string()
     .length(16, { message: "O número do cartão deve ter 16 dígitos." })
     .regex(/^[0-9]+$/, { message: "Apenas números são permitidos." }) // Garante que são apenas números
  ),
  cvv: z.string().min(3, 'CVV inválido.').max(4, 'CVV inválido.'),
  
  // Validações individuais primeiro
  expMonth: z.coerce.number()
    .min(1, 'Mês inválido.')
    .max(12, 'Mês inválido.'),
    
  expYear: z.coerce.number()
    .min(currentYear, 'Cartão expirado.') // Não pode ser um ano passado
    .max(currentYear + 15, 'Ano muito no futuro.'), // Limita a 15 anos no futuro

}).refine((data) => {
  // 3. Validação combinada: só é executada se as validações acima passarem
  // Se o ano de expiração for o ano atual...
  if (data.expYear === currentYear) {
    // ...então o mês de expiração deve ser maior ou igual ao mês atual.
    // getMonth() é 0-indexado (Janeiro=0), então adicionamos 1.
    return data.expMonth >= new Date().getMonth() + 1;
  }
  // Se o ano de expiração for um ano futuro, está sempre válido.
  return true;
}, {
  // Se a validação do .refine() falhar, esta mensagem será exibida
  message: "Data de validade expirada.",
  // A mensagem de erro aparecerá no campo do mês
  path: ["expMonth"], 
});

const CardForm = ({ onFormSubmit, onCancel, isSubmitting }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(cardSchema)
  });

  // A função de submit agora descarta o CVV antes de continuar
  const handleFormSubmit = (data) => {
    // 'data' do react-hook-form contém o cvv validado.
    // Montamos um novo objeto para a API SEM o CVV.
    const dataForApi = {
      cardholderName: data.cardholderName,
      cardNumber: data.cardNumber.replace(/\s/g, ''), // Limpa os espaços da máscara
      expMonth: data.expMonth,
      expYear: data.expYear,
    };

    // AVISO: O 'data.cvv' é conscientemente ignorado e não é enviado para o onFormSubmit.
    onFormSubmit(dataForApi);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="border border-gray-200 rounded-lg p-6 mt-4 bg-gray-50 space-y-4">
      <h4 className="font-semibold text-lg mb-2">Adicionar Novo Cartão</h4>
      
      {/* ... Campos de Nome no Cartão e Número do Cartão ... */}
      <div className="space-y-1">
        <label htmlFor="cardholderName">Nome no Cartão</label>
        <input id="cardholderName" {...register("cardholderName")} className={`w-full px-3 py-2 border rounded-lg ${errors.cardholderName ? 'border-red-500' : 'border-gray-300'}`} />
        {errors.cardholderName && <p className="text-red-500 text-xs mt-1">{errors.cardholderName.message}</p>}
      </div>
      <div className="space-y-1">
        <label htmlFor="cardNumber">Número do Cartão</label>
        <InputMask mask="9999 9999 9999 9999" {...register("cardNumber")}>
          {(inputProps) => <input {...inputProps} id="cardNumber" type="text" className={`w-full px-3 py-2 border rounded-lg ${errors.cardNumber ? 'border-red-500' : 'border-gray-300'}`} />}
        </InputMask>
        {errors.cardNumber && <p className="text-red-500 text-xs mt-1">{errors.cardNumber.message}</p>}
      </div>

      <div className="grid grid-cols-3 gap-4">
        {/* Campo de Mês */}
        <div className="space-y-1">
          <label htmlFor="expMonth">Mês (MM)</label>
          <input id="expMonth" type="number" placeholder="MM" {...register("expMonth")} className={`w-full px-3 py-2 border rounded-lg ${errors.expMonth ? 'border-red-500' : 'border-gray-300'}`} />
          {errors.expMonth && <p className="text-red-500 text-xs mt-1">{errors.expMonth.message}</p>}
        </div>
        {/* Campo de Ano */}
        <div className="space-y-1">
          <label htmlFor="expYear">Ano (AAAA)</label>
          <input id="expYear" type="number" placeholder="AAAA" {...register("expYear")} className={`w-full px-3 py-2 border rounded-lg ${errors.expYear ? 'border-red-500' : 'border-gray-300'}`} />
          {errors.expYear && <p className="text-red-500 text-xs mt-1">{errors.expYear.message}</p>}
        </div>
        
        {/* 2. ADIÇÃO DO CAMPO CVV */}
        <div className="space-y-1">
          <label htmlFor="cvv">CVV</label>
          <input id="cvv" type="password" maxLength="4" {...register("cvv")} className={`w-full px-3 py-2 border rounded-lg ${errors.cvv ? 'border-red-500' : 'border-gray-300'}`} />
          {errors.cvv && <p className="text-red-500 text-xs mt-1">{errors.cvv.message}</p>}
        </div>
      </div>
      
      <div className="flex justify-end gap-4 pt-2">
        <button type="button" onClick={onCancel} className="px-4 py-2 border rounded-lg hover:bg-gray-100">Cancelar</button>
        <button type="submit" disabled={isSubmitting} className="w-32 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-blue-300">
          {isSubmitting ? 'Salvando...' : 'Salvar'}
        </button>
      </div>
    </form>
  );
};

export default CardForm;