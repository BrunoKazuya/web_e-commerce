import { useState, useEffect } from 'react';

const UserRoleForm = ({ currentUserRole, onFormSubmit, isSubmitting }) => {
  // Estado local para controlar o valor do dropdown
  const [role, setRole] = useState(currentUserRole);

  // Garante que o dropdown atualize se o usuário mudar
  useEffect(() => {
    setRole(currentUserRole);
  }, [currentUserRole]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Envia apenas o dado que pode ser alterado
    onFormSubmit({ role });
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6 border-t border-gray-200 pt-6">
      <div className="space-y-2">
        <label htmlFor="role" className="block text-sm font-medium text-gray-800">
          Tipo de Conta
        </label>
        <select
          id="role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full md:w-1/2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
        >
          <option value="user">Cliente</option>
          <option value="admin">Administrador</option>
        </select>
        <p className="text-xs text-gray-500">Altere o nível de permissão do usuário.</p>
      </div>
      <div className="flex justify-end mt-6">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-48 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-blue-300"
        >
          {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
        </button>
      </div>
    </form>
  );
};

export default UserRoleForm;