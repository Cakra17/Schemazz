import type { Column } from "@/types/column";
import type { CSSProperties } from "react";

export interface Table {
  name: string;
  headerColor: CSSProperties["color"];
  columns: Column[];
}

export interface Position {
  x: number;
  y: number;
}

