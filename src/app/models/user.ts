export interface User {
    uid?: string;
    email?: string;
    name?: string;
    phoneNo?: string;
    password?: string;
    photoURL?: string;
    timeCreated?: Date;
    lastLogin?: Date;
    lastModified?: Date;
    passwordChanged?: Date;
    userType?: 'user' | 'admin';
    provider?: 'facebook' | 'google' | 'email';
    lastPasswordModified?: Date;
}
