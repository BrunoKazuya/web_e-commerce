import { useState, useEffect } from 'react'; // Imports React hooks for state and side effects.
import { useNavigate } from 'react-router-dom'; // Imports the hook for programmatic navigation.
import * as Label from "@radix-ui/react-label"; // Imports the Label component from the Radix UI library.

/**
 * @description A reusable form for Adding and Editing Users in the admin panel.
 * @param {object} props
 * @param {boolean} props.isAdd - true for 'Add' mode, false for 'Edit' mode.
 * @param {object} props.user - The user object to be edited (optional).
 * @param {function} props.onFormSubmit - The function to be called on submit.
 * @param {boolean} props.isSubmitting - State to disable the button during submission.
 */
const UserForm = ({ isAdd = true, user = {}, onFormSubmit, isSubmitting }) => { // Defines the UserForm component with its props.
  const navigate = useNavigate(); // Initializes the navigate function for routing.

  // Internal state to control the form fields
  const [name, setName] = useState(''); // State for the user's name.
  const [email, setEmail] = useState(''); // State for the user's email.
  const [phone, setPhone] = useState(''); // State for the user's phone.
  const [role, setRole] = useState('user'); // State for the user's role, defaults to 'user'.
  const [password, setPassword] = useState(''); // State for the user's password.
  
  // Fills the form with user data when in edit mode
  useEffect(() => { // Hook to pre-fill form fields in edit mode.
    if (!isAdd && user) { // Checks if it's edit mode and if user data exists.
      setName(user.name || ''); // Sets the name state.
      setEmail(user.email || ''); // Sets the email state.
      setPhone(user.phone || ''); // Sets the phone state.
      setRole(user.role || 'user'); // Sets the role state.
    }
  }, [user, isAdd]); // Dependency array: runs the effect when these values change.

  const handleSubmit = (e) => { // Defines the function to handle form submission.
    e.preventDefault(); // Prevents the default form submission behavior (page reload).
    
    // Collects the form data into a single object
    const formData = { name, email, phone, role }; // Creates an object with the current state values.
    
    // Only adds the password if in creation mode
    if (isAdd) { // Checks if the form is in 'add' mode.
      formData.password = password; // If so, adds the password to the form data object.
    }
    
    // Calls the function passed by the parent component
    onFormSubmit(formData); // Executes the callback function passed as a prop with the form data.
  };

  return ( // Returns the JSX for the form.
    <form onSubmit={handleSubmit} className="space-y-6"> {/* Form element with submit handler and styling. */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6"> {/* Grid layout for inputs. */}
        <div className="space-y-2"> {/* Container for the name input. */}
          <Label.Root htmlFor="name" className="block text-sm font-medium">Nome completo</Label.Root> {/* Label for the input. */}
          <input
            id="name" // HTML id attribute.
            type="text" // Input type.
            placeholder="Digite o nome do usuário" // Placeholder text.
            required // Makes the field mandatory.
            onChange={(e) => setName(e.target.value)} // Updates the name state on change.
            value={name} // Binds the input value to the name state.
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-400" // Styling classes.
          />
        </div>
        <div className="space-y-2"> {/* Container for the email input. */}
          <Label.Root htmlFor="email" className="block text-sm font-medium">Email</Label.Root> {/* Label for the input. */}
          <input
            id="email" // HTML id attribute.
            type="email" // Input type.
            placeholder="Digite o email do usuário" // Placeholder text.
            required // Makes the field mandatory.
            disabled={!isAdd} // The field is disabled if it's NOT in 'add' mode.
            onChange={(e) => setEmail(e.target.value)} // Updates the email state on change.
            value={email} // Binds the input value to the email state.
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-400 disabled:bg-gray-100" // Styling classes, including for disabled state.
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6"> {/* Another grid row for inputs. */}
        <div className="space-y-2"> {/* Container for the phone input. */}
          <Label.Root htmlFor="phone" className="block text-sm font-medium">Telefone</Label.Root> {/* Label for the input. */}
          <input
            id="phone" // HTML id attribute.
            type="text" // Input type.
            placeholder="Digite o telefone do usuário" // Placeholder text.
            required // Makes the field mandatory.
            onChange={(e) => setPhone(e.target.value)} // Updates the phone state on change.
            value={phone} // Binds the input value to the phone state.
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-400" // Styling classes.
          />
        </div>
        <div className="space-y-2"> {/* Container for the role selection. */}
          <Label.Root htmlFor="role" className="block text-sm font-medium">Tipo</Label.Root> {/* Label for the select dropdown. */}
          <select id="role" value={role} onChange={(e) => setRole(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg"> {/* Select dropdown for user role. */}
            <option value="user">Cliente</option> {/* Option for 'user' role. */}
            <option value="admin">Administrador</option> {/* Option for 'admin' role. */}
          </select>
        </div>
      </div>
      
      {isAdd && ( // Conditionally renders the password field only if isAdd is true.
        <div className="space-y-2"> {/* Container for the password input. */}
          <Label.Root htmlFor="password">Senha</Label.Root> {/* Label for the input. */}
          <input
            id="password" // HTML id attribute.
            type="password" // Input type.
            placeholder="Senha para o novo usuário" // Placeholder text.
            required={isAdd} // Field is required only in 'add' mode.
            value={password} // Binds the input value to the password state.
            onChange={(e) => setPassword(e.target.value)} // Updates the password state on change.
            className="w-full px-3 py-2 border rounded-lg" // Styling classes.
          />
        </div>
      )}

      <div className="flex justify-end pt-4 gap-4"> {/* Container for action buttons. */}
        <button type="button" onClick={() => navigate('/dashboard/usuarios')} className="px-4 py-2 border rounded-lg hover:bg-gray-100"> {/* Cancel button. */}
          Cancelar
        </button>
        <button type="submit" disabled={isSubmitting} className="w-48 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-blue-300"> {/* Submit button. */}
          {isSubmitting ? 'Salvando...' : (isAdd ? 'Adicionar Usuário' : 'Salvar Alterações')} {/* Dynamic button text. */}
        </button>
      </div>
    </form>
  );
};

export default UserForm; // Exports the component.