
//Sprint 3

console.log("Still alive");
const apiUrl = 'https://project-1-api.herokuapp.com';

const newcomments = document.getElementById('commentList');
const commentForm = document.getElementById('form');

//add an event listener to the form submission
commentForm.addEventListener("submit", handleSubmit);

//function to get apikey
const apiKey = () => {
    axios
        .get(`${apiUrl}/register`)
        .then((response) => {
            const apiKey = response.data.api_key
            console.log(apiKey);
        })
        .catch((error) => console.log('error getting apikey'));
};

//function to get comments
const getComments = () => {
    axios
        .get(`${apiUrl}/comments?api_key=${apiKey}`)
        .then((response) => {
            const commentsArray = response.data;
            commentsArray.forEach((comment) => {
                addComment(comment);
            });
        })
        .catch((error) => console.log('error getting data comments:' + error));
};

//function to create each comment
function addComment(comment) {
    // create new elements
    const container = document.createElement('div');
    container.className = "section4_comment_box";
    container.id = comment.id;
    const image = document.createElement('p');
    image.className = "section4_userpicture section4user_picture2";

    const userForm = document.createElement('div');
    userForm.className = "section4_user_form";

    const userInfo = document.createElement('div');
    userInfo.className = "section4_user_info";

    const userName = document.createElement('h3');
    userName.className = "section4_user_name";
    userName.innerText = comment.name;

    const date = new Date(comment.timestamp);
    const userDates = document.createElement('p');
    userDates.className = "section4_user_date";
    userDates.innerText = date.toLocaleDateString();

    userInfo.appendChild(userName);
    userInfo.appendChild(userDates);
    userForm.appendChild(userInfo);

    const userComment = document.createElement('p');
    userComment.className = "section4_user_comment";
    userComment.innerText = comment.comment;

    userForm.appendChild(userComment);

    container.appendChild(image);
    container.appendChild(userForm);

    const commentLike = document.createElement('a');
    commentLike.className = "user__likes";
    commentLike.innerText = `${comment.likes} likes`;
    commentLike.addEventListener("click", (event) => {
        likeComment(event.target.parentNode.id);
    });
    container.appendChild(commentLike);

    const commentDelete = document.createElement('button');
    commentDelete.innerText = "Remove";
    commentDelete.addEventListener("click", (event) => {
        removeComment(event.target.parentNode.id);
    });
    container.appendChild(commentDelete);

    /*    const listEl = document.createElement('li');
        const userCommentEl = document.createElement('p');
        const userNameEl = document.createElement('h3');
        const userLikeEl = document.createElement('p');
        //attach the data to the elements
        userNameEl.innerText = name;
        userCommentEl.innerText = comment;
        userLikeEl.innerText = likes;
        //append the elements to their respective parents
        listEl.appendChild(userNameEl);
        listEl.appendChild(userCommentEl);
        listEl.appendChild(userLikeEl);
        commentList.appendChild(listEl);*/
    newcomments.insertBefore(container, newcomments.firstChild);

    const divider = document.createElement('hr');
    divider.className = "line";
    container.appendChild(divider);
}

//submit the form and add the comment to the list
function handleSubmit(event) {
    event.preventDefault();
    const user = event.target.user.value;
    const commentText = event.target.commentText.value;

    const newComment = {
        name: user, // => name: user
        comment: commentText // => commentText: commentText
    };
    axios
        .post(`${apiUrl}/comments?api_key=${apiKey}`, newComment, {
                headers: {
                    'Content-Type': 'application/json',
                }
            }
        )
        .then((response) => {
            console.log('HTTP STATUS CODE: ', response.status);

            //after comment has posted, getComments again.
            getComments();
        })
        .catch((error) => console.log(error));

    //reset the form
    commentForm.reset();
}

//Like implementation for comments.
function likeComment(id) {
    if (id !== undefined) {
        axios
            .put(`${apiUrl}/comments/${id}/like?api_key=${apiKey}`)
            .then((response) => {
                if (response.status === 200) {
                    document.getElementById(id).querySelector(".user__likes").innerText = response.data.likes + " likes";
                } else {
                    console.log(`Error trying to like commentId: ${id} status:${response.status} - ${response}`);
                }
            })
            .catch((error) => console.log(`error for like comment ${id}:` + error));
    }
}

//Remove comment.
function removeComment(id) {
    if (id !== undefined) {
        axios
            .delete(`${apiUrl}/comments/${id}?api_key=${apiKey}`)
            .then((response) => {
                if (response.status === 200) {
                    document.getElementById(id).remove();
                } else {
                    console.log(`Error removing commentId: ${id} status:${response.status} - ${response}`);
                }
            })
            .catch((error) => console.log(`error for like comment ${id}:` + error));
    }
}

//initial call to get comments  when first loaded.
getComments();