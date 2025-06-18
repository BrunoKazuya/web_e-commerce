// Import necessary hooks from React for state management.
import { useState } from 'react';
// Import icons from the lucide-react library for a better UI.
import { MapPin, PlusCircle } from 'lucide-react';
// Import the AddressForm component, which will be shown when adding a new address.
import AddressForm from '../profile/AddressForm';
// Import the UserContext to get the function for adding an address via the API.
import { useUser } from '../../contexts/UserContext';

/**
 * A component responsible for displaying a list of addresses for selection
 * and allowing the user to add a new address directly from the checkout page.
 * @param {object} props
 * @param {array} props.addresses - The array of user's addresses, passed from the parent page.
 * @param {string} props.selectedAddressId - The ID of the currently selected address.
 * @param {function} props.onSelectAddress - Callback function to notify the parent when an address is selected.
 * @param {function} props.onAddressAdded - Callback function to notify the parent when a new address has been successfully added.
 */
const AddressSelection = ({ addresses, selectedAddressId, onSelectAddress, onAddressAdded }) => {
  // Local state to control the visibility of the "add new address" form.
  // It smartly defaults to 'true' if the user has no addresses, prompting them to add one.
  const [showAddForm, setShowAddForm] = useState(addresses.length === 0);
  // Local state to manage the loading status of the form submission.
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Get the addAddress function from the UserContext, which handles the API call.
  const { addAddress } = useUser();

  // This function is passed to the AddressForm and handles the submission process.
  const handleFormSubmit = async (formData) => {
    // Set submitting state to true to provide UI feedback (e.g., disable button).
    setIsSubmitting(true);
    try {
      // Call the async addAddress function from the context.
      const newAddress = await addAddress(formData);
      // If successful, call the onAddressAdded prop to notify the parent page (CheckoutPage).
      onAddressAdded(newAddress);
      // Hide the form after successful submission.
      setShowAddForm(false);
    } catch (error) {
      // If the API call fails, show an alert to the user.
      alert(`Erro ao adicionar endereço: ${error.message}`);
    } finally {
      // No matter what happens, set submitting state back to false.
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4 flex items-center">
        <MapPin className="mr-2 h-5 w-5" /> Endereço de Entrega
      </h2>
      
      {/* Conditional Rendering: Show the address list OR the add form. */}
      {!showAddForm ? (
        <div className="space-y-4">
          {/* Map over the addresses received from props to display each one. */}
          {addresses.map((address) => (
            // The entire div is clickable to select the address.
            <div 
              key={address._id} 
              onClick={() => onSelectAddress(address._id)} 
              // Dynamically apply styles based on whether the address is selected.
              className={`p-4 border rounded-lg cursor-pointer transition-all ${
                selectedAddressId === address._id 
                  ? 'border-blue-600 ring-2 ring-blue-200 bg-blue-50' 
                  : 'border-gray-200 hover:border-gray-400'
              }`}
            >
              <div className="flex items-center">
                {/* A radio button provides a clear visual indicator of the selection. */}
                <input 
                  type="radio" 
                  name="address" 
                  readOnly 
                  checked={selectedAddressId === address._id} 
                  className="h-4 w-4 text-blue-600" 
                />
                <div className="ml-3">
                  <p className="font-semibold">{address.street}, {address.number}</p>
                  <p className="text-sm text-gray-600">{address.city} - {address.state}</p>
                </div>
              </div>
            </div>
          ))}
          {/* Button to toggle the view to the "add new address" form. */}
          <button onClick={() => setShowAddForm(true)} className="w-full mt-4 flex items-center justify-center gap-2 text-sm text-blue-600 font-semibold p-3 hover:bg-blue-50 rounded-lg border-2 border-dashed">
            <PlusCircle className="h-4 w-4" /> Adicionar Novo Endereço
          </button>
        </div>
      ) : (
        // When showAddForm is true, render the AddressForm component.
        <AddressForm 
          onFormSubmit={handleFormSubmit} // Pass the handler function for submission.
          isSubmitting={isSubmitting}     // Pass the submitting state for button feedback.
          onCancel={() => setShowAddForm(false)} // Pass a function to cancel and hide the form.
        />
      )}
    </div>
  );
};

export default AddressSelection;