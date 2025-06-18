import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import InputMask from 'react-input-mask';

/**
 * A utility function to validate a credit card number using the Luhn algorithm.
 * @param {string} cardNumber - The credit card number string containing only digits.
 * @returns {boolean} - True if the number is valid, false otherwise.
 */
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

// Get the current year to use in validation.
const currentYear = new Date().getFullYear();

// Define the validation schema for the card form using Zod.
const cardSchema = z.object({
  cardholderName: z.string().min(3, 'Nome no cartão é obrigatório.'),
  
  // Use preprocess to clean the card number before validating it.
  cardNumber: z.preprocess(
    (val) => String(val).replace(/\D/g, ''), // First, remove all non-digit characters.
    z.string()
     .min(13, { message: "Número de cartão muito curto."})
     .max(19, { message: "Número de cartão muito longo."})
     .refine(isValidCardNumber, { message: "Número de cartão inválido." }) // Then, apply the Luhn algorithm validation.
  ),
  
  cvv: z.string().min(3, 'CVV inválido.').max(4, 'CVV inválido.'),
  
  expMonth: z.coerce.number().min(1, 'Mês inválido.').max(12, 'Mês inválido.'),
    
  expYear: z.coerce.number()
    .min(currentYear, 'Cartão expirado.') // Year cannot be in the past.
    .max(currentYear + 15, 'Ano muito no futuro.'), // Year cannot be too far in the future.

// Use .refine on the object to perform complex validation involving multiple fields.
}).refine((data) => {
  // If the expiration year is the current year...
  if (data.expYear === currentYear) {
    // ...then the expiration month must be greater than or equal to the current month.
    return data.expMonth >= new Date().getMonth() + 1; // getMonth() is 0-indexed.
  }
  // If the expiration year is in the future, it's always valid.
  return true;
}, {
  message: "Data de validade expirada.", // Error message if the refine check fails.
  path: ["expMonth"], // Apply this error message to the 'expMonth' field.
});

/**
 * A reusable form for adding a new credit card.
 * @param {object} props
 * @param {function} props.onFormSubmit - The callback function to execute on successful submission.
 * @param {function} props.onCancel - The callback function to execute when the cancel button is clicked.
 * @param {boolean} props.isSubmitting - A boolean to indicate if the form is currently being submitted.
 */
const CardForm = ({ onFormSubmit, onCancel, isSubmitting }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(cardSchema)
  });

  // This handler is called by react-hook-form's handleSubmit only after all validations pass.
  const handleFormSubmit = (data) => {
    // SECURITY: Create a new object for the API call that EXCLUDES the CVV.
    // The CVV should never be stored.
    const dataForApi = {
      cardholderName: data.cardholderName,
      cardNumber: data.cardNumber, // The number is already clean thanks to the preprocess step.
      expMonth: data.expMonth,
      expYear: data.expYear,
    };

    // Call the parent component's submission function with the safe data.
    onFormSubmit(dataForApi);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="border border-gray-200 rounded-lg p-6 mt-4 bg-gray-50 space-y-4">
      <h4 className="font-semibold text-lg mb-2">Adicionar Novo Cartão</h4>
      
      <div className="space-y-1">
        <label htmlFor="cardholderName">Nome no Cartão</label>
        <input id="cardholderName" {...register("cardholderName")} className={`w-full px-3 py-2 border rounded-lg ${errors.cardholderName ? 'border-red-500' : 'border-gray-300'}`} />
        {errors.cardholderName && <p className="text-red-500 text-xs mt-1">{errors.cardholderName.message}</p>}
      </div>
      
      <div className="space-y-1">
        <label htmlFor="cardNumber">Número do Cartão</label>
        {/* Use InputMask to help the user with formatting. */}
        <InputMask mask="9999 9999 9999 9999" {...register("cardNumber")}>
          {(inputProps) => <input {...inputProps} id="cardNumber" type="text" className={`w-full px-3 py-2 border rounded-lg ${errors.cardNumber ? 'border-red-500' : 'border-gray-300'}`} />}
        </InputMask>
        {errors.cardNumber && <p className="text-red-500 text-xs mt-1">{errors.cardNumber.message}</p>}
      </div>
      
      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-1">
          <label htmlFor="expMonth">Mês (MM)</label>
          <input id="expMonth" type="number" placeholder="MM" {...register("expMonth")} className={`w-full px-3 py-2 border rounded-lg ${errors.expMonth ? 'border-red-500' : 'border-gray-300'}`} />
          {errors.expMonth && <p className="text-red-500 text-xs mt-1">{errors.expMonth.message}</p>}
        </div>
        <div className="space-y-1">
          <label htmlFor="expYear">Ano (AAAA)</label>
          <input id="expYear" type="number" placeholder="AAAA" {...register("expYear")} className={`w-full px-3 py-2 border rounded-lg ${errors.expYear ? 'border-red-500' : 'border-gray-300'}`} />
          {errors.expYear && <p className="text-red-500 text-xs mt-1">{errors.expYear.message}</p>}
        </div>
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