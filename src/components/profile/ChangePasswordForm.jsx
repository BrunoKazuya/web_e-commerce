import * as Label from "@radix-ui/react-label";
import { useState } from "react";
import { useUser } from "../../contexts/UserContext";
const ChangePasswordForm = () => {
  const { updatePasswordUser, verifyPassword } = useUser();
  const [error, setError] = useState(false);
  const errorMessage = "Credenciais inválidas";
  const [success, setSuccess] = useState(false);
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const successMessage = "Senha alterada com sucesso";

  const onHandleSubmit = (e) => {
    e.preventDefault();
    if (verifyPassword(password)) {
      if (newPassword === confirmNewPassword) {
        updatePasswordUser(newPassword);
        setError(false);
        setSuccess(true);
      } else {
        setError(true);
        setSuccess(false);
      }
    } else {
      setError(true);
      setSuccess(false);
    }
    setPassword("");
    setNewPassword("");
    setConfirmNewPassword("");
  };

  return (
    <form onSubmit={onHandleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-200 w-full text-red-500 py-2 rounded-lg text-center">
          {errorMessage}
        </div>
      )}
      {success && (
        <div className="bg-green-200 w-full text-green-500 py-2 rounded-lg text-center">
          {successMessage}
        </div>
      )}
      <div className="space-y-2">
        <Label.Root htmlFor="password" className="block text-sm font-medium">
          Senha atual
        </Label.Root>
        <input
          id="password"
          type="password"
          placeholder="Digite a senha atual"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-400"
        />
      </div>
      <div className="space-y-2">
        <Label.Root htmlFor="newPassword" className="block text-sm font-medium">
          Nova senha
        </Label.Root>
        <input
          id="newPassword"
          type="password"
          placeholder="Digite a nova senha"
          required
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-400"
        />
      </div>
      <div className="space-y-2">
        <Label.Root
          htmlFor="confirmNewPassword"
          className="block text-sm font-medium"
        >
          Confirme a nova senha
        </Label.Root>
        <input
          id="confirmNewPassword"
          type="password"
          placeholder="Digite a nova senha novamente"
          required
          value={confirmNewPassword}
          onChange={(e) => setConfirmNewPassword(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-400"
        />
      </div>
      <button
        className="bg-blue-600 cursor-pointer hover:bg-blue-800 text-white py-2 px-3 rounded-lg"
        type="submit"
      >
        Atualizar Senha
      </button>
    </form>
  );
};

export default ChangePasswordForm;
