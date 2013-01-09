
function Assignment(element,options) {
    var main_div = $(element).attr("id");
    var key = Math.floor((Math.random()*1000000)+1);
    var type = options.type;
    var defaults = {
        main_id:0,
        main_div: main_div,
        key : key,
        select_button_id : "as_select_item_"+key,
        deselect_button_id : "as_deselect_item_"+key,
        select_field_id : "as_items_"+key,
        deselect_field_id : "as_selected_items_"+key,
        search_field_id : "as_search_"+key,
        show_select_all:false,
        select_all_button_id:"as_select_all_"+key,
        select_action:"assign",
        deselect_action:"deassign",
        title1 : "Available "+type+"s",
        title2 : "Active "+type+"s",
        initial_data_input_method:"dom",
        data_input : {},
        class_td : "",
        class_button : "",
        search:true,
        search_event:"keyup",
        callback:"form",
        form_element_container_id:type+"s_"+key,
        ajax_form_data:{},
        style:"select"
    };
    this.item_cache = {};
    this.options = $.extend(defaults, options);
    if(typeof this.options.main_id === "undefined"){
        if($("#"+this.options.type+"_id").length > 0){
            this.options.main_id = $("#"+this.options.type+"_id").val() || 0;
        }else{
            this.options.main_id = 0;
        }
    }

    this.create_dom();
    this.set_handlers();
}

Assignment.prototype.handle_error = function(error){
    alert(error);
};

Assignment.prototype.load_data = function(data){
    var source1 = "";
    var source2 = "";
    source1 = data.inactive;
    source2 = data.active;
    for(key in source1){
        this.add_item(this.options.select_field_id,key,source1[key]);
    }
    for(key in source2){
        this.add_item(this.options.deselect_field_id,key,source2[key]);
    }

    //IE hack for http://stackoverflow.com/questions/5908494/select-only-shows-first-char-of-selected-option
    $("#"+this.options.select_field_id).css('width', 0);
    $("#"+this.options.select_field_id).css('width', 350);
    $("#"+this.options.deselect_field_id).css('width', 0);
    $("#"+this.options.deselect_field_id).css('width', 350);
};

Assignment.prototype.delete_data = function(data){
    $("#"+this.options.select_field_id).html("");
    $("#"+this.options.deselect_field_id).html("");
}

Assignment.prototype.set_main_id = function(id){
    this.options.main_id = id;
}

Assignment.prototype.add_item = function(dom_id,id,display){
    var content = this.render_item(id,display);
    $("#"+dom_id).append(content);
    if(this.options.style == "list"){
        $("#"+dom_id+" li:last").slideDown('slow');
    }

    //IE hack for http://stackoverflow.com/questions/5908494/select-only-shows-first-char-of-selected-option
    $("#"+this.options.select_field_id).css('width', 0);
    $("#"+this.options.select_field_id).css('width', 350);
    $("#"+this.options.deselect_field_id).css('width', 0);
    $("#"+this.options.deselect_field_id).css('width', 350);
};

Assignment.prototype.render_item = function(id,display){
    var content = "";
    if(this.options.style == "select"){
        content += "<option data-value='"+id+"' value='"+id+"'>"+display+"</option>";
    }else{
        content += "<li style='display:none' class='list-style' data-value='"+id+"'>"+display+"</li>";
    }
    this.item_cache[id] = display;
    return content;
};

