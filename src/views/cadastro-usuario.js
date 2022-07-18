import React from "react";

import { withRouter } from "react-router-dom";
import Card from "../components/card";
import FormGroup from "../components/form-group";

import UsuarioService from "../app/service/usuarioService";
import { mensagemSucesso,mensagemErro } from "../components/toastr";

class CadastroUsuario extends React.Component{

    state = {
        nome:'',
        email:'',
        senha:'',
        senhaRepeticao:''
    }

    constructor(){
        super();
        this.usuarioService=new UsuarioService();
    }

   

    cadastrar = () =>{

        const {nome,email,senha,senhaRepeticao}=this.state;
        const usuario={nome,email,senha,senhaRepeticao}

        try{
            this.usuarioService.validar(usuario);
        }catch(erro){
            const msgs=erro.mensagens;
            msgs.forEach(msg => mensagemErro(msg));
            return false;
        }

        this.usuarioService.salvar(usuario)
        .then(response => {
           mensagemSucesso('Usuario cadastrado com sucesso!')
           this.props.history.push('/login')
        }).catch(erro =>{
            mensagemErro(erro.response.data)
        })
    }

   

    voltarLogin = () =>{
        this.props.history.push('/login')
    }

    render(){

        
        return(
            <Card title="Cadastro de Usuário">
                <div className='row'>
                    <div className='col-lg-12'>
                        <div className='bs-component'>
                            <FormGroup label='Nome: *' htmlFor='inputName'>
                                <input type="text"
                                        id="inputName"
                                        className="form-control" 
                                        name='name'
                                        value={this.state.nome} 
                                        onChange={e => this.setState({nome:e.target.value})}
                                        placeholder="Digite o Nome"/>
                            </FormGroup>
                            <br />
                            <FormGroup label='Email: *' htmlFor='inputEmail'>
                                <input type="text" 
                                        id="inputEmail"
                                        className="form-control"
                                        name="email"
                                        value={this.state.email} 
                                        onChange={e => this.setState({email:e.target.value})}
                                        placeholder="Digite o Email"/>
                            </FormGroup>
                            <br />
                            <FormGroup label='Senha: *' htmlFor='inputSenha'>
                                <input type="password" 
                                        id="inputSenha"
                                        className="form-control"
                                        name='senha'
                                        value={this.state.senha}
                                        onChange={e => this.setState({senha:e.target.value})}
                                        placeholder="Digite a Senha"/>
                            </FormGroup>
                            <br />
                            <FormGroup label='Repita a Senha: *' htmlFor='inputRepitaSenha'>
                                <input type="password"
                                        id="inputRepitaSenha"
                                        className="form-control"
                                        name="senhaRepeticao"
                                        value={this.state.senhaRepeticao}
                                        onChange={e => this.setState({senhaRepeticao:e.target.value})}
                                        placeholder="Repita a Senha"/>
                            </FormGroup>
                            <br />
                            <button onClick={this.cadastrar} title="Salvar"
                                    className='btn btn-success'>
                                        <i className="pi pi-save mr-2"></i>
                            </button>
                            <button onClick={this.voltarLogin} title="Voltar"
                                    className='btn btn-danger'>
                                        <i className="pi pi-times mr-2"></i>
                                
                            </button>
                        </div>
                    </div>
                </div>
            </Card>
        )
    }
}
export default withRouter(CadastroUsuario)