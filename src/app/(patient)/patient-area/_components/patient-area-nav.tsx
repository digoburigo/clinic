import Link from "next/link"

import { cn } from "~/lib/utils"
import { AreaSwitcher } from "./area-switcher"

export function PatientAreaNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <nav
      className={cn("flex items-center space-x-4 lg:space-x-6", className)}
      {...props}
    >
      <AreaSwitcher />
      <Link
        href="/patient-area"
        className="text-sm font-medium transition-colors hover:text-primary"
      >
        Área do paciente
      </Link>
    </nav>
  )
}