Assignment.prototype.create_dom = function(){

    var source1 = {};
    var source2 = {};

    if(this.options.initial_data_input_method == "direct"){
        source1 = data_input.inactive;
        source2 = data_input.active;
    }else if(this.options.initial_data_input_method == "dom"){
        var id = ""
        var display = "";
        if($("#"+this.options.main_div).find("select").eq(0).length > 0){
            $("#"+this.options.main_div).find("select").eq(0).find("option").each(function(index){
                id = $(this).val();
                display = $(this).html();
                source1[id] = display;
            });
        }
        if($("#"+this.options.main_div).find("select").eq(1).length > 0){
            $("#"+this.options.main_div).find("select").eq(1).find("option").each(function(index){
                id = $(this).val();
                display = $(this).html();
                source2[id] = display;
            });
        }
    }

    if(this.options.style == "select"){
        var top_level_dom = $("<table></table>");
        var row1 = $("<tr><td class='"+this.options.class_td+"'>"+this.options.title1+"</td><td></td><td class='"+this.options.class_td+"'>"+this.options.title2+"</td></tr>");

        var search_row = "";
        var search_input = $("<input type='text' id='"+this.options.search_field_id+"' class='search'>");
        var search_column = $("<td class='"+this.options.class_td+"'>Search:</td>").append(search_input);
        if(this.options.search == true){
            search_row = $("<tr></tr>").append(search_column).append("<td></td>").append("<td></td>");
        }

        var select1 = $("<select name='items[]' id='"+this.options.select_field_id+"' multiple='multiple' style='width:350px;height:100px;'></select>");
        var select2 = $("<select name='selected_items[]' id='"+this.options.deselect_field_id+"' multiple='multiple' style='width:350px;height:100px;'></select>");
        var button1 = $("<button class='"+this.options.class_button+"' id='"+this.options.select_button_id+"' style='display:block;margin-bottom:10px;'>>></button>");
        var button2 = $("<button class='"+this.options.class_button+"' id='"+this.options.deselect_button_id+"' style='display:block;margin-bottom:10px;'><<</button>");
        var column1 = $("<td class='"+this.options.class_td+"'></td>").append(select1);
        var column2 = $("<td class='"+this.options.class_td+"' style='padding:20px;'></td>").append(button1).append(button2);
        var column3 = $("<td class='"+this.options.class_td+"'></td>").append(select2);
        var row2 = $("<tr></tr>").append(column1).append(column2).append(column3);
        var select_all_button = $("<button class='"+this.options.class_button+"' id='"+this.options.select_all_button_id+"' style='display:block;margin-bottom:10px;'>Select all "+this.options.type+"s</button>");
        var column1 = $("<td class='"+this.options.class_td+"'></td>").append(select_all_button);
        var column2 = $("<td></td>");
        var column3 = $("<td></td>");
        var row3 = $("<tr></tr>").append(column1).append(column2).append(column3);
        top_level_dom.append(row1).append(search_row).append(row2);
        if(this.options.show_select_all){
            top_level_dom.append(row3);
        }
        $("#"+this.options.main_div).html("").append(top_level_dom);
    }else if(this.options.style == "list"){
        var top_level_dom = $("<table></table>");
        var row1 = $("<tr><td class='"+this.options.class_td+"'>"+this.options.title1+"</td><td></td><td class='"+this.options.class_td+"'>"+this.options.title2+"</td></tr>");

        var search_row = "";
        var search_input = $("<input type='text' id='"+this.options.search_field_id+"' class='search'>");
        var search_column = $("<td class='"+this.options.class_td+"'>Search:</td>").append(search_input);
        if(this.options.search == true){
            search_row = $("<tr></tr>").append(search_column).append("<td></td>").append("<td></td>");
        }

        var select1 = $("<ul style='max-height: 170px; width: 300px; min-height: 170px;' class='assignment' id='"+this.options.select_field_id+"'></ul>");
        var select2 = $("<ul style='max-height: 170px; width: 300px; min-height: 170px;' class='assignment' id='"+this.options.deselect_field_id+"'></ul>");
        //var button1 = $("<button class='"+this.options.class_button+"' id='"+this.options.select_button_id+"' style='display:block;margin-bottom:10px;'>>></button>");
        //var button2 = $("<button class='"+this.options.class_button+"' id='"+this.options.deselect_button_id+"' style='display:block;margin-bottom:10px;'><<</button>");
        var column1 = $("<td class='"+this.options.class_td+"'></td>").append(select1);
        //var column2 = $("<td class='"+this.options.class_td+"' style='padding:20px;'></td>").append(button1).append(button2);
        var column2 = $("<td class='"+this.options.class_td+"' style='padding:20px;'></td>");
        var column3 = $("<td class='"+this.options.class_td+"'></td>").append(select2);
        var row2 = $("<tr></tr>").append(column1).append(column2).append(column3);

        var select_all_button = $("<button class='"+this.options.class_button+"' id='"+this.options.select_all_button_id+"' style='display:block;margin-bottom:10px;'>Select all "+this.options.type+"s</button>");
        var column1 = $("<td class='"+this.options.class_td+"'></td>").append(select_all_button);
        var column2 = $("<td></td>");
        var column3 = $("<td></td>");
        var row3 = $("<tr></tr>").append(column1).append(column2).append(column3);

        top_level_dom.append(row1).append(search_row).append(row2);

        if(this.options.show_select_all){
            top_level_dom.append(row3);
        }

        $("#"+this.options.main_div).html("").append(top_level_dom);
        var style = "<style>ul.assignment {border-color: #EEE; margin-left:0px;border-style: solid;border-width: 1px;  overflow-x: auto;overflow-y: scroll; display: block;   list-style : none;   color : #444; padding : 0px;background-color : white;}.list-style {background-color:#ECECEC;padding: 6px;margin: 0px;cursor: pointer;border-bottom: 1px #EEE solid;}";
        $("#"+this.options.main_div).append(style);

    }

    for(key in source1){
        this.add_item(this.options.select_field_id,key,source1[key]);
    }
    for(key in source2){
        this.add_item(this.options.deselect_field_id,key,source2[key]);
    }
};
Assignment.prototype.set_handlers = function(){
    if(this.options.style == "select"){
        $(document).on("click","#"+this.options.select_button_id,{instance:this},this.select_item);
        $(document).on("click","#"+this.options.deselect_button_id,{instance:this},this.deselect_item);
        if(this.options.show_select_all){
            $(document).on("click","#"+this.options.select_all_button_id,{instance:this},this.select_all);
        }
    }else if(this.options.style == "list"){
        $(document).on("click","#"+this.options.select_field_id+" li",{instance:this},this.select_item_list);
        $(document).on("click","#"+this.options.deselect_field_id+" li",{instance:this},this.deselect_item_list);
        if(this.options.show_select_all){
            $(document).on("click","#"+this.options.select_all_button_id,{instance:this},this.select_all_list);
        }
    }
    $(document).on(this.options.search_event,"#"+this.options.search_field_id,{},jQuery.proxy(this.filter_save_original,this));

};

