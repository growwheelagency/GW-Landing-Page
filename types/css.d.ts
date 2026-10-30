import "react";

// Lets style={{ "--d": ".15s" }} type-check.
declare module "react" {
  interface CSSProperties {
    [key: `--${string}`]: string | number | undefined;
  }
}
