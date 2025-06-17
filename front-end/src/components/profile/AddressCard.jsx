import { useState } from "react";
import { Trash2, Edit } from 'lucide-react';
import AddressForm from './AddressForm';

const AddressCard = ({ address, onRemove, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleUpdate = async (formData) => {
    await onUpdate(address._id, formData);
    setIsEditing(false);
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4">
      {isEditing ? (
        <AddressForm
          isAdd={false}
          addressToEdit={address}
          onFormSubmit={handleUpdate}
          onCancel={() => setIsEditing(false)}
        />
      ) : (
        <div className="flex justify-between items-center">
          {/* AQUI ESTÁ A FORMA CORRETA DE EXIBIR OS DADOS */}
          <div>
            <p className="font-semibold">{address.street}, {address.number}</p>
            <p className="text-sm text-gray-600">{address.district}, {address.city} - {address.state}</p>
            <p className="text-sm text-gray-600">CEP: {address.cep}</p>
          </div>
          <div className="space-x-2">
            <button onClick={() => setIsEditing(true)} className="p-2 hover:bg-gray-100 rounded-full"><Edit className="h-4 w-4" /></button>
            <button onClick={() => onRemove(address._id)} className="p-2 hover:bg-red-100 text-red-600 rounded-full"><Trash2 className="h-4 w-4" /></button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddressCard;