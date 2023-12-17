$(document).ready(function () {

    async function fetch_comments() {
        var host = window.location.origin;

        try {
            const res = await fetch(`${host}/comments`, {
                method: 'GET',
                headers: { "Content-type": "application/json" }
            });

            const e = $('#error');
            if (e.length) e.remove();

            if (res.status === 200 || res.status === 304) {
                const data = await res.json();

                $('#comments').remove();

                var table = $('<table>').attr('id', 'comments');
                var tableRow = $('<tr>');

                $('<th>').html('Name').appendTo(tableRow);
                $('<th>').html('Comment').appendTo(tableRow);
                $('<th>').html('Date').appendTo(tableRow);

                tableRow.appendTo(table);
                table.appendTo('body');

                for (var i = 0; i < data.length; i++) {
                    var commentRow = $('<tr>');
                    $('<td>').html(data[i].name).appendTo(commentRow);
                    $('<td>').html(data[i].comment).appendTo(commentRow);
                    $('<td>').html(format_timestamp(data[i].created_at)).appendTo(commentRow);
                    commentRow.appendTo(table);
                }
            } else { throw Error(JSON.stringify(await res.json()));}

        } catch (error) {
            console.log('Error:', JSON.parse(error.message));
            $('#error').remove();

            var message = $('<div>').addClass('errorBox').attr('id', 'error');
            $('<h1>').html('Error Occurred:').appendTo(message);
            $('<p>').html(JSON.parse(error.message).message).appendTo(message);

            message.appendTo('body');
        }
    }

    async function comment(e) {
        e.preventDefault();
        var host = window.location.origin;

        try {
            const res = await fetch(`${host}/comment`, {
                method: 'POST',
                body: JSON.stringify({"name": $('#name').val(), "comment": $('#comment').val()}),
                headers: { "Content-type": "application/json" }
            });
            await fetch_comments();
        } catch (error) { console.error('Error:', error); }
    }
    function format_timestamp(date){
        var options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', timeZoneName: 'short'};
        return new Intl.DateTimeFormat('en-US', options).format(new Date(date));
    }

    $(window).on('load', fetch_comments);
    $('#post').on('click', comment);
});