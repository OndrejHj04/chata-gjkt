import { DefaultUser } from "next-auth";
import { DefaultJWT } from "next-auth/jwt";
import { Role } from "./constants/role";

declare module "next-auth" {
  interface Session {
    user: {
      id: number;
      first_name: string;
      last_name: string;
      email: string;
      theme: string;
      role: Role["name"];
      image: string;
      verified: boolean;
      adress: string;
    };
  }

  interface User extends DefaultUser {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    theme: string;
    role: Role["name"];
    image: string;
    verified: boolean;
    adress: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    theme: string;
    role: Role["name"];
    image: string;
    verified: boolean;
    adress: string;
  }
}
