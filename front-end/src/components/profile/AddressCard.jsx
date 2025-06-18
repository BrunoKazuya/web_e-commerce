import { useState } from "react"; // Imports the useState hook from React for managing component state.
import { Trash2, Edit } from 'lucide-react'; // Imports the Trash2 and Edit icons from the lucide-react library.
import AddressForm from './AddressForm'; // Imports the AddressForm component from the same directory.

const AddressCard = ({ address, onRemove, onUpdate }) => { // Defines the AddressCard component, which receives props for address data and event handlers.
  const [isEditing, setIsEditing] = useState(false); // State to toggle the editing mode for the address.

  const handleUpdate = async (formData) => { // Defines an async function to handle the address update.
    await onUpdate(address._id, formData); // Calls the onUpdate prop function with the address ID and new form data.
    setIsEditing(false); // Sets the editing state to false to close the form.
  };

  return ( // Returns the JSX to be rendered by the component.
    <div className="border border-gray-200 rounded-lg p-4"> {/* Main container for the card with styling. */}
      {isEditing ? ( // Ternary operator to conditionally render the form or the address details.
        <AddressForm // Renders the AddressForm if isEditing is true.
          isAdd={false} // Passes false to isAdd, indicating this is an edit operation.
          addressToEdit={address} // Passes the current address data to pre-fill the form.
          onFormSubmit={handleUpdate} // Passes the handleUpdate function to be called on form submission.
          onCancel={() => setIsEditing(false)} // Passes a function to handle cancellation, which closes the form.
        />
      ) : ( // Renders the address details if isEditing is false.
        <div className="flex justify-between items-center"> {/* Flex container for address details and action buttons. */}
          <div> {/* Container for the address text. */}
            <p className="font-semibold">{address.street}, {address.number}</p> {/* Displays the street and number. */}
            <p className="text-sm text-gray-600">{address.district}, {address.city} - {address.state}</p> {/* Displays the district, city, and state. */}
            <p className="text-sm text-gray-600">CEP: {address.cep}</p> {/* Displays the ZIP code (CEP). */}
          </div>
          <div className="space-x-2"> {/* Container for the action buttons. */}
            <button onClick={() => setIsEditing(true)} className="p-2 hover:bg-gray-100 rounded-full"><Edit className="h-4 w-4" /></button> {/* Edit button that enables editing mode. */}
            <button onClick={() => onRemove(address._id)} className="p-2 hover:bg-red-100 text-red-600 rounded-full"><Trash2 className="h-4 w-4" /></button> {/* Remove button that calls the onRemove prop with the address ID. */}
          </div>
        </div>
      )}
    </div>
  );
};

export default AddressCard; // Exports the AddressCard component for use in other files.