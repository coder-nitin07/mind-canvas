import React, { useState } from 'react'

const Signup = () => {
  const [ name, setName ] = useState('');
  const [ email, setEmail ] = useState('');
  const [ password, setPassword ] = useState('');

  const handleSignup = async (e)=>{
    e.preventDefault();

    // console.log('Signup name', name, " email ", email, " password ", password);

    try {
      const response = await fetch('http://localhost:3000/auth/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, password })
      })

      if(response.ok){
        const data = await response.json();

        console.log('SignUp Successfully', data);
      }
      else{
        const errorData = await response.json();
        console.log('SignUp failed', errorData.message || 'Unknown Error');
      }
    } catch (err) {
      console.log('Error while connecting to the Backend Server', err);
    }
  };
  return (
    <>
      <h2>Signup</h2>

      <form onSubmit={ handleSignup }>
        <input
          type='name'
          placeholder='Enter name'
          value={ name }
          onChange={(e)=> setName(e.target.value) }
        />

         <input
          type='email'
          placeholder='Enter email'
          value={ email }
          onChange={(e)=> setEmail(e.target.value) }
        />

         <input
          type='password'
          placeholder='Enter password'
          value={ password }
          onChange={(e)=> setPassword(e.target.value) }
        />

        <button type='submit'>Singup</button>
      </form>
    </>
  )
}

export default Signup