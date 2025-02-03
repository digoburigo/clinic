import { useFormContext } from "react-hook-form";
import { z } from "zod";
import { medicalInfoSchema } from "./medical-info/types";
import { personalInfoSchema } from "./personal-info";
import { addressInfoSchema } from "./address-info";
import { socialInfoSchema } from "./social-info";
import { Separator } from "~/components/ui/separator";
import { Label } from "~/components/ui/label";
import { Card, CardContent, CardTitle, CardHeader } from "~/components/ui/card";
import { textFormatter } from "~/lib/utils";

type AllFields = z.infer<typeof medicalInfoSchema> &
  z.infer<typeof personalInfoSchema> &
  z.infer<typeof addressInfoSchema> &
  z.infer<typeof socialInfoSchema>;

const RACE_LABELS = {
  white: "Branco",
  black: "Negro",
  brown: "Pardo",
  yellow: "Amarelo",
  indigenous: "Indígena",
};

const SEX_LABELS = {
  male: "Masculino",
  female: "Feminino",
};

const BLOOD_TYPE_LABELS = {
  "b-": "B-",
  "b+": "B+",
  "ab-": "AB-",
  "ab+": "AB+",
  "o-": "O-",
  "o+": "O+",
  "a-": "A-",
  "a+": "A+",
};

const GENDER_IDENTITY_LABELS = {
  cisgender: "Cisgênero",
  transgender: "Transgênero",
  "non-binary": "Não binário",
};

const CIVIL_STATUS_LABELS = {
  single: "Solteiro",
  married: "Casado",
  separated: "Separado",
  divorced: "Divorciado",
  widowed: "Viúvo",
};

export const CELLPHONE_MASK = "($1) $2 $3-$4";
export const CELLPHONE_REGEX = /(\d{2})(\d{1})(\d{4})(\d{4})/;
export const ZIPCODE_MASK = "$1-$2";
export const ZIPCODE_REGEX = /^(\d{5})(\d{3})$/;
export const CPF_MASK = "$1.$2.$3-$4";
export const CPF_REGEX = /^(\d{3})(\d{3})(\d{3})(\d{2})$/;

