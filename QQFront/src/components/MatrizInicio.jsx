import React, { useEffect, useState } from "react";
import { Navbar } from "./Navbar.jsx";
import "aos/dist/aos.css";
import { Footer } from "./Footer.jsx";
import RiesgosPorFase from "./matrizriesgo/RiesgoPorFase.jsx";
import axios from "axios";

export const MatrizInicio = ({
  isPopoverOpen,
  handlePopoverOpen,
  handlePopoverClose,
  loggedInUser,
  setLoggedInUser,
}) => {
  const [matrices, setMatrices] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showRiesgosPorFase, setShowRiesgosPorFase] = useState(false); // Control para mostrar RiesgosPorFase

  useEffect(() => {
    // Verificar si el usuario es admin
    if (loggedInUser) {
      console.log("Usuario logueado:", loggedInUser); // Verifica los datos del usuario logueado
      if (loggedInUser.role === "admin") {
        setIsAdmin(true);
      }

      // Cargar las matrices relacionadas con el usuario logueado
      if (loggedInUser._id && loggedInUser.role !== "admin") {
        obtenerMatrices();
      }
    } else {
      console.log("No hay un usuario logueado actualmente."); // Log para cuando no haya usuario
    }
  }, [loggedInUser]);

  const obtenerMatrices = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/matriz/${loggedInUser._id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setMatrices(response.data);
      console.log("Matrices obtenidas para el usuario:", loggedInUser._id, response.data);
    } catch (error) {
      console.error("Error obteniendo matrices:", error);
    }
  };

  const handleShowRiesgosPorFase = () => {
    setShowRiesgosPorFase(true); // Mostrar el componente RiesgosPorFase
  };

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      <Navbar
        isPopoverOpen={isPopoverOpen}
        handlePopoverOpen={handlePopoverOpen}
        handlePopoverClose={handlePopoverClose}
        loggedInUser={loggedInUser}
        setLoggedInUser={setLoggedInUser}
        className="mb-0"
      />

      <main className="flex-grow">
        <div className="max-w-7xl mx-auto py-10 px-6" data-aos="zoom-in">
          <div className="bg-white shadow-lg rounded-lg overflow-hidden p-8 relative transition-all duration-500 ease-in-out">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Matriz de Inicio</h3>
  
            {showRiesgosPorFase ? (
              <RiesgosPorFase loggedInUser={loggedInUser} />
            ) : isAdmin ? (
              <div>
                <p className="text-green-600 font-bold mb-4">Bienvenido, administrador.</p>
                <div className="mb-8">
                  <RiesgosPorFase isAdmin={isAdmin} />
                </div>
              </div>
            ) : (
              <div className="mt-6">
                <button
                  onClick={handleShowRiesgosPorFase}
                  className="bg-blue-500 text-white px-6 py-2 rounded shadow hover:bg-blue-700 transition duration-300"
                >
                  Crear Matriz de Riesgo
                </button>
              </div>
            )}
  
            {!isAdmin && !showRiesgosPorFase && (
              <div className="mt-10">
                <h4 className="text-xl font-semibold text-gray-700 mb-4">Historial de Matrices</h4>
                <p className="text-lg text-gray-600">
                  {matrices.length > 0
                    ? `Has creado ${matrices.length} ${matrices.length === 1 ? "matriz" : "matrices"}.`
                    : "No has creado matrices aún."}
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );    
};