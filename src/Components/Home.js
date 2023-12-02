function Home(){
    return(
        <div>
            <div>
                <p>Aluno: Douglas Oliveira Marcondes Cardoso - 2043351</p>
                <p>Professor: Ricardo Sobjak</p>
                <p>Tecnologias utilizadas:</p>
                <li>Spring Boot</li>
                <li>Node.Js</li>
                <li>Postgres</li>
                <li>MongoDb</li>
                <li>React</li>
            </div>
            <br></br>
            <div>
                <p>Melhorias que podem ser realizadas:</p>
                <li>Colocar o cadastro de pessoas junto com a página de login.</li>
            </div>
            <br></br>
            <div>
                <p>Bugs Detectados:</p>
                <li>É necessário ter um usuário cadastrado para fazer o login primeiro para então poder fazer os cadastros de terceiros e assim poder utilizá-los.</li>
                <li>Está com um bug para colocar os passeios em um pacote pela interface web.</li>
                <li>É possível cadastrar um pacote pelo backend, porém não é possível atualizar o mesmo.</li>
            </div>
        </div>

        
    )
}

export default Home;