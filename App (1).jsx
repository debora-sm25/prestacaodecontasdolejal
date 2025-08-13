import { useState } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'
import { BookOpen, FileText, Download } from 'lucide-react'
import './App.css'

// Importando as imagens
import image1 from './assets/image1.png'
import image2 from './assets/image2.png'
import image3 from './assets/image3.png'
import image4 from './assets/image4.png'
import image5 from './assets/image5.png'
import image6 from './assets/image6.png'
import image7 from './assets/image7.png'
import image8 from './assets/image8.png'
import processoExemplo from './assets/processo_exemplo.png'
import logoDolejal from './assets/logodolejal.png'

function App() {
  const [activeTab, setActiveTab] = useState('modelo')
  
  // Estados para o modelo de prestação de contas
  const [formData, setFormData] = useState({
    nomeCliente: '',
    processos: '',
    chaveProcesso: '',
    status: '',
    custasCS: '',
    valorDepositado: '',
    valorPrincipal: '',
    honorariosContratuais: '',
    percentualHonorarios: '',
    percentualSucumbencia: '',
    honorariosSucumbencia: '',
    incluirReembolso: null, // null = não respondido, true = sim, false = não
    tipoReembolso: '',
    reembolsoCustas: '',
    incluirHonorariosCalculo: null, // null = não respondido, true = sim, false = não
    honorariosCalculo: '',
    descontosTotal: '',
    saldoRepasse: '',
    taxaTransferencia: '8,00',
    observacoes: ''
  })

  const [uploadedFile, setUploadedFile] = useState(null)
  const [pastedImage, setPastedImage] = useState(null)

  // Função para formatar valores monetários
  const formatCurrency = (value) => {
    if (!value) return ''
    // Remove tudo que não é dígito
    const numericValue = value.replace(/\D/g, '')
    if (!numericValue) return ''
    
    // Converte para número e formata
    const number = parseFloat(numericValue) / 100
    return number.toLocaleString('pt-BR', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    })
  }

  // Função para validar campos obrigatórios
  const validateRequiredFields = () => {
    let requiredFields = [
      'nomeCliente',
      'processos', 
      'chaveProcesso',
      'status',
      'custasCS',
      'valorDepositado',
      'valorPrincipal',
      'percentualHonorarios',
      'percentualSucumbencia',
      'observacoes'
    ]
    
    // Adicionar campos de reembolso apenas se incluirReembolso for true
    if (formData.incluirReembolso) {
      requiredFields.push('tipoReembolso', 'reembolsoCustas')
    }
    
    const hasImage = uploadedFile || pastedImage
    const hasAnsweredHonorarios = formData.incluirHonorariosCalculo !== null
    const hasAnsweredReembolso = formData.incluirReembolso !== null
    
    const emptyFields = requiredFields.filter(field => !formData[field]?.trim())
    
    return {
      isValid: emptyFields.length === 0 && hasImage && hasAnsweredHonorarios && hasAnsweredReembolso,
      emptyFields,
      hasImage,
      hasAnsweredHonorarios,
      hasAnsweredReembolso
    }
  }

  // Função para calcular progresso de preenchimento
  const calculateProgress = () => {
    let requiredFields = [
      'nomeCliente',
      'processos', 
      'chaveProcesso',
      'status',
      'custasCS',
      'valorDepositado',
      'valorPrincipal',
      'percentualHonorarios',
      'percentualSucumbencia',
      'observacoes'
    ]
    
    // Adicionar campos de reembolso apenas se incluirReembolso for true
    if (formData.incluirReembolso) {
      requiredFields.push('tipoReembolso', 'reembolsoCustas')
    }
    
    const filledFields = requiredFields.filter(field => formData[field]?.trim()).length
    const hasImage = uploadedFile || pastedImage ? 1 : 0
    const hasAnsweredHonorarios = formData.incluirHonorariosCalculo !== null ? 1 : 0
    const hasAnsweredReembolso = formData.incluirReembolso !== null ? 1 : 0
    const totalFields = requiredFields.length + 3 // +1 para a imagem, +1 para honorários, +1 para reembolso
    
    return Math.round(((filledFields + hasImage + hasAnsweredHonorarios + hasAnsweredReembolso) / totalFields) * 100)
  }

  // Função para limpar formulário
  const clearForm = () => {
    setFormData({
      nomeCliente: '',
      processos: '',
      chaveProcesso: '',
      status: '',
      custasCS: '',
      valorDepositado: '',
      valorPrincipal: '',
      honorariosContratuais: '',
      percentualHonorarios: '',
      percentualSucumbencia: '',
      honorariosSucumbencia: '',
      incluirReembolso: null,
      tipoReembolso: '',
      reembolsoCustas: '',
      incluirHonorariosCalculo: null,
      honorariosCalculo: '',
      descontosTotal: '',
      saldoRepasse: '',
      taxaTransferencia: '8,00',
      observacoes: ''
    })
    setUploadedFile(null)
    setPastedImage(null)
  }

  // Função para calcular valores automaticamente
  const calculateValues = (field, value, currentData) => {
    const newData = { ...currentData, [field]: value }
    
    // Converter valores para números
    const valorPrincipal = parseFloat(newData.valorPrincipal?.replace(/[^\d,]/g, '').replace(',', '.')) || 0
    const percentualHonorarios = parseFloat(newData.percentualHonorarios?.replace('%', '')) || 0
    const percentualSucumbencia = parseFloat(newData.percentualSucumbencia?.replace('%', '')) || 0
    const valorDepositado = parseFloat(newData.valorDepositado?.replace(/[^\d,]/g, '').replace(',', '.')) || 0
    const reembolsoCustas = parseFloat(newData.reembolsoCustas?.replace(/[^\d,]/g, '').replace(',', '.')) || 0

    // Calcular honorários contratuais
    if (valorPrincipal && percentualHonorarios) {
      const honorariosContratuais = (valorPrincipal * percentualHonorarios / 100)
      newData.honorariosContratuais = honorariosContratuais.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    }

    // Calcular honorários de cálculo (1%) - apenas se incluirHonorariosCalculo for true
    if (valorPrincipal && newData.incluirHonorariosCalculo) {
      const honorariosCalculo = (valorPrincipal * 1 / 100)
      newData.honorariosCalculo = honorariosCalculo.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    } else if (!newData.incluirHonorariosCalculo) {
      newData.honorariosCalculo = ''
    }

    // Calcular honorários de sucumbência
    if (valorPrincipal && percentualSucumbencia) {
      const honorariosSucumbencia = (valorPrincipal * percentualSucumbencia / 100)
      newData.honorariosSucumbencia = honorariosSucumbencia.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    }

    // Calcular descontos total
    const honorariosContVal = parseFloat(newData.honorariosContratuais?.replace(/[^\d,]/g, '').replace(',', '.')) || 0
    const honorariosSucumVal = parseFloat(newData.honorariosSucumbencia?.replace(/[^\d,]/g, '').replace(',', '.')) || 0
    const honorariosCalcVal = newData.incluirHonorariosCalculo ? (parseFloat(newData.honorariosCalculo?.replace(/[^\d,]/g, '').replace(',', '.')) || 0) : 0
    const reembolsoVal = newData.incluirReembolso ? reembolsoCustas : 0
    
    if (honorariosContVal || honorariosSucumVal || reembolsoVal || honorariosCalcVal) {
      const descontosTotal = honorariosContVal + honorariosSucumVal + reembolsoVal + honorariosCalcVal
      newData.descontosTotal = descontosTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
      
      // Calcular saldo de repasse
      if (valorDepositado) {
        const saldoRepasse = valorDepositado - descontosTotal
        newData.saldoRepasse = saldoRepasse.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
      }
    }

    return newData
  }

  const handleInputChange = (field, value) => {
    // Aplicar formatação monetária para campos de valor
    const currencyFields = ['custasCS', 'valorDepositado', 'valorPrincipal', 'reembolsoCustas']
    if (currencyFields.includes(field)) {
      value = formatCurrency(value)
    }
    
    const newData = calculateValues(field, value, formData)
    setFormData(newData)
  }

  const handleFileUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      setUploadedFile(file)
    }
  }

  const handlePaste = (event) => {
    const items = event.clipboardData.items
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const blob = items[i].getAsFile()
        const reader = new FileReader()
        reader.onload = (e) => {
          setPastedImage(e.target.result)
        }
        reader.readAsDataURL(blob)
        break
      }
    }
  }

  const handlePrintPreview = () => {
    const validation = validateRequiredFields()
    
    if (!validation.isValid) {
      let message = "Revise seu documento, pois existem campos obrigatórios em branco."
      if (!validation.hasImage) {
        message += "\n\nVocê também precisa anexar os prints dos cálculos do processo."
      }
      if (!validation.hasAnsweredHonorarios) {
        message += "\n\nVocê precisa responder se deseja incluir os honorários de cálculo do processo."
      }
      if (!validation.hasAnsweredReembolso) {
        message += "\n\nVocê precisa responder se deseja incluir reembolso para o escritório."
      }
      alert(message)
      return
    }
    
    // Obter o conteúdo do preview
    const printContent = document.getElementById('prestacao-preview')
    
    // Criar o HTML completo
    const htmlContent = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Prestação de Contas - ${formData.nomeCliente || 'Cliente'}</title>
    <style>
        @page {
            size: A4;
            margin: 1.5cm 2cm 1.5cm 2cm;
        }
        body {
            font-family: "Times New Roman", Times, serif;
            font-size: 11pt;
            line-height: 1.2;
            margin: 0;
            padding: 1.5cm 2cm 1.5cm 2cm;
            color: black;
            background: white;
            width: 21cm;
            min-height: 29.7cm;
            box-sizing: border-box;
        }
        .header {
            text-align: center;
            margin-bottom: 0.3cm;
            height: 1.2cm;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .logo {
            height: 100%;
            max-height: 1.2cm;
        }
        .logo img {
            height: 100%;
            max-height: 1.2cm;
            width: auto;
        }
        h2 {
            font-weight: bold;
            font-size: 13pt;
            margin-bottom: 0.4cm;
            margin-top: 0.1cm;
            text-align: center;
        }
        p {
            margin-bottom: 0.2cm;
        }
        .anexo {
            margin-bottom: 0.3cm;
            padding: 0.3cm;
            border: 1px solid #ccc;
            border-radius: 4px;
            page-break-inside: avoid;
        }
        .anexo p {
            font-weight: bold;
            margin-bottom: 0.1cm;
        }
        .anexo img {
            max-width: 100%;
            height: auto;
            min-height: 200px;
            image-rendering: -webkit-optimize-contrast;
            image-rendering: crisp-edges;
            image-rendering: pixelated;
        }
        .descontos {
            margin-bottom: 0.2cm;
        }
        .descontos-titulo {
            font-weight: bold;
            margin-bottom: 0.1cm;
        }
        .descontos-lista {
            margin-left: 0.6cm;
        }
        .descontos-lista p {
            margin-bottom: 0.1cm;
        }
        .observacoes {
            margin-bottom: 0.2cm;
        }
        .observacoes-titulo {
            font-weight: bold;
            margin-bottom: 0.1cm;
        }
        @media print {
            body {
                margin: 1.5cm 2cm 1.5cm 2cm !important;
                padding: 1.5cm 2cm 1.5cm 2cm !important;
                font-size: 11pt !important;
                line-height: 1.2 !important;
            }
            .header {
                height: 1.2cm !important;
                margin-bottom: 0.3cm !important;
            }
            .logo img {
                max-height: 1.2cm !important;
            }
            h2 {
                margin-bottom: 0.4cm !important;
                margin-top: 0.1cm !important;
                font-size: 13pt !important;
            }
            p {
                margin-bottom: 0.2cm !important;
            }
            .anexo {
                margin-bottom: 0.3cm !important;
                padding: 0.3cm !important;
            }
            .anexo img {
                min-height: 200px !important;
            }
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="logo">
            <img src="${logoDolejal}" alt="Dolejal Advocacia Especializada" />
        </div>
    </div>
    ${printContent.innerHTML.replace(/<div class="header"[^>]*>.*?<\/div>/s, '')}
</body>
</html>`
    
    // Criar uma nova janela com o HTML
    const printWindow = window.open('', '_blank')
    printWindow.document.write(htmlContent)
    printWindow.document.close()
    
    // Aguardar o carregamento e então imprimir como PDF
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.print()
        // Fechar a janela após um tempo
        setTimeout(() => {
          printWindow.close()
        }, 1000)
      }, 500)
    }
  }

  const statusExamples = [
    "aguarda julgamento dos embargos de declaração e prazo para interpor recurso especial",
    "aguarda julgamento do recurso especial interposto pelo réu",
    "aguarda prazo para interpor recurso especial",
    "aguarda ser pago mais alguma quantia da condenação",
    "aguarda complemento de custas do cumprimento de sentença",
    "aguarda trânsito em julgado",
    "transitado em julgado"
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <img src={logoDolejal} alt="Dolejal Advocacia Especializada" className="h-16 md:h-20" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Manual de Prestação de Contas
          </h1>
          <p className="text-lg text-gray-600">
            Guia completo para elaboração da prestação de contas aos clientes
          </p>
        </header>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="modelo" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Modelo de Prestação
            </TabsTrigger>
            <TabsTrigger value="manual" className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Manual de Execução
            </TabsTrigger>
          </TabsList>

          <TabsContent value="modelo">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Modelo de Prestação de Contas
                </CardTitle>
                <CardDescription>
                  Template editável para elaboração da prestação de contas aos clientes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  
                  {/* Barra de Progresso */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">Progresso do Preenchimento</span>
                      <span className="text-sm font-medium text-gray-700">{calculateProgress()}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" 
                        style={{ width: `${calculateProgress()}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {calculateProgress() === 100 ? 
                        "✅ Todos os campos obrigatórios foram preenchidos!" : 
                        "Preencha todos os campos obrigatórios para gerar o PDF"
                      }
                    </p>
                  </div>
                  
                  {/* Formulário editável */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="nomeCliente">Nome do Cliente <span style={{backgroundColor: '#ffff00', color: '#000000', padding: '2px 4px', borderRadius: '3px', fontSize: '10px'}}>(preencher)</span></Label>
                      <Input
                        id="nomeCliente"
                        value={formData.nomeCliente}
                        onChange={(e) => handleInputChange('nomeCliente', e.target.value)}
                        placeholder="Nome completo do cliente"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="processos">Números dos Processos <span style={{backgroundColor: '#ffff00', color: '#000000', padding: '2px 4px', borderRadius: '3px', fontSize: '10px'}}>(preencher)</span></Label>
                      <Input
                        id="processos"
                        value={formData.processos}
                        onChange={(e) => handleInputChange('processos', e.target.value)}
                        placeholder="Nº cumprimento e nº conhecimento"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="chaveProcesso">Chaves dos Processos <span style={{backgroundColor: '#ffff00', color: '#000000', padding: '2px 4px', borderRadius: '3px', fontSize: '10px'}}>(preencher)</span></Label>
                      <Input
                        id="chaveProcesso"
                        value={formData.chaveProcesso}
                        onChange={(e) => handleInputChange('chaveProcesso', e.target.value)}
                        placeholder="Chaves de acesso"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="status">Status do Processo <span style={{backgroundColor: '#ffff00', color: '#000000', padding: '2px 4px', borderRadius: '3px', fontSize: '10px'}}>(preencher)</span></Label>
                      <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o status" />
                        </SelectTrigger>
                        <SelectContent>
                          {statusExamples.map((status, index) => (
                            <SelectItem key={index} value={status}>
                              {status}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="custasCS">Custas Cumprimento de Sentença <span style={{backgroundColor: '#ffff00', color: '#000000', padding: '2px 4px', borderRadius: '3px', fontSize: '10px'}}>(preencher)</span></Label>
                      <Input
                        id="custasCS"
                        value={formData.custasCS}
                        onChange={(e) => handleInputChange('custasCS', e.target.value)}
                        placeholder="R$ 0,00"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="valorDepositado">Valor Depositado pelo Réu <span style={{backgroundColor: '#ffff00', color: '#000000', padding: '2px 4px', borderRadius: '3px', fontSize: '10px'}}>(preencher)</span></Label>
                      <Input
                        id="valorDepositado"
                        value={formData.valorDepositado}
                        onChange={(e) => handleInputChange('valorDepositado', e.target.value)}
                        placeholder="R$ 0,00"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="valorPrincipal">Valor Principal do Processo <span style={{backgroundColor: '#ffff00', color: '#000000', padding: '2px 4px', borderRadius: '3px', fontSize: '10px'}}>(preencher)</span></Label>
                      <Input
                        id="valorPrincipal"
                        value={formData.valorPrincipal}
                        onChange={(e) => handleInputChange('valorPrincipal', e.target.value)}
                        placeholder="R$ 0,00"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="percentualHonorarios">Percentual Honorários Contratuais <span style={{backgroundColor: '#ffff00', color: '#000000', padding: '2px 4px', borderRadius: '3px', fontSize: '10px'}}>(preencher)</span></Label>
                      <Input
                        id="percentualHonorarios"
                        value={formData.percentualHonorarios}
                        onChange={(e) => handleInputChange('percentualHonorarios', e.target.value)}
                        placeholder="15%"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="honorariosContratuais">Honorários Contratuais</Label>
                      <Input
                        id="honorariosContratuais"
                        value={formData.honorariosContratuais}
                        readOnly
                        placeholder="R$ 0,00"
                        style={{backgroundColor: '#f5f5f5'}}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="percentualSucumbencia">Percentual de Sucumbência <span style={{backgroundColor: '#ffff00', color: '#000000', padding: '2px 4px', borderRadius: '3px', fontSize: '10px'}}>(preencher)</span></Label>
                      <Input
                        id="percentualSucumbencia"
                        value={formData.percentualSucumbencia}
                        onChange={(e) => handleInputChange('percentualSucumbencia', e.target.value)}
                        placeholder="10%"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="honorariosSucumbencia">Honorários de Sucumbência</Label>
                      <Input
                        id="honorariosSucumbencia"
                        value={formData.honorariosSucumbencia}
                        readOnly
                        placeholder="R$ 0,00"
                        style={{backgroundColor: '#f5f5f5'}}
                      />
                    </div>
                    
                    <div>
                      <Label>Incluir Reembolso para o escritório? <span style={{backgroundColor: '#ffff00', color: '#000000', padding: '2px 4px', borderRadius: '3px', fontSize: '10px'}}>(obrigatório)</span></Label>
                      <div className="flex gap-4 mt-2">
                        <label className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="incluirReembolso"
                            value="true"
                            checked={formData.incluirReembolso === true}
                            onChange={() => handleInputChange('incluirReembolso', true)}
                          />
                          Sim
                        </label>
                        <label className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="incluirReembolso"
                            value="false"
                            checked={formData.incluirReembolso === false}
                            onChange={() => handleInputChange('incluirReembolso', false)}
                          />
                          Não
                        </label>
                      </div>
                    </div>
                    
                    {formData.incluirReembolso && (
                      <>
                        <div>
                          <Label htmlFor="tipoReembolso">Tipo de Reembolso <span style={{backgroundColor: '#ffff00', color: '#000000', padding: '2px 4px', borderRadius: '3px', fontSize: '10px'}}>(preencher)</span></Label>
                          <Select value={formData.tipoReembolso} onValueChange={(value) => handleInputChange('tipoReembolso', value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o tipo de reembolso" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Reembolso custas apelação">Reembolso custas apelação</SelectItem>
                              <SelectItem value="Reembolso custas agravo">Reembolso custas agravo</SelectItem>
                              <SelectItem value="Reembolso custas iniciais">Reembolso custas iniciais</SelectItem>
                              <SelectItem value="Reembolso custas apelação e agravo">Reembolso custas apelação e agravo</SelectItem>
                              <SelectItem value="Reembolso custas apelação e iniciais">Reembolso custas apelação e iniciais</SelectItem>
                              <SelectItem value="Reembolso custas iniciais e agravo">Reembolso custas iniciais e agravo</SelectItem>
                              <SelectItem value="Reembolso custas apelação, agravo e iniciais">Reembolso custas apelação, agravo e iniciais</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div>
                          <Label htmlFor="reembolsoCustas">Valor do Reembolso <span style={{backgroundColor: '#ffff00', color: '#000000', padding: '2px 4px', borderRadius: '3px', fontSize: '10px'}}>(preencher)</span></Label>
                          <Input
                            id="reembolsoCustas"
                            value={formData.reembolsoCustas}
                        onChange={(e) => handleInputChange('reembolsoCustas', e.target.value)}
                        placeholder="R$ 0,00"
                      />
                        </div>
                      </>
                    )}
                    
                    <div className="col-span-full">
                      <Label className="text-sm font-medium mb-3 block">
                        Incluir Honorários de Cálculo do Processo (1%)? <span style={{backgroundColor: '#ffff00', color: '#000000', padding: '2px 4px', borderRadius: '3px', fontSize: '10px'}}>(obrigatório)</span>
                      </Label>
                      <div className="flex items-center space-x-6">
                        <div className="flex items-center space-x-2">
                          <input
                            type="radio"
                            id="incluirHonorariosCalculo-sim"
                            name="incluirHonorariosCalculo"
                            checked={formData.incluirHonorariosCalculo === true}
                            onChange={() => handleInputChange('incluirHonorariosCalculo', true)}
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                          />
                          <Label htmlFor="incluirHonorariosCalculo-sim" className="text-sm font-medium">
                            Sim
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="radio"
                            id="incluirHonorariosCalculo-nao"
                            name="incluirHonorariosCalculo"
                            checked={formData.incluirHonorariosCalculo === false}
                            onChange={() => handleInputChange('incluirHonorariosCalculo', false)}
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                          />
                          <Label htmlFor="incluirHonorariosCalculo-nao" className="text-sm font-medium">
                            Não
                          </Label>
                        </div>
                        {formData.incluirHonorariosCalculo === true && (
                          <div className="flex-1">
                            <Input
                              id="honorariosCalculo"
                              value={formData.honorariosCalculo}
                              readOnly
                              placeholder="R$ 0,00"
                              style={{backgroundColor: '#f5f5f5'}}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="descontosTotal">Descontos sobre o Total Geral</Label>
                      <Input
                        id="descontosTotal"
                        value={formData.descontosTotal}
                        readOnly
                        placeholder="R$ 0,00"
                        style={{backgroundColor: '#f5f5f5'}}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="saldoRepasse">Saldo de Repasse ao Cliente</Label>
                      <Input
                        id="saldoRepasse"
                        value={formData.saldoRepasse}
                        readOnly
                        placeholder="R$ 0,00"
                        style={{backgroundColor: '#f5f5f5'}}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="taxaTransferencia">Taxa de Transferência</Label>
                      <Input
                        id="taxaTransferencia"
                        value={formData.taxaTransferencia}
                        readOnly
                        style={{backgroundColor: '#f5f5f5'}}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="observacoes">Observações <span style={{backgroundColor: '#ffff00', color: '#000000', padding: '2px 4px', borderRadius: '3px', fontSize: '10px'}}>(preencher)</span></Label>
                    <Textarea
                      id="observacoes"
                      value={formData.observacoes}
                      onChange={(e) => handleInputChange('observacoes', e.target.value)}
                      placeholder="Observações adicionais sobre o status do processo..."
                      rows={3}
                    />
                  </div>
                  
                  {/* Botão Limpar Formulário */}
                  <div className="flex justify-center">
                    <button 
                      onClick={clearForm}
                      className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-medium inline-flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Limpar Formulário
                    </button>
                  </div>
                  
                  {/* Campo de upload para prints dos cálculos */}
                  <div className="col-span-full">
                    <Label htmlFor="calculosUpload">Anexar Prints dos Cálculos do Processo <span style={{backgroundColor: '#ffff00', color: '#000000', padding: '2px 4px', borderRadius: '3px', fontSize: '10px'}}>(preencher)</span></Label>
                    <div 
                      className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10"
                      onPaste={handlePaste}
                      tabIndex={0}
                      style={{ outline: 'none' }}
                    >
                      <div className="text-center">
                        {pastedImage ? (
                          <div className="space-y-4">
                            <img src={pastedImage} alt="Imagem colada" className="max-w-full max-h-64 mx-auto rounded" />
                            <button 
                              onClick={() => setPastedImage(null)}
                              className="text-red-600 hover:text-red-800 text-sm"
                            >
                              Remover imagem
                            </button>
                          </div>
                        ) : (
                          <>
                            <svg className="mx-auto h-12 w-12 text-gray-300" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                              <path fillRule="evenodd" d="M1.5 6a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0119.5 6v6a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 12V6zM3 16.06V18a2.25 2.25 0 002.25 2.25h13.5A2.25 2.25 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z" clipRule="evenodd" />
                            </svg>
                            <div className="mt-4 flex text-sm leading-6 text-gray-600">
                              <label htmlFor="calculosUpload" className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500">
                                <span>Clique para fazer upload</span>
                                <input 
                                  id="calculosUpload" 
                                  name="calculosUpload" 
                                  type="file" 
                                  className="sr-only" 
                                  accept="image/*,.pdf"
                                  onChange={handleFileUpload}
                                />
                              </label>
                              <p className="pl-1">ou arraste e solte</p>
                            </div>
                            <p className="text-xs leading-5 text-gray-600">PNG, JPG, PDF até 10MB</p>
                            <p className="text-xs leading-5 text-blue-600 font-medium">
                              💡 Dica: Você também pode colar uma imagem aqui usando Ctrl+V
                            </p>
                            {uploadedFile && (
                              <div className="mt-2 text-sm text-green-600">
                                Arquivo selecionado: {uploadedFile.name}
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Preview do documento */}
                  <div className="mt-8">
                    <h4 className="text-lg font-semibold mb-4">Preview da Prestação de Contas</h4>
                    <div 
                      id="prestacao-preview" 
                      className="bg-white p-8 rounded-lg border shadow-sm"
                      style={{
                        fontFamily: '"Times New Roman", Times, serif',
                        fontSize: '12pt',
                        lineHeight: '1.5',
                        margin: '2.54cm',
                        color: '#000'
                      }}
                    >
                      <style jsx>{`
                        @media print {
                          #prestacao-preview {
                            margin: 2.54cm !important;
                            padding: 0 !important;
                            border: none !important;
                            box-shadow: none !important;
                            border-radius: 0 !important;
                            background: white !important;
                          }
                          #prestacao-preview * {
                            font-family: "Times New Roman", Times, serif !important;
                            font-size: 12pt !important;
                            line-height: 1.5 !important;
                            color: black !important;
                          }
                          #prestacao-preview h2 {
                            font-weight: bold !important;
                            font-size: 14pt !important;
                            margin-bottom: 1cm !important;
                          }
                          #prestacao-preview p {
                            margin-bottom: 0.8cm !important;
                          }
                        }
                      `}</style>
                      
                      <div className="header" style={{ 
                        textAlign: 'center', 
                        marginBottom: '2cm',
                        height: '3cm',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <div className="logo" style={{ 
                          height: '60%',
                          maxHeight: '1.8cm'
                        }}>
                          <img src={logoDolejal} alt="Dolejal Advocacia Especializada" style={{ 
                            height: '100%',
                            maxHeight: '1.8cm',
                            width: 'auto'
                          }} />
                        </div>
                      </div>
                      
                      <h2 style={{ 
                        fontWeight: 'bold', 
                        fontSize: '14pt', 
                        marginBottom: '1cm',
                        textAlign: 'center',
                        fontFamily: '"Times New Roman", Times, serif'
                      }}>
                        PRESTAÇÃO DE CONTAS
                      </h2>
                      
                      <div style={{ lineHeight: '1.5' }}>
                        <p style={{ 
                          marginBottom: '0.4cm',
                          fontFamily: '"Times New Roman", Times, serif',
                          fontSize: '12pt'
                        }}>
                          <strong>Cliente:</strong> {formData.nomeCliente || '[NOME COMPLETO DO CLIENTE]'}
                        </p>
                        
                        <p style={{ 
                          marginBottom: '0.4cm',
                          fontFamily: '"Times New Roman", Times, serif',
                          fontSize: '12pt'
                        }}>
                          <strong>Processos:</strong> {formData.processos || '[NÚMERO DO PROCESSO DE CUMPRIMENTO DE SENTENÇA] e [NÚMERO DO PROCESSO DE CONHECIMENTO]'}
                        </p>
                        
                        <p style={{ 
                          marginBottom: '0.4cm',
                          fontFamily: '"Times New Roman", Times, serif',
                          fontSize: '12pt'
                        }}>
                          <strong>Chave Processo:</strong> {formData.chaveProcesso || '[CHAVE DO PROCESSO DE CUMPRIMENTO DE SENTENÇA] e [CHAVE DO PROCESSO DE CONHECIMENTO]'}
                        </p>
                        
                        <p style={{ 
                          marginBottom: '0.4cm',
                          fontFamily: '"Times New Roman", Times, serif',
                          fontSize: '12pt',
                          fontStyle: 'italic'
                        }}>
                          *Todos os documentos podem ser consultados no site: https://www.tjrs.jus.br/novo/busca/?return=proc&client=wp_index
                        </p>
                        
                        <p style={{ 
                          marginBottom: '0.4cm',
                          fontFamily: '"Times New Roman", Times, serif',
                          fontSize: '12pt'
                        }}>
                          <strong>Status:</strong> {formData.status || '[STATUS ATUAL DO PROCESSO]'}
                        </p>
                        
                        <p style={{ 
                          marginBottom: '0.4cm',
                          fontFamily: '"Times New Roman", Times, serif',
                          fontSize: '12pt'
                        }}>
                          <strong>Valor total da condenação provisória, incluindo honorários de sucumbência e contratual:</strong>
                        </p>
                        
                        {(uploadedFile || pastedImage) && (
                          <div style={{ 
                            marginBottom: '0.4cm',
                            padding: '0.5cm',
                            border: '1px solid #ccc',
                            borderRadius: '4px'
                          }}>
                            <p style={{ 
                              fontFamily: '"Times New Roman", Times, serif',
                              fontSize: '12pt',
                              fontWeight: 'bold',
                              marginBottom: '0.2cm'
                            }}>
                              📎 Anexo - Prints dos Cálculos:
                            </p>
                            {pastedImage ? (
                              <img src={pastedImage} alt="Print dos cálculos" style={{ maxWidth: '100%', height: 'auto' }} />
                            ) : (
                              <p style={{ 
                                fontFamily: '"Times New Roman", Times, serif',
                                fontSize: '12pt'
                              }}>
                                {uploadedFile.name}
                              </p>
                            )}
                          </div>
                        )}
                        
                        <p style={{ 
                          marginBottom: '0.4cm',
                          fontFamily: '"Times New Roman", Times, serif',
                          fontSize: '12pt',
                          fontStyle: 'italic'
                        }}>
                          *Custas cumprimento de sentença: {formData.custasCS || 'R$[VALOR DAS CUSTAS DE CUMPRIMENTO DE SENTENÇA]'}
                        </p>
                        
                        <p style={{ 
                          marginBottom: '0.4cm',
                          fontFamily: '"Times New Roman", Times, serif',
                          fontSize: '12pt'
                        }}>
                          <strong>Valor provisório depositado pelo réu:</strong> {formData.valorDepositado || 'R$[VALOR TOTAL DEPOSITADO PELO RÉU]'}
                        </p>
                        
                        <div style={{ marginBottom: '0.4cm' }}>
                          <p style={{ 
                            fontFamily: '"Times New Roman", Times, serif',
                            fontSize: '12pt',
                            fontWeight: 'bold',
                            marginBottom: '0.3cm'
                          }}>
                            Descontos sobre o total geral:
                          </p>
                          <div style={{ marginLeft: '1cm' }}>
                            <p style={{ 
                              marginBottom: '0.2cm',
                              fontFamily: '"Times New Roman", Times, serif',
                              fontSize: '12pt'
                            }}>
                              1. Honorários contratuais de {formData.percentualHonorarios || '[PERCENTUAL]'}% (pagos pelo cliente): {formData.honorariosContratuais || 'R$[VALOR DOS HONORÁRIOS CONTRATUAIS]'}
                            </p>
                            <p style={{ 
                              marginBottom: '0.2cm',
                              fontFamily: '"Times New Roman", Times, serif',
                              fontSize: '12pt'
                            }}>
                              2. Honorários de sucumbência (pagos pelo réu): {formData.honorariosSucumbencia || 'R$[VALOR DOS HONORÁRIOS DE SUCUMBÊNCIA]'}
                            </p>
                            <p style={{ 
                              marginBottom: '0.2cm',
                              fontFamily: '"Times New Roman", Times, serif',
                              fontSize: '12pt'
                            }}>
                              3. {formData.tipoReembolso || 'Reembolso custas'} pagas pelo escritório: {formData.reembolsoCustas || 'R$[VALOR DO REEMBOLSO DE CUSTAS]'}
                            </p>
                            {formData.incluirHonorariosCalculo && (
                              <p style={{ 
                                marginBottom: '0.2cm',
                                fontFamily: '"Times New Roman", Times, serif',
                                fontSize: '12pt'
                              }}>
                                4. Honorários de cálculo do processo (1%): {formData.honorariosCalculo || 'R$[VALOR DOS HONORÁRIOS DE CÁLCULO]'}
                              </p>
                            )}
                          </div>
                        </div>
                        
                        <p style={{ 
                          marginBottom: '0.4cm',
                          fontFamily: '"Times New Roman", Times, serif',
                          fontSize: '12pt',
                          fontWeight: 'bold'
                        }}>
                          <strong>Descontos Totais:</strong> R${formData.descontosTotal || '[VALOR TOTAL DOS DESCONTOS]'}
                        </p>
                        
                        <p style={{ 
                          marginBottom: '0.4cm',
                          fontFamily: '"Times New Roman", Times, serif',
                          fontSize: '12pt'
                        }}>
                          <strong>Saldo provisório de repasse ao cliente:</strong> {formData.saldoRepasse || <span style={{fontWeight: 'bold'}}>R$[VALOR LÍQUIDO DE REPASSE AO CLIENTE]</span>}
                        </p>
                        
                        <p style={{ 
                          marginBottom: '0.4cm',
                          fontFamily: '"Times New Roman", Times, serif',
                          fontSize: '12pt',
                          fontStyle: 'italic'
                        }}>
                          *Taxa de transferência: R${formData.taxaTransferencia}.
                        </p>
                        <p style={{ 
                          fontFamily: '"Times New Roman", Times, serif',
                          fontSize: '12pt',
                          fontStyle: 'italic',
                          marginBottom: '0.4cm'
                        }}>
                          *O valor recebido ainda sofre correção monetária entre a data da solicitação do alvará e a data de transferência, razão pela qual pode ter acréscimo na quantia "saldo de repasse ao cliente".
                        </p>
                        
                        {formData.observacoes && (
                          <div style={{ marginBottom: '0.4cm' }}>
                            <p style={{ 
                              fontFamily: '"Times New Roman", Times, serif',
                              fontSize: '12pt',
                              fontWeight: 'bold',
                              marginBottom: '0.3cm'
                            }}>
                              Observações:
                            </p>
                            <p style={{ 
                              fontFamily: '"Times New Roman", Times, serif',
                              fontSize: '12pt',
                              fontStyle: 'italic'
                            }}>
                              *{formData.observacoes}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Botão de geração PDF */}
                    <div className="mt-4 text-center">
                      <button 
                        onClick={handlePrintPreview}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium inline-flex items-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a1 1 0 001-1v-4a1 1 0 00-1-1H9a1 1 0 00-1 1v4a1 1 0 001 1zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                        </svg>
                        Gerar PDF
                      </button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="manual">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5" />
                    Manual de Execução da Prestação de Contas
                  </CardTitle>
                  <CardDescription>
                    Este manual detalha o passo a passo para a elaboração da prestação de contas aos clientes, utilizando as informações disponíveis no Eproc.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                  
                  <section>
                    <h3 className="text-xl font-semibold mb-4">1. Abertura e Preenchimento Inicial do Modelo</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-lg font-medium mb-3">1.1. Abertura do Modelo</h4>
                        <p className="text-gray-700">Abra o modelo de prestação de contas.</p>
                      </div>

                      <div>
                        <h4 className="text-lg font-medium mb-3">1.2. Preenchimento dos Dados do Cliente</h4>
                        <p className="text-gray-700">Preencha o nome completo do cliente.</p>
                      </div>

                      <div>
                        <h4 className="text-lg font-medium mb-3">1.3. Inserção dos Números dos Processos</h4>
                        <p className="text-gray-700 mb-3">Insira o número do processo de cumprimento de sentença e o número do processo de conhecimento.</p>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <p className="text-sm text-gray-600 mb-2">Exemplo de onde localizar os números dos processos no Eproc:</p>
                          <img src={processoExemplo} alt="Exemplo de localização dos números dos processos" className="max-w-full h-auto rounded border" />
                        </div>
                      </div>
                    </div>
                  </section>

                  <section>
                    <h3 className="text-xl font-semibold mb-4">2. Obtenção das Chaves de Acesso</h3>
                    <div className="space-y-4">
                      <p className="text-gray-700">Para obter as chaves de acesso:</p>
                      
                      <div>
                        <h4 className="text-lg font-medium mb-3">2.1. Chave do Processo de Cumprimento de Sentença</h4>
                        <p className="text-gray-700 mb-3">No Eproc, vá em 'Informações Adicionais' e clique na chave do processo de cumprimento de sentença.</p>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <img src={image2} alt="Chave de Acesso 1" className="max-w-full h-auto rounded border" />
                        </div>
                      </div>

                      <div>
                        <h4 className="text-lg font-medium mb-3">2.2. Chave do Processo de Conhecimento</h4>
                        <p className="text-gray-700 mb-3">Repita o processo para o processo de origem (conhecimento), clicando no processo relacionado e obtendo sua chave.</p>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <img src={image3} alt="Chave de Acesso 2" className="max-w-full h-auto rounded border" />
                        </div>
                      </div>
                    </div>
                  </section>

                  <section>
                    <h3 className="text-xl font-semibold mb-4">3. Consulta e Verificação de Documentos</h3>
                    <div className="space-y-4">
                      <p className="text-gray-700">O modelo de prestação de contas já indica o site oficial para consulta:</p>
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <p className="text-blue-800 font-mono">https://www.tjrs.jus.br/novo/busca/?return=proc&client=wp_index</p>
                      </div>
                    </div>
                  </section>

                  <section>
                    <h3 className="text-xl font-semibold mb-4">4. Identificação de Valores</h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-lg font-medium mb-3">4.1. Valor Cobrado (Cálculo do Evento 1)</h4>
                        <p className="text-gray-700 mb-3">O valor cobrado geralmente pode ser encontrado no 'resumo do cálculo' do evento 1. Recomenda-se tirar um print dessa tela para documentação.</p>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <img src={image4} alt="Resumo do Cálculo" className="max-w-full h-auto rounded border" />
                        </div>
                      </div>

                      <div>
                        <h4 className="text-lg font-medium mb-3">4.2. Custas do Cumprimento de Sentença</h4>
                        <p className="text-gray-700">Verifique se há custas adicionais do cumprimento de sentença e indique o valor extra, se aplicável.</p>
                      </div>

                      <div>
                        <h4 className="text-lg font-medium mb-3">4.3. Valor Total Provisório Depositado pelo Réu</h4>
                        <p className="text-gray-700 mb-3">Este valor pode ser encontrado na aba 'Depósitos Judiciais' no Eproc ou no comprovante de depósito. Observe as datas dos depósitos, pois pode haver depósitos complementares.</p>
                        <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                          <img src={image5} alt="Depósitos Judiciais 1" className="max-w-full h-auto rounded border" />
                          <img src={image6} alt="Depósitos Judiciais 2" className="max-w-full h-auto rounded border" />
                        </div>
                      </div>
                    </div>
                  </section>

                  <section>
                    <h3 className="text-xl font-semibold mb-4">5. Detalhamento dos Descontos</h3>
                    <div className="space-y-4">
                      <p className="text-gray-700">Indique os valores que foram abatidos do total provisório depositado:</p>
                      
                      <div>
                        <h4 className="text-lg font-medium mb-3">5.1. Honorários Contratuais</h4>
                        <div className="space-y-3">
                          <p className="text-gray-700"><strong>Percentual:</strong> Verifique o percentual no contrato, que geralmente está anexado ao evento do alvará.</p>
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <img src={image7} alt="Honorários Contratuais 1" className="max-w-full h-auto rounded border" />
                          </div>
                          <p className="text-gray-700"><strong>Base de Cálculo:</strong> A quantia é calculada apenas sobre o crédito do cliente, excluindo custas e sucumbência.</p>
                          <p className="text-gray-700"><strong>Verificação:</strong> Consulte petições anteriores, pois o cálculo pode já ter sido realizado.</p>
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <img src={image8} alt="Honorários Contratuais 2" className="max-w-full h-auto rounded border" />
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-lg font-medium mb-3">5.2. Honorários de Sucumbência</h4>
                        <p className="text-gray-700">Indique o valor dos honorários de sucumbência.</p>
                      </div>

                      <div>
                        <h4 className="text-lg font-medium mb-3">5.3. Reembolso de Custas</h4>
                        <p className="text-gray-700">Inclua o reembolso de custas de apelação, agravo ou iniciais, caso tenham sido pagas pelo escritório.</p>
                      </div>

                      <div>
                        <h4 className="text-lg font-medium mb-3">5.4. Honorários de Cálculos do Processo</h4>
                        <p className="text-gray-700">Indique o valor dos honorários de cálculos do Processo.</p>
                      </div>
                    </div>
                  </section>

                  <section>
                    <h3 className="text-xl font-semibold mb-4">6. Cálculo do Valor Líquido de Repasse</h3>
                    <p className="text-gray-700">Após informar todos os descontos, calcule e indique o valor líquido a ser repassado ao cliente.</p>
                  </section>

                  <section>
                    <h3 className="text-xl font-semibold mb-4">7. Taxa de Transferência</h3>
                    <p className="text-gray-700">Informe o valor da taxa de transferência: <strong>R$8,00</strong></p>
                  </section>

                  <section>
                    <h3 className="text-xl font-semibold mb-4">8. Status Técnico dos Processos</h3>
                    <p className="text-gray-700 mb-4">Descreva o status técnico atual dos processos. Exemplos de status:</p>
                    <div className="grid gap-3">
                      {statusExamples.map((status, index) => (
                        <Badge key={index} variant="secondary" className="p-3 text-sm leading-relaxed">
                          {status}
                        </Badge>
                      ))}
                    </div>
                  </section>

                  <section>
                    <h3 className="text-xl font-semibold mb-4">9. Observações Adicionais</h3>
                    <p className="text-gray-700">Adicione observações informais para explicar o status técnico do processo de forma clara ao cliente, como a expectativa de recursos ou reembolsos de valores.</p>
                  </section>

                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default App

