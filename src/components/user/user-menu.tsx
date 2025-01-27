"use client";

import { BadgeCheck, Bell, ChevronsUpDown, LogOut } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { authClient } from "~/lib/auth-client";
import { Button } from "~/components/ui/button";
import { useRouter } from "next/navigation";

export function UserMenu({ showName, patientArea }: { showName?: boolean, patientArea?: boolean }) {
  const router = useRouter();

  const { data: session } = authClient.useSession();

  async function onSignOut() {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          const path = patientArea ? "/patient-area" : "/login";
          router.push(path);
        },
      },
    });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="default" variant="ghost">
          <Avatar className="h-8 w-8 rounded-lg">
            <AvatarImage
              src={session?.user.image ?? undefined}
              alt={session?.user.name}
            />

            <AvatarFallback className="rounded-lg">
              {session?.user.name?.charAt(0)}
            </AvatarFallback>
          </Avatar>
          {showName ? (
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">
                {session?.user.name}
              </span>
              <span className="truncate text-xs">{session?.user.email}</span>
            </div>
          ) : null}
          <ChevronsUpDown className="ml-auto size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
        side={"bottom"}
        align="end"
        sideOffset={4}
      >
        <DropdownMenuLabel className="p-0 font-normal">
          <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
            <Avatar className="h-8 w-8 rounded-lg">
              <AvatarImage
                src={session?.user.image ?? undefined}
                alt={session?.user.name}
              />

              <AvatarFallback className="rounded-lg">
                {session?.user.name?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">
                {session?.user.name}
              </span>
              <span className="truncate text-xs">{session?.user.email}</span>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <BadgeCheck />
            Conta
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Bell />
            Notificações
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Button
            variant="ghost"
            className="flex w-full justify-start"
            onClick={onSignOut}
          >
            <LogOut />
            Sair
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
