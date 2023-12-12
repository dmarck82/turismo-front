import img from '../fogo.jpg';

function Home() {
  const containerStyle = {
    display: 'flex',
    justifyContent: 'space-evenly', // ou 'space-around' ou 'space-evenly' conforme necessário
  };

  const divStyle = {
    textAlign: 'center',
    margin: '10px',
  };

  return (
    <div style={containerStyle}>
    <div style={divStyle}>
    <p>Aluno: Douglas Oliveira Marcondes Cardoso - 2043351</p>
    <p>Professor: Ricardo Sobjak</p>
    <p>Tecnologias utilizadas:</p>
    <ul>
        <li>Spring Boot</li>
        <li>Node.Js</li>
        <li>Postgres</li>
        <li>MongoDb</li>
        <li>React</li>
    </ul>
    </div>
      <div style={divStyle}>
        <h3>Agência de turismo paz e sossego</h3>
        <img src={img} alt="Pousada pegando fogo" />
      </div>
      
    </div>
  );
}

export default Home;
