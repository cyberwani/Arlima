var ArlimaUtils = (function($, window, undefined) {

    var _this = {

        /**
         * Time on server (in milliseconds). Will be increased every second
         * @var {Number}
         */
        serverTime : 0,

        /**
         * @param {Number} time - Timestamp in milliseconds
         * @return {Boolean}
         */
        isFutureDate : function(time) {
            return time > this.serverTime;
        },

        /**
         * @param evt
         * @returns {Boolean}
         */
        hasMetaKeyPressed : function(evt) {
            return evt && (evt.ctrlKey || evt.metaKey);
        },

        /**
         * Do a console log
         * @param mess
         * @param method
         */
        log : function(mess, method) {
            if(method === undefined)
                method = 'log';

            if( method == 'log' && !ArlimaJS.devMode ) {
                return;
            }

            if('console' in window && typeof window.console[method] == 'function') {
                window.console[method](mess);
            }
        },

        /**
         * Make the arlima-postbox possible to collapse
         * @param $elem
         */
        makeCollapsing : function($elem, callback) {
            var isCollapsing = false;


            $elem.find('.collapse-toggle').click(function() {
                if( !isCollapsing ) {
                    isCollapsing = true;
                    var $inside = $elem.find('.inside');
                    if( $inside.is(':visible') ) {
                        $inside.slideUp('fast', function() {
                            isCollapsing = false;
                            if( typeof callback == 'function' )
                                callback();
                        });
                    } else {
                        $inside.slideDown('fast', function() {
                            isCollapsing = false;
                            if( typeof callback == 'function' )
                                callback();
                        });
                    }
                }
            });
        },

        /**
         * @param {jQuery} $select
         * @param {String} val
         * @param {Boolean} [triggerChange]
         */
        selectVal : function($select, val, triggerChange) {
            var $opt = $select.find('option[value="'+val+'"]');
            if( $opt.length == 0 ) {
                if( val != '' && val != 'aligncenter' ) { // legacy...
                    throw Error('Trying to set value ('+val+') for a select that does not exist');
                }
            } else {
                if( $select.val() != val ) {
                    $opt.get(0).selected = true;
                    if( triggerChange )
                        $select.trigger('change');
                }
            }
        },

        isImagePath : function(path) {
            if( !path )
                path = '';
            path = path.toLowerCase();
            var isImage = false;
            $.each(['.jpg', '.jpeg', '.gif', '.png'], function(i, extension) {
                if( path.indexOf(extension) > -1 ) {
                    isImage = true;
                    return false;
                }
            });
            return isImage;
        },

        /**
         * @return {ArlimaList|undefined}
         */
        getUnsavedListInFocus : function() {
            if( window.ArlimaArticleForm.article ) {
                // Save article being edited
                return window.ArlimaListContainer.list(ArlimaArticleForm.article.listID);
            }
            else if( ArlimaListContainer.lastTouchedList &&
                ArlimaListContainer.list(ArlimaListContainer.lastTouchedList) &&
                ArlimaListContainer.list(ArlimaListContainer.lastTouchedList).hasUnsavedChanges() ) {

                // get last touched list, if it's unsaved
                return ArlimaListContainer.list(ArlimaListContainer.lastTouchedList);
            }
            else {
                // Find any unsaved article
                var unsaved = [];
                $.each(ArlimaListContainer.lists, function(i, list) {
                    if( list.hasUnsavedChanges() )
                        unsaved.push(list);
                });

                if( unsaved.length == 1 )
                    return unsaved[0];
            }
        },

        /**
         * @param {ArlimaList|jQuery} listOrElement
         */
        shake : function(listOrElement) {
            if( 'hasUnsavedChanges' in listOrElement )
                listOrElement = listOrElement.$elem;

            try {
                listOrElement.effect("shake", { times:4, distance: 10 }, 500);
            } catch(e) {
                // Not supported by old wordpress
            }
        },

        makeDraggable : function($elem) {
            $elem.draggable({
                appendTo: 'body',
                helper:'clone',
                sender:'postlist',
                connectToSortable:'.article-list:not(.imported) .articles',
                revert:'invalid',
                start: function(event, ui) {
                    // ui.helper.html('<div class="article-title-container"><span>' + ui.helper.html() + '</span></div>');
                    ui.helper.addClass('article');
                    ui.helper.css('z-index', '99999');
                }
            });
        }
    };

    // Update server time every second
    var lastTime = new Date().getTime();
    setInterval(function() {
        var now = new Date().getTime();
        ArlimaUtils.serverTime += now - lastTime;
        lastTime = now;
    }, 1000);

    return _this;

})(jQuery, window);