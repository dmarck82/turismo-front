import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Table, Modal, Form } from "react-bootstrap";

const Pagamento = () => {
  const [id, setId] = useState(0);
  const [valor, setValor] = useState("");
  const [reservaId, setReservaId] = useState("");
  const [reservas, setReservas] = useState([]);
  const [modalAberta, setModalAberta] = useState(false);
  const [mostrarTabela, setMostrarTabela] = useState(true);
  const [pagamentos, setPagamentos] = useState([]);

  const token = localStorage.getItem("token");

  useEffect(() => {
    buscarPagamentos();
    buscarReservas();
  }, []);

  const buscarPagamentos = () => {
    axios
      .get("http://localhost:8080/pagamento", {
        headers: { "Content-Type": "application/json", Authorization: "Bearer " + token },
      })
      .then((res) => setPagamentos(res.data));
  };

  const buscarReservas = () => {
    axios
      .get("http://localhost:8080/reserva", {
        headers: { "Content-Type": "application/json", Authorization: "Bearer " + token },
      })
      .then((res) => setReservas(res.data));
  };

  const buscarPagamento = (id) => {
    axios
      .get(`http://localhost:8080/pagamento/${id}`)
      .then((response) => {
        const data = response.data;
        setId(data.id);
        setValor(data.valor);
        setReservaId(data.reserva.id);
      })
      .catch((error) => console.error("Erro na requisição:", error));
  };

  const cadastrarPagamento = (pagamento) => {
    axios
      .post("http://localhost:8080/pagamento", pagamento, {
        headers: { "Content-Type": "application/json", Authorization: "Bearer " + token },
      })
      .then((resposta) => {
        if (resposta.status >= 200 && resposta.status < 300) {
          buscarPagamentos();
        } else {
          alert("Não foi possível adicionar o pagamento!");
        }
      })
      .catch((erro) => {
        console.error("Erro ao cadastrar pagamento:", erro);
        alert("Erro ao cadastrar o pagamento. Verifique o console para mais detalhes.");
      });
  };

  const carregarDados = (id) => {
    buscarPagamento(id);
    abrirModal();
  };

  const atualizarPagamento = (pagamento) => {
    axios
      .put(`http://localhost:8080/pagamento/${pagamento.id}`, pagamento, {
        headers: { "Content-Type": "application/json", Authorization: "Bearer " + token },
      })
      .then((resposta) => {
        if (resposta.status >= 200 && resposta.status < 300) {
          buscarPagamentos();
        } else {
          alert("Não foi possível atualizar o pagamento!");
        }
      })
      .catch((error) => {
        console.error("Erro na requisição:", error);
        alert("Erro na requisição. Verifique o console para mais detalhes.");
      });
  };

  const deletarPagamento = (id) => {
    axios
      .delete(`http://localhost:8080/pagamento/${id}`, {
        headers: { "Content-Type": "application/json", Authorization: "Bearer " + token },
      })
      .then((resposta) => {
        if (resposta.status >= 200 && resposta.status < 300) {
          buscarPagamentos();
        } else {
          alert("Pagamento não foi excluído");
        }
      })
      .catch((error) => {
        console.error("Erro na requisição:", error);
        alert("Erro na requisição. Verifique o console para mais detalhes.");
      });
  };

  const renderTabela = () => {
    const listaPagamentos = pagamentos.map((pagamento) => (
      <tr key={pagamento.id}>
        <td>{pagamento.valor}</td>
        <td>{pagamento.reserva.pessoa}</td>
        <td>
          <div>
            <Button variant="link" onClick={() => abrirModalAtualizar(pagamento.id)}>
              Atualizar
            </Button>
            <Button variant="link" onClick={() => deletarPagamento(pagamento.id)}>
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
            <th>Valor</th>
            <th>Pessoa (Reserva)</th>
            <th>Opções</th>
          </tr>
        </thead>
        <tbody>{listaPagamentos}</tbody>
      </Table>
    );
  };

  const fecharModal = () => {
    setModalAberta(false);
    setId(0);
    setValor("");
    setReservaId("");
  };

  const abrirModal = () => {
    setModalAberta(true);
  };

  const abrirModalAtualizar = (id) => {
    setId(id);
    setModalAberta(true);
    buscarPagamento(id);
  };

  const renderForm = () => {
    return (
      <Modal show={modalAberta} onHide={fecharModal}>
        <Modal.Header closeButton>
          <Modal.Title>Preencha os dados do pagamento</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form id="cadastro">
            <Form.Group className="mb-3">
              <Form.Label>Valor</Form.Label>
              <Form.Control type="text" value={valor} onChange={(e) => setValor(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Reserva (Pessoa)</Form.Label>
              <Form.Control as="select" value={reservaId} onChange={(e) => setReservaId(e.target.value)}>
                <option value="" disabled>
                  Selecione uma reserva
                </option>
                {reservas.map((reserva) => (
                  <option key={reserva.id} value={reserva.id}>
                    {reserva.pessoa}
                  </option>
                ))}
              </Form.Control>
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
    const pagamento = {
      id,
      valor,
      reservaId,
    };

    if (id === 0) {
      cadastrarPagamento(pagamento);
    } else {
      atualizarPagamento(pagamento);
    }
    fecharModal();

    console.log(pagamento);
  };

  const mostraTabela = () => {
    setMostrarTabela(true);
  };

  const mostraLista = () => {
    setMostrarTabela(false);
  };

  return (
    <div className="tabelaPagamentos">
      <Button className="bt" variant="primary" onClick={abrirModal}>
        Adicionar pagamento
      </Button>
      <br />
      <br />
      {renderForm()}
      {renderTabela()}
    </div>
  );
};

export default Pagamento;
