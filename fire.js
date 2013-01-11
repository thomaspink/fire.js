//! Fire.js
// The litte DOM Helper for Javascript-Nerds
//
// Version 0.1
// MIT licensed
// 
// Copyright (C) 2013 Thomas Pink

 
 
(function() {
	
	var self;
	
	//
	// Do it with Fire!
	//
	function Fire( elem ) {
	
		self = this;
		
		if( !elem ) {
			self.extend( document );
		} else {
			self.extend( elem);
		}
	}
	
	//
	//	Extends an Element of the DOM with 
	//	the fire.js functionality.
	//
	Fire.prototype.extend = function( elem ) {
		
		// Kill it, if no element is given or if element is already extended
		if( !elem || !!elem.extendedWithFire ) return;
		
		// Check if it is a single DOM Element or a list of them
		if( elem.length > 1 ) {
			self.extendElements( elem );
		}
		
		//! override Core Functions
		// Get Element By Id
		var getElementById = elem.getElementById;
		elem.getElementById = function() {
			return self.extend( getElementById.apply( elem, arguments ) );
		}
		
		var getElementsByTagName = elem.getElementsByTagName;
		elem.getElementsByTagName = function() {
			return self.extend( getElementsByTagName.apply( elem, arguments ) );
		}
		
		var getElementsByClassName = elem.getElementsByClassName;
		elem.getElementsByClassName = function() {
		
			if(!arguments || !arguments[0] ) return null;
			
			if (!document.getElementsByClassName) {
			
				// Browser supports getElementsByClassName - use native function
				return self.extend( getElementsByTagName.apply( elem, arguments ) );
			
			} else {
			
				// Browser does not support getElementsByClassName - use polyfill
				// getElementsByClassName Polyfill: https://gist.github.com/2299607
				
				var d = document, elements, pattern, i, results = [];
				var search = arguments[0];
				if ( d.querySelectorAll ) { // IE8
					return self.extend( d.querySelectorAll( "." + search ) );
				}
			
				if ( d.evaluate ) { // IE6, IE7
					
					pattern = ".//*[contains(concat(' ', @class, ' '), ' " + search + " ')]";
					elements = d.evaluate( pattern, d, null, 0, null );
					while (i = elements.iterateNext() ) {
						results.push( i );
					}
					
				} else {
					
					elements = d.getElementsByTagName( "*" );
					pattern = new RegExp( "(^|\\s)" + search + "(\\s|$)" );
					for ( i = 0; i<elements.length; i++ ) {
						if ( pattern.test( elements[i].className ) ) {
							results.push( elements[i] );
						}
					}
				}
				return self.extend( results );
				
			}
				
		}
		
		//! add new Functions
		elem.hasClass = function( className ) {
			return self.hasClass( elem, className );
		};
		
		elem.addClass = function( className ) {
			return self.addClass( elem, className );
		};
		
		elem.removeClass = function( className ) {
			return self.removeClass( elem, className );
		};
		
		// Mark element as extended
		elem.extendedWithFire = true;
		
		return elem;
		
	}
	
	
	//
	// Runs through a list of DOM Elements and 
	// extends with fire.js functionality.
	//
	Fire.prototype.extendElements = function( elements ) {
		if( !!elements ) {
			for( var i=0; i<elements.length; i++ ) {
				self.extend( elements[i] );
			}
			
			return elements;
		}
		
		return null;
	}
	
	//
	// Functionality to check if DOM element has a specific class
	//
	Fire.prototype.hasClass = function( elem, className ) {
	
		// Check if there is an element and
		// a Class Name given
		if( !elem || !className ) return null;
	
		// Check if it is a list of elements
		if( elem.length > 1 ) {
		
			// Run through the list and check if
			// one of them has not that class Name
			for( var i=0; i<elem.length; i++ ) {
				if( !self.hasClass( elem[i], className ) ) {
					return false;
				}
			}
			
			// Not found - return false
			return true;
			
		} else {
		
			// Check if browser supports classList
			// Jep: Check with classList
			// Nope: Do a regex
			if( !!elem.classList ) {
				return elem.classList.contains( className );
			} else {
				var className = " " + className + " ";
				return ((" " + elem.className + " ").replace(/[\n\t]/g, " ").indexOf(className) > -1);
			}
		}
	}
	
	//
	// Add Class Functionality
	//
	Fire.prototype.addClass = function( elem, className ) {
		
		// Check if there is an element and
		// a Class Name given
		if( !elem || !className ) return null;
	
		// Check if it is a list of elements
		if( elem.length > 1 ) {
		
			// Run through the list and add
			// Class Name to all of them
			for(var i=0; i<elem.length; i++) {
				self.addClass( elem[i], className );
			}
			
			// Extend all Elements and return it
			return self.extendElements( elem );
			
		} else {
		
			// Check if browser supports classList
			// Jep: Add it to classList
			// Nope: Add it as string
			if( !!elem.classList ) {
				elem.classList.add( className );
			} else if( !self.hasClass( elem, className ) ) {
				elem.className += " " + className;
			}
			
			// return the extended Element
			return self.extend( elem );
		}
	}
	
	//
	// Remove Class Functionality
	//
	Fire.prototype.removeClass = function( elem, className ) {
		
		// Check if there is an element and
		// a Class Name given
		if( !elem || !className ) return null;
	
		// Check if it is a list of elements
		if( elem.length > 1 ) {
		
			// Run through the list and remove
			// Class Name of them all
			for(var i=0; i<elem.length; i++) {
				self.removeClass( elem[i], className );
			}
			
			// Extend all Elements and return it
			return self.extendElements( elem );
			
		} else {
			// Check if browser supports classList
			// Jep: Remove it from classList
			// Nope: Remove it with regex
			if( !!elem.classList ) {
				elem.classList.remove( className );
			} else if ( self.hasClass( elem, className ) ) {
				var reg = new RegExp('(\\s|^)'+ className +'(\\s|$)');
				elem.className = elem.className.replace(reg,' ');
			}
			
			// return the extended Element
			return self.extend( elem );
		}
	}
	
	window.Fire = new Fire();
	
})();