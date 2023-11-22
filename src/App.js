import Home from './Components/Home';
import Auth from './Components/Auth';
import Pessoa from './Components/Pessoa'
import Passeio from './Components/Passeio';
import Pacote from './Components/Pacote';
import Reserva from './Components/Reserva';
import Pagamento from './Components/Pagamento';

import { BrowserRouter, Routes, Link, Route } from 'react-router-dom';
import { Nav } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';


function App() {
  return (

    <div  className="App">
      <h1>Aplicação desenvolvida para disciplina de TACs</h1>
      <BrowserRouter>
      <Nav variant="tabs">
        <Nav.Link as={Link} to="/">Página inicial</Nav.Link>
        <Nav.Link as={Link} to="/auth">Login</Nav.Link>
        <Nav.Link as={Link} to="/pessoa">Pessoa</Nav.Link>
        <Nav.Link as={Link} to="/passeio">Passeio</Nav.Link>
        <Nav.Link as={Link} to="/pacote">Pacote</Nav.Link>
        <Nav.Link as={Link} to="/reserva">Reserva</Nav.Link>
        <Nav.Link as={Link} to="/pagamento">Pagamento</Nav.Link>
      </Nav>

      <Routes>
        <Route path="/" element={<Home></Home>}></Route>
        <Route path="/auth" element={<Auth></Auth>}></Route>
        <Route path="/pessoa" element={<Pessoa></Pessoa>}></Route>
        <Route path="/passeio" element={<Passeio></Passeio>}></Route>
        <Route path="/pacote" element={<Pacote></Pacote>}></Route>
        <Route path="/reserva" element={<Reserva></Reserva>}></Route>
        <Route path="/pagamento" element={<Pagamento></Pagamento>}></Route>
      </Routes>

      </BrowserRouter>
   
      
      
    </div>
  );
}

export default App;
