import React from "react";
import { withRouter } from "react-router-dom"

import Card from "../../components/card";
import FormGroup from "../../components/form-group";
import SelectMenu from "../../components/selectMenu";
import LancamenosTable from "./lancamentosTable";
import LancamentoService from "../../app/service/lancamentoService";
import LocalStorageService from "../../app/service/localstorageService";

import * as messages from '../../components/toastr'

import { Dialog } from 'primereact/dialog'
import { Button } from 'primereact/button'



class ConsultaLancamento extends React.Component {
    state = {
        ano: '',
        mes: '',
        tipoLancamento: '',
        descricao: '',
        showConfirmDialog:false,
        lancamentoDeletar:{},
        lancamentos: []
    }

    constructor() {
        super();
        this.lancamentoService = new LancamentoService();
    }

    busca = () => {
        if (!this.state.ano) {
            messages.mensagemErro("O preenchimento do campo Ano é obrigatório")
            return false;
        }


        const usuarioLogado = LocalStorageService.obterItem('_usuario_logado')

        const lancamentoFiltro = {
            ano: this.state.ano,
            mes: this.state.mes,
            tipoLancamento: this.state.tipoLancamento,
            descricao: this.state.descricao,
            usuario: usuarioLogado.id
        }

        this.lancamentoService
            .consultar(lancamentoFiltro)
            .then(resposta => {
                const lista = resposta.data;
                if(lista.length <1){
                    messages.mensagemAlerta("Nenhum resultado encontrado.")
                }
                this.setState({ lancamentos: lista })
            }).catch(error => {
                console.log(error)
            })
    }

    editar = (id) => {
        this.props.history.push(`/cadastro-lancamento/${id}`)
    }

    abrirConfirmacao=(lancamento)=>{
        this.setState({showConfirmDialog:true,lancamentoDeletar:lancamento})
    }

    cancelarDelecao = () =>{
        this.setState({showConfirmDialog:false,lancamentoDeletar:{}})
    }

   
   
   
    deletar = () => {
        this.lancamentoService
            .deletar(this.state.lancamentoDeletar.id)
            .then(resposta => {
                const lancamentos = this.state.lancamentos;
                const index = lancamentos.indexOf(this.state.lancamentoDeletar);
                lancamentos.splice(index, 1);
                this.setState({lancamentos:lancamentos,showConfirmDialog:false})
                messages.mensagemSucesso("Lançamento deletado com sucesso")
            }).catch(error => {
                messages.mensagemErro('Ocorreu um erro ao tentar deletar o lançamento')
            })
    }

    preparaFormularioCadastro = () => {
        this.props.history.push('/cadastro-lancamento')
    }

    alterarStatus = (lancamento,statusLancamento) => {
        this.lancamentoService
            .alteraStatus(lancamento.id,statusLancamento)
            .then(response => {
                const lancamentos=this.state.lancamentos;
                const index=lancamentos.indexOf(lancamento)

                if(index !== -1){
                    lancamento['statusLancamento'] = statusLancamento
                    lancamentos[index] = lancamento;
                    this.setState({lancamento});
                }
                messages.mensagemSucesso("Status atualizado com sucesso")
            })
    }
   

    render() {

        const meses = this.lancamentoService.obterMeses();
        const tipos = this.lancamentoService.obterTipos();

        const confirmDialogFooter=(
            <div>
                <Button label='Confirmar' icon='pi pi-check' onClick={this.deletar}/>
                <Button label='Cancelar' icon='pi pi-times' onClick={this.cancelarDelecao} 
                        className="p-button-secondary"/>
            </div>
        )



        return (
            <Card title="Busca Lançamento">
                <div className='row'>
                    <div className='col-lg-6'>
                        <div className='bs-component'>
                            <FormGroup label='Ano:*' htmlFor='inputAno'>
                                <input type='text'
                                    id="inputAno"
                                    className="form-control"
                                    name="ano"
                                    value={this.state.ano}
                                    onChange={e => this.setState({ ano: e.target.value })}
                                    placeholder="Digite o ano"
                                />
                            </FormGroup>
                            <br />
                            <FormGroup label='Mês: ' htmlFor='inputMes'>
                                <SelectMenu id='inputMes'
                                    value={this.state.mes}
                                    onChange={e => this.setState({ mes: e.target.value })}
                                    className="form-control"
                                    lista={meses} />
                            </FormGroup>
                            <br />
                            <FormGroup label='Descrição: ' htmlFor='inputDesc'>
                                <input type='text'
                                    id="inputDesc"
                                    className="form-control"
                                    name="ano"
                                    value={this.state.descricao}
                                    onChange={e => this.setState({ descricao: e.target.value })}
                                    placeholder="Digite a descricão"
                                />
                            </FormGroup>
                            <br />
                            <FormGroup label='Tipo de Lançamento:' htmlFor='inputTipoLancamento'>
                                <SelectMenu
                                    id='inputTipoLancamento'
                                    value={this.state.tipoLancamento}
                                    onChange={e => this.setState({ tipoLancamento: e.target.value })}
                                    className="form-control"
                                    lista={tipos} />

                            </FormGroup>
                            <br />
                            <button onClick={this.busca} title="Buscar"
                                    className="btn btn-success">
                                        <i className="pi pi-search mr-2"></i>
                            </button>
                            <button onClick={e=>this.props.history.push('/cadastro-lancamento')} title="Cadastrar"
                                    className="btn btn-danger">
                                        <i className="pi pi-plus mr-2"></i>
                            </button>

                        </div>
                    </div>
                </div>
                <br />
                <div className='row'>
                    <div className='col-md-12'>
                        <div className='bs-component'>
                            <LancamenosTable lancamentos={this.state.lancamentos}
                                deleteAction={this.abrirConfirmacao}
                                editAction={this.editar}
                                alterarStatus={this.alterarStatus}
                                //cancelar={this.cancelar}
                            />
                        </div>
                    </div>
                </div>
                <div>
                    <Dialog header="Confirma exclusão"
                            visible={this.state.showConfirmDialog}
                            style={{ width: '50vw' }}
                            footer={confirmDialogFooter}
                            modal={true}
                           onHide={() => this.setState({showConfirmDialog:false})}>
                        <p>
                            Confirma a exclusão deste lançamento?
                            
                        </p>
                    </Dialog>

                </div>

            </Card>
        )
    }
}

export default withRouter(ConsultaLancamento)