import { useFormContext } from "react-hook-form";
import { z } from "zod";
import { FormMessage } from "~/components/ui/form";
import { FormControl } from "~/components/ui/form";
import { FormLabel } from "~/components/ui/form";
import { FormField } from "~/components/ui/form";
import { FormItem } from "~/components/ui/form";
import { SelectContent, SelectItem } from "~/components/ui/select";
import { Input } from "~/components/ui/input";
import { Select, SelectTrigger, SelectValue } from "~/components/ui/select";
import { withMask } from "use-mask-input";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

export const adressInfoSchema = z.object({
  zipcode: z.string().min(8, {
    message: "CEP must be at least 8 characters.",
  }),
  state: z.string().nonempty({
    message: "Estado is required.",
  }),
  city: z.string().nonempty({
    message: "Município is required.",
  }),
  neighborhood: z.string().nonempty({
    message: "Bairro is required.",
  }),
  street: z.string().nonempty({
    message: "Logradouro is required.",
  }),
  number: z.string().nonempty({
    message: "Número is required.",
  }),
  complement: z.string().optional(),
});

export type AdressInfoForm = z.infer<typeof adressInfoSchema>;

interface ViaCepResponse {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  ibge: string;
  gia: string;
  ddd: string;
  siafi: string;
}

async function getCep(cep: string): Promise<ViaCepResponse | null> {
  if (cep.length !== 9) {
    return null;
  }
  const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
  const data = (await response.json()) as ViaCepResponse;
  return data;
}

export function AdressInfoForm() {
  const { control, setValue, getValues } =
    useFormContext<AdressInfoForm>();

  const cepQuery = useQuery({
    queryKey: ["zipcode", getValues("zipcode")],
    queryFn: () => getCep(getValues("zipcode")),
    enabled: getValues("zipcode").length === 9,
  });

  useEffect(() => {
    if (cepQuery.data) {
      setValue("state", cepQuery.data.uf);
      setValue("city", cepQuery.data.localidade);
      setValue("neighborhood", cepQuery.data.bairro);
      setValue("street", cepQuery.data.logradouro);
    }
  }, [cepQuery.data]);

  return (
    <div className="space-y-4">
      <FormField
        control={control}
        name="zipcode"
        render={({ field }) => (
          <FormItem>
            <FormLabel required>CEP</FormLabel>
            <FormControl ref={withMask("99999-999")}>
              <Input
                placeholder="Ex.: 00000-000"
                {...field}
                onBlur={() => {
                  cepQuery.refetch();
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="state"
        render={({ field }) => (
          <FormItem>
            <FormLabel required>Estado</FormLabel>
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value}
              value={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um estado" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="AC">Acre</SelectItem>
                <SelectItem value="AL">Alagoas</SelectItem>
                <SelectItem value="AP">Amapá</SelectItem>
                <SelectItem value="AM">Amazonas</SelectItem>
                <SelectItem value="BA">Bahia</SelectItem>
                <SelectItem value="CE">Ceará</SelectItem>
                <SelectItem value="DF">Distrito Federal</SelectItem>
                <SelectItem value="ES">Espírito Santo</SelectItem>
                <SelectItem value="GO">Goiás</SelectItem>
                <SelectItem value="MA">Maranhão</SelectItem>
                <SelectItem value="MT">Mato Grosso</SelectItem>
                <SelectItem value="MS">Mato Grosso do Sul</SelectItem>
                <SelectItem value="MG">Minas Gerais</SelectItem>
                <SelectItem value="PA">Pará</SelectItem>
                <SelectItem value="PB">Paraíba</SelectItem>
                <SelectItem value="PR">Paraná</SelectItem>
                <SelectItem value="PE">Pernambuco</SelectItem>
                <SelectItem value="PI">Piauí</SelectItem>
                <SelectItem value="RJ">Rio de Janeiro</SelectItem>
                <SelectItem value="RN">Rio Grande do Norte</SelectItem>
                <SelectItem value="RS">Rio Grande do Sul</SelectItem>
                <SelectItem value="RO">Rondônia</SelectItem>
                <SelectItem value="RR">Roraima</SelectItem>
                <SelectItem value="SC">Santa Catarina</SelectItem>
                <SelectItem value="SP">São Paulo</SelectItem>
                <SelectItem value="SE">Sergipe</SelectItem>
                <SelectItem value="TO">Tocantins</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="city"
        render={({ field }) => (
          <FormItem>
            <FormLabel required>Município</FormLabel>
            <FormControl>
              <Input placeholder="Ex.: São Paulo" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="neighborhood"
        render={({ field }) => (
          <FormItem>
            <FormLabel required>Bairro</FormLabel>
            <FormControl>
              <Input placeholder="Ex.: Centro" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="street"
        render={({ field }) => (
          <FormItem>
            <FormLabel required>Logradouro</FormLabel>
            <FormControl>
              <Input placeholder="Ex.: Rua das Flores" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="number"
        render={({ field }) => (
          <FormItem>
            <FormLabel required>Número</FormLabel>
            <FormControl>
              <Input type="number" placeholder="Ex.: 100" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="complement"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Complemento</FormLabel>
            <FormControl>
              <Input placeholder="Ex.: Apartamento, Bloco, etc." {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
