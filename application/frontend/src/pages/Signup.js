import { useState } from "react";
import { useSignup } from '../hooks/useSignup'

const Signup = () => {
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const { signup, error, isLoading } = useSignup()

    const handleSubmit = async(e) => {
        e.preventDefault()
        
        await signup(username, email, password)
    }

    return (
        <form className="signup" onSubmit={handleSubmit}>
            <h3>Sign up</h3>

            <label>Username: </label>
            <input type="text" value={username} onChange={(e) => {setUsername(e.target.value)}} placeholder="Enter username"/>
            
            <label>Email: </label>
            <input type="email" value={email} onChange={(e) => {setEmail(e.target.value)}} placeholder="Enter email which will be used for login credential"/>

            <label>Password: </label>
            <input type="password" value={password} onChange={(e) => {setPassword(e.target.value)}} placeholder="Enter password"/>

            <button disabled={isLoading}>Sign up</button>
            {error && <div className="error">{error}</div>}
        </form>
    )
}

export default Signup