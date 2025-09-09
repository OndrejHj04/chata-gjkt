import React from "react";
import WelcomeComponent from "./components/WelcomeComponent";
import VerifyUser from "./components/VerifyUser";
import { getAuthServerSession } from "@/lib/authServerSession";

export default async function Layout({ children }: { children: any }) {
  const user = await getAuthServerSession()

  if (!user) {
    return <WelcomeComponent />;
  }

  if (!user.verified) {
    return (
      <React.Fragment>
        <div className="md:absolute static z-50">
          <VerifyUser id={user.id} />
        </div>
        <div className="w-full h-full blur-sm pointer-events-none">
          {children}
        </div>
      </React.Fragment>
    );
  }

  return children;
}
