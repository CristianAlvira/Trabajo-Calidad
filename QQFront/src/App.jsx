import { Login } from "./components/Login.jsx";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Home } from "./components/Home.jsx";
import { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { Register } from "./components/Register.jsx";
import { ConfirmAccount } from "./components/ConfirmAccount.jsx";
import { OlvidePassword } from "./components/OlvidePassword.jsx";
import { NuevoPassword } from "./components/NuevoPassword.jsx";
import { UsuarioInfo } from "./components/UsuarioInfo.jsx";
import { Evaluacion } from "./components/Evaluacion.jsx";
import axios from "axios";
import { NuevaEvaluacion } from "./components/NuevaEvaluacion.jsx";
import { AjusteParametros } from "./components/AjusteParametros.jsx";
import { AjusteParametros2 } from "./components/AjusteParametros2.jsx";
import { AjusteParametros3 } from "./components/AjusteParametros3.jsx";
import { AjusteParametros4 } from "./components/AjusteParametros4.jsx";
import { MatrizInicio } from "./components/MatrizInicio.jsx";
import { Reportes } from "./components/Reportes.jsx";

function App() {
  const [loggedInUser, setLoggedInUser] = useState(null);

  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const handlePopoverOpen = () => {
    setIsPopoverOpen(true);
  };

  const handlePopoverClose = () => {
    setIsPopoverOpen(false);
  };

  useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: "ease-in-out",
      once: false,
    });
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      const fetchUserData = async () => {
        try {
          const response = await axios.get("https://trabajo-calidad.vercel.app/api/usuarios/perfil", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          const { data } = response;
          setLoggedInUser(data);
          console.log("Usuario logueado App.jsx: ", data); // Agregar este console.log
        } catch (error) {
          console.log(error);
        }
      };

      fetchUserData();
    } else {
      console.log("No hay usuario logueado");
    }
  }, []);

  return (
    <Router>
      <div>
        <Routes>
          <Route
            path="/"
            element={
              <Home
                isPopoverOpen={isPopoverOpen}
                handlePopoverOpen={handlePopoverOpen}
                handlePopoverClose={handlePopoverClose}
                loggedInUser={loggedInUser}
                setLoggedInUser={setLoggedInUser}
              />
            }
          />
          <Route
            path="/login"
            element={
              loggedInUser ? (
                <Home
                  isPopoverOpen={isPopoverOpen}
                  handlePopoverOpen={handlePopoverOpen}
                  handlePopoverClose={handlePopoverClose}
                  loggedInUser={loggedInUser}
                  setLoggedInUser={setLoggedInUser}
                />
              ) : (
                <>
                  <Login loggedInUser={loggedInUser} setLoggedInUser={setLoggedInUser} />
                </>
              )
            }
          />

          <Route path="/create-account" element={<Register />} />
          <Route path="/confirm-account" element={<ConfirmAccount />} />
          <Route path="/olvide-password" element={<OlvidePassword />} />
          <Route path="/nuevoPassword" element={<NuevoPassword />} />
          <Route
            path="/evaluacion"
            element={
              loggedInUser ? (
                <>
                  <Evaluacion
                    isPopoverOpen={isPopoverOpen}
                    handlePopoverOpen={handlePopoverOpen}
                    handlePopoverClose={handlePopoverClose}
                    loggedInUser={loggedInUser}
                    setLoggedInUser={setLoggedInUser}
                  />
                </>
              ) : (
                <>
                  <Login loggedInUser={loggedInUser} setLoggedInUser={setLoggedInUser} />
                </>
              )
            }
          />
          
          <Route
            path="/nuevaEvaluacion"
            element={
              loggedInUser ? (
                <>
                  <NuevaEvaluacion
                    isPopoverOpen={isPopoverOpen}
                    handlePopoverOpen={handlePopoverOpen}
                    handlePopoverClose={handlePopoverClose}
                    loggedInUser={loggedInUser}
                    setLoggedInUser={setLoggedInUser}
                  />
                </>
              ) : (
                <>
                  <Login loggedInUser={loggedInUser} setLoggedInUser={setLoggedInUser} />
                </>
              )
            }
          />
          <Route
            path="/ajusteParametros/:id"
            element={
              loggedInUser ? (
                <>
                  <AjusteParametros
                    isPopoverOpen={isPopoverOpen}
                    handlePopoverOpen={handlePopoverOpen}
                    handlePopoverClose={handlePopoverClose}
                    loggedInUser={loggedInUser}
                    setLoggedInUser={setLoggedInUser}
                  />
                </>
              ) : (
                <>
                  <Login loggedInUser={loggedInUser} setLoggedInUser={setLoggedInUser} />
                </>
              )
            }
          />
          <Route
            path="/ajusteParametros2/:id"
            element={
              loggedInUser ? (
                <>
                  <AjusteParametros2
                    isPopoverOpen={isPopoverOpen}
                    handlePopoverOpen={handlePopoverOpen}
                    handlePopoverClose={handlePopoverClose}
                    loggedInUser={loggedInUser}
                    setLoggedInUser={setLoggedInUser}
                  />
                </>
              ) : (
                <>
                  <Login loggedInUser={loggedInUser} setLoggedInUser={setLoggedInUser} />
                </>
              )
            }
          />
          <Route
            path="/ajusteParametros3/:id"
            element={
              loggedInUser ? (
                <>
                  <AjusteParametros3
                    isPopoverOpen={isPopoverOpen}
                    handlePopoverOpen={handlePopoverOpen}
                    handlePopoverClose={handlePopoverClose}
                    loggedInUser={loggedInUser}
                    setLoggedInUser={setLoggedInUser}
                  />
                </>
              ) : (
                <>
                  <Login loggedInUser={loggedInUser} setLoggedInUser={setLoggedInUser} />
                </>
              )
            }
          />
          <Route
            path="/ajusteParametros4/:id"
            element={
              loggedInUser ? (
                <>
                  <AjusteParametros4
                    isPopoverOpen={isPopoverOpen}
                    handlePopoverOpen={handlePopoverOpen}
                    handlePopoverClose={handlePopoverClose}
                    loggedInUser={loggedInUser}
                    setLoggedInUser={setLoggedInUser}
                  />
                </>
              ) : (
                <>
                  <Login loggedInUser={loggedInUser} setLoggedInUser={setLoggedInUser} />
                </>
              )
            }
          />

<Route
            path="/matriz"
            element={
              loggedInUser ? (
                <>
                  <MatrizInicio
                    isPopoverOpen={isPopoverOpen}
                    handlePopoverOpen={handlePopoverOpen}
                    handlePopoverClose={handlePopoverClose}
                    loggedInUser={loggedInUser}
                    setLoggedInUser={setLoggedInUser}
                  />
                </>
              ) : (
                <>
                  <Login loggedInUser={loggedInUser} setLoggedInUser={setLoggedInUser} />
                </>
              )
            }
          />
          <Route
            path="/reportes"
            element={
              loggedInUser ? (
                <>
                  <Reportes
                    isPopoverOpen={isPopoverOpen}
                    handlePopoverOpen={handlePopoverOpen}
                    handlePopoverClose={handlePopoverClose}
                    loggedInUser={loggedInUser}
                    setLoggedInUser={setLoggedInUser}
                  />
                </>
              ) : (
                <>
                  <Login loggedInUser={loggedInUser} setLoggedInUser={setLoggedInUser} />
                </>
              )
            }
          />

          {loggedInUser ? (
            <>
              <Route
                path="/usuarioInfo"
                element={
                  <UsuarioInfo
                    isPopoverOpen={isPopoverOpen}
                    handlePopoverOpen={handlePopoverOpen}
                    handlePopoverClose={handlePopoverClose}
                    loggedInUser={loggedInUser}
                    setLoggedInUser={setLoggedInUser}
                  />
                }
              />
            </>
          ) : (
            <>
              <Route
                path="/login"
                element={<Login loggedInUser={loggedInUser} setLoggedInUser={setLoggedInUser} />}
              />
            </>
          )}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
