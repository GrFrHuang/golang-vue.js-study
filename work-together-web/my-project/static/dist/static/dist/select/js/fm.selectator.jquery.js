/*
 Selectator jQuery Plugin
 A plugin for select elements
 version 2.2, Dac 11th, 2015
 by Ingi P. Jacobsen

 The MIT License (MIT)

 Copyright (c) 2013 Faroe Media

 Permission is hereby granted, free of charge, to any person obtaining a copy of
 this software and associated documentation files (the "Software"), to deal in
 the Software without restriction, including without limitation the rights to
 use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 the Software, and to permit persons to whom the Software is furnished to do so,
 subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all
 copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
var s$ = jQuery.noConflict();
(function(s$) {
	s$.selectator = function (element, options) {
		var defaults = {
			prefix: 'selectator_',
			height: 'auto',
			useDimmer: false,
			useSearch: true,
			showAllOptionsOnFocus: false,
			selectFirstOptionOnSearch: true,
			keepOpen: false,
			searchCallback: function(){},
			labels: {
				search: 'Search...'
			}
		};

		var plugin = this;
		plugin.settings = {};
		var s$source_element = s$(element);
		var s$container_element = null;
		var s$chosenitems_element = null;
		var s$input_element = null;
		var s$textlength_element = null;
		var s$options_element = null;
		var is_single = s$source_element.attr('multiple') === undefined;
		var is_multiple = !is_single;
		var has_visible_options = true;
		var key = {
			backspace: 8,
			tab:       9,
			enter:    13,
			shift:    16,
			ctrl:     17,
			alt:      18,
			capslock: 20,
			escape:   27,
			pageup:   33,
			pagedown: 34,
			end:      35,
			home:     36,
			left:     37,
			up:       38,
			right:    39,
			down:     40
		};



		// INITIALIZE PLUGIN
		plugin.init = function () {
			plugin.settings = s$.extend({}, defaults, options);

			//// ================== CREATE ELEMENTS ================== ////
			// dimmer
			if (plugin.settings.useDimmer) {
				if (s$('#' + plugin.settings.prefix + 'dimmer').length === 0) {
					var s$dimmer_element = s$(document.createElement('div'));
					s$dimmer_element.attr('id', plugin.settings.prefix + 'dimmer');
					s$dimmer_element.hide();
					s$(document.body).prepend(s$dimmer_element);
				}
			}
			// source element
			s$source_element.addClass('selectator');
			// container element
			s$container_element = s$(document.createElement('div'));
			if (s$source_element.attr('id') !== undefined) {
				s$container_element.attr('id', plugin.settings.prefix + s$source_element.attr('id'));
			}
			s$container_element.addClass(plugin.settings.prefix + 'element ' + (is_multiple ? 'multiple ' : 'single ') + 'options-hidden');
			if (!plugin.settings.useSearch) {
				s$container_element.addClass('disable_search');
			}
			s$container_element.css({
				width: s$source_element.css('width'),
				minHeight: s$source_element.css('height'),
				padding: s$source_element.css('padding'),
				'flex-grow': s$source_element.css('flex-grow'),
				position: 'relative'
			});
			if (plugin.settings.height === 'element') {
				s$container_element.css({
					height: s$source_element.outerHeight() + 'px'
				});
			}
			// textlength element
			s$textlength_element = s$(document.createElement('span'));
			s$textlength_element.addClass(plugin.settings.prefix + 'textlength');
			s$textlength_element.css({
				position: 'absolute',
				visibility: 'hidden'
			});
			s$container_element.append(s$textlength_element);
			// chosen items element
			s$chosenitems_element = s$(document.createElement('div'));
			s$chosenitems_element.addClass(plugin.settings.prefix + 'chosen_items');
			s$container_element.append(s$chosenitems_element);
			// input element
			s$input_element = s$(document.createElement('input'));
			s$input_element.addClass(plugin.settings.prefix + 'input');
			s$input_element.attr('tabindex', s$source_element.attr('tabindex'));
			if (!plugin.settings.useSearch) {
				s$input_element.attr('readonly', true);
				s$input_element.css({
					'width': '0px',
					'height': '0px',
					'overflow': 'hidden',
					'border': 0,
					'padding': 0,
					'position': 'absolute'
				});
			} else {
				if (is_single) {
					s$input_element.attr('placeholder', plugin.settings.labels.search);
				} else {
					s$input_element.width(20);
				}
			}
			s$input_element.attr('autocomplete', 'false');
			s$container_element.append(s$input_element);
			// options element
			s$options_element = s$(document.createElement('ul'));
			s$options_element.addClass(plugin.settings.prefix + 'options');

			s$container_element.append(s$options_element);
			s$source_element.after(s$container_element);
			s$source_element.hide();

			// Add scrollator if found
			if (typeof Scrollator !== 'undefined') {
				s$options_element.scrollator({
					zIndex: 1001,
					customClass : 'ease_preventOverlay'
				});
			}


			//// ================== BIND ELEMENTS EVENTS ================== ////
			// source element
			s$source_element.change(function () {
				regenerateChosenItems();
			});
			// container element
			s$container_element.on('focus', function (e) {
				s$input_element.focus();
				s$input_element.trigger('focus');
			});
			s$container_element.on('mousedown', function (e) {
				e.preventDefault();
				s$input_element.focus();
				s$input_element.trigger('focus');
				// put text caret to end of search field
				if (s$input_element[0].setSelectionRange) {
					s$input_element[0].setSelectionRange(s$input_element.val().length, s$input_element.val().length);
				} else if (s$input_element[0].createTextRange) {
					var range = s$input_element[0].createTextRange();
					range.collapse(true);
					range.moveEnd('character', s$input_element.val().length);
					range.moveStart('character', s$input_element.val().length);
					range.select();
				}
			});
			s$container_element.on('mouseup', function (e) {
			});
			s$container_element.on('click', function (e) {
				s$input_element.focus();
				s$input_element.trigger('focus');
			});
			s$container_element.on('dblclick', function (e) {
				s$input_element.select();
				s$input_element.trigger('focus');
			});
			// input element
			s$input_element.on('click', function (e) {
			});
			s$input_element.on('dblclick', function (e) {
			});
			s$input_element.on('keydown', function (e) {
				var keyCode = e.keyCode || e.which;
				var s$active = null;
				var s$newActive = null;
				switch (keyCode) {
					case key.up:
						e.preventDefault();
						showDropdown();
						s$active = s$options_element.find('.active');
						if (s$active.length !== 0) {
							s$newActive = s$active.prevUntil('.' + plugin.settings.prefix + 'option:visible').add(s$active).first().prev('.' + plugin.settings.prefix + 'option:visible');
							s$active.removeClass('active');
							s$newActive.addClass('active');
						} else {
							s$options_element.find('.' + plugin.settings.prefix + 'option').filter(':visible').last().addClass('active');
						}
						scrollToActiveOption();
						break;
					case key.down:
						e.preventDefault();
						showDropdown();
						s$active = s$options_element.find('.active');
						if (s$active.length !== 0) {
							s$newActive = s$active.nextUntil('.' + plugin.settings.prefix + 'option:visible').add(s$active).last().next('.' + plugin.settings.prefix + 'option:visible');
							s$active.removeClass('active');
							s$newActive.addClass('active');
						} else {
							s$options_element.find('.' + plugin.settings.prefix + 'option').filter(':visible').first().addClass('active');
						}
						scrollToActiveOption();
						break;
					case key.escape:
						e.preventDefault();
						break;
					case key.enter:
						e.preventDefault();
						s$active = s$options_element.find('.active');
						if (s$active.length !== 0) {
							selectOption();
						} else {
							if (s$input_element.val() !== '') {
								plugin.settings.searchCallback(s$input_element.val());
							}
						}
						resizeSearchInput();
						break;
					case key.tab:
						e.preventDefault();
						s$active = s$options_element.find('.active');
						if (s$active.length !== 0) {
							selectOption();
						} else {
							if (s$input_element.val() !== '') {
								plugin.settings.searchCallback(s$input_element.val());
							}
						}
						resizeSearchInput();
						break;
					case key.backspace:
						if (plugin.settings.useSearch) {
							if (s$input_element.val() === '' && is_multiple) {
								s$source_element.find('option:selected').last()[0].selected = false;
								s$source_element.trigger('change');
								regenerateChosenItems();
							}
							resizeSearchInput();
						} else {
							e.preventDefault();
						}
						break;
					default:
						resizeSearchInput();
						break;
				}
			});
			s$input_element.on('keyup', function (e) {
				e.preventDefault();
				e.stopPropagation();
				var keyCode = e.which;
				switch (keyCode) {
					case key.escape:
						hideDropdown();
						break;
					case key.enter:
						if (!plugin.settings.keepOpen) {
							hideDropdown();
						}
						break;
					case key.left:
					case key.right:
					case key.up:
					case key.down:
					case key.tab:
					case key.shift:
						// Prevent any action
						break;
					default:
						search();
						break;
				}
				if (s$container_element.hasClass('options-hidden') && (keyCode === key.left || keyCode === key.right || keyCode === key.up || keyCode === key.down)) {
					showDropdown();
				}
				resizeSearchInput();
			});
			s$input_element.on('focus', function (e) {
				s$container_element.addClass('focused');
				if (is_single || plugin.settings.showAllOptionsOnFocus || !plugin.settings.useSearch) {
					showDropdown();
				}
			});
			s$input_element.on('blur', function (e) {
				s$container_element.removeClass('focused');
				hideDropdown();
			});


			// bind option events
			s$container_element.delegate('.' + plugin.settings.prefix + 'option', 'mouseover', function (e) {
				var s$active = s$options_element.find('.active');
				s$active.removeClass('active');
				var s$this = s$(this);
				s$this.addClass('active');
			});
			s$container_element.delegate('.' + plugin.settings.prefix + 'option', 'mousedown', function (e) {
				e.preventDefault();
				e.stopPropagation();
			});
			s$container_element.delegate('.' + plugin.settings.prefix + 'option', 'mouseup', function (e) {
				selectOption();
			});
			s$container_element.delegate('.' + plugin.settings.prefix + 'option', 'click', function (e) {
				e.stopPropagation();
			});

			regenerateOptions();
			regenerateChosenItems();
		};


		// RESIZE INPUT
		var resizeSearchInput = function () {
			s$textlength_element.text(s$input_element.val());
			if (is_multiple) {
				var width = s$textlength_element.width() > (s$container_element.width() - 30) ? (s$container_element.width() - 30) : (s$textlength_element.width() + 30);
				s$input_element.css({ width: width + 'px' });
			}
		};


		// REGENERATE CHOSEN ITEMS
		var regenerateChosenItems = function () {
			s$chosenitems_element.empty();
			s$source_element.find('option').each(function () {
				var s$option = s$(this);
				if (this.selected) {
					var s$item_element = s$(document.createElement('div'));
					s$item_element.addClass(plugin.settings.prefix + 'chosen_item');
					s$item_element.addClass(plugin.settings.prefix + 'value_' + s$option.val().replace(/\W/g, ''));

					// class
					if (s$option.attr('class') !== undefined) {
						s$item_element.addClass(s$option.attr('class'));
					}
					// left
					if (s$option.data('left') !== undefined) {
						var s$left_element = s$(document.createElement('div'));
					}
					// right
					if (s$option.data('right') !== undefined) {
						var s$right_element = s$(document.createElement('div'));
						s$right_element.addClass(plugin.settings.prefix + 'chosen_item_right').html(s$option.attr('data-right'));
						s$item_element.append(s$right_element);
					}
					// title
					var s$title_element = s$(document.createElement('div'));
					s$title_element.addClass(plugin.settings.prefix + 'chosen_item_title').html(s$option.html());
					s$item_element.append(s$title_element);
					// subtitle
					if (s$option.data('subtitle') !== undefined) {
						var s$subtitle_element = s$(document.createElement('div'));
						s$subtitle_element.addClass(plugin.settings.prefix + 'chosen_item_subtitle').html(s$option.attr('data-subtitle'));
						s$item_element.append(s$subtitle_element);
					}
					// remove button
					var s$button_remove_element = s$(document.createElement('div'));
					s$button_remove_element.data('source_option_element', this);
					s$button_remove_element.addClass(plugin.settings.prefix + 'chosen_item_remove');
					s$button_remove_element.on('mousedown', function (e) {
					});
					s$button_remove_element.on('mouseup', function (e) {
						s$(this).data('source_option_element').selected = false;
						s$source_element.trigger('change');
						search();
						regenerateChosenItems();
					});
					s$button_remove_element.html('X');
					s$item_element.append(s$button_remove_element);
					s$chosenitems_element.append(s$item_element);
				}
			});
		};


		// REGENERATE OPTIONS
		var regenerateOptions = function () {
			s$options_element.empty();
			var optionsArray = [];
			s$source_element.children().each(function () {
				if (s$(this).prop('tagName').toLowerCase() === 'optgroup') {
					var s$group = s$(this);
					if (s$group.children('option').length !== 0) {
						var groupOptionsArray = [];
						s$group.children('option').each(function () {
							groupOptionsArray.push({
								type: 'option',
								text: s$(this).html(),
								element: this
							});
						});
						optionsArray.push({
							type: 'group',
							text: s$group.attr('label'),
							options: groupOptionsArray,
							element: s$group
						});
					}
				} else {
					optionsArray.push({
						type: 'option',
						text: s$(this).html(),
						element: this
					});
				}
			});

			s$(optionsArray).each(function () {
				if (this.type === 'group') {
					var s$group_element = s$(document.createElement('li'));
					s$group_element.addClass(plugin.settings.prefix + 'group');
					if (s$(this.element).attr('class') !== undefined) {
						s$group_element.addClass(s$(this.element).attr('class'));
					}
					s$group_element.html(s$(this.element).attr('label'));
					s$options_element.append(s$group_element);

					s$(this.options).each(function () {
						var option = createOption.call(this.element, true);
						s$options_element.append(option);
					});

				} else {
					var option = createOption.call(this.element, false);
					s$options_element.append(option);
				}
			});
			search();
		};


		// CREATE RESULT OPTION
		var createOption = function (isGroupOption) {
			// holder li
			var s$option = s$(document.createElement('li'));
			s$option.data('source_option_element', this);
			s$option.addClass(plugin.settings.prefix + 'option');
			s$option.addClass(plugin.settings.prefix + 'value_' + s$(this).val().replace(/\W/g, ''));
			if (isGroupOption) {
				s$option.addClass(plugin.settings.prefix + 'group_option');
			}
			if (this.selected) {
				s$option.addClass('active');
			}
			// class
			if (s$(this).attr('class') !== undefined) {
				s$option.addClass(s$(this).attr('class'));
			}
			// left
			if (s$(this).data('left') !== undefined) {
				var s$left_element = s$(document.createElement('div'));
			}
			// right
			if (s$(this).data('right') !== undefined) {
				var s$right_element = s$(document.createElement('div'));
				s$right_element.addClass(plugin.settings.prefix + 'option_right').html(s$(this).attr('data-right'));
				s$option.append(s$right_element);
			}
			// title
			var s$title_element = s$(document.createElement('div'));
			s$title_element.addClass(plugin.settings.prefix + 'option_title').html(s$(this).html());
			s$option.append(s$title_element);
			// subtitle
			if (s$(this).data('subtitle') !== undefined) {
				var s$subtitle_element = s$(document.createElement('div'));
				s$subtitle_element.addClass(plugin.settings.prefix + 'option_subtitle').html(s$(this).attr('data-subtitle'));
				s$option.append(s$subtitle_element);
			}

			return s$option;
		};


		// SEARCH
		var search = function () {
			// bool true if search field is considered empty
			var searchIsEmpty = s$input_element.val().replace(/\s/g, '') === '';
			// bool true if any options are visible
			has_visible_options = false;
			// get sanitized search text
			var searchFor = s$input_element.val().toLowerCase();
			// iterate through the options
			s$options_element.find('.' + plugin.settings.prefix + 'option').each(function () {
				var s$this = s$(this);
				var source_option_element = s$this.data('source_option_element');
				// show if:
				// (item is not selected  or  if single select)
				// and
				//     use search
				//         and search is empty  or  text matches the input box
				//     or not using search
				if (
					(!source_option_element.selected || is_single)
					&& (
						plugin.settings.useSearch
						&& (
							searchIsEmpty
							|| s$(source_option_element).html().toLowerCase().indexOf(searchFor) !== -1
						)
						|| !plugin.settings.useSearch
					)
				) {
					s$this.show();
					has_visible_options = !has_visible_options ? true : has_visible_options;
				} else {
					s$this.hide();
				}
			});
			// iterate through the groups
			s$options_element.find('.' + plugin.settings.prefix + 'group').each(function () {
				var s$this = s$(this);
				var has_visible_options = false;
				s$this.nextUntil('.' + plugin.settings.prefix + 'group').each(function () {
					var s$option = s$(this);
					if (s$option.css('display') != 'none') {
						has_visible_options = true;
						return false;
					}
				});
				// show if the group has any visible children
				if (has_visible_options) {
					s$this.show();
				} else {
					s$this.hide();
				}
			});
			showDropdown();
			if (is_multiple) {
				s$options_element.find('.active').removeClass('active');
				if (!searchIsEmpty) {
					s$options_element.find('.' + plugin.settings.prefix + 'option').filter(':visible').first().addClass('active');
				}
			}
		};


		// SHOW OPTIONS AND DIMMER
		var showDropdown = function () {
			if (s$input_element.is(':focus') && (has_visible_options || is_single )) {
				s$container_element.removeClass('options-hidden').addClass('options-visible');
				if (plugin.settings.useDimmer) {
					s$('#' + plugin.settings.prefix + 'dimmer').show();
				}
				setTimeout(function () {
					s$options_element.css('top', (s$container_element.outerHeight() + (is_multiple ? 0 : s$input_element.outerHeight()) - 1) + 'px');
					if (typeof Scrollator !== 'undefined') {
						s$options_element.data('scrollator').show();
					}
				}, 1);
				scrollToActiveOption();
			} else {
				hideDropdown();
			}
		};


		// HIDE OPTIONS AND DIMMER
		var hideDropdown = function () {
			s$container_element.removeClass('options-visible').addClass('options-hidden');
			if (typeof Scrollator !== 'undefined') {
				s$options_element.data('scrollator').hide();
			}
			if (plugin.settings.useDimmer) {
				s$('#' + plugin.settings.prefix + 'dimmer').hide();
			}
		};


		// SCROLL TO ACTIVE OPTION IN OPTIONS LIST
		var scrollToActiveOption = function () {
			var s$active_element = s$options_element.find('.' + plugin.settings.prefix + 'option.active');
			if (s$active_element.length > 0) {
				s$options_element.scrollTop(s$options_element.scrollTop() + s$active_element.position().top - s$options_element.height()/2 + s$active_element.height()/2);
			}
		};


		// SELECT ACTIVE OPTION
		var selectOption = function () {
			// select option
			var s$active = s$options_element.find('.active');
			s$active.data('source_option_element').selected = true;
			s$source_element.trigger('change');
			s$input_element.val('');
			search();
			regenerateChosenItems();
			if (!plugin.settings.keepOpen) {
				hideDropdown();
			}
		};


		// REFRESH PLUGIN
		plugin.refresh = function () {
			regenerateChosenItems();
		};


		// REMOVE PLUGIN AND REVERT SELECT ELEMENT TO ORIGINAL STATE
		plugin.destroy = function () {
			s$container_element.remove();
			s$.removeData(element, 'selectator');
			s$source_element.show();
			if (s$('.' + plugin.settings.prefix + 'element').length === 0) {
				s$('#' + plugin.settings.prefix + 'dimmer').remove();
			}
		};


		// Initialize plugin
		plugin.init();
	};

	s$.fn.selectator = function(options) {
		options = options !== undefined ? options : {};
		return this.each(function () {
			if (typeof(options) === 'object') {
				if (undefined === s$(this).data('selectator')) {
					var plugin = new s$.selectator(this, options);
					s$(this).data('selectator', plugin);
				}
			} else if (s$(this).data('selectator')[options]) {
				s$(this).data('selectator')[options].apply(this, Array.prototype.slice.call(arguments, 1));
			} else {
				s$.error('Method ' + options + ' does not exist in s$.selectator');
			}
		});
	};

}(jQuery));

s$(function () {
	s$('.selectator').each(function () {
		var s$this = s$(this);
		var options = {};
		s$.each(s$this.data(), function (key, value) {
			if (key.substring(0, 10) == 'selectator') {
				options[key.substring(10, 11).toLowerCase() + key.substring(11)] = value;
			}
		});
		s$this.selectator(options);
	});
});