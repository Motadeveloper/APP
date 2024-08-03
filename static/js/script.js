
document.addEventListener("DOMContentLoaded", function() {
    const startBookingButton = document.getElementById('startBooking');
    if (startBookingButton) {
        startBookingButton.addEventListener('click', function() {
            document.getElementById('detalhesEquipamentoContainer').style.display = 'none';
            document.getElementById('bookingFormContainer').style.display = 'block';
            document.getElementById('step1').scrollIntoView({ behavior: 'smooth' });
        });
    }

    const dataContainer = document.getElementById('data-container');
    const hoje = new Date();
    let dataInicio = null;
    let dataFim = null;

    function atualizarSelecao() {
        const bolinhas = document.querySelectorAll('.data-bolinha');
        bolinhas.forEach(bolinha => {
            const data = new Date(bolinha.dataset.date);
            if (dataInicio && dataFim && data >= dataInicio && data <= dataFim) {
                bolinha.classList.add('selected-range');
            } else if (dataInicio && data.getTime() === dataInicio.getTime()) {
                bolinha.classList.add('selected-start');
            } else {
                bolinha.classList.remove('selected-range');
                bolinha.classList.remove('selected-start');
            }
        });

        document.getElementById("hidden_data_inicio").value = dataInicio ? dataInicio.toISOString().split('T')[0] : '';
        document.getElementById("hidden_data_fim").value = dataFim ? dataFim.toISOString().split('T')[0] : '';
    }

    function carregarDatasIndisponiveis() {
        fetch(`/api/equipamento/{{ equipamento.id }}/disponibilidade/`)
            .then(response => response.json())
            .then(data => {
                const datasIndisponiveis = data.disponibilidades;
                const ultimaReserva = data.ultima_reserva;
                const ultimaReservaData = ultimaReserva ? new Date(ultimaReserva.data_fim) : null;
                const ultimaReservaHoraFim = ultimaReserva ? new Date(`1970-01-01T${ultimaReserva.hora_fim}`) : null;

                for (let i = 0; i < 30; i++) {
                    const dataAtual = new Date(hoje);
                    dataAtual.setDate(hoje.getDate() + i);
                    const dia = dataAtual.getDate();
                    const mes = dataAtual.toLocaleString('default', { month: 'short' });
                    const diaSemana = dataAtual.toLocaleString('default', { weekday: 'short' });

                    const bolinha = document.createElement('div');
                    bolinha.className = 'data-bolinha';
                    bolinha.innerHTML = `<span>${dia}</span><small>${mes}</small><br><small>${diaSemana}</small>`;
                    bolinha.dataset.date = dataAtual.toISOString().split('T')[0];

                    if (datasIndisponiveis[bolinha.dataset.date]?.disponivel === false) {
                        bolinha.classList.add('indisponivel');
                        bolinha.classList.add('disabled');
                    } else {
                        bolinha.addEventListener('click', function() {
                            const dataClicada = new Date(bolinha.dataset.date);
                            if (!dataInicio || (dataInicio && dataFim)) {
                                dataInicio = dataClicada;
                                dataFim = null;
                                bolinha.classList.add('selected-start');
                                carregarHorariosDisponiveis(dataClicada, datasIndisponiveis[bolinha.dataset.date]?.horario_final_locacao);
                            } else if (dataClicada >= dataInicio) {
                                dataFim = dataClicada;
                                atualizarSelecao();
                            }
                        });
                    }
                    dataContainer.appendChild(bolinha);
                }
            })
            .catch(error => {
                console.error('Erro ao carregar datas indisponíveis:', error);
            });
    }

    function carregarHorariosDisponiveis(data, horarioFinalLocacao) {
        const horaContainer = document.getElementById('hora-container');
        const horaSelect = document.getElementById('hora_inicio');
        horaSelect.innerHTML = '';

        const horariosDisponiveis = [];
        const inicioHoras = horarioFinalLocacao ? parseInt(horarioFinalLocacao.split(':')[0], 10) + 1 : 8;

        for (let h = inicioHoras; h <= 17; h++) {
            const horario = `${h < 10 ? '0' : ''}${h}:00`;
            horariosDisponiveis.push(horario);
        }

        horariosDisponiveis.forEach(horario => {
            const option = document.createElement('option');
            option.value = horario;
            option.text = horario;
            horaSelect.appendChild(option);
        });

        horaContainer.style.display = 'block';
    }

    function verificarCamposDataHora() {
        const horaInicio = document.getElementById('hora_inicio').value;
        return dataInicio && horaInicio;
    }

    const nextToStep2Button = document.getElementById('nextToStep2');
    if (nextToStep2Button) {
        nextToStep2Button.addEventListener('click', function() {
            if (verificarCamposDataHora()) {
                document.getElementById('step1').style.display = 'none';
                document.getElementById('step2').style.display = 'block';
                document.getElementById('step2').scrollIntoView({ behavior: 'smooth' });
            } else {
                alert("Por favor, selecione a data e o horário de início da locação.");
            }
        });
    }

    const backToStep1Button = document.getElementById('backToStep1');
    if (backToStep1Button) {
        backToStep1Button.addEventListener('click', function() {
            document.getElementById('step2').style.display = 'none';
            document.getElementById('step1').style.display = 'block';
            document.getElementById('step1').scrollIntoView({ behavior: 'smooth' });
        });
    }

    const nextToStep3Button = document.getElementById('nextToStep3');
    if (nextToStep3Button) {
        nextToStep3Button.addEventListener('click', function() {
            document.getElementById('step2').style.display = 'none';
            document.getElementById('step3').style.display = 'block';
            document.getElementById('step3').scrollIntoView({ behavior: 'smooth' });
        });
    }

    const backToStep3Button = document.getElementById('backToStep3');
    if (backToStep3Button) {
        backToStep3Button.addEventListener('click', function() {
            document.getElementById('step4').style.display = 'none';
            document.getElementById('step3').style.display = 'block';
            document.getElementById('step3').scrollIntoView({ behavior: 'smooth' });
        });
    }

    const backToStep3FromStep5Button = document.getElementById('backToStep3FromStep5');
    if (backToStep3FromStep5Button) {
        backToStep3FromStep5Button.addEventListener('click', function() {
            document.getElementById('step5').style.display = 'none';
            document.getElementById('step3').style.display = 'block';
            document.getElementById('step3').scrollIntoView({ behavior: 'smooth' });
        });
    }

    const verifyCPFButton = document.getElementById('verifyCPF');
    if (verifyCPFButton) {
        verifyCPFButton.addEventListener('click', function() {
            const cpf = document.getElementById('cpf').value;
            fetch(`/clientes/verificar/?cpf=${cpf}`)
                .then(response => response.json())
                .then(data => {
                    if (data.error) {
                        document.getElementById("step3").style.display = 'none';
                        document.getElementById("step5").style.display = 'block';
                        document.getElementById('step5').scrollIntoView({ behavior: 'smooth' });
                    } else {
                        document.getElementById('confirm_nome_completo').innerText = data.nome_completo;
                        document.getElementById('confirm_data_nascimento').innerText = data.data_nascimento;
                        document.getElementById('confirm_email').innerText = data.email;
                        document.getElementById('confirm_telefone').innerText = data.telefone;
                        document.getElementById('hidden_cliente_id').value = data.cliente_id;
                        document.getElementById("step3").style.display = 'none';
                        document.getElementById("step4").style.display = 'block';
                        document.getElementById('step4').scrollIntoView({ behavior: 'smooth' });
                    }
                })
                .catch(error => {
                    console.error('Erro ao verificar o CPF:', error);
                });
        });
    }

    const calcularFreteButton = document.querySelector(".calcular-frete");
    if (calcularFreteButton) {
        calcularFreteButton.addEventListener('click', function() {
            const equipId = this.getAttribute('data-equip-id');
            const cep = document.getElementById("cep").value;
            const loadingSpinner = document.getElementById("loading");
            loadingSpinner.style.display = 'block';
            fetch(`/frete/calcular-entrega/?cep=${cep}`)
                .then(response => response.json())
                .then(data => {
                    loadingSpinner.style.display = 'none';
                    if (data.error) {
                        alert(data.error);
                        return;
                    }
                    const valorFrete = data.valor_frete.toFixed(2);
                    const metadeFrete = (valorFrete / 2).toFixed(2);
                    document.getElementById("frete_total_valor").innerText = valorFrete;
                    document.getElementById("entrega_valor").innerText = metadeFrete;
                    document.getElementById("coleta_valor").innerText = metadeFrete;
                    document.getElementById("hidden_frete_total").value = valorFrete;
                    document.getElementById("hidden_frete_entrega").value = metadeFrete;
                    document.getElementById("hidden_frete_coleta").value = metadeFrete;

                    document.getElementById("logradouro").innerText = data.logradouro;
                    document.getElementById("hidden_logradouro").value = data.logradouro;

                    document.getElementById("frete-info").style.display = 'block';
                })
                .catch(error => {
                    loadingSpinner.style.display = 'none';
                    console.error('Erro ao calcular o frete:', error);
                });
        });
    }

    const freteOpcoes = document.querySelectorAll('input[name="frete_opcao"]');
    freteOpcoes.forEach(radio => {
        radio.addEventListener('change', function() {
            document.getElementById('hidden_opcao_frete').value = this.value;
        });
    });

    const numeroInput = document.getElementById('numero');
    if (numeroInput) {
        numeroInput.addEventListener('input', function() {
            document.getElementById('hidden_numero').value = this.value;
        });
    }

    const complementoInput = document.getElementById('complemento');
    if (complementoInput) {
        complementoInput.addEventListener('input', function() {
            document.getElementById('hidden_complemento').value = this.value;
        });
    }

    function previewImage(input, previewContainer) {
        if (input.files && input.files[0]) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const img = document.createElement('img');
                img.src = e.target.result;
                previewContainer.innerHTML = '';
                previewContainer.appendChild(img);
            }
            reader.readAsDataURL(input.files[0]);
        }
    }

    document.getElementById('documento_oficial').addEventListener('change', function() {
        previewImage(this, document.getElementById('documento_oficial_preview'));
    });

    document.getElementById('comprovante_residencia').addEventListener('change', function() {
        previewImage(this, document.getElementById('comprovante_residencia_preview'));
    });

    carregarDatasIndisponiveis();
});

