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
        this.submit = this.submit.bind(this);
        this.fecharModal = this.fecharModal.bind(this);
        this.abrirModal = this.abrirModal.bind(this);

    }

    componentDidMount(){
        this.buscarPessoas();
    }

    componentWillUnmount(){

    }

    buscarPessoas = () => {

        fetch("http://localhost.com:8080/pessoa", {
            method: 'GET',
            headers: {'Content-Type':'application/json'},
        })
        .then(resposta => resposta.json)
        .then(dados => this.setState({ pessoas : dados }))
    }

    cadastrarPessoa = (pessoa) => {

        fetch("http://localhost.com:8080/pessoa",{
            method: 'POST',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify(pessoa)
        })
        .then(resposta => {
            if(resposta.ok){
                this.buscarPessoas();
            }else{
                alert('Não foi possível adicionar a pessoa!');
            }
        })
    }

    carregarDados = (id) =>{

        fetch("http://localhost.com:8080/pessoa/"+id, {
            method: 'GET',
            headers: {'Content-Type':'application/json'}        
            })
        .then(resposta => resposta.json)
        .then(pessoa => {
            this.setState(
                {
                    id: pessoa.id,
                    nome : pessoa.nome,
                    email : pessoa.email,
                    telefone : pessoa.telefone,
                    aniversario : pessoa.aniversario,
                    identificacao : pessoa.identificacao
                }
            )
        this.abrirModal();
        })
        .catch(error => {
            console.error("Erro na requisição:", error);
        });
    }

    atualizarPessoa = (pessoa) => {

        fetch("http://localhost.com:8080/pessoa/"+pessoa.id,{
            method: 'PUT',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify(pessoa)
        })
        .then(resposta => {
            if(resposta.ok){
                this.buscarPessoas();
            }else{
                alert('Não foi possível atualizar a pessoa!');
            }
        })
    }

    deletarPessoa = (id) =>{

        fetch("http://localhost.com:8080/pessoa/"+id, {
            method: 'DELETE',
            headers: {'Content-Type':'application/json'}        
            })
        .then(resposta => {
            if(resposta.ok){
                this.buscarPessoas();
            }else{
                alert('Pessoa não foi excluída');
            }
        })
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
            identificacao : ""
        })
    }

    abrirModal = () => {
        this.setState({
            modalAberta: true
        })
    }

    renderForm = () => {
        return(
            <Modal show={this.state.modalAberta} onHide={this.fecharModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Preencha os dados da pessoa</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <form id="cadastro">
                        <div class="mb-3">
                            <label class="form-label">Nome</label>
                            <input type="text" class="form-control" value={this.state.nome} onChange={this.atualizarNome}></input>
                            <br />
                            <label class="form-label">Email</label>
                            <input type="email" class="form-control" value={this.state.email} onChange={this.atualizarEmail}></input>
                            <br />
                            <label class="form-label">Telefone</label>
                            <input type="text" class="form-control" value={this.state.telefone} onChange={this.atualizarTelefone}></input>
                            <br />
                            <label class="form-label">Aniversário</label>
                            <input type="date" class="form-control" value={this.state.aniversario} onChange={this.atualizarAniversario}></input>
                            <br />
                            <label class="form-label">Identificacao</label>
                            <input type="text" class="form-control" value={this.state.identificacao} onChange={this.atualizarIdentificacao}></input>
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

    submit = () =>{

        const pessoa = {
            id: this.state.id,
            nome: this.state.nome,
            email: this.state.email,
            telefone : this.state.telefone,
            aniversario : this.state.aniversario,
            identificacao : this.state.identificacao
        }

        if(this.state.id == 0){
            this.cadastrarPessoa(pessoa);
        }else{
            this.atualizarPessoa(pessoa);
        }
        this.fecharModal();
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
            <div class="tabelaPessoas">
                <Button class="bt" variant="primary" onClick={this.abrirModal}>Adicionar pessoa</Button>
                <br />
                <br />
                {this.renderForm()}
                {this.renderTabela()}
            </div>
        );
    }
}

export default Pessoa;