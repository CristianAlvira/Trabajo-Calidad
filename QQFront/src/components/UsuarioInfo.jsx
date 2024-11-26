import React from "react";
import { useEffect } from "react";
import { Navbar } from "./Navbar.jsx";
import AOS from "aos";
import "aos/dist/aos.css";
import { Footer } from "./Footer";
import { useLocation, useNavigate, Link } from "react-router-dom";

export const UsuarioInfo = ({
  isPopoverOpen,
  handlePopoverOpen,
  handlePopoverClose,
}) => {
  const location = useLocation();
  const loggedInUser = location.state.loggedInUser;
  const navigate = useNavigate();

  return (
    <div className="bg-gradient-to-br from-blue-100 to-gray-100 min-h-screen flex flex-col">
      {/* Encabezado */}
      <div className="w-full bg-blue-950 text-white p-8 text-center">
        <h1 className="text-4xl font-bold">
          {`Perfil de Usuario - ${loggedInUser.nombre}`}
        </h1>
        <p className="mt-4 text-lg">
          Consulta y gestiona tu información personal fácilmente.
        </p>
      </div>

      {/* Contenedor principal */}
      <div className="flex-grow bg-white shadow-inner py-10">
        {/* Información personal */}
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-semibold text-gray-800 mb-8">
            Información Personal
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { label: "Identificación", value: loggedInUser._id },
              { label: "Nombre", value: loggedInUser.nombre },
              { label: "Username", value: loggedInUser.username },
              { label: "Teléfono", value: loggedInUser.telefono },
              { label: "Email", value: loggedInUser.email },
              {
                label: "Contraseña",
                value: (
                  <Link
                    to="/olvide-password"
                    className="text-blue-600 hover:underline font-medium"
                  >
                    Cambiar contraseña
                  </Link>
                ),
              },
            ].map(({ label, value }) => (
              <div
                key={label}
                className="p-4 bg-gray-50 border rounded-lg flex flex-col"
              >
                <span className="text-sm text-gray-600">{label}</span>
                <span className="text-lg font-medium text-gray-800 mt-1">
                  {value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Opciones de administrador */}
        {loggedInUser._id === "646016258b16b2d008319f05" && (
          <div className="max-w-7xl mx-auto px-6 mt-12">
            <h2 className="text-3xl font-semibold text-gray-800 mb-8">
              Opciones de Administrador
            </h2>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/agregarProductos"
                state={{ loggedInUser }}
                className="flex items-center justify-center bg-blue-500 hover:bg-blue-400 text-white font-medium px-6 py-3 rounded-lg shadow-lg transition duration-300 ease-in-out w-full md:w-auto"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                  className="w-5 h-5 mr-2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Agregar productos
              </Link>
              <Link
                to={{
                  pathname: "/administrarProductos",
                  state: loggedInUser,
                }}
                className="flex items-center justify-center bg-red-500 hover:bg-red-400 text-white font-medium px-6 py-3 rounded-lg shadow-lg transition duration-300 ease-in-out w-full md:w-auto"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                  className="w-5 h-5 mr-2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 12H9m12 0H3m18 0a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Administrar productos
              </Link>
            </div>
          </div>
        )}

      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};
