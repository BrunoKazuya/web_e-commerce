// src/components/checkout/CardForm.jsx (Com campo CVV visual)
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import InputMask from 'react-input-mask';

function isValidCardNumber(cardNumber) {
  const digits = cardNumber.replace(/\D/g, "").split("").reverse().map(Number);
  if (digits.length === 0) return false;

  let sum = 0;
  for (let i = 0; i < digits.length; i++) {
    let digit = digits[i];
    if (i % 2 !== 0) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
  }
  return sum % 10 === 0;
}

const currentYear = new Date().getFullYear();
// 1. Adicionamos a validação para o CVV no schema
const cardSchema = z.object({
  cardholderName: z.string().min(3, 'Nome no cartão é obrigatório.'),
  
  cardNumber: z.preprocess(
    (val) => String(val).replace(/\D/g, ''), // Limpa a máscara, deixando só os números
    z.string()
     .min(13, { message: "Número de cartão muito curto."})
     .max(19, { message: "Número de cartão muito longo."})
     .refine(isValidCardNumber, { message: "Número de cartão inválido." }) // <-- AQUI USAMOS SUA FUNÇÃO!
  ),
  
  cvv: z.string().min(3, 'CVV inválido.').max(4, 'CVV inválido.'),
  expMonth: z.coerce.number().min(1, 'Mês inválido.').max(12, 'Mês inválido.'),
  expYear: z.coerce.number().min(currentYear, 'Cartão expirado.').max(currentYear + 15, 'Ano muito no futuro.'),
}).refine((data) => {
  if (data.expYear === currentYear) {
    return data.expMonth >= new Date().getMonth() + 1;
  }
  return true;
}, {
  message: "Data de validade expirada.",
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