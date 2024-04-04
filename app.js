const app = Vue.createApp({
    data() {
        return {
            contas: [],
            mensagem: '',
            nome: '',
            valor: '',
            dataVencimento: Date,
            dataPagamento: Date,
        }
    },
    computed: {},
    methods: {
        async getContas() {
            const requestOptions = {
                method: "GET",
                redirect: "follow"
            };

            const response = await fetch("http://localhost:5077/api/Contas", requestOptions);
            this.contas = await response.json();
        },
        async salvar() {
            if (this.verificaCamposNulo()) return;

            const requestOptions = {
                method: "POST",
                redirect: "follow",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    nome: this.nome,
                    valorOriginal: this.valor.replace(',', '.'),
                    dataVencimento: this.dataVencimento,
                    dataPagamento: this.dataPagamento,
                }),
            };

            const response = await fetch("http://localhost:5077/api/Contas", requestOptions);
            if (response.statusCode === 400) {
                return this.mensagem = response.message;
            }
            if (response.status === 201) {
                // Requisição bem-sucedida
                this.mensagem = "Conta salva com sucesso!";
                this.limpar();
                await this.getContas();
            } else {
                // Erro na requisição
                const error = await response.json();
                this.mensagem = error.message;
            }
        },
        verificaCamposNulo() {
            if (!this.nome) return this.mensagem = "Nome é obrigatório";
            if (!this.valor) return this.mensagem = "Valor é obrigatório";
            if (!this.dataVencimento) return this.mensagem = "Data vencimento é obrigatório";
            if (!this.dataPagamento) return this.mensagem = "Data pagamento é obrigatório";
            return false;
        },
        formataData(data) {
            return new Date(data).toLocaleDateString('pt-BR');
        },
        formataMoeda(moeda) {
            return new Intl.NumberFormat('pt-BR',
                {style: 'currency', currency: 'BRL'}).format(
                moeda,
            );
        },
        limpar() {
            this.nome = "";
            this.valor = "";
            this.dataVencimento = "";
            this.dataPagamento = "";
        },
    },
    mounted() {
        this.getContas();
    }
});
app.mount('#app');
