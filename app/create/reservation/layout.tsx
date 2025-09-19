"use client";
import { Paper, Tab, Tabs } from "@mui/material";
import React, { createContext, useState } from "react";
import CreateButton from "./CreateButton";
import Link from "next/link";
import { getSession } from "next-auth/react";
import { Role } from "@/constants/role";

interface ReservationContextType {
  createReservation: any;
  setCreateReservation: (createReservation: any) => void;
}

export const ReservationContext = createContext<ReservationContextType | null>(
  null
);

export default function CreateReservationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [userRole, setUserRole] = useState<null | Role["name"]>(null);
  const [createReservation, setCreateReservation] = useState({
    from_date: "",
    to_date: "",
    groups: [],
    rooms: [],
    leader: 0,
    purpouse: "",
    instructions: "",
    name: "",
    family: false,
  });

  getSession().then((res) => setUserRole(res?.user.role));
  return (
    <ReservationContext value={{ createReservation, setCreateReservation }}>
      <Tabs value={"reservation"} variant="scrollable">
        <Tab
          value="reservation"
          label="Vytvořit rezervaci"
          component={Link}
          href={`/create/reservation`}
        />
        <Tab
          value="user"
          label="Vytvořit uživatele"
          component={Link}
          href={`/create/user`}
        />
        <Tab
          value="group"
          label="Vytvořit skupinu"
          component={Link}
          href={`/create/group`}
        />
        <Tab
          value="family"
          label="Vytvořit účet rodinného příslušníka"
          component={Link}
          href={`/create/family`}
        />
        {userRole === "admin" && (
          <Tab
            value="import"
            label="Importovat uživatele"
            component={Link}
            href={`/create/import`}
          />
        )}
      </Tabs>
      {children}
      <CreateButton />
    </ReservationContext>
  );
}
