import { useState } from "react";
import { Label } from "@radix-ui/react-label";

const AddressForm = ({ onAddAddress }) => {
  const [cep, setCep] = useState("");
  const [street, setStreet] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [number, setNumber] = useState("");
  const [complement, setComplement] = useState("");
  const [error, setError] = useState("");

  const handleCepBlur = async () => {
    if (cep.length !== 8) {
      setError("CEP inválido. Digite 8 números.");
      return;
    }

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();

      if (data.erro) {
        setError("CEP não encontrado.");
      } else {
        setStreet(data.logradouro);
        setNeighborhood(data.bairro);
        setCity(data.localidade);
        setState(data.uf);
        setError("");
      }
    } catch {
      setError("Erro ao buscar o CEP. Tente novamente.");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!cep || !street || !neighborhood || !city || !state || !number) {
      setError("Preencha todos os campos obrigatórios.");
      return;
    }

    const fullStreet = `${street}, ${number}${complement ? ` - ${neighborhood} (${complement})` : ` - ${neighborhood}`}`;

    const newAddress = {
      id: Date.now().toString(),
      cep,
      street: fullStreet,
      city,
      state,
    };

    onAddAddress(newAddress);

    // Limpar campos
    setCep("");
    setStreet("");
    setNeighborhood("");
    setCity("");
    setState("");
    setNumber("");
    setComplement("");
    setError("");
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 mt-6 space-y-4">
      <h2 className="text-xl font-semibold">Adicionar Novo Endereço</h2>

      {error && (
        <div className="bg-red-200 text-red-700 py-2 px-4 rounded">
          {error}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="cep" className="font-bold">CEP</Label>
        <input
          id="cep"
          type="text"
          placeholder="Ex: 01001000"
          value={cep}
          onChange={(e) => setCep(e.target.value.replace(/\D/g, ""))}
          onBlur={handleCepBlur}
          required
          className="w-full px-3 py-2 border rounded-lg border-gray-300 focus:outline-none focus:border-gray-400"
        />
      </div>

      {street && (
        <>
          <div className="space-y-2">
            <Label htmlFor="street" className="font-bold">Rua</Label>
            <input
              id="street"
              type="text"
              value={street}
              readOnly
              className="w-full px-3 py-2 border rounded-lg border-gray-100 bg-gray-100"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="neighborhood" className="font-bold">Bairro</Label>
            <input
              id="neighborhood"
              type="text"
              value={neighborhood}
              readOnly
              className="w-full px-3 py-2 border rounded-lg border-gray-100 bg-gray-100"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="city" className="font-bold">Cidade</Label>
            <input
              id="city"
              type="text"
              value={city}
              readOnly
              className="w-full px-3 py-2 border rounded-lg border-gray-100 bg-gray-100"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="state" className="font-bold">Estado</Label>
            <input
              id="state"
              type="text"
              value={state}
              readOnly
              className="w-full px-3 py-2 border rounded-lg border-gray-100 bg-gray-100"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="number" className="font-bold">Número</Label>
            <input
              id="number"
              type="text"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              placeholder="Número da casa"
              required
              className="w-full px-3 py-2 border rounded-lg border-gray-300 focus:outline-none focus:border-gray-400"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="complement" className="font-bold">Complemento (opcional)</Label>
            <input
              id="complement"
              type="text"
              value={complement}
              onChange={(e) => setComplement(e.target.value)}
              placeholder="Apartamento, bloco, etc."
              className="w-full px-3 py-2 border rounded-lg border-gray-300 focus:outline-none focus:border-gray-400"
            />
          </div>

          <button
            type="submit"
            className="w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-800 cursor-pointer"
          >
            Salvar Endereço
          </button>
        </>
      )}
    </form>
  );
};

export default AddressForm;
