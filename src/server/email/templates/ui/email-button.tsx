import { Button, type ButtonProps } from "@react-email/components";
import { cn } from "~/lib/utils";

export function EmailButton({ children, className, ...props }: ButtonProps) {
  return (
    <Button className={cn("bg-primary py-2 px-3 rounded-md", className)} {...props}>
      {children}
    </Button>
  );
}
