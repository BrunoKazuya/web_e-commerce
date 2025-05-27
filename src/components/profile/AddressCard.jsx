import { useState } from "react";
import { useUser } from "../../contexts/UserContext";
import AddressForm from "./addressForm";

const AddressCard = ({ address, onRemoveAddress, onUpdateAddress }) => {
  const { removeAddress } = useUser();
  const [isEdit, setIsEdit] = useState(false)
  return (
    <div key={address.id} className="border border-gray-200 rounded-lg p-4">
        {!isEdit && (
            <>
            <p>{address.street}</p>
      <p>
        {address.city}, {address.state} {address.cep}
      </p>
      <div className="mt-4 flex gap-3">
        <button
          type="button"
          className="border border-gray-200 rounded-lg py-2 px-3 hover:bg-gray-100 cursor-pointer" onClick={() => setIsEdit(true)}
        >
          Editar
        </button>
        <button
          type="button"
          className="bg-red-500 text-white rounded-lg py-2 px-3 cursor-pointer hover:bg-red-400"
          onClick={() => {
            removeAddress(address.id);
            onRemoveAddress(address.id);
          }}
        >
          Remover
        </button>
      </div>
      </>
        )}

        {isEdit && (
            <AddressForm isAdd={false} address={address} onCancelUpdate={() => setIsEdit(false)} onUpdateAddress={(newAddress) => {
                setIsEdit(false)
                onUpdateAddress(newAddress)
            }}/>
        )}
      
    </div>
  );
};

export default AddressCard;
