import dynamic from "next/dynamic";
import { Suspense, SuspenseProps } from "react";

export const SuspenseWithoutSsr = dynamic(
  () => Promise.resolve((({ children, ...props }) => <Suspense {...props}>{children}</Suspense>) as React.FC<SuspenseProps>),
  { ssr: false }
);