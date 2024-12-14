
let postsBox = $('#posts');
let loadBtn = $('#load-btn');
let spinnerBox = $('.spinner-border');
let loadMore = $('#load-more');
let postForm = $('#post-form');
let title = $('#id_title');
let body = $('#id_body');
let alert = $('#alert-box');
let url = window.location.href
let visible = 3;

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

// function to like and unlike posts
const likeUnlikePosts = () => {
    const csrftoken = getCookie('csrftoken');

    const likeUnlike = [...$('.like-unlike')];
    likeUnlike.forEach(form => form.addEventListener('submit', e => {
        e.preventDefault();
        const clickedId = e.target.getAttribute('data-form-id');
        const clickedBtn = $(`#like-unlike-${clickedId}`);
        console.log(clickedBtn)
        console.log(clickedId)

        $.ajax({
            type: 'POST',
            url: '/like_unlike_post/',
            data: {
                'csrfmiddlewaretoken': csrftoken,
                'pk': clickedId,
            },
            success: function(response){
                clickedBtn.text(response.liked ? `Unlike (${response.count})`: `like (${response.count})`);
                console.log(response);
            },
            error: function(error) {
                console.log(error)
            }
        })
    }));
};

// function to get posts from database
const getData = () => {
    $.ajax({
        type: 'GET',
        url: `/load_posts/${visible}/`,
        success: function (response) {
            console.log('success', response);
            const data = response.data;
            setTimeout(() => {
                spinnerBox.addClass('visually-hidden');
                data.forEach(element => {
                    // Append the post content directly
                    postsBox.append(`
                        <div class="post">
                            <h3>${element.title}</h3>
                            <p><b>${element.body}</b></p>
                        </div>
                        <div class="card mb-2" style="width: 18rem;">
                            <img src="..." class="card-img-top" alt="...">
                            <div class="card-body">
                                <h5 class="card-title">${element.title}</h5>
                                <p class="card-text">${element.body}.</p>
                                <a href="${url}${element.id}" class="btn btn-primary">Details</a>
                                <form class="like-unlike" data-form-id="${element.id}">
                                    <button href="#" class="btn btn-primary" id="like-unlike-${element.id}">
                                    ${element.liked ? `unlike (${element.count})`: `like (${element.count})`}
                                    </button>
                                </form>
                            </div>
                        </div>
                    `);
                });
                likeUnlikePosts()
            }, 100);
            if (response.size == 0) {
                loadMore.text("no posts to show")
            } else if (response.size <= visible) {
                loadBtn.addClass('visually-hidden')
                loadMore.text("no more posts to load")
            }
        },
        error: function (error) {
            console.log('error', error);
        }
    });
}

// function to load more posts
loadBtn.on('click', () => {
    spinnerBox.removeClass('visually-hidden');
    visible += 3;
    getData();
});

// function to add new post
postForm.on('submit', e => {
    const csrftoken = getCookie('csrftoken');
    e.preventDefault();
    $.ajax({
        type: 'POST',
        url: '',
        data: {
            'csrfmiddlewaretoken': csrftoken,
            'title': title.val(),
            'body': body.val(),
        },
        success: function(response){
            $('#addPostModal').modal('hide');
            location.reload();
            handleAlerts('success', 'New post created!');
            postForm.reset();
        },
        error: function(error) {
            console.log(error);
            handleAlerts('danger', 'Something went wrong!');

        }
    });
});


getData();

