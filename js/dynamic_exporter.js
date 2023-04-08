function exportButtonListener(id) {
    $('#' + id).click(function(event) {
        event.preventDefault();

        const localStorageData = JSON.stringify(localStorage);
        const blob = new Blob([localStorageData], {type: 'application/json'});

        // Create a temporary anchor element to trigger the download
        const downloadLink = document.createElement('a');
        downloadLink.href = window.URL.createObjectURL(blob);
        downloadLink.download = 'quiz.json';

        // Trigger the download by appending the anchor to the document and simulating a click
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    })
}
 