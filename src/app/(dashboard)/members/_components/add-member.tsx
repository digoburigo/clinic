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
import { api } from "~/trpc/react";

const AddMemberSchema = z.object({
  email: z.string().email({
    message: "O email deve ser válido.",
  }),
});

export function AddMember({ organizationId }: { organizationId: string | null | undefined }) {
  const form = useForm<z.infer<typeof AddMemberSchema>>({
    resolver: zodResolver(AddMemberSchema),
    defaultValues: {
      email: "",
    },
  });

  const { mutate: createUser } = api._user.create.useMutation({
    onSuccess: () => {
      toast.success("Membro adicionado com sucesso!", {
        description: (
          <p>Foi enviado um convite para {form.getValues("email")}. Aguarde o aceite.</p>
        ),
      });
    },
  });

  function onSubmit(data: z.infer<typeof AddMemberSchema>) {
    if (!organizationId) return;

    createUser({
      name: data.email,
      email: data.email,
      organizationId: organizationId,
      memberRole: "member",
    });
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Adicionar membro</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Adicionar membro</DialogTitle>
          <DialogDescription>
            Adicione um membro à sua organização.
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
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? "Adicionando..." : "Adicionar"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
