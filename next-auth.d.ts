import { DefaultSession, DefaultUser } from "next-auth";
import { DefaultJWT } from "next-auth/jwt";
import { Role } from "./constants/role";

declare module "next-auth" {
  interface Session {
    user: {
      role: Role["name"];
      id: number;
      image: string;
      verified: boolean;
      first_name: string;
      last_name: string;
      status?: boolean;
      adress: string;
      ID_code: string;
      birth_date: string;
      active: boolean;
      children: number[];
      parent: number;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    role: Role["name"];
    id: number;
    image: string;
    verified: boolean;
    first_name: string;
    last_name: string;
    status?: boolean;
    birth_date: string;
    adress: string;
    ID_code: string;
    active: boolean;
    children: number[];
    parent: number;
    full_name: string;
    groups: {
      id: number;
      name: string;
      owner: { id: number; first_name: string; last_name: string };
    }[];
    reservations: {
      id: number;
    }[];
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    role: Role['name']
    id: number;
    image: string;
    verified: boolean;
    first_name: string;
    last_name: string;
    status?: boolean;
    adress: string;
    ID_code: string;
    birth_date: string;
    active: boolean;
    children: number[];
    parent: number;
  }
}
