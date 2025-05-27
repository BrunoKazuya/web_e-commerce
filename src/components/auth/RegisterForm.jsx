import * as Label from "@radix-ui/react-label";
import { useState } from "react";
import { useUser } from "../../contexts/UserContext";
const RegisterForm = () => {
  const { addUser, isEmailValid } = useUser();

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEmailValid(email)) {
      if (password === confirmPassword) {
        const user = {
          id: 1,
          email: email,
          password: password,
          role: "user",
          name: name,
          phone: phone,
          cart: [],
          order: [],
          address: []
        };
        addUser(user);
      } else {
        setErrorMessage("As senhas não são iguais");
        setError(true);
      }
    } else {
      setErrorMessage("Existe uma conta com esse email");
      setError(true);
    }
  };
  return (
    <>
      <h2 className="text-2xl font-bold mb-6 text-center">Criar uma conta</h2>
      {error && (
        <div className="bg-red-200 w-full text-red-500 py-2 rounded-lg text-center">
          {errorMessage}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label.Root htmlFor="name" className="block text-sm font-medium">
            Nome completo
          </Label.Root>
          <input
            id="name"
            placeholder="João Silva"
            required
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg border-gray-300  focus:outline-none focus:border-gray-400"
          />
        </div>

        <div className="space-y-2">
          <Label.Root
            htmlFor="registerEmail"
            className="block text-sm font-medium"
          >
            E-mail
          </Label.Root>
          <input
            id="registerEmail"
            type="email"
            placeholder="seu@email.com"
            required
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg border-gray-300  focus:outline-none focus:border-gray-400"
          />
        </div>
        <div className="space-y-2">
          <Label.Root
            htmlFor="registerPhone"
            className="block text-sm font-medium"
          >
            Telefone
          </Label.Root>
          <input
            id="registerPhone"
            type="text"
            placeholder="(xx)xxxxx-xxxx"
            required
            onChange={(e) => setPhone(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg border-gray-300  focus:outline-none focus:border-gray-400"
          />
        </div>
        <div className="space-y-2">
          <Label.Root
            htmlFor="registerPassword"
            className="block text-sm font-medium"
          >
            Senha
          </Label.Root>
          <input
            id="registerPassword"
            type="password"
            placeholder="••••••••"
            required
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg border-gray-300  focus:outline-none focus:border-gray-400"
          />
        </div>

        <div className="space-y-2">
          <Label.Root
            htmlFor="confirmPassword"
            className="block text-sm font-medium"
          >
            Confirmar Senha
          </Label.Root>
          <input
            id="confirmPassword"
            type="password"
            placeholder="••••••••"
            required
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg border-gray-300 focus:outline-none focus:border-gray-400"
          />
        </div>

        <button
          type="submit"
          className="w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-800 cursor-pointer"
        >
          Cadastrar
        </button>
      </form>
    </>
  );
};

export default RegisterForm;
