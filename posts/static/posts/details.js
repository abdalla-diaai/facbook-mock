let backBtn = $('#back-btn');
let editBtn = $('#edit-btn');
let deleteBtn = $('#delete-btn');
let url = window.location.href + '/data'
let spinnerBox = $('.spinner-border');
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

            spinnerBox.addClass('visually-hidden');
        },
        error: function(error){
            console.log(error);
        }
    });