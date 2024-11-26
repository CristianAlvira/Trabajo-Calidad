import React, { useEffect, useState } from "react";
import { Navbar } from "./Navbar.jsx";
import "aos/dist/aos.css";
import { Footer } from "./Footer.jsx";
import axios from "axios";

export const Reportes = ({
  isPopoverOpen,
  handlePopoverOpen,
  handlePopoverClose,
  loggedInUser,
  setLoggedInUser,
}) => {
  const [reportes, setReportes] = useState([]);

  useEffect(() => {
    // Verificar si el usuario está logueado y cargar los reportes asociados
    if (loggedInUser && loggedInUser._id) {
      obtenerReportes();
    }
  }, [loggedInUser]);

  const obtenerReportes = async () => {
    try {
      const response = await axios.get(
        `https://trabajo-calidad.vercel.app/api/reportes/usuario/${loggedInUser._id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setReportes(response.data);
      console.log("Reportes obtenidos: ", response.data);
    } catch (error) {
      console.error("Error obteniendo los reportes:", error);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar
        isPopoverOpen={isPopoverOpen}
        handlePopoverOpen={handlePopoverOpen}
        handlePopoverClose={handlePopoverClose}
        loggedInUser={loggedInUser}
        setLoggedInUser={setLoggedInUser}
      />
      <div className="max-w-7xl mx-auto py-10 px-6" data-aos="zoom-in">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden p-8 relative transition-all duration-500 ease-in-out">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">Reportes</h3>
          <p className="text-gray-600 mb-4">
            Aquí puedes visualizar los reportes generados de tus evaluaciones.
          </p>

          {/* Contenedor para mostrar los reportes */}
          <div className="grid grid-cols-1 gap-8">
            <div className="bg-gray-50 p-6 rounded-lg shadow divide-y divide-gray-200">
              <div className="grid grid-cols-6 gap-4 text-gray-700 font-semibold">
                <span>ID</span>
                <span>Nombre Reporte</span>
                <span>Fecha de Creación</span>
                <span>Evaluación Asociada</span>
                <span>Estado</span>
                <span>Acciones</span>
              </div>
              {reportes.map((reporte) => (
                <div
                  key={reporte._id}
                  className="grid grid-cols-6 gap-4 text-gray-600 py-4 items-center hover:bg-gray-100 transition duration-150 ease-in-out"
                >
                  <span>{reporte._id.slice(0, 10)}...</span>
                  <span>{reporte.nombre}</span>
                  <span>{reporte.createdAt.slice(0, 10)}</span>
                  <span>{reporte.evaluacionAsociada || "No definida"}</span>
                  <span>{reporte.estado || "Pendiente"}</span>
                  <span>
                    <button
                      onClick={() =>
                        window.open(
                          `https://trabajo-calidad.vercel.app/api/reportes/pdf/${reporte._id}`,
                          "_blank"
                        )
                      }
                      className="text-blue-400 hover:text-blue-600 transition duration-200"
                    >
                      Descargar
                    </button>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};
