import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as Label from "@radix-ui/react-label";

/**
 * Formulário reutilizável para Adicionar e Editar Usuários no painel de admin.
 * @param {object} props
 * @param {boolean} props.isAdd - true para modo 'Adicionar', false para 'Editar'.
 * @param {object} props.user - O objeto do usuário a ser editado (opcional).
 * @param {function} props.onFormSubmit - A função a ser chamada no submit.
 * @param {boolean} props.isSubmitting - Estado para desabilitar o botão durante o envio.
 */
const UserForm = ({ isAdd = true, user = {}, onFormSubmit, isSubmitting }) => {
  const navigate = useNavigate();

  // Estado interno para controlar os campos do formulário
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('user'); // Padrão é 'user'
  const [password, setPassword] = useState('');
  
  // Preenche o formulário com os dados do usuário quando em modo de edição
  useEffect(() => {
    if (!isAdd && user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setPhone(user.phone || '');
      setRole(user.role || 'user');
    }
  }, [user, isAdd]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Coleta os dados do formulário em um único objeto
    const formData = { name, email, phone, role };
    
    // Apenas adiciona a senha se estiver no modo de criação
    if (isAdd) {
      formData.password = password;
    }
    
    // Chama a função passada pelo componente pai (UserNew ou UserUpdate)
    onFormSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label.Root htmlFor="name" className="block text-sm font-medium">Nome completo</Label.Root>
          <input
            id="name"
            type="text"
            placeholder="Digite o nome do usuário"
            required
            // No modo de edição, um admin pode alterar o nome
            onChange={(e) => setName(e.target.value)}
            value={name}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-400"
          />
        </div>
        <div className="space-y-2">
          <Label.Root htmlFor="email" className="block text-sm font-medium">Email</Label.Root>
          <input
            id="email"
            type="email"
            placeholder="Digite o email do usuário"
            required
            // Desabilita a edição de e-mail (geralmente uma chave única)
            disabled={!isAdd}
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-400 disabled:bg-gray-100"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label.Root htmlFor="phone" className="block text-sm font-medium">Telefone</Label.Root>
          <input
            id="phone"
            type="text"
            placeholder="Digite o telefone do usuário"
            required
             // Um admin também pode editar o telefone
            onChange={(e) => setPhone(e.target.value)}
            value={phone}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-400"
          />
        </div>
        <div className="space-y-2">
          <Label.Root htmlFor="role" className="block text-sm font-medium">Tipo</Label.Root>
          <select id="role" value={role} onChange={(e) => setRole(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg">
            <option value="user">Cliente</option>
            <option value="admin">Administrador</option>
          </select>
        </div>
      </div>
      
      {/* O campo de senha só aparece no modo de criação */}
      {isAdd && (
        <div className="space-y-2">
          <Label.Root htmlFor="password">Senha</Label.Root>
          <input
            id="password"
            type="password"
            placeholder="Senha para o novo usuário"
            required={isAdd}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>
      )}

      <div className="flex justify-end pt-4 gap-4">
        <button type="button" onClick={() => navigate('/dashboard/usuarios')} className="px-4 py-2 border rounded-lg hover:bg-gray-100">
          Cancelar
        </button>
        <button type="submit" disabled={isSubmitting} className="w-48 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-blue-300">
          {isSubmitting ? 'Salvando...' : (isAdd ? 'Adicionar Usuário' : 'Salvar Alterações')}
        </button>
      </div>
    </form>
  );
};

export default UserForm;