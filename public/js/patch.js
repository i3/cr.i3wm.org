// vim:ts=4:sw=4:expandtab
// © 2013 Michael Stapelberg (see also: LICENSE)

function displayComment(comment) {
    var td = $('#L' + comment.Line);
    var commentbox = $('<tr class="commentrow"><td class="line-number">&nbsp;</td><td><div style="float:left; margin-left: 0.25em">↳</div> <div class="comment"><div class="c-header"><strong class="c-author"></strong> says:</div><div style="float: right"><img class="c-gravatar" src="http://www.gravatar.com/avatar/?s=48&d=mm" border="0" alt="Gravatar" width="48" height="48"></div><div class="c-comment"></div><br style="clear: both"><div style="background-color: #f0eeea"><a href="#">Reply</a></div></div></td></tr>');
    commentbox.find('.c-author').text(comment.Author);
    commentbox.find('.c-gravatar').attr('src', 'http://www.gravatar.com/avatar/' + comment.EmailHash + '?s=48&d=mm');
    commentbox.find('.c-comment').text(comment.Comment);
    commentbox.find('a').click(function(e) {
        td.parent().find('pre').dblclick();
        return false;
    });
    var next = td.parent().nextUntil('.linerow');
    if (next.length == 0) {
        commentbox.insertAfter(td.parent());
    } else {
        commentbox.insertAfter(next.last());
    }
}

$(document).ready(function() {
    // Comments are POSTed to /patch/<nr>/comment
    var baseurl = document.location.href.match(/\/patch\/\d+/);
    if (baseurl === null) {
        /* This function was called while we are on the wrong page. */
        // TODO: error handling
        //console.log('script called on wrong page');
    }
    baseurl = baseurl[0];
    // baseurl now contains e.g. “/patch/2”

    // TODO: progress indicator
    var getcomments = function() {
        $.ajax({
            url: baseurl + "/comments.json",
            type: "GET",
        }).done(function(comments) {
            $.each(comments, function(idx, comment) {
                displayComment(comment);
            });
        }).fail(function() {
            setTimeout(getcomments, 5000);
        });
    };
    getcomments();
});
