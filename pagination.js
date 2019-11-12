/// created by hamed abdollahi
/// v 1.0

(function ($) {

    $.fn.pagination = function (options) {

        var self = this;

        var defaults = {
            tableId : 'table',
            refresh: false,
            numberPerPage: 10,
            numberOfDisplayedPage: 7,
            numberOfRecords: 1,
            onClick: function (pageIndex, event) {

            }
        };

        var settings = $.extend({}, defaults, options);

        var o = settings.refresh == true ? undefined : $('#' + settings.tableId).data('info');

        var numberOfPages = 0,
            currentPage = o == undefined ? 1 : parseInt(o.currentPage),
            pageList = o == undefined ? [] : o.pageList,
            status = o == undefined ? '' : o.status

        var makeList = function () {
            numberOfPages = getNumberOfPages();
        }

        var getNumberOfPages = function () {
            return Math.ceil(settings.numberOfRecords / settings.numberPerPage);
        }

        var nextPage = function () {
            if (currentPage >= settings.numberOfPages)
                return false;

            currentPage += 1;
            pClick(currentPage, '');
        }

        var previousPage = function () {
            if (currentPage == 1)
                return false;

            currentPage -= 1;
            pClick(currentPage, 'P');
        }

        var firstPage = function () {
            currentPage = 1;
            pClick(currentPage, '');
        }

        var lastPage = function () {
            if  (currentPage >= numberOfPages)
                return false;
            currentPage = numberOfPages;
            pClick(currentPage, 'L');

        }

        var loadList = function () {

            var begin, end

            if (pageList.indexOf(parseInt(currentPage)) > 0 && status != 'L') {
                begin = parseInt(pageList[0]);
                end = parseInt(pageList[pageList.length - 1])

            }
            else {


                begin = parseInt(currentPage) == numberOfPages ? (numberOfPages + 1) - Math.min(numberOfPages, settings.numberOfDisplayedPage) : parseInt(currentPage)
                end = Math.min(begin + parseInt(settings.numberOfDisplayedPage - 1), numberOfPages)
            }

            end = (numberOfPages - end == 1) ? numberOfPages : end;

            pageList = [];
            for (var i = begin ; i <= end; i++) {
                pageList.push(i);
            }

            drawList();
            check();
        }

        var drawList = function () {

            currentPage = status == 'L' ? numberOfPages : currentPage;

            var html =
                            '<ul style="list-style: none" id="list">' +
                                '<li> <a href="javascript:void(0)" id="first"><i class="fa fa-angle-left"></i></a></li>' +
                                '<li id="st"><a href="javascript:void(0)" id="previous"><i class="fa fa-angle-double-left"></i></a></li>';


            for (r = 0; r < pageList.length; r++) {
                html += String.format('<li><a class="aa" href="javascript:void(0)" ind="{0}">{0}</a></li>', pageList[r], r + 1);
            }

            html += '<li id="en"><a href="javascript:void(0)" id="next"><i class="fa fa-angle-double-right"></i></a></li>' +
                    '<li><a href="javascript:void(0)" id="last"><i class="fa fa-angle-right"></i></a></li>' +
      String.format('<li><a style="padding: 3px;"><input id="pageNumber" type="text" style="width: 50px;direction: ltr;" onkeyup = "OnlyNumeric(this)" value="{0}"></a></li>',currentPage) +
                    '<li><a id="goTo"><i class="fa fa-arrow-circle-right"></i></a></li>' +
                    '</ul>';


            html += String.format('<div style="float:right">تعداد {0} رکورد از {1} </div>', Math.min(settings.numberOfRecords, currentPage * settings.numberPerPage), settings.numberOfRecords);

            if (settings.numberOfRecords == 0)
                html = '<div style="border: 1px solid #ddd;padding: 6px;">رکوردی یافت نشد</div>'


            $(self).html(html)

            $('#first').click(function () {
                firstPage();
            })
            $('#previous').click(function () {
                previousPage();
            })

            $('#next').click(function () {
                nextPage();
            })
            $('#last').click(function () {
                lastPage();
            })

            $('#goTo').click(function (event) {

                var ind = $('#pageNumber').val();

                if (ind == '') return;

                pClick(ind, '');
            })

            $('#pageNumber').keydown(function (event) {

                var ind = this.value;

                if (event.keyCode == 13) {

                    pClick(ind, '');
                }
            })

            $('#pageNumber').keyup(function () {

                maxLengthCheck(this)

            })

            $('.aa').click(function (event) {

                var ind = $(this).attr('ind');

                pClick(ind, '');
            })

            var h = currentPage == undefined ? 1 : currentPage;

            $('#list li a.aa').removeClass('active-a')
            $('#list li a.aa[ind=' + h + ']').addClass('active-a')

        }

        var maxLengthCheck = function (object)
        {
            
            if (object.value > numberOfPages)
                object.value = numberOfPages
        }

        var pClick = function (ind, status) {

            var info = {

                currentPage: ind,
                pageList: pageList,
                status: status

            }

            $('#' + settings.tableId).data('info',info)
            settings.onClick(ind, settings.numberPerPage, event);

        }

        var check = function () {

            currentPage == 1 ? $("#first").addClass('disabled') : $("#first").removeClass('disabled')
            currentPage == 1 ? $("#previous").addClass('disabled') : $("#previous").removeClass('disabled')

            currentPage >= numberOfPages ? $("#next").addClass('disabled') : $("#next").removeClass('disabled')
            currentPage == numberOfPages ? $("#last").addClass('disabled') : $("#last").removeClass('disabled')
        }

        this.load = function () {
            makeList();
            loadList();
        }

        return this.load();

    }

}($));