function exportButtonListener(id) {
    let exporter = new Map()
    exporter.set("json", exportAsJSON)
    exporter.set("txt", exportAsTXT)

    $('#' + id).click(function(event) {
        event.preventDefault();
        let type = $("#downloadtype").val()
        exporter.get(type)()
    })
}

function exportAsJSON() {
    let quizData = localStorage.getItem('quizData')
    let quizArray = JSON.parse(quizData)
    const exportedData = JSON.stringify(quizArray, null, '\t');
    mockADownloadLink('application/json', exportedData, "downloaded_quiz.json")
}

function exportAsTXT() {
    let quizData = localStorage.getItem('quizData')
    let quizArray = JSON.parse(quizData)
    let exportedData = ""
    quizArray.forEach((item, i) => {
        exportedData += `${i+1}. ${item.question}\n` +
                   `${Object.entries(item.ansObj).map(([key, value]) => `${key}. ${value}`).join('\n')}\n` +
                   `${item.correctAnsLetter}\n\n`;
    })
    mockADownloadLink('text/plain;charset=utf-8', exportedData, "downloaded_quiz.txt")
}

function mockADownloadLink(fileType, exportedData, outputName) {
    const blob = new Blob([exportedData], {type: fileType});
    const downloadLink = document.createElement('a');
    downloadLink.href = window.URL.createObjectURL(blob);
    downloadLink.download = outputName;

    // Trigger the download by appending the anchor to the document and simulating a click
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
}