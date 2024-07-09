"use client";

import React from "react";
import { Button } from "./ui/button";

type Props = {};

function TestButton({}: Props) {
  const scrapeData = async () => {
    const data = await fetch("http://localhost:3000/api/scraper").then((res) =>
      res.json()
    );
    console.log({ data });
  };

  return (
    <Button variant="outline" className="w-full" onClick={scrapeData}>
      Scrape again
    </Button>
  );
}

export default TestButton;
