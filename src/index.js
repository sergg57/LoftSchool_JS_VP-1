
let inputFilterLeft = document.querySelector('.filter_left-input');
let inputFilterRight = document.querySelector('.filter_right-input');
let usersBlock = document.querySelector('.users-block');
let friendsList = document.querySelector('#list');
// console.log('friendsList=', friendsList);
let selectList = document.querySelector('#select_list');
// console.log('select-List-0=', selectList);
let ButtonSave = document.querySelector('.save_button')

var storage = sessionStorage;
/**
 * Функция должна проверять встречается ли подстрока chunk в строке full1, или в строке fuul2,
 * начаная только с первой буквы
 * Проверка должна происходить без учета регистра символов
 *
 * @example
 * isMatching('Moscow', 'moscow') // true
 * isMatching('Moscow', 'mosc') // true
 * isMatching('Moscow', 'cow') // false
 * isMatching('Moscow', 'SCO') // false
 * isMatching('Moscow', 'Moscov') // false
 *
 * @return {boolean}
*/
/*
function isMatching(full1, full2, chunk) {


    full1 = full1.toLowerCase();
    full2 = full2.toLowerCase();
    chunk = chunk.toLowerCase();

    if (full1.indexOf(chunk, 0) == 0 || full2.indexOf(chunk, 0) == 0 ) { //|| full.indexOf(chunk, 0) < 0
        bool = true;
    }

    return bool;

}  */

/**
 * Функция должна проверять встречается ли подстрока chunk в строке full
 * Проверка должна происходить без учета регистра символов
 *
 * @example
 * isMatching('Moscow', 'moscow') // true
 * isMatching('Moscow', 'mosc') // true
 * isMatching('Moscow', 'cow') // true
 * isMatching('Moscow', 'SCO') // true
 * isMatching('Moscow', 'Moscov') // false
 *
 * @return {boolean}
 */
function isMatching(full1, full2, chunk) {
    let bool = true;
    let full = full1 + ' ' + full2;

    full = full.toLowerCase();

    if (full.indexOf(chunk) < 0) {
        bool = false;
    }

    return bool;
}

/* ФУНКЦИЯ чтения данных из SDK Вконтакте (SDK - набор средств разработки)
method -  метод -функция данные которой надо прочитать - например - friends
params - аргументы=пареметры метода=функции -версия, выводимые поля
 */
function api(method, params) {
    return new Promise((resolve, reject) =>{
        VK.api(method, params, data => {
            if (data.error) {
                reject(new Error(data.error_msg));
            } else {
                resolve(data.response)
            }
        });
    });
}

/* Функция - GetUserFrieds - устанавливает соединение с SDK ВКонтакте и загружает друзей пользователя */
function GetUserFriends () {
    return new Promise(function (resolve, reject) {
        VK.init({
            apiId: 6190607
        });

        VK.Auth.login(data => {
            if (data.session) {
                resolve(api('friends.get', { v: 5.68, fields: 'first_name, last_name, photo_50' }));
            } else {
                reject(new Error('Не удалось авторизоваться'));
            } // end if
        }, 8); // end VK.Auth.login
    }); // end Promise

} // end function GetUserFriends


// ----- Функция -обработчик события фильтрует общий список друзей по введённым символам ---//
inputFilterLeft.addEventListener('keyup', function (e) {

    if (ArrayObjList('#select_list').length == 0) { // это когда правый список пуст
        let startList = JSON.parse(storage.list);

        enterLeftLists('#user-left_template', startList);
        let result = filter('#list', inputFilterLeft);

        enterLeftLists('#user-left_template', result);
    } else {

        let startList = JSON.parse(storage.CurrentList);

        enterLeftLists('#user-left_template', startList);
        let result = filter('#list', inputFilterLeft);

        enterLeftLists('#user-left_template', result);
    }

});  // end обработчика собития - inputFilterLeft.addEventListener

// ----- Функция -обработчик события фильтрует избранный список друзей по введённым символам --- //
inputFilterRight.addEventListener('keyup', function (e) {

    if (storage.selectlist == undefined || storage.selectlist == '' ) {
        //console.log('Список отобранных друзей - не сохранен', storage.selectlist);

        //let startList = JSON.parse(storage.CurrentSelectList);

        let startselectList = JSON.parse(storage.selectlist);

        enterRightLists('#user-right_template', startselectList);

        let result = filter('#select_list', inputFilterRight);

        enterRightLists('#user-right_template', result);

    } else {
        //let startselectList = JSON.parse(storage.selectlist);

        let startselectList = JSON.parse(storage.CurrentSelectList);
        enterRightLists('#user-right_template', startselectList);
        let result = filter('#select_list', inputFilterRight);
        //console.log('result-right-filter', result);
        enterRightLists('#user-right_template', result);
    }
});

