let backBtn = $('#back-btn');
let editBtn = $('#edit-btn');
let deleteBtn = $('#delete-btn');

$('#back-btn').on('click', () => {
    console.log('click')
    history.back();
});