import axios from "axios";
import React from "react";
import { Button, Table, Modal } from "react-bootstrap";


class Pessoa extends React.Component{

    constructor(props){
        super(props);

        this.state={
            id: 0,
            nome : '',
            email : '',
            telefone : '',
            aniversario : '',
            identificacao : '',
            senha : '',
            modalAberta: false,
            mostrarTabela: true,
            pessoas: []
        }

        this.deletarPessoa = this.deletarPessoa.bind(this);
        this.buscarPessoas = this.buscarPessoas.bind(this);
        this.cadastrarPessoa = this.cadastrarPessoa.bind(this);
        this.atualizarNome = this.atualizarNome.bind(this);
        this.atualizarEmail = this.atualizarEmail.bind(this);
        this.atualizarTelefone = this.atualizarTelefone.bind(this);
        this.atualizarAniversario = this.atualizarAniversario.bind(this);
        this.atualizarIdentificacao = this.atualizarIdentificacao.bind(this);
        this.atualizarSenha = this.atualizarSenha.bind(this);
        this.submit = this.submit.bind(this);
        this.fecharModal = this.fecharModal.bind(this);
        this.abrirModal = this.abrirModal.bind(this);


        this.token = localStorage.getItem("token");
    }

    componentDidMount(){
        console.log("componentDidMount")
        this.buscarPessoas();
    }

    componentWillUnmount(){

    }

    buscarPessoas = () => {

        axios.get('http://localhost:8080/pessoa', {  headers: {'Content-Type':'application/json', 'Authorization': 'Bearer '+this.token}} )
        .then(res => this.setState({ pessoas : res.data }));

    }

    buscarAluno = (id) => {
        axios.get(`http://localhost:8080/pessoa/${id}`)
            .then(response => {
                const data = response.data;
                this.setState({
                    id: data.id,
                    nome: data.nome,
                    email: data.email,
                    telefone: data.telefone,
                    aniversario: data.aniversario,
                    identificacao: data.identificacao
                });
            })
            .catch(error => {
                console.error('Erro na requisição:', error);
                // Lide com o erro, se necessário
            });
    };
    
    
    


