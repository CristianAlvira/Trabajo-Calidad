import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import 'aos/dist/aos.css';

export const NuevoPassword = () => {

  const location = useLocation();

  const token = location.state?.token;
  
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [msg, setMsg] = useState('');

  useEffect(() => {
      let errorTimeout; // Variable para almacenar el identificador del timeout
      if (error) {
        // Si hay un mensaje de error, configura el timeout para ocultarlo después de 5 segundos
        errorTimeout = setTimeout(() => {
          setError('');
        }, 3000);
      }
  
      // Limpia el timeout si el componente se desmonta o si cambia el mensaje de error
      return () => clearTimeout(errorTimeout);
  }, [error]);

  useEffect(() => {
    let msgTimeout; // Variable para almacenar el identificador del timeout
    if (msg) {
      // Si hay un mensaje de éxito, configura el timeout para ocultarlo después de 3 segundos
      msgTimeout = setTimeout(() => {
        setMsg('');
        navigate('/login');
      }, 3000);
    }

    // Limpia el timeout si el componente se desmonta o si cambia el mensaje de éxito
    return () => clearTimeout(msgTimeout);
  }, [msg]);
    
  const handleSubmit = async (event) => {
    event.preventDefault();
  
    try {

      const response = await axios.post(`http://localhost:3000/api/usuarios/olvide-password/${token}`, { password: password });

      console.log(response);
      setMsg(response.data.msg);
      //navigate('/login');
    } catch (error) {
      setError(error.response.data.msg);
      console.log(error);
    }
    setPassword('');
  };

  return (
      <>
        <div data-aos="zoom-out" className="flex min-h-full flex-1 flex-col justify-center items-center px-6 pt-20 lg:px-8 mt-14">
          <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <Link to={"/"}>
              <img
                className="mx-auto h-10 w-auto"
                src="/img/banana.svg"
                alt="Your Company"
              />
            </Link>
            <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                Cambia tu contraseña!
            </h2>
          </div>
  
          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          {error && !msg && (
              <div className="mb-4 text-rose-600 text-center text-sm">{error}</div>
          )}
          {msg && (
              <div className="mb-4 text-green-600 text-center text-sm">{msg}</div>
          )}
            <form className="space-y-6" onSubmit={handleSubmit} method="POST">
              <div>
                <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                  Password*
                </label>
                <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
                </div>
              </div>
  
              <div>
                <button
                  type="submit"
                  className="flex w-full justify-center rounded-md bg-amber-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-stone-600/[.9] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-600/[.9]"
                >
                  Cambiar
                </button>
              </div>
            </form>
          </div>
        </div>
      </>
  )
}
