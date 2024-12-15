let backBtn = $('#back-btn');
let editBtn = $('#edit-btn');
let deleteBtn = $('#delete-btn');
let spinnerBox = $('.spinner-border');
const titleInput = $('#id_title');
const bodyInput = $('#id_body');

let url = window.location.href + '/data';
let deleteUrl = window.location.href + '/delete';
let updateUrl = window.location.href + '/update';

const updateForm = $('#update-form');
const deleteForm = $('#delete-form');

// function to get csrf tokens for ajax calls
const getCookie = (name) => {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

$('#back-btn').on('click', () => {
    console.log('click')
    history.back();
});

$.ajax({
        type: 'GET',
        url: url,
        success: function(response){
            const data = response.data

            if (data.logged_in === data.author) {
                editBtn.removeClass('visually-hidden');
                deleteBtn.removeClass('visually-hidden');
            }
            $('#id_title').val(data.title);
            bodyInput.val(data.body);
            spinnerBox.addClass('visually-hidden');
        },
        error: function(error){
            console.log(error);
        }
    });


$('#update-form').on('submit', e => {
    const csrftoken = getCookie('csrftoken');
    e.preventDefault();
    $.ajax({
        type: 'POST',
        url: updateUrl,
        data: {
            'csrfmiddlewaretoken': csrftoken,
            'title': titleInput.val(),
            'body': bodyInput.val(),
        },
        success: function(response){
            $('#addPostModal').modal('hide');
            location.reload();
        },
        error: function(error) {
            console.log(error);
        }
    });

})

$('#delete-form').on('submit', e => {
    const csrftoken = getCookie('csrftoken');
    e.preventDefault();
    $.ajax({
        type: 'POST',
        url: deleteUrl,
        data: {
            'csrfmiddlewaretoken': csrftoken,
        },
        success: function(response){
            $('#deleteModal').modal('hide');
            window.location.href = window.location.origin;
            location.reload();
        },
        error: function(error) {
            console.log(error);
        }
    });

})