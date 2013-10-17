(function ($) {
    var cpt = -1;
    var prefixes = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
    function getId() {
        var id = "";
        var index = (Math.floor(cpt / prefixes.length));
        if (index > 0) {
            id += prefixes[index - 1];
        }
        return id + prefixes[(cpt - (index * prefixes.length))];
    }
    var methods = {
        init: function (options) {
            cpt++;
            var $collection = $(this);
            var settings = $.extend(true, {
                prefix: getId(),
                buttons: {
                    first: {
                        visible: false,
                        text: "Première page",
                        cssClass: null
                    },
                    prev: {
                        visible: true,
                        text: "Page précédente",
                        cssClass: null
                    },
                    next: {
                        visible: true,
                        text: "Page suivante",
                        cssClass: null
                    },
                    last: {
                        visible: false,
                        text: "Dernière page",
                        cssClass: null
                    }
                },
                nbItems: 2,
                dynamic: false
            }, options);
            // Précaution pour les calculs
            settings.nbItems = parseInt(settings.nbItems);

            var nbPages = Math.ceil($collection.length / settings.nbItems);
            if (nbPages == 1) {
                return false;
            }
            var $pager = $("<div id='pager" + settings.prefix + "' class='pager'><ul class='pages'></ul></div>");

            var $buttons = {
                first: $("<a class='first" + (settings.buttons.first.cssClass ? " " + settings.buttons.first.cssClass : "") + "'>" + settings.buttons.first.text + "</a>"),
                prev: $("<a class='prev" + (settings.buttons.prev.cssClass ? " " + settings.buttons.prev.cssClass : "") + "'>" + settings.buttons.prev.text + "</a>"),
                next: $("<a class='next" + (settings.buttons.next.cssClass ? " " + settings.buttons.next.cssClass : "") + "'>" + settings.buttons.next.text + "</a>"),
                last: $("<a class='last" + (settings.buttons.last.cssClass ? " " + settings.buttons.last.cssClass : "") + "'>" + settings.buttons.last.text + "</a>")
            };
            if (settings.buttons.prev.visible) {
                $pager.prepend($buttons.prev);
            }
            if (settings.buttons.first.visible) {
                $pager.prepend($buttons.first);
            }
            if (settings.buttons.next.visible) {
                $pager.append($buttons.next);
            }
            if (settings.buttons.last.visible) {
                $pager.append($buttons.last);
            }

            $pager.bind("click", function (e) {
                var target = (typeof e.target != 'undefined') ? e.target : e.srcElement;
                if (target.className.match("disabled") || target.tagName == "UL" || target.className.match("pager")) {
                    return false;
                }

                var current = $indexes.find("li").index($pager.find(".current"));

                // First page
                // ------------------------------------------------------------------------------------
                if (target.className.match("first")) {
                    $pager.find("a.page").first().click();
                    // Last page
                    // ------------------------------------------------------------------------------------
                } else if (target.className.match("last")) {
                    $pager.find("a.page").last().click();
                    // Prev page
                    // ------------------------------------------------------------------------------------
                } else if (target.className.match("prev")) {
                    if (current > 0) {
                        $pager.find(".current").prev("li").find("a").trigger("click");
                    }
                    // Next page
                    // ------------------------------------------------------------------------------------
                } else if (target.className.match("next")) {
                    if (index < nbPages - 1) {
                        $pager.find(".current").next("li").find("a").trigger("click");
                    }
                    // Index de page
                    // ------------------------------------------------------------------------------------
                } else if (target.className.match("page")) {
                    index = $indexes.find("li").index($(target).parent());
                    if ($pager.find("li").index($pager.find(".current")) != index) {
                        $pager.find(".current").removeClass("current");
                        $(target).parent().addClass("current");
                        window.location.hash = $(target).attr("href");
                    } else {
                        index = null;
                    }
                }
                // Traitement
                // ------------------------------------------------------------------------------------
                if (index != null) {
                    if (index == 0) {
                        $buttons.prev.addClass("disabled");
                        $buttons.first.addClass("disabled");
                    } else {
                        $buttons.prev.removeClass("disabled");
                        $buttons.first.removeClass("disabled");
                    }
                    if (index == nbPages - 1) {
                        $buttons.next.addClass("disabled");
                        $buttons.last.addClass("disabled");
                    } else {
                        $buttons.next.removeClass("disabled");
                        $buttons.last.removeClass("disabled");
                    }
                    $collection.hide();
                    var start = ((index * settings.nbItems));
                    var end = ((index * settings.nbItems) + settings.nbItems);
                    $collection.filter(function (itemIndex) {
                        if (itemIndex >= start && itemIndex < end) {
                            return true;
                        }
                    }).show();
                }

            });
            var $indexes = $pager.find("ul");
            for (var i = 0; i < nbPages; i++) {
                $indexes.append($("<li><a  href='#" + settings.prefix + (i + 1) + "' class='page'>" + (i + 1) + "</a></li>"));
            }

            $collection.last().after($("<div class='pagerContainer' />").append($pager));
            /*$pager.css({
            position: "absolute",
            top: 0,
            left: "50%",
            width: Math.ceil($pager.width() + 1),
            "margin-left": "-" + Math.ceil($pager.width() / 2) + "px"
            });*/
            /* Event listener sur le changement du hash tag */
            /* Historique des changements de pages */
            $(window).bind('hashchange.' + settings.prefix, function () {
                var regex = new RegExp(eval("/" + settings.prefix + "([0-9]+)/gim"));
                var result = location.hash.match(regex);
                if (result) {
                    $pager.find("li:not('.current') a[href='#" + result[0] + "']").trigger("click");
                } else {
                    $pager.find("li:first").find("a").trigger("click");
                }
            });
            $(window).trigger("hashchange." + settings.prefix);


            /* Dynamic */
            /* TODO : http://www.bennadel.com/blog/1623-Ask-Ben-Detecting-When-DOM-Elements-Have-Been-Removed-With-jQuery.htm */
            if (settings.dynamic) {
                $collection.parent().bind("DOMNodeRemoved", function () {

                });
                $collection.parent().bind("DOMNodeInserted", function () {

                });
            }
            return this.each(function () {

            });

        },
        destroy: function () {
            var id = getId();
            if ($("#pager" + id))
                $("#pager" + id).parent().remove();
            $(window).unbind("hashchange." + id);
        },
        pagerId: function () {
            var id = getId();
            return "pager" + id;
        }
    };

    $.fn.pager = function (method) {
        // Method calling logic
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' + method + ' does not exist on jQuery.pager');
        }
    }
})(jQuery);