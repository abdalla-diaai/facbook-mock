
let postsBox = $('#posts');
let loadBtn = $('#load-btn');
let spinnerBox = $('.spinner-border');
let loadMore = $('#load-more')
let visible = 3;

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
                                <a href="#" class="btn btn-primary">Details</a>
                            </div>
                        </div>
                    `);
                });

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

loadBtn.on('click', () => {
    spinnerBox.removeClass('visually-hidden');
    visible += 3;
    getData();
});

getData();
