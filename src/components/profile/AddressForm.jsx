import * as Label from "@radix-ui/react-label";
import { useState } from "react";
import { useUser } from "../../contexts/UserContext";

const AddressForm = ({
  onAddAddress,
  onUpdateAddress = () => {},
  isAdd = true,
  address = undefined,
  onCancelUpdate = () => {},
}) => {
  const { addAddress, updateAddress } = useUser();
  const [success, setSuccess] = useState(false);
  const [street, setStreet] = useState(address?.street || "");
  const [city, setCity] = useState(address?.city || "");
  const [state, setState] = useState(address?.state || "");
  const [cep, setCep] = useState(address?.cep || "");
  const successMessage = "Endereço adicionado";

  const onHandleSubmit = (e) => {
    e.preventDefault();
    if (isAdd) {
      const newAddress = {
        id: 1,
        street: street,
        city: city,
        state: state,
        cep: cep,
      };
      addAddress(newAddress);
      onAddAddress(newAddress);
    } else {
      address = {
        ...address,
        street: street,
        city: city,
        state: state,
        cep: cep,
      };
      updateAddress(address);
      onUpdateAddress(address);
    }
    setSuccess(true);
  };

  return (
    <form
      onSubmit={onHandleSubmit}
      className="border border-gray-200 rounded-lg p-4 mt-4"
    >
      {success && (
        <div className="bg-green-200 w-full text-green-500 py-2 rounded-lg text-center">
          {successMessage}
        </div>
      )}
      <h4 className="font-semibold mb-4">Adicionar Novo Endereço</h4>
      <div className="grid gap-4">
        <div className="space-y-2">
          <Label.Root htmlFor="street" className="block text-sm font-medium">
            Endereço
          </Label.Root>
          <input
            id="street"
            type="text"
            placeholder="Digite o endereço"
            required
            value={street}
            onChange={(e) => setStreet(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-400"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-2">
            <Label.Root htmlFor="city" className="block text-sm font-medium">
              Cidade
            </Label.Root>
            <input
              id="city"
              type="text"
              placeholder="Digite a cidade"
              required
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-400"
            />
          </div>
          <div className="space-y-2">
            <Label.Root htmlFor="state" className="block text-sm font-medium">
              Estado
            </Label.Root>
            <input
              id="state"
              type="texte"
              placeholder="Digito o estado"
              required
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-400"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label.Root htmlFor="cep" className="block text-sm font-medium">
            CEP
          </Label.Root>
          <input
            id="cep"
            type="text"
            placeholder="Digite o CEP"
            required
            value={cep}
            onChange={(e) => setCep(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-400"
          />
        </div>
        {isAdd && (
          <button
            type="submit"
            className="bg-blue-600 text-white rounded-lg py-2 hover:bg-blue-800 cursor-pointer"
            onClick={()=>{alert("endereço adicionado")}}
          >
            Adicionar Endereço
          </button>
        )}

        {!isAdd && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <button
              onClick={onCancelUpdate}
              className="border border-gray-200 rounded-lg py-2 px-3 hover:bg-gray-100 cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white rounded-lg py-2 hover:bg-blue-800 cursor-pointer"
            >
              Salvar
            </button>
          </div>
        )}
      </div>
    </form>
  );
};

export default AddressForm;