// ---- Функция Фильтрации по имени и по фамилии -- //
function filter(selectList, inputFilter) {
    let ArrayObj = ArrayObjList(selectList);
    let result = [];
    /* console.log('ArrayObj=', ArrayObj);
    console.log('inputFilter=', inputFilter);
    console.log('inputFilter=', inputFilter.value);
    */
    for (var i =0; i < ArrayObj.length; i++) {
        if (inputFilter.value.length == 0) {
            result = ArrayObj;
            //console.log('result - 000 =', result);
        } else {
            if (isMatching(ArrayObj[i].first_name, ArrayObj[i].last_name, inputFilter.value) === true) {
                result.push(ArrayObj[i]);
            }// end if-2
        } // end if-1
    } // end for

    if (selectList == '#list' && inputFilter.value.length == 0 ) {
        result = LeftCurrentList();
    }
    // console.log('result-filter', result);

    return result;
}

// --- Обработчик события - нажатие + в списке друзей - переносит выбранный элемент в избранный список --//
friendsList.addEventListener('click', function (e) {
    // console.log('E-friendsList=', e);

    let ArrayObj = ArrayObjList('#select_list');


    if (e.target.className === "plus") {
        let fullName = [];
        let srcImage = e.target.previousElementSibling.firstElementChild.currentSrc;
        let selectListObj = {};

        // e.target.style.cursor = 'pointer';
        fullName = e.target.previousElementSibling.innerText.split(' ');

        fullName[0] = fullName[0].slice(1);
        fullName[1] = fullName[1].slice(0, -1);
        //console.log('fullName-000-!=', fullName);
        selectListObj = { first_name: fullName[0], last_name: fullName[1], photo_50: srcImage };

        ArrayObj.push(selectListObj); // добавляем в уже имеющийся массив переносимый элемент
        let Array = JSON.parse(storage.CurrentSelectList);
        //console.log('CurrentSelectList-read-!!!', Array);
        Array.push(selectListObj); // добавляем в уже имеющийся массив переносимый элемент
        SaveCurrentStorage('currentSelectList', Array); // сохраняем текущее значение массива
        //console.log('')
        // Проверяем соответствует ли фильтру переносимый элемент (друг), если да, то выводим, если нет, не выводим
        if (inputFilterRight.value.length != 0) { // фильтр не пустой
            //console.log('inputFilterRight.value.length != 0 = ', inputFilterRight.value.length);
            if (isMatching(fullName[0], fullName[1], inputFilterRight.value) === true) {
                enterRightLists('#user-right_template', ArrayObj); // выводим обновленный массив в списке selectList
            }// end if-2
        } else if (inputFilterRight.value.length == 0) { // если фильтр пустой
            enterRightLists('#user-right_template', ArrayObj); // выводим обновленный массив в списке selectList
        }// end if-1

        //ArrayObjList('#select_list'); // массив объектов элементов - selectList

        // удаляем перенесённый элемент -друга из общего списка - list
        deleteElemList('#list', fullName[0], fullName[1]);
        // сохраняем изменившийся общий список - list в хранилище  - currentList
        SaveCurrentStorage('currentList', ArrayObjList('#list')); // сохраняем текущее значение массива
    }
});
// ---- Обработчик события нажатия, удержания и перемещения мыши над полным списком друзей
friendsList.addEventListener('mousedown', function (e) {
    if (e.target.parentElement.className  === 'item_user') { // реализация функции драг энд дроп
        //console.log('E-friendsList- drag&drop =', e);
        // console.log('E-friendsList- drag&drop =', e.target.innerText);
        let fullName = [];
        let srcImage = e.target.parentElement.firstElementChild.currentSrc;
        let selectListObj = {};
        let numberLi;

        fullName = e.target.innerText.split(' ');
        fullName[0] = fullName[0];
        //console.log('fullName-000-!=', fullName[0], fullName[1]);
        // определяем номер li в списке list
        let LeftArrayObj = ArrayObjList('#list');
        // загружаем список избранных друзей из хранилища selectlist
        let ArrayObj = ArrayObjList('#select_list');
        // console.log('ArrayObj=', ArrayObj[0]);


        for (var i = 0; i < LeftArrayObj.length; i++) {
            if (LeftArrayObj[i].first_name == fullName[0] && LeftArrayObj[i].last_name === fullName[1]) {
                numberLi = i;
            }
        }

        let targetLi = e.target.parentElement.parentElement.parentElement.children[numberLi];

        let startY = e.clientY;

        let duptargetLi=targetLi.cloneNode(true);

        duptargetLi.style.backgroundColor = '#f0f0f0';
        duptargetLi.style.position = 'absolute';
        duptargetLi.style.zIndex = 1000;

        document.body.appendChild(duptargetLi);

        duptargetLi.style.left = e.pageX - targetLi.offsetWidth/2 + 'px';//- targetLi.offsetWidth/2
        duptargetLi.style.top = e.pageY - targetLi.offsetHeight/2 + 'px';//- targetLi.offsetHeight/2

        selectListObj = { first_name: fullName[0], last_name: fullName[1], photo_50: srcImage };
        duptargetLi.addEventListener('mousemove', function (e) {
            duptargetLi.style.left = e.pageX - targetLi.offsetWidth/2 + 'px';
            duptargetLi.style.top = e.pageY - targetLi.offsetHeight/2 + 'px';

        });
        duptargetLi.addEventListener('mouseup', function (e) {
            //console.log('E-mouseup=', e);
            document.body.removeChild(duptargetLi);
            //console.log('e.clientY=', e.clientY);
            //console.log('startY=', startY);

            if (Math.abs(e.clientY - startY) > 1) {
                selectListObj = { first_name: fullName[0], last_name: fullName[1], photo_50: srcImage };

                ArrayObj.push(selectListObj); // добавляем в уже имеющийся массив переносимый элемент
                let Array = JSON.parse(storage.CurrentSelectList);
                //console.log('CurrentSelectList-read-!!!', Array);
                Array.push(selectListObj); // добавляем в уже имеющийся массив переносимый элемент
                SaveCurrentStorage('currentSelectList', Array); // сохраняем текущее значение массива

           // Проверяем соответствует ли фильтру переносимый элемент (друг), если да, то выводим, если нет, не выводим
                if (inputFilterRight.value.length != 0) { // фильтр не пустой
                    if (isMatching(fullName[0], fullName[1], inputFilterRight.value) === true) {
                        // выводим обновленный массив в списке selectList
                        enterRightLists('#user-right_template', ArrayObj);
                    }// end if-2
                } else if (inputFilterRight.value.length == 0) { // если фильтр пустой
                    enterRightLists('#user-right_template', ArrayObj); // выводим обновленный массив в списке selectList
                }// end if-1
                // удаляем перенесённый элемент -друга из общего списка - list
                deleteElemList('#list', fullName[0], fullName[1]);
                // сохраняем изменившийся общий список - list в хранилище  - currentList
                SaveCurrentStorage('currentList', ArrayObjList('#list')); // сохраняем текущее значение массива
            }
        })
    }
});

