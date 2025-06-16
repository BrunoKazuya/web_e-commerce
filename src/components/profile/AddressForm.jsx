import * as Label from "@radix-ui/react-label";
import { useState, useEffect } from "react";
import { useUser } from "../../contexts/UserContext";
import { v4 as uuidv4 } from "uuid";

const AddressForm = ({
  onAddAddress,
  onUpdateAddress = () => {},
  isAdd = true,
  address = undefined,
  onCancelUpdate = () => {},
}) => {
  const { addAddress, updateAddress } = useUser();
  const [success, setSuccess] = useState(false);

  const [cep, setCep] = useState(address?.cep || "");
  const [street, setStreet] = useState(address?.street || "");
  const [neighborhood, setNeighborhood] = useState(address?.neighborhood || "");
  const [city, setCity] = useState(address?.city || "");
  const [state, setState] = useState(address?.state || "");
  const [number, setNumber] = useState(address?.number || "");
  const [complement, setComplement] = useState(address?.complement || "");
  const [error, setError] = useState("");

  const successMessage = isAdd ? "Endereço adicionado" : "Endereço atualizado";

  // ✅ Disparar API ViaCEP automaticamente quando CEP tiver 8 dígitos
  useEffect(() => {
    const fetchCep = async () => {
      if (cep.length === 8) {
        try {
          const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
          const data = await response.json();

          if (data.erro) {
            setError("CEP não encontrado.");
          } else {
            setStreet(data.logradouro || "");
            setNeighborhood(data.bairro || "");
            setCity(data.localidade || "");
            setState(data.uf || "");
            setError("");
          }
        } catch {
          setError("Erro ao buscar o CEP. Tente novamente.");
        }
      }
      else{
            setStreet("");
            setNeighborhood("");
            setCity("");
            setState("");
            setError("");
      }
    };

    fetchCep();
  }, [cep]);

  const onHandleSubmit = (e) => {
    e.preventDefault();

    if (!cep || !street || !city || !state || !number) {
      setError("Preencha todos os campos obrigatórios adequadamente.");
      return;
    }

    const newAddress = {
      id: isAdd ? uuidv4() : address.id,
      cep,
      street,
      neighborhood,
      city,
      state,
      number,
      complement,
    };

    if (isAdd) {
      addAddress(newAddress);
      onAddAddress(newAddress);
    } else {
      updateAddress(newAddress);
      onUpdateAddress(newAddress);
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
      {error && (
        <div className="bg-red-200 w-full text-red-500 py-2 rounded-lg text-center mb-2">
          {error}
        </div>
      )}

      <h4 className="font-semibold mb-4">
        {isAdd ? "Adicionar Novo Endereço" : "Editar Endereço"}
      </h4>

      <div className="grid gap-4">
        {/* Campo CEP */}
        <div className="space-y-2">
          <Label.Root htmlFor="cep" className="block text-sm font-medium">
            CEP
          </Label.Root>
          <input
            id="cep"
            type="text"
            placeholder="Digite o CEP"
            required
            maxLength={9}
            value={cep}
            onChange={(e) => setCep(e.target.value.replace(/\D/g, ""))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-400"
          />
        </div>

        {/* Rua */}
        <div className="space-y-2">
          <Label.Root htmlFor="street" className="block text-sm font-medium">
            Rua
          </Label.Root>
          <input
            id="street"
            type="text"
            value={street}
            readOnly
            placeholder="Preenchido via CEP"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100"
          />
        </div>

        {/* Bairro */}
        <div className="space-y-2">
          <Label.Root htmlFor="neighborhood" className="block text-sm font-medium">
            Bairro
          </Label.Root>
          <input
            id="neighborhood"
            type="text"
            value={neighborhood}
            readOnly
            placeholder="Preenchido via CEP"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100"
          />
        </div>

        {/* Cidade e Estado */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-2">
            <Label.Root htmlFor="city" className="block text-sm font-medium">
              Cidade
            </Label.Root>
            <input
              id="city"
              type="text"
              value={city}
              readOnly
              placeholder="Preenchido via CEP"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100"
            />
          </div>
          <div className="space-y-2">
            <Label.Root htmlFor="state" className="block text-sm font-medium">
              Estado
            </Label.Root>
            <input
              id="state"
              type="text"
              value={state}
              readOnly
              placeholder="Preenchido via CEP"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100"
            />
          </div>
        </div>

        {/* Número */}
        <div className="space-y-2">
          <Label.Root htmlFor="number" className="block text-sm font-medium">
            Número
          </Label.Root>
          <input
            id="number"
            type="text"
            placeholder="Digite o número"
            required
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-400"
          />
        </div>

        {/* Complemento */}
        <div className="space-y-2">
          <Label.Root htmlFor="complement" className="block text-sm font-medium">
            Complemento (opcional)
          </Label.Root>
          <input
            id="complement"
            type="text"
            placeholder="Apartamento, bloco, etc."
            value={complement}
            onChange={(e) => setComplement(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-400"
          />
        </div>

        {/* Botões */}
        {isAdd ? (
          <button
            type="submit"
            className="bg-blue-600 text-white rounded-lg py-2 hover:bg-blue-800 cursor-pointer"
          >
            Adicionar Endereço
          </button>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <button
              type="button"
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
