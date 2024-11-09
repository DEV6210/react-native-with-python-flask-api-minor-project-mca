export const formatTime = (date) => {
    // Create a new Date object if not provided
    const dt = date instanceof Date ? date : new Date(date);

    // Get hours and minutes
    let hours = dt.getHours();
    let minutes = dt.getMinutes();

    // Determine AM/PM
    const period = hours >= 12 ? 'pm' : 'am';

    // Convert hours to 12-hour format if needed
    hours = hours % 12;
    hours = hours ? hours : 12; // Hour '0' should be '12'

    // Pad minutes with leading zero if necessary
    minutes = minutes < 10 ? '0' + minutes : minutes;

    // Format the time
    return `${hours}:${minutes} ${period}`;
};