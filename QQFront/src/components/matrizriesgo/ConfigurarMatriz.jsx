import React, { useState } from "react";
import axios from "axios";
import VistaMatrices from "./VistaMatrices";

const ConfigurarMatriz = ({ riesgosSeleccionados, loggedInUser }) => {
  const [estimaciones, setEstimaciones] = useState(
    riesgosSeleccionados.reduce((acc, riesgo) => {
      acc[riesgo._id] = 1; // Valor inicial por defecto
      return acc;
    }, {})
  );
  const [mostrarVistaMatrices, setMostrarVistaMatrices] = useState(false); // Control para renderizar la vista final
  const [riesgosActualizados, setRiesgosActualizados] = useState([]);

  const determinarNivelRiesgo = (valor) => {
    if (valor >= 75) return "Muy Alto";
    if (valor >= 50) return "Alto";
    if (valor >= 25) return "Medio";
    return "Bajo";
  };

  const handleCircleClick = (riesgoId, value) => {
    setEstimaciones((prev) => ({
      ...prev,
      [riesgoId]: value,
    }));
  };

  const generarMatrizRiesgo = async () => {
    try {
      const riesgosFinales = riesgosSeleccionados.map((riesgo) => {
        const probabilidadImpacto = {
          alcance: riesgo.objetivos.alcance * estimaciones[riesgo._id],
          costo: riesgo.objetivos.costo * estimaciones[riesgo._id],
          tiempo: riesgo.objetivos.tiempo * estimaciones[riesgo._id],
          calidad: riesgo.objetivos.calidad * estimaciones[riesgo._id],
        };
  
        // Calcular totalProbabilidadImpacto
        const totalProbabilidadImpacto =
          probabilidadImpacto.alcance +
          probabilidadImpacto.costo +
          probabilidadImpacto.tiempo +
          probabilidadImpacto.calidad;
  
        // Determinar nivel de riesgo global basado en totalProbabilidadImpacto
        const nivelRiesgo = determinarNivelRiesgo(totalProbabilidadImpacto);
  
        return {
          ...riesgo,
          estimacionProbabilidad: estimaciones[riesgo._id],
          probabilidadImpacto,
          totalProbabilidadImpacto,
          nivelRiesgo,
        };
      });
  
      // Verificar los datos que se enviarán al backend
      console.log("Datos que se enviarán al backend:", riesgosFinales);
  
      // Actualizar los riesgos en el backend
      await Promise.all(
        riesgosFinales.map((riesgo) =>
          axios.put(`https://trabajo-calidad.vercel.app/api/riesgos/${riesgo._id}`, riesgo)
        )
      );
  
      setRiesgosActualizados(riesgosFinales); // Guardar los riesgos actualizados
      setMostrarVistaMatrices(true); // Mostrar la vista de matrices
    } catch (error) {
      console.error("Error al generar la matriz de riesgo:", error);
      alert("Hubo un error al generar la matriz. Inténtalo nuevamente.");
    }
  };   

  if (mostrarVistaMatrices) {
    return <VistaMatrices 
            riesgos={riesgosActualizados} 
            loggedInUser={loggedInUser} />;
  }

  return (
    <div className="p-6 bg-gray-100">
      <h2 className="text-2xl font-bold mb-4">Configurar Matriz de Riesgo</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {riesgosSeleccionados.map((riesgo) => (
          <div
            key={riesgo._id}
            className="bg-white shadow-lg rounded-lg p-4 border hover:shadow-xl transition duration-200 ease-in-out w-[250px] min-h-[120px] flex flex-col justify-between"
          >
            <div>
              <p className="text-lg font-medium overflow-hidden text-ellipsis">
                {riesgo.descripcion}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 mt-2 mb-2">
                Selecciona la estimación de probabilidad:
              </p>
              <div className="flex items-center justify-around">
                {[1, 2, 3, 4, 5].map((value) => (
                  <div
                    key={value}
                    onClick={() => handleCircleClick(riesgo._id, value)}
                    className={`w-10 h-10 flex items-center justify-center rounded-full cursor-pointer border ${
                      estimaciones[riesgo._id] === value
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {value}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
      <button
        className="mt-6 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
        onClick={generarMatrizRiesgo}
      >
        Generar Matriz de Riesgo
      </button>
    </div>
  );
};

export default ConfigurarMatriz;