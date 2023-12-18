async function fetch_comments() {
    var host = window.location.origin;
    const commentsContainer = $('#comments');

    // Check if the comments container is already showing the loading state
    if (commentsContainer.text().trim().toLowerCase() === 'loading...') {
        return;
    }

    commentsContainer.fadeOut('fast', function() {
        commentsContainer.text('Loading...');
    });

    try {
        const res = await fetch(`${host}/comments`, {
            method: 'GET',
            headers: { "Content-type": "application/json" }
        });

        if ($('#error').length) $('#error').remove();

        if (res.ok) {
            const data = await res.json();
            if (!data.length) {
                commentsContainer.text('No comments yet. Get the conversation started!');
            } else {
                // Use fadeIn after updating content
                commentsContainer.html(data.map(
                    comment => `<div class="comment">
                                    <div class="pic"><i class="fa fa-user-circle"></i></div>
                                    <div class="content">
                                        <div class="header">
                                            <div class="name"><a href="#">@${comment.name.toLowerCase()}</a></div>
                                            <div class="timestamp">${format_timestamp(comment.created_at)}</div>
                                        </div>
                                        <div class="text">${comment.comment}</div>
                                    </div>
                                </div>`).reverse().join('')).fadeIn('fast');
            }
        } else {
            throw new Error(`Error: ${res.status} - ${await res.text()}`);
        }

    } catch (error) {
        console.log('Error:', error);
        $('#error').remove();

        var message = $('<div>').addClass('errorBox').attr('id', 'error');
        $('<h1>').html('Error Occurred:').appendTo(message);
        $('<p>').html(error.message).appendTo(message);

        commentsContainer.appendTo(message).fadeIn('fast');
    }
}



async function comment(e) {
    e.preventDefault();
    var host = window.location.origin;
    var name = $('#username').val().replace(/\s/g, ''), comment = $('#comment').val();

    const form = document.getElementById('post');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    if(!name || !comment) return;
    try {
        const res = await fetch(`${host}/comment`, {
            method: 'POST',
            body: JSON.stringify({"name": name, "comment": comment}),
            headers: { "Content-type": "application/json" }
        });
        await fetch_comments();
        $('#username').val('');
        $('#comment').val('');
        $.notify("Comment posted successfully.", "success");
    } catch (error) {
        console.error('Error:', error);
    }
}

function format_timestamp(date) {
    const c_date = new Date(date), today = new Date();
    if (c_date.getDate() === today.getDate() && c_date.getMonth() === today.getMonth() && c_date.getFullYear() === today.getFullYear()){ return new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: 'numeric', hour12:true}).format(c_date);} 
    else return dateString = new Intl.DateTimeFormat('en-US', { month: 'numeric', day: 'numeric', year: '2-digit'}).format(c_date);
}
$('#comment').on('input', function() {
    $('#submit').css('display', $(this).val().trim() !== '' ? 'block' : 'none');
});

$('#submit').on('click', comment);

$('#comment').on('keypress', function(e) {
    if (e.which === 13 && !e.shiftKey) {
        comment(e);
    }
});

$('#username').on('input', e =>{
    setTimeout(() => {$(e.target).val($(e.target).val().replace(/\s/g, ''))}, 500);
});

$('#comment').on('input', function() {
    $(this).css('height', 'auto');
    $(this).height(Math.max(this.scrollHeight, parseInt($(this).css('min-height'))));
});


$(window).on('load', fetch_comments);