// --- Обработчик события - нажатие на "крестик" в списке друзей - удаляет выбранный элемент в избранном списке --//
selectList.addEventListener('click', function (e) {
    //console.log('E-selectList=', e);

    let ArrayObj = [];

    if (e.target.className === "cross") {
        let fullName = [];
        let srcImage = e.target.previousElementSibling.firstElementChild.currentSrc;
        let selectListObj = {};

        fullName = e.target.previousElementSibling.innerText.split(' ');
        fullName[0] = fullName[0].slice(1);
        fullName[1] = fullName[1].slice(0, -1);
        selectListObj = { first_name: fullName[0], last_name: fullName[1], photo_50: srcImage };
        //console.log('selectListObj=', selectListObj);
        // console.log('fullName_??=', fullName[0], 'fullName[1]_??', fullName[1] );

        // убираем из списка избранных друзей удаляемого друга
        deleteElemList('#select_list', fullName[0], fullName[1]);
        // сораняем  измененный список в хранилище массива избранных друзей ---?????
        let Array = ArrayObjList('#select_list');
        //console.log('ARREY- &=', Array);
        SaveCurrentStorage('currentSelectList', Array); // сохраняем текущее значение списка
        //SaveCurrentStorage('сurrentSelectList', ArrayObjList('#select_list')); // сохраняем текущее значение списка
        let Arraycurrent = JSON.parse(storage.CurrentSelectList);
        // console.log('CurrentSelectList-read-??', Arraycurrent);
        // console.log('ArrayObjList-??', ArrayObjList('#select_list'));

        // загружаем массив общего списка из хранилища
        ArrayObj = JSON.parse(storage.CurrentList);
        // добавляем в него переносимый элемент
        ArrayObj.push(selectListObj);
        //console.log('ArrayObj-!!!=', ArrayObj);
        // сохраняем измененный массив в хранилище
        SaveCurrentStorage('currentList', ArrayObj); // сохраняем текущее значение списка

        // загружаем массив друзей показанных в левом списке
        ArrayObj = ArrayObjList('#list'); // массив объектов элементов - List
        //console.log('ArrayObj=', ArrayObj);
        ArrayObj.push(selectListObj); // добавляем друга удаленного из списка избранных в массив общего списка - List
        // console.log('ArrayObj- для списка=', ArrayObj);
        // Проверяем соотвествует ли добавляемый элемент-друг фильтру, если - да - выводим, если нет, не выводим
        if (inputFilterLeft.value.length != 0) { // фильтр не пустой
            if (isMatching(fullName[0], fullName[1], inputFilterLeft.value) === true) {
                // выводим обновленный массив в списке selectList
                enterLeftLists('#user-left_template', ArrayObj); // вывод элементов в списке List
            }// end if-2
        } else if (inputFilterRight.value.length == 0) { // если фильтр пустой
            enterLeftLists('#user-left_template', ArrayObj); // вывод элементов в списке List
        }// end if-1
    }
});

