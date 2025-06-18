import { useState, useEffect } from 'react'; // Imports React hooks for state and side effects.

const UserRoleForm = ({ currentUserRole, onFormSubmit, isSubmitting }) => { // Defines the UserRoleForm component with its props.
  // Local state to control the dropdown value
  const [role, setRole] = useState(currentUserRole); // Initializes state for the role with the value passed via props.

  // Ensures the dropdown updates if the user prop changes
  useEffect(() => { // Hook to synchronize the local state if the prop changes.
    setRole(currentUserRole); // Updates the local role state when currentUserRole prop changes.
  }, [currentUserRole]); // Dependency array: runs the effect when currentUserRole changes.

  const handleSubmit = (e) => { // Defines the function to handle form submission.
    e.preventDefault(); // Prevents the default form submission behavior.
    // Sends only the data that can be changed
    onFormSubmit({ role }); // Calls the parent's submit function with only the role data.
  };

  return ( // Returns the JSX for the form.
    <form onSubmit={handleSubmit} className="mt-6 border-t border-gray-200 pt-6"> {/* Form element with submit handler and styling. */}
      <div className="space-y-2"> {/* Container for the form elements. */}
        <label htmlFor="role" className="block text-sm font-medium text-gray-800"> {/* Label for the select dropdown. */}
          Tipo de Conta
        </label>
        <select
          id="role" // HTML id attribute.
          value={role} // Binds the select value to the role state.
          onChange={(e) => setRole(e.target.value)} // Updates the role state on change.
          className="w-full md:w-1/2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500" // Styling classes.
        >
          <option value="user">Cliente</option> {/* Option for 'user' role. */}
          <option value="admin">Administrador</option> {/* Option for 'admin' role. */}
        </select>
        <p className="text-xs text-gray-500">Altere o nível de permissão do usuário.</p> {/* Helper text for the user. */}
      </div>
      <div className="flex justify-end mt-6"> {/* Container for the submit button. */}
        <button
          type="submit" // Button type is 'submit'.
          disabled={isSubmitting} // Disables the button if the form is submitting.
          className="w-48 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-blue-300" // Styling classes.
        >
          {isSubmitting ? 'Salvando...' : 'Salvar Alterações'} {/* Dynamic button text based on submission state. */}
        </button>
      </div>
    </form>
  );
};

export default UserRoleForm; // Exports the component.