export const msToTimeString = (ms: number): string => {
    if (!ms) { ms = 0; }
    return Math.floor(ms / 36e5).toString().padStart(2, '0')
        + ':' + Math.floor((ms % 36e5) / 6e4).toString().padStart(2, '0')
        + ':' + Math.floor((ms % 6e4) / 1e3).toString().padStart(2, '0');
};

export const dateToTimeString = (date: Date): string => {
    if (!date) { return null; }
    const secs = date.getSeconds();
    const mins = date.getMinutes();
    const hours = date.getHours();
    return hours.toString().padStart(2, '0') + ':' + mins.toString().padStart(2, '0') + ':' + secs.toString().padStart(2, '0');
};

export const timeStringToDate = (time: string, date?: Date) => {
    const newDate = date ? new Date(date) : new Date();
    const start: string[] = time.split(':');
    newDate.setHours(+start[0], +start[1], +start[2]);
    return newDate;
};

// tslint:disable: triple-equals
export const timeDistance = (date: Date): string => {
    const diff = Math.round((+new Date() - +date) / 1000);
    const month = Math.round(diff / (3600 * 24 * 30));
    if (month == 1) { return month + ' month'; }
    if (month > 1) { return month + ' months'; }

    const day = Math.round(diff / (3600 * 24));
    if (day == 1) { return day + ' day'; }
    if (day > 1) { return day + ' days'; }

    const hour = Math.round(diff / 3600);
    if (hour == 1) { return hour + ' hour'; }
    if (hour > 1) { return hour + ' hours'; }

    const minute = Math.round(diff / 60);
    if (minute == 1) { return minute + ' minute'; }
    if (minute > 1) { return minute + ' minutes'; }

    return 'now';
};

export const isToday = (date: Date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear();
};
