(function ($) {
   let id = "103072ac72b53661fb562478707c6cf2";
   var navigator = window.navigator;
   if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showLocation);
   } else {
      $('#location').html('unavilable');
      $('#temp').html('unavailable');
      $('description').html('unavilable');

   }


   function sendRequest(url) {
      $.getJSON(url, function (response) {
         var responseText = response;
         let weather = {};
         weather.location = responseText.list[0].name;
         weather.temp = responseText.list[0].main.temp;
         weather.iconCode = responseText.list[0].weather[0].icon;
         weather.description = responseText.list[0].weather[0].description;
         update(weather);
      });

   }

   function update(weather) {
      $('#location').html(weather.location);
      $('#temp').html(convert(weather.temp) + '&deg');
      $('#description').html(weather.description);
      $('.weather img').attr('src', "http://openweathermap.org/img/w/" + weather.iconCode + ".png");

   }

   function convert(deg) {
      return Math.floor(deg);
   }

   function showLocation(location) {
      updatebyGeo(location.coords.latitude, location.coords.longitude);
   }

   function updatebyGeo(lat, lon) {
      let url = 'Http://api.openweathermap.org/data/2.5/find?lat=' + lat +
         '&lon=' + lon +
         '&type=accurate' +
         '&units=metric&appid=' + id;
      sendRequest(url);
   }

})(jQuery);
//document.ready bracket

//ui controller to get data inputs 
// datamodule to hold and save data;
// app controller to bind two modules 


//ui controller 
// get form data 
// hold ids and class;
//toggle , add and remove class,
//create html strings 


//data module
//create data structure
//objects and object methods

//app controller 
//handle events 
//start app and call functions

function selector(selector, option) {
   if (arguments.length > 1) {
      return document.querySelectorAll(selector);
   }
   return document.querySelector(selector);

}



var Data_ObjMod = (function () {
   var ListItem, Category;
   //object contructor function
   //return another contructor with new keyword
   ListItem = function (text, status, categoryName, id) {
      return new ListItem.list(text, status, categoryName, id);
   }

   //returned listNode contructor
   ListItem.list = function (text, status, categoryName, id) {
      this.text = text;
      this.status = status || 'unchecked';
      this.id = id;
      this.categoryName = categoryName;
   }


   //listNode prototype post to main constructor
   ListItem.list.prototype = ListItem.prototype;


   ListItem.prototype.reduce = function () {
      return {
         text: this.text,
         status: this.status
      }
   }


   //categories coontructor return new category
   Category = function (name) {
      return new Category.group(name);
   }


   //returned cat
   Category.group = function (name) {
      this.name = name;
   }

   //data structure
   //data should accept new data categories
   //read update and delete
   var data = {
      categories: {
         inbox: [],
         work: [],
         ourhome: [],
         goceries: []
      }
   };


   return {
      //CREATES AND RETURNS NEW NODE ITEM TO APPEND
      //CREATES FROM lISTITEM COSTRUCTOR
      createListNode: function (text, status, categoryName, id) {
         var id, newNode, cat, type;
         //add the category
         cat = Category(categoryName);

         type = cat.name;

         //add id 
         if (data.categories.hasOwnProperty(type) && data.categories[type].length > 0) {
            id = data.categories[type][data.categories[type].length - 1].id + 1;
         } else {
            id = 0;
         }
         //return mutated object
         newNode = ListItem(text, status, type, id);

         return newNode;
      },
      //CHECKS IF CATEGORY EXIST AND PUSHED DATA INTO IT
      //CREATES NEW IF IT DOESNT
      updateData: function (obj, type) {

         // check if category exists
         //push object into it
         if (data.categories.hasOwnProperty(type)) {
            data.categories[type].push(obj);
         } else {

            //if no create it and push
            data.categories[type] = [];
            data.categories[type].push(obj);
         }
      },
      log: function () {
         console.log(data);
      },

      //CHECKS AND RETURN THE DATA TYPE ASKED FOR
      compartmentalise: function (type) {


         return data.categories[type];
      }
   }

}());



