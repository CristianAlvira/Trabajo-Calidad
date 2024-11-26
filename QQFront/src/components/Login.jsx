import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import axios from "axios";

export const Login = ({ loggedInUser, setLoggedInUser }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [password, setPassword] = useState("");
  const passwordRef = useRef(null);

  useEffect(() => {
    AOS.init({ duration: 600, easing: "ease-in-out" });
    let errorTimeout;
    if (error) {
      errorTimeout = setTimeout(() => setError(""), 3000);
    }
    return () => clearTimeout(errorTimeout);
  }, [error]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const email = event.target.email.value;
    const password = event.target.password.value;

    try {
      const response = await axios.post("https://trabajo-calidad.vercel.app/api/usuarios/login", { email, password });
      const { data } = response;

      localStorage.setItem("token", data.token);
      setLoggedInUser(data);
      setUsername(data.username);
      navigate("/");
    } catch (error) {
      setError(error.response.data.msg);
    }
    setEmail("");
    setPassword("");
    passwordRef.current.value = "";
  };

  return (
    <>
      <div
        data-aos="fade-up"
        className="flex min-h-screen flex-col justify-center items-center bg-gradient-to-br from-blue-100 to-blue-300 px-6 py-12"
      >
        <div className="sm:mx-auto sm:w-full sm:max-w-md bg-white rounded-xl p-8 shadow-lg transform transition duration-300 ease-in-out hover:scale-105">
          <h2 className="text-center text-3xl font-extrabold text-gray-900 tracking-tight">
            Bienvenido de nuevo
          </h2>
          <p className="mt-2 text-center text-sm text-gray-500">
            Ingresa tus credenciales para acceder a tu cuenta
          </p>

          <div className="mt-8">
            {error && <div className="mb-4 text-red-500 text-center text-sm">{error}</div>}
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
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Contraseña*
                </label>
                <div className="mt-1">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    ref={passwordRef}
                    className="block w-full rounded-lg border-gray-300 px-4 py-2 text-gray-900 focus:border-blue-400 focus:ring-blue-400 sm:text-sm transition duration-300"
                  />
                </div>
                <div className="mt-2 text-right text-sm">
                  <Link
                    to="/olvide-password"
                    className="text-blue-600 hover:text-blue-500 transition duration-200"
                  >
                    ¿Olvidaste tu contraseña?
                  </Link>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 px-4 py-2 text-sm font-semibold text-white shadow-md hover:from-blue-700 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-300 ease-in-out"
                >
                  Ingresar
                </button>
              </div>
            </form>

            {!username && (
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-500">
                  <Link
                    to="/confirm-account"
                    className="font-medium text-blue-600 hover:text-blue-500 transition duration-200"
                  >
                    ¡Hey! Confirma tu cuenta aquí
                  </Link>
                </p>
                <p className="mt-4 text-sm text-gray-500">
                  ¿No tienes cuenta?{" "}
                  <Link
                    to="/create-account"
                    className="font-medium text-blue-600 hover:text-blue-500 transition duration-200"
                  >
                    Regístrate
                  </Link>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