    cadastrarPessoa = (pessoa) => {
        
        axios.post('http://localhost:8080/pessoa', pessoa, {
            headers: {'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.token}
        })
        .then(resposta => {
            if (resposta.status >= 200 && resposta.status < 300) {
                this.buscarPessoas();
            } else {
                alert('Não foi possível adicionar a pessoa!');
            }
        })
        .catch(erro => {
            console.error('Erro ao cadastrar pessoa:', erro);
            alert('Erro ao cadastrar a pessoa. Verifique o console para mais detalhes.');
        });
        
    }

    carregarDados = (id) => {

        axios.get(`http://localhost:8080/pessoa/${id}`, {
            headers: {'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.token}
        })
        .then(resposta => {
            const pessoa = resposta.data;
            this.setState({
                id: pessoa.id,
                nome: pessoa.nome,
                email: pessoa.email,
                telefone: pessoa.telefone,
                aniversario: pessoa.aniversario,
                identificacao: pessoa.identificacao
            });
            this.abrirModal();
        })
        .catch(error => {
            console.error("Erro na requisição:", error);
        });

    }
    

    atualizarPessoa = (pessoa) => {

        axios.put(`http://localhost:8080/pessoa/${pessoa.id}`, pessoa, {
            headers: {'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.token}
        })
        .then(resposta => {
            if (resposta.status >= 200 && resposta.status < 300) {
                this.buscarPessoas();
            } else {
                alert('Não foi possível atualizar a pessoa!');
            }
        })
        .catch(error => {
            console.error("Erro na requisição:", error);
            alert('Erro na requisição. Verifique o console para mais detalhes.');
        });

}


    deletarPessoa = (id) => {

        axios.delete(`http://localhost:8080/pessoa/${id}`, {
            headers: {'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.token}
        })
        .then(resposta => {
            if (resposta.status >= 200 && resposta.status < 300) {
                this.buscarPessoas();
            } else {
                alert('Pessoa não foi excluída');
            }
        })
        .catch(error => {
            console.error("Erro na requisição:", error);
            alert('Erro na requisição. Verifique o console para mais detalhes.');
        });

    }



    renderTabela = () => {

        const listaPessoas = this.state.pessoas.map((pessoa) =>
            <tr>
                <td>{pessoa.nome}</td>
                <td>{pessoa.email}</td>
                <td>{pessoa.telefone}</td>
                <td>{pessoa.aniversario}</td>
                <td>{pessoa.identificacao}</td>
                <td>
                    <div>
                        <Button variant="link" onClick={() => this.abrirModalAtualizar(pessoa.id)}>Atualizar</Button>
                        <Button variant="link" onClick={() => this.deletarPessoa(pessoa.id)}>Excluir</Button>
                    </div>
                </td>
            </tr>  
        )


        return (
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Email</th>
                        <th>Telefone</th>
                        <th>Aniversário</th>
                        <th>Identificação</th>
                        <th>Opções</th>
                    </tr>
                </thead>
                <tbody>
                    {listaPessoas}
                </tbody>
            </Table>
        );
    }

    fecharModal = () => {
        this.setState({
            modalAberta: false,
            id: 0,
            nome: "",
            email: "",
            telefone : "",
            aniversario : "",
            identificacao : "",
            senha : ""
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
    
        this.buscarPessoas(id);
      }
    

    renderForm = () => {
        return(
            <Modal show={this.state.modalAberta} onHide={this.fecharModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Preencha os dados da pessoa</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <form id="cadastro">
                        <div className="mb-3">
                            <label className="form-label">Nome</label>
                            <input type="text" className="form-control" value={this.state.nome} onChange={this.atualizarNome}></input>
                            <br />
                            <label className="form-label">Email</label>
                            <input type="email" className="form-control" value={this.state.email} onChange={this.atualizarEmail}></input>
                            <br />
                            <label className="form-label">Telefone</label>
                            <input type="text" className="form-control" value={this.state.telefone} onChange={this.atualizarTelefone}></input>
                            <br />
                            <label className="form-label">Aniversário</label>
                            <input type="date" className="form-control" value={this.state.aniversario} onChange={this.atualizarAniversario}></input>
                            <br />
                            <label className="form-label">Identificacao</label>
                            <input type="text" className="form-control" value={this.state.identificacao} onChange={this.atualizarIdentificacao}></input>
                            <br />
                            <label className="form-label">Senha</label>
                            <input type="password" className="form-control" value={this.state.senha} onChange={this.atualizarSenha}></input>
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

    atualizarEmail = (e) => {
        this.setState({
            email: e.target.value
        })
    }

    atualizarTelefone = (e) => {
        this.setState({
            telefone: e.target.value
        })
    }

    atualizarAniversario = (e) => {
        this.setState({
            aniversario: e.target.value
        })
    }

    atualizarIdentificacao = (e) => {
        this.setState({
            identificacao: e.target.value
        })
    }

    atualizarSenha = (e) => {
        this.setState({
            senha: e.target.value
        })
    }

    submit = () =>{

        const pessoa = {
            id: this.state.id,
            nome: this.state.nome,
            email: this.state.email,
            telefone : this.state.telefone,
            aniversario : this.state.aniversario,
            identificacao : this.state.identificacao,
            senha : this.state.senha
        }

        if(this.state.id === 0){
            this.cadastrarPessoa(pessoa);
        }else{
            this.atualizarPessoa(pessoa);
        }
        this.fecharModal();

        console.log(pessoa)
    }

    mostraTabela = () => {
        this.setState({
            mostraTabela: true
        })
    }

    mostraLista = () => {
        this.setState(
            { mostraTabela: false }
        )
    }
   
    
        
    render = () => { 
        return(
            <div className="tabelaPessoas">
                <Button className="bt" variant="primary" onClick={this.abrirModal}>Adicionar pessoa</Button>
                <br />
                <br />
                {this.renderForm()}
                {this.renderTabela()}
            </div>
        );
    }
}

export default Pessoa;