var UIController = (function () {
   var DOM;

   //DOM CLASSES AND ID
   DOM = {
      input: '#main-input',
      ul: '#listPanel',
      categories: "#categories",
      taskName: ".task-Name",
      date: '.date > h3'
   }


   return {
      ids: DOM,

      //GETS INPUT DATA FROM FORMS 
      getInputData: function () {
         return {
            text: selector(DOM.input).value,
            status: 'unchecked'
         };
      },
      //CLEARS INPUT
      clearfield: function () {
         selector(DOM.input).value = '';
         selector(DOM.input).focus();
      },
      //GETS AN OBJECTS FROM createListNode AND CREATES AN HTML ELEMENT
      addList: function (obj) {

         if (obj !== void 0) {

            var html, str, element, date;

            element = document.querySelector(DOM.ul);

            //html string to append
            str = '<li><i class="fa fa-trash-o"></i>%text%<span class="input-check"><input type="checkbox" %status%></span><span class="date">%date%</span></li>'

            var date = function () {
               var dateStr, today;
               today = Date.now();

               dateStr = new Date(today);

               return dateStr.toDateString();
            }
            //find and replace with object values 
            html = str.replace("%text%", obj.text);
            html = html.replace("%status%", obj.status);
            html = html.replace("%date%", date());

            element.insertAdjacentHTML('afterbegin', html);
         }
      },
      //TAKES AN ARRAYLIKE OBJECT AND MAKE ARRAY FROM
      makeArray: function (arrayLike) {
         var arr;
         arr = Array.prototype.slice.call(arrayLike);
         return arr;

      },
      //CHECKS IF A NODE LI HAS THE ACTIVE CLASS
      withClass: function (array) {
         var active, split;

         //find method filtered  the node element and return one with the active class
         active = this.findClass(array);

         //splits the text content of the node 
         split = active[0].textContent.split(' ');

         //make up for spaced names 
         if (split.length > 2) {

            //means its a spaces name
            return split[0].concat(split[1]);
         }

         return split[0];


      },
      //add active class on click
      addActiveClass: function (current) {
         var liNodes, arr;

         //remove from siblings
         liNodes = selector(DOM.categories).children;

         arr = this.makeArray.bind(this, liNodes)();

         arr.forEach(function (each) {
            if (each.classList.contains('active')) {
               each.classList.remove('active');
            }
         })

         current.classList.add('active');
      },
      //disable input if All category has class
      //takes a true or false argumment
      disableInput: function (state, text) {

         selector(DOM.input).disabled = state;

         if (state) {
            selector(DOM.input).setAttribute('placeholder', 'All items, Choose subCategories to add input')
         } else {
            selector(DOM.input).setAttribute('placeholder', 'Add item to work')
         }
      },

      //takes the data category array
      //creates an creates html elements from each object
      //append it to the right categry
      addSubset: function (arr) {

         var data, html, obj;

         //clears children of the ul(list item panel)
         this.clearChildren();

         if (arguments.length > 0) {

            for (var i = 0; arr.length ? i < arr.length : i = arr.length; i++) {
               for (var props in arr[i]) {
                  obj = arr[i];
                  data = obj.reduce();
               }
               this.addList(data);
            }
         }

      },
      clearChildren: function () {
         selector(DOM.ul).innerHTML = '';
      },
      getTaskName: function () {
         var children, text, substr;

         children = selector(DOM.categories).children;

         text = this.findClass(this.makeArray(children))[0].textContent.split(' ');

         substr = [];

         if (text.length > 2) {

            substr.push(text[0], text[1]);

            selector(DOM.taskName).textContent = substr.join(' ');

         } else {

            selector(DOM.taskName).textContent = text[0];

         }
         console.log(selector(DOM.date));

      },
      findClass: function (arr) {
         var x;

         x = arr.filter(function (each) {
            if (each.classList.contains('active')) {
               return each;
            }
         });

         return x;
      }
   }
}());




var App_Ctrl = (function (Data_ObjMod, UIController) {



   var getValue = function (e) {
      var inputData, nodeParams, obj, catNames, withclass, children;

      if (e.keyCode === 13) {

         inputData = UIController.getInputData();

         //clearinput and focus 
         UIController.clearfield();

         //get all li in categories
         children = selector(UIController.ids.categories).children;

         catNames = UIController.makeArray(children);

         //get category with active class 
         withclass = UIController.withClass(catNames).toLowerCase();


         //Update the list panel with new li object
         nodeParams = Data_ObjMod.createListNode(inputData.text, inputData.status, withclass);

         //add item to ui
         UIController.addList(nodeParams);

         //save to data
         Data_ObjMod.updateData(nodeParams, withclass);

         console.log(nodeParams);

      }
   }

   var getItems = function (e) {
      var target, firstNode, text;

      target = e.target;

      //get first node which is the all category
      firstNode = document.querySelector("#categories").children[0];

      if (target.tagName === 'LI') {

         //if all , disable input field
         if (target === firstNode) {

            UIController.disableInput(true);
         } else {

            UIController.disableInput(false);
         }
         //add active
         UIController.addActiveClass(target);

         //function defined below
         //takes an object and event type
         getCategory();

      }
   }

   function getCategory() {
      var datatype, children, catNames, withclass;

      //get all li in categories
      children = selector(UIController.ids.categories).children;

      catNames = UIController.makeArray(children);

      //get category with active class 
      withclass = UIController.withClass(catNames).toLowerCase();


      datatype = Data_ObjMod.compartmentalise(withclass);

      console.log(datatype);
      if (datatype) {

         UIController.addSubset(datatype);

      } else {

         UIController.clearChildren();
      }

      UIController.getTaskName();

      Data_ObjMod.log();

   }

   function setUpEventListeners() {
      selector(UIController.ids.input).addEventListener('keypress', getValue);
      selector(UIController.ids.categories).addEventListener('click', getItems);
   }

   return {
      init: function () {
         setUpEventListeners();
         UIController.disableInput(true);
      }
   }


}(Data_ObjMod, UIController));

App_Ctrl.init()
