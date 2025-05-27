import * as Label from "@radix-ui/react-label";
import { useState } from "react";
import { v4 as uuidv4 } from 'uuid'
const UserForm = ({
  isAdd = true,
  add = () => {},
  user = {},
  update = () => {},
}) => {
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [role, setRole] = useState(user?.role || "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isAdd) {
      const newUser = {
        id: uuidv4(),
        name: name,
        email: email,
        phone: phone,
        role: role,
        password: password,
        confirmPassword: confirmPassword,
        cart: [],
        order: [],
        address: [],
        createdAt: Date.now()
      };
      add(newUser);
      setName("");
      setEmail("");
      setPhone("");
      setRole("");
      setPassword("");
      setConfirmPassword("");
    } else {
      user = {
        ...user,
        role: role,
      };
      update(user);
    }
  };
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="space-y-2">
          <Label.Root htmlFor="name" className="block text-sm font-medium">
            Nome completo
          </Label.Root>
          <input
            id="name"
            type="text"
            placeholder="Digite o nome do usuário"
            required
            disabled={!isAdd}
            onChange={(e) => setName(e.target.value)}
            value={name}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-400"
          />
        </div>
        <div className="space-y-2">
          <Label.Root htmlFor="email" className="block text-sm font-medium">
            Email
          </Label.Root>
          <input
            id="email"
            type="email"
            placeholder="Digite o email do usuário"
            required
            disabled={!isAdd}
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-400"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="space-y-2">
          <Label.Root htmlFor="phone" className="block text-sm font-medium">
            Telefone
          </Label.Root>
          <input
            id="phone"
            type="text"
            placeholder="Digite o telefone do usuário"
            required
            disabled={!isAdd}
            onChange={(e) => setPhone(e.target.value)}
            value={phone}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-400"
          />
        </div>
        <div className="space-y-2">
          <Label.Root htmlFor="role" className="block text-sm font-medium">
            Tipo
          </Label.Root>
          <select
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="py-2 px-3 border border-gray-200 rounded-md text-sm w-full focus:outline-none focus:border-gray-400"
          >
            <option value="">Selecione um tipo</option>
            <option value="user">Cliente</option>
            <option value="admin">Administrador</option>
           
          </select>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="space-y-2">
          <Label.Root htmlFor="password" className="block text-sm font-medium">
            Senha
          </Label.Root>
          <input
            id="password"
            type="password"
            placeholder="Digite a senha do usuário"
            required
            disabled={!isAdd}
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-400"
          />
        </div>
        <div className="space-y-2">
          <Label.Root htmlFor="confirmPassword" className="block text-sm font-medium">
            Confirme a senha
          </Label.Root>
          <input
            id="confirmPassword"
            type="password"
            placeholder="Digite a senha novamente"
            required
            disabled={!isAdd}
            onChange={(e) => setConfirmPassword(e.target.value)}
            value={confirmPassword  }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-400"
          />
        </div>
      </div>
      <button
        type="submit"
        className="w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-800 cursor-pointer"
      >
        {isAdd ? "Adicionar usuário": "Atualizar usuário"}
      </button>
    </form>
  );
};

export default UserForm;
