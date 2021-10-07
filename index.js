var testSystem;

/**
 * Перевірка доступності  localStorage
 * @returns {boolean} true - браузер підтримує LocalStorage
 */
function checkLocalStorage()
{
    try {
        return 'localStorage' in window && window['localStorage'] !== null && localStorage != undefined;
    } catch (e) {
        return false;
    }
}

/**
 *  Завантаження тестів (пунктів меню) існуючих в localStorage тестів
 */
function loadItemsFromLocalStorage()
{
    if (!checkLocalStorage())
    {
        return;
    }
    var template = '<div class="b-page-test-switch__item b-page border-radius" index="{1}">{0}</div>';
    var target = $(".b-page-test-switch");

    for (var i = 0; localStorage["ExpertSys" + i]; i++)
    {
        target.html(target.html() + template.replace("{1}","ExpertSys" + i).replace("{0}",JSON.parse(localStorage["ExpertSys" + i]).title));
    }
}

/**
 * Завантаження тесту із localStorage
 * @param localStorageIndex - індекс тесту
 * @returns {Test} тест (база знань) для експертної системи
 */
function loadFromLocalStorage(localStorageIndex)
{
    return new Test(JSON.parse(localStorage[localStorageIndex]));
}

/**
 * Збереження тесту (бази знань) в localStorage (при умові підтримки браузером)
 * @param test - збережений тест (база знань)
 */
function saveToLocalStorage(test)
{
    if (!checkLocalStorage())
    {
        return;
    }
    for (var i = 0; localStorage[i]; i++)
    {
        if (localStorage["ExpertSys"+i].match(test.title))
        {
            localStorage.setItem("ExpertSys" + i,test.stringify());
            return;
        }
    }
    localStorage.setItem("ExpertSys" + i,test.stringify());
}

/**
 * Реакція на натискання кнопки "далі". реакція на ввід даних і перехід до наступного запитання
 */
function step()
{
    var ans = parseFloat($("#current-answer").attr("value"));
    if (ans < 0 || ans > 100) {
        alert("Невірний ввід даних!");
        return;
    }
    testSystem.processAnswer(ans);
    testSystem.nextStep();
}

/**
 * Ініціалізація. Реакція натискання на кнопки і т.д.
 */
