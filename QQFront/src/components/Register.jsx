import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "aos/dist/aos.css";
import axios from "axios";

export const Register = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nombre, setNombre] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let errorTimeout;

    if (error) {
      errorTimeout = setTimeout(() => {
        setError("");
      }, 3000);
    }

    return () => clearTimeout(errorTimeout);
  }, [error]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post("https://trabajo-calidad.vercel.app/api/usuarios", {
        email,
        password,
        nombre,
        username,
      });

      console.log(response.data);
      navigate("/login");
    } catch (error) {
      setError(error.response.data.msg);
      console.log(error);
      setEmail("");
    }
  };

  return (
    <>
      <div
        data-aos="zoom-out"
        className="flex min-h-full flex-1 flex-col justify-center items-center px-6 py-9 lg:px-8 bg-gradient-to-br from-blue-100 to-blue-300"
      >
        <div className="sm:mx-auto sm:w-full sm:max-w-sm bg-white rounded-xl p-8 shadow-lg transform transition duration-300 ease-in-out hover:scale-105">
          <h2 className="text-center text-2xl font-bold leading-9 tracking-tight text-gray-900 mb-8">
            Crea aquí tu nueva cuenta!
          </h2>
          {error && <div className="mb-4 text-red-500 text-center text-sm">{error}</div>}
          <form className="space-y-6" onSubmit={handleSubmit} method="POST">
            <div>
              <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                Correo electrónico*
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="block w-full rounded-lg border-gray-300 px-4 py-2 text-gray-900 focus:border-blue-400 focus:ring-blue-400 sm:text-sm transition duration-300 ease-in-out"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
              </div>
            </div>

            <div>
              <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">
                Nombre*
              </label>
              <div className="mt-2">
                <input
                  id="nombre"
                  name="nombre"
                  type="text"
                  autoComplete="nombre"
                  required
                  className="block w-full rounded-lg border-gray-300 px-4 py-2 text-gray-900 focus:border-blue-400 focus:ring-blue-400 sm:text-sm transition duration-300 ease-in-out"
                  value={nombre}
                  onChange={(event) => setNombre(event.target.value)}
                />
              </div>
            </div>

            <div>
              <label htmlFor="username" className="block text-sm font-medium leading-6 text-gray-900">
                Usuario*
              </label>
              <div className="mt-2">
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  required
                  className="block w-full rounded-lg border-gray-300 px-4 py-2 text-gray-900 focus:border-blue-400 focus:ring-blue-400 sm:text-sm transition duration-300 ease-in-out"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Contraseña*
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="block w-full rounded-lg border-gray-300 px-4 py-2 text-gray-900 focus:border-blue-400 focus:ring-blue-400 sm:text-sm transition duration-300 ease-in-out"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 px-4 py-2 text-sm font-semibold text-white shadow-md hover:from-blue-700 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-300 ease-in-out"
              >
                Crear
              </button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm text-gray-500">
            Ya tienes una cuenta?{" "}
            <Link
              to="/Login"
              className="font-semibold leading-6 text-blue-600 hover:text-blue-500 transition duration-200"
            >
              Ingresar
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};
