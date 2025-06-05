const useDateFormat = () => {
    const formatDate = (timestamp: string): string => {
        const now = new Date();
        const createdDate = new Date(timestamp);
        const diffInMs = now.getTime() - createdDate.getTime();
        const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

        if (!diffInDays) {
            return "";
        }

        // add minute and hour checks
        const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
        const diffInMinutes = Math.floor(diffInMs / (1000 * 60));

        if (diffInHours < 1) {
            if (diffInMinutes < 1) return "Just now";
            if (diffInMinutes === 1) return "1 minute ago";
            return `${diffInMinutes} minutes ago`;
        }

        // add days checks
        if (diffInDays <= 3) {
            if (diffInDays === 0) return "Today";
            if (diffInDays === 1) return "1 day ago";
            return `${diffInDays} days ago`;
        }

        // return a data Format as day number, month letters and year number (e.g 2 Jan 2025)
        

        return createdDate.toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short", // gives "Jan", "Feb", etc.
            year: "numeric",
        });
    };

    return formatDate;
};

export default useDateFormat;
