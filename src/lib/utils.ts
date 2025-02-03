import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(
  date: Date | string | number,
  opts: Intl.DateTimeFormatOptions = {},
) {
  return new Intl.DateTimeFormat("pt-BR", {
    month: opts.month ?? "long",
    day: opts.day ?? "numeric",
    year: opts.year ?? "numeric",
    ...opts,
  }).format(new Date(date));
}

export function toSentenceCase(str: string) {
  return str
    .replace(/_/g, " ")
    .replace(/([A-Z])/g, " $1")
    .toLowerCase()
    .replace(/^\w/, (c) => c.toUpperCase())
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * @see https://github.com/radix-ui/primitives/blob/main/packages/core/primitive/src/primitive.tsx
 */
export function composeEventHandlers<E>(
  originalEventHandler?: (event: E) => void,
  ourEventHandler?: (event: E) => void,
  { checkForDefaultPrevented = true } = {},
) {
  return function handleEvent(event: E) {
    originalEventHandler?.(event);

    if (
      checkForDefaultPrevented === false ||
      !(event as unknown as Event).defaultPrevented
    ) {
      return ourEventHandler?.(event);
    }
  };
}

// formaters

const CELLPHONE_MASK = "($1) $2 $3-$4";
const CELLPHONE_REGEX = /(\d{2})(\d{1})(\d{4})(\d{4})/;
const ZIPCODE_MASK = "$1-$2";
const ZIPCODE_REGEX = /^(\d{5})(\d{3})$/;
const CPF_MASK = "$1.$2.$3-$4";
const CPF_REGEX = /^(\d{3})(\d{3})(\d{3})(\d{2})$/;

const formatters = {
  cellPhone: {
    mask: CELLPHONE_MASK,
    regex: CELLPHONE_REGEX,
  },
  zipcode: {
    mask: ZIPCODE_MASK,
    regex: ZIPCODE_REGEX,
  },
  cpf: {
    mask: CPF_MASK,
    regex: CPF_REGEX,
  },
};

export function textFormatter(
  value: string,
  formatter: keyof typeof formatters,
) {
  return value.replace(formatters[formatter].regex, formatters[formatter].mask);
}
