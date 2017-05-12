(function ($) {
	var id = "103072ac72b53661fb562478707c6cf2";
	var navigator = window.navigator;
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(showLocation);
	} else {
		$('#location').html('unavilable');
		$('#temp').html('unavailable');
		$('description').html('unavilable');

	}

	function convert(deg) {
		return Math.floor(deg);
	}

	function showLocation(location) {
		updatebyGeo(location.coords.latitude, location.coords.longitude);
	}

	function updatebyGeo(lat, lon) {
		var url = 'Http://api.openweathermap.org/data/2.5/find?lat=' + lat +
			'&lon=' + lon +
			'&type=accurate' +
			'&units=metric&appid=' + id;
		sendRequest(url);
	}



	function sendRequest(url) {
		$.getJSON(url, function (response) {
			var responseText = response;
			var weather = {};
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


//************************************************************************************
// Data_ObjMod
//*************************************************************************************
var Data_ObjMod = (function () {
	var ListItem, Category;
	//object contructor function
	//return another contructor with new keyword
	ListItem = function (text, status, categoryName, id) {
		return new ListItem.list(text, status, categoryName, id);
	};

	//returned listNode contructor
	ListItem.list = function (text, status, categoryName, id) {
		this.text = text;
		this.status = status;
		this.id = id;
		this.categoryName = categoryName;
	};


	//listNode prototype post to main constructor
	ListItem.list.prototype = ListItem.prototype;


	ListItem.prototype.reduce = function () {
		return {
			text: this.text,
			status: this.status,
			id: this.id
		};
	};

	ListItem.prototype.checkStatus = function (state) {
		if (state) {
			this.status = 'checked';
		} else {
			this.status = 'unchecked';
		}

	};


	//categories coontructor return new category
	Category = function (name) {
		return new Category.group(name);
	};


	//returned cat
	Category.group = function (name) {
		this.name = name;
	};

	//data structure
	//data should accept new data categories
	//read update and delete
	var data = {
		categories: {
			inbox: [],
			groceries: [],
			ourhome: []
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
		},
		//fetch all categories data and print in all
		fetchAll: function () {
			var keys, value, val, i, array;

			array = [];
			keys = Object.keys(data.categories);

			keys.forEach(function (each) {

				value = data.categories[each];

				if (value.length > 0) {

					for (i = 0; i < value.length; i++) {
						val = value[i];
						array.push(val);
					}

				}
			});
			return array;
		},
		//return the length of every Category in an array
		data: function () {
			var array = [];

			for (var props in data.categories) {
				array.push(data.categories[props].length);
			}
			return array;
		},

		//return the collective length of all data
		datalength: function () {
			var sum = 0;
			for (var cats in data.categories) {
				sum = sum + data.categories[cats].length;
			}
			return sum;
		},
		removeFromData: function (id, datatype) {
			var listObj;

			data.categories[datatype].forEach(function (each, index, array) {
				listObj = each;
				//removed the deleted index from array
				//compares id in a specific category
				if (id === listObj.id) {

					array.splice(index, 1);
				}
			});
		},
		changeStatus: function (id, datatype, state) {
			var listObj;

			data.categories[datatype].forEach(function (each, index, array) {
				//removed the deleted index from array
				//compares id in a specific category
				if (id === each.id) {
					each.checkStatus(state);
				}
			});
		},
		completedTask: function () {
			var count = 0,
				props, arr;

			for (props in data.categories) {
				arr = data.categories[props];

				arr.forEach(function (each) {
					if (each.status === "checked") {
						count += 1;
					}
				})
			}
			return count;
		}
	}

}());

//************************************************************************************
// UI controller
//*************************************************************************************
var UIController = (function () {
	var DOM;

	//DOM CLASSES AND ID
	DOM = {
		input: '#main-input',
		ul: '#listPanel',
		categories: "#categories",
		taskName: ".task-Name",
		date: '.date > h3',
		span: '#categories li > span',
		checkbox: '#listPanel li > input[type=checkbox]',
		complete: '#completed'
	}



	return {

		date: function () {
			var dateStr, today;

			today = Date.now();

			dateStr = new Date(today);

			return dateStr.toDateString();
		},
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
				str = '<li id="%id%"><i class="fa fa-trash-o delete"></i>%text%<span class="input-check"><input type="checkbox" class="checkbox" %status%></span><span class="date">%date%</span></li>'

				//find and replace with object values 
				html = str.replace("%text%", obj.text);
				html = html.replace("%status%", obj.status);
				html = html.replace("%id%", obj.id)
				html = html.replace("%date%", this.date());

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

				split.pop();
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
		disableInput: function (state) {

			selector(DOM.input).disabled = state;

			if (state) {
				selector(DOM.input).setAttribute('placeholder', 'All items, Choose subCategories to add input')
			} else {
				selector(DOM.input).setAttribute('placeholder', 'Add item to category')
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

						//reduce extracts the description and vhecked status ;
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

				text.pop();

				substr.push(text[0], text[1]);

				selector(DOM.taskName).textContent = substr.join(' ');

			} else {

				selector(DOM.taskName).textContent = text[0];
			}

		},
		findClass: function (arr) {
			var x;

			x = arr.filter(function (each) {
				if (each.classList.contains('active')) {
					return each;
				}
			});

			return x;
		},
		spanFiller: function () {

			var spans, arr, firstSpan;
			//get a;; spans and convert to array;
			spans = selector(DOM.span, 'all');

			arr = this.makeArray(spans);

			firstSpan = arr.shift();

			return {
				firstSpan: firstSpan,
				arr: arr
			}
		},
		removeElement: function (id) {
			var list_panel;

			list_panel = this.makeArray(selector(DOM.ul).children);

			list_panel.forEach(function (current) {
				if (current.id === id) {
					selector(DOM.ul).removeChild(current);
				}
			})
		},
		completed: function (num) {
			selector(DOM.complete).textContent = num;
		}
	}
}());

//************************************************************************************
// App_Ctrl
//*************************************************************************************

var App_Ctrl = (function (Data_ObjMod, UIController) {

	//************************************************************************************
	// event helper functions starts
	//*************************************************************************************

	//fill all spans with length of category array
	//function is class in getValue function
	var fillSpan = function () {
		var arr, i;

		var span = UIController.spanFiller();


		span.firstSpan.textContent = Data_ObjMod.datalength();

		arr = Data_ObjMod.data();

		for (i = 0; i < span.arr.length; i++) {
			var each = span.arr[i];

			each.textContent = arr[i]
		}
	}

	//returns the collective length of all the array in the data
	//function is called in when the all button is clicked 
	// called in getItems function
	function fetchAllData() {
		var obj;

		obj = Data_ObjMod.fetchAll();

		UIController.addSubset(obj);

	}

	//retrieves the name of the active class;
	function retrieveClass() {
		var children, catNames, withclass

		children = selector(UIController.ids.categories).children;

		catNames = UIController.makeArray(children);

		//get category with active class 
		withclass = UIController.withClass(catNames).toLowerCase();

		return withclass;
	}


	function getCategory() {
		var datatype;

		//get all li in categories
		var withClass = retrieveClass();

		datatype = Data_ObjMod.compartmentalise(withClass);

		if (datatype) {

			UIController.addSubset(datatype);


		} else {

			UIController.clearChildren();
		}

		UIController.getTaskName();

	}

	function completeTask() {
		selector(UIController.ids.complete).innerHTML = Data_ObjMod.completedTask()
	}

	//************************************************************************************
	// event helper functions ends
	//*************************************************************************************



	//************************************************************************************
	// event handler functions start
	//*************************************************************************************
	var getValue = function (e) {
		var inputData, nodeParams, obj, catNames, withclass, children;

		if (e.keyCode === 13) {

			inputData = UIController.getInputData();

			//clearinput and focus 
			UIController.clearfield();

			//get all li in categories
			//and return a formated version of the name of the li with the ctive class
			withclass = retrieveClass();

			//Update the list panel with new li object
			nodeParams = Data_ObjMod.createListNode(inputData.text, inputData.status, withclass);

			//add item to ui
			UIController.addList(nodeParams);

			//save to data
			Data_ObjMod.updateData(nodeParams, withclass);

			//updates span values
			fillSpan();

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

				fetchAllData();

				UIController.disableInput(true);

				UIController.addActiveClass(target);

				UIController.getTaskName();

				return;

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


	var delete_Status_Update = function (e) {

		var target, id, li, datatype, inputParent, state = false;

		target = e.target

		datatype = retrieveClass();

		li = target.parentNode;

		id = li.id;

		inputParent = li.parentNode.id;

		if (target.classList.contains('delete')) {

			Data_ObjMod.removeFromData(parseInt(id), datatype);

			UIController.removeElement(id);

			fillSpan();

		}

		if (target.classList.contains('checkbox')) {

			if (target.checked === true) {
				state = true;
			}

			Data_ObjMod.changeStatus(parseInt(inputParent), datatype, state);
			completeTask();

		}
	}

	//************************************************************************************
	// event handler functions ends
	//*************************************************************************************


	function setUpEventListeners() {
		selector(UIController.ids.input).addEventListener('keypress', getValue);
		selector(UIController.ids.categories).addEventListener('click', getItems);
		document.addEventListener('click', delete_Status_Update)
	}



	return {
		init: function () {
			setUpEventListeners();
			UIController.disableInput(true);
			fillSpan(Data_ObjMod.data());
			UIController.getTaskName();
			selector(UIController.ids.date).innerHTML = UIController.date();
			completeTask();
		}
	}


}(Data_ObjMod, UIController));

App_Ctrl.init();
