import { useState, useEffect } from "react";
import { MapPin } from "lucide-react";
import { Label } from "@radix-ui/react-dropdown-menu";
import AddressForm from "../profile/AddressForm";

const Endereco = ({ address: initialAddresses = [] }) => {
  const [addresses, setAddresses] = useState(initialAddresses);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    setAddresses(initialAddresses);
  }, [initialAddresses]);

  const handleAddAddress = (newAddress) => {
    setAddresses((prev) => [...prev, newAddress]);
  };

  if (addresses.length === 0) {
    return <AddressForm onAddAddress={handleAddAddress} />;
  }

  return (
    <>
      <ul>
        {addresses.map((addr) => {
          const street = addr.street?.split(",")[0]?.trim() || "";
          const number = addr.street?.split(",")[1]?.split("-")[0]?.trim() || "";
          const neighborhood = addr.street?.split("-")[1]?.trim() || "";

          return (
            <li key={addr.id} className="mb-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-xl font-semibold flex items-center">
                    <MapPin className="mr-2 h-5 w-5" />
                    Endereço de Entrega
                  </h2>
                  <input
                    name="selectedAddress"
                    type="radio"
                    className="h-5 w-5 cursor-pointer"
                    aria-label={`Selecionar endereço ${street}`}
                    checked={selectedId === addr.id}
                    onChange={() => setSelectedId(addr.id)}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
                  <div>
                    <Label className="font-bold" htmlFor="zipCode">
                      CEP
                    </Label>
                    <p>{addr.cep}</p>
                  </div>
                  <div>
                    <Label className="font-bold" htmlFor="street">
                      Rua
                    </Label>
                    <p>{street}</p>
                  </div>
                  <div>
                    <Label className="font-bold" htmlFor="number">
                      Número
                    </Label>
                    <p>{number}</p>
                  </div>
                  <div>
                    <Label className="font-bold" htmlFor="neighborhood">
                      Bairro
                    </Label>
                    <p>{neighborhood}</p>
                  </div>
                  <div>
                    <Label className="font-bold" htmlFor="city">
                      Cidade
                    </Label>
                    <p>{addr.city}</p>
                  </div>
                  <div className="md:col-span-2">
                    <Label className="font-bold" htmlFor="state">
                      Estado
                    </Label>
                    <p>{addr.state}</p>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      {/* Sempre mostrar o formulário para adicionar novo endereço */}
      <AddressForm onAddAddress={handleAddAddress} />
    </>
  );
};

export default Endereco;
