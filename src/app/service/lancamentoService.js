import ApiService from "../apiservice";

import ErroValidacao from "../exception/erroValidacao";

export default class LancamentoService extends ApiService{
    
    constructor(){
        super('/api/lancamentos')
    }

    obterMeses(){
        return  [
            { label: 'Selecione...', value: '' },
            { label: 'Janeiro', value: 1 },
            { label: 'Fevereiro', value: 2 },
            { label: 'Março', value: 3 },
            { label: 'Abril', value: 4 },
            { label: 'Maio', value: 5 },
            { label: 'Junho', value: 6 },
            { label: 'Julho', value: 7 },
            { label: 'Agosto', value: 8 },
            { label: 'Setembro', value: 9 },
            { label: 'Outubro', value: 10 },
            { label: 'Novembro', value: 11 },
            { label: 'Dezembro', value: 12 },
        ]
    }

    obterTipos(){
        return [
            {label:'Selecione...',value:''},
            { label: 'Despesa' , value : 'DESPESA' },
            { label: 'Receita' , value : 'RECEITA' }
        ]
    }

    
    obterPorId(id){
        return this.get(`/${id}`)
    }

    alteraStatus(id,statusLancamento){
        return this.put(`/${id}/atualiza-status`,{statusLancamento})
           
    }

    validar(lancamento){
        const erros=[]
        
        if(!lancamento.ano){
            erros.push("Informe o ANO")
        }
        if(!lancamento.mes){
            erros.push("Informe o MES")
        }
        if(!lancamento.descricao){
            erros.push("Informe a DESCRIÇÃO")
        }
        if(!lancamento.valor){
            erros.push("Informe o VALOR")
        }
        if(!lancamento.tipoLancamento){
            erros.push("Informe o TIPO")
        }

        if(erros && erros.length>0){
            throw new ErroValidacao(erros)
        }
    }

    

    salvar(lancamento){
        return this.post('/',lancamento);
    }
    
    atualizar(lancamento){
        return this.put(`/${lancamento.id}`,lancamento)
    }

    consultar(lancamentoFiltro){
        console.log(lancamentoFiltro)
        

        let params =`?ano=${lancamentoFiltro.ano}`

        if(lancamentoFiltro.mes){
            params=`${params}&mes=${lancamentoFiltro.mes}`
        }
        if(lancamentoFiltro.tipoLancamento){
            params=`${params}&tipoLancamento=${lancamentoFiltro.tipoLancamento}`
        }
        if(lancamentoFiltro.statusLancamento){
            params=`${params}&status=${lancamentoFiltro.statusLancamento}`
        }
        if(lancamentoFiltro.usuario){
            params=`${params}&idUsuario=${lancamentoFiltro.usuario}`
        }
        if(lancamentoFiltro.descricao){
            params = `${params}&descricao=${lancamentoFiltro.descricao}`
        }
        return this.get(params)
    }

    deletar(id){
        return this.delete(`/${id}`);
    }
    
}
