
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export interface UpdateUserInput {
    id?: Nullable<string>;
    name?: Nullable<string>;
}

export interface User {
    id: string;
    name: string;
    email: string;
}

export interface IQuery {
    allUsers(): User[] | Promise<User[]>;
    singleUser(id: string): User | Promise<User>;
}

export interface IMutation {
    updateUser(user: UpdateUserInput): string | Promise<string>;
    removeUser(id: string): string | Promise<string>;
}

type Nullable<T> = T | null;
