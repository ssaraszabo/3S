export interface User {
    id: number;
    name: string;
    avatar: any; // for require('../assets/images/avatar*.png')
    focusSessions: number;
    position: {
        left: number;
        top: number;
    };
}