'use client'

import { useState } from "react";
import axios from 'axios'; // Import axios

export default function Home() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState(''); // State for messages

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/users', { name, email });
      console.log(response.data);
      setMessage('User created successfully!'); // Set success message
      setName(''); // Clear input
      setEmail(''); // Clear input
    } catch (err) {
      console.error(err);
      setMessage('Error creating user. Please try again.'); // Set error message
    }
  };

  return (
    <div className="max-w-lg mx-auto">
      <h2>Create User</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name</label>
          <input 
            type="text"
            value={name} // Controlled input
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter Name"
            required
          />
        </div>
        <div>
          <label>Email</label>
          <input 
            type="email" // Change to type email for better validation
            value={email} // Controlled input
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter Email"
            required
          />
        </div>
        <button type="submit">Submit</button>
      </form>
      {message && <p>{message}</p>} {/* Display message */}
    </div>
  );
}