function init()
{
    loadItemsFromLocalStorage();
    /**
     * Вибір тесту. Його завантаження із localStorage, або парсинг із textarea
     */
    $("#start-test").bind("click keypress",function()
    {
        if ($(".b-page-test-switch__selected") && $(".b-page-test-switch__selected").length > 0)
        {
            testSystem = loadFromLocalStorage($(".b-page-test-switch__selected").attr("index"));
        }
        else
        {
            testSystem = new Test();
            if (!testSystem.parseData($("#test").val()))
            {
                alert("Щось пішло не так. Перевірте введені дані.")
                return;
            }
            saveToLocalStorage(testSystem);
        }
        $("#test").addClass("hide");
        $(".b-page-test").removeClass("hide");
        $(".b-page-main").add("#start-test,#data-format").addClass("hide");
        $("#test-title").html(testSystem.title);
        testSystem.nextStep();
    });

    /**
     * Enter == кнопки далі при вводі ймовірності
     */
    $("#current-answer").bind('keydown ',function(e)
    {
        if (e.keyCode == 13) step();
    });
    $("#complete-answer").bind("click keypress", step);

    /**
     * візуалізація вибору тесту
     */
    $(".b-page-test-switch__item").live("click keypress", function()
    {
        if ($(this).hasClass("b-page-test-switch__selected"))
        {
            $(this).removeClass("b-page-test-switch__selected");
            return;
        }
        $(".b-page-test-switch__selected").removeClass("b-page-test-switch__selected");
        $(this).addClass("b-page-test-switch__selected");
    });

    $("#data-format").bind("click keypress",function()
    {
        $("#test").val(
            "Формат вхідних даних:\n" +
            "На першій стрічці розташована назва бази знань\n" +
            "Потім, через знак переведення стрічки - список запитань\n" +
            "Після запитань - список подій (варіантів) в форматі:\n"+
            "Подія<Переведення стрічки>Початкова_ймовірність_події номер_запитання) ймовірність_max ймовірність_min<переведення стрічки>\n" +
            "Приклад вхідних даних:\n" +
            "\n" +
            "База знань ресторанів Львова.\n" +
            "\n" +
            "Чи подобається вам проводити час в ресторані?\n" +
            "Чи подобається вам проводити час в кафе?\n" +
            "Чи подобається вам проводити час в барі?\n" +
            "Чи подобається вам проводити час в кальян-барі?\n" +
            "Чи подобається вам проводити час в пабі?\n" +
            "Чи подобається вам проводити час в пабі-ресторані?\n" +
            "Чи подобається вам проводити час в нічному клубі?\n" +
            "Чи подобається вам проводити час в караоке?\n" +
            "Чи подобається вам проводити час в кондитерській?\n" +
            "Чи подобається вам заклади з українською кухнею?\n" +
            "Чи подобається вам заклади з італійською кухнею?\n" +
            "Чи подобається вам заклади із галицькою кухнею?\n" +
            "Чи подобається вам заклади із європейською кухнею?\n" +
            "Чи подобається вам заклади з азійською кухнею?\n" +
            "Чи любите ви пиво?\n" +
            "Чи любите ви запашні настоянки та глінтвейн?\n" +
            "Чи любите ви смачну каву?\n" +
            "Чи любите ви курити кальян?\n" +
            "Чи подобаються вам страви із морепродуктів?\n" +
            "Чи подобаються вам страви із мяса?\n" +
            "Чи подобаються вам страви із риби?\n" +
            "Чи подобаються вам піца?\n" +
            "Чи подобаються вам смажені страви?\n" +
            "Чи подобаються вам вино?\n" +
            "Чи подобаються вам міцні напої?\n" +
            "\n" +
            "Трава Лаунж Кафе на Городоцькій (Львів, вул. Городоцька, 83а)\n" +
            "0.01 2) 0.8 0.02 10) 0.7 0.08 13) 0.6 0.1 18) 0.5 0.05 20) 0.7 0.2 23) 0.2 0.01\n" +
            "De Luxe Restaurant (Львів, вул. Володимира Великого, 2)\n" +
            "0.03 1) 0.5 0.01 10) 0.2 0.01 11) 0.1 0.02 13) 0.5 0.05 15) 0.7 0.01 17) 0.6 0.02 19) 0.2 0.01 20) 0.4 0.2 21) 0.5 0.02 23) 0.9 0.01 24) 0.7 0.08 25) 0.6 0.04\n" +
            "BeerStone (Львів, вул. Пекарська, 34)\n" +
            "0.02 5) 0.5 0.01 10) 0.8 0.01 12) 0.8 0.05 15) 0.5 0.02 16) 0.2 0.01 20) 0.7 0.2 21) 0.7 0.3 22) 0.8 0.01 23) 0.4 0.02 25) 0.6 0.01\n" +
            "\n" +
            "Зауважте, номери запитань можна встановлювати не по порядку + питання, які не впливають на ймовірність події можна опустити");
    });
}

window.onload = init;

/**
 *  Сортування ймовірностей. Порівняння двох items
 * @returns {number} порівняння
 */
function sortItems(a,b)
{
    if (a.points > b.points || (a.points == b.points && a.title > b.title)) return 1;
    if (a.points == b.points && a.title == b.title) return 0;
    return -1;
}


/**
 * порівняння двох об'єктів - запитань
 */
function sortQuestion(a,b)
{
    var aPoints = 0, bPoints = 0;
    for (var i = 0; i < a.items.length; i++)
    {
        aPoints += a.items[i].questionPoints[a.index].min + a.items[i].questionPoints[a.index].max + a.items[i].points;
    }
    for (var i = 0; i < b.items.length; i++)
    {
        bPoints += b.items[i].questionPoints[b.index].min + b.items[i].questionPoints[b.index].max + b.items[i].points;
    }

    if (aPoints > bPoints) return -1;
    if (aPoints == bPoints)
    {
        if (a.items.length > b.items.length) return -1;
        if (a.items.length == b.items.length) return 0;
    }
    return 1;
}

/**
 * База знань або тест.
 * @param testObject - конструктор із вже введених назв, варіантів і запитань
 * @constructor
 */
function Test(testObject)
{
    this.title = "";
    this.items = [];
    this.questions = [];
    this.currentQuestion = -1;
    this.complete = false;
    if (testObject)
    {
        this.title = testObject.title;
        this.items = testObject.items;
        this.questions = testObject.questions;
    }
}

