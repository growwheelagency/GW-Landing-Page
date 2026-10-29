"use client";
import { useSyncExternalStore } from "react";

// The visitor's bucket, shared by the shop and the contact form.
let picked = [];
const subs = new Set();
const EMPTY = [];

export const bucket = {
  get: () => picked,
  set(next) {
    picked = next;
    subs.forEach((f) => f());
  },
  subscribe(f) {
    subs.add(f);
    return () => subs.delete(f);
  },
};

export const useBucket = () =>
  useSyncExternalStore(bucket.subscribe, bucket.get, () => EMPTY);
