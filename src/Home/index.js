import React, { useEffect, useState } from "react";

import api from "../services/api";

export function Home(){
    const [estados, setEstados] = useState([]);
    const [uf, setUf] = useState('');
    const [dados, setDados] = useState([]);

    /// Carrega os dados recebidos da API e retorna o array para a nossa página (componentDidMount)
    useEffect(()=>{

        async function loadApi(){
            const response = await api.get('api/report/v1');

            // O retorno JSON está encapsulado em outra tag data, além do root data.
            setEstados(response.data.data);
            console.log("fez requisição!");
        };

        loadApi();
    },[]);

    /// Carrega os dados recebidos de uma Unidade Federativa específica da API e retorna o array para a exibição na página sempre que for selecionada uma UF diferente
    useEffect(()=>{
        async function loadDados(){
            // Recebe o estado selecionado e concatena no sufixo da url para acesso à API
            let url = 'api/report/v1/brazil/uf/' + uf;
            const response = await api.get(url);
            setDados(response.data);
        }

        loadDados();

    }, [uf]);

    /// recebe o valor atual do campo select e armazena na state `uf`
    const handleChange = (event)=>{
        let resultado = event.currentTarget;
        setUf(resultado.value);
    }


  	return (
        <div className="App">
            <header>
                <h1>Covid-19 no Brasil</h1>
                <a href="https://github.com/alessandromarvao/relatorio-covid19" target='_blank' rel="noopener noreferrer">GitHub</a>
            </header>
            <div className='form'>
                <label><strong>Selecione um estado: </strong></label>
                <select name="uf" onChange={handleChange}>
                    <option value="" selected>Selecione um estado</option>
                    {
                        //converte a matriz dos dados em map e apresenta os resultados individualmente
                        estados.map((estado)=>{
                            return(
                                <option value={estado.uf} key={estado.uid}>{estado.state}</option>
                            );
                        })
                    }
                </select>
            </div>

            { //Confere se foi selecionado algum estado do select e exibe as informações referentes ao estado selecionado 
            !!(dados.state) && 
            <div className="tabela">
                {console.log('chegou aqui!')}
                <h2>{dados.state}</h2>
                <table>
                    <tbody>
                        <tr>
                            <th>Confirmados:</th>
                            <td>{dados.cases}</td>
                        </tr>
                        <tr>
                            <th>Suspeitos:</th>
                            <td>{dados.suspects}</td>
                        </tr>
                        <tr>
                            <th>Descartados:</th>
                            <td>{dados.refuses}</td>
                        </tr>
                        <tr>
                            <th>Mortes:</th>
                            <td>{dados.deaths}</td>
                        </tr>
                        <tr>
                            <th>Atualizado em:</th>
                            <td>
                                {
                                    // converte a data para o formato usado no Brasil (dia/mês/ano)
                                    new Date(dados.datetime).toLocaleDateString('pt-BR') 
                                }
                            </td>
                        </tr>
                    </tbody>
                </table>
                <small>Dados: <a href='https://covid19-brazil-api-docs.vercel.app/' target='_blank' rel="noopener noreferrer">Covid 19 Brazil API </a></small>
            </div>
            }
        </div>
      );
}