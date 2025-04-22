
type notificationProps = {
    _id?: string
    type: string
    message: string
    options?: unknown
    url: string
    from: string
    to: string
    checked: boolean
    targetTitle?: string
    similar?: notificationProps[]
};

export default notificationProps;
