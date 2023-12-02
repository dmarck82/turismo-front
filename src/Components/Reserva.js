import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Table, Modal, Form } from "react-bootstrap";

const Reserva = () => {
  const [id, setId] = useState(0);
  const [pacoteId, setPacoteId] = useState("");
  const [pacotes, setPacotes] = useState([]);
  const [pessoa, setPessoa] = useState("");
  const [data, setData] = useState("");
  const [modalAberta, setModalAberta] = useState(false);
  const [mostrarTabela, setMostrarTabela] = useState(true);
  const [reservas, setReservas] = useState([]);

  const token = localStorage.getItem("token");

  useEffect(() => {
    buscarReservas();
    buscarPacotes();
  }, []);

  const buscarReservas = () => {
    axios
      .get("http://localhost:8080/reserva", {
        headers: { "Content-Type": "application/json", Authorization: "Bearer " + token },
      })
      .then((res) => setReservas(res.data));
  };

  const buscarPacotes = () => {
    axios
      .get("http://localhost:8080/pacote", {
        headers: { "Content-Type": "application/json", Authorization: "Bearer " + token },
      })
      .then((res) => setPacotes(res.data));
  };

  const buscarReserva = (id) => {
    axios
      .get(`http://localhost:8080/reserva/${id}`)
      .then((response) => {
        const data = response.data;
        setId(data.id);
        setPacoteId(data.pacote.id);
        setPessoa(data.pessoa);
        setData(data.data);
      })
      .catch((error) => console.error("Erro na requisição:", error));
  };

  const cadastrarReserva = (reserva) => {
    axios
      .post("http://localhost:8080/reserva", reserva, {
        headers: { "Content-Type": "application/json", Authorization: "Bearer " + token },
      })
      .then((resposta) => {
        if (resposta.status >= 200 && resposta.status < 300) {
          buscarReservas();
        } else {
          alert("Não foi possível adicionar a reserva!");
        }
      })
      .catch((erro) => {
        console.error("Erro ao cadastrar reserva:", erro);
        alert("Erro ao cadastrar a reserva. Verifique o console para mais detalhes.");
      });
  };

  const carregarDados = (id) => {
    buscarReserva(id);
    abrirModal();
  };

  const atualizarReserva = (reserva) => {
    axios
      .put(`http://localhost:8080/reserva/${reserva.id}`, reserva, {
        headers: { "Content-Type": "application/json", Authorization: "Bearer " + token },
      })
      .then((resposta) => {
        if (resposta.status >= 200 && resposta.status < 300) {
          buscarReservas();
        } else {
          alert("Não foi possível atualizar a reserva!");
        }
      })
      .catch((error) => {
        console.error("Erro na requisição:", error);
        alert("Erro na requisição. Verifique o console para mais detalhes.");
      });
  };

  const deletarReserva = (id) => {
    axios
      .delete(`http://localhost:8080/reserva/${id}`, {
        headers: { "Content-Type": "application/json", Authorization: "Bearer " + token },
      })
      .then((resposta) => {
        if (resposta.status >= 200 && resposta.status < 300) {
          buscarReservas();
        } else {
          alert("Reserva não foi excluída");
        }
      })
      .catch((error) => {
        console.error("Erro na requisição:", error);
        alert("Erro na requisição. Verifique o console para mais detalhes.");
      });
  };

  const renderTabela = () => {
    const listaReservas = reservas.map((reserva) => (
      <tr key={reserva.id}>
        <td>{reserva.pacote.nome}</td>
        <td>{reserva.pessoa}</td>
        <td>{reserva.data}</td>
        <td>
          <div>
            <Button variant="link" onClick={() => abrirModalAtualizar(reserva.id)}>
              Atualizar
            </Button>
            <Button variant="link" onClick={() => deletarReserva(reserva.id)}>
              Excluir
            </Button>
          </div>
        </td>
      </tr>
    ));

    return (
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Pacote</th>
            <th>Pessoa</th>
            <th>Data</th>
            <th>Opções</th>
          </tr>
        </thead>
        <tbody>{listaReservas}</tbody>
      </Table>
    );
  };

  const fecharModal = () => {
    setModalAberta(false);
    setId(0);
    setPacoteId("");
    setPessoa("");
    setData("");
  };

  const abrirModal = () => {
    setModalAberta(true);
  };

  const abrirModalAtualizar = (id) => {
    setId(id);
    setModalAberta(true);
    buscarReserva(id);
  };

  const renderForm = () => {
    return (
      <Modal show={modalAberta} onHide={fecharModal}>
        <Modal.Header closeButton>
          <Modal.Title>Preencha os dados da reserva</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form id="cadastro">
            <Form.Group className="mb-3">
              <Form.Label>Pacote</Form.Label>
              <Form.Control as="select" value={pacoteId} onChange={(e) => setPacoteId(e.target.value)}>
                <option value="" disabled>
                  Selecione um pacote
                </option>
                {pacotes.map((pacote) => (
                  <option key={pacote.id} value={pacote.id}>
                    {pacote.nome}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Pessoa</Form.Label>
              <Form.Control type="text" value={pessoa} onChange={(e) => setPessoa(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Data</Form.Label>
              <Form.Control type="datetime-local" value={data} onChange={(e) => setData(e.target.value)} />
            </Form.Group>
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button form="cadastro" variant="primary" onClick={submit}>
            Confirmar
          </Button>
          <Button variant="secondary" onClick={fecharModal}>
            Cancelar
          </Button>
        </Modal.Footer>
      </Modal>
    );
  };

  const submit = () => {
    const reserva = {
      id,
      pacoteId,
      pessoa,
      data,
    };

    if (id === 0) {
      cadastrarReserva(reserva);
    } else {
      atualizarReserva(reserva);
    }
    fecharModal();

    console.log(reserva);
  };

  const mostraTabela = () => {
    setMostrarTabela(true);
  };

  const mostraLista = () => {
    setMostrarTabela(false);
  };

  return (
    <div className="tabelaReservas">
      <Button className="bt" variant="primary" onClick={abrirModal}>
        Adicionar reserva
      </Button>
      <br />
      <br />
      {renderForm()}
      {renderTabela()}
    </div>
  );
};

export default Reserva;
