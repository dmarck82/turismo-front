import axios from "axios";
import React from "react";
import { Button, Table, Modal } from "react-bootstrap";

class Passeio extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            id: 0,
            destino: '',
            itinerario: '',
            preco: '',
            modalAberta: false,
            mostrarTabela: true,
            passeios: []
        };

        this.deletarPasseio = this.deletarPasseio.bind(this);
        this.buscarPasseios = this.buscarPasseios.bind(this);
        this.cadastrarPasseio = this.cadastrarPasseio.bind(this);
        this.atualizarDestino = this.atualizarDestino.bind(this);
        this.atualizarItinerario = this.atualizarItinerario.bind(this);
        this.atualizarPreco = this.atualizarPreco.bind(this);
        this.submit = this.submit.bind(this);
        this.fecharModal = this.fecharModal.bind(this);
        this.abrirModal = this.abrirModal.bind(this);

        this.token = localStorage.getItem("token");
    }

    componentDidMount() {
        this.buscarPasseios();
    }

    componentWillUnmount() {}

    buscarPasseios = () => {
        axios.get('http://localhost:8080/passeio', { headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.token } })
            .then(res => this.setState({ passeios: res.data }));
    }

    buscarPasseio = (id) => {
        axios.get(`http://localhost:8080/passeio/${id}`)
            .then(response => {
                const data = response.data;
                this.setState({
                    id: data.id,
                    destino: data.destino,
                    itinerario: data.itinerario,
                    preco: data.preco
                });
            })
            .catch(error => {
                console.error('Erro na requisição:', error);
            });
    };

    cadastrarPasseio = (passeio) => {
        axios.post('http://localhost:8080/passeio', passeio, {
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.token }
        })
            .then(resposta => {
                if (resposta.status >= 200 && resposta.status < 300) {
                    this.buscarPasseios();
                } else {
                    alert('Não foi possível adicionar o passeio!');
                }
            })
            .catch(erro => {
                console.error('Erro ao cadastrar passeio:', erro);
                alert('Erro ao cadastrar o passeio. Verifique o console para mais detalhes.');
            });
    }

    carregarDados = (id) => {
        axios.get(`http://localhost:8080/passeio/${id}`, {
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.token }
        })
            .then(resposta => {
                const passeio = resposta.data;
                this.setState({
                    id: passeio.id,
                    destino: passeio.destino,
                    itinerario: passeio.itinerario,
                    preco: passeio.preco
                });
                this.abrirModal();
            })
            .catch(error => {
                console.error("Erro na requisição:", error);
            });
    }

    atualizarPasseio = (passeio) => {
        axios.put(`http://localhost:8080/passeio/${passeio.id}`, passeio, {
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.token }
        })
            .then(resposta => {
                if (resposta.status >= 200 && resposta.status < 300) {
                    this.buscarPasseios();
                } else {
                    alert('Não foi possível atualizar o passeio!');
                }
            })
            .catch(error => {
                console.error("Erro na requisição:", error);
                alert('Erro na requisição. Verifique o console para mais detalhes.');
            });
    }

    deletarPasseio = (id) => {
        axios.delete(`http://localhost:8080/passeio/${id}`, {
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.token }
        })
            .then(resposta => {
                if (resposta.status >= 200 && resposta.status < 300) {
                    this.buscarPasseios();
                } else {
                    alert('Passeio não foi excluído');
                }
            })
            .catch(error => {
                console.error("Erro na requisição:", error);
                alert('Erro na requisição. Verifique o console para mais detalhes.');
            });
    }

    renderTabela = () => {
        const listaPasseios = this.state.passeios.map((passeio) =>
        <tr key={passeio.id}>
                <td>{passeio.destino}</td>
                <td>{passeio.itinerario}</td>
                <td>{passeio.preco}</td>
                <td>
                    <div>
                        <Button variant="link" onClick={() => this.abrirModalAtualizar(passeio.id)}>Atualizar</Button>
                        <Button variant="link" onClick={() => this.deletarPasseio(passeio.id)}>Excluir</Button>
                    </div>
                </td>
            </tr>
        )

        return (
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Destino</th>
                        <th>Itinerário</th>
                        <th>Preço</th>
                        <th>Opções</th>
                    </tr>
                </thead>
                <tbody>
                    {listaPasseios}
                </tbody>
            </Table>
        );
    }

    fecharModal = () => {
        this.setState({
            modalAberta: false,
            id: 0,
            destino: "",
            itinerario: "",
            preco: ""
        })
    }

    abrirModal = () => {
        this.setState({
            modalAberta: true
        })
    }

    abrirModalAtualizar(id) {
        this.setState({
            id: id,
            modalAberta: true
        });

        this.buscarPasseio(id);
    }

    renderForm = () => {
        return (
            <Modal show={this.state.modalAberta} onHide={this.fecharModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Preencha os dados do passeio</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <form id="cadastro">
                        <div className="mb-3">
                            <label className="form-label">Destino</label>
                            <input type="text" className="form-control" value={this.state.destino} onChange={this.atualizarDestino}></input>
                            <br />
                            <label className="form-label">Itinerário</label>
                            <input type="text" className="form-control" value={this.state.itinerario} onChange={this.atualizarItinerario}></input>
                            <br />
                            <label className="form-label">Preço</label>
                            <input type="text" className="form-control" value={this.state.preco} onChange={this.atualizarPreco}></input>
                        </div>
                    </form>
                </Modal.Body>

                <Modal.Footer>
                    <Button form="cadastro" variant="primary" onClick={this.submit}>Confirmar</Button>
                    <Button variant="secondary" onClick={this.fecharModal}>Cancelar</Button>
                </Modal.Footer>
            </Modal>
        );
    }

    atualizarDestino = (e) => {
        this.setState({
            destino: e.target.value
        })
    }

    atualizarItinerario = (e) => {
        this.setState({
            itinerario: e.target.value
        })
    }

    atualizarPreco = (e) => {
        this.setState({
            preco: e.target.value
        })
    }

    submit = () => {
        const passeio = {
            id: this.state.id,
            destino: this.state.destino,
            itinerario: this.state.itinerario,
            preco: this.state.preco
        }

        if (this.state.id === 0) {
            this.cadastrarPasseio(passeio);
        } else {
            this.atualizarPasseio(passeio);
        }
        this.fecharModal();

        console.log(passeio)
    }

    mostraTabela = () => {
        this.setState({
            mostrarTabela: true
        })
    }

    mostraLista = () => {
        this.setState(
            { mostrarTabela: false }
        )
    }

    render = () => {
        return (
            <div className="tabelaPasseios">
                <Button className="bt" variant="primary" onClick={this.abrirModal}>Adicionar passeio</Button>
                <br />
                <br />
                {this.renderForm()}
                {this.renderTabela()}
            </div>
        );
    }
}

export default Passeio;
