function updateSection(sectionId) {
    const scoreDiv = document.getElementById(sectionId + '-score')
    const indicators = document.getElementsByClassName(sectionId);
    scoreDiv.innerText = parseInt(
        [...indicators]
            .map((indicator) => parseInt(indicator.innerText))
            .reduce((accumulator, current) => accumulator + current)
        / indicators.length) + '%'
}
function checkBoxChecked(event) {
    const indicator = document.getElementById(event.name.split('-')[0] + '-indicator')
    indicator.innerText = event.checked ? '100%' : '0%'
    updateSection(event.parentElement.parentElement.parentElement.id)
}
function multiSelectClicked(event) {
    const indicator = document.getElementById(event.name.split('-')[0] + '-indicator')
    indicator.innerText = event.value
    updateSection(event.parentElement.parentElement.parentElement.id)
}
function createCheckList(checkListData, rootElement) {
    let sectionCounter = 1
    let questionCounter = 1
    checkListData.forEach((section) => {
        const sectionDiv = document.createElement('div')
        sectionDiv.className = 'section'
        sectionDiv.id = 'section-' + sectionCounter
        rootElement.appendChild(sectionDiv)
        sectionDiv.appendChild(createHeader(section.section, sectionDiv.id))
        section.criteria.forEach((criteria) => {
            if (criteria.type === 'checkbox') {
                sectionDiv.appendChild(createCheckBoxCriteria(criteria.description, sectionDiv.id, questionCounter))
            }
            if (criteria.type === 'multichoice') {
                sectionDiv.appendChild(createMultichoiceCriteria(criteria.description, sectionDiv.id, questionCounter))
            }
            questionCounter++
        })
        sectionCounter++
        const textArea = document.createElement('textarea')
        textArea.rows = 10
        textArea.cols = 75
        textArea.style.resize = 'none'
        sectionDiv.appendChild(textArea)
    })
}
function createHeader(sectionTitle, sectionId) {
    const headerDiv = document.createElement('div')
    headerDiv.innerHTML = `
                <h3 style="display: inline-block">${sectionTitle}</h3>
                <div style="display: inline-block" id="${sectionId}-score">0%</div>
            `
    return headerDiv
}
function createCheckBoxCriteria(description, sectionId, questionNumber) {
    const checkBoxDiv = document.createElement('div')
    checkBoxDiv.innerHTML = `
                <div class="${sectionId}" style="display: inline-block" id="q${questionNumber}-indicator">0%</div>
                <div style="display: inline-block">
                    <label for="q${questionNumber}-input" id="q${questionNumber}-input-label">${description}</label>
                    <input name="q${questionNumber}-input" type="checkbox" onclick="checkBoxChecked(this)"/>
                </div>
            `
    return checkBoxDiv

}
function createMultichoiceCriteria(description, sectionId, questionNumber) {
    const multiChoiceDiv = document.createElement('div')
    multiChoiceDiv.innerHTML = `
                <div class="${sectionId}" style="display: inline-block" id="q${questionNumber}-indicator">0%</div>
                <div style="display: inline-block">
                    <label for="q${questionNumber}-input-1">${description}</label>
                    <button class="multichoice" name="q${questionNumber}-input-1" value="0%" onclick="multiSelectClicked(this)">-2</button>
                    <button class="multichoice" name="q${questionNumber}-input-2" value="33%" onclick="multiSelectClicked(this)">-1</button>
                    <button class="multichoice" name="q${questionNumber}-input-3" value="66%" onclick="multiSelectClicked(this)">1</button>
                    <button class="multichoice" name="q${questionNumber}-input-4" value="100%" onclick="multiSelectClicked(this)">2</button>
                </div>
            `
    return multiChoiceDiv
}
function uploadFile(event) {
    const fileInput = document.getElementById('fileinput')
    const fileReader = new FileReader()
    fileReader.onload = (event) => {
        const checklist = JSON.parse(event.target.result)
        const checkListDiv = document.getElementById('checklist')
        checkListDiv.innerHTML = null
        createCheckList(checklist, checkListDiv)
    }
    fileReader.readAsText(fileInput.files.item(0))
}
function createFeedback(event) {
    const sections = [...document.getElementsByClassName('section')]
    const totalScore = parseInt(
        sections
            .map((section, index) => parseInt(document.getElementById('section-' + (index + 1) + '-score').innerText))
            .reduce((accumulator, current) => accumulator + current) / sections.length
    ) + '%'
    const checkListDiv = document.getElementById('checklist')
    checkListDiv.querySelectorAll('input').forEach((element) => element.parentNode.removeChild(element))
    checkListDiv.querySelectorAll('button').forEach((element) => element.parentNode.removeChild(element))
    checkListDiv.querySelectorAll('textarea').forEach((element) => {
        const div = document.createElement('div')
        div.innerText = element.value
        element.parentNode.replaceChild(div, element) 
    })
    document.getElementById('feedback').innerText = `Total score: ${totalScore}`
}
