import React, { useEffect, useState } from "react";
import { Navbar } from "./Navbar.jsx";
import { Footer } from "./Footer.jsx";
import { useLocation, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { downloadPDF } from "./utils/pdfUtils"; // Importar la función desde utils
// import { parse } from "postcss";

export const AjusteParametros2 = ({
  isPopoverOpen,
  handlePopoverOpen,
  handlePopoverClose,
  loggedInUser,
  setLoggedInUser,
}) => {
  const [parametros, setParametros] = useState([]);
  const [preguntasTotales, setPreguntasTotales] = useState(0);
  const [usuarioEval, setUsuarioEval] = useState(null);
  const [modelo, setModelo] = useState([]);
  const [editingParametroId, setEditingParametroId] = useState(null);
  const [porcentajeTotal, setPorcentajeTotal] = useState(0);
  const [editableContent, setEditableContent] = useState("");
  const navigate = useNavigate();
  const evaluacionId = location.pathname.split("/").pop(); //Traer el id de la evaluación

  const [evaluacion, setEvaluacion] = useState({
    usuario: loggedInUser._id,
    nombreEmpresa: "",
    ciudad: "",
    nombreSoftware: "",
    objetivosGenerales: "",
    objetivosEspecíficos: "",
    parametrosEvaluacion: [],
  });

  useEffect(() => {
    console.log("evaluacion id: ", evaluacionId);
    //console.log("Usuario logueado en NuevaEvaluacion: ", loggedInUser._id);
    obtenerUsuarioEvaluacion();
    //console.log("Modelo fuera: ", modelo);
    // obtenerModelo();

    if (loggedInUser) {
      obtenerParametros();
      //console.log("Parametros: ", parametros);
    }
  }, [loggedInUser]);

  useEffect(() => {
    obtenerModelo();
    console.log("Modelo fuera: ", modelo);
    if (modelo == "664feb032834e7fa38a9deaf") {
      console.log("Me voy pal IEEE");
      navigate(`/ajustesParametros/${evaluacionId}`);
    }
  }, [evaluacion]);

  const obtenerUsuarioEvaluacion = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/evaluaciones/${evaluacionId}`
      );
      //console.log("Modelo: ", response.data.modelo);
      setUsuarioEval(response.data.usuario);
      setModelo(response.data.modelo);

      if (response.data.usuario == loggedInUser._id) {
        console.log("Sí coinciden usuarios u");
      } else {
        navigate("/home");
      }
    } catch (error) {
      console.error("Error obteniendo usuario de la evaluación:", error);
    }
  };

  const obtenerModelo = async () => {
    if (modelo) {
      const response = await axios.get(
        `http://localhost:3000/api/modelos/obtenerModelo/${modelo}`
      );
      console.log("Modelo de la prueba:", response.data.nombreModelo);
      setModelo(response.data.nombreModelo);
    }
  };

  useEffect(() => {
    setPorcentajeTotal(calcularPorcentajeTotal());
    setPreguntasTotales(calcularNoPreguntas());
  }, [parametros]);

  const obtenerParametros = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/parametros/`);
      //console.log("Response: ", response);
      setParametros(response.data);
      // Asignar los parámetros a la evaluación
      setEvaluacion((prevEvaluacion) => ({
        ...prevEvaluacion,
        parametrosEvaluacion: response.data.map((parametro) => parametro._id),
      }));
    } catch (error) {
      console.log(error);
    }
  };

  const handleSaveEdit = async (id) => {
    const nuevoPorcentaje = parseFloat(editableContent);
  
    // Calcular el total excluyendo el parámetro actual
    const totalActual = parametrosFiltrados.reduce((total, param) => {
      if (param._id !== id) {
        total += param.valorPorcentaje;
      }
      return total;
    }, 0);
  
    // Validar que el nuevo porcentaje no haga que el total supere 100
    if (totalActual + nuevoPorcentaje > 100) {
      alert("La suma total de los porcentajes no puede exceder el 100%");
      return;
    }
  
    try {
      const response = await axios.put(
        `http://localhost:3000/api/parametros/${id}`,
        { valorPorcentaje: nuevoPorcentaje },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
  
      // Actualizar el estado con los datos nuevos
      const updatedParametros = parametros.map((param) => {
        if (param._id === id) {
          return { ...param, valorPorcentaje: response.data.parametro.valorPorcentaje };
        }
        return param;
      });
  
      setParametros(updatedParametros); // Actualizar los parámetros en el estado
      setEditingParametroId(null); // Salir del modo de edición
      alert("Parámetro actualizado correctamente");
    } catch (error) {
      console.error("Error al guardar la edición:", error);
      alert("Hubo un error al actualizar el parámetro");
    }
  };
  

  const [totalPorcentaje, setTotalPorcentaje] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0);

  // Función para calcular el total de porcentajes
  const calcularTotalPorcentaje = () => {
    const correctitudPercentage =
      calculatePercentageCorrectitud(correctitudValues);
    const fiabilidadPercentage =
      calculatePercentageFiabilidad(fiabilidadValues);
    const usabilidadPercentage =
      calculatePercentageUsabilidad(usabilidadValues);
    const eficienciaPercentage =
      calculatePercentageEficiencia(eficienciaValues);
    const usabilidad2Percentage =
      calculatePercentageUsabilidad3(mantenimientoValues);
    const usabilidad3Percentage =
      calculatePercentageUsabilidad2(portabilidadValues);
    const calidadPercentage = calculatePercentageCalidad(calidadValues);

    const funcionalidadPoints = calculateTotalPoints(correctitudValues);
    const fiabilidadPoints = calculateTotalPoints(fiabilidadValues);
    const usabilidadPoints = calculateTotalPoints(usabilidadValues);
    const eficienciaPoints = calculateTotalPoints(eficienciaValues);
    const mantenimientoPoints = calculateTotalPoints(mantenimientoValues);
    const portabilidadPoints = calculateTotalPoints(portabilidadValues);
    const calidadPoints = calculateTotalPoints(calidadValues);
    // Agregar más categorías si es necesario

    // Sumar los porcentajes de todas las categorías
    const total =
      parseFloat(correctitudPercentage) * 0.14 +
      parseFloat(fiabilidadPercentage) * 0.14 +
      parseFloat(usabilidadPercentage) * 0.15 +
      parseFloat(eficienciaPercentage) * 0.15 +
      parseFloat(usabilidad3Percentage) * 0.14 +
      parseFloat(usabilidad2Percentage) * 0.14 +
      parseFloat(calidadPercentage) * 0.14;
    // Si tienes más categorías, agrégalas aquí

    const totalPoints =
      parseFloat(funcionalidadPoints) +
      parseFloat(fiabilidadPoints) +
      parseFloat(usabilidadPoints) +
      parseFloat(eficienciaPoints) +
      parseFloat(mantenimientoPoints) +
      parseFloat(portabilidadPoints) +
      parseFloat(calidadPoints);

    // Actualizar el estado del total de porcentajes
    setTotalPorcentaje(total.toFixed(2));
    setTotalPoints(totalPoints);
    console.log("porcentaje: ", total);
    console.log("points: ", totalPoints);
    const valorCalificacion = totalPorcentaje;
    console.log("Meter valo afuera: ", total.toFixed(2));
    meterValorEvaluacion(total.toFixed(2));
  };

  // Llama a esta función cada vez que cambien los valores de las categorías

  const meterValorEvaluacion = async (valorCalificacion) => {
    const evaluacionId = location.pathname.split("/").pop();
    try {
      const response = await axios.put(
        `http://localhost:3000/api/evaluaciones/${evaluacionId}`,
        { valorCalificacion: valorCalificacion } // Enviar un objeto con la clave "valorCalificacion"
      );
      console.log("Meter valor: ", response.data);
      setRespuestaBackend(response.mensaje);
      setTimeout(() => {
        navigate(`/evaluacion`);
      }, 1500);
    } catch (error) {
      console.error("Respuesta: ", response.mensaje);
    }
  };

  const [respuestaBackend, setRespuestaBackend] = useState(null);

  const handleChange = (e) => {
    const inputValue = parseInt(e.target.value);
    if (inputValue >= 0 && inputValue <= 3) {
      setFiabilidadValues({
        ...fiabilidadValues,
        [e.target.name]: inputValue,
      });
    }
  };

  const handleChangeFuncionalidad = (e) => {
    const inputValue = parseInt(e.target.value);
    if (!isNaN(inputValue) && inputValue >= 0 && inputValue <= 3) {
      setCorrectitudValues((prevValues) => ({
        ...prevValues,
        [e.target.name]: inputValue,
      }));
    }
  };

  const handleChangeUsabilidad = (e) => {
    const inputValue = parseInt(e.target.value);
    if (inputValue >= 0 && inputValue <= 3) {
      setUsabilidadValues({
        ...usabilidadValues,
        [e.target.name]: inputValue,
      });
    }
  };

  const handleChangeEficiencia = (e) => {
    const inputValue = parseInt(e.target.value);
    if (inputValue >= 0 && inputValue <= 3) {
      setEficienciaValues({
        ...eficienciaValues,
        [e.target.name]: inputValue,
      });
    }
  };

  const handleChangeMantenimiento = (e) => {
    const inputValue = parseInt(e.target.value);
    if (inputValue >= 0 && inputValue <= 3) {
      setMantenimientoValues({
        ...mantenimientoValues,
        [e.target.name]: inputValue,
      });
    }
  };

  const handleChangePortabilidad = (e) => {
    const inputValue = parseInt(e.target.value);
    if (inputValue >= 0 && inputValue <= 3) {
      setPortabilidadValues({
        ...portabilidadValues,
        [e.target.name]: inputValue,
      });
    }
  };

  const handleChangeCalidad = (e) => {
    const inputValue = parseInt(e.target.value);
    if (inputValue >= 0 && inputValue <= 3) {
      setCalidadValues({
        ...calidadValues,
        [e.target.name]: inputValue,
      });
    }
  };

  const [correctitudValues, setCorrectitudValues] = useState({
    1.1: "",
    1.2: "",
    1.3: "",
    1.4: "",
    1.5: "",
  });

  const [fiabilidadValues, setFiabilidadValues] = useState({
    2.1: "",
    2.2: "",
    2.3: "",
    2.4: "",
  });

  const [usabilidadValues, setUsabilidadValues] = useState({
    3.1: "",
    3.2: "",
    3.3: "",
    3.4: "",
    3.5: "",
  });

  const [eficienciaValues, setEficienciaValues] = useState({
    4.1: "",
    4.2: "",
    4.3: "",
  });

  const [mantenimientoValues, setMantenimientoValues] = useState({
    5.1: "",
    5.2: "",
    5.3: "",
    5.4: "",
    5.5: "",
  });

  const [portabilidadValues, setPortabilidadValues] = useState({
    6.1: "",
    6.2: "",
    6.3: "",
    6.4: "",
    6.5: "",
  });

  const [calidadValues, setCalidadValues] = useState({
    7.1: "",
    7.2: "",
    7.3: "",
    7.4: "",
    7.5: "",
    7.6: "",
  });

  const calculateTotalPoints = (values) => {
    let total = 0;
    for (const key in values) {
      total += parseInt(values[key]);
    }
    return total;
  };

  const calculatePercentageCorrectitud = (values) => {
    const totalPoints = calculateTotalPoints(values);
    return ((totalPoints / 15) * 100).toFixed(2);
  };

  const calculatePercentageFiabilidad = (values) => {
    const totalPoints = calculateTotalPoints(values);
    return ((totalPoints / 12) * 100).toFixed(2);
  };

  const calculatePercentageUsabilidad = (values) => {
    const totalPoints = calculateTotalPoints(values);
    return ((totalPoints / 15) * 100).toFixed(2);
  };

  const calculatePercentageEficiencia = (values) => {
    const totalPoints = calculateTotalPoints(values);
    return ((totalPoints / 9) * 100).toFixed(2);
  };

  const calculatePercentageUsabilidad3 = (values) => {
    const totalPoints = calculateTotalPoints(values);
    return ((totalPoints / 15) * 100).toFixed(2);
  };

  const calculatePercentageUsabilidad2 = (values) => {
    const totalPoints = calculateTotalPoints(values);
    return ((totalPoints / 15) * 100).toFixed(2);
  };

  const calculatePercentageCalidad = (values) => {
    const totalPoints = calculateTotalPoints(values);
    return ((totalPoints / 18) * 100).toFixed(2);
  };

  // Filtrar los parámetros por el modeloId específico
  const parametrosFiltrados = parametros.filter(
    (parametro) => parametro.modeloID === "673222c1ccd3db2f768df6e2"
  );

  const calcularPorcentajeTotal = () => {
    let total = 0;
    parametrosFiltrados.forEach((parametro) => {
      total += parametro.valorPorcentaje;
    });
    return total;
  };

  // Función para calcular el número total de preguntas de los parámetros renderizados
  const calcularNoPreguntas = () => {
    let totalPreguntas = 0;
    parametrosFiltrados.forEach((parametro) => {
      totalPreguntas += parametro.preguntasParametro.length;
    });
    return totalPreguntas;
  };

  const calcularTotalPreguntas = () => {
    return parametrosFiltrados.reduce((total, parametro) => {
      return (
        total +
        (parametro.preguntasParametro ? parametro.preguntasParametro.length : 0)
      );
    }, 0);
  };

  const descargarPDF = () => {
    downloadPDF("#evaluacion", "Evaluación_parametros.pdf");
  };

  return (
    <div>
      <div data-aos="zoom-out">
        <Navbar
          isPopoverOpen={isPopoverOpen}
          handlePopoverOpen={handlePopoverOpen}
          handlePopoverClose={handlePopoverClose}
          loggedInUser={loggedInUser}
        />
      </div>

      <div data-aos="zoom-in" id="evaluacion">
        <div
          className={`my-20 mb-10 max-w-6xl mx-auto relative overflow-hidden transition-all duration-500 ease-in-out ${
            isPopoverOpen ? "mt-128" : "my-20"
          }`}
        >
          <div
            className={`px-4 sm:px-0 relative overflow-hidden transition-all duration-500 ease-in-out ${
              isPopoverOpen ? "mt-0" : "mt-0"
            }`}
          >
            <h3 className="mt-0 mr-0 text-3xl font-bold text-blue-900 text-center">
              Ajusta los parámetros de la evaluación {modelo}
            </h3>
            <p className="mt-4 max-w text-lg leading-7 text-gray-600 text-left">
              Aquí podrás adaptar los porcentajes de incidencia en los
              resultados, o añadir parámetros.
            </p>

            <div className="mt-6 ml-0 w-full grid grid-cols-1 gap-x-8 gap-y-6">
              <dl className="w-full divide-y divide-blue-200 bg-blue-50 rounded-lg shadow-md">
                <div className="px-4 py-4 sm:grid sm:grid-cols-7 sm:gap-4 sm:px-6 bg-blue-100 rounded-t-lg">
                  <dd className="text-sm font-semibold text-blue-800 col-span-1">
                    Código
                  </dd>
                  <dd className="text-sm font-semibold text-blue-800 col-span-1">
                    Nombre
                  </dd>
                  <dd className="text-sm font-semibold text-blue-800 col-span-3">
                    Descripción
                  </dd>
                  <dd className="text-sm font-semibold text-blue-800 col-span-1">
                    No. Preguntas
                  </dd>
                  <dd className="text-sm font-semibold text-blue-800 col-span-1">
                    % Total
                  </dd>
                </div>

                {parametrosFiltrados.map((parametro) => (
                  <div
                    key={parametro._id}
                    className="px-4 py-6 sm:grid sm:grid-cols-7 sm:gap-4 sm:px-6 border-t border-blue-200 bg-white hover:bg-blue-50"
                  >
                    <dd className="text-sm text-black-700 col-span-1 truncate">
                      {parametro._id.slice(0, 10)}...
                    </dd>
                    <dd className="mt-1 text-sm text-black-700 sm:col-span-1 sm:mt-0">
                      {parametro.nombreParametro}
                    </dd>
                    <dd className="mt-1 text-sm text-black-700 sm:col-span-3 sm:mt-0">
                      {parametro.descripcionParametro}
                    </dd>
                    <dd className="mt-1 text-sm text-black-700 sm:col-span-1 sm:mt-0">
                      {parametro.preguntasParametro
                        ? parametro.preguntasParametro.length
                        : 0}
                    </dd>

                    {editingParametroId === parametro._id ? (
                      <div className="flex flex-col space-y-2">
                        {/* Campo de edición más ancho y menos alto */}
                        <textarea
                          value={editableContent}
                          onChange={(e) => setEditableContent(e.target.value)}
                          className="text-sm text-black-700 rounded-md border border-blue-300 focus:ring-2 focus:ring-blue-600"
                          style={{ width: "100%", height: "35px", resize: "none", padding: "8px" }} // Ajusta ancho y altura
                        ></textarea>

                        {/* Botones alineados verticalmente */}
                        <div className="flex justify-start space-x-2">
                          <button
                            onClick={() => handleSaveEdit(parametro._id)} // Guardar cambios
                            className="text-sm text-white bg-blue-500 rounded-md hover:bg-blue-600"
                            style={{
                              padding: "6px 14px", // Reduce padding
                              fontSize: "14px", // Reduce tamaño de texto
                              width: "100px", // Botón más estrecho
                              height: "35px", // Menor altura
                            }}
                          >
                            Guardar
                          </button>
                          <button
                            onClick={() => setEditingParametroId(null)} // Cancelar edición
                            className="text-sm text-gray-700 bg-gray-300 rounded-md hover:bg-gray-400"
                            style={{
                              padding: "6px 14px", // Reduce padding
                              fontSize: "14px", // Reduce tamaño de texto
                              width: "100px", // Botón más estrecho
                              height: "35px", // Menor altura
                            }}
                          >
                            Cancelar
                          </button>
                        </div>
                      </div>
                    ) : (
                      <dd className="mt-1 text-sm text-black-700 sm:col-span-1 sm:mt-0 flex items-center">
                        {parametro.valorPorcentaje}%
                        {loggedInUser.role === "admin" && (
                          <a
                            className="text-blue-400 hover:text-blue-600 cursor-pointer ml-2"
                            onClick={() => {
                              setEditingParametroId(parametro._id);
                              setEditableContent(parametro.valorPorcentaje); // Inicializa con el valor actual
                            }}
                          >
                            <img
                              className="h-6 w-auto"
                              src="/img/editar2-2.svg"
                              alt="Editar"
                              onMouseOver={(e) => {
                                e.currentTarget.src = "/img/editar2.svg";
                              }}
                              onMouseOut={(e) => {
                                e.currentTarget.src = "/img/editar2-2.svg";
                              }}
                            />
                          </a>
                        )}
                      </dd>
                    )}
                  </div>
                ))}

                <div className="px-4 py-4 sm:grid sm:grid-cols-7 sm:gap-4 sm:px-6 bg-blue-100 rounded-b-lg">
                  <dd className="ml-auto text-sm font-semibold text-blue-800 col-span-5">
                    Total
                  </dd>
                  <dd className="text-sm font-semibold text-blue-800 col-span-1">
                    {calcularTotalPreguntas()}
                  </dd>
                  <dd className="text-sm font-semibold text-blue-800 col-span-1">
                    {porcentajeTotal}%
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          {/*__________________________Categoria por Categoría__________*/}

          {/*________________________Funcionalidad_________*/}
          <div
            className={`px-6 sm:px-8 md:px-12 lg:px-16 relative overflow-hidden rounded-xl shadow-xl transition-all duration-500 ease-in-out transform ${
              isPopoverOpen ? "mt-0 scale-100" : "mt-10 scale-95"
            }`}
          >
            <h3 className="mt-0 mr-0 text-3xl font-bold text-white text-center bg-blue-900 px-8 py-2 rounded-lg">
              1. FUNCIONALIDAD
            </h3>

            <p className="mt-4 max-w text-lg leading-7 text-gray-600 text-center">
            Capacidad para asegurar un nivel de funcionamiento adecuado cuando el software es utilizado.
            </p>

            <div className="mt-6 ml-0 w-5/5 grid grid-cols-1 gap-x-8 gap-y-6">
              <dl className="w-auto divide-y divide-blue-200">
                <div className="px-4 py-4 sm:grid sm:grid-cols-6 sm:gap-4 sm:px-0">
                  <dd className="text-lg font-bold leading-6 text-blue-800 col-span-1 block">
                    Código
                  </dd>
                  <dd className="text-lg font-bold leading-6 text-blue-800 col-span-1 block">
                    Item
                  </dd>
                  <dd className="text-lg font-bold leading-6 text-blue-800 col-span-3 block">
                    Descripción
                  </dd>
                  <dd className="text-lg font-bold leading-6 text-blue-800 col-span-1 block">
                    Valor
                  </dd>
                </div>

                <div className="px-4 py-6 sm:grid sm:grid-cols-6 sm:gap-4 sm:px-0 border-t border-blue-200">
                  <dd className="text-base font-medium leading-6 text-black-700 col-span-1">
                    1.1
                  </dd>
                  <dd className="mt-1 text-base leading-6 text-black-700 sm:col-span-1 sm:mt-0">
                    Adecuación
                  </dd>
                  <dd className="mt-1 text-base leading-6 text-black-700 sm:col-span-3 sm:mt-0">
                    La capacidad del software para proveer un adecuado conjunto de funciones para las tareas
                    y objetivos especificados por el usuario.
                  </dd>
                  <dd className="mt-1 text-base leading-6 text-blue-700 sm:col-span-1 sm:mt-0">
                    <input
                      required
                      min={1}
                      max={3}
                      type="number"
                      className="w-3/4 mt-1 text-base leading-6 text-blue-700 sm:col-span-1 sm:mt-0 rounded-md border-blue-400 focus:ring-blue-500"
                      onChange={handleChangeFuncionalidad}
                      name="1.1"
                      value={correctitudValues["1.1"]}
                    />
                  </dd>
                </div>

                <div className="px-4 py-6 sm:grid sm:grid-cols-6 sm:gap-4 sm:px-0 border-t border-blue-200">
                  <dd className="text-base font-medium leading-6 text-black-700 col-span-1">
                    1.2
                  </dd>
                  <dd className="mt-1 text-base leading-6 text-black-700 sm:col-span-1 sm:mt-0">
                    Exactitud
                  </dd>
                  <dd className="mt-1 text-base leading-6 text-black-700 sm:col-span-3 sm:mt-0">
                    Asegura que los resultados producidos por el software son
                    precisos y correctos, sin errores en los cálculos, datos o
                    procesos.
                  </dd>
                  <dd className="mt-1 text-base leading-6 text-blue-700 sm:col-span-1 sm:mt-0">
                    <input
                      required
                      min={1}
                      max={3}
                      type="number"
                      className="w-3/4 mt-1 text-base leading-6 text-blue-700 sm:col-span-1 sm:mt-0 rounded-md border-blue-400 focus:ring-blue-500"
                      onChange={handleChangeFuncionalidad}
                      name="1.2"
                      value={correctitudValues["1.2"]}
                    />
                  </dd>
                </div>

                <div className="px-4 py-6 sm:grid sm:grid-cols-6 sm:gap-4 sm:px-0 border-t border-blue-200">
                  <dd className="text-base font-medium leading-6 text-black-700 col-span-1  ">
                    1.3
                  </dd>
                  <dd className="mt-1 text-base leading-6 text-black-700 sm:col-span-1 sm:mt-0">
                    Interoperabilidad
                  </dd>
                  <dd className="mt-1 text-base leading-6 text-black-700 sm:col-span-3 sm:mt-0">
                    La capacidad del software de interactuar con uno o más
                    sistemas especificados. La interoperabilidad se 
                    utiliza en lugar de compatibilidad para evitar una posible ambiguedad
                    con la reemplazabilidad.
                  </dd>
                  <dd className="mt-1 text-base leading-6 text-blue-700 sm:col-span-1 sm:mt-0">
                    <input
                      min={1}
                      max={3}
                      type="number"
                      className="w-3/4 mt-1 text-base leading-6 text-blue-700 sm:col-span-1 sm:mt-0 rounded-md border-blue-400 focus:ring-blue-500"
                      onChange={handleChangeFuncionalidad}
                      name="1.3"
                      value={correctitudValues["1.3"]}
                    />
                  </dd>
                </div>

                <div className="px-4 py-6 sm:grid sm:grid-cols-6 sm:gap-4 sm:px-0 border-t border-blue-200">
                  <dd className="text-base font-medium leading-6 text-black-700 col-span-1  ">
                    1.4
                  </dd>
                  <dd className="mt-1 text-base leading-6 text-black-700 sm:col-span-1 sm:mt-0">
                    Seguridad
                  </dd>
                  <dd className="mt-1 text-base leading-6 text-black-700 sm:col-span-3 sm:mt-0">
                    La capacidad del software para proteger la información
                    y los datos de modo que las personas o los sistemas no
                    autorizados no puedan leerlos ni modificarlos, a estas personas 
                    y/o sistemas se les niega el acceso.
                  </dd>
                  <dd className="mt-1 text-base leading-6 text-blue-700 sm:col-span-1 sm:mt-0">
                    <input
                      min={1}
                      max={3}
                      type="number"
                      className="w-3/4 mt-1 text-base leading-6 text-blue-700 sm:col-span-1 sm:mt-0 rounded-md border-blue-400 focus:ring-blue-500"
                      onChange={handleChangeFuncionalidad}
                      name="1.4"
                      value={correctitudValues["1.4"]}
                    />
                  </dd>
                </div>

                <div className="px-4 py-6 sm:grid sm:grid-cols-6 sm:gap-4 sm:px-0 border-t border-blue-200">
                  <dd className="text-base font-medium leading-6 text-black-700 col-span-1  ">
                    1.5
                  </dd>
                  <dd className="mt-1 text-base leading-6 text-black-700 sm:col-span-1 sm:mt-0">
                    Conformidad de la funcionalidad
                  </dd>
                  <dd className="mt-1 text-base leading-6 text-black-700 sm:col-span-3 sm:mt-0">
                    La capacidad de adherirse a los estandares, convenciones o regulaciones
                    legales y prescripciones similares referentes a la funcionalidad.
                  </dd>
                  <dd className="mt-1 text-base leading-6 text-blue-700 sm:col-span-1 sm:mt-0">
                    <input
                      min={1}
                      max={3}
                      type="number"
                      className="w-3/4 mt-1 text-base leading-6 text-blue-700 sm:col-span-1 sm:mt-0 rounded-md border-blue-400 focus:ring-blue-500"
                      onChange={handleChangeFuncionalidad}
                      name="1.5"
                      value={correctitudValues["1.5"]}
                    />
                  </dd>
                </div>

                <div className="px-4 py-4 sm:grid sm:grid-cols-8 sm:gap-4 sm:px-0">
                  <dd className="ml-auto text-lg font-medium leading-6 text-blue-900 col-span-3 block">
                    Porcentaje
                  </dd>
                  <dd className="text-lg font-medium leading-6 text-blue-900 col-span-1 block">
                    {calculatePercentageCorrectitud(correctitudValues)}%
                  </dd>
                  <dd className="ml-auto text-lg font-medium leading-6 text-blue-900 col-span-3 block">
                    Total
                  </dd>
                  <dd className="text-lg font-medium leading-6 text-blue-900 col-span-1 block">
                    {calculateTotalPoints(correctitudValues)}
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          {/*__________________________Fiabilidad__________*/}
          <div
            className={`px-6 sm:px-8 md:px-12 lg:px-16 relative overflow-hidden rounded-xl shadow-xl transition-all duration-500 ease-in-out transform ${
              isPopoverOpen ? "mt-0 scale-100" : "mt-10 scale-95"
            }`}
          >
            <h3 className="mt-0 mr-0 text-3xl font-bold text-white text-center bg-blue-900 px-8 py-2 rounded-lg">
              2. FIABILIDAD
            </h3>
            <p className="mt-4 max-w text-lg leading-7 text-gray-600 text-center">
              Capacidad para asegurar un nivel de funcionamiento adecuado cuando el software es utilizado.
            </p>

            <div className="mt-6 ml-0 w-5/5 grid grid-cols-1 gap-x-8 gap-y-6">
              <dl className="w-auto divide-y divide-blue-200">
                <div className="px-4 py-4 sm:grid sm:grid-cols-6 sm:gap-4 sm:px-0">
                  <dd className="text-lg font-bold leading-6 text-blue-800 col-span-1 block">
                    Código
                  </dd>
                  <dd className="text-lg font-bold leading-6 text-blue-800 col-span-1 block">
                    Item
                  </dd>
                  <dd className="text-lg font-bold leading-6 text-blue-800 col-span-3 block">
                    Descripción
                  </dd>
                  <dd className="text-lg font-bold leading-6 text-blue-800 col-span-1 block">
                    Valor
                  </dd>
                </div>

                <div className="px-4 py-6 sm:grid sm:grid-cols-6 sm:gap-4 sm:px-0 border-t border-blue-200">
                  <dd className="text-base font-medium leading-6 text-black-700 col-span-1">
                    2.1
                  </dd>
                  <dd className="mt-1 text-base leading-6 text-black-700 sm:col-span-1 sm:mt-0">
                    Madurez
                  </dd>
                  <dd className="mt-1 text-base leading-6 text-black-700 sm:col-span-3 sm:mt-0">
                    La capacidad del software para evitar fallas como resultado de errores en el software.
                  </dd>
                  <dd className="mt-1 text-base leading-6 text-blue-700 sm:col-span-1 sm:mt-0">
                    <input
                      required
                      min={1}
                      max={3}
                      type="number"
                      className="w-3/4 mt-1 text-base leading-6 text-blue-700 sm:col-span-1 sm:mt-0 rounded-md border-blue-400 focus:ring-blue-500"
                      onChange={handleChange}
                      name="2.1"
                      value={fiabilidadValues["2.1"]}
                    />
                  </dd>
                </div>

                <div className="px-4 py-6 sm:grid sm:grid-cols-6 sm:gap-4 sm:px-0 border-t border-blue-200">
                  <dd className="text-base font-medium leading-6 text-black-700 col-span-1">
                    2.2
                  </dd>
                  <dd className="mt-1 text-base leading-6 text-black-700 sm:col-span-1 sm:mt-0">
                    Tolerancia a errores.
                  </dd>
                  <dd className="mt-1 text-base leading-6 text-black-700 sm:col-span-3 sm:mt-0">
                    La capacidad del producto de software para mantener un nivel especificado de 
                    funcionamiento en caso de errores del software o de incumplimiento en su interfaz
                    especificada. El nivel especificado puede incluir la falta de capacidad de seguridad.
                  </dd>
                  <dd className="mt-1 text-base leading-6 text-blue-700 sm:col-span-1 sm:mt-0">
                    <input
                      required
                      min={1}
                      max={3}
                      type="number"
                      className="w-3/4 mt-1 text-base leading-6 text-blue-700 sm:col-span-1 sm:mt-0 rounded-md border-blue-400 focus:ring-blue-500"
                      onChange={handleChange}
                      name="2.2"
                      value={fiabilidadValues["2.2"]}
                    />
                  </dd>
                </div>

                <div className="px-4 py-6 sm:grid sm:grid-cols-6 sm:gap-4 sm:px-0 border-t border-blue-200">
                  <dd className="text-base font-medium leading-6 text-black-700 col-span-1">
                    2.3
                  </dd>
                  <dd className="mt-1 text-base leading-6 text-black-700 sm:col-span-1 sm:mt-0">
                    Recuperabilidad
                  </dd>
                  <dd className="mt-1 text-base leading-6 text-black-700 sm:col-span-3 sm:mt-0">
                    La capacidad del software para reestablecer un nivel especificado de funcionamiento y 
                    recuperar los datos afectados directamente en caso de una falla. Despues de una falla, 
                    un software aveces no estará disponible por cierto período de tiempo, intervalo en el cuál se evaluará 
                    su recuperabilidad.
                  </dd>
                  <dd className="mt-1 text-base leading-6 text-blue-700 sm:col-span-1 sm:mt-0">
                    <input
                      required
                      min={1}
                      max={3}
                      type="number"
                      className="w-3/4 mt-1 text-base leading-6 text-blue-700 sm:col-span-1 sm:mt-0 rounded-md border-blue-400 focus:ring-blue-500"
                      onChange={handleChange}
                      name="2.3"
                      value={fiabilidadValues["2.3"]}
                    />
                  </dd>
                </div>

                <div className="px-4 py-6 sm:grid sm:grid-cols-6 sm:gap-4 sm:px-0 border-t border-blue-200">
                  <dd className="text-base font-medium leading-6 text-black-700 col-span-1">
                    2.4
                  </dd>
                  <dd className="mt-1 text-base leading-6 text-black-700 sm:col-span-1 sm:mt-0">
                    Conformidad de la fiabilidad
                  </dd>
                  <dd className="mt-1 text-base leading-6 text-black-700 sm:col-span-3 sm:mt-0">
                    La capacidad del software para adherirse a las normas, convenciones o regulaciones
                    relativas a la fiabilidad.
                  </dd>
                  <dd className="mt-1 text-base leading-6 text-blue-700 sm:col-span-1 sm:mt-0">
                    <input
                      required
                      min={1}
                      max={3}
                      type="number"
                      className="w-3/4 mt-1 text-base leading-6 text-blue-700 sm:col-span-1 sm:mt-0 rounded-md border-blue-400 focus:ring-blue-500"
                      onChange={handleChange}
                      name="2.4"
                      value={fiabilidadValues["2.4"]}
                    />
                  </dd>
                </div>

                <div className="px-4 py-4 sm:grid sm:grid-cols-8 sm:gap-4 sm:px-0">
                  <dd className="ml-auto text-lg font-medium leading-6 text-blue-900 col-span-3 block">
                    Porcentaje
                  </dd>
                  <dd className="text-lg font-medium leading-6 text-blue-900 col-span-1 block">
                    {calculatePercentageFiabilidad(fiabilidadValues)}%
                  </dd>
                  <dd className="ml-auto text-lg font-medium leading-6 text-blue-900 col-span-3 block">
                    Total
                  </dd>
                  <dd className="text-lg font-medium leading-6 text-blue-900 col-span-1 block">
                    {calculateTotalPoints(fiabilidadValues)}
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          {/*_________________________Usabilidad__________*/}
          <div
            className={`px-6 sm:px-8 md:px-12 lg:px-16 relative overflow-hidden rounded-xl shadow-xl transition-all duration-500 ease-in-out transform ${
              isPopoverOpen ? "mt-0 scale-100" : "mt-10 scale-95"
            }`}
          >
            <h3 className="mt-0 mr-0 text-3xl font-bold text-white text-center bg-blue-900 px-8 py-2 rounded-lg">
              3. USABILIDAD
            </h3>
            <p className="mt-4 max-w text-lg leading-7 text-gray-600 text-center">
            Capacidad del software de ser entendido, aprendido y atractivo para el usuario,
            cuando es utilizado bajo las condiciones especificadas.
            </p>

            <div className="mt-6 ml-0 w-5/5 grid grid-cols-1 gap-x-8 gap-y-6">
              <dl className="w-auto divide-y divide-blue-200">
                <div className="px-4 py-4 sm:grid sm:grid-cols-6 sm:gap-4 sm:px-0">
                  <dd className="text-lg font-bold leading-6 text-blue-800 col-span-1 block">
                    Código
                  </dd>
                  <dd className="text-lg font-bold leading-6 text-blue-800 col-span-1 block">
                    Item
                  </dd>
                  <dd className="text-lg font-bold leading-6 text-blue-800 col-span-3 block">
                    Descripción
                  </dd>
                  <dd className="text-lg font-bold leading-6 text-blue-800 col-span-1 block">
                    Valor
                  </dd>
                </div>

                <div className="px-4 py-6 sm:grid sm:grid-cols-6 sm:gap-4 sm:px-0 border-t border-blue-200">
                  <dd className="text-base font-medium leading-6 text-black-700 col-span-1">
                    3.1
                  </dd>
                  <dd className="mt-1 text-base leading-6 text-black-700 sm:col-span-1 sm:mt-0">
                    Entendimiento
                  </dd>
                  <dd className="mt-1 text-base leading-6 text-black-700 sm:col-span-3 sm:mt-0">
                    La capacidad del software para permitirle al usuario 
                    entender si el software es adecuado, y como debe ser utilizado para las tareas
                    y las condiciones particulares de la aplicación. Esto dependerá de la 
                    documentación y de las impresiones iniciales dadas al software.
                  </dd>
                  <dd className="mt-1 text-base leading-6 text-blue-700 sm:col-span-1 sm:mt-0">
                    <input
                      required
                      min={1}
                      max={3}
                      type="number"
                      className="w-3/4 mt-1 text-base leading-6 text-blue-700 sm:col-span-1 sm:mt-0 rounded-md border-blue-400 focus:ring-blue-500"
                      onChange={handleChangeUsabilidad}
                      name="3.1"
                      value={usabilidadValues["3.1"]}
                    />
                  </dd>
                </div>

                <div className="px-4 py-6 sm:grid sm:grid-cols-6 sm:gap-4 sm:px-0 border-t border-blue-200">
                  <dd className="text-base font-medium leading-6 text-black-700 col-span-1">
                    3.2
                  </dd>
                  <dd className="mt-1 text-base leading-6 text-black-700 sm:col-span-1 sm:mt-0">
                    Aprendizaje
                  </dd>
                  <dd className="mt-1 text-base leading-6 text-black-700 sm:col-span-3 sm:mt-0">
                    La capacidad del software para permitir al usuario aprender su aplicación.
                    Un aspecto importante a considerar aquí es la documentación del software.
                  </dd>
                  <dd className="mt-1 text-base leading-6 text-blue-700 sm:col-span-1 sm:mt-0">
                    <input
                      required
                      min={1}
                      max={3}
                      type="number"
                      className="w-3/4 mt-1 text-base leading-6 text-blue-700 sm:col-span-1 sm:mt-0 rounded-md border-blue-400 focus:ring-blue-500"
                      onChange={handleChangeUsabilidad}
                      name="3.2"
                      value={usabilidadValues["3.2"]}
                    />
                  </dd>
                </div>

                <div className="px-4 py-6 sm:grid sm:grid-cols-6 sm:gap-4 sm:px-0 border-t border-blue-200">
                  <dd className="text-base font-medium leading-6 text-black-700 col-span-1">
                    3.3
                  </dd>
                  <dd className="mt-1 text-base leading-6 text-black-700 sm:col-span-1 sm:mt-0">
                    Operabilidad
                  </dd>
                  <dd className="mt-1 text-base leading-6 text-black-700 sm:col-span-3 sm:mt-0">
                    La capacidad del software para permitirle al usuario operarlo y controlarlo. 
                    Los aspectos de propiedad, de cambio, de adaptabilidad y de instalación pueden afectar 
                    su operabilidad.
                  </dd>
                  <dd className="mt-1 text-base leading-6 text-blue-700 sm:col-span-1 sm:mt-0">
                    <input
                      required
                      min={1}
                      max={3}
                      type="number"
                      className="w-3/4 mt-1 text-base leading-6 text-blue-700 sm:col-span-1 sm:mt-0 rounded-md border-blue-400 focus:ring-blue-500"
                      onChange={handleChangeUsabilidad}
                      name="3.3"
                      value={usabilidadValues["3.3"]}
                    />
                  </dd>
                </div>

                <div className="px-4 py-6 sm:grid sm:grid-cols-6 sm:gap-4 sm:px-0 border-t border-blue-200">
                  <dd className="text-base font-medium leading-6 text-black-700 col-span-1">
                    3.4
                  </dd>
                  <dd className="mt-1 text-base leading-6 text-black-700 sm:col-span-1 sm:mt-0">
                    Atracción
                  </dd>
                  <dd className="mt-1 text-base leading-6 text-black-700 sm:col-span-3 sm:mt-0">
                    La capacidad del software de ser atractivo al usuario. Esto se refiere a las cualidades
                    del software para hacer el software más atractivo, tal como el uso del color y la naturaleza del diseño gráfico.
                  </dd>
                  <dd className="mt-1 text-base leading-6 text-blue-700 sm:col-span-1 sm:mt-0">
                    <input
                      required
                      min={1}
                      max={3}
                      type="number"
                      className="w-3/4 mt-1 text-base leading-6 text-blue-700 sm:col-span-1 sm:mt-0 rounded-md border-blue-400 focus:ring-blue-500"
                      onChange={handleChangeUsabilidad}
                      name="3.4"
                      value={usabilidadValues["3.4"]}
                    />
                  </dd>
                </div>

                <div className="px-4 py-6 sm:grid sm:grid-cols-6 sm:gap-4 sm:px-0 border-t border-blue-200">
                  <dd className="text-base font-medium leading-6 text-black-700 col-span-1">
                    3.5
                  </dd>
                  <dd className="mt-1 text-base leading-6 text-black-700 sm:col-span-1 sm:mt-0">
                    Conformidad de uso
                  </dd>
                  <dd className="mt-1 text-base leading-6 text-black-700 sm:col-span-3 sm:mt-0">
                    La capacidad del software para adherirse a los estandares, convenciones, guías de estilo 
                    o regulaciones relacionadas con su usabilidad.
                  </dd>
                  <dd className="mt-1 text-base leading-6 text-blue-700 sm:col-span-1 sm:mt-0">
                    <input
                      required
                      min={1}
                      max={3}
                      type="number"
                      className="w-3/4 mt-1 text-base leading-6 text-blue-700 sm:col-span-1 sm:mt-0 rounded-md border-blue-400 focus:ring-blue-500"
                      onChange={handleChangeUsabilidad}
                      name="3.5"
                      value={usabilidadValues["3.5"]}
                    />
                  </dd>
                </div>

                <div className="px-4 py-4 sm:grid sm:grid-cols-8 sm:gap-4 sm:px-0">
                  <dd className="ml-auto text-lg font-medium leading-6 text-blue-900 col-span-3 block">
                    Porcentaje
                  </dd>
                  <dd className="text-lg font-medium leading-6 text-blue-900 col-span-1 block">
                    {calculatePercentageUsabilidad(usabilidadValues)}%
                  </dd>
                  <dd className="ml-auto text-lg font-medium leading-6 text-blue-900 col-span-3 block">
                    Total
                  </dd>
                  <dd className="text-lg font-medium leading-6 text-blue-900 col-span-1 block">
                    {calculateTotalPoints(usabilidadValues)}
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          {/*__________________________Eficiencia__________*/}
          <div
            className={`px-6 sm:px-8 md:px-12 lg:px-16 relative overflow-hidden rounded-xl shadow-xl transition-all duration-500 ease-in-out transform ${
              isPopoverOpen ? "mt-0 scale-100" : "mt-10 scale-95"
            }`}
          >
            <h3 className="mt-0 mr-0 text-3xl font-bold text-white text-center bg-blue-900 px-8 py-2 rounded-lg">
              4. EFICIENCIA
            </h3>
            <p className="mt-4 max-w text-lg leading-7 text-gray-600 text-center">
            La forma del desempeño adecuado, de acuerdo al número de recursos utilizados según las condiciones planteadas.
            </p>

            <div className="mt-6 ml-0 w-5/5 grid grid-cols-1 gap-x-8 gap-y-6">
              <dl className="w-auto divide-y divide-blue-200">
                <div className="px-4 py-4 sm:grid sm:grid-cols-6 sm:gap-4 sm:px-0">
                  <dd className="text-lg font-bold leading-6 text-blue-800 col-span-1 block">
                    Código
                  </dd>
                  <dd className="text-lg font-bold leading-6 text-blue-800 col-span-1 block">
                    Item
                  </dd>
                  <dd className="text-lg font-bold leading-6 text-blue-800 col-span-3 block">
                    Descripción
                  </dd>
                  <dd className="text-lg font-bold leading-6 text-blue-800 col-span-1 block">
                    Valor
                  </dd>
                </div>

                <div className="px-4 py-6 sm:grid sm:grid-cols-6 sm:gap-4 sm:px-0 border-t border-blue-200">
                  <dd className="text-base font-medium leading-6 text-black-700 col-span-1">
                    4.1
                  </dd>
                  <dd className="mt-1 text-base leading-6 text-black-700 sm:col-span-1 sm:mt-0">
                    Comportamiento de tiempos
                  </dd>
                  <dd className="mt-1 text-base leading-6 text-black-700 sm:col-span-3 sm:mt-0">
                    La capacidad del software para proveer tiempos adecuados de respuesta y procesamiento,
                    ratios de rendimiento cuando realiza su función bajo las condiciones
                    establecidas.
                  </dd>
                  <dd className="mt-1 text-base leading-6 text-blue-700 sm:col-span-1 sm:mt-0">
                    <input
                      required
                      min={1}
                      max={3}
                      type="number"
                      className="w-3/4 mt-1 text-base leading-6 text-blue-700 sm:col-span-1 sm:mt-0 rounded-md border-blue-400 focus:ring-blue-500"
                      onChange={handleChangeEficiencia}
                      name="4.1"
                      value={eficienciaValues["4.1"]}
                    />
                  </dd>
                </div>

                <div className="px-4 py-6 sm:grid sm:grid-cols-6 sm:gap-4 sm:px-0 border-t border-blue-200">
                  <dd className="text-base font-medium leading-6 text-black-700 col-span-1">
                    4.2
                  </dd>
                  <dd className="mt-1 text-base leading-6 text-black-700 sm:col-span-1 sm:mt-0">
                    Utilización de recursos
                  </dd>
                  <dd className="mt-1 text-base leading-6 text-black-700 sm:col-span-3 sm:mt-0">
                    La capacidad del software para utilizar cantidades y tipos de recursos adecuados cuando
                    este funciona bajo las condiciones establecidas. Los recursos humanos están incluidos
                    dentro del concepto de productividad.
                  </dd>
                  <dd className="mt-1 text-base leading-6 text-blue-700 sm:col-span-1 sm:mt-0">
                    <input
                      required
                      min={1}
                      max={3}
                      type="number"
                      className="w-3/4 mt-1 text-base leading-6 text-blue-700 sm:col-span-1 sm:mt-0 rounded-md border-blue-400 focus:ring-blue-500"
                      onChange={handleChangeEficiencia}
                      name="4.2"
                      value={eficienciaValues["4.2"]}
                    />
                  </dd>
                </div>

                <div className="px-4 py-6 sm:grid sm:grid-cols-6 sm:gap-4 sm:px-0 border-t border-blue-200">
                  <dd className="text-base font-medium leading-6 text-black-700 col-span-1">
                    4.3
                  </dd>
                  <dd className="mt-1 text-base leading-6 text-black-700 sm:col-span-1 sm:mt-0">
                    Conformidad de eficiencia
                  </dd>
                  <dd className="mt-1 text-base leading-6 text-black-700 sm:col-span-3 sm:mt-0">
                    La capacidad del producto de software para adherirse a estandares o convenciones
                    relacionadas con la eficiencia.
                  </dd>
                  <dd className="mt-1 text-base leading-6 text-blue-700 sm:col-span-1 sm:mt-0">
                    <input
                      required
                      min={1}
                      max={3}
                      type="number"
                      className="w-3/4 mt-1 text-base leading-6 text-blue-700 sm:col-span-1 sm:mt-0 rounded-md border-blue-400 focus:ring-blue-500"
                      onChange={handleChangeEficiencia}
                      name="4.3"
                      value={eficienciaValues["4.3"]}
                    />
                  </dd>
                </div>

                <div className="px-4 py-4 sm:grid sm:grid-cols-8 sm:gap-4 sm:px-0">
                  <dd className="ml-auto text-lg font-medium leading-6 text-blue-900 col-span-3 block">
                    Porcentaje
                  </dd>
                  <dd className="text-lg font-medium leading-6 text-blue-900 col-span-1 block">
                    {calculatePercentageEficiencia(eficienciaValues)}%
                  </dd>
                  <dd className="ml-auto text-lg font-medium leading-6 text-blue-900 col-span-3 block">
                    Total
                  </dd>
                  <dd className="text-lg font-medium leading-6 text-blue-900 col-span-1 block">
                    {calculateTotalPoints(eficienciaValues)}
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          {/*_________________________Capacidad de mantenimiento__________*/}
          <div
            className={`px-6 sm:px-8 md:px-12 lg:px-16 relative overflow-hidden rounded-xl shadow-xl transition-all duration-500 ease-in-out transform ${
              isPopoverOpen ? "mt-0 scale-100" : "mt-10 scale-95"
            }`}
          >
            <h3 className="mt-0 mr-0 text-3xl font-bold text-white text-center bg-blue-900 px-8 py-2 rounded-lg">
              5. CAPACIDAD DE MANTENIMIENTO
            </h3>
            <p className="mt-4 max-w text-lg leading-7 text-gray-600 text-center">
              Cualidad del software para ser modificado, incluyendo modificaciones o mejoras.
            </p>

            <div className="mt-6 ml-0 w-5/5 grid grid-cols-1 gap-x-8 gap-y-6">
              <dl className="w-auto divide-y divide-blue-200">
                <div className="px-4 py-4 sm:grid sm:grid-cols-6 sm:gap-4 sm:px-0">
                  <dd className="text-lg font-bold leading-6 text-blue-800 col-span-1 block">
                    Código
                  </dd>
                  <dd className="text-lg font-bold leading-6 text-blue-800 col-span-1 block">
                    Item
                  </dd>
                  <dd className="text-lg font-bold leading-6 text-blue-800 col-span-3 block">
                    Descripción
                  </dd>
                  <dd className="text-lg font-bold leading-6 text-blue-800 col-span-1 block">
                    Valor
                  </dd>
                </div>

                <div className="px-4 py-6 sm:grid sm:grid-cols-6 sm:gap-4 sm:px-0 border-t border-blue-200">
                  <dd className="text-base font-medium leading-6 text-black-700 col-span-1">
                    5.1
                  </dd>
                  <dd className="mt-1 text-base leading-6 text-black-700 sm:col-span-1 sm:mt-0">
                    Capacidad de ser analizado
                  </dd>
                  <dd className="mt-1 text-base leading-6 text-black-700 sm:col-span-3 sm:mt-0">
                    La capacidad del software para atender a diagnósticos de deficiencias
                    o causas de fallas, o la identificación de las partes al ser modificadas.
                  </dd>
                  <dd className="mt-1 text-base leading-6 text-blue-700 sm:col-span-1 sm:mt-0">
                    <input
                      required
                      min={1}
                      max={3}
                      type="number"
                      className="w-3/4 mt-1 text-base leading-6 text-blue-700 sm:col-span-1 sm:mt-0 rounded-md border-blue-400 focus:ring-blue-500"
                      onChange={handleChangeMantenimiento}
                      name="5.1"
                      value={mantenimientoValues["5.1"]}
                    />
                  </dd>
                </div>

                <div className="px-4 py-6 sm:grid sm:grid-cols-6 sm:gap-4 sm:px-0 border-t border-blue-200">
                  <dd className="text-base font-medium leading-6 text-black-700 col-span-1">
                    5.2
                  </dd>
                  <dd className="mt-1 text-base leading-6 text-black-700 sm:col-span-1 sm:mt-0">
                    Cambiabilidad
                  </dd>
                  <dd className="mt-1 text-base leading-6 text-black-700 sm:col-span-3 sm:mt-0">
                    La capacidad del software para permitir que una determinada modificación sea implementada. Implementación incluye 
                    codificación, diseño y documentación de cambios. Si el software va a ser modificado por el usuario final,
                    la cambiabilidad podría afectar la operabilidad.

                  </dd>
                  <dd className="mt-1 text-base leading-6 text-blue-700 sm:col-span-1 sm:mt-0">
                    <input
                      required
                      min={1}
                      max={3}
                      type="number"
                      className="w-3/4 mt-1 text-base leading-6 text-blue-700 sm:col-span-1 sm:mt-0 rounded-md border-blue-400 focus:ring-blue-500"
                      onChange={handleChangeMantenimiento}
                      name="5.2"
                      value={mantenimientoValues["5.2"]}
                    />
                  </dd>
                </div>

                <div className="px-4 py-6 sm:grid sm:grid-cols-6 sm:gap-4 sm:px-0 border-t border-blue-200">
                  <dd className="text-base font-medium leading-6 text-black-700 col-span-1">
                    5.3
                  </dd>
                  <dd className="mt-1 text-base leading-6 text-black-700 sm:col-span-1 sm:mt-0">
                    Estabilidad
                  </dd>
                  <dd className="mt-1 text-base leading-6 text-black-700 sm:col-span-3 sm:mt-0">
                    La capacidad del software para evitar efectos inesperados debido
                    a modificaciones del software
                  </dd>
                  <dd className="mt-1 text-base leading-6 text-blue-700 sm:col-span-1 sm:mt-0">
                    <input
                      required
                      min={1}
                      max={3}
                      type="number"
                      className="w-3/4 mt-1 text-base leading-6 text-blue-700 sm:col-span-1 sm:mt-0 rounded-md border-blue-400 focus:ring-blue-500"
                      onChange={handleChangeMantenimiento}
                      name="5.3"
                      value={mantenimientoValues["5.3"]}
                    />
                  </dd>
                </div>

                <div className="px-4 py-6 sm:grid sm:grid-cols-6 sm:gap-4 sm:px-0 border-t border-blue-200">
                  <dd className="text-base font-medium leading-6 text-black-700 col-span-1">
                    5.4
                  </dd>
                  <dd className="mt-1 text-base leading-6 text-black-700 sm:col-span-1 sm:mt-0">
                    Facilidad de prueba
                  </dd>
                  <dd className="mt-1 text-base leading-6 text-black-700 sm:col-span-3 sm:mt-0">
                    La capacidad del software para permitir que las modificaciones sean validadas.
                  </dd>
                  <dd className="mt-1 text-base leading-6 text-blue-700 sm:col-span-1 sm:mt-0">
                    <input
                      required
                      min={1}
                      max={3}
                      type="number"
                      className="w-3/4 mt-1 text-base leading-6 text-blue-700 sm:col-span-1 sm:mt-0 rounded-md border-blue-400 focus:ring-blue-500"
                      onChange={handleChangeMantenimiento}
                      name="5.4"
                      value={mantenimientoValues["5.4"]}
                    />
                  </dd>
                </div>

                <div className="px-4 py-6 sm:grid sm:grid-cols-6 sm:gap-4 sm:px-0 border-t border-blue-200">
                  <dd className="text-base font-medium leading-6 text-black-700 col-span-1">
                    5.5
                  </dd>
                  <dd className="mt-1 text-base leading-6 text-black-700 sm:col-span-1 sm:mt-0">
                    Conformidad de facilidad de mantenimiento
                  </dd>
                  <dd className="mt-1 text-base leading-6 text-black-700 sm:col-span-3 sm:mt-0">
                    La capacidad del software para adherirse a estandares o convenciones relativas a la 
                    facilidad de mantenimiento.
                  </dd>
                  <dd className="mt-1 text-base leading-6 text-blue-700 sm:col-span-1 sm:mt-0">
                    <input
                      required
                      min={1}
                      max={3}
                      type="number"
                      className="w-3/4 mt-1 text-base leading-6 text-blue-700 sm:col-span-1 sm:mt-0 rounded-md border-blue-400 focus:ring-blue-500"
                      onChange={handleChangeMantenimiento}
                      name="5.5"
                      value={mantenimientoValues["5.5"]}
                    />
                  </dd>
                </div>

                <div className="px-4 py-4 sm:grid sm:grid-cols-8 sm:gap-4 sm:px-0">
                  <dd className="ml-auto text-lg font-medium leading-6 text-blue-900 col-span-3 block">
                    Porcentaje
                  </dd>
                  <dd className="text-lg font-medium leading-6 text-blue-900 col-span-1 block">
                    {calculatePercentageUsabilidad3(mantenimientoValues)}%
                  </dd>
                  <dd className="ml-auto text-lg font-medium leading-6 text-blue-900 col-span-3 block">
                    Total
                  </dd>
                  <dd className="text-lg font-medium leading-6 text-blue-900 col-span-1 block">
                    {calculateTotalPoints(mantenimientoValues)}
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          {/*__________________________Portabilidad__________*/}
          <div
            className={`px-6 sm:px-8 md:px-12 lg:px-16 relative overflow-hidden rounded-xl shadow-xl transition-all duration-500 ease-in-out transform ${
              isPopoverOpen ? "mt-0 scale-100" : "mt-10 scale-95"
            }`}
          >
            <h3 className="mt-0 mr-0 text-3xl font-bold text-white text-center bg-blue-900 px-8 py-2 rounded-lg">
              6. PORTABILIDAD
            </h3>
            <p className="mt-4 max-w text-lg leading-7 text-gray-600 text-center">
            Capacidad del software para ser transferido de un entorno a otro sin problemas importantes.
            </p>

            <div className="mt-6 ml-0 w-5/5 grid grid-cols-1 gap-x-8 gap-y-6">
              <dl className="w-auto divide-y divide-blue-200">
                <div className="px-4 py-4 sm:grid sm:grid-cols-6 sm:gap-4 sm:px-0">
                  <dd className="text-lg font-bold leading-6 text-blue-800 col-span-1 block">
                    Código
                  </dd>
                  <dd className="text-lg font-bold leading-6 text-blue-800 col-span-1 block">
                    Item
                  </dd>
                  <dd className="text-lg font-bold leading-6 text-blue-800 col-span-3 block">
                    Descripción
                  </dd>
                  <dd className="text-lg font-bold leading-6 text-blue-800 col-span-1 block">
                    Valor
                  </dd>
                </div>

                <div className="px-4 py-6 sm:grid sm:grid-cols-6 sm:gap-4 sm:px-0 border-t border-blue-200">
                  <dd className="text-base font-medium leading-6 text-black-700 col-span-1">
                    6.1
                  </dd>
                  <dd className="mt-1 text-base leading-6 text-black-700 sm:col-span-1 sm:mt-0">
                    Adaptabilidad
                  </dd>
                  <dd className="mt-1 text-base leading-6 text-black-700 sm:col-span-3 sm:mt-0">
                    La capacidad del software para adaptarse a diferentes entornos especificados sin 
                    aplicar acciones o medios diferentes de los previstos para el propósito del software
                    considerado. Adaptabilidad incluye la escalabilidad de capacidad interna (Ejemplo: 
                    Campos en pantalla, tablas, volúmenes de transacciones, formatos de reporte, etc.).
                    Si el software va a ser adaptado por el usuario final, la adaptabilidad corresponde
                    a la conveniencia de la individualización y podría afectar la operatibilidad.
                  </dd>
                  <dd className="mt-1 text-base leading-6 text-blue-700 sm:col-span-1 sm:mt-0">
                    <input
                      required
                      min={1}
                      max={3}
                      type="number"
                      className="w-3/4 mt-1 text-base leading-6 text-blue-700 sm:col-span-1 sm:mt-0 rounded-md border-blue-400 focus:ring-blue-500"
                      onChange={handleChangePortabilidad}
                      name="6.1"
                      value={portabilidadValues["6.1"]}
                    />
                  </dd>
                </div>

                <div className="px-4 py-6 sm:grid sm:grid-cols-6 sm:gap-4 sm:px-0 border-t border-blue-200">
                  <dd className="text-base font-medium leading-6 text-black-700 col-span-1">
                    6.2
                  </dd>
                  <dd className="mt-1 text-base leading-6 text-black-700 sm:col-span-1 sm:mt-0">
                    Facilidad de instalación
                  </dd>
                  <dd className="mt-1 text-base leading-6 text-black-700 sm:col-span-3 sm:mt-0">
                    La capacidad del software para ser instalado en un ambiente especifico. Si el software va a
                    ser instalado por el usuario final, puede afectar la propiedad y operatividad resultantes.
                  </dd>
                  <dd className="mt-1 text-base leading-6 text-blue-700 sm:col-span-1 sm:mt-0">
                    <input
                      required
                      min={1}
                      max={3}
                      type="number"
                      className="w-3/4 mt-1 text-base leading-6 text-blue-700 sm:col-span-1 sm:mt-0 rounded-md border-blue-400 focus:ring-blue-500"
                      onChange={handleChangePortabilidad}
                      name="6.2"
                      value={portabilidadValues["6.2"]}
                    />
                  </dd>
                </div>

                <div className="px-4 py-6 sm:grid sm:grid-cols-6 sm:gap-4 sm:px-0 border-t border-blue-200">
                  <dd className="text-base font-medium leading-6 text-black-700 col-span-1">
                    6.3
                  </dd>
                  <dd className="mt-1 text-base leading-6 text-black-700 sm:col-span-1 sm:mt-0">
                    Coexistencia
                  </dd>
                  <dd className="mt-1 text-base leading-6 text-black-700 sm:col-span-3 sm:mt-0">
                    La capacidad del software para coexistir con otros productos de software independientes dentro 
                    de un mismo entorno, compartiendo recursos comunes.
                  </dd>
                  <dd className="mt-1 text-base leading-6 text-blue-700 sm:col-span-1 sm:mt-0">
                    <input
                      required
                      min={1}
                      max={3}
                      type="number"
                      className="w-3/4 mt-1 text-base leading-6 text-blue-700 sm:col-span-1 sm:mt-0 rounded-md border-blue-400 focus:ring-blue-500"
                      onChange={handleChangePortabilidad}
                      name="6.3"
                      value={portabilidadValues["6.3"]}
                    />
                  </dd>
                </div>

                <div className="px-4 py-6 sm:grid sm:grid-cols-6 sm:gap-4 sm:px-0 border-t border-blue-200">
                  <dd className="text-base font-medium leading-6 text-black-700 col-span-1">
                    6.4
                  </dd>
                  <dd className="mt-1 text-base leading-6 text-black-700 sm:col-span-1 sm:mt-0">
                    Reemplazabilidad
                  </dd>
                  <dd className="mt-1 text-base leading-6 text-black-700 sm:col-span-3 sm:mt-0">
                    La capacidad del software para ser utilizado en lugar de otro software, para el mismo
                    propósito y en el mismo entorno. Por ejemplo, la reemplazabilidad de una nueva versión
                    de un software es importante para el usuario cuando dicho software es actualizado.
                  </dd>
                  <dd className="mt-1 text-base leading-6 text-blue-700 sm:col-span-1 sm:mt-0">
                    <input
                      required
                      min={1}
                      max={3}
                      type="number"
                      className="w-3/4 mt-1 text-base leading-6 text-blue-700 sm:col-span-1 sm:mt-0 rounded-md border-blue-400 focus:ring-blue-500"
                      onChange={handleChangePortabilidad}
                      name="6.4"
                      value={portabilidadValues["6.4"]}
                    />
                  </dd>
                </div>

                <div className="px-4 py-6 sm:grid sm:grid-cols-6 sm:gap-4 sm:px-0 border-t border-blue-200">
                  <dd className="text-base font-medium leading-6 text-black-700 col-span-1">
                    6.5
                  </dd>
                  <dd className="mt-1 text-base leading-6 text-black-700 sm:col-span-1 sm:mt-0">
                    Conformidad de portabilidad
                  </dd>
                  <dd className="mt-1 text-base leading-6 text-black-700 sm:col-span-3 sm:mt-0">
                    La capacidad del software para adherirse a estandares o convenciones relacionados a la portabilidad.
                  </dd>
                  <dd className="mt-1 text-base leading-6 text-blue-700 sm:col-span-1 sm:mt-0">
                    <input
                      required
                      min={1}
                      max={3}
                      type="number"
                      className="w-3/4 mt-1 text-base leading-6 text-blue-700 sm:col-span-1 sm:mt-0 rounded-md border-blue-400 focus:ring-blue-500"
                      onChange={handleChangePortabilidad}
                      name="6.5"
                      value={portabilidadValues["6.5"]}
                    />
                  </dd>
                </div>

                <div className="px-4 py-4 sm:grid sm:grid-cols-8 sm:gap-4 sm:px-0">
                  <dd className="ml-auto text-lg font-medium leading-6 text-blue-900 col-span-3 block">
                    Porcentaje
                  </dd>
                  <dd className="text-lg font-medium leading-6 text-blue-900 col-span-1 block">
                    {calculatePercentageUsabilidad2(portabilidadValues)}%
                  </dd>
                  <dd className="ml-auto text-lg font-medium leading-6 text-blue-900 col-span-3 block">
                    Total
                  </dd>
                  <dd className="text-lg font-medium leading-6 text-blue-900 col-span-1 block">
                    {calculateTotalPoints(portabilidadValues)}
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          {/*_________________________Calidad de uso__________*/}
          <div
            className={`px-6 sm:px-8 md:px-12 lg:px-16 relative overflow-hidden rounded-xl shadow-xl transition-all duration-500 ease-in-out transform ${
              isPopoverOpen ? "mt-0 scale-100" : "mt-10 scale-95"
            }`}
          >
            <h3 className="mt-0 mr-0 text-3xl font-bold text-white text-center bg-blue-900 px-8 py-2 rounded-lg">
              7. CALIDAD DE USO
            </h3>
            <p className="mt-4 max-w text-lg leading-7 text-gray-600 text-center">
            Capacidad del software para permitirle a los usuarios lograr las metas 
            propuestas con eficacia, productividad, seguridad y satisfacción en contextos especificos de uso.
            </p>

            <div className="mt-6 ml-0 w-5/5 grid grid-cols-1 gap-x-8 gap-y-6">
              <dl className="w-auto divide-y divide-blue-200">
                <div className="px-4 py-4 sm:grid sm:grid-cols-6 sm:gap-4 sm:px-0">
                  <dd className="text-lg font-bold leading-6 text-blue-800 col-span-1 block">
                    Código
                  </dd>
                  <dd className="text-lg font-bold leading-6 text-blue-800 col-span-1 block">
                    Item
                  </dd>
                  <dd className="text-lg font-bold leading-6 text-blue-800 col-span-3 block">
                    Descripción
                  </dd>
                  <dd className="text-lg font-bold leading-6 text-blue-800 col-span-1 block">
                    Valor
                  </dd>
                </div>

                <div className="px-4 py-6 sm:grid sm:grid-cols-6 sm:gap-4 sm:px-0 border-t border-blue-200">
                  <dd className="text-base font-medium leading-6 text-black-700 col-span-1">
                    7.1
                  </dd>
                  <dd className="mt-1 text-base leading-6 text-black-700 sm:col-span-1 sm:mt-0">
                    Eficacia
                  </dd>
                  <dd className="mt-1 text-base leading-6 text-black-700 sm:col-span-3 sm:mt-0">
                    La capacidad del software para permitir a los usuarios lograr las metas
                    especificadas con exactitud e integridad, en un contexto especificado de uso.
                  </dd>
                  <dd className="mt-1 text-base leading-6 text-blue-700 sm:col-span-1 sm:mt-0">
                    <input
                      required
                      min={1}
                      max={3}
                      type="number"
                      className="w-3/4 mt-1 text-base leading-6 text-blue-700 sm:col-span-1 sm:mt-0 rounded-md border-blue-400 focus:ring-blue-500"
                      onChange={handleChangeCalidad}
                      name="7.1"
                      value={calidadValues["7.1"]}
                    />
                  </dd>
                </div>

                <div className="px-4 py-6 sm:grid sm:grid-cols-6 sm:gap-4 sm:px-0 border-t border-blue-200">
                  <dd className="text-base font-medium leading-6 text-black-700 col-span-1">
                    7.2
                  </dd>
                  <dd className="mt-1 text-base leading-6 text-black-700 sm:col-span-1 sm:mt-0">
                    Productividad
                  </dd>
                  <dd className="mt-1 text-base leading-6 text-black-700 sm:col-span-3 sm:mt-0">
                    La capacidad del software para permitir a los usuarios emplear cantidades apropiadas
                    de recursos, en relación a la eficacia lograda en un contexto especificado de uso.
                    Los recursos relevantes pueden incluir: tiempo para completar la tarea, esfuerzo de usuario, 
                    materiales o costos financieros.
                  </dd>
                  <dd className="mt-1 text-base leading-6 text-blue-700 sm:col-span-1 sm:mt-0">
                    <input
                      required
                      min={1}
                      max={3}
                      type="number"
                      className="w-3/4 mt-1 text-base leading-6 text-blue-700 sm:col-span-1 sm:mt-0 rounded-md border-blue-400 focus:ring-blue-500"
                      onChange={handleChangeCalidad}
                      name="7.2"
                      value={calidadValues["7.2"]}
                    />
                  </dd>
                </div>

                <div className="px-4 py-6 sm:grid sm:grid-cols-6 sm:gap-4 sm:px-0 border-t border-blue-200">
                  <dd className="text-base font-medium leading-6 text-black-700 col-span-1">
                    7.3
                  </dd>
                  <dd className="mt-1 text-base leading-6 text-black-700 sm:col-span-1 sm:mt-0">
                    Seguridad
                  </dd>
                  <dd className="mt-1 text-base leading-6 text-black-700 sm:col-span-3 sm:mt-0">
                    La capacidad del software para lograr niveles aceptables de riesgo de daño a las personas,
                    institución, software, propiedad (licencias, contratos de uso de software) o entorno,
                    en un contexto especifico de uso. Los riesgos son normalmente el resultado de deficiencias en la funcionalidad
                    (incluyendo seguridad), fiabilidad, usabilidad o facilidad de mantenimiento.
                  </dd>
                  <dd className="mt-1 text-base leading-6 text-blue-700 sm:col-span-1 sm:mt-0">
                    <input
                      required
                      min={1}
                      max={3}
                      type="number"
                      className="w-3/4 mt-1 text-base leading-6 text-blue-700 sm:col-span-1 sm:mt-0 rounded-md border-blue-400 focus:ring-blue-500"
                      onChange={handleChangeCalidad}
                      name="7.3"
                      value={calidadValues["7.3"]}
                    />
                  </dd>
                </div>

                <div className="px-4 py-6 sm:grid sm:grid-cols-6 sm:gap-4 sm:px-0 border-t border-blue-200">
                  <dd className="text-base font-medium leading-6 text-black-700 col-span-1">
                    7.4
                  </dd>
                  <dd className="mt-1 text-base leading-6 text-black-700 sm:col-span-1 sm:mt-0">
                    Satisfacción
                  </dd>
                  <dd className="mt-1 text-base leading-6 text-black-700 sm:col-span-3 sm:mt-0">
                    La capacidad del software para satisfacer a los usuarios en un contexto especificado de uso.
                    La satisfacción es la respuesta del usuario a la interacción con el producto, e incluye
                    las actitudes hacia el uso del producto.
                  </dd>
                  <dd className="mt-1 text-base leading-6 text-blue-700 sm:col-span-1 sm:mt-0">
                    <input
                      required
                      min={1}
                      max={3}
                      type="number"
                      className="w-3/4 mt-1 text-base leading-6 text-blue-700 sm:col-span-1 sm:mt-0 rounded-md border-blue-400 focus:ring-blue-500"
                      onChange={handleChangeCalidad}
                      name="7.4"
                      value={calidadValues["7.4"]}
                    />
                  </dd>
                </div>

                <div className="px-4 py-6 sm:grid sm:grid-cols-6 sm:gap-4 sm:px-0 border-t border-blue-200">
                  <dd className="text-base font-medium leading-6 text-black-700 col-span-1">
                    7.5
                  </dd>
                  <dd className="mt-1 text-base leading-6 text-black-700 sm:col-span-1 sm:mt-0">
                    Mercado
                  </dd>
                  <dd className="mt-1 text-base leading-6 text-black-700 sm:col-span-3 sm:mt-0">
                    El tiempo que tiene el software o proveedor en caso de que el producto sea a la medida
                    en el mercado. Menor a un año = 0, de 1 a 2 años = 1, de 2 a 3 años = 2, y de más de 3 años = 3.
                  </dd>
                  <dd className="mt-1 text-base leading-6 text-blue-700 sm:col-span-1 sm:mt-0">
                    <input
                      required
                      min={1}
                      max={3}
                      type="number"
                      className="w-3/4 mt-1 text-base leading-6 text-blue-700 sm:col-span-1 sm:mt-0 rounded-md border-blue-400 focus:ring-blue-500"
                      onChange={handleChangeCalidad}
                      name="7.5"
                      value={calidadValues["7.5"]}
                    />
                  </dd>
                </div>

                <div className="px-4 py-6 sm:grid sm:grid-cols-6 sm:gap-4 sm:px-0 border-t border-blue-200">
                  <dd className="text-base font-medium leading-6 text-black-700 col-span-1">
                    7.6
                  </dd>
                  <dd className="mt-1 text-base leading-6 text-black-700 sm:col-span-1 sm:mt-0">
                    Estandarización
                  </dd>
                  <dd className="mt-1 text-base leading-6 text-black-700 sm:col-span-3 sm:mt-0">
                    Número de instalaciones en diferentes empresas locales, si es un producto a la medida.
                    Número de softwares instalados por el proveedor. Ninguno = 0, de 1 a 3 = 1, de 4 a 6 = 2,
                    más de 6 = 3.
                  </dd>
                  <dd className="mt-1 text-base leading-6 text-blue-700 sm:col-span-1 sm:mt-0">
                    <input
                      required
                      min={1}
                      max={3}
                      type="number"
                      className="w-3/4 mt-1 text-base leading-6 text-blue-700 sm:col-span-1 sm:mt-0 rounded-md border-blue-400 focus:ring-blue-500"
                      onChange={handleChangeCalidad}
                      name="7.6"
                      value={calidadValues["7.6"]}
                    />
                  </dd>
                </div>

                <div className="px-4 py-4 sm:grid sm:grid-cols-8 sm:gap-4 sm:px-0">
                  <dd className="ml-auto text-lg font-medium leading-6 text-blue-900 col-span-3 block">
                    Porcentaje
                  </dd>
                  <dd className="text-lg font-medium leading-6 text-blue-900 col-span-1 block">
                    {calculatePercentageCalidad(calidadValues)}%
                  </dd>
                  <dd className="ml-auto text-lg font-medium leading-6 text-blue-900 col-span-3 block">
                    Total
                  </dd>
                  <dd className="text-lg font-medium leading-6 text-blue-900 col-span-1 block">
                    {calculateTotalPoints(calidadValues)}
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Mostrar Total Puntaje y Porcentaje */}
          <div className="mr-8 flex items-center bg-gray-100 rounded-lg p-4 shadow-md">
            <p className="text-sm font-semibold text-gray-700">
              Total puntaje: {totalPoints} de 99
            </p>
            <span className="mx-2">|</span>
            <p className="text-sm font-semibold text-gray-700">
              Total porcentaje: {totalPorcentaje}%
            </p>
          </div>

        </div>
      </div>


      <div className="mt-10 mb-10 mr-0 flex justify-end">
            <div className="flex items-center ml-auto">
              {respuestaBackend && (
                <div
                  className={`mr-4 text-center text-sm ${
                    respuestaBackend.tipo === "error"
                      ? "text-rose-600"
                      : "text-green-600"
                  }`}
                >
                  {respuestaBackend.mensaje}
                </div>
              )}
              <button
                onClick={() => {
                  calcularTotalPorcentaje();
                  descargarPDF();
                }}
                type="submit"
                className="block ml-auto rounded-full bg-blue-800 px-20 py-3 text-center text-lg font-semibold text-white shadow-md hover:bg-blue-900 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 transition-all duration-300 ease-in-out transform hover:-translate-y-0.5 active:translate-y-0"
              >
                Guardar y Descargar PDF
              </button>

              {/* Botón para descargar el PDF */}
              {/* <button
                className="block ml-auto rounded-full bg-red-800 ml-8 px-20 py-3 text-center text-lg font-semibold text-white shadow-md hover:bg-blue-900 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 transition-all duration-300 ease-in-out transform hover:-translate-y-0.5 active:translate-y-0"
                onClick={descargarPDF}
              >
                Descargar PDF
              </button> */}

            </div>
          </div>
      <Footer />
    </div>
  );
};
