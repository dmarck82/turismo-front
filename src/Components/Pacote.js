import axios from "axios";
import React from "react";
import { Button, Table, Modal } from "react-bootstrap";

class Pacote extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            id: 0,
            nome: '',
            preco: '',
            passeios: [],
            modalAberta: false,
            mostrarTabela: true,
            pacotes: [],
            todosPasseios: [] // Adicionando o estado para armazenar todos os passeios
        };

        this.deletarPacote = this.deletarPacote.bind(this);
        this.buscarPacotes = this.buscarPacotes.bind(this);
        this.cadastrarPacote = this.cadastrarPacote.bind(this);
        this.atualizarNome = this.atualizarNome.bind(this);
        this.atualizarPreco = this.atualizarPreco.bind(this);
        this.submit = this.submit.bind(this);
        this.fecharModal = this.fecharModal.bind(this);
        this.abrirModal = this.abrirModal.bind(this);

        this.token = localStorage.getItem("token");
    }

    componentDidMount() {
        this.buscarPacotes();
        this.buscarTodosPasseios(); // Adicionando chamada para buscar todos os passeios
    }

    componentWillUnmount() {}

    buscarPacotes = () => {
        axios.get('http://localhost:8080/pacote', { headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.token } })
            .then(res => this.setState({ pacotes: res.data }));
    }

    buscarPacote = (id) => {
        axios.get(`http://localhost:8080/pacote/${id}`)
            .then(response => {
                const data = response.data;
                this.setState({
                    id: data.id,
                    nome: data.nome,
                    preco: data.preco,
                    passeios: data.passeios
                });
            })
            .catch(error => {
                console.error('Erro na requisição:', error);
            });
    };

    cadastrarPacote = (pacote) => {
        console.log("Inserir pacote: ");
        console.log(pacote);
        axios.post('http://localhost:8080/pacote', pacote, {
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.token }
        })
            .then(resposta => {
                if (resposta.status >= 200 && resposta.status < 300) {
                    this.buscarPacotes();
                } else {
                    alert('Não foi possível adicionar o pacote!');
                }
            })
            .catch(erro => {
                console.error('Erro ao cadastrar pacote:', erro);
                console.log(erro); 
                alert('Erro ao cadastrar o pacote. Verifique o console para mais detalhes.');
            });
    }

    buscarTodosPasseios = () => {
        axios.get('http://localhost:8080/passeio')
            .then(res => this.setState({ todosPasseios: res.data }))
            .catch(error => console.error('Erro ao buscar todos os passeios:', error));
    };

    carregarDados = (id) => {
        axios.get(`http://localhost:8080/pacote/${id}`, {
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.token }
        })
            .then(resposta => {
                const pacote = resposta.data;
                this.setState({
                    id: pacote.id,
                    nome: pacote.nome,
                    preco: pacote.preco,
                    passeios: pacote.passeios
                });
                this.abrirModal();
            })
            .catch(error => {
                console.error("Erro na requisição:", error);
            });
    }

    atualizarPacote = (pacote) => {
        axios.put(`http://localhost:8080/pacote/${pacote.id}`, pacote, {
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.token }
        })
            .then(resposta => {
                if (resposta.status >= 200 && resposta.status < 300) {
                    this.buscarPacotes();
                } else {
                    alert('Não foi possível atualizar o pacote!');
                }
            })
            .catch(error => {
                console.error("Erro na requisição:", error);
                alert('Erro na requisição. Verifique o console para mais detalhes.');
            });
    }

    deletarPacote = (id) => {
        axios.delete(`http://localhost:8080/pacote/${id}`, {
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.token }
        })
            .then(resposta => {
                if (resposta.status >= 200 && resposta.status < 300) {
                    this.buscarPacotes();
                } else {
                    alert('Pacote não foi excluído');
                }
            })
            .catch(error => {
                console.error("Erro na requisição:", error);
                alert('Erro na requisição. Verifique o console para mais detalhes.');
            });
    }

    renderTabela = () => {
        const listaPacotes = this.state.pacotes.map((pacote) =>
            <tr key={pacote.id}>
                <td>{pacote.nome}</td>
                <td>{pacote.preco}</td>
                <td>
                    <div>
                        <Button variant="link" onClick={() => this.abrirModalAtualizar(pacote.id)}>Atualizar</Button>
                        <Button variant="link" onClick={() => this.deletarPacote(pacote.id)}>Excluir</Button>
                    </div>
                </td>
            </tr>
        )

        return (
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Preço</th>
                        <th>Opções</th>
                    </tr>
                </thead>
                <tbody>
                    {listaPacotes}
                </tbody>
            </Table>
        );
    }

    fecharModal = () => {
        this.setState({
            modalAberta: false,
            id: 0,
            nome: "",
            preco: "",
            passeios: []
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

        this.buscarPacote(id);
    }

    renderForm = () => {
        const listaPasseios = this.state.todosPasseios.map((passeio) => (
            <option key={passeio.id} value={passeio.id}>{passeio.destino}</option>
        ));

        return (
            <Modal show={this.state.modalAberta} onHide={this.fecharModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Preencha os dados do pacote</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <form id="cadastro">
                        <div className="mb-3">
                            <label className="form-label">Nome</label>
                            <input type="text" className="form-control" value={this.state.nome} onChange={this.atualizarNome}></input>
                            <br />
                            <label className="form-label">Preço</label>
                            <input type="text" className="form-control" value={this.state.preco} onChange={this.atualizarPreco}></input>
                            <br />
                            <label className="form-label">Selecione os Passeios</label>
                            <select
                                className="form-select"
                                multiple
                                value={this.state.passeios}
                                onChange={(e) => this.setState({ passeios: Array.from(e.target.selectedOptions, (item) => item.value) })}
                            >
                                {listaPasseios}
                            </select>
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

    atualizarNome = (e) => {
        this.setState({
            nome: e.target.value
        })
    }

    atualizarPreco = (e) => {
        this.setState({
            preco: e.target.value
        })
    }

    submit = () => {
        const pacote = {
            id: this.state.id,
            nome: this.state.nome,
            preco: this.state.preco,
            passeios: this.state.passeios
        }

        if (this.state.id === 0) {
            this.cadastrarPacote(pacote);
        } else {
            this.atualizarPacote(pacote);
        }
        this.fecharModal();
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
            <div className="tabelaPacotes">
                <Button className="bt" variant="primary" onClick={this.abrirModal}>Adicionar pacote</Button>
                <br />
                <br />
                {this.renderForm()}
                {this.renderTabela()}
            </div>
        );
    }
}

export default Pacote;
