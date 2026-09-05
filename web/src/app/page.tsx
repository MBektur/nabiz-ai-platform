"use client";

import React from "react";
import { NabizProvider } from "../context/NabizContext";
import { NabizApp } from "../components/NabizApp";

export default function Home() {
  return (
    <NabizProvider>
      <NabizApp />
    </NabizProvider>
  );
}
