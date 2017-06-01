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


//document.querySelector function
//return //document.querySelectorAll if two arguments are passed
function selector( selector, option ) {
	if ( arguments.length > 1 ) {
		return document.querySelectorAll( selector );
	}
	return document.querySelector( selector );
}

//************************************************************************************
// Data_ObjMod
//*************************************************************************************
var Data_ObjMod = ( function() {
	var ListItem, Category;
	//object contructor function
	//return another contructor with new keyword
	ListItem = function( text, status, categoryName, id ) {
		return new ListItem.list( text, status, categoryName, id );
	};

	//returned listNode contructor
	ListItem.list = function( text, status, categoryName, id ) {
		this.text = text;
		this.status = status;
		this.id = id;
		this.categoryName = categoryName;
	};


	//listNode prototype post to main constructor
	ListItem.list.prototype = Object.create(ListItem.prototype);

	ListItem.prototype.reduce = function() {
		return {
			text: this.text,
			status: this.status,
			id: this.id
		};
	};

	ListItem.prototype.checkStatus = function( state ) {
		if ( state ) {
			this.status = 'checked';
		} else {
			this.status = 'unchecked';
		}

	};

	//categories coontructor return new category
	Category = function( name ) {
		return new Category.group( name );
	};


	//returned cat
	Category.group = function( name ) {
		this.name = name;
	};

	//data structure
	//data should accept new data categories
	//read update and delete
	var data = {
		categories: {
			task: [],
			groceries: [],
			ourhome: []
		}
	}

	//************************************************************************************
	///helper function
	//************************************************************************************

	var deleteObjItem = function( datatype ) {
		delete data.categories[ datatype ];

	}
	return {
		//CREATES AND RETURNS NEW NODE ITEM TO APPEND
		//CREATES FROM lISTITEM COSTRUCTOR
		createListNode: function( text, status, categoryName, id ) {
			var id, newNode, cat, type;
			//add the category
			cat = Category( categoryName );
			type = cat.name;

			console.log( cat, type )
			//add id
			if ( data.categories.hasOwnProperty( type ) && data.categories[ type ].length > 0 ) {
				//id generator. seek the last array element id and adds one to it
				id = data.categories[ type ][ data.categories[ type ].length - 1 ].id + 1;
			} else {
				id = 0;
			}
			//return mutated object
			newNode = ListItem( text, status, type, id );

			return newNode;
		},
		//CHECKS IF CATEGORY EXIST AND PUSHED DATA INTO IT
		//CREATES NEW IF IT DOESNT
		updateData: function( obj, type ) {

			// check if category exists
			//push object into it
			if ( data.categories.hasOwnProperty( type ) ) {
				data.categories[ type ].push( obj );
			} else {
				data.categories[ type ] = [];
				if ( obj !== null ) {
					data.categories[ type ].push( obj );

				}
			}
		},
		log: function() {
			console.log( data );
		},

		//CHECKS AND RETURN THE DATA TYPE ASKED FOR
		compartmentalise: function( type ) {

			return data.categories[ type ];
		},
		//fetch all categories data and returns a reversed version of it
		fetchAll: function() {
			var keys, value, val, i, array;

			array = [];
			//gets the keys of the category objects
			//used to loop through array and
			keys = Object.keys( data.categories );

			keys.forEach( function( each ) {

				value = data.categories[ each ];

				if ( value.length > 0 ) {
					for ( i = 0; i < value.length; i++ ) {
						val = value[ i ];
						array.push( val );
					}

				}
			} );
			return array.reverse();
		},
		//return the length of every Category in an array
		//used to dope spans in the li :)
		dataAll: function() {
			var array = [];

			for ( var props in data.categories ) {
				array.push( data.categories[ props ].length );
			}
			return array;
		},
		//return the total length of all data
		//dope the all caategory :)
		datalength: function() {
			var sum = 0;
			for ( var cats in data.categories ) {
				sum = sum + data.categories[ cats ].length;
			}
			return sum;
		},
		///removes the deleted items from the data structure
		removeFromData: function( id, datatype ) {
			var listObj;

			data.categories[ datatype ].forEach( function( each, index, array ) {
				listObj = each;
				//removed the deleted index from array
				//compares id in a specific category
				if ( id === listObj.id ) {
					array.splice( index, 1 );
				}
			} );

		},
		changeStatus: function( id, datatype, state ) {
			var listObj;

			data.categories[ datatype ].forEach( function( each, index, array ) {
				//removed the deleted index from array
				//compares id in a specific category
				if ( id === each.id ) {
					each.checkStatus( state );
				}
			} );
		},
		//return the number of completed tasks
		completedTask: function() {
			var count = 0,
				props, arr;

			for ( props in data.categories ) {
				arr = data.categories[ props ];

				arr.forEach( function( each ) {
					if ( each.status === "checked" ) {
						count += 1;
					}
				} )
			}
			return count;
		},
		removeCatObj: function( datatype ) {
			deleteObjItem( datatype );
		},
		dataKeys: function() {
			return Object.keys( data.categories );
		}
	}
}() );

