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

    
    // publish data into localstorage
    publishButtonBind(pubButtonId) {
        const pubBtn = document.getElementById(pubButtonId)
        pubBtn.addEventListener("click", function(){
            // Validation Form -------------------------
            if (!isValidForm()) {
                alert("Question Should Not Be Empty and should have at least 1 choice!")
                return
            }

            // NewQuizItem
            const quizItemId = new Date() 
            let correctAnswer = document.getElementById("ansSelect").value
            let question = document.getElementById("questionDiv").querySelector("textarea").value.trimStart().trimEnd()
            let ansObj = {}
            for (let i = 0; i < this.possibleAnswerDiv.children.length; i++) {
                var letter = String.fromCharCode(65 + i)
                ansObj[letter] = this.possibleAnswerDiv.children[i].querySelector("textarea").value
                // clear possible answer           
                this.possibleAnswerDiv.children[i].querySelector("textarea").value = ""
            }
            const newQuizItem = new QuizItem(quizItemId, question, ansObj, correctAnswer)
            
            // Add into Local Storage
            let localData = localStorage.getItem("quizData")
            if (localData) {
                let quizArray = JSON.parse(localData)
                // update
                if ($("#qid").val() != "") {
                    const qid =  $("#qid").val()
                    for (let i = 0; i < quizArray.length; i++) {
                        if (quizArray[i].id == qid) {
                            quizArray[i] = newQuizItem
                            break
                        }
                    }
                    localStorage.setItem("quizData", JSON.stringify(quizArray))
                    setUpdateButtonToPub()
                    // reset and display
                    clearform()
                    displayDataFromLocalStorage()


                    // Updated admination
                    animate(document.getElementById("ok"))  
                    return 
                }  

                // identical question 
                for (let i = 0; i < quizArray.length; i++) {
                    if (quizArray[i].question == newQuizItem.question) {
                        alert("Same question existed!")
                        return 
                    }
                }
                
                // OR just add
                quizArray.push(newQuizItem) 
                localStorage.setItem("quizData", JSON.stringify(quizArray))
                
            } else {
                let quizArray = []
                quizArray.push(newQuizItem)
                localStorage.setItem("quizData", JSON.stringify(quizArray))
            } 

            // +1 animation
            animate(document.getElementById("plusOne"))  

            // reset and display
            clearform()
            displayDataFromLocalStorage()
        }.bind(this))
    } 
}

function clearform() {
    // clear question
    document.getElementById("questionDiv").querySelector("textarea").value = ""

    // clear possible answer
    const parent = document.getElementById("possibleAnswers");
    while (parent.children.length > 0) {
        parent.children[0].remove()
    }

    // remove all options 
    let ansSelect = document.getElementById("ansSelect")
    ansSelect.options.length = 0

    // clear identifier
    $("#qid").val("")


    // clear cancel button if any
    $("#cancelbtn").remove()
}

// we make sure
// 1. question exist
// 2. at least 1 possible answer
function isValidForm() {
    return document.getElementById("questionDiv").querySelector("textarea").value.length > 0 && document.getElementById("possibleAnswers").querySelectorAll("div").length > 0 
}


// Dynamically display data from local storage
function displayDataFromLocalStorage() {
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
        clearform()
        const id = $(this).parent().parent().find(".question").attr("uid")
        let quizData = localStorage.getItem('quizData')
        let quizArray = JSON.parse(quizData)
        let targetQuizItem = null
        for (let i = 0; i < quizArray.length; i++) {
            if (quizArray[i].id === id) {
                targetQuizItem = quizArray[i]
                break
            }
        }
        document.getElementById("questionDiv").querySelector("textarea").value = targetQuizItem.question
        const addAnsBtn = document.getElementById("addAnsBtn");
        for (const key in targetQuizItem.ansObj) {
            addAnsBtn.click()
            let ansDiv = document.getElementById(key)
            ansDiv.querySelector("textarea").value = targetQuizItem.ansObj[key]
        }

        $("#ansSelect").val(targetQuizItem.correctAnsLetter);
        $("#qid").val(id)
        setPubButtonToUpdate(this)
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
        displayDataFromLocalStorage()

        // just an animation of delete
        animate(document.getElementById("deleteOne"))

        clearform()
        setUpdateButtonToPub()
    })
}


// utils ------
function setPubButtonToUpdate(editBtn) {
    // enbale all 
    $(".btn-edit").prop("disabled", false);

    // disable only current edit btn
    let button = $(editBtn);
    button.prop('disabled', true);

    const pubBtn = document.getElementById("pubBtn")
    pubBtn.innerHTML = "Update"
    pubBtn.className = "btn btn-warning"

    // add a field to cancel 
    const cancelBtn = document.createElement("button")
    cancelBtn.innerHTML = "Cancel"
    cancelBtn.className = "btn btn-danger"
    cancelBtn.id = "cancelbtn"

    // add cancelBtn to div
    const subdiv = document.getElementById("submit")
    subdiv.appendChild(cancelBtn)

    cancelBtn.addEventListener("click", function() {
        setUpdateButtonToPub()
        clearform()
        // enable edit btn
        button.prop('disabled', false);        
    })
}

function setUpdateButtonToPub() {
    const pubBtn = document.getElementById("pubBtn")
    pubBtn.innerHTML = "Publish"
    pubBtn.className = "btn btn-primary"
}

function animate(component) {
    component.style.display = "block";
    setTimeout(() => {
        component.style.display = "none";
    }, 2000);
}

function exportButtonListern(key) {
    $('#' + key).click(function() {
        // Stringify localStorage data
        const localStorageData = JSON.stringify(localStorage);

        // Create a Blob with the localStorage data
        const blob = new Blob([localStorageData], {type: 'application/json'});

        // Create a temporary anchor element to trigger the download
        const downloadLink = document.createElement('a');
        downloadLink.href = window.URL.createObjectURL(blob);
        downloadLink.download = 'localStorage.json';

        // Trigger the download by appending the anchor to the document and simulating a click
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);

    })
}