// ---- Обработчик события нажатия, удержания и перемещения мыши над списком избранных друзей
selectList.addEventListener('mousedown', function (e) {
    if (e.target.parentElement.className  === 'item_user') { // реализация функции драг энд дроп
        //console.log('E-selectList- drag&drop =', e);
        // console.log('E-friendsList- drag&drop =', e.target.innerText);
        let fullName = [];
        let srcImage = e.target.parentElement.firstElementChild.currentSrc;
        let selectListObj = {};
        let numberLi;

        fullName = e.target.innerText.split(' ');
        fullName[0] = fullName[0];
        //console.log('fullName-000-!=', fullName[0], fullName[1]);
        // определяем номер li в списке list
        let ArrayObj = ArrayObjList('#select_list');
        //console.log('ArrayObj=', ArrayObj[0]);


        for (var i = 0; i < ArrayObj.length; i++) {
            if (ArrayObj[i].first_name == fullName[0] && ArrayObj[i].last_name === fullName[1]) {
                numberLi = i;
            }
        }
        // let targetLi = e.target.parentElement.parentElement.parentElement.children[numberLi];
        // let targetList = e.target.parentElement.parentElement.parentElement;
        let targetLi = e.target.parentElement.parentElement.parentElement.children[numberLi];
        // let targetlistName = targetList.id;
        let startY = e.clientY;

        //console.log('numberLi=', numberLi, 'targetLi=', targetLi);

        let duptargetLi=targetLi.cloneNode(true);

        duptargetLi.style.backgroundColor = '#f0f0f0';
        duptargetLi.style.position = 'absolute';
        duptargetLi.style.zIndex = 1000;

        document.body.appendChild(duptargetLi);

        duptargetLi.style.left = e.pageX - targetLi.offsetWidth/2 + 'px';//- targetLi.offsetWidth/2
        duptargetLi.style.top = e.pageY - targetLi.offsetHeight/2 + 'px';//- targetLi.offsetHeight/2

        selectListObj = { first_name: fullName[0], last_name: fullName[1], photo_50: srcImage };
        duptargetLi.addEventListener('mousemove', function (e) {
            duptargetLi.style.left = e.pageX - targetLi.offsetWidth/2 + 'px';
            duptargetLi.style.top = e.pageY - targetLi.offsetHeight/2 + 'px';

        });
        duptargetLi.addEventListener('mouseup', function (e) {
            //console.log('E-mouseup=', e);
            document.body.removeChild(duptargetLi);

            if (Math.abs(e.clientY - startY) > 1) {
                // убираем из списка избранных друзей удаяемого друга
                deleteElemList('#select_list', fullName[0], fullName[1]);
                // сораняем  измененный список в хранилище массива избранных друзей
                SaveCurrentStorage('currentSelectList', ArrayObjList('#select_list')); // сохраняем текущее значение
                ArrayObj = ArrayObjList('#list'); // формируем массив объектов элементов - List
                // console.log('ArrayObj=', ArrayObj);
                ArrayObj.push(selectListObj); // добавляем друга удаленного из списка избранных в массив общего списка
                // console.log('ArrayObj-!!!=', ArrayObj);
                // сохраняем измененный массив в хранилище
                SaveCurrentStorage('currentList', ArrayObj); // сохраняем текущее значение списка
        // Проверяем соотвествует ли добавляемый элемент-друг фильтру, если - да - выводим, если нет, не выводим
                if (inputFilterLeft.value.length != 0) { // фильтр не пустой
                    if (isMatching(fullName[0], fullName[1], inputFilterLeft.value) === true) {
                        // выводим обновленный массив в списке selectList
                        enterLeftLists('#user-left_template', ArrayObj); // вывод элементов в списке List
                    }// end if-2
                } else if (inputFilterRight.value.length == 0) { // если фильтр пустой
                    enterLeftLists('#user-left_template', ArrayObj); // вывод элементов в списке List
                }// end if-1
            }
        })
    }
});


