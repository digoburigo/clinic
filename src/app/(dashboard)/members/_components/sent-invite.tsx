"use client";

import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { authClient } from "~/lib/auth-client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Loader2 } from "lucide-react";
import { api } from "~/trpc/react";
import { useState } from "react";

const SentInviteSchema = z.object({
  email: z.string().email({
    message: "O email deve ser válido.",
  }),
  role: z.enum(["member", "admin", "owner"]),
});


export function SentInvite({
  organizationId,
}: {
  organizationId: string | null | undefined;
}) {
  const apiUtils = api.useUtils();

  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<z.infer<typeof SentInviteSchema>>({
    resolver: zodResolver(SentInviteSchema),
    defaultValues: {
      email: "",
      role: "member",
    },
  });

  async function onSubmit(data: z.infer<typeof SentInviteSchema>) {
    if (!organizationId) return;

    try {
      const invitation = await authClient.organization.inviteMember({
        email: data.email,
        organizationId,
        role: data.role,
      });

      if (invitation.error) {
        toast.error(invitation.error.message);
        return;
      }
      
      await apiUtils.invitation.findMany.invalidate();
  
      toast.success(
        "Convite enviado com sucesso. O usuário receberá um email. Aguarde a confirmação.",
      );
    } catch (error) {
      toast.error("Erro ao enviar convite. Tente novamente.");
    } finally {
      setIsOpen(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>Convidar</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Convidar membro</DialogTitle>
          <DialogDescription>
            Convide um usuário à sua organização.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-5"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="peduarte@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Função</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a função" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="member">Membro</SelectItem>
                      <SelectItem value="admin">Administrador</SelectItem>
                      <SelectItem value="owner">Proprietário</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {form.formState.isSubmitting
                ? "Enviando convite..."
                : "Enviar convite"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
