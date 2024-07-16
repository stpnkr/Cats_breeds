
const catsFirstLetterBreed_selector = document.querySelector('#catsFirstLetterBreed');
const catRandom_switcher = document.querySelector('#catRandom_switcher');
const quantityCats = document.querySelector('#catResponse_input');

const catsList = document.querySelector('#catsList');
const catsDetails = document.querySelector('#catsDetails');

const catsFirstLetterBreed = document.querySelector('#catsFirstLetterBreed');

const catsFirstLetterBreed_arr = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'R', 'S', 'T', 'U', 'Y'];
const catsDetailTitle_arr = ['Порода: ','<b>Страна: </b>','<b>Происхождение: </b>','<b>Шерсть: </b>','<b>Узор: </b>'];

// создание списка первых букв в select
catsFirstLetterBreed_arr.forEach ((ltr) => {
    let new_select = document.createElement('option');
    new_select.value = ltr;
    new_select.innerText = ltr;
    catsFirstLetterBreed.append(new_select);
});


// функция перемешивания названия пород
  // генератор массива случайных чисел
function randomiser_arr(min, max, arr) {
  let randomNumbers_arr = [];
    
  while ((randomNumbers_arr.length) < max) { 
    let randomNum = Math.floor(Math.random() * (((max - 1) - min + 1)) + min);

    if (!randomNumbers_arr.includes(randomNum)) {
      randomNumbers_arr.push(randomNum);
    }

  }
      
  let new_arr = [];
  for (i = 0; i < arr.length; i++) {
    new_arr.push(arr[randomNumbers_arr[i]]);
    
  }
    
return new_arr;

};
  
  // console.log (catsFirstLetterBreed_selector.value);

document.querySelector('#catResponse_button').onclick = click_response;

async function click_response() {

    // если ничего не выбрано, задаются значения полей по умолчанию 
    if (quantityCats.value === '')
      {quantityCats.value = '10'};

    if (catsFirstLetterBreed_selector.value === 'Выберите первую букву названия породы')
      {catsFirstLetterBreed_selector.value = ''};

    // запрос на сервер. Сначала запрашивал конкретное количество, потом сделал так, что бы запрашивал все породы для последующих манипуляций, потому что не нашел параметры для запроса только количество.
    // let catsResponse = await fetch(`https://catfact.ninja/breeds?limit=${quantityCats}`)
    
    let catsResponse = await fetch('https://catfact.ninja/breeds?limit=98')
    .then(function (resp) {return resp.json()})
    .then (function(resp) {return resp.data})
    .catch(function (error) {alert(error)});    

    console.log(catsFirstLetterBreed_selector.value);

    let catsResponse_changed = catsResponse;

    // активирует функцию перемешивания
    if (catRandom_switcher.checked)
      {catsResponse_changed = randomiser_arr(0, catsResponse_changed.length, catsResponse_changed)};


    // фильтрует породы по первой букве названия
    catsResponse_changed  = catsResponse_changed.filter(function(catObj) {
        return catObj.breed.startsWith(`${catsFirstLetterBreed_selector.value}`);
    });


    // оставляет только указанное количество пород
    catsResponse_changed.splice(`${quantityCats.value}`);

    // тут создаётся список пород слева
    let catsList_ul = document.createElement('ul');
    catsList_ul.className = 'list-group';

    catsList.innerHTML = '';
    catsList.append(catsList_ul);
   
      catsResponse_changed.forEach(function(catObj) {
        
        let catsList_li = document.createElement('li');
        catsList_li.textContent = catObj.breed;
        // console.log(catsList_li);
        catsList_li.className = 'list-group-item';
        catsList_ul.append(catsList_li);

          // тут по клику на элементе списка слева справа создается карточка с дополнительной информацией о породе
              catsList_li.addEventListener('click', async function() {
              catsList_ul.childNodes.forEach (function(child_li) { 
              child_li.className = 'list-group-item';
                });
              catsList_li.className = 'list-group-item active'
              catsDetails.innerHTML = '';
                                
              let cat_breed = document.createElement('h1');
              cat_breed.innerText = 'Порода: ' + catObj.breed;
              catsDetails.append(cat_breed);

              for (let i = 1; i < Object.values(catObj).length; i++) {

                  let catDetails_p = document.createElement('p');
              
                  catDetails_p.innerHTML = catsDetailTitle_arr[i] + Object.values(catObj)[i];
                  catsDetails.append(catDetails_p);

              }
              
              let catFact = await fetch('https://catfact.ninja/fact')
              .then (response => response.json())
              .catch(function (error) {alert(error)});
              
              let factDetails_p = document.createElement('p');
              
                  factDetails_p.innerText= 'Интересный факт: ' + catFact.fact;
                  catsDetails.append(factDetails_p);

              });
            
      });

};