//************************************************************************************
// UI controller
//*************************************************************************************
var UIController = ( function() {
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
		complete: '#completed',
		add: '#add_button',
		subInput: '.category_add',
		reminder: '.reminder',
		lis: '#listPanel li',
		menu: '.context-menu',
		catChildren: '#categories li'
	}

	return {
		//date function
		date: function() {
			var dateStr, today;

			today = Date.now();
			dateStr = new Date( today );
			return dateStr.toDateString();
		},
		ids: DOM,

		//GETS INPUT DATA FROM FORMS
		getInputData: function() {
			return {
				text: selector( DOM.input ).value,
				status: 'unchecked'
			}
		},
		//CLEARS INPUT
		clearfield: function( e ) {
			if ( e ) {
				e.value = '';
				e.focus();
				return;
			}
			selector( DOM.input ).value = '';
			selector( DOM.input ).focus();

		},
		//GETS AN OBJECTS FROM createListNode AND CREATES AN HTML ELEMENT
		addList: function( obj ) {

			if ( obj !== void 0 ) {
				var html, str, element, date;
				element = document.querySelector( DOM.ul );
				//html string to append
				str = '<li id="%id%"><span id="removeIcon"><i class="fa fa-trash-o delete"></i><i class="fa fa-plus-square-o reminderbtn"></i></span><span>%text%</span><span class="input-check"><input type="checkbox" class="checkbox" %status%></span><span class="date">%date%</span></li>'

				//find and replace with object values
				html = str.replace( "%text%", obj.text );
				html = html.replace( "%status%", obj.status );
				html = html.replace( "%id%", obj.id )
				html = html.replace( "%date%", this.date() );

				element.insertAdjacentHTML( 'afterbegin', html );
			}
		},
		//TAKES AN ARRAYLIKE OBJECT AND MAKE ARRAY FROM
		makeArray: function( arrayLike ) {
			var arr;

			arr = Array.prototype.slice.call( arrayLike );
			return arr;

		},
		//CHECKS IF A NODE LI HAS THE ACTIVE CLASS
		withClass: function( array ) {
			var active, split;
			//find method filtered  the node element and return one with the active class
			active = this.findClass( array );

			//splits the text content of the node
			split = active[ 0 ].textContent.split( ' ' );
			//make up for spaced names
			if ( split.length > 2 ) {
				//remove the item number span content
				//temporary fix
				split.pop();
				//means its a spaces name
				return split[ 0 ].concat( split[ 1 ] );
			}
			return split[ 0 ];
		},
		//add active class on click
		addActiveClass: function( current ) {
			var liNodes, arr;

			//remove from siblings
			liNodes = selector( DOM.categories ).children;
			arr = this.makeArray.bind( this, liNodes )();

			arr.forEach( function( each ) {
				if ( each.classList.contains( 'active' ) ) {
					each.classList.remove( 'active' );
				}
			} )
			current.classList.add( 'active' );
		},
		//disable input if All category has class
		//takes a true or false argumment
		disableInput: function( state ) {

			selector( DOM.input ).disabled = state;
			if ( state ) {
				selector( DOM.input ).setAttribute( 'placeholder', 'All items, Choose subCategories to add todos' )
			} else {
				selector( DOM.input ).setAttribute( 'placeholder', 'Add tasks' );
			}
		},
		//takes the data category array
		//creates an creates html elements from each object
		//append it to the right category
		addSubset: function( arr ) {
			var data, html, obj;
			//clears children of the ul(list item panel)
			this.clearChildren();
			if ( arguments.length > 0 ) {
				for ( var i = 0; arr.length ? i < arr.length : i = arr.length; i++ ) {
					for ( var props in arr[ i ] ) {
						obj = arr[ i ];
						//reduce extracts the description and vhecked status ;
						data = obj.reduce();
					}
					this.addList( data );
				}
			}

		},
		clearChildren: function() {
			selector( DOM.ul ).innerHTML = '';
		},
		getTaskName: function() {
			var children, text, substr;

			children = selector( DOM.categories ).children;
			text = this.findClass( this.makeArray( children ) )[ 0 ].textContent.split( ' ' );
			substr = [];

			if ( text.length > 2 ) {
				text.pop();
				substr.push( text[ 0 ], text[ 1 ] );
				selector( DOM.taskName ).textContent = substr.join( ' ' );
			} else {
				selector( DOM.taskName ).textContent = text[ 0 ];
			}
		},
		findClass: function( arr ) {
			var x;

			x = arr.filter( function( each ) {
				if ( each.classList.contains( 'active' ) ) {
					return each;
				}
			} );
			return x;
		},
		spanFiller: function() {

			var spans, arr, firstSpan;
			//get all spans and convert to array;
			spans = selector( DOM.span, 'all' );
			//this.makeArray is a local method
			arr = this.makeArray( spans );

			firstSpan = arr.shift();
			return {
				//first span is the all span
				//all position altered program breaks
				//fix later
				firstSpan: firstSpan,
				arr: arr
			}
		},
		//removes an element from an array;
		removeElement: function( id ) {
			var list_panel;

			list_panel = this.makeArray( selector( DOM.ul ).children );

			list_panel.forEach( function( current ) {
				if ( current.id === id ) {
					selector( DOM.ul ).removeChild( current );
				}
			} )
		},
		//concats the number of completed tasks to the..........
		completed: function( num ) {
			selector( DOM.complete ).textContent = num;
		},
		getText: function() {
			return selector( DOM.subInput ).value;
		},
		updateCategory: function( name ) {
			var str, html;

			str = '<li><i class="fa fa-list-alt"></i>%name% &#8194;<span>0</span></li>';
			html = str.replace( '%name%', name );
			selector( DOM.categories ).insertAdjacentHTML( 'beforeend', html );
		},
		remind: function( text, id ) {
			var html, str, ul, ex, ids = [];
			ul = selector( DOM.reminder );
			html = '<li><i class="fa fa-clock-o"></i>%text%</li>';

			function exists( item ) {
				if ( item.textContent === text ) {
					ex = true;
					return;
				} else {
					ex = false;
				}
			}
			//loops through present and li
			//returns false if it exist
      [].forEach.call( ul.children, exists );
			//function is faulty
			if ( !ex ) {
				str = html.replace( '%text%', text );
				ul.insertAdjacentHTML( 'beforeend', str );
			}
		},
		keepReminderHeight: function() {
			var height;

			height = selector( DOM.reminder ).clientHeight;
			if ( height === 133 ) {
				selector( DOM.reminder ).style.height = height + 'px';
			}
		},
		disablePointer: function() {
			var lis;
			lis = selector( DOM.lis, 'all' );

			function disable( el ) {
				el.style.pointerEvents = 'none';
			};
      [].forEach.call( lis, disable );
		},
		removeCategory: function() {
			var list, withClass;
			list = selector( DOM.categories ).children;
			withClass = this.findClass( Array.from( list ) )[ 0 ];
			selector( DOM.categories ).removeChild( withClass );
		}
	}
}() );

