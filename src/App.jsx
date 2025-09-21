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
    outroStatus: '',
    custasJudiciais: [], // Array de custas judiciais
    incluirHonorariosCalculo: null, // null = não respondido, true = sim, false = não
    honorariosCalculo: '',
    incluirMultaArt523: null, // null = não respondido, true = sim, false = não
    dataCalculoMulta: '', // Data do cálculo da multa
    dataCalculoCustas: '', // Data do cálculo das custas
    valorPrincipalMulta: '', // Valor principal para multa
    valorPrincipalCorrigido: '', // Valor principal corrigido
    jurosPrincipal: '', // Juros do valor principal
    totalPrincipal: '', // Total do valor principal
    valorCustasMulta: '', // Valor das custas para multa
    valorCustasCorrigido: '', // Valor das custas corrigido
    jurosCustas: '', // Juros das custas
    totalCustas: '', // Total das custas
    totalGeralMulta: '', // Total geral da multa
    honorariosSucumbenciaMulta: '', // Honorários de sucumbência da multa
    multa523: '', // Multa do 523 (10% do total geral)
    tipoValores: null, // null = não respondido, 'provisorio' = provisório, 'final' = final
    descontosTotal: '',
    saldoRepasse: '',
    taxaTransferencia: '8,00',
    observacoes: ''
  })

  const [uploadedFiles, setUploadedFiles] = useState([])
  const [pastedImages, setPastedImages] = useState([])

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
    
    // Campos de reembolso não são mais necessários pois foram substituídos por custas judiciais

    // Se escolher "Outro Status", exigir a descrição
    if (formData.status === 'Outro Status') {
      requiredFields.push('outroStatus')
    }
    
    const hasImage = uploadedFiles.length > 0 || pastedImages.length > 0
    const hasAnsweredHonorarios = formData.incluirHonorariosCalculo !== null
    const hasAnsweredReembolso = formData.incluirReembolso !== null
    const hasCustasJudiciais = formData.custasJudiciais.length > 0
    const hasAnsweredMulta = formData.incluirMultaArt523 !== null
    const hasAnsweredTipoValores = formData.tipoValores !== null
    
    const emptyFields = requiredFields.filter(field => !formData[field]?.trim())
    
    return {
      isValid: emptyFields.length === 0 && hasImage && hasAnsweredHonorarios && hasAnsweredReembolso && hasCustasJudiciais && hasAnsweredMulta && hasAnsweredTipoValores,
      emptyFields,
      hasImage,
      hasAnsweredHonorarios,
      hasAnsweredReembolso,
      hasCustasJudiciais,
      hasAnsweredMulta,
      hasAnsweredTipoValores
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
    
    // Campos de reembolso não são mais necessários pois foram substituídos por custas judiciais

    // Se "Outro Status" estiver selecionado, contar campo extra
    if (formData.status === 'Outro Status') {
      requiredFields.push('outroStatus')
    }
    
    const filledFields = requiredFields.filter(field => formData[field]?.trim()).length
    const hasImage = uploadedFiles.length > 0 || pastedImages.length > 0 ? 1 : 0
    const hasAnsweredHonorarios = formData.incluirHonorariosCalculo !== null ? 1 : 0
    const hasAnsweredReembolso = formData.incluirReembolso !== null ? 1 : 0
    const hasCustasJudiciais = formData.custasJudiciais.length > 0 ? 1 : 0
    const hasAnsweredMulta = formData.incluirMultaArt523 !== null ? 1 : 0
    const hasAnsweredTipoValores = formData.tipoValores !== null ? 1 : 0
    const totalFields = requiredFields.length + 6 // +1 para a imagem, +1 para honorários, +1 para reembolso, +1 para custas, +1 para multa, +1 para tipo valores
    
    return Math.round(((filledFields + hasImage + hasAnsweredHonorarios + hasAnsweredReembolso + hasCustasJudiciais + hasAnsweredMulta + hasAnsweredTipoValores) / totalFields) * 100)
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
      custasJudiciais: [],
      incluirHonorariosCalculo: null,
      honorariosCalculo: '',
      incluirMultaArt523: null,
      dataCalculoMulta: '',
      dataCalculoCustas: '',
      valorPrincipalMulta: '',
      valorPrincipalCorrigido: '',
      jurosPrincipal: '',
      totalPrincipal: '',
      valorCustasMulta: '',
      valorCustasCorrigido: '',
      jurosCustas: '',
      totalCustas: '',
      totalGeralMulta: '',
      honorariosSucumbenciaMulta: '',
      multa523: '',
      tipoValores: null,
      descontosTotal: '',
      saldoRepasse: '',
      taxaTransferencia: '8,00',
      observacoes: ''
    })
    setUploadedFiles([])
    setPastedImages([])
  }

  // Função para obter valores da multa (preenchidos manualmente)
  const getMultaValues = () => {
    if (!formData.incluirMultaArt523) {
      return {
        valorPrincipalCorrigido: 0,
        jurosPrincipal: 0,
        totalPrincipal: 0,
        valorCustasCorrigido: 0,
        jurosCustas: 0,
        totalCustas: 0,
        totalGeral: 0,
        honorariosSucumbenciaMulta: 0
      }
    }

    // Converter valores preenchidos para números
    const valorPrincipalCorrigido = parseFloat(formData.valorPrincipalCorrigido?.replace(/[^\d,]/g, '').replace(',', '.')) || 0
    const jurosPrincipal = parseFloat(formData.jurosPrincipal?.replace(/[^\d,]/g, '').replace(',', '.')) || 0
    const totalPrincipal = parseFloat(formData.totalPrincipal?.replace(/[^\d,]/g, '').replace(',', '.')) || 0
    const valorCustasCorrigido = parseFloat(formData.valorCustasCorrigido?.replace(/[^\d,]/g, '').replace(',', '.')) || 0
    const jurosCustas = parseFloat(formData.jurosCustas?.replace(/[^\d,]/g, '').replace(',', '.')) || 0
    const totalCustas = parseFloat(formData.totalCustas?.replace(/[^\d,]/g, '').replace(',', '.')) || 0
    const totalGeral = parseFloat(formData.totalGeralMulta?.replace(/[^\d,]/g, '').replace(',', '.')) || 0
    const honorariosSucumbenciaMulta = parseFloat(formData.honorariosSucumbenciaMulta?.replace(/[^\d,]/g, '').replace(',', '.')) || 0

    return {
      valorPrincipalCorrigido,
      jurosPrincipal,
      totalPrincipal,
      valorCustasCorrigido,
      jurosCustas,
      totalCustas,
      totalGeral,
      honorariosSucumbenciaMulta
    }
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
    // Agora incide sobre o valor depositado pelo réu
    const valorDepositadoCalc = parseFloat(newData.valorDepositado?.replace(/[^\d,]/g, '').replace(',', '.')) || 0
    if (valorDepositadoCalc && newData.incluirHonorariosCalculo) {
      const honorariosCalculo = (valorDepositadoCalc * 1 / 100)
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
    
    // Calcular reembolso total das custas judiciais (apenas as pagas pelo escritório)
    const reembolsoVal = newData.custasJudiciais
      .filter(custa => custa.quemPagou === 'escritorio')
      .reduce((total, custa) => total + (parseFloat(custa.valor?.replace(/[^\d,]/g, '').replace(',', '.')) || 0), 0)
    
    // Calcular honorários de sucumbência da multa se aplicável
    let honorariosSucumbenciaMulta = 0
    if (newData.incluirMultaArt523) {
      const multaValues = getMultaValues()
      honorariosSucumbenciaMulta = multaValues.honorariosSucumbenciaMulta
    }
    
    if (honorariosContVal || honorariosSucumVal || reembolsoVal || honorariosCalcVal || honorariosSucumbenciaMulta) {
      const descontosTotal = honorariosContVal + honorariosSucumVal + reembolsoVal + honorariosCalcVal + honorariosSucumbenciaMulta
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
    const currencyFields = ['custasCS', 'valorDepositado', 'valorPrincipal', 'reembolsoCustas', 'valorPrincipalMulta', 'valorCustasMulta', 'valorPrincipalCorrigido', 'jurosPrincipal', 'totalPrincipal', 'valorCustasCorrigido', 'jurosCustas', 'totalCustas', 'totalGeralMulta', 'honorariosSucumbenciaMulta']
    if (currencyFields.includes(field)) {
      value = formatCurrency(value)
    }

    // Se marcar "Não" para incluir reembolso:
    // - zera o valor de reembolso
    // - limpa o tipo de reembolso
    // - limpa o array de custas judiciais
    // - oculta automaticamente os campos (já controlado pelo JSX)
    let baseData = formData
    if (field === 'incluirReembolso' && value === false) {
      baseData = {
        ...formData,
        incluirReembolso: false,
        tipoReembolso: '',
        reembolsoCustas: '0,00',
        custasJudiciais: [], // Limpa o array de custas judiciais
      }
    }
    
    const newData = calculateValues(field, value, baseData)
    
    // Preencher automaticamente os valores da multa 523 com os valores principais
    if (field === 'valorPrincipal' && newData.incluirMultaArt523) {
      newData.valorPrincipalMulta = value
    }
    
    if (field === 'custasCS' && newData.incluirMultaArt523) {
      newData.valorCustasMulta = value
    }
    
    // Quando ativar a multa 523, preencher automaticamente com os valores existentes
    if (field === 'incluirMultaArt523' && value === true) {
      if (newData.valorPrincipal) {
        newData.valorPrincipalMulta = newData.valorPrincipal
      }
      if (newData.custasCS) {
        newData.valorCustasMulta = newData.custasCS
      }
    }
    
    // Calcular totais automaticamente para multa 523
    if (field === 'valorPrincipalCorrigido' || field === 'jurosPrincipal') {
      const valorCorrigido = field === 'valorPrincipalCorrigido' ? 
        parseFloat(value?.replace(/[^\d,]/g, '').replace(',', '.')) || 0 : 
        parseFloat(newData.valorPrincipalCorrigido?.replace(/[^\d,]/g, '').replace(',', '.')) || 0
      
      const juros = field === 'jurosPrincipal' ? 
        parseFloat(value?.replace(/[^\d,]/g, '').replace(',', '.')) || 0 : 
        parseFloat(newData.jurosPrincipal?.replace(/[^\d,]/g, '').replace(',', '.')) || 0
      
      const total = valorCorrigido + juros
      newData.totalPrincipal = total.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
      
      // Recalcular total geral e honorários
      const totalCustas = parseFloat(newData.totalCustas?.replace(/[^\d,]/g, '').replace(',', '.')) || 0
      const totalGeral = total + totalCustas
      newData.totalGeralMulta = totalGeral.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
      const honorariosFase = totalGeral * 0.10
      newData.honorariosSucumbenciaMulta = honorariosFase.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
      
      // Calcular honorários de sucumbência da multa do art 523
      const percentualSucumbencia = parseFloat(newData.percentualSucumbencia?.replace('%', '')) || 0
      const multa523 = totalGeral * 0.10 // Multa do 523 = 10% do total geral
      const totalGeralComMulta = totalGeral + multa523 + multa523 // Total Geral = Total + Honorários + Multa
      const honorariosSucumbenciaMulta = (totalGeralComMulta - multa523) * (percentualSucumbencia / 100)
      newData.honorariosSucumbenciaMulta = honorariosSucumbenciaMulta.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
      
      // Armazenar a multa do 523 para uso posterior
      newData.multa523 = multa523.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    }
    
    if (field === 'valorCustasCorrigido' || field === 'jurosCustas') {
      const valorCorrigido = field === 'valorCustasCorrigido' ? 
        parseFloat(value?.replace(/[^\d,]/g, '').replace(',', '.')) || 0 : 
        parseFloat(newData.valorCustasCorrigido?.replace(/[^\d,]/g, '').replace(',', '.')) || 0
      
      const juros = field === 'jurosCustas' ? 
        parseFloat(value?.replace(/[^\d,]/g, '').replace(',', '.')) || 0 : 
        parseFloat(newData.jurosCustas?.replace(/[^\d,]/g, '').replace(',', '.')) || 0
      
      const total = valorCorrigido + juros
      newData.totalCustas = total.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
      
      // Recalcular total geral e honorários
      const totalPrincipal = parseFloat(newData.totalPrincipal?.replace(/[^\d,]/g, '').replace(',', '.')) || 0
      const totalGeral = totalPrincipal + total
      newData.totalGeralMulta = totalGeral.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
      const honorariosFase = totalGeral * 0.10
      newData.honorariosSucumbenciaMulta = honorariosFase.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
      
      // Calcular honorários de sucumbência da multa do art 523
      const percentualSucumbencia = parseFloat(newData.percentualSucumbencia?.replace('%', '')) || 0
      const multa523 = totalGeral * 0.10 // Multa do 523 = 10% do total geral
      const totalGeralComMulta = totalGeral + multa523 + multa523 // Total Geral = Total + Honorários + Multa
      const honorariosSucumbenciaMulta = (totalGeralComMulta - multa523) * (percentualSucumbencia / 100)
      newData.honorariosSucumbenciaMulta = honorariosSucumbenciaMulta.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
      
      // Armazenar a multa do 523 para uso posterior
      newData.multa523 = multa523.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    }
    
    // Calcular total geral automaticamente quando os totais individuais mudarem
    if (field === 'totalPrincipal' || field === 'totalCustas') {
      const totalPrincipal = parseFloat(newData.totalPrincipal?.replace(/[^\d,]/g, '').replace(',', '.')) || 0
      const totalCustas = parseFloat(newData.totalCustas?.replace(/[^\d,]/g, '').replace(',', '.')) || 0
      const totalGeral = totalPrincipal + totalCustas
      newData.totalGeralMulta = totalGeral.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
      
      // Calcular honorários da fase de cumprimento/execução (10% do total)
      const honorariosFase = totalGeral * 0.10
      newData.honorariosSucumbenciaMulta = honorariosFase.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
      
      // Calcular honorários de sucumbência da multa do art 523
      const percentualSucumbencia = parseFloat(newData.percentualSucumbencia?.replace('%', '')) || 0
      const multa523 = totalGeral * 0.10 // Multa do 523 = 10% do total geral
      const totalGeralComMulta = totalGeral + multa523 + multa523 // Total Geral = Total + Honorários + Multa
      const honorariosSucumbenciaMulta = (totalGeralComMulta - multa523) * (percentualSucumbencia / 100)
      newData.honorariosSucumbenciaMulta = honorariosSucumbenciaMulta.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
      
      // Armazenar a multa do 523 para uso posterior
      newData.multa523 = multa523.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    }

    setFormData(newData)
  }

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files)
    if (files.length > 0) {
      files.forEach(file => {
        // Ler o conteúdo do arquivo
        const reader = new FileReader()
        reader.onload = (e) => {
          const fileData = {
            file: file,
            content: e.target.result,
            id: Date.now() + Math.random()
          }
          setUploadedFiles(prev => [...prev, fileData])
        }
        
        if (file.type.startsWith('image/')) {
          reader.readAsDataURL(file)
        } else if (file.type === 'application/pdf') {
          reader.readAsDataURL(file)
        } else {
          // Para outros tipos de arquivo, tentar ler como texto
          reader.readAsText(file)
        }
      })
    }
  }

  const handlePaste = (event) => {
    const items = event.clipboardData.items
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const blob = items[i].getAsFile()
        const reader = new FileReader()
        reader.onload = (e) => {
          const imageData = {
            content: e.target.result,
            id: Date.now() + Math.random()
          }
          setPastedImages(prev => [...prev, imageData])
        }
        reader.readAsDataURL(blob)
        break
      }
    }
  }

  // Funções para gerenciar custas judiciais
  const addCustaJudicial = () => {
    const novaCusta = {
      id: Date.now() + Math.random(),
      valor: '',
      dataPagamento: '',
      quemPagou: 'cliente', // 'cliente' ou 'escritorio'
      tipoReembolso: '',
      tipoReembolsoPersonalizado: ''
    }
    setFormData(prev => ({
      ...prev,
      custasJudiciais: [...prev.custasJudiciais, novaCusta]
    }))
  }

  const updateCustaJudicial = (id, field, value) => {
    // Aplicar formatação de moeda para o campo 'valor'
    if (field === 'valor') {
      value = formatCurrency(value)
    }
    
    setFormData(prev => ({
      ...prev,
      custasJudiciais: prev.custasJudiciais.map(custa =>
        custa.id === id ? { ...custa, [field]: value } : custa
      )
    }))
  }

  const removeCustaJudicial = (id) => {
    setFormData(prev => ({
      ...prev,
      custasJudiciais: prev.custasJudiciais.filter(custa => custa.id !== id)
    }))
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
      if (!validation.hasCustasJudiciais) {
        message += "\n\nVocê precisa adicionar pelo menos uma custa judicial."
      }
      if (!validation.hasAnsweredTipoValores) {
        message += "\n\nVocê precisa selecionar se os valores são provisórios ou finais."
      }
      alert(message)
      return
    }
      
      // Obter o conteúdo do preview
      const printContent = document.getElementById('prestacao-preview')
    const logoDolejal = document.querySelector('.logo img')?.src || ''
    
    // Função para gerar páginas de anexos
    const generateAnexosPages = () => {
      if (uploadedFiles.length === 0 && pastedImages.length === 0) return ''
      
      const anexos = []
      
      // Processar imagens coladas
      pastedImages.forEach((imageData, index) => {
        anexos.push(`
          <div style="page-break-before: always; padding: 1cm;">
            <div style="text-align: center; margin-bottom: 0.5cm;">
              <h2 style="font-family: 'Times New Roman', Times, serif; font-size: 14pt; font-weight: bold; margin-bottom: 0.3cm;">
                ANEXO - PRINTS DOS CÁLCULOS DO PROCESSO ${pastedImages.length > 1 ? `(${index + 1})` : ''}
              </h2>
              <p style="font-family: 'Times New Roman', Times, serif; font-size: 10pt; margin-bottom: 0.2cm;">
                Cliente: ${formData.nomeCliente || '[NOME DO CLIENTE]'}
              </p>
              <p style="font-family: 'Times New Roman', Times, serif; font-size: 10pt; margin-bottom: 0.5cm;">
                Processos: ${formData.processos || '[NÚMEROS DOS PROCESSOS]'}
              </p>
            </div>
            <div style="text-align: center; margin-bottom: 0.5cm;">
              <img src="${imageData.content}" alt="Print dos cálculos" style="max-width: 100%; height: auto; max-height: 18cm; border: 1px solid #ccc;" />
            </div>
            <div style="text-align: center; font-family: 'Times New Roman', Times, serif; font-size: 8pt; color: #666;">
              <div>Dolejal Advocacia Especializada - CNPJ 36.515.414/0001-09 - OAB: RS 9.794</div>
              <div>Rua Visconde De Pelotas 21, sala 402, Passo da Areia - Porto Alegre - RS - CEP 91030-530</div>
            </div>
          </div>
        `)
      })
      
      // Processar arquivos enviados
      uploadedFiles.forEach((fileData, index) => {
        let fileContent = ''
        
        if (fileData.content) {
          if (fileData.file.type.startsWith('image/')) {
            // Para imagens, exibir a imagem
            fileContent = `
              <div style="text-align: center; margin: 0.5cm 0;">
                <img src="${fileData.content}" alt="${fileData.file.name}" style="max-width: 100%; height: auto; max-height: 18cm; border: 1px solid #ccc;" />
              </div>
            `
          } else if (fileData.file.type === 'application/pdf') {
            // Para PDFs, exibir como iframe
            fileContent = `
              <div style="text-align: center; margin: 0.5cm 0;">
                <iframe src="${fileData.content}" style="width: 100%; height: 18cm; border: 1px solid #ccc;" frameborder="0"></iframe>
              </div>
            `
          } else {
            // Para outros arquivos, exibir como texto
            fileContent = `
              <div style="text-align: left; margin: 0.5cm 0; padding: 0.5cm; border: 1px solid #ccc; background-color: #f9f9f9; font-family: 'Courier New', monospace; font-size: 9pt; white-space: pre-wrap; max-height: 18cm; overflow-y: auto;">
                ${fileData.content}
              </div>
            `
          }
        } else {
          // Fallback se não conseguir ler o conteúdo
          fileContent = `
            <div style="text-align: center; padding: 1cm; border: 2px dashed #ccc; background-color: #f9f9f9;">
              <p style="font-family: 'Times New Roman', Times, serif; font-size: 12pt; font-weight: bold; margin-bottom: 0.5cm;">
                📎 ${fileData.file.name}
              </p>
              <p style="font-family: 'Times New Roman', Times, serif; font-size: 10pt; color: #666;">
                Arquivo anexado: ${fileData.file.name}
              </p>
              <p style="font-family: 'Times New Roman', Times, serif; font-size: 8pt; color: #999; margin-top: 0.5cm;">
                *Este arquivo foi enviado como anexo e deve ser consultado separadamente
              </p>
            </div>
          `
        }
        
        anexos.push(`
          <div style="page-break-before: always; padding: 1cm;">
            <div style="text-align: center; margin-bottom: 0.5cm;">
              <h2 style="font-family: 'Times New Roman', Times, serif; font-size: 14pt; font-weight: bold; margin-bottom: 0.3cm;">
                ANEXO - DOCUMENTOS DO PROCESSO ${uploadedFiles.length > 1 ? `(${index + 1})` : ''}
              </h2>
              <p style="font-family: 'Times New Roman', Times, serif; font-size: 10pt; margin-bottom: 0.2cm;">
                Cliente: ${formData.nomeCliente || '[NOME DO CLIENTE]'}
              </p>
              <p style="font-family: 'Times New Roman', Times, serif; font-size: 10pt; margin-bottom: 0.5cm;">
                Processos: ${formData.processos || '[NÚMEROS DOS PROCESSOS]'}
              </p>
            </div>
            ${fileContent}
            <div style="text-align: center; font-family: 'Times New Roman', Times, serif; font-size: 8pt; color: #666;">
              <div>Dolejal Advocacia Especializada - CNPJ 36.515.414/0001-09 - OAB: RS 9.794</div>
              <div>Rua Visconde De Pelotas 21, sala 402, Passo da Areia - Porto Alegre - RS - CEP 91030-530</div>
            </div>
          </div>
        `)
      })
      
      return anexos.join('')
    }
    
    // Criar o HTML completo
    const today = new Date()
    const formattedDate = today.toLocaleDateString('pt-BR')
    const htmlContent = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Prestação de Contas - ${formData.nomeCliente || 'Cliente'}</title>
    <style>
        @page { size: A4; margin: 2.4cm 1.2cm 2.4cm 1.2cm; }
        @page:first { margin: 1.2cm 1.2cm 2.4cm 1.2cm; }
        body { font-family: "Times New Roman", Times, serif; font-size: 11pt; line-height: 1; margin: 0; padding: 0; color: black; background: white; width: 21cm; min-height: 29.7cm; box-sizing: border-box; }
        .header { text-align: center; margin-bottom: 0.15cm; height: 1.8cm; display: flex; align-items: center; justify-content: center; }
        .logo { height: 100%; max-height: 1.6cm; }
        .logo img { height: 100%; max-height: 1.6cm; width: auto; }
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
            body { margin: 0 !important; padding: 0 !important; font-size: 11pt !important; line-height: 1 !important; }
            .header { height: 1.8cm !important; margin-bottom: 0.15cm !important; }
            .logo img { max-height: 1.6cm !important; }
            h2 {
                margin-bottom: 0.4cm !important;
                margin-top: 0.1cm !important;
                font-size: 13pt !important;
            }
            p {
                margin-bottom: 0.2cm !important;
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
    <div style="margin-top: 0.5cm; page-break-inside: avoid;">
      <div style="text-align: left; font-family: 'Times New Roman', Times, serif; font-size: 10pt; line-height: 1.2; margin-left: 0;">
        <div>Dolejal Advocacia Especializada</div>
        <div style="margin-top: 0.1cm;">Porto Alegre/RS, ${formattedDate}.</div>
      </div>
      <div style="text-align: center; margin-top: 0.3cm; font-family: 'Times New Roman', Times, serif; font-size: 8pt; color: #000;">
        <div>Dolejal Advocacia Especializada - CNPJ 36.515.414/0001-09 - OAB: RS 9.794</div>
        <div>Rua Visconde De Pelotas 21, sala 402, Passo da Areia - Porto Alegre - RS - CEP 91030-530</div>
      </div>
    </div>
    ${generateAnexosPages()}
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

  const capitalizeFirst = (text) => {
    if (!text) return ''
    return text.charAt(0).toUpperCase() + text.slice(1)
  }

  const calculoIndex = formData.incluirReembolso ? (3 + formData.custasJudiciais.filter(custa => custa.quemPagou === 'escritorio').length) : 3

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
                            <SelectItem key={index} value={capitalizeFirst(status)}>
                              {capitalizeFirst(status)}
                            </SelectItem>
                          ))}
                          <SelectItem value="Outro Status">Outro Status</SelectItem>
                        </SelectContent>
                      </Select>
                      {formData.status === 'Outro Status' && (
                        <div className="mt-2">
                          <Label htmlFor="outroStatus">Descreva o outro status (até 10 palavras)</Label>
                          <Input
                            id="outroStatus"
                            value={formData.outroStatus}
                            onChange={(e) => handleInputChange('outroStatus', e.target.value.split(/\s+/).slice(0,10).join(' '))}
                            placeholder="Digite aqui o outro status"
                          />
                        </div>
                      )}
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
                      <Label>Tiveram Custas Judiciais? <span style={{backgroundColor: '#ffff00', color: '#000000', padding: '2px 4px', borderRadius: '3px', fontSize: '10px'}}>(obrigatório)</span></Label>
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
                        <div>
                        <div className="flex justify-between items-center mb-4">
                          <Label>Custas Judiciais <span style={{backgroundColor: '#ffff00', color: '#000000', padding: '2px 4px', borderRadius: '3px', fontSize: '10px'}}>(obrigatório)</span></Label>
                          <button
                            type="button"
                            onClick={addCustaJudicial}
                            className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 flex items-center gap-1"
                          >
                            + Adicionar Custa
                          </button>
                        </div>
                        
                        {formData.custasJudiciais.map((custa, index) => (
                          <div key={custa.id} className="border border-gray-300 rounded-lg p-4 mb-4 bg-gray-50">
                            <div className="flex justify-between items-center mb-3">
                              <h4 className="font-medium text-gray-700">Custa {index + 1}</h4>
                              <button
                                type="button"
                                onClick={() => removeCustaJudicial(custa.id)}
                                className="text-red-600 hover:text-red-800 text-sm"
                              >
                                Remover
                              </button>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <Label htmlFor={`valor-${custa.id}`}>Valor da Custa <span style={{backgroundColor: '#ffff00', color: '#000000', padding: '2px 4px', borderRadius: '3px', fontSize: '10px'}}>(preencher)</span></Label>
                                <Input
                                  id={`valor-${custa.id}`}
                                  value={custa.valor}
                                  onChange={(e) => updateCustaJudicial(custa.id, 'valor', e.target.value)}
                                  placeholder="R$ 0,00"
                                />
                              </div>
                              
                              <div>
                                <Label htmlFor={`data-${custa.id}`}>Data do Pagamento <span style={{backgroundColor: '#ffff00', color: '#000000', padding: '2px 4px', borderRadius: '3px', fontSize: '10px'}}>(preencher)</span></Label>
                                <Input
                                  id={`data-${custa.id}`}
                                  type="date"
                                  value={custa.dataPagamento}
                                  onChange={(e) => updateCustaJudicial(custa.id, 'dataPagamento', e.target.value)}
                                />
                              </div>
                              
                              <div>
                                <Label>Quem Pagou? <span style={{backgroundColor: '#ffff00', color: '#000000', padding: '2px 4px', borderRadius: '3px', fontSize: '10px'}}>(preencher)</span></Label>
                                <div className="flex gap-4 mt-2">
                                  <label className="flex items-center gap-2">
                                    <input
                                      type="radio"
                                      name={`quemPagou-${custa.id}`}
                                      value="cliente"
                                      checked={custa.quemPagou === 'cliente'}
                                      onChange={() => updateCustaJudicial(custa.id, 'quemPagou', 'cliente')}
                                    />
                                    Cliente
                                  </label>
                                  <label className="flex items-center gap-2">
                                    <input
                                      type="radio"
                                      name={`quemPagou-${custa.id}`}
                                      value="escritorio"
                                      checked={custa.quemPagou === 'escritorio'}
                                      onChange={() => updateCustaJudicial(custa.id, 'quemPagou', 'escritorio')}
                                    />
                                    Escritório
                                  </label>
                                </div>
                              </div>
                              
                              {custa.quemPagou === 'escritorio' && (
                                <div>
                                  <Label htmlFor={`tipo-${custa.id}`}>Tipo de Reembolso <span style={{backgroundColor: '#ffff00', color: '#000000', padding: '2px 4px', borderRadius: '3px', fontSize: '10px'}}>(preencher)</span></Label>
                                  <Select value={custa.tipoReembolso} onValueChange={(value) => updateCustaJudicial(custa.id, 'tipoReembolso', value)}>
                            <SelectTrigger>
                                      <SelectValue placeholder="Selecione o tipo" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Reembolso custas apelação">Reembolso custas apelação</SelectItem>
                              <SelectItem value="Reembolso custas agravo">Reembolso custas agravo</SelectItem>
                              <SelectItem value="Reembolso custas iniciais">Reembolso custas iniciais</SelectItem>
                              <SelectItem value="Reembolso custas apelação e agravo">Reembolso custas apelação e agravo</SelectItem>
                              <SelectItem value="Reembolso custas apelação e iniciais">Reembolso custas apelação e iniciais</SelectItem>
                              <SelectItem value="Reembolso custas iniciais e agravo">Reembolso custas iniciais e agravo</SelectItem>
                              <SelectItem value="Reembolso custas apelação, agravo e iniciais">Reembolso custas apelação, agravo e iniciais</SelectItem>
                                      <SelectItem value="Reembolso custas recurso especial">Reembolso custas recurso especial</SelectItem>
                                      <SelectItem value="Reembolso custas embargos de declaração">Reembolso custas embargos de declaração</SelectItem>
                                      <SelectItem value="Outro tipo de reembolso">Outro tipo de reembolso</SelectItem>
                            </SelectContent>
                          </Select>
                        
                                  {custa.tipoReembolso === 'Outro tipo de reembolso' && (
                                    <div className="mt-2">
                                      <Label htmlFor={`tipo-personalizado-${custa.id}`}>Especifique o tipo de reembolso <span style={{backgroundColor: '#ffff00', color: '#000000', padding: '2px 4px', borderRadius: '3px', fontSize: '10px'}}>(preencher)</span></Label>
                          <Input
                                        id={`tipo-personalizado-${custa.id}`}
                                        value={custa.tipoReembolsoPersonalizado || ''}
                                        onChange={(e) => updateCustaJudicial(custa.id, 'tipoReembolsoPersonalizado', e.target.value)}
                                        placeholder="Digite o tipo de reembolso"
                      />
                        </div>
                                  )}
                                </div>
                              )}
                        </div>
                          </div>
                        ))}
                      </div>
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

                    <div className="col-span-full">
                      <Label className="text-sm font-medium mb-3 block">
                        Tem Multa do Art. 523 do CPC? <span style={{backgroundColor: '#ffff00', color: '#000000', padding: '2px 4px', borderRadius: '3px', fontSize: '10px'}}>(obrigatório)</span>
                      </Label>
                      <div className="flex items-center space-x-6">
                        <div className="flex items-center space-x-2">
                          <input
                            type="radio"
                            id="incluirMultaArt523-sim"
                            name="incluirMultaArt523"
                            checked={formData.incluirMultaArt523 === true}
                            onChange={() => handleInputChange('incluirMultaArt523', true)}
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                          />
                          <Label htmlFor="incluirMultaArt523-sim" className="text-sm font-medium">
                            Sim
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="radio"
                            id="incluirMultaArt523-nao"
                            name="incluirMultaArt523"
                            checked={formData.incluirMultaArt523 === false}
                            onChange={() => handleInputChange('incluirMultaArt523', false)}
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                          />
                          <Label htmlFor="incluirMultaArt523-nao" className="text-sm font-medium">
                            Não
                          </Label>
                        </div>
                      </div>
                    </div>

                    {formData.incluirMultaArt523 && (
                      <div className="col-span-full space-y-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <h4 className="text-lg font-medium text-blue-800">Dados para Cálculo da Multa Art. 523 CPC</h4>
                        
                        <div className="space-y-4">
                          <h5 className="text-md font-medium text-blue-700">Valor Principal</h5>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="dataCalculoMulta">Data <span style={{backgroundColor: '#ffff00', color: '#000000', padding: '2px 4px', borderRadius: '3px', fontSize: '10px'}}>(obrigatório)</span></Label>
                              <Input
                                id="dataCalculoMulta"
                                type="date"
                                value={formData.dataCalculoMulta}
                                onChange={(e) => handleInputChange('dataCalculoMulta', e.target.value)}
                              />
                            </div>
                            
                            <div>
                              <Label htmlFor="valorPrincipalMulta">Valor Principal (R$) <span style={{backgroundColor: '#ffff00', color: '#000000', padding: '2px 4px', borderRadius: '3px', fontSize: '10px'}}>(preenchido automaticamente)</span></Label>
                              <Input
                                id="valorPrincipalMulta"
                                value={formData.valorPrincipalMulta}
                                readOnly
                                style={{backgroundColor: '#f5f5f5', cursor: 'not-allowed'}}
                                placeholder="R$ 0,00"
                              />
                            </div>
                            
                            <div>
                              <Label htmlFor="valorPrincipalCorrigido">Valor Corrigido (R$) <span style={{backgroundColor: '#ffff00', color: '#000000', padding: '2px 4px', borderRadius: '3px', fontSize: '10px'}}>(obrigatório)</span></Label>
                              <Input
                                id="valorPrincipalCorrigido"
                                value={formData.valorPrincipalCorrigido}
                                onChange={(e) => handleInputChange('valorPrincipalCorrigido', e.target.value)}
                                placeholder="R$ 0,00"
                              />
                            </div>
                            
                            <div>
                              <Label htmlFor="jurosPrincipal">Juros (R$) <span style={{backgroundColor: '#ffff00', color: '#000000', padding: '2px 4px', borderRadius: '3px', fontSize: '10px'}}>(obrigatório)</span></Label>
                              <Input
                                id="jurosPrincipal"
                                value={formData.jurosPrincipal}
                                onChange={(e) => handleInputChange('jurosPrincipal', e.target.value)}
                                placeholder="R$ 0,00"
                              />
                            </div>
                            
                            <div>
                              <Label htmlFor="totalPrincipal">Total (R$) <span style={{backgroundColor: '#ffff00', color: '#000000', padding: '2px 4px', borderRadius: '3px', fontSize: '10px'}}>(calculado automaticamente)</span></Label>
                              <Input
                                id="totalPrincipal"
                                value={formData.totalPrincipal}
                                readOnly
                                style={{backgroundColor: '#f5f5f5', cursor: 'not-allowed'}}
                                placeholder="R$ 0,00"
                              />
                            </div>
                          </div>
                          
                          <h5 className="text-md font-medium text-blue-700">Custas Cumprimento de Sentença</h5>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="dataCalculoCustas">Data <span style={{backgroundColor: '#ffff00', color: '#000000', padding: '2px 4px', borderRadius: '3px', fontSize: '10px'}}>(obrigatório)</span></Label>
                              <Input
                                id="dataCalculoCustas"
                                type="date"
                                value={formData.dataCalculoCustas}
                                onChange={(e) => handleInputChange('dataCalculoCustas', e.target.value)}
                              />
                            </div>
                            
                            <div>
                              <Label htmlFor="valorCustasMulta">Valor Custas (R$) <span style={{backgroundColor: '#ffff00', color: '#000000', padding: '2px 4px', borderRadius: '3px', fontSize: '10px'}}>(preenchido automaticamente)</span></Label>
                              <Input
                                id="valorCustasMulta"
                                value={formData.valorCustasMulta}
                                readOnly
                                style={{backgroundColor: '#f5f5f5', cursor: 'not-allowed'}}
                                placeholder="R$ 0,00"
                              />
                            </div>
                            
                            <div>
                              <Label htmlFor="valorCustasCorrigido">Valor Corrigido (R$) <span style={{backgroundColor: '#ffff00', color: '#000000', padding: '2px 4px', borderRadius: '3px', fontSize: '10px'}}>(obrigatório)</span></Label>
                              <Input
                                id="valorCustasCorrigido"
                                value={formData.valorCustasCorrigido}
                                onChange={(e) => handleInputChange('valorCustasCorrigido', e.target.value)}
                                placeholder="R$ 0,00"
                              />
                            </div>
                            
                            <div>
                              <Label htmlFor="jurosCustas">Juros (R$) <span style={{backgroundColor: '#ffff00', color: '#000000', padding: '2px 4px', borderRadius: '3px', fontSize: '10px'}}>(obrigatório)</span></Label>
                              <Input
                                id="jurosCustas"
                                value={formData.jurosCustas}
                                onChange={(e) => handleInputChange('jurosCustas', e.target.value)}
                                placeholder="R$ 0,00"
                              />
                            </div>
                            
                            <div>
                              <Label htmlFor="totalCustas">Total (R$) <span style={{backgroundColor: '#ffff00', color: '#000000', padding: '2px 4px', borderRadius: '3px', fontSize: '10px'}}>(calculado automaticamente)</span></Label>
                              <Input
                                id="totalCustas"
                                value={formData.totalCustas}
                                readOnly
                                style={{backgroundColor: '#f5f5f5', cursor: 'not-allowed'}}
                                placeholder="R$ 0,00"
                              />
                            </div>
                          </div>
                          
                          <h5 className="text-md font-medium text-blue-700">Totais</h5>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="totalGeralMulta">Total Geral (R$) <span style={{backgroundColor: '#ffff00', color: '#000000', padding: '2px 4px', borderRadius: '3px', fontSize: '10px'}}>(calculado automaticamente)</span></Label>
                              <Input
                                id="totalGeralMulta"
                                value={formData.totalGeralMulta}
                                readOnly
                                style={{backgroundColor: '#f5f5f5', cursor: 'not-allowed'}}
                                placeholder="R$ 0,00"
                              />
                            </div>
                            
                            <div>
                              <Label htmlFor="honorariosSucumbenciaMulta">Honorários de Sucumbência da Multa do Art 523 (R$) <span style={{backgroundColor: '#ffff00', color: '#000000', padding: '2px 4px', borderRadius: '3px', fontSize: '10px'}}>(calculado automaticamente)</span></Label>
                              <Input
                                id="honorariosSucumbenciaMulta"
                                value={formData.honorariosSucumbenciaMulta}
                                readOnly
                                style={{backgroundColor: '#f5f5f5', cursor: 'not-allowed'}}
                                placeholder="R$ 0,00"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    
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

                  <div className="col-span-full">
                    <Label className="text-sm font-medium mb-3 block">
                      Tipo dos Valores <span style={{backgroundColor: '#ffff00', color: '#000000', padding: '2px 4px', borderRadius: '3px', fontSize: '10px'}}>(obrigatório)</span>
                    </Label>
                    <div className="flex items-center space-x-6">
                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id="tipoValores-provisorio"
                          name="tipoValores"
                          checked={formData.tipoValores === 'provisorio'}
                          onChange={() => handleInputChange('tipoValores', 'provisorio')}
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                        />
                        <Label htmlFor="tipoValores-provisorio" className="text-sm font-medium">
                          Provisório
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id="tipoValores-final"
                          name="tipoValores"
                          checked={formData.tipoValores === 'final'}
                          onChange={() => handleInputChange('tipoValores', 'final')}
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                        />
                        <Label htmlFor="tipoValores-final" className="text-sm font-medium">
                          Final
                        </Label>
                      </div>
                    </div>
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
                        {pastedImages.length > 0 ? (
                          <div className="space-y-4">
                            {pastedImages.map((imageData, index) => (
                              <div key={imageData.id} className="relative">
                                <img src={imageData.content} alt={`Imagem colada ${index + 1}`} className="max-w-full max-h-64 mx-auto rounded" />
                            <button 
                                  onClick={() => setPastedImages(prev => prev.filter(img => img.id !== imageData.id))}
                                  className="absolute top-2 right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-800"
                            >
                                  ×
                            </button>
                              </div>
                            ))}
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
                                  multiple
                                  onChange={handleFileUpload}
                                />
                              </label>
                              <p className="pl-1">ou arraste e solte</p>
                            </div>
                            <p className="text-xs leading-5 text-gray-600">PNG, JPG, PDF até 10MB</p>
                            <p className="text-xs leading-5 text-blue-600 font-medium">
                              💡 Dica: Você também pode colar uma imagem aqui usando Ctrl+V
                            </p>
                            {uploadedFiles.length > 0 && (
                              <div className="mt-2 text-sm text-green-600">
                                <div className="mb-2">Arquivos selecionados ({uploadedFiles.length}):</div>
                                {uploadedFiles.map((fileData, index) => (
                                  <div key={fileData.id} className="relative mb-2 p-2 bg-green-50 rounded border">
                                    <div className="flex items-center justify-between">
                                      <div className="flex-1">
                                        <div className="text-xs font-medium">{fileData.file.name}</div>
                                        {fileData.file.type.startsWith('image/') && (
                                          <img src={fileData.content} alt="Preview" className="max-w-full max-h-16 mx-auto rounded border mt-1" />
                                        )}
                                        {fileData.file.type === 'application/pdf' && (
                                          <div className="text-xs text-gray-600 mt-1">
                                            📄 PDF carregado - será exibido no PDF final
                                    </div>
                                        )}
                                        {!fileData.file.type.startsWith('image/') && fileData.file.type !== 'application/pdf' && (
                                          <div className="text-xs text-gray-600 mt-1">
                                            📄 Arquivo carregado - será exibido no PDF final
                                  </div>
                                        )}
                                    </div>
                                    <button
                                        onClick={() => setUploadedFiles(prev => prev.filter(file => file.id !== fileData.id))}
                                        className="ml-2 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-800"
                                      >
                                        ×
                                    </button>
                                    </div>
                                  </div>
                                ))}
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
                      <style>{`
                        @media print {
                          #prestacao-preview {
                            margin: 0.8cm !important;
                            padding: 0 !important;
                            border: none !important;
                            box-shadow: none !important;
                            border-radius: 0 !important;
                            background: white !important;
                          }
                          #prestacao-preview * {
                            font-family: "Times New Roman", Times, serif !important;
                            font-size: 9pt !important;
                            line-height: 1.1 !important;
                            color: black !important;
                          }
                          #prestacao-preview h2 {
                            font-weight: bold !important;
                            font-size: 11pt !important;
                            margin-bottom: 0.2cm !important;
                          }
                          #prestacao-preview p {
                            margin-bottom: 0.02cm !important;
                            line-height: 1.0 !important;
                          }
                          #prestacao-preview p.no-gap {
                            margin-bottom: 0 !important;
                            line-height: 1.0 !important;
                          }
                          #prestacao-preview p.compact {
                            margin-bottom: 0.01cm !important;
                            line-height: 1.0 !important;
                            padding: 0 !important;
                          }
                          #prestacao-preview table {
                            font-size: 8pt !important;
                          }
                          #prestacao-preview table td {
                            padding: 0.05cm !important;
                          }
                          #prestacao-preview .header {
                            height: 1cm !important;
                            margin-bottom: 0.05cm !important;
                          }
                          #prestacao-preview .logo img {
                            max-height: 0.8cm !important;
                          }
                        }
                      `}</style>
                      
                      <div className="header" style={{ 
                        textAlign: 'center', 
                        marginBottom: '0.5cm',
                        height: '1.5cm',
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
                        fontSize: '11pt', 
                        marginBottom: '0.2cm',
                        textAlign: 'center',
                        fontFamily: '"Times New Roman", Times, serif'
                      }}>
                        PRESTAÇÃO DE CONTAS
                      </h2>
                      
                      <div style={{ lineHeight: '1.1' }}>
                        <p style={{ 
                          marginBottom: '0.1cm',
                          fontFamily: '"Times New Roman", Times, serif',
                          fontSize: '10pt'
                        }}>
                          <strong>Cliente:</strong> {formData.nomeCliente || '[NOME COMPLETO DO CLIENTE]'}
                        </p>
                        
                        <p style={{ 
                          marginBottom: '0.1cm',
                          fontFamily: '"Times New Roman", Times, serif',
                          fontSize: '10pt'
                        }}>
                          <strong>Processos:</strong> {formData.processos || '[NÚMERO DO PROCESSO DE CUMPRIMENTO DE SENTENÇA] e [NÚMERO DO PROCESSO DE CONHECIMENTO]'}
                        </p>
                        
                        <p style={{ 
                          marginBottom: '0.1cm',
                          fontFamily: '"Times New Roman", Times, serif',
                          fontSize: '10pt'
                        }}>
                          <strong>Chave Processo:</strong> {formData.chaveProcesso || '[CHAVE DO PROCESSO DE CUMPRIMENTO DE SENTENÇA] e [CHAVE DO PROCESSO DE CONHECIMENTO]'}
                        </p>
                        
                        <p style={{ 
                          marginBottom: '0.1cm',
                          fontFamily: '"Times New Roman", Times, serif',
                          fontSize: '10pt'
                        }}>
                          *Todos os documentos podem ser consultados no site: https://www.tjrs.jus.br/novo/busca/?return=proc&client=wp_index
                        </p>
                        
                        <p style={{ 
                          marginBottom: '0.1cm',
                          fontFamily: '"Times New Roman", Times, serif',
                          fontSize: '10pt'
                        }}>
                          <strong>Status:</strong> {
                            formData.status === 'Outro Status'
                              ? `Outro Status - ${formData.outroStatus || '[DESCRIÇÃO DO "OUTRO STATUS"]'}`
                              : (formData.status || '[STATUS ATUAL DO PROCESSO]')
                          }
                        </p>
                        
                        <p style={{ 
                          marginBottom: '0.1cm',
                          fontFamily: '"Times New Roman", Times, serif',
                          fontSize: '10pt'
                        }}>
                          <strong>Valor total da condenação provisória, incluindo honorários de sucumbência e contratual - Vide anexo 1.</strong>
                        </p>
                        
                        <p className="compact" style={{ 
                          marginBottom: '0.01cm',
                              fontFamily: '"Times New Roman", Times, serif',
                              fontSize: '10pt',
                          lineHeight: '1.0'
                          }}>
                          <strong>Valor Principal do Processo:</strong> {formData.valorPrincipal ? `R$ ${formData.valorPrincipal}` : 'R$[VALOR PRINCIPAL DO PROCESSO]'}
                          </p>
                        
                        <p className="compact" style={{ 
                          marginBottom: '0.01cm',
                          fontFamily: '"Times New Roman", Times, serif',
                          fontSize: '10pt',
                          lineHeight: '1.0'
                        }}>
                          *Custas cumprimento de sentença: {formData.custasCS ? `R$ ${formData.custasCS}` : 'R$[VALOR DAS CUSTAS DE CUMPRIMENTO DE SENTENÇA]'}
                        </p>
                        
                        {formData.custasJudiciais.filter(custa => custa.quemPagou === 'cliente').map((custa, index) => {
                          const dataFormatada = custa.dataPagamento ? new Date(custa.dataPagamento).toLocaleDateString('pt-BR') : 'xx/xx/xxxx'
                          return (
                            <p key={custa.id} className="compact" style={{ 
                              marginBottom: '0.01cm',
                          fontFamily: '"Times New Roman", Times, serif',
                              fontSize: '10pt',
                              lineHeight: '1.0'
                            }}>
                              Custas judiciais {custa.valor ? `R$ ${custa.valor}` : 'R$[VALOR]'} Data {dataFormatada}
                            </p>
                          )
                        })}
                        
                        
                        {formData.incluirMultaArt523 && (() => {
                          const multaValues = getMultaValues()
                          return (
                            <div style={{ 
                              marginBottom: '0.3cm',
                              fontFamily: '"Times New Roman", Times, serif',
                              fontSize: '10pt'
                            }}>
                              <h3 style={{ 
                                textAlign: 'center',
                            fontFamily: '"Times New Roman", Times, serif',
                            fontSize: '10pt',
                            fontWeight: 'bold',
                              marginBottom: '0.1cm',
                                backgroundColor: '#ffff00',
                                padding: '0.2cm'
                              }}>
                                Após aplicação das multas de 10% do art. 523, §1°, CPC, e honorários sucumbência art. 523, §1°, CPC, por descumprimento do prazo de pagamento.
                              </h3>
                              
                              <table style={{ 
                                width: '100%',
                                borderCollapse: 'collapse',
                                border: '1px solid #333',
                                marginBottom: '0.2cm'
                              }}>
                                <thead>
                                  <tr>
                                    <th style={{ 
                                      border: '1px solid #333',
                                      padding: '0.1cm',
                                      fontSize: '9pt',
                                      fontWeight: 'bold',
                                      backgroundColor: '#f0f0f0',
                                      textAlign: 'center'
                                    }}>Data</th>
                                    <th style={{ 
                                      border: '1px solid #333',
                                      padding: '0.1cm',
                                      fontSize: '9pt',
                                      fontWeight: 'bold',
                                      backgroundColor: '#f0f0f0',
                                      textAlign: 'center'
                                    }}>Valor</th>
                                    <th style={{ 
                                      border: '1px solid #333',
                                      padding: '0.1cm',
                                      fontSize: '9pt',
                                      fontWeight: 'bold',
                                      backgroundColor: '#f0f0f0',
                                      textAlign: 'center'
                                    }}>Valor Corrigido</th>
                                    <th style={{ 
                                      border: '1px solid #333',
                                      padding: '0.1cm',
                                      fontSize: '9pt',
                                      fontWeight: 'bold',
                                      backgroundColor: '#f0f0f0',
                                      textAlign: 'center'
                                    }}>Juros (R$)</th>
                                    <th style={{ 
                                      border: '1px solid #333',
                                      padding: '0.1cm',
                                      fontSize: '9pt',
                                      fontWeight: 'bold',
                                      backgroundColor: '#f0f0f0',
                                      textAlign: 'center'
                                    }}>Total (R$)</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr>
                                    <td style={{ 
                                      border: '1px solid #333',
                                      padding: '0.1cm',
                                      fontSize: '9pt',
                                      textAlign: 'center'
                                    }}>
                                      {formData.dataCalculoMulta ? new Date(formData.dataCalculoMulta).toLocaleDateString('pt-BR') : '[DATA]'}
                                    </td>
                                    <td style={{ 
                                      border: '1px solid #333',
                                      padding: '0.1cm',
                                      fontSize: '9pt',
                                      textAlign: 'right'
                                    }}>
                                      {formData.valorPrincipalMulta ? `R$ ${formData.valorPrincipalMulta}` : 'R$[VALOR]'}
                                    </td>
                                    <td style={{ 
                                      border: '1px solid #333',
                                      padding: '0.1cm',
                                      fontSize: '9pt',
                                      textAlign: 'right'
                                    }}>
                                      {formData.valorPrincipalCorrigido ? `R$ ${formData.valorPrincipalCorrigido}` : 'R$[VALOR]'}
                                    </td>
                                    <td style={{ 
                                      border: '1px solid #333',
                                      padding: '0.1cm',
                                      fontSize: '9pt',
                                      textAlign: 'right'
                                    }}>
                                      {formData.jurosPrincipal ? `R$ ${formData.jurosPrincipal}` : 'R$[VALOR]'}
                                    </td>
                                    <td style={{ 
                                      border: '1px solid #333',
                                      padding: '0.1cm',
                                      fontSize: '9pt',
                                      textAlign: 'right',
                                      fontWeight: 'bold'
                                    }}>
                                      {formData.totalPrincipal ? `R$ ${formData.totalPrincipal}` : 'R$[VALOR]'}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td style={{ 
                                      border: '1px solid #333',
                                      padding: '0.1cm',
                                      fontSize: '9pt',
                                      textAlign: 'center'
                                    }}>
                                      {formData.dataCalculoCustas ? new Date(formData.dataCalculoCustas).toLocaleDateString('pt-BR') : '[DATA]'}
                                    </td>
                                    <td style={{ 
                                      border: '1px solid #333',
                                      padding: '0.1cm',
                                      fontSize: '9pt',
                                      textAlign: 'right'
                                    }}>
                                      {formData.valorCustasMulta ? `R$ ${formData.valorCustasMulta}` : 'R$[VALOR]'}
                                    </td>
                                    <td style={{ 
                                      border: '1px solid #333',
                                      padding: '0.1cm',
                                      fontSize: '9pt',
                                      textAlign: 'right'
                                    }}>
                                      {formData.valorCustasCorrigido ? `R$ ${formData.valorCustasCorrigido}` : 'R$[VALOR]'}
                                    </td>
                                    <td style={{ 
                                      border: '1px solid #333',
                                      padding: '0.1cm',
                                      fontSize: '9pt',
                                      textAlign: 'right'
                                    }}>
                                      {formData.jurosCustas ? `R$ ${formData.jurosCustas}` : 'R$[VALOR]'}
                                    </td>
                                    <td style={{ 
                                      border: '1px solid #333',
                                      padding: '0.1cm',
                                      fontSize: '9pt',
                                      textAlign: 'right',
                                      fontWeight: 'bold'
                                    }}>
                                      {formData.totalCustas ? `R$ ${formData.totalCustas}` : 'R$[VALOR]'}
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                              
                              <div style={{ 
                                marginBottom: '0.1cm',
                                fontFamily: '"Times New Roman", Times, serif',
                                fontSize: '10pt'
                              }}>
                                <p style={{ marginBottom: '0.1cm' }}>
                                  <strong>Total (R$):</strong> {formData.totalGeralMulta ? `R$ ${formData.totalGeralMulta}` : 'R$[VALOR]'}
                                </p>
                                <p style={{ marginBottom: '0.1cm' }}>
                                  <strong>Honorários sucumbência art 523, CPC:</strong> {formData.multa523 ? `R$ ${formData.multa523}` : 'R$[VALOR]'}
                                </p>
                                <p style={{ marginBottom: '0.1cm' }}>
                                  <strong>Multa do 523 § 1º (R$):</strong> {formData.multa523 ? `R$ ${formData.multa523}` : 'R$[VALOR]'}
                                </p>
                              <p style={{ 
                                  marginBottom: '0.1cm',
                                  backgroundColor: '#d4edda',
                                  padding: '0.2cm',
                                  fontWeight: 'bold',
                                  textAlign: 'center'
                                }}>
                                  <strong>Total Geral (R$):</strong> {formData.totalGeralMulta && formData.multa523 ? (() => {
                                    const total = parseFloat(formData.totalGeralMulta.replace(/[^\d,]/g, '').replace(',', '.')) || 0
                                    const honorarios = parseFloat(formData.multa523.replace(/[^\d,]/g, '').replace(',', '.')) || 0
                                    const multa = parseFloat(formData.multa523.replace(/[^\d,]/g, '').replace(',', '.')) || 0
                                    const totalGeral = total + honorarios + multa
                                    return `R$ ${totalGeral.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                                  })() : 'R$[VALOR]'}
                                </p>
                          </div>
                        </div>
                          )
                        })()}
                        
                        <div style={{ 
                          marginBottom: '0.1cm',
                          fontFamily: '"Times New Roman", Times, serif',
                              fontSize: '10pt'
                            }}>
                          <table style={{ 
                            width: '100%',
                            borderCollapse: 'collapse',
                            border: '1px solid #333',
                            marginBottom: '0.1cm'
                          }}>
                            <thead>
                              <tr style={{ backgroundColor: '#f0f0f0' }}>
                                <th style={{ 
                                  border: '1px solid #333',
                                  padding: '0.3cm',
                                  textAlign: 'center',
                          fontSize: '10pt',
                            fontWeight: 'bold',
                                  backgroundColor: '#f0f0f0'
                                }} colSpan="2">
                                  Resumo Financeiro
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td style={{ 
                                  border: '1px solid #333',
                                  padding: '0.1cm',
                                  fontSize: '9pt',
                                  fontWeight: 'bold',
                                  backgroundColor: '#e8f4fd'
                                }}>
                                  {formData.tipoValores === 'final' ? 'Valor depositado pelo réu' : 'Valor provisório depositado pelo réu'}
                                </td>
                                <td style={{ 
                                  border: '1px solid #333',
                                  padding: '0.1cm',
                                  textAlign: 'right',
                                  fontSize: '9pt',
                                  fontWeight: 'bold',
                                  backgroundColor: '#e8f4fd',
                                  width: '25%'
                                }}>
                                  {formData.valorDepositado ? `R$ ${formData.valorDepositado}` : 'R$[VALOR]'}
                                </td>
                              </tr>
                              
                              <tr>
                                <td style={{ 
                                  border: '1px solid #333',
                                  padding: '0.1cm',
                                  fontSize: '9pt',
                                  fontWeight: 'bold',
                                  backgroundColor: '#fff2cc'
                                }}>
                                  Descontos sobre o valor depositado pelo réu
                                </td>
                                <td style={{ 
                                  border: '1px solid #333',
                                  padding: '0.1cm',
                                  textAlign: 'right',
                                  fontSize: '9pt',
                                  fontWeight: 'bold',
                                  backgroundColor: '#fff2cc'
                                }}>
                                  {formData.descontosTotal ? `R$ ${formData.descontosTotal}` : 'R$[TOTAL]'}
                                </td>
                              </tr>
                              
                              <tr>
                                <td style={{ 
                                  border: '1px solid #333',
                                  padding: '0.1cm',
                                  fontSize: '9pt',
                                  paddingLeft: '0.5cm'
                                }}>
                                  1. Honorários contratuais ({formData.percentualHonorarios || '[PERCENTUAL]'}%) - Pago pelo cliente
                                </td>
                                <td style={{ 
                                  border: '1px solid #333',
                                  padding: '0.1cm',
                                  textAlign: 'right',
                                  fontSize: '11pt'
                                }}>
                                  {formData.honorariosContratuais ? `R$ ${formData.honorariosContratuais}` : 'R$[VALOR]'}
                                </td>
                              </tr>
                              
                              <tr>
                                <td style={{ 
                                  border: '1px solid #333',
                                  padding: '0.1cm',
                                  fontSize: '9pt',
                                  paddingLeft: '0.5cm'
                                }}>
                                  2. Honorários de sucumbência - Pago pelo réu
                                </td>
                                <td style={{ 
                                  border: '1px solid #333',
                                  padding: '0.1cm',
                                  textAlign: 'right',
                                  fontSize: '11pt'
                                }}>
                                  {formData.honorariosSucumbencia ? `R$ ${formData.honorariosSucumbencia}` : 'R$[VALOR]'}
                                </td>
                              </tr>
                              
                              {formData.incluirMultaArt523 && (
                                <tr>
                                  <td style={{ 
                                    border: '1px solid #333',
                                    padding: '0.1cm',
                                    fontSize: '9pt',
                                    paddingLeft: '0.5cm'
                                  }}>
                                    3. Honorários de Sucumbência da Multa do Art 523 - Pago pelo réu
                                  </td>
                                  <td style={{ 
                                    border: '1px solid #333',
                                    padding: '0.1cm',
                                    textAlign: 'right',
                                    fontSize: '11pt'
                                  }}>
                                    {formData.honorariosSucumbenciaMulta ? `R$ ${formData.honorariosSucumbenciaMulta}` : 'R$[VALOR]'}
                                  </td>
                                </tr>
                              )}
                              
                              {formData.incluirReembolso && formData.custasJudiciais.filter(custa => custa.quemPagou === 'escritorio').map((custa, index) => {
                                const tipoReembolso = custa.tipoReembolso === 'Outro tipo de reembolso' 
                                  ? custa.tipoReembolsoPersonalizado || 'Reembolso custas'
                                  : custa.tipoReembolso || 'Reembolso custas'
                                
                                return (
                                  <tr key={custa.id}>
                                    <td style={{ 
                                      border: '1px solid #333',
                                      padding: '0.1cm',
                                      fontSize: '9pt',
                                      paddingLeft: '0.5cm'
                                    }}>
                                      {formData.incluirMultaArt523 ? calculoIndex + index + 1 : calculoIndex + index}. {tipoReembolso} - Pago pelo escritório
                                    </td>
                                    <td style={{ 
                                      border: '1px solid #333',
                                      padding: '0.1cm',
                                      textAlign: 'right',
                                      fontSize: '11pt'
                                    }}>
                                      {custa.valor ? `R$ ${custa.valor}` : 'R$[VALOR]'}
                                    </td>
                                  </tr>
                                )
                              })}
                              
                            {formData.incluirHonorariosCalculo && (
                                <tr>
                                  <td style={{ 
                                    border: '1px solid #333',
                                    padding: '0.1cm',
                                    fontSize: '9pt',
                                    paddingLeft: '0.5cm'
                                  }}>
                                    {formData.incluirMultaArt523 ? calculoIndex + 1 : calculoIndex}. Honorários de cálculo (1% sobre valor depositado)
                                  </td>
                                  <td style={{ 
                                    border: '1px solid #333',
                                    padding: '0.1cm',
                                    textAlign: 'right',
                                    fontSize: '11pt'
                                  }}>
                                    {formData.honorariosCalculo ? `R$ ${formData.honorariosCalculo}` : 'R$[VALOR]'}
                                  </td>
                                </tr>
                              )}
                              
                              <tr style={{ backgroundColor: '#d4edda' }}>
                                <td style={{ 
                                  border: '2px solid #333',
                                  padding: '0.2cm',
                                  fontSize: '11pt',
                                  fontWeight: 'bold',
                                  textAlign: 'center',
                                  backgroundColor: '#d4edda'
                                }}>
                                  {formData.tipoValores === 'final' ? 'SALDO FINAL DE REPASSE AO CLIENTE' : 'SALDO PROVISÓRIO DE REPASSE AO CLIENTE'}
                                </td>
                                <td style={{ 
                                  border: '2px solid #333',
                                  padding: '0.2cm',
                                  textAlign: 'right',
                                  fontSize: '11pt',
                                  fontWeight: 'bold',
                                  backgroundColor: '#d4edda'
                                }}>
                                  {formData.saldoRepasse ? `R$ ${formData.saldoRepasse}` : 'R$[XXX.XXX,XX]'}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                        
                        <p className="no-gap" style={{ 
                          marginBottom: 0,
                          fontFamily: '"Times New Roman", Times, serif',
                          fontSize: '10pt'
                        }}>
                          *Taxa de transferência: R${formData.taxaTransferencia}.
                        </p>
                        <p className="no-gap" style={{ 
                          marginBottom: '0.1cm',
                          fontFamily: '"Times New Roman", Times, serif',
                          fontSize: '10pt'
                        }}>
                          *O valor recebido ainda sofre correção monetária entre a data da solicitação do alvará e a data de transferência, razão pela qual pode ter acréscimo na quantia "saldo de repasse ao cliente".
                        </p>
                        
                        {formData.observacoes && (
                          <div style={{ marginBottom: '0.4cm' }}>
                            <p style={{ 
                              fontFamily: '"Times New Roman", Times, serif',
                              fontSize: '10pt',
                              fontWeight: 'bold',
                              marginBottom: '0.1cm'
                            }}>
                              Observações:
                            </p>
                            <p style={{ 
                              fontFamily: '"Times New Roman", Times, serif',
                              fontSize: '10pt'
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

