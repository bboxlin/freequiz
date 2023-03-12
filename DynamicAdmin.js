class DynamicAdmin {
    constructor(id) {
        this.possibleAnswerDiv = document.getElementById(id)
        this.possibleAnswerDivChildren = this.possibleAnswerDiv.children 
    }

    addAnswerBtnClickBind(addButtonId) {
        const addAnsBtn = document.getElementById(addButtonId)
        addAnsBtn.addEventListener("click", function(){
            // var this.possibleAnswerDiv = document.getElementById("possibleAnswers")
            var numPossibleAnswer = this.possibleAnswerDiv.querySelectorAll("div").length
            var nxtLetter = String.fromCharCode(65 + numPossibleAnswer)
    
            // creat a new possible answer div
            var newAnswerDiv = document.createElement("div")
            var divContent = "Answer " + nxtLetter
            newAnswerDiv.id = nxtLetter
            newAnswerDiv.className = "form-group"
            newAnswerDiv.textContent = divContent

            // rmbtn a rmtbtn inside the new possible answer div 
            var rmbtn = document.createElement("button")
            rmbtn.textContent = "x"
            rmbtn.type = "button"
            rmbtn.className = "btn btn-danger btn-sm"
            rmbtn.addEventListener("click", function() {
                // shift to up by one
                var startIdx = Array.prototype.indexOf.call(this.possibleAnswerDivChildren, newAnswerDiv);
                for (let i = startIdx; i < this.possibleAnswerDivChildren.length - 1; i++) {
                    this.possibleAnswerDivChildren[i].querySelector("textarea").value = this.possibleAnswerDivChildren[i+1].querySelector("textarea").value
 
                }
                
                // always delete the last possible ans 
                this.possibleAnswerDiv.lastElementChild.remove()

                // for selecting field, just delete the last
                var ansSelect = document.getElementById("ansSelect")
                var lastOption = ansSelect.options[ansSelect.options.length - 1];
                lastOption.remove();
            }.bind(this));
            newAnswerDiv.appendChild(rmbtn)

            // create textarea field inside the new possinle answer div
            var ansTextArea = document.createElement("textarea")
            ansTextArea.className = "form-control"
            ansTextArea.id = "answer" + nxtLetter
            ansTextArea.placeholder = "Enter your answer"
            ansTextArea.style = "margin-top: 5px;"
            newAnswerDiv.appendChild(ansTextArea)
            
   
            // put new possible answer div into this.possibleAnswerDiv
            this.possibleAnswerDiv.appendChild(newAnswerDiv)

            const ansSelect = document.getElementById("ansSelect")
            const newOption = document.createElement("option")
            newOption.value = nxtLetter
            newOption.text = nxtLetter
            ansSelect.appendChild(newOption)
        }.bind(this));
    }

    
   
    publishButtonBind(pubButtonId) {
        const pubBtn = document.getElementById(pubButtonId)
            // validate form
        pubBtn.addEventListener("click", function(){
            // Validation Form -------------------------
            if (!isValidForm()) {
                alert("Question Should Not Be Empty")
                return
            }

            // NewQuizItem
            const quizItemId = new Date() 
            let correctAnswer = document.getElementById("ansSelect").value
            let question = document.getElementById("questionDiv").querySelector("textarea").value
            // clear question
            document.getElementById("questionDiv").querySelector("textarea").value = ""
            let ansMap = {}
            for (let i = 0; i < this.possibleAnswerDiv.children.length; i++) {
                var letter = String.fromCharCode(65 + i)
                ansMap[letter] = this.possibleAnswerDiv.children[i].querySelector("textarea").value
                // clear possible answer           
                this.possibleAnswerDiv.children[i].querySelector("textarea").value = ""
            }
            const newQuizItem = new QuizItem(quizItemId, question, ansMap, correctAnswer)

            // Do Local Storage
            let localData = localStorage.getItem("quizData")
            if (localData) {
                let quizArray = JSON.parse(localData)
                quizArray.push(newQuizItem) 
                localStorage.setItem("quizData", JSON.stringify(quizArray))
            } else {
                let quizArray = []
                quizArray.push(newQuizItem)
                localStorage.setItem("quizData", JSON.stringify(quizArray))
            }
            loadDataFromLocalStorage()
            
        }.bind(this))

    } 

 
}

// we make sure
// 1. question exist
// 2. at least 1 possible answer
function isValidForm() {
    return document.getElementById("questionDiv").querySelector("textarea").value.length > 0 && document.getElementById("possibleAnswers").querySelectorAll("div").length > 0 
}


// Dynamically load data
function loadDataFromLocalStorage() {
    let quizData = localStorage.getItem('quizData');
    if (quizData) {
        $("#tblData tbody").html("");
        let quizArray = JSON.parse(quizData);
        let index = 1;
        quizArray.forEach(element => {
            let dynamicTR = "<tr>";
            dynamicTR = dynamicTR + "<td> " + index + "</td>";
            dynamicTR = dynamicTR + "<td class='question'  uid=" + element.id + ">" + element.question + "</td>";
            dynamicTR = dynamicTR + "    <td class='tdAction text-center'>";
            dynamicTR = dynamicTR + "        <button class='btn btn-sm btn-success btn-edit'> Edit</button>";
            dynamicTR = dynamicTR + "        <button class='btn btn-sm btn-danger btn-delete'> Delete</button>";
            dynamicTR = dynamicTR + "    </td>";
            dynamicTR = dynamicTR + " </tr>";
            $("#tblData tbody").append(dynamicTR);
            index++;
        });
    }
}

function editBtnLocalStorageListerner() {
    $('#tblData').on('click', '.btn-edit', function () {
        console.log("He")
    })
}

function deleteBtnLocalStorageListerner() {
    $('#tblData').on('click', '.btn-delete', function () {
        const id = $(this).parent().parent().find(".question").attr("uid")
        let quizData = localStorage.getItem('quizData')
        let quizArray = JSON.parse(quizData)
        const newQuizArray = quizArray.filter(function(quizItem) {
            return quizItem.id !== id;
        });
        localStorage.setItem('quizData', JSON.stringify(newQuizArray));
        loadDataFromLocalStorage()
    })
}