// --- Обработчик события - перемещение элемента списка из общего списка друзей


// Функция формирования массива объектов элементов списков
function ArrayObjList(listSelector) {
    let selectList = document.querySelector(listSelector);
    let ArrayObj = [];

    //console.log('select-List-1=', selectList);
    //console.log('select-List-1-children=', selectList.children.length);

    for (var i = 0; i < selectList.children.length; i++) {
        let fullName = selectList.children[i].children[0].innerText.split(' ');
        //fullName=
        //console.log('fullName-!!!?=', fullName);
        //console.log('fullName-!!!-2=', fullName[0].slice[1]);
        let srcImage = selectList.children[i].children[0].firstElementChild.currentSrc;
        let Obj = { first_name: fullName[0].slice(1), last_name: fullName[1].slice(0, -1), photo_50: srcImage };

        ArrayObj.push(Obj);
    }

    return ArrayObj;
}

// --- Функция удаления элемента из списка --- //
function deleteElemList(listSelector, firstName, lastName) {
    //console.log('listSelector=', listSelector);
    let currentArray = ArrayObjList(listSelector);
      //console.log('currentArray-0=', currentArray);
    let listelElementDelete = document.querySelector(listSelector);
    /*console.log('firstName=', firstName);
    console.log('lastName-0=', lastName);
    console.log('lastName-end=', lastName);
    */
    // if (lastName.)

    for (var i = 0; i < currentArray.length; i++) {

        if (currentArray[i].first_name == firstName && currentArray[i].last_name == lastName) {
            delete currentArray[i];
            listelElementDelete.removeChild(listelElementDelete.children[i]);
            // console.log('currentArray-end=', currentArray, 'i=', i);
        }
    }
}

// ---- Функция сравнения списков Функция - формирования текущего списка общих друзей - левого списка == ---
function LeftCurrentList () {
    let ArrayLeft = JSON.parse(storage.list);
    //let ArrayLeft = JSON.parse(storage.list);
    let ArrayRight = JSON.parse(storage.CurrentSelectList);
    let resultLeft =[];

    // console.log ('ArrayLeft=', ArrayLeft);
    // console.log ('ArrayRight=', ArrayRight);
    for (var i = 0; i < ArrayLeft.length; i++) {
        let bool = false;

            for ( var j = 0; j < ArrayRight.length; j++) {
                let chunk = ArrayRight[j].first_name.toLowerCase() + ' ' + ArrayRight[j].last_name.toLowerCase();
                //console.log('Массив Разницы списков- Chank= ', chunk);

                if (isMatching(ArrayLeft[i].first_name, ArrayLeft[i].last_name, chunk) === true) {
                    bool = true;
                }
            }

        if (bool == false) {
            resultLeft.push(ArrayLeft[i]);
        }
    }
    // console.log('Массив Разницы списков = ', resultLeft);
    return resultLeft;
}

