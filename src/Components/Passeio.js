import React from "react";
import { Button, Table, Modal } from "react-bootstrap";


class Passeio extends React.Component{

    constructor(props){
        super(props);

        this.state={
            id: 0,
            destino : '',
            itinerario : '',
            preco : '',
            passeios: []
        }

        this.deletarPasseio = this.deletarPasseio.bind(this);
        this.buscarPasseios = this.buscarPasseios.bind(this);
        this.cadastrarPasseio = this.cadastrarPasseio.bind(this);
        this.atualizarDestino = this.atualizarDestino.bind(this);
        this.atualizarItinerario = this.atualizarItinerario.bind(this);
        this.atualizarPreco = this.atualizarPreco.bind(this);
        this.submit = this.submit.bind(this);
        this.fecharModal = this.fecharModal.bind(this);
        this.abrirModal = this.abrirModal.bind(this);

    }

    componentDidMount(){
        this.buscarPasseios();
    }

    componentWillUnmount(){

    }

    buscarPasseios = () => {
        fetch("http://localhost.com:8080/passeio", {
            method: 'GET',
            headers: {'Content-Type':'application/json'},
        })
        .then(resposta => resposta.json)
        .then(dados => this.setState({ passeios : dados }))
    }

    cadastrarPasseio = (passeio) => {

        fetch("http://localhost.com:8080/Passeio",{
            method: 'POST',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify(passeio)
        })
        .then(resposta => {
            if(resposta.ok){
                this.buscarPasseios();
            }else{
                alert('Não foi possível adicionar o passeio!');
            }
        })
    }

    carregarDados = (id) =>{

        fetch("http://localhost.com:8080/Passeio/"+id, {
            method: 'GET',
            headers: {'Content-Type':'application/json'}        
            })
        .then(resposta => resposta.json)
        .then(passeio => {
            this.setState(
                {
                    id: passeio.id,
                    destino : passeio.destino,
                    itinerario : passeio.itinerario,
                    preco : passeio.preco
                }
            )
        this.abrirModal();
        })
        .catch(error => {
            console.error("Erro na requisição:", error);
        });
    }

    atualizarPasseio = (passeio) => {

        fetch("http://localhost.com:8080/Passeio/"+passeio.id,{
            method: 'PUT',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify(passeio)
        })
        .then(resposta => {
            if(resposta.ok){
                this.buscarPasseios();
            }else{
                alert('Não foi possível atualizar o passeio!');
            }
        })
    }

    deletarPasseio = (id) =>{

        fetch("http://localhost.com:8080/passeio/"+id, {
            method: 'DELETE',
            headers: {'Content-Type':'application/json'}        
            })
        .then(resposta => {
            if(resposta.ok){
                this.buscarPasseios();
            }else{
                alert('Passeio não foi excluída');
            }
        })
    }


    renderTabela (){

        const listaPasseios = this.state.passeios.map((passeio) =>
            <tr>
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
        );


        return (
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Destino</th>
                        <th>Itinerario</th>
                        <th>Preço</th>
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
            preco : ""
        })
    }

    abrirModal = () => {
        this.setState({
            modalAberta: true
        })
    }

    renderForm (){
        return(
            <Modal show={this.state.modalAberta} onHide={this.fecharModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Preencha os dados do passeio</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <form id="cadastro">
                        <div class="mb-3">
                            <label class="form-label">Destino</label>
                            <input type="text" class="form-control" value={this.state.destino} onChange={this.atualizarDestino}></input>
                            <br />
                            <label class="form-label">Itinerario</label>
                            <input type="text" class="form-control" value={this.state.itinerario} onChange={this.atualizarItinerario}></input>
                            <br />
                            <label class="form-label">Preço</label>
                            <input type="number" class="form-control" value={this.state.preco} onChange={this.atualizarPreco}></input>
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
            preco : this.state.preco
        }

        if(this.state.id == 0){
            this.cadastrarPasseio(passeio);
        }else{
            this.atualizarPasseio(passeio);
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
   
    
        
    render = () =>{
        return(
            <div class="tabelaPasseios">
                <Button class="bt" variant="primary" onClick={this.abrirModal}>Adicionar passeio</Button>
                <br />
                <br />
                {this.renderForm()}
                {this.renderTabela()}
            </div>
        );
    }
}

export default Passeio;