Assignment.prototype.change_selection = function(from,to,select_all){
    var selector = "#"+from+" option:selected";
    if(typeof select_all !== undefined && select_all){
        var selector = "#"+from+" option";
    }
    var that = this;
    $(selector).each(function(){
        var id = $(this).attr("data-value");
        var display = $(this).html();
        that.add_item(to,id,display)
        $(this).slideUp('fast');
        $(this).remove();
    });
    if(this.options.callback == "form"){
        this.construct_form_element();
    }
};

Assignment.prototype.construct_form_element = function(){
    $("#"+this.options.form_element_container_id).remove();
    $("#"+this.options.main_div).append("<div id='"+this.options.form_element_container_id+"'></div>");
    var selected_items = {};
    if(this.options.style == "select"){
        $("#"+this.options.deselect_field_id+" option").each(function(){
            var id = $(this).attr("data-value");
            var display = $(this).html();
            selected_items[id] = display;
        });
    }else if(this.options.style == "list"){
        $("#"+this.options.deselect_field_id+" li").each(function(){
            var id = $(this).attr("data-value");
            var display = $(this).html();
            selected_items[id] = display;
        });
    }
    for(key in selected_items){
        $("#"+this.options.form_element_container_id).append("<input type='hidden' name='"+this.options.form_element_container_id+"[]' value='"+key+"'>");
    }
};

Assignment.prototype.change_selection_list = function(instance,selected_li,select_all){
    if(typeof select_all !== undefined && select_all){
        $("#"+this.options.select_field_id+" li").each(function(){
            var id = $(this).attr("data-value");
            var display = $(this).html();
            instance.add_item(instance.options.deselect_field_id,id,display);
            $(this).slideUp('fast');
            $(this).remove();
        });
        if(this.options.callback == "form"){
            this.construct_form_element();
        }
    }else{
        var id = $(selected_li).attr("data-value");
        var display = $(selected_li).html();
        var parent_id = $(selected_li).parent().attr("id");
        var add_to_id = this.options.select_field_id;
        if(parent_id == this.options.select_field_id){
            add_to_id = this.options.deselect_field_id;
        }
        instance.add_item(add_to_id,id,display);
        $(selected_li).slideUp('fast');
        $(selected_li).remove();
        if(this.options.callback == "form"){
            this.construct_form_element();
        }
    }
};


Assignment.prototype.select_item = function(event){
    event.preventDefault();
    var id_list = [];

    $("#"+event.data.instance.options.select_field_id+" option:selected").each(function(){
        id_list.push($(this).val());
    });
    if(event.data.instance.options.callback == "form" ){
        event.data.instance.change_selection(event.data.instance.options.select_field_id,event.data.instance.options.deselect_field_id);
    }
    else if(event.data.instance.options.callback == "ajax" ){
        var data = {action:event.data.instance.options.select_action,type:event.data.instance.options.type,main_id:event.data.instance.options.main_id,id_list:id_list};
        data = $.extend(data, event.data.instance.options.ajax_form_data);
        $.getJSON("ajax.php",data,function(data){
            var jsondata = jQuery.parseJSON(data);
            if(typeof jsondata !== "undefined" || jsondata === "undefined" || typeof jsondata['error'] === "undefined"){
                event.data.instance.change_selection(event.data.instance.options.select_field_id,event.data.instance.options.deselect_field_id);
                for (var key in id_list) {
                    if (id_list.hasOwnProperty(key)) {
                        delete event.data.instance.items[id_list[key]];
                    }
                }
        }
            else{
                event.data.instance.handle_error(jsondata['error']);
            }
        });
        //.error(that.handle_error('Internal Server Error'));
    }else{
        window[event.data.instance.options.callback]("assign",event.data.instance.options.type,event.data.instance.options.main_id,id_list);
        event.data.instance.change_selection(event.data.instance.options.select_field_id,event.data.instance.options.deselect_field_id);
    }
};

