import React, { useEffect, useState } from "react";

import api from "../services/api";

export function Home() {
    const [json, setJson] = useState([]); // Armazena os dados do JSON recebido da API
    const [estado, setEstado] = useState(''); // Armazena o valor do estado selecionado
    const [dados, setDados] = useState([]); // Armazena os dados estatísticos do estado selecionado
    const [bool, setBool] = useState(false); // Armazena a variável booleana 

    /// Carrega os dados recebidos da API e retorna o array para a nossa página (componentDidMount)
    useEffect(() => {

        async function onLoad() {
            const response = await api.get('api/report/v1');

            // O retorno JSON está encapsulado em outra tag data, além do root data.
            setJson(response.data.data);
        };

        onLoad();
    }, []);

    /// Função ativada quando o `estado` for alterado
    useEffect(() => {

        // Percorre o array de 
        if (estado !== '') {

            setBool(true); // Valor do booleano verdadeiro pra informar que um estado foi selecionado

            for (let i = 0; i < json.length; i++) {
                if (json[i].uf === estado) {
                    setDados(json[i]);
                }
            }
        } else { // Nenhum estado foi selecionado
            setBool(false);
        }

    }, [estado]);

    /// recebe o valor atual do campo select e armazena na state `uf`
    const handleChange = (event) => {
        let resultado = event.currentTarget.value;
        setEstado(resultado);
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
                    <option value="" defaultValue={null}>Selecione um estado</option>
                    {
                        //converte a matriz dos dados em map e apresenta os resultados individualmente
                        json.map((estado) => {
                            return (
                                <option value={estado.uf} key={estado.uid}>{estado.state}</option>
                            );
                        })
                    }
                </select>
            </div>

            { 
                (bool) && 
                //Confere se foi selecionado algum estado do select e exibe as informações referentes ao estado selecionado 
                <div className="tabela">
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
                    <small>
                        Dados: <a href='https://covid19-brazil-api-docs.vercel.app/' target='_blank' rel="noopener noreferrer">Covid 19 Brazil API </a>
                    </small>
                    <hr/>
                    <small>Desenvolvido por Alessandro Marvão</small>
                </div>
            }
        </div>
    );
}