/**
 * серіалізація в стрічку, формату JSON
 * @returns {String} JSON
 */
Test.prototype.stringify = function()
{
    return JSON.stringify({
        title       : this.title,
        items       : this.items,
        questions   : this.questions
    });
}

/**
 * Вивід "ймовірностей" відповідей по заданому шаблону
 */
Test.prototype.printData = function()
{
    this.items.sort(sortItems);
    var template = '<div title="{0}: {1}" class="b-page-test-items__item border-radius"><span class="b-page-test-items__item-title">{0}</span><span class="b-page-test-items__item-percent">{1}</span></div>';
    var t = $(".b-page-test-items");
    t.html("");
    for (var i = this.items.length-1; i >= 0; i--)
    {
        var res = this.items[i].points > 1? 1 : this.items[i].points;
        t.html(t.html() + template.replace("{0}",this.items[i].title).replace("{0}",this.items[i].title).replace("{1}",res).replace("{1}",res));
        if (res == 1)
        {
            this.complete = true;
        }
    }
}

/**
 * Перехід до наступного запитання
 */
Test.prototype.nextStep = function()
{
    this.printData();
    this.questions.sort(sortQuestion);
    if (this.questions.length == 0 || this.complete)
    {
        $("#current-question").html("Ознайомся із рішенням системи. Запитання закінчились.");
        $("#complete-answer").add("#current-answer").addClass("hide");
        return;
    }
    $("#current-question").html(this.questions[0].q);
    $("#current-answer").attr("value",'');
};

/**
 * обробка відповіді. Зміна ймовірностей події враховуючи відповідь
 * @param ans - відповідь (ймовірність, від 0 до 100)
 */
Test.prototype.processAnswer = function(ans)
{
    for (var i = 0 ; i < this.items.length; i++)
    {
        var point = this.items[i].questionPoints[this.questions[0].index];
        if (point)
        {
            var up = ((2*point.max - 1)*ans/100 + 1 - point.max) * this.items[i].points;
            var down = ((2*point.max - 1)*ans/100 + 1 - point.max) * this.items[i].points + ((2*point.min - 1)*ans/100 + 1 - point.min)*(1 - this.items[i].points);
            this.items[i].points = down != 0? up/down : this.items[i].points;
        }
    }
    var template = '<div class="b-page-questions__answers-item">{0}</div>'
    $("#answers").html($("#answers").html() + template.replace("{0}", this.questions[0].q))
    this.questions.shift();
}

/**
 * Отримання запитань, подій і ймовірностей із стрічки
 * @param data - стрічка, яка містить дані
 * @returns {boolean} успіх обробки стрічки
 */
Test.prototype.parseData = function(data)
{
    try
    {
        // Пропуск лишніх, пустих стрічок
        var passEmptyStrings = function() {
            while (position < items.length && items[position] == "" ) { position++; }
        }

        var items = data.split("\n");
        var position = 0;
        passEmptyStrings();
        this.title = items[position++];
        passEmptyStrings();
        // Введення запитань
        while (items.length > position && items[position] != "")
        {
            this.questions.push({
                q    :items[position++],
                items: [],
                index:this.questions.length
            });
        }
        if (items.length <= position) throw "Invalid data format";
        passEmptyStrings();

        var index = 0;
        // Ввід подій
        while (items.length > position && items[position] != "")
        {
            var  pointItems = items[position + 1].split(" ");
            var newItem = {
                title          : items[position],
                points         : parseFloat(pointItems[0]),
                index          : index,
                questionPoints : []
            };
            // Ймовірності подій при 100 і 0% ймовірностях відповіді на запитання
            for (var i = 1; i < pointItems.length; i+= 3)
            {
                while (pointItems[i] == "") i++;
                var questionIndex = parseFloat(pointItems[i]) - 1;
                var questionPoint = {
                    max : parseFloat(pointItems[i+1]),
                    min : parseFloat(pointItems[i+2])
                };
                newItem.questionPoints[questionIndex] = questionPoint;
                this.questions[questionIndex].items.push(newItem);
            }
            this.items.push(newItem);
            index++;
            position += 2;
        }
        return true;
    }
    catch(e)
    {
        console.log(e);
        return false;
    }
}
