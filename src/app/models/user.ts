export interface User {
    uid?: string;
    email?: string;
    name?: string;
    dateOfBirth?: Date;
    password?: string;
    points?: { fromPoint: { year: number, month: number }, points: Point[] };
    photoURL?: string;
}

export interface Point {
    year: number;
    points: { month: number, point: number }[];
}
