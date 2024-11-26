import React, { useEffect, useState } from "react";
import { Navbar } from "./Navbar.jsx";
import { Footer } from "./Footer.jsx";
import { useLocation, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { downloadPDF } from "./utils/pdfUtils";
// import { parse } from "postcss";

export const AjusteParametros3 = ({
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
  

    const funcionalidadPoints = calculateTotalPoints(correctitudValues);
    const fiabilidadPoints = calculateTotalPoints(fiabilidadValues);
    const usabilidadPoints = calculateTotalPoints(usabilidadValues);
    const eficienciaPoints = calculateTotalPoints(eficienciaValues);
    const mantenimientoPoints = calculateTotalPoints(mantenimientoValues);
    const portabilidadPoints = calculateTotalPoints(portabilidadValues);
    // Agregar más categorías si es necesario

    // Sumar los porcentajes de todas las categorías
    const total =
      parseFloat(correctitudPercentage) * 0.20 +
      parseFloat(fiabilidadPercentage) * 0.15 +
      parseFloat(usabilidadPercentage) * 0.20 +
      parseFloat(eficienciaPercentage) * 0.15 +
      parseFloat(usabilidad3Percentage) * 0.20 +
      parseFloat(usabilidad2Percentage) * 0.10;
    // Si tienes más categorías, agrégalas aquí

    const totalPoints =
      parseFloat(funcionalidadPoints) +
      parseFloat(fiabilidadPoints) +
      parseFloat(usabilidadPoints) +
      parseFloat(eficienciaPoints) +
      parseFloat(mantenimientoPoints) +
      parseFloat(portabilidadPoints);

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

  const [correctitudValues, setCorrectitudValues] = useState({
    1.1: "",
    1.2: "",
    1.3: "",
  });

  const [fiabilidadValues, setFiabilidadValues] = useState({
    2.1: "",
    2.2: "",
    2.3: "",
  });

  const [usabilidadValues, setUsabilidadValues] = useState({
    3.1: "",
    3.2: "",
    3.3: "",
  });

  const [eficienciaValues, setEficienciaValues] = useState({
    4.1: "",
    4.2: "",
  });

  const [mantenimientoValues, setMantenimientoValues] = useState({
    5.1: "",
    5.2: "",
    5.3: "",
  });

  const [portabilidadValues, setPortabilidadValues] = useState({
    6.1: "",
    6.2: "",
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
    return ((totalPoints / 9) * 100).toFixed(2);
  };

  const calculatePercentageFiabilidad = (values) => {
    const totalPoints = calculateTotalPoints(values);
    return ((totalPoints / 9) * 100).toFixed(2);
  };

  const calculatePercentageUsabilidad = (values) => {
    const totalPoints = calculateTotalPoints(values);
    return ((totalPoints / 9) * 100).toFixed(2);
  };

  const calculatePercentageEficiencia = (values) => {
    const totalPoints = calculateTotalPoints(values);
    return ((totalPoints / 6) * 100).toFixed(2);
  };

  const calculatePercentageUsabilidad3 = (values) => {
    const totalPoints = calculateTotalPoints(values);
    return ((totalPoints / 9) * 100).toFixed(2);
  };

  const calculatePercentageUsabilidad2 = (values) => {
    const totalPoints = calculateTotalPoints(values);
    return ((totalPoints / 6) * 100).toFixed(2);
  };

  // Filtrar los parámetros por el modeloId específico
  const parametrosFiltrados = parametros.filter(
    (parametro) => parametro.modeloID === "67325d0519d4cc05793ea71d"
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
            La capacidad del software para cumplir con las funciones y satisfacer las necesidades explícitas e implícitas.
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
                    Corrección
                  </dd>
                  <dd className="mt-1 text-base leading-6 text-black-700 sm:col-span-3 sm:mt-0">
                  Grado en el que el software realiza las funciones especificadas sin errores ni defectos.
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
                    Seguridad
                  </dd>
                  <dd className="mt-1 text-base leading-6 text-black-700 sm:col-span-3 sm:mt-0">
                  Protección de los datos frente a accesos no autorizados o amenazas.
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
                  Capacidad del software para interactuar con otros sistemas y aplicaciones.
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

          {/*__________________________Usabilidad__________*/}
          <div
            className={`px-6 sm:px-8 md:px-12 lg:px-16 relative overflow-hidden rounded-xl shadow-xl transition-all duration-500 ease-in-out transform ${
              isPopoverOpen ? "mt-0 scale-100" : "mt-10 scale-95"
            }`}
          >
            <h3 className="mt-0 mr-0 text-3xl font-bold text-white text-center bg-blue-900 px-8 py-2 rounded-lg">
              2. USABILIDAD
            </h3>
            <p className="mt-4 max-w text-lg leading-7 text-gray-600 text-center">
            Capacidad del software para ser entendido, aprendido y usado en forma fácil y atractiva.
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
                    Facilidad de aprendizaje
                  </dd>
                  <dd className="mt-1 text-base leading-6 text-black-700 sm:col-span-3 sm:mt-0">
                  Rapidez con la que un usuario puede aprender a usar el software.
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
                    Documentación
                  </dd>
                  <dd className="mt-1 text-base leading-6 text-black-700 sm:col-span-3 sm:mt-0">
                  Calidad y claridad de la información proporcionada para ayudar al usuario a operar el software.
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
                    Interfaz de usuario
                  </dd>
                  <dd className="mt-1 text-base leading-6 text-black-700 sm:col-span-3 sm:mt-0">
                  Diseño visual y funcionalidad de las interfaces que facilitan la interacción del usuario.
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

          {/*__________________________Fiabilidad__________*/}
          <div
            className={`px-6 sm:px-8 md:px-12 lg:px-16 relative overflow-hidden rounded-xl shadow-xl transition-all duration-500 ease-in-out transform ${
              isPopoverOpen ? "mt-0 scale-100" : "mt-10 scale-95"
            }`}
          >
            <h3 className="mt-0 mr-0 text-3xl font-bold text-white text-center bg-blue-900 px-8 py-2 rounded-lg">
              3. FIABILIDAD
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
                    3.1
                  </dd>
                  <dd className="mt-1 text-base leading-6 text-black-700 sm:col-span-1 sm:mt-0">
                    Tolerancia a fallos
                  </dd>
                  <dd className="mt-1 text-base leading-6 text-black-700 sm:col-span-3 sm:mt-0">
                  Capacidad del software para continuar funcionando correctamente ante errores o fallos.
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
                  Disponibilidad
                  </dd>
                  <dd className="mt-1 text-base leading-6 text-black-700 sm:col-span-3 sm:mt-0">
                  Tiempo en que el software está operativo y accesible para los usuarios.
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
                  Recuperabilidad
                  </dd>
                  <dd className="mt-1 text-base leading-6 text-black-700 sm:col-span-3 sm:mt-0">
                  Habilidad para restaurar el software después de un fallo o interrupción.
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

          {/*_________________________Eficiencia__________*/}
          <div
            className={`px-6 sm:px-8 md:px-12 lg:px-16 relative overflow-hidden rounded-xl shadow-xl transition-all duration-500 ease-in-out transform ${
              isPopoverOpen ? "mt-0 scale-100" : "mt-10 scale-95"
            }`}
          >
            <h3 className="mt-0 mr-0 text-3xl font-bold text-white text-center bg-blue-900 px-8 py-2 rounded-lg">
              4. EFICIENCIA
            </h3>
            <p className="mt-4 max-w text-lg leading-7 text-gray-600 text-center">
            La forma del desempeño adecuado, de acuerdo al uso de recursos y tiempos de respuesta.
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
                    Tiempo de respuesta
                  </dd>
                  <dd className="mt-1 text-base leading-6 text-black-700 sm:col-span-3 sm:mt-0">
                  Rapidez con la que el software realiza tareas o responde a comandos.
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
                    Eficiencia de uso de recursos
                  </dd>
                  <dd className="mt-1 text-base leading-6 text-black-700 sm:col-span-3 sm:mt-0">
                  Uso óptimo de CPU, memoria, red y otros recursos del sistema.
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

          {/*_______________________Capacidad de soporte__________*/}
          <div
            className={`px-6 sm:px-8 md:px-12 lg:px-16 relative overflow-hidden rounded-xl shadow-xl transition-all duration-500 ease-in-out transform ${
              isPopoverOpen ? "mt-0 scale-100" : "mt-10 scale-95"
            }`}
          >
            <h3 className="mt-0 mr-0 text-3xl font-bold text-white text-center bg-blue-900 px-8 py-2 rounded-lg">
              5. CAPACIDAD DE SOPORTE
            </h3>
            <p className="mt-4 max-w text-lg leading-7 text-gray-600 text-center">
            La facilidad para modificar, mantener y expandir el software.
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
                    Facilidad de mantenimiento
                  </dd>
                  <dd className="mt-1 text-base leading-6 text-black-700 sm:col-span-3 sm:mt-0">
                  Facilidad para diagnosticar, corregir errores y realizar actualizaciones.
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
                    Extensibilidad
                  </dd>
                  <dd className="mt-1 text-base leading-6 text-black-700 sm:col-span-3 sm:mt-0">
                  Capacidad para agregar nuevas funcionalidades sin afectar las existentes.
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
                    Escalabilidad
                  </dd>
                  <dd className="mt-1 text-base leading-6 text-black-700 sm:col-span-3 sm:mt-0">
                  Habilidad del software para manejar un aumento en la carga o número de usuarios.
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

          {/*______________________Portabilidad__________*/}
          <div
            className={`px-6 sm:px-8 md:px-12 lg:px-16 relative overflow-hidden rounded-xl shadow-xl transition-all duration-500 ease-in-out transform ${
              isPopoverOpen ? "mt-0 scale-100" : "mt-10 scale-95"
            }`}
          >
            <h3 className="mt-0 mr-0 text-3xl font-bold text-white text-center bg-blue-900 px-8 py-2 rounded-lg">
              6. PORTABILIDAD
            </h3>
            <p className="mt-4 max-w text-lg leading-7 text-gray-600 text-center">
            Capacidad del software para ser trasladado a diferentes entornos y plataformas
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
                    Adaptabilidad a entornos
                  </dd>
                  <dd className="mt-1 text-base leading-6 text-black-700 sm:col-span-3 sm:mt-0">
                  Capacidad del software para ejecutarse en diferentes entornos sin modificaciones.
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
                    Compatibilidad con sistemas operativos
                  </dd>
                  <dd className="mt-1 text-base leading-6 text-black-700 sm:col-span-3 sm:mt-0">
                  Habilidad para ejecutarse en múltiples plataformas con diferentes sistemas operativos.
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

            {/* Mostrar Total Puntaje y Porcentaje */}
          <div className="mr-8 flex items-center bg-gray-100 rounded-lg p-4 shadow-md">
            <p className="text-sm font-semibold text-gray-700">
              Total puntaje: {totalPoints} de 48
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
