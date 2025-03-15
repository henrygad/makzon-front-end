

type imageUser = {
    _id:  string,
    fieldname: string
    originalname: string
    encoding: string
    mimetype:  string
    destination: string
    filename: string
    path: string
    size: number
    upLoader: string
};


type mediaProps = {
    _id: string,
    url: string,
    mime: string,
    type: string
};

export default mediaProps;
