import { MapPin, PlusCircle } from 'lucide-react';
import { useState } from 'react';
import AddressForm from '../profile/AddressForm'; // O formulário que já temos
import { useUser } from '../../contexts/UserContext';

const AddressSelection = ({ addresses, selectedAddressId, onSelectAddress, onAddressAdded }) => {
  const [showAddForm, setShowAddForm] = useState(addresses.length === 0);
  const { addAddress } = useUser();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFormSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      const newAddress = await addAddress(formData); // Chama a API
      onAddressAdded(newAddress); // Avisa a CheckoutPage sobre o novo endereço
      setShowAddForm(false); // Esconde o formulário
    } catch (error) {
      alert(`Erro ao adicionar endereço: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4 flex items-center">
        <MapPin className="mr-2 h-5 w-5" /> Endereço de Entrega
      </h2>
      
      {!showAddForm ? (
        <div className="space-y-4">
          {addresses.map((address) => (
            <div key={address._id} onClick={() => onSelectAddress(address._id)} className={`p-4 border rounded-lg cursor-pointer ${selectedAddressId === address._id ? 'border-blue-600 ring-2 ring-blue-200' : 'border-gray-200'}`}>
              <div className="flex items-center">
                <input type="radio" name="address" readOnly checked={selectedAddressId === address._id} className="h-4 w-4" />
                <div className="ml-3">
                  <p className="font-semibold">{address.street}, {address.number}</p>
                  <p className="text-sm text-gray-600">{address.city} - {address.state}</p>
                </div>
              </div>
            </div>
          ))}
          <button onClick={() => setShowAddForm(true)} className="w-full mt-4 flex items-center justify-center gap-2 text-sm text-blue-600 font-semibold p-3 hover:bg-blue-50 rounded-lg">
            <PlusCircle className="h-4 w-4" /> Adicionar Novo Endereço
          </button>
        </div>
      ) : (
        <AddressForm onFormSubmit={handleFormSubmit} isSubmitting={isSubmitting} onCancel={() => setShowAddForm(false)} />
      )}
    </div>
  );
};

export default AddressSelection;