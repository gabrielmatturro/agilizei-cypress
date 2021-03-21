/// <reference types="cypress" />

import { format,  prepareLocalStorage} from '../support/utils'

context('Dev Finances Agilizei', () => {
    
    //hooks -> trechos de código que executam antes e depois do teste
        //before -> antes de todos os testes
        //beforeEach -> antes de cada teste
        //after -> depois de todos os testes
        //afterEach -> depois de cada teste


    // - entender o fluxo manualmente
    // - mapear os elementos que vamos interagir
    // - descrever as interações com o cypress
    // - adicionar as asserções que a gente precisa

    beforeEach(() => {
        cy.visit('https://devfinance-agilizei.netlify.app', {
            onBeforeLoad: (win) => {
                prepareLocalStorage(win)
            }
        })
    });

    it('Cadastrar entradas', () => {
       
        cy.get('#transaction .button').click() // id + classe
        cy.get('#description').type('Mesada') // id
        cy.get('[name=amount]').type(12) // atributos
        cy.get('[type=date').type('2021-03-17') // atributos
        cy.get('button').contains('Salvar').click() // tipo e valor

        cy.get('#data-table tbody tr').should('have.length', 3)

    });

    it('Cadastrar saídas', () => {
        
        cy.get('#transaction .button').click() // id + classe
        cy.get('#description').type('Mesada') // id
        cy.get('[name=amount]').type(-12) // atributos
        cy.get('[type=date').type('2021-03-17') // atributos
        cy.get('button').contains('Salvar').click() // tipo e valor

        cy.get('#data-table tbody tr').should('have.length', 3)
        
    });
   
    it('Remover entradas e saídas', () => {

        //estratégia 1: define elemento âncora, volta para o elemento pai e avançar para o elemento irmão td img attr
            //* recurso do caracter coringa, que abrevia a busca buscando se contains apenas para a palavra "remove"
        cy.get('td.description')
          .contains("Mesada")
          .parent()
          .find('img[onclick*=remove]')
          .click()

        //estratégia 2: define elemento âncora, buscar todos os irmãos e buscar o que tem img + attr
        cy.get('td.description')
          .contains('Suco Kapo')
          .siblings()
          .children('img[onclick*=remove]')
          .click()

          cy.get('#data-table tbody tr').should('have.length', 0)

    });

    it('Validar saldo com diversas transações', () => {

        // capturar as linhas com as transacoes
        // capturar o texto desses colunas
        // formatar esses valores das linhas

        // somar os valores de entrada e saidas

        // capturar o texto do total
        // comparar o somatorio de entradas e despesas com o total 

        let incomes = 0
        let expenses = 0

        cy.get('#data-table tbody tr').each(($el, index, $list) => {

            // invoke() = invoca uma função Javascript
            // text() = função que obtem o valor de texto
            // then() = função que irá pegar o valor e passar para um contexto

            cy.get($el).find('td.income, td.expense').invoke('text').then(text => {

                if(text.includes('-')){
                    expenses = expenses + format(text)
                } else {
                    incomes = incomes + format(text)
                }   
                
                cy.log(`entradas`, incomes)
                cy.log(`saidas`, incomes)
            })
        })

        cy.get('#totalDisplay').invoke('text').then(text => {

            let formattedTotalDisplay = format(text)
            let expectedTotal = incomes + expenses

            expect(formattedTotalDisplay).to.eq(expectedTotal)
        })



    });
});