export function ReviewInfo() {
  const { getValues } = useFormContext<AllFields>();

  const {
    vaccinations,
    healthPlans,
    allergies,
    medications,
    examResults,
    comorbidities,
    surgeries,
    name,
    cpf,
    email,
    responsible,
    bloodType,
    genderIdentity,
    sexualOrientation,
    occupation,
    cellphone,
    state,
    city,
    neighborhood,
    street,
    number,
    complement,
    civilStatus,
    nationality,
    race,
    sex,
    zipcode,
  } = getValues();

  const vaccinationsString = vaccinations
    .map((vaccination) => vaccination.label)
    .join(" / ");
  const healthPlansString = healthPlans
    .map((healthPlan) => healthPlan.label)
    .join(" / ");
  const allergiesString = allergies?.map((allergy) => allergy.label).join(", ");
  const medicationsString = medications
    ?.map((medication) => medication.label)
    .join(" / ");
  const examResultsString = examResults
    ?.map((examResult) => examResult.label)
    .join(" / ");
  const comorbiditiesString = comorbidities
    ?.map((comorbidity) => comorbidity.label)
    .join(" / ");
  const surgeriesString = surgeries
    ?.map((surgery) => surgery.label)
    .join(" / ");

  return (
    <div className="space-y-6">
      <Separator />

      <div>
        <h3 className="text-lg font-medium">Dados do paciente</h3>
        <p className="text-muted-foreground text-sm">
          Revise as informações abaixo para garantir que estão corretas.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Informações pessoais</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col gap-2">
              <Label className="text-muted-foreground font-bold">Nome</Label>
              <p>{name}</p>
            </div>
            <div className="flex flex-col gap-2">
              <Label className="text-muted-foreground font-bold">CPF</Label>
              <p>{textFormatter(cpf, "cpf")}</p>
            </div>
            <div className="flex flex-col gap-2">
              <Label className="text-muted-foreground font-bold">Celular</Label>
              <p>{textFormatter(cellphone, "cellPhone")}</p>
            </div>
            <div className="flex flex-col gap-2">
              <Label className="text-muted-foreground font-bold">Email</Label>
              <p>{email}</p>
            </div>
            <div className="flex flex-col gap-2">
              <Label className="text-muted-foreground font-bold">Sexo</Label>
              <p>{SEX_LABELS[sex] || "-"}</p>
            </div>
            <div className="flex flex-col gap-2">
              <Label className="text-muted-foreground font-bold">
                Nacionalidade
              </Label>
              <p>{nationality}</p>
            </div>
            <div className="flex flex-col gap-2">
              <Label className="text-muted-foreground font-bold">Raça</Label>
              <p>{RACE_LABELS[race] || "-"}</p>
            </div>
            <div className="flex flex-col gap-2">
              <Label className="text-muted-foreground font-bold">
                Responsável
              </Label>
              <p>{responsible || "-"}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Informações de endereço</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col gap-2">
              <Label className="text-muted-foreground font-bold">CEP</Label>
              <p>{textFormatter(zipcode, "zipcode")}</p>
            </div>
            <div className="flex flex-col gap-2">
              <Label className="text-muted-foreground font-bold">
                Endereço
              </Label>
              <p>
                {street} - {neighborhood}, {number}
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <Label className="text-muted-foreground font-bold">Estado</Label>
              <p>{state || "-"}</p>
            </div>
            <div className="flex flex-col gap-2">
              <Label className="text-muted-foreground font-bold">Cidade</Label>
              <p>{city || "-"}</p>
            </div>
            <div className="flex flex-col gap-2">
              <Label className="text-muted-foreground font-bold">
                Complemento
              </Label>
              <p>{complement || "-"}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Informações sociais</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col gap-2">
              <Label className="text-muted-foreground font-bold">
                Ocupação
              </Label>
              <p>{occupation}</p>
            </div>
            <div className="flex flex-col gap-2">
              <Label className="text-muted-foreground font-bold">
                Tipo sanguíneo
              </Label>
              <p>{BLOOD_TYPE_LABELS[bloodType] || "-"}</p>
            </div>
            <div className="flex flex-col gap-2">
              <Label className="text-muted-foreground font-bold">
                Identidade de gênero
              </Label>
              <p>{GENDER_IDENTITY_LABELS[genderIdentity] || "-"}</p>
            </div>
            <div className="flex flex-col gap-2">
              <Label className="text-muted-foreground font-bold">
                Estado civil
              </Label>
              <p>{CIVIL_STATUS_LABELS[civilStatus] || "-"}</p>
            </div>
            <div className="flex flex-col gap-2">
              <Label className="text-muted-foreground font-bold">
                Orientação sexual
              </Label>
              <p>{sexualOrientation || "-"}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Informações médicas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col gap-2">
              <Label className="text-muted-foreground font-bold">Vacinas</Label>
              <p>{vaccinationsString || "-"}</p>
            </div>
            <div className="flex flex-col gap-2">
              <Label className="text-muted-foreground font-bold">
                Planos de saúde
              </Label>
              <p>{healthPlansString || "-"}</p>
            </div>
            <div className="flex flex-col gap-2">
              <Label className="text-muted-foreground font-bold">
                Alergias
              </Label>
              <p>{allergiesString || "-"}</p>
            </div>
            <div className="flex flex-col gap-2">
              <Label className="text-muted-foreground font-bold">
                Medicamentos
              </Label>
              <p>{medicationsString || "-"}</p>
            </div>
            <div className="flex flex-col gap-2">
              <Label className="text-muted-foreground font-bold">
                Resultados de exames
              </Label>
              <p>{examResultsString || "-"}</p>
            </div>
            <div className="flex flex-col gap-2">
              <Label className="text-muted-foreground font-bold">
                Comorbidades
              </Label>
              <p>{comorbiditiesString || "-"}</p>
            </div>
            <div className="flex flex-col gap-2">
              <Label className="text-muted-foreground font-bold">
                Cirurgias
              </Label>
              <p>{surgeriesString || "-"}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
