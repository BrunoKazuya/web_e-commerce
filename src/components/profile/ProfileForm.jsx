import * as Label from "@radix-ui/react-label";
import { useState } from "react";
import { useUser } from "../../contexts/UserContext";

const ProfileForm = ({user}) => {
    const {updateUser} = useUser()
    const [edited, setEdited] = useState(false)
    const [name, setName] = useState(user.name)
    const [email, setEmail] = useState(user.email)
    const [phone, setPhone] = useState(user.phone)
    const [error, setError] = useState(false)
    const errorMessage = "Esse email já está cadastrado"
    const successMessage = "Dados salvo com sucesso"
    const [success, setSuccess] = useState(false)
const onHandleSubmit = (e) => {
    e.preventDefault()
    const isValid = updateUser(name, email, phone)
    if(!isValid){
        setError(true)
        setSuccess(false)
        setEmail(user.email)
        setName(user.name)
        setPhone(user.phone)
    } else{
        setSuccess(true)
        setError(false)
    }
    setEdited(false)
}

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
        <Label.Root htmlFor="nameProfile" className="block text-sm font-medium">
          Nome completo
        </Label.Root>
        <input
          id="nameProfile"
          type="text"
          placeholder="Digite o nome completo"
          required
          value={name}
          onChange={(e) => {
            setEdited(true)
            setName(e.target.value)
          }}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-400"
        />
      </div>
      <div className="space-y-2">
        <Label.Root htmlFor="emailProfile" className="block text-sm font-medium">
          Email
        </Label.Root>
        <input
          id="emailProfile"
          type="text"
          placeholder="Digite o seu email"
          required
          value={email}
          onChange={(e) => {
            setEdited(true)
            setEmail(e.target.value)
          }}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-400"
        />
      </div>
      <div className="space-y-2">
        <Label.Root htmlFor="phoneProfile" className="block text-sm font-medium">
          Telefone
        </Label.Root>
        <input
          id="phoneProfile"
          type="text"
          placeholder="(xx) xxxxx-xxxx"
          required
          value={phone}
          onChange={(e) => {
            setEdited(true)
            setPhone(e.target.value)
          }}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-400"
        />
      </div>
      <button
        className={`text-white py-2 px-3 rounded-lg ${edited ? "bg-blue-600 hover:bg-blue-800 cursor-pointer":"bg-blue-300 cursor-not-allowed"}`}
        type="submit"
      >
        Editar
      </button>
    </form>
  );
};

export default ProfileForm
