import { TrendingUp } from "lucide-react";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { BarChartExample } from "~/components/bar-chart";
import SolarChatSquare2BoldDuotone from "~/components/svgs/solar-chat-square-2-bold-duotone";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { useSession } from "~/server/auth";

export const metadata: Metadata = {
  title: "Painel de informações",
  description:
    "Painel de informações do sistema de gerenciamento de pacientes.",
};

export default async function Page() {
  const authSession = await useSession();

  if (!authSession?.user) {
    redirect("/login");
  }

  return (
    <Tabs defaultValue="overview" className="space-y-4">
      <TabsList>
        <TabsTrigger value="overview">Inicio</TabsTrigger>
        <TabsTrigger value="analytics" disabled>
          Relatórios
        </TabsTrigger>
        <TabsTrigger value="reports" disabled>
          Consultas
        </TabsTrigger>
        <TabsTrigger value="notifications" disabled>
          Notificações
        </TabsTrigger>
      </TabsList>
      <TabsContent value="overview" className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="text-muted-foreground h-4 w-4"
              >
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">R$45,231.89</div>
              <p className="text-muted-foreground text-xs">
                +20.1% no último mês
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Novos Pacientes
              </CardTitle>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="text-muted-foreground h-4 w-4"
              >
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+23</div>
              <p className="text-muted-foreground text-xs">
                +18.1% no último mês
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Consultas Feitas
              </CardTitle>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="text-muted-foreground h-4 w-4"
              >
                <rect width="20" height="14" x="2" y="5" rx="2" />
                <path d="M2 10h20" />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-muted-foreground text-xs">
                +19% no último mês
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Agenda Hoje</CardTitle>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="text-muted-foreground h-4 w-4"
              >
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">13</div>
              <p className="text-muted-foreground text-xs">+20 no último mês</p>
            </CardContent>
          </Card>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Informações Gerais</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              <BarChartExample />
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-sm">
              <div className="flex gap-2 leading-none font-medium">
                Comparativo Mensal <TrendingUp className="h-4 w-4" />
              </div>
              <div className="text-muted-foreground leading-none">
                Mostrando o total de pacientes
              </div>
            </CardFooter>
          </Card>
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Prospecção de Pacientes</CardTitle>
              <CardDescription>
                Você realizou 22 consultas novas esse mês.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SolarChatSquare2BoldDuotone className="text-primary size-12" />
            </CardContent>
          </Card>
        </div>
      </TabsContent>
    </Tabs>
  );
}