// --- Функция вывода списков в select_list
function enterRightLists(selector, ArrayObj) {
    // console.log('selector=', selector);

    const templateElement = document.querySelector(selector);
    const source = templateElement.innerHTML;

    // console.log('templateElement-F=', templateElement);
    // console.log('source-F=', source);

    const render = Handlebars.compile(source),
        template = render({ select_list: ArrayObj });
        // console.log('render=', render);
        // console.log('template=', template);

        select_list.innerHTML = template;

        // console.log('select_list=', select_list);
        //console.log('ArrayObj=', ArrayObj);

}
// --- Функция вывода списков в list
function enterLeftLists(selector, ArrayObj) {
    // console.log('selector=', selector);

    const templateElement = document.querySelector(selector);
    const source = templateElement.innerHTML;

    // console.log('templateElement-F=', templateElement);
    // console.log('source-F=', source);

    const render = Handlebars.compile(source),
        template = render({ list: ArrayObj });
        // console.log('render=', render);
        // console.log('template=', template);

        list.innerHTML = template;

        // console.log('select_list=', list);
        // console.log('ArrayObj=', ArrayObj);

}
// --- Функция обработчик - события нажатия на кнопку -сохранить -- //

ButtonSave.addEventListener('click', function () {

    SaveLocalStorage('#list');
    SaveLocalStorage('#select_list');
    alert('Сохранено!');

});
// --- Функция сохранения списков в localStorage
function SaveLocalStorage(listSelector) {
    // - получить списки
    let currentArray = ArrayObjList(listSelector);

    //console.log('currentArray-write', currentArray, listSelector);

    if (listSelector == '#list') {
        storage.list = JSON.stringify(currentArray); // сохраняем массив в storage.list
        // currentArray = JSON.parse(storage.list);
    }
    if (listSelector == '#select_list') {
        storage.selectlist = JSON.stringify(currentArray); // сохраняем массив в storage.selectlist
        // currentArray = JSON.parse(storage.selectlist);
    }
}
// --- Функция сохранения текущих массивов в localStorage
function SaveCurrentStorage(listSelector, Array) {
    if (listSelector == 'currentList') {
        storage.CurrentList = JSON.stringify(Array); // сохраняем массив в storage.list
        Array = JSON.parse(storage.CurrentList);
        //console.log('CurrentList-read', Array);
    }
    if (listSelector == 'currentSelectList' ) {
        storage.CurrentSelectList = JSON.stringify(Array); // сохраняем массив в storage.selectlist
        Array = JSON.parse(storage.CurrentSelectList);
        //console.log('CurrentSelectList-read', Array);
    }

    // console.log('currentArray-read', Array);
}

function start () {
    let startList = [];
    let startSelectList = [];
    // обнуляем хранилища текущих массивов
    let Array =[];
    storage.CurrentList = JSON.stringify(Array);
    storage.CurrentSelectList = JSON.stringify(Array);

    if (storage.list == undefined || storage.list == '' ) {
        // получаем список друзей из SDK VK и записываем его в  localstorage - list
        GetUserFriends()
            .then(data => { // выводит список всех друзей

                const templateElement = document.querySelector('#user-left_template');
                const source = templateElement.innerHTML;

                const render = Handlebars.compile(source),

                    template = render({list: data.items});
                    list.innerHTML = template;

                storage.list = JSON.stringify(data.items); // записываем в localstorage - ???
                storage.CurrentList = JSON.stringify(' '); // записываем в localstorage CurrentList -!!!

                return data.items;
            });
    } else {
        // загружаем полный список друзей из localstorage
        startList = JSON.parse(storage.list);
        storage.CurrentList = JSON.stringify(startList); //записываем в localstorage CurrentList -!!!
        enterLeftLists('#user-left_template', startList);
        //console.log('startList=', startList);

        if (storage.selectlist != undefined) {
            // загружаем список избранных друзей из localstorage
            startSelectList = JSON.parse(storage.selectlist);
            //console.log('startSelectList=', startSelectList);
            // и записываем их в хранилище массива выбранных друзей - startSelectList
            storage.CurrentSelectList = JSON.stringify(startSelectList);
        }

        enterRightLists('#user-right_template', startSelectList);
    }
    if (storage.selectlist == undefined || storage.selectlist == ' ') {

        storage.selectlist = JSON.stringify(startSelectList);// записываем в localstorage -storage.selectlist

    }
}
// --- Здесь  происходит запуск программы --- //

start();