Assignment.prototype.deselect_item = function(event){
    event.preventDefault();
    var id_list = [];
    $("#"+event.data.instance.options.deselect_field_id+" option:selected").each(function(){
        id_list.push($(this).val());
    });
    if(event.data.instance.options.callback == "form" ){
        event.data.instance.change_selection(event.data.instance.options.deselect_field_id,event.data.instance.options.select_field_id);
    }else if(event.data.instance.options.callback == "ajax" ){
        var data = {action:event.data.instance.options.deselect_action,type:event.data.instance.options.type,main_id:event.data.instance.options.main_id,id_list:id_list};
        data = $.extend(data, event.data.instance.options.ajax_form_data);
        $.getJSON("ajax.php",data,function(data){
            var jsondata = jQuery.parseJSON(data);
            if(typeof jsondata !== "undefined" || jsondata === "undefined" || typeof jsondata['error'] === "undefined"){
                event.data.instance.change_selection(event.data.instance.options.deselect_field_id,event.data.instance.options.select_field_id);
                for (var key in id_list) {
                    event.data.instance.items[id_list[key]] = event.data.instance.item_cache[id_list[key]];
                }
            }
            else{
                event.data.instance.handle_error(jsondata['error']);
            }
        });
        //.error(that.handle_error('Internal Server Error'));
    }else{
        window[event.data.instance.options.callback]("deassign",event.data.instance.options.type,event.data.instance.options.main_id,id_list);
        event.data.instance.change_selection(event.data.instance.options.deselect_field_id,event.data.instance.options.select_field_id);
    }
};

Assignment.prototype.select_item_list = function(event){
    event.preventDefault();
    var id_list = [];
    id_list.push($(this).attr("data-value"));
    if(event.data.instance.options.callback == "form" ){
        event.data.instance.change_selection_list(event.data.instance,this);
    }else if(event.data.instance.options.callback == "ajax"){
        var data = {action:event.data.instance.options.select_action,type:event.data.instance.options.type,main_id:event.data.instance.options.main_id,id_list:id_list};
        data = $.extend(data, event.data.instance.options.ajax_form_data);
        $.getJSON("ajax.php",data,function(data){
            jsondata = jQuery.parseJSON(data);
            if(typeof jsondata !== "undefined" || jsondata === "undefined" || typeof jsondata['error'] === "undefined"){
                event.data.instance.change_selection_list(event.data.instance,this);
                for (var key in id_list) {
                    if (id_list.hasOwnProperty(key)) {
                        delete event.data.instance.items[id_list[key]];
                    }
                }
            }
            else{
                event.data.instance.handle_error(jsondata['error']);
            }
        });
        //.error(that.handle_error('Internal Server Error'));
    }else{
        window[event.data.instance.options.callback]("assign",event.data.instance.options.type,event.data.instance.options.main_id,id_list);
        event.data.instance.change_selection_list(event.data.instance,this);
    }
};

Assignment.prototype.deselect_item_list = function(event){
    event.preventDefault();
    var id_list = [];
    id_list.push($(this).attr("data-value"));
    if(event.data.instance.options.callback == "form" ){
        event.data.instance.change_selection_list(event.data.instance,this);
    }else if(event.data.instance.options.callback == "ajax"){
        var data = {action:event.data.instance.options.deselect_action,type:event.data.instance.options.type,main_id:event.data.instance.options.main_id,id_list:id_list};
        data = $.extend(data, event.data.instance.options.ajax_form_data);
        $.getJSON("ajax.php",data,function(data){
            jsondata = jQuery.parseJSON(data);
            if(typeof jsondata !== "undefined" || jsondata === "undefined" || typeof jsondata['error'] === "undefined"){
                event.data.instance.change_selection_list(event.data.instance,this);
            }
            else{
                event.data.instance.handle_error(jsondata['error']);
            }
        });
        //.error(that.handle_error('Internal Server Error'));
    }else{
        window[event.data.instance.options.callback]("deassign",event.data.instance.options.type,event.data.instance.options.main_id,id_list);
        event.data.instance.change_selection_list(event.data.instance,this);
    }
};

