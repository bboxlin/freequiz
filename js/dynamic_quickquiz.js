function showQuickQuiz() {
    let quickres = $("#quickres")
    let quizData = localStorage.getItem('quizData')
    let quizArray = JSON.parse(quizData)

    // shuffle array and cut
    let selectLen = parseInt($("#numquestion").val())
    selectLen = Math.min(quizArray.length, selectLen)
    quizArray = shuffleArray(quizArray)
    quizArray = quizArray.slice(0, selectLen)

    quizArray.forEach(quizItem => {
        const quizdiv = `
            <div class="card mt-4">
                <div class="card-header">
                    <h2 class="card-title">${quizItem.question}</h2>
                </div>
                <div class="card-body">
                    <form data-question="${quizItem.question}">
                        ${Object.entries(quizItem.ansObj).map(([key, value]) => `
                            <div class="form-check">
                                <input class="form-check-input" type="radio" name="answer" id="answer-${key}" value="${key}">
                                <label class="form-check-label" for="answer-${key}">
                                    ${key}) ${value}
                                </label>
                            </div>
                        `).join('')}
                    </form>
                </div>
            </div>
        `
        quickres.append(quizdiv)
    })
}

function clickerListener(key) {
    $('#' + key).click(function(event) {
        event.preventDefault()
        resetQuickQuiz()
        showQuickQuiz()
    })
}

function quickquizsubmitListener(key) {
    $("#" + key).on("click", function() {
        let quickres = document.getElementById("quickres")
        let quizData = localStorage.getItem('quizData')
        let quizArray = JSON.parse(quizData)
        const quizForms = quickres.querySelectorAll('.card-body form');
        quizForms.forEach((form) => {
            const question = form.dataset.question;
            const selectedAnswer = form.querySelector('input[type="radio"]:checked');
            let isCorrect = false 
            if (selectedAnswer) {
                for (const quizItem of quizArray) {
                    if (quizItem.question === question) {
                        if (quizItem.correctAnsLetter === selectedAnswer.value) {
                            isCorrect = true
                        }
                    }
                }
            } 
            markForm(form, isCorrect);
        });
    })
}
function markForm(form, isCorrect) {
    // Remove any existing border classes
    form.classList.remove('border', 'border-success', 'border-danger');
    if (isCorrect) {
        // Mark form green
        form.classList.add('border', 'border-success');
    } else {
        // Mark form red
        form.classList.add('border', 'border-danger');
    }
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function resetQuickQuiz() {
    $("#quickres").html("")
}