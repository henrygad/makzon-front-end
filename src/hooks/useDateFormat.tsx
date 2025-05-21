const useDateFormat = () => {
    const formatDate = (timestamp: string): string => {
        const now = new Date();
        const createdDate = new Date(timestamp);
        const diffInMs = now.getTime() - createdDate.getTime();
        const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

        if (diffInDays <= 3) {
            if (diffInDays === 0) return "Today";
            if (diffInDays === 1) return "1 day ago";
            return `${diffInDays} days ago`;
        }

        // Format as "2 Jan 2025"
        return createdDate.toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    };

    return formatDate;
};

export default useDateFormat;
