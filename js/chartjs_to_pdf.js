const toPdf = async () => {
    const { jsPDF } = window.jspdf
    const pdf = new jsPDF('p', 'mm', 'a4')
    const pageHeight = 297
    const margin = 10
    let yPosition = margin

    // Get Chart Element
    const elementChart = document.getElementById('mygrafik')
    const elementChart2 = document.getElementById('mygrafik2')
    const canvasChart = await html2canvas(elementChart)
    const canvasChart2 = await html2canvas(elementChart2)
    const chartData = canvasChart.toDataURL('chart1/jpeg')
    const chartData2 = canvasChart2.toDataURL('chart2/jpeg')

    //Chart to PDF
    const imgWidth = 190
    const imgHeight = (canvasChart.height * imgWidth) / canvasChart.width
    const imgHeight2 = (canvasChart2.height * imgWidth) / canvasChart2.width
    pdf.addImage(chartData, 'JPEG', 10, yPosition, imgWidth, imgHeight,'', 'FAST')

    yPosition += imgHeight + margin
    pdf.addImage(chartData2, 'JPEG', 10, yPosition, imgWidth, imgHeight2, '', 'FAST')

    // Get Table Element
    const elementTable = document.getElementById('tableexample')
    const canvasTable = await html2canvas(elementTable)
    const dataTable = canvasTable.toDataURL('image3/jpeg')
    const tableHeight = (canvasTable.height * imgWidth) / canvasTable.width

    // Table to PDF
    pdf.addPage('a4','portrait')
    yPosition = margin
    pdf.addImage(dataTable, 'JPEG', 10, yPosition, imgWidth, tableHeight,  '', 'FAST')

    pdf.save('TestReport.pdf')
}