import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import 'aos/dist/aos.css';

export const OlvidePassword = () => {

    const navigate = useNavigate();
    const [showSuccess, setShowSuccess] = useState(false);
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [msg, setMsg] = useState('');
    const [showTokenForm, setShowTokenForm] = useState(false);
    const [token, setToken] = useState('');

    useEffect(() => {
        let errorTimeout;
        if (error) {
            errorTimeout = setTimeout(() => {
                setError('');
            }, 3000);
        }

        return () => clearTimeout(errorTimeout);
    }, [error]);

    useEffect(() => {
        let successTimeout;
        if (msg) {
            setShowSuccess(true);
            successTimeout = setTimeout(() => {
                setMsg('');
                setShowSuccess(false);
            }, 3000);
        }

        return () => clearTimeout(successTimeout);
    }, [msg]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await axios.post('https://trabajo-calidad.vercel.app/api/usuarios/olvide-password', { email });
            console.log(response);
            setMsg(response.data.msg);
        } catch (error) {
            setError(error.response.data.msg);
            console.log(error);
        }
        setEmail('');
    };

    const handleTokenSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await axios.get(`https://trabajo-calidad.vercel.app/api/usuarios/olvide-password/${token}`);
            console.log(response);
            setMsg(response.data.msg);
            navigate('/nuevoPassword', { state: { token: token } });
        } catch (error) {
            setError(error.response.data.msg);
            console.log(error);
        }
        setEmail('');
    };

    return (
        <>
          <div data-aos="fade-up" className="flex min-h-screen flex-col justify-center items-center bg-gradient-to-br from-blue-100 to-blue-300 px-6 py-12">
            <div className="sm:mx-auto sm:w-full sm:max-w-md bg-white rounded-xl p-8 shadow-lg transform transition duration-300 ease-in-out hover:scale-105">
              <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                SOLICITUD DE TOKEN
              </h2>

              <div className="mt-8">
                {error && !setShowSuccess && (
                    <div className="mb-4 text-red-500 text-center text-sm">{error}</div>
                )}
                {setShowSuccess && (
                    <div className="mb-4 text-green-600 text-center text-sm">{msg}</div>
                )}
                <form className="space-y-6" onSubmit={handleSubmit} method="POST">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Correo Electrónico*
                    </label>
                    <div className="mt-1">
                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="block w-full rounded-lg border-gray-300 px-4 py-2 text-gray-900 focus:border-blue-400 focus:ring-blue-400 sm:text-sm transition duration-300"
                      />
                    </div>
                  </div>

                  <div>
                    <button
                      type="submit"
                      className="w-full rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 px-4 py-2 text-sm font-semibold text-white shadow-md hover:from-blue-700 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-300 ease-in-out"
                    >
                      Solicitar
                    </button>
                  </div>
                </form>

                <p className="mt-6 text-center text-sm text-gray-500">
                  ¿Ya tienes un token?{' '}
                  <a onClick={() => setShowTokenForm(true)} className="font-medium text-blue-600 hover:text-blue-500 transition duration-200">
                    Validar
                  </a>
                </p>

                {showTokenForm && (
                    <form data-aos="zoom-in" className="space-y-6 mt-6" onSubmit={handleTokenSubmit}>
                        <div>
                          <label htmlFor="token" className="block text-sm font-medium text-gray-700">
                            Token*
                          </label>
                          <div className="mt-1">
                            <input
                              id="token"
                              name="token"
                              type="text"
                              required
                              value={token}
                              onChange={(e) => setToken(e.target.value)}
                              className="block w-full rounded-lg border-gray-300 px-4 py-2 text-gray-900 focus:border-blue-400 focus:ring-blue-400 sm:text-sm transition duration-300"
                            />
                          </div>
                        </div>

                        <div>
                          <button
                            type="submit"
                            className="w-full rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 px-4 py-2 text-sm font-semibold text-white shadow-md hover:from-blue-700 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-300 ease-in-out"
                          >
                            Validar
                          </button>
                        </div>
                    </form>
                )}
              </div>
            </div>
          </div>
        </>
    )
}
