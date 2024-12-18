"use client";

import { useState, useMemo } from "react";
import { useDebounce } from "@uidotdev/usehooks";

import {
  MultiSelect,
  MultiSelectContent,
  MultiSelectEmpty,
  MultiSelectList,
  MultiSelectSearch,
  MultiSelectTrigger,
  MultiSelectValue,
  renderMultiSelectOptions,
  type MultiSelectOptionGroup,
} from "~/components/ui/multi-select";
import { api } from "~/trpc/react";

const group = (
  options: Array<{ code: string; description: string }>,
): MultiSelectOptionGroup[] => {
  return [
    {
      heading: "CIDs",
      children: options.map((item) => ({
        value: item.code,
        label: `${item.code} - ${item.description}`,
      })),
    },
  ];
};

export function CidMultiSelect() {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const { data: cids, isLoading } = api.cid.findMany.useQuery(
    {
      take: 20,
      where: {
        OR: [
          { code: { contains: debouncedSearchTerm } },
          { description: { contains: debouncedSearchTerm } },
        ],
      },
    },
    {
      enabled: debouncedSearchTerm.length > 0,
    },
  );

  const options = useMemo(() => {
    if (!cids) return [];
    return group(cids);
  }, [cids]);

  const handleSearch = async (keyword: string) => {
    setSearchTerm(keyword);
  };

  return (
    <MultiSelect onSearch={handleSearch}>
      <MultiSelectTrigger className="w-96">
        <MultiSelectValue placeholder="Procurar CIDs" />
      </MultiSelectTrigger>
      <MultiSelectContent>
        <MultiSelectSearch />
        <MultiSelectList>
          {isLoading ? null : renderMultiSelectOptions(options)}
          <MultiSelectEmpty>
            {isLoading ? "Carregando..." : "Nenhum resultado encontrado"}
          </MultiSelectEmpty>
        </MultiSelectList>
      </MultiSelectContent>
    </MultiSelect>
  );
}
