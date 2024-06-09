import React, { useState, useEffect } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css'
import axios from 'axios'
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import logoCadastro from './assets/cadastro.png'

function App() {

  const baseUrl = 'https://localhost:44378/api/Alunos'

  const [data, setData] = useState([])
  const [updateData, setUpdateData] = useState(true)
  const [modalIncluir, setModalIncluir] = useState(false)
  const [modalEditar, setModalEditar] = useState(false)
  const [modalExcluir, setModalExcluir] = useState(false)

  const [alunoSelecionado, setAlunoSelecionado] = useState({
    id: '',
    name: '',
    email: '',
    idade: '',
  })

  const selecionarAluno = (aluno, opcao) => {
    setAlunoSelecionado({ ...aluno });
    (opcao === "Editar") ? abrirFecharModalEditar() : abrirFecharModalExcluir()
  }

  const abrirFecharModalIncluir = () => {
    setModalIncluir(!modalIncluir)
  }

  const abrirFecharModalEditar = () => {
    setModalEditar(!modalEditar)
  }

  const abrirFecharModalExcluir = () => {
    setModalExcluir(!modalExcluir)
  }

  const handleChange = e => {
    const { name, value } = e.target
    setAlunoSelecionado({
      ...alunoSelecionado, [name]: value
    })
    console.log(alunoSelecionado)
  }

  const pedidoGet = async () => {
    await axios.get(baseUrl)
      .then((response) =>
        setData(response.data))
      .catch((err) => {
        console.log(err)
      })
  }

  const pedidoPost = async () => {
    delete alunoSelecionado.id
    alunoSelecionado.idade = parseInt(alunoSelecionado.idade)
    await axios.post(baseUrl, alunoSelecionado)
      .then((response) => {
        setData(data.concat(response.data))
        setUpdateData(true)
        abrirFecharModalIncluir()
      })
      .catch((err) => {
        console.log(err)
      })
  }

  const pedidoPut = async () => {
    alunoSelecionado.idade = parseInt(alunoSelecionado.idade)
    await axios.put(baseUrl + '/' + alunoSelecionado.id, alunoSelecionado)
      .then((response) => {
        var resposta = response.data
        console.log(resposta)
        var dadosAuxiliares = data
        dadosAuxiliares.map(aluno => {
          if (aluno.id === alunoSelecionado.id) {
            console.log("id do aluno editado: ", aluno.id)
            aluno.name = resposta.name
            aluno.email = resposta.email
            aluno.idade = resposta.idade
          }
          return aluno
        })
        setUpdateData(true)
        abrirFecharModalEditar()
      }).catch(error => {
        console.log(error)
      })
  }

  const pedidoDelete = async () => {
    await axios.delete(baseUrl + "/" + alunoSelecionado.id)
      .then(response => {
        setData(data.filter(aluno => aluno.id !== response.data))
        setUpdateData(true)
        abrirFecharModalExcluir()
      })
      .catch((err) => {
        console.log(err)
      })
  }

  useEffect(() => {
    if (updateData) {
      pedidoGet()
      setUpdateData(false)
    }
  }, [updateData])

  return (
    <div className="aluno-container">
      <br />
      <h3>Cadastro de alunos</h3>
      <header>
        <img src={logoCadastro} alt='Cadastro'></img>
        <button className='btn btn-success' onClick={() => abrirFecharModalIncluir()}>Incluir novo aluno</button>
      </header>
      <table className='table table-bordered'>
        <thead>
          <tr>
            <th>Id</th>
            <th>Nome</th>
            <th>Email</th>
            <th>Idade</th>
            <th>Operação</th>
          </tr>
        </thead>
        <tbody>
          {data.map((aluno) => {
            return (
              <tr key={aluno.id}>
                <td>{aluno.id}</td>
                <td>{aluno.name}</td>
                <td>{aluno.email}</td>
                <td>{aluno.idade}</td>
                <td>
                  <button className='btn btn-primary' onClick={() => selecionarAluno(aluno, "Editar")}>Editar</button>
                  <button className='btn btn-danger' onClick={() => selecionarAluno(aluno, "Excluir")}>Excluir</button>
                </td>
              </tr>)
          })}
        </tbody>
      </table>
      <Modal isOpen={modalIncluir}>
        <ModalHeader>
          Incluir Aluno
        </ModalHeader>
        <ModalBody>
          <div className='form-group'>
            <label>Nome: </label>
            <br />
            <input type='text' className='form-control' name='name' onChange={handleChange}></input>
            <label>Email: </label>
            <br />
            <input type='text' className='form-control' name='email' onChange={handleChange}></input>
            <label>Idade: </label>
            <br />
            <input type='text' className='form-control' name='idade' onChange={handleChange}></input>
          </div>
        </ModalBody>
        <ModalFooter>
          <button className='btn btn-primary' onClick={() => pedidoPost()}>Incluir</button>
          <button className='btn btn-danger' onClick={() => abrirFecharModalIncluir()}>Cancelar</button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={modalEditar}>
        <ModalHeader>
          Editar Aluno
        </ModalHeader>
        <ModalBody>
          <div className='form-group'>
            <label>ID:</label>
            <input type='text' className='form-control' readOnly
              value={alunoSelecionado && alunoSelecionado.id}></input>
            <label>Nome: </label>
            <br />
            <input type='text' className='form-control' name='name' onChange={handleChange}
              value={alunoSelecionado && alunoSelecionado.name}></input>
            <label>Email: </label>
            <br />
            <input type='text' className='form-control' name='email' onChange={handleChange}
              value={alunoSelecionado && alunoSelecionado.email}></input>
            <label>Idade: </label>
            <br />
            <input type='text' className='form-control' name='idade' onChange={handleChange}
              value={alunoSelecionado && alunoSelecionado.idade}></input>
          </div>
        </ModalBody>
        <ModalFooter>
          <button className='btn btn-primary' onClick={() => pedidoPut()}>Editar</button>
          <button className='btn btn-danger' onClick={() => abrirFecharModalEditar()}>Cancelar</button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={modalExcluir}>
        <ModalBody>
          Confirma a exclusão deste(a) aluno(a): {alunoSelecionado && alunoSelecionado.name}
        </ModalBody>
        <ModalFooter>
          <button className='btn btn-danger' onClick={() => pedidoDelete()}>Sim</button>
          <button className='btn btn-secondary' onClick={() => abrirFecharModalExcluir()}>Não</button>
        </ModalFooter>
      </Modal>
    </div>
  );
}

export default App;