Assignment.prototype.select_all = function(event){
    event.preventDefault();
    var id_list = [];
    $("#"+event.data.instance.options.select_field_id+" option").each(function(){
        id_list.push($(this).val());
    });
    if(event.data.instance.options.callback == "form" ){
        event.data.instance.change_selection(event.data.instance.options.select_field_id,event.data.instance.options.deselect_field_id,true);
    }
    else if(event.data.instance.options.callback == "ajax" ){
        var data = {action:"select",type:this.options.type,main_id:this.options.main_id,id_list:id_list};
        data = $.extend(data, this.options.ajax_form_data);
        $.getJSON("ajax.php",data,function(data){
            var jsondata = jQuery.parseJSON(data);
            if(typeof jsondata !== "undefined" || jsondata === "undefined" || typeof jsondata['error'] === "undefined"){
                event.data.instance.change_selection(that.options.select_field_id,that.options.deselect_field_id,true);
            }
            else{
                event.data.instance.handle_error(jsondata['error']);
            }
        });
        //.error(that.handle_error('Internal Server Error'));
    }else{
        event.data.instance.options.callback("select",event.data.instance.options.type,event.data.instance.options.main_id,id_list);
        event.data.instance.change_selection(event.data.instance.options.select_field_id,event.data.instance.options.deselect_field_id,true);
    }
};

Assignment.prototype.select_all_list = function(event){
    event.preventDefault();
    var id_list = [];
    var subunit = "li";
    $("#"+event.data.instance.options.select_field_id+" "+subunit).each(function(){
        id_list.push($(this).val());
    });
    if(event.data.instance.options.callback == "form" ){
        event.data.instance.change_selection_list(event.data.instance,this,true);
    }else if(event.data.instance.options.callback == "ajax"){
        var data = {action:"select",type:event.data.instance.options.type,main_id:event.data.instance.options.main_id,id_list:id_list};
        data = $.extend(data, event.data.instance.options.ajax_form_data);
        $.getJSON("ajax.php",data,function(data){
            jsondata = jQuery.parseJSON(data);
            if(typeof jsondata !== "undefined" || jsondata === "undefined" || typeof jsondata['error'] === "undefined"){
                event.data.instance.change_selection_list(event.data.instance,this,true);
            }
            else{
                event.data.instance.handle_error(jsondata['error']);
            }
        });
        //.error(that.handle_error('Internal Server Error'));
    }else{
        event.data.instance.options.callback("deselect",event.data.instance.options.type,event.data.instance.options.main_id,id_list);
        event.data.instance.change_selection_list(event.data.instance,this,true);
    }
};

Assignment.prototype.filter_save_original = function(event){
    var value = "";
    var display = "";
    var that = this;
    var subunit = "option";
    var search = $("#"+this.options.search_field_id).val();

    if(this.options.style == "list"){
        subunit = "li";
    }
    if(typeof this.items === "undefined"){
        //put the current options in an object
        this.items = {};
        $("#"+this.options.select_field_id+" "+subunit).each(function(index){
            value = $(this).attr("data-value");
            display = $(this).html();
            that.items[value] = display;
        });
    }
    //put the items in the select box and then filter it
    value = "";
    $("#"+this.options.select_field_id).html("");

    for(value in this.items){
        if(this.items[value].toLowerCase().indexOf(search.toLowerCase()) != -1){
            this.add_item(this.options.select_field_id,value,this.items[value]);
        }
    }

}


Assignment.prototype.render_options = function (data){
    var content = "";
    for(key in data){
        content += "<option value='"+key+"'>"+data.key+"</option>";
    }
    return content;
}

$.fn['assignment'] = function ( arg1,arg2 ) {
    return this.each(function () {
        if (!$.data(this, 'plugin_assignment')) {
            var options = arg1;
            $.data(this, 'plugin_assignment', new Assignment( this, arg1 ));
        }else if(arg1 == "load_data"){
            var instance = $.data(this, 'plugin_assignment');
            var args = arg2;
            instance.load_data(arg2);
        }else if(arg1 == "delete_data"){
            var instance = $.data(this, 'plugin_assignment');
            instance.delete_data();
        }else if(arg1 == "set_main_id"){
            var instance = $.data(this, 'plugin_assignment');
            instance.set_main_id(arg2);
        }
    });
};