//************************************************************************************
// App_Ctrl
//*************************************************************************************

var App_Ctrl = ( function( Data_ObjMod, UIController ) {
	//************************************************************************************
	// event helper functions starts
	//*************************************************************************************
	//fill all spans with length of category array
	//function is class in getValue function
	var fillSpan = function() {
		var arr, i;

		var span = UIController.spanFiller();
		span.firstSpan.textContent = Data_ObjMod.datalength();
		arr = Data_ObjMod.dataAll();

		for ( i = 0; i < span.arr.length; i++ ) {
			var each = span.arr[ i ];
			each.textContent = arr[ i ]
		}
	}

	//returns the collective length of all the array in the data
	//function is called in when the all button is clicked
	// called in getItems function
	function fetchAllData() {
		var obj;

		obj = Data_ObjMod.fetchAll();
		UIController.addSubset( obj );
	}

	//retrieves the name of the active class;
	function retrieveClass() {
		var children, catNames, withclass
		children = selector( UIController.ids.categories ).children;
		catNames = UIController.makeArray( children );
		//get category with active class
		withclass = UIController.withClass( catNames ).toLowerCase();
		return withclass;
	}


	function getCategory() {
		var datatype;
		//get all li in categories
		var withClass = retrieveClass();
		datatype = Data_ObjMod.compartmentalise( withClass );
		if ( datatype ) {
			UIController.addSubset( datatype );
		} else {
			UIController.clearChildren();
		}
		UIController.getTaskName();
	}

	function completeTask() {
		selector( UIController.ids.complete ).innerHTML = Data_ObjMod.completedTask()
	}

	function trimmed( data ) {
		return data.trim();
	}

	function getMousePos( e ) {
		if ( !e ) {
			e = window.event
		}
		return {
			top: e.pageY + 4,
			left: e.pageX + 4
		}
	}


	function rightClickMenu() {
		function bindListener( el ) {
			el.addEventListener( "contextmenu", contextMenu );
		}

		var lis = selector( UIController.ids.categories ).children;
			[].forEach.call( lis, bindListener );
		selector( UIController.ids.menu ).addEventListener( "click", contextAction );
	}


	function makeActive( el ) {
		UIController.addActiveClass( el );
		return el;
	}

	function toggleMenu( fn ) {
		var menu, height, width;

		menu = selector( UIController.ids.menu );
		menu.style.top = fn.top + 'px';
		menu.style.left = fn.left + 'px';
		$( menu ).show( 100 );

	}


	var contextFns = {
		view_all: function( e ) {

		},
		edit: function( e ) {

		},
		delete_cat: function( e ) {
			Data_ObjMod.dataKeys().map( function( key ) {
				if ( key === e ) {
					return Data_ObjMod.removeCatObj( e );
				}
			} );
		}
	}

	function getAllItems( target ) {
		fetchAllData();
		UIController.disableInput( true );
		UIController.addActiveClass( target );
		UIController.getTaskName();
		UIController.disablePointer();
	}
	//************************************************************************************
	// event helper functions ends
	//*************************************************************************************



	//************************************************************************************
	// event handler functions start
	//*************************************************************************************

	var getValue = function( e ) {
		var inputData, nodeParams, obj, catNames, withclass, children;

		if ( e.keyCode === 13 ) {

			inputData = UIController.getInputData();
			//clearinput and focus
			UIController.clearfield( e.target );
			//get all li in categories
			//and return a formated version of the name of the li with the ctive class
			withclass = retrieveClass();
			//Update the list panel with new li object
			nodeParams = Data_ObjMod.createListNode( inputData.text, inputData.status, withclass );
			//add item to ui
			UIController.addList( nodeParams );
			//save to data
			Data_ObjMod.updateData( nodeParams, withclass );
			//updates span values
			fillSpan();

		}
	}


	var getItems = function( e ) {
		var target, firstNode, text;

		target = e.target;

		//get first node which is the all category
		firstNode = document.querySelector( "#categories" ).children[ 0 ];

		if ( target.tagName === 'LI' ) {
			//if all , disable input field
			if ( target === firstNode ) {
				fetchAllData();
				getAllItems( target )
				return;
			} else {
				UIController.disableInput( false );
			}
			//add active
			UIController.addActiveClass( target );
			//function defined below
			//takes an object and event type
			UIController.clearfield();
			getCategory();
		}
	}


	var delete_Status_Update = function( e ) {
		$( UIController.ids.menu ).hide( 100 );
		var target, id, li, state = false;

		target = e.target;
		li = target.parentNode.parentNode;
		id = li.id;

		if ( target.classList.contains( 'delete' ) ) {
			if ( retrieveClass() !== 'all' ) {
				Data_ObjMod.removeFromData( parseInt( id ), retrieveClass() );
				UIController.removeElement( id );
				fillSpan();
			}
		}


		if ( target.classList.contains( 'checkbox' ) ) {
			if ( target.checked === true ) {
				state = true;
			}
			Data_ObjMod.changeStatus( parseInt( id ), retrieveClass(), state );
			completeTask();
		}

		if ( target.classList.contains( 'reminderbtn' ) ) {
			var data;

			data = li.children[ 1 ].textContent;
			UIController.keepReminderHeight();
			UIController.remind( data );
		}
	}

	var addToCat = function( e ) {
		var inputData, refined, target, withclass;

		target = e.target;

		if ( e.keyCode === 13 ) {
			inputData = UIController.getText();
			refined = trimmed( inputData );
			UIController.updateCategory( refined );
			UIController.clearfield( target );
			rightClickMenu();
		}
	}

	var contextMenu = function( e ) {
		var firstNode, withclass;
		firstNode = document.querySelector( "#categories" ).children[ 0 ];
		e.preventDefault();

		makeActive( this );
		withclass = retrieveClass();
		toggleMenu( getMousePos( e ) );

		if ( e.target === firstNode ) {
			selector( "#delete_cat" ).style.display = "none";
			selector( "#edit" ).style.display = "none";
		} else {
			selector( "#delete_cat" ).style.display = "";
			selector( "#edit" ).style.display = "";
		}
	}

	function contextAction( e ) {
		var contextItemId, target, category, cat, firstNode;

		firstNode = document.querySelector( "#categories" ).children[ 0 ];

		cat = selector( UIController.ids.categories ).children;
		if ( !firstNode.classList.contains( 'active' ) ) {
			target = e.target;
			contextItemId = e.target.id;
			category = retrieveClass();
			contextFns[ contextItemId ]( category );
			UIController.removeCategory();
			fillSpan();
			getAllItems( firstNode );
		}
	}
	//************************************************************************************
	// event handler functions ends
	//*************************************************************************************

	function setUpEventListeners() {
		selector( UIController.ids.input ).addEventListener( "keypress", getValue );
		selector( UIController.ids.categories ).addEventListener( "click", getItems );
		document.addEventListener( "click", delete_Status_Update );
		document.addEventListener( "contextmenu", function( e ) {
			e.preventDefault();
		} );
		rightClickMenu();
		selector( UIController.ids.subInput ).addEventListener( "keypress", addToCat );
		selector( UIController.ids.add ).addEventListener( "click", function() {
			$( ".category_add" ).slideToggle();
		} );
	}

	return {
		init: function() {
			setUpEventListeners();
			UIController.disableInput( true );
			fillSpan( Data_ObjMod.dataAll() );
			UIController.getTaskName();
			selector( UIController.ids.date ).innerHTML = UIController.date();
			completeTask();
			$( ".category_add" ).hide( 500 );
			$( '.context-menu' ).hide( 300 );
		}
	}


}( Data_ObjMod, UIController ) );

App_Ctrl.init();


