import { useFormContext } from "react-hook-form";
import { z } from "zod";
import { Separator } from "~/components/ui/separator";
import { Label } from "~/components/ui/label";
import { Card, CardContent, CardTitle, CardHeader } from "~/components/ui/card";
import { subjectiveSchema } from "./subject-info";
import { evaluationSchema } from "./evaluation-info";
import { objectiveSchema } from "./objective-info";
import { planSchema } from "./plan-info";
import { LI, UL } from "~/components/ui/typography";

type AllFields = z.infer<typeof subjectiveSchema> &
  z.infer<typeof objectiveSchema> &
  z.infer<typeof evaluationSchema> &
  z.infer<typeof planSchema>;

export function ReviewInfo() {
  const { getValues } = useFormContext<AllFields>();

  const { subjective, motive, objective, evaluation, cids, plan } = getValues();

  const cidsLabels = cids.map((c) => c.label);

  return (
    <div className="space-y-6">
      <Separator />

      <div>
        <h3 className="text-lg font-medium">Dados da consulta</h3>
        <p className="text-muted-foreground text-sm">
          Revise as informações abaixo para garantir que estão corretas.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Subjetivo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col gap-2">
              <Label className="text-muted-foreground font-bold">Motivo</Label>
              <p>{motive}</p>
            </div>
            <div className="flex flex-col gap-2">
              <Label className="text-muted-foreground font-bold">
                Informações
              </Label>
              <p>{subjective}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Objetivo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col gap-2">
              <Label className="text-muted-foreground font-bold">
                Informações
              </Label>
              <p>{objective}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Avaliação</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col gap-2">
              <Label className="text-muted-foreground font-bold">
                Informações
              </Label>
              <p>{evaluation}</p>
            </div>
            <div className="flex flex-col gap-2">
              <Label className="text-muted-foreground font-bold">CIDs</Label>
              <UL className="mt-0">
                {cidsLabels.map((cid) => (
                  <LI key={cid}>{cid}</LI>
                ))}
              </UL>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Plano</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col gap-2">
              <Label className="text-muted-foreground font-bold">
                Informações
              </Label>
              <p>{plan || "-"}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
