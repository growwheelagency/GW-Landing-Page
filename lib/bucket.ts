"use client";
import { useSyncExternalStore } from "react";

// The visitor's bucket, shared by the shop and the contact form.
let picked: string[] = [];
const subs = new Set<() => void>();
const EMPTY: string[] = [];

export const bucket = {
  get: () => picked,
  set(next: string[]) {
    picked = next;
    subs.forEach((f) => f());
  },
  subscribe(f: () => void) {
    subs.add(f);
    return () => {
      subs.delete(f);
    };
  },
};

export const useBucket = () =>
  useSyncExternalStore(bucket.subscribe, bucket.get, () => EMPTY);
