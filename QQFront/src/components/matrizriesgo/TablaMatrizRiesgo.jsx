import React from "react";

const TablaMatrizRiesgo = ({ riesgos }) => {
  return (
    <div className="overflow-x-auto">
      <table className="table-auto border-collapse border border-gray-200 w-full text-left text-xs">
        <thead>
          <tr className="bg-green-200 text-gray-700">
            <th className="border border-gray-300 px-4 py-2" rowSpan="2">
              CÓDIGO DEL RIESGO
            </th>
            <th className="border border-gray-300 px-4 py-2" rowSpan="2">
              DESCRIPCIÓN DEL RIESGO
            </th>
            <th className="border border-gray-300 px-4 py-2" rowSpan="2">
              FASE AFECTADA
            </th>
            <th className="border border-gray-300 px-4 py-2" rowSpan="2">
              CAUSA RAÍZ
            </th>
            <th className="border border-gray-300 px-4 py-2" rowSpan="2">
              ENTREGABLES AFECTADOS
            </th>
            <th className="border border-gray-300 px-4 py-2" rowSpan="2">
              ESTIMACIÓN PROBABILIDAD
            </th>
            <th className="border border-gray-300 px-4 py-2">OBJETIVO AFECTADO</th>
            <th className="border border-gray-300 px-4 py-2">ESTIMACIÓN IMPACTO</th>
            <th className="border border-gray-300 px-4 py-2">PROBABILIDAD X IMPACTO</th>
            <th className="border border-gray-300 px-4 py-2" rowSpan="2">
              NIVEL DE RIESGO
            </th>
          </tr>
        </thead>
        <tbody>
          {riesgos.length === 0 ? (
            <tr>
              <td
                colSpan="10"
                className="border border-gray-300 px-4 py-2 text-center text-gray-500 italic"
              >
                No hay riesgos, por favor agrega un riesgo.
              </td>
            </tr>
          ) : (
            riesgos.map((riesgo, index) => (
              <React.Fragment key={index}>
                {/* Fila para "CÓDIGO DEL RIESGO" hasta "ESTIMACIÓN PROBABILIDAD" */}
                <tr className="hover:bg-gray-100">
                  <td className="border border-gray-300 px-4 py-2" rowSpan="5">
                    {riesgo.codigo || "N/A"}
                  </td>
                  <td className="border border-gray-300 px-4 py-2" rowSpan="5">
                    {riesgo.descripcion || "N/A"}
                  </td>
                  <td className="border border-gray-300 px-4 py-2" rowSpan="5">
                    {riesgo.faseAfectada || "N/A"}
                  </td>
                  <td className="border border-gray-300 px-4 py-2" rowSpan="5">
                    {riesgo.causaRaiz || "N/A"}
                  </td>
                  <td className="border border-gray-300 px-4 py-2" rowSpan="5">
                    {riesgo.entregablesAfectados || "N/A"}
                  </td>
                  <td className="border border-gray-300 px-4 py-2" rowSpan="5">
                    {riesgo.estimacionProbabilidad || 0}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">Alcance</td>
                  <td className="border border-gray-300 px-4 py-2">{riesgo.objetivos.alcance}</td>
                  <td className="border border-gray-300 px-4 py-2">
                    {riesgo.objetivos.alcance * riesgo.estimacionProbabilidad}
                  </td>
                  <td
                    className="border border-gray-300 px-4 py-2"
                    rowSpan="5"
                    style={{
                      backgroundColor:
                        riesgo.nivelRiesgo === "Muy Alto"
                          ? "red"
                          : riesgo.nivelRiesgo === "Alto"
                          ? "orange"
                          : riesgo.nivelRiesgo === "Medio"
                          ? "yellow"
                          : "green",
                      color: "white",
                    }}
                  >
                    {riesgo.nivelRiesgo}
                  </td>
                </tr>
                {/* Filas adicionales para "Tiempo", "Costo", y "Calidad" */}
                <tr className="hover:bg-gray-100">
                  <td className="border border-gray-300 px-4 py-2">Tiempo</td>
                  <td className="border border-gray-300 px-4 py-2">{riesgo.objetivos.tiempo}</td>
                  <td className="border border-gray-300 px-4 py-2">
                    {riesgo.objetivos.tiempo * riesgo.estimacionProbabilidad}
                  </td>
                </tr>
                <tr className="hover:bg-gray-100">
                  <td className="border border-gray-300 px-4 py-2">Costo</td>
                  <td className="border border-gray-300 px-4 py-2">{riesgo.objetivos.costo}</td>
                  <td className="border border-gray-300 px-4 py-2">
                    {riesgo.objetivos.costo * riesgo.estimacionProbabilidad}
                  </td>
                </tr>
                <tr className="hover:bg-gray-100">
                  <td className="border border-gray-300 px-4 py-2">Calidad</td>
                  <td className="border border-gray-300 px-4 py-2">{riesgo.objetivos.calidad}</td>
                  <td className="border border-gray-300 px-4 py-2">
                    {riesgo.objetivos.calidad * riesgo.estimacionProbabilidad}
                  </td>
                </tr>
                {/* Fila para "Total Probabilidad x Impacto" */}
                <tr className="bg-gray-200 font-bold">
                  <td className="border border-gray-300 px-4 py-2" colSpan="2">
                    Total Probabilidad x Impacto
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {["alcance", "tiempo", "costo", "calidad"].reduce(
                      (total, campo) =>
                        total + riesgo.objetivos[campo] * riesgo.estimacionProbabilidad,
                      0
                    )}
                  </td>
                </tr>
              </React.Fragment>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TablaMatrizRiesgo;