(function($) {
    var Buttonize = function(element, options) {
        this.element = $(element);

        this.config = $.extend({
            a11y: false,
            a11yText: 'Cliquer pour ouvrir',
            unbuttonize: false,
            toTag: '',
            customGlobalClasses: {}
        }, options || {});

        this.classes = $.extend({
            active: 'is-active',
            open: 'is-open',
            hover: 'is-hover',
            clicked: 'is-clicked',
            extern: 'is-external',
            error: 'is-error'
        }, (window.classes !== undefined ? window.classes : this.config.customGlobalClasses) || {});

        this.init();
    };

    $.extend(Buttonize.prototype, {

        // Component initialization
        init: function() {
            var tagHtml = this.element.html(),
                tagAttr = this.getAttributes(this.element[0]),
                tagAria = this.config.a11y ? ' aria-live="polite"' : '',
                tagA11yText = this.config.a11y ? '<span class="visuallyhidden">' + this.config.a11yText + '</span>' : '',
                button = '<button ' + tagAttr.join(' ') + tagAria + '>' + tagHtml + tagA11yText + '</button>';

            if (this.config.unbuttonize) {
                button = '<' + this.config.toTag + ' ' + tagAttr.join(' ') + '>' + tagHtml + '</' + this.config.toTag + '>';
            }

            this.element.replaceWith(button);
            return $(button);
        },
        getAttributes: function(element) {
            var self = this;

            return $.map(element.attributes, function(atrb) {
                var _atrb,
                    name = atrb.name || atrb.nodeName,
                    value = $(element).attr(name),
                    hregRegEx = /href|data-href/gi;

                if (value === undefined || value === false) return;

                _atrb = name + '="' + value + '"';
                if (self.config.unbuttonize) {
                    atrb = _atrb.match(hregRegEx) ? _atrb = _atrb.replace(hregRegEx, 'href') : _atrb;
                } else {
                    atrb = _atrb.match(hregRegEx) ? _atrb = _atrb.replace(hregRegEx, 'data-href') : _atrb;
                }

                return atrb;
            });
        }

    });

    $.fn.buttonize = function(options) {
        return this.each(function() {
            var element = $(this);

            // Return early if this element already has a plugin instance
            if (element.data('buttonize')) return;

            // pass options to plugin constructor
            var buttonize = new Buttonize(this, options);

            // Store plugin object in this element's data
            element.data('buttonize', buttonize);
        });
    };
})(jQuery);
