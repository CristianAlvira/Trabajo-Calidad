import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

export const ConfirmAccount = () => {

    const navigate = useNavigate();

    const [token, setToken] = useState('');
      
    const handleSubmit = async (event) => {
      event.preventDefault();
    
      try {
        const response = await axios.get(`https://trabajo-calidad.vercel.app/api/usuarios/confirmar/${token}`);
        console.log(response.data);
        navigate('/login');
      } catch (error) {
        console.log(error);
      }

    };
  
    return (
        <>
          <div data-aos="zoom-out" className="flex min-h-full flex-1 flex-col justify-center items-center px-6 pt-20 lg:px-8 mt-14 bg-white">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
              <h2 className="mt-10 text-center text-3xl font-extrabold leading-9 tracking-tight text-blue-600">
                  Confirma usando tu JWT!
              </h2>
            </div>
    
            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
              <form className="space-y-6" onSubmit={handleSubmit} method="POST">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium leading-6 text-blue-600">
                    Token de usuario
                  </label>
                  <div className="mt-2">
                    <input
                      id="token"
                      name="token"
                      type="text"
                      required
                      value={token}
                      onChange={(e) => setToken(e.target.value)}
                      className="block w-full rounded-lg border-2 border-blue-300 bg-white text-blue-900 shadow-md focus:ring-4 focus:ring-blue-500 placeholder:text-gray-400 focus:outline-none sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
    
                <div>
                  <button
                    type="submit"
                    className="flex w-full justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold leading-6 text-white shadow-md hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                  >
                    Confirmar
                  </button>
                </div>
              </form>
                  <p className="mt-10 text-center text-sm text-gray-500">
                    Ya estás confirmado?{' '}
                    <Link to="/login" className="font-semibold leading-6 text-blue-600 hover:text-blue-500">
                        Login
                    </Link>
                  </p>
            </div>
          </div>
        </>
    )
}
