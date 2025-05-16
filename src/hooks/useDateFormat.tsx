const useDateFormat = () => {


    const formatDate = (timestamp: string): string => {

        const oldDate: Date = new Date(timestamp);
        const nowDate: Date = new Date();

        const difInSeconds = Math.floor((nowDate.getTime() - oldDate.getTime()) / 1000);
        const difInMinutes = Math.floor(difInSeconds / 60);
        const difInHours = Math.floor(difInMinutes / 60);
        const days = Math.floor(difInHours / 24);

        // Format time (HH:mm AM/PM)
        const timeStr = oldDate.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        });

        if (days === 0) {
            return `${timeStr} Today`;
        } else if (days === 1) {
            return `${timeStr} Yesterday`;
        } else if (days <= 3) {
            return `${timeStr} ${days} days ago`;
        } else {
            return oldDate.toLocaleDateString("en-GB");
        }
    };

    return formatDate;
};

export default useDateFormat;
