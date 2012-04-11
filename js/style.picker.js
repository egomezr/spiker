(function($) {
    jQuery.fn.spicker = function() {
        replace(arguments[0] || {});

        for (var i = 0; i < this.length; i++) {
            var elem = $(this[i]);
            if (elem.is("div") || elem.is("span")) {
                buildStylePicker(elem);
            }
        }
    };

    var buildStylePicker = function(elem) {
        var div = createDiv(elem);
        elem.append(div);
        appendIcons(div, elem);
    };

    var appendIcons = function(div, elem) {
        var icons = defaultOptions.styles.split(COMMA);
        for (var i = 0; i < icons.length; i++) {
            var icon = buildIcon(icons[i], elem);
            $(div).append(icon);

            if (icons[i] == COLOR_TARGET) {
                applyColorPicker("#" + $(icon).attr("id"), defaultOptions.target);
            }

            try {
                defaultOptions.tooltipicon($(icon).attr("id"));
            } catch(e) {
            }
        }

        $(div).css("width", (icons.length * (ICON_WIDTH + 1)) + "px");
    };

    var buildIcon = function(icon, elem) {
        var div = document.createElement("DIV");

        $(div).html("&nbsp;");
        $(div).css("float", 'left');
        $(div).css("left", 0);
        $(div).css("top", 0);
        $(div).css("width", ICON_WIDTH);
        $(div).css("height", ICON_HEIGHT);
        $(div).css("cursor", "pointer");
        $(div).css("border-right", "1px solid #CCC");
        $(div).attr("id", new String(new Date().getTime()) + icon);
        $(div).attr("title", retriveIconTitle(icon));
        $(div).css("z-index", "999999");
        $(div).css("background", "url(" + defaultOptions.imagesfolder + retrieveIcon(icon, div) + ") no-repeat center center");

        $(div).click(function() {
            executeAction(icon, elem);
        });

        return div;
    };

    var retriveIconTitle = function(icon) {
        switch (icon) {
            case BOLD :
                return defaultOptions.tbold;
                break;
            case ITALIC :
                return defaultOptions.titalic;
                break;
            case UNDER :
                return defaultOptions.tunder;
                break;
            case COLOR :
                return defaultOptions.tcolorpicker;
                break;
            case FONT_DOWN :
                return defaultOptions.tfontdown;
                break;
            case FONT_UP :
                return defaultOptions.tfontup;
                break;
        }
    };

    var executeAction = function (icon, elem) {
        try {
            defaultOptions.beforeapply($(defaultOptions.target), icon);
        } catch(e) {
        }

        switch (icon) {
            case BOLD :
                $(defaultOptions.target).css("font-weight", $(defaultOptions.target).css("font-weight") == 'bold' ? "normal" : "bold");
                break;
            case ITALIC :
                $(defaultOptions.target).css("font-style", $(defaultOptions.target).css("font-style") == 'italic' ? "normal" : "italic");
                break;
            case UNDER :
                $(defaultOptions.target).css("text-decoration", $(defaultOptions.target).css("text-decoration") == 'underline' ? "none" : "underline");
                break;
            case FONT_DOWN :
                $(defaultOptions.target).css("font-size", (parseInt($(defaultOptions.target).css("font-size").replace("px", "")) - 3) + "px");
                break;
            case FONT_UP :
                $(defaultOptions.target).css("font-size", (parseInt($(defaultOptions.target).css("font-size").replace("px", "")) + 3) + "px");
                break;
        }

        try {
            defaultOptions.afterapply($(defaultOptions.target), icon);
        } catch(e) {
        }
    };

    var retrieveIcon = function(icon, idiv) {
        switch (icon) {
            case BOLD :
                return "bold.png";
                break;
            case ITALIC :
                return "italic.png";
                break;
            case UNDER :
                return "underline.png";
                break;
            case COLOR :
                return "color_picker.png";
                break;
            case FONT_DOWN :
                return "font_down.png";
                break;
            case FONT_UP :
                return "font_up.png";
                break;
        }
    };

    var createDiv = function(elem) {
        var div = document.createElement("DIV");

        $(div).css("position", 'absolute');
        $(div).css("left", "0px");
        $(div).css("top", "-25px");
        $(div).css("opacity", defaultOptions.opacity);
        $(div).css("background-color", "#f7f6f6");
        $(div).css("z-index", "999999");
        $(div).attr("id", "spiker" + elem.attr("id"));

        $(div).mouseenter(
                function() {
                    $(div).css("opacity", 1);
                }).mouseleave(function() {
                    $(div).css("opacity", defaultOptions.opacity);
                });

        return div;
    };

    var replace = function(args) {
        if (args.target != null) defaultOptions.target = args.target;
        if (args.tooltipicon != null) defaultOptions.tooltipicon = args.tooltipicon;
        if (args.tbold != null) defaultOptions.tbold = args.tbold;
        if (args.titalic!= null) defaultOptions.titalic = args.titalic;
        if (args.tunder != null) defaultOptions.tunder = args.tunder;
        if (args.tfontdown != null) defaultOptions.tfontdown = args.tfontdown;
        if (args.tfontup != null) defaultOptions.tfontup = args.tfontup;
        if (args.tcolorpicker != null) defaultOptions.tcolorpicker = args.tcolorpicker;
    };

    var defaultOptions = {
        'styles': 'c,fu,fd,b,i,u',
        'opacity': .3,
        'imagesfolder': 'images/',
        'tbold': 'Bold',
        'titalic': 'Italic',
        'tunder': 'Underline',
        'tfontup': 'Increase Font',
        'tfontdown': 'Decrease Font',
        'tcolorpicker': 'Apply Color',
        'target': '',
        'afterapply': function(elem, style) {

        },
        'beforeapply': function(elem, style) {

        },
        'tooltipicon': function(icon) {

        }
    };

    var COMMA = ",";
    var ICON_WIDTH = 20;
    var ICON_HEIGHT = 20;
    var OFFSET = 5;

    var UNDER = 'u';
    var BOLD = 'b';
    var ITALIC = 'i';
    var COLOR = 'c';
    var FONT_UP = 'fu';
    var FONT_DOWN = 'fd';

    var COLOR_TARGET = 'c';

    var applyColorPicker = function(icon, targetformat) {
        var col = $(targetformat).css('color');
        col = (col.indexOf("rgb") > -1) ? rgbToHex(col) : col;

        $(icon).ColorPicker({
                    color: col,
                    onChange: function (hsb, hex, rgb) {
                        $(targetformat).css('color', '#' + hex);
                    }
                });
    }
	
	var hexDigits = new Array
        ("0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f");
	//Function to convert hex format to a rgb color
	function rgbToHex(rgb) {
		rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
		return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
	}
	function hex(x) {
		return isNaN(x) ? "00" : hexDigits[(x - x % 16) / 16] + hexDigits[x % 16];
	}
})(jQuery);