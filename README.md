jquery.assignment.js
====================

jQuery Assignment is a plugin to provide an easy UI to handle one-to-many and many-to-many relationships.

Jquery Assignment works in multiple modes that are chosen during initialization, in the default form it works just like a html form and the items in the right box will be submitted. Alternatively a callback function can be used or an ajax request for every assign or deassign action.

# Usage

Make a div with an id, for example: <div id="test"></div>.

Then use the following one liner:

$("#test").assignment({type:"<type>"});

By default The type is used for the name of the hidden input generated and for the titles. Other options can be passed in in the options object, see below for other options or look at dmeo.html for more examples.

# General Requirements

jQuery Assignment only relies on jQuery. A pure javascript version might be made if people want it, but since jQuery is so ubiquitous it's not a priority.

# Initialization options

*initial_data_input_method, default "dom"
    "dom" let's you input data by using two select elements with options within the main div. See example 1 in demo.html.
    "direct" lets you specify a data_input object in the initialization of the form {active:{value:"display",value2:"display2"},inactive:{value3:"display3"}}

*callback, default "form"
    In the default form it works just like a html form and the items in the right box will be submitted. Alternatively a callback function (callback) can be used or an ajax request (ajax) for every assign or deassign action.

*form_element_container_id, default type+"s"
    The name of the form element generated when in default form mode. If the type is "animal" the form element will have it's name attribute as "animals" by default.

*ajax_form_data, default{}
    Extra form data to pass when in ajax mode. For example a token or something similar.

*main_id, default 0
    Used to set the id of the "one" in one to many relationships. Only used in callback or AJAX mode.

*select_button_id, default "as_select_item_"+key
*deselect_button_id, default"as_deselect_item_"+key
*select_field_id, default"as_items_"+key
*deselect_field_id, default"as_selected_items_"+key
*search_field_id, default"as_search_"+key
    If you need a specific id for some of the elements used you can pass them as one of these values. Key is a random number generated for this instance of jQuery Assignment

*show_select_all, default false
    Show a select all button that moves all of the entries in the left box over to the right (active) box.

*select_all_button_id, default "as_select_all_"+key
    The DOM id for the above mentioned button.

*title1, default "Available "+type+"s"
*title2, default "Active "+type+"s"
    The titles above the boxes. (You cannot use the type variable when overriding the defaults.)
*class_td, default ""
*class_button, default ""
    Extra classes for some elements to customise the style.

*search, default true
    Add a search box that filters the left (inactive) side.

*search_event, default "keyup"
    keyup or change, this is to determine what triggers the search filter

*style, default "select"
    For mobile devices the "list" mode can be used to prevent the browser from changing select boxes to popups and messing with it that way.

	

