import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Textarea } from "~/components/ui/textarea";
import { Button } from "~/components/ui/button";
import { InviteButton } from "~/app/(dashboard)/invite-button";
import { CidMultiSelect } from "~/components/cid-multi-select";

export default function Page() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Nova Consulta</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="paciente">Nome do Paciente</Label>
            <Input id="paciente" placeholder="Digite o nome do paciente" />
          </div>
          <p>alergias</p>
              <p>comorbidades</p>
              <p>medicamentos</p>
          <Tabs defaultValue="subjetivo" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="subjetivo">Subjetivo</TabsTrigger>
              <TabsTrigger value="objetivo">Objetivo</TabsTrigger>
              <TabsTrigger value="avaliacao">Avaliação</TabsTrigger>
              <TabsTrigger value="plano">Plano</TabsTrigger>
            </TabsList>
            
            <TabsContent value="subjetivo">
              <div className="grid gap-2 mb-4">
                <Label htmlFor="motivo">Motivo da consulta</Label>
                <Textarea
                  id="motivo"
                  placeholder="Digite o motivo da consulta"
                  className="min-h-[150px]"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="subjetivo">Informações Subjetivas</Label>
                <Textarea
                  id="subjetivo"
                  placeholder="Digite as informações subjetivas do paciente"
                  className="min-h-[150px]"
                />
              </div>
            </TabsContent>
            <TabsContent value="objetivo">
              <div className="grid gap-2">
                <Label htmlFor="objetivo">Informações Objetivas</Label>
                <Textarea
                  id="objetivo"
                  placeholder="Digite as informações objetivas do paciente"
                  className="min-h-[150px]"
                />
              </div>
            </TabsContent>
            <TabsContent value="avaliacao">
              <div className="grid gap-2">
                <Label htmlFor="avaliacao">Avaliação</Label>
                <Textarea
                  id="avaliacao"
                  placeholder="Digite a avaliação do paciente"
                  className="min-h-[150px]"
                />
                <CidMultiSelect />
              </div>
            </TabsContent>
            <TabsContent value="plano">
              <div className="grid gap-2">
                <Label htmlFor="plano">Plano</Label>
                <Textarea
                  id="plano"
                  placeholder="Digite o plano de tratamento"
                  className="min-h-[150px]"
                />
              </div>
            </TabsContent>
          </Tabs>
          <div className="flex justify-end">
            <Button type="submit">Salvar Consulta</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
