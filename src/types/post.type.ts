
type postProps = {
    _id?: string,
    publishedId?: string,
    image: string,
    author?: string,
    title?:  string,
    body: string,
    _html: { title: string, body: string },
    catigories: string[],
    mentions?: string[],
    slug?: string,
    url?: string,
    likes?: string[],
    views?: string[],
    shares?: string[],
    status: string,
    updatedAt?: string,
    createdAt?: string,
};

export default postProps;