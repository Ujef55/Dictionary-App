const input = document.querySelector('.input-box');
const searchButton = document.getElementById('search-button');
const closeBtn = document.getElementById('closeModal');
const closeError = document.getElementById('closeError');
const modal = document.getElementById('myModal')
const modalWord = document.getElementById('modalWord');
const modalSpeechType = document.getElementById('modalSpeech');
const modalOrigin = document.getElementById('modalOrigin');
const modalPhonetic = document.getElementById('modalPhonetic');
const defination = document.querySelector('.defination');
const errorTitle = document.getElementById('errorTitle');
const errorMsg = document.getElementById('errorMsg');
const errorContent = document.querySelector('.errorContent');
const volumeBtn = document.querySelector('.volumeBtn');
const phoneticAudio = document.getElementById('phoneticAudio');
const errorAudio = document.getElementById('errorAudio');


async function getFullDetails(word) {
    input.value = '';
    let url = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;
    let response = await fetch(url);
    let dictionaryData = await response.json();

    console.log(dictionaryData);

    if (dictionaryData.title === "No Definitions Found") {
        errorTitle.innerHTML = `${dictionaryData.title}`;
        errorMsg.innerHTML = `${dictionaryData.message}`;
        errorContent.style.display = 'block';
        modal.style.display = 'none';
    } else {
        modal.style.display = 'block';
        errorContent.style.display = 'none';
    }

    let phoneticAudioUrl;
    for (let i = 0; i < dictionaryData[0].phonetics.length; i++) {
        if (dictionaryData[0].phonetics[i] && dictionaryData[0].phonetics[i].audio) {
            phoneticAudioUrl = dictionaryData[0].phonetics[i].audio;
            break;
        }

    }

    try {

        if (dictionaryData.length > 0) {
            modalWord.innerHTML = `${dictionaryData[0].word}`;
            if (dictionaryData[0].phonetics.length > 0) {
                modalPhonetic.innerHTML = `${dictionaryData[0].phonetics[0].text}`;
            } else {
                modalPhonetic.innerHTML = '';
            }

            defination.innerHTML = '';
            dictionaryData[0].meanings.forEach(obj => {
                let h4 = document.createElement('h4');
                h4.textContent = `${obj.partOfSpeech}`;
                h4.classList.add('partOfSpeech');
                defination.appendChild(h4);

                obj.definitions.forEach(definitionObj => {
                    let meaning = document.createElement('p');
                    meaning.textContent = `${definitionObj.definition}`;
                    meaning.classList.add('meaning');
                    defination.appendChild(meaning);

                    if (definitionObj.example !== undefined) {
                        let example = document.createElement('p');
                        example.textContent = `Example: ${definitionObj.example}`;
                        example.classList.add('example');
                        defination.appendChild(example);
                    }
                });
            });
        }
        console.log(dictionaryData);

    } catch (error) {
        console.error('Error fetching data:', error);
        errorMsg.innerHTML = `${error}`;
    }



    function playAudio(audioUrl) {
        phoneticAudio.setAttribute('src', audioUrl);
        phoneticAudio.play();
        let hasError = false;
        for (let i = 0; i < dictionaryData[0].phonetics.length; i++) {
            if (dictionaryData[0].phonetics[i].audio === '') {
                hasError = true;
                break;
            }
        }

        if (hasError) {
            errorAudio.innerHTML = "Sorry, Can't find the audio for this word";
            setTimeout(() => {
                errorAudio.innerHTML = '';
            }, 2000);
        }
    }


    volumeBtn.addEventListener('click', () => {
        playAudio(phoneticAudioUrl);
    });

}


searchButton.addEventListener('click', () => {
    getFullDetails(input.value);
});

input.addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
        getFullDetails(input.value);
    }
});

closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
    input.value = '';
});

closeError.addEventListener('click', () => {
    errorContent.style.display = 'none';
    input.value = '';
});






