"use client"

import { Login } from "./login";




export function Wrapper() {
  return (
    <div className="flex flex-col w-full min-h-screen">
        <Login/>
    </div>
  );
}