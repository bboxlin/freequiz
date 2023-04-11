function importButtonListener(id) {
    const importer = new Map()
    importer.set("application/json", insertJSONtoLocalStorage)
    importer.set("text/plain", insertTXTtoLocalStorage)

    $('#' + id).click(function(event) {
        event.preventDefault(); 
        const fileInput = $('#fileInput');
        const file = fileInput[0].files[0];
        if (!file) {
            alert('Please choose a file.');
            return;
        }
        const reader = new FileReader();
        reader.onload = function(e) {
            const importedData = e.target.result
            const fileType = file.type
            importer.get(fileType)(importedData)
            fileInput.val('');
        };
        reader.onerror = function(e) {
            alert('Error: Unable to read file.');
            fileInput.val('');
        };
        reader.readAsText(file);
    })
}

function insertTXTtoLocalStorage(data) {
    const existingQuizData = localStorage.getItem('quizData');
    const existingQuizArray = JSON.parse(existingQuizData);
    const exitingQuestionNames = new Set();
    const oldlen = existingQuizArray.length;
    existingQuizArray.forEach(existingQuizItem => {
        exitingQuestionNames.add(existingQuizItem.question);
    });
    quizListString = data.split("\n\n") 
    quizListString.forEach(quizString => {
        quizItemList = quizString.split("\n")
        if (quizItemList.length <= 2) {
            return // same as continue in traditional for loop
        }
        // quizItemList = [question, A_choice, B_choice, ....., letter of answer]
        const id = new Date()
        const question = parseTxtQuestion(quizItemList[0])
        if (!exitingQuestionNames.has(question)) {
            const ansobj = parseTxtChoices(quizItemList)
            const ans = quizItemList[quizItemList.length - 1].trim()
            const newQuizItem = new QuizItem(id, question, ansobj, ans)
            existingQuizArray.push(newQuizItem)
        }  
        exitingQuestionNames.add(question)
    })
    const newlen = existingQuizArray.length;
    // update the local sotrage
    localStorage.setItem("quizData", JSON.stringify(existingQuizArray))
    displayDataFromLocalStorage()

    msg = `
    ${newlen-oldlen} quiz item(s) inserted \n
    Note: Duplicate question name will not be inserted by default!
    `
    alert(msg)
}

function parseTxtQuestion(s) {
    // number. xxxxxxxxxx
    // we want the xxxxxxxx
    const regex = /^\d+\. +(.*)$/;
    const match = s.match(regex);
    return match ? match[1] : "";
}

function parseTxtChoices(arr) {
    const ansobj = {}
    const regex = /^([A-Za-z])\. +(.*)$/;
    for (let i = 1; i < arr.length - 1; i++) {
        const match = arr[i].match(regex);
        if (match) {
            ansobj[match[1]] = match[2];
        }
    }
    return ansobj;
}
    

function insertJSONtoLocalStorage(data) {
    const existingQuizData = localStorage.getItem('quizData');
    const existingQuizArray = JSON.parse(existingQuizData);
    const exitingQuestionNames = new Set();
    const oldlen = existingQuizArray.length;
    existingQuizArray.forEach(existingQuizItem => {
        exitingQuestionNames.add(existingQuizItem.question);
    });

    const newQuizArray = JSON.parse(data)
    newQuizArray.forEach(newQuizItem => {
        newquestion = newQuizItem.question.trim()
        if (!exitingQuestionNames.has(newquestion)) {
            existingQuizArray.push(newQuizItem)
        }  
        exitingQuestionNames.add(newquestion)
    })
    const newlen = existingQuizArray.length;
    // update the local sotrage
    localStorage.setItem("quizData", JSON.stringify(existingQuizArray))
    displayDataFromLocalStorage()

    msg = `
    ${newlen-oldlen} quiz item(s) inserted \n
    Note: Duplicate question name will not be inserted by default!
    `
    alert(msg)
}

function clearFileListener(id) {
    $('#' + id).click(function(event) {
        event.preventDefault(); 
        const fileInput = $('#fileInput');
        fileInput.val('');
    })
}
