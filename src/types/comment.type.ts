

type commentProps = {
    _id: string,
    postId: string,
    replyId: string | null,
    author: string,
    body: { _html: string, text: string },
    url_leading_to_comment_parent: string, 
    replyingTo: string[],
    likes: string[],   
    children?: commentProps[]
};

export default commentProps;