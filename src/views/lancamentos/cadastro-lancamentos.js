import React from "react";

import Card from "../../components/card";
import FormGroup from "../../components/form-group";
import SelectMenu from "../../components/selectMenu";

import {withRouter} from 'react-router-dom'
import * as messages from '../../components/toastr'

import LancamentoService from "../../app/service/lancamentoService";
import LocalStorageService from "../../app/service/localstorageService";

class CadastroLancamentos extends React.Component{

    state = {
        id:null,
        descricao: '',
        valor:'',
        mes:'',
        ano:'',
        idUsuario:null,
        tipoLancamento:'',
        statusLancamento:'',
        atualizando:false

    }

    constructor(){
        super()
        this.lancamentoService=new LancamentoService();
    }
    
    componentDidMount(){
        const params = this.props.match.params
        if(params.id){
            this.lancamentoService
                .obterPorId(params.id)
                .then(response => {
                    this.setState({...response.data,atualizando: true})
                })
                .catch(erros =>{
                    messages.mensagemErro(erros.response.data)
                })
        }
    }

    submit = () =>{
        const usuarioLogado = LocalStorageService.obterItem('_usuario_logado')
        
        const {descricao,valor,mes,ano,tipoLancamento}=this.state;
        const lancamento = {descricao,mes,ano,valor,tipoLancamento,idUsuario:usuarioLogado.id};

        try{
            this.lancamentoService.validar(lancamento)
        }catch(erro){
            const mensagens=erro.mensagens;
            mensagens.forEach(msg => messages.mensagemErro(msg));
            return false;
        }

        this.lancamentoService
            .salvar(lancamento)
            .then(response =>{
                this.props.history.push('/consulta-lancamento')
                messages.mensagemSucesso('Lançamento cadastrado com sucesso!')
            }).catch(error => {
                messages.mensagemErro(error.response.data)
            })
    }
  
    atualizar = () =>{
        const {descricao,valor,mes,ano,tipoLancamento,statusLancamento,id}=this.state;

        const lancamento = {descricao,mes,ano,valor,tipoLancamento,statusLancamento,id};

        this.lancamentoService
            .atualizar(lancamento)
            .then(response =>{
                this.props.history.push('/consulta-lancamento')
                messages.mensagemSucesso('Lançamento atualizado com sucesso!')
            }).catch(error => {
                messages.mensagemErro(error.response.data)
            })
    }

    handleChange=(event) =>{
        const value=event.target.value
        const name=event.target.name

        this.setState({[name]:value})
    }

    render(){
        const meses=this.lancamentoService.obterMeses();
        const tipos=this.lancamentoService.obterTipos();

        return(
            <Card title={this.state.atualizando ? 'Atualização de Cadastro': 'Cadastro de Lançamento'}>
                <div className="row">
                    <div className="col-md-12">
                        <FormGroup htmlFor="inputDescricao" label="Descrição: *">
                            <input id='inputDescricao'  type='text'   
                                   className="form-control"
                                   name="descricao"
                                   value={this.state.descricao}
                                   onChange={this.handleChange} placeholder="Digite a descrição"/>
                        </FormGroup>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6">
                        <FormGroup id="inputAno" label="Ano: *">
                            <input  id='inputAno' 
                                    type='text'
                                    className="form-control"
                                    name="ano"
                                    value={this.state.ano}
                                    onChange={this.handleChange}  placeholder="Digite o Ano"/>
                        </FormGroup>
                    </div>
                    <div className="col-md-6">
                        <FormGroup htmlFor="inputMes" label="Mês: *">
                            <SelectMenu id="inputMes"
                                        className="form-control"
                                        name="mes"
                                        value={this.state.mes}
                                        onChange={this.handleChange}
                                        lista={meses} />
                        </FormGroup>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-4">
                        <FormGroup htmlFor="inputValor" label="Valor: *">
                        <input type='text'
                                   id='inputValor' 
                                   className="form-control"
                                   name="valor"
                                   value={this.state.valor}
                                   onChange={this.handleChange}
                                   placeholder="Digite o Valor"
                                   />
                        </FormGroup>
                    </div>

                    <div className="col-md-4">
                        <FormGroup htmlFor="inputTipoLancamento" label="Tipo de Lançamento: *">
                            <SelectMenu
                                id="inputTipoLancamento"
                                name="tipoLancamento"
                                value={this.state.tipoLancamento}
                                onChange={this.handleChange}
                                className="form-control"
                                lista={tipos}
                            />
                        </FormGroup>
                    </div>
                    <div className="col-md-4">
                        <FormGroup htmlFor="inputStatus" label="Status: ">
                            <input type='text'
                                    id="inputStatusLancamento"
                                    className="form-control"
                                    name="statusLancamento"
                                    value={this.state.statusLancamento}
                                    //onChange={this.handleChange}
                                    disabled/>
                        </FormGroup>
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-6">
                        {this.state.atualizando ? 
                            (
                                <button onClick={this.atualizar} title='Atualizar'
                                        className="btn btn-success">
                                            <i className="pi pi-refresh mr-2"></i>
                                </button>  
                            ):
                            (
                                <button onClick={this.submit}
                                        className="btn btn-success">
                                            <i className="pi pi-save mr-2"></i>Salvar
                                </button>
                            )
                            
                        }
                        
                        
                        <button onClick={e=>this.props.history.push('/consulta-lancamento')} 
                                className="btn btn-danger">
                                    <i className="pi pi-times mr-2"></i>Cancelar
                        </button>
                    </div>
                </div>
            </Card>
        )
    }
}

export default withRouter(CadastroLancamentos)