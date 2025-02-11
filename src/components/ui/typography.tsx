import { cn } from "~/lib/utils";
import { type ComponentProps } from "react";

const H1 = ({ className, ...props }: ComponentProps<"h1">) => (
  <h1
    className={cn(
      "scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl",
      className,
    )}
    {...props}
  />
);

const H2 = ({ className, ...props }: ComponentProps<"h2">) => (
  <h2
    className={cn(
      "mt-10 scroll-m-20 text-3xl font-semibold tracking-tight transition-colors first:mt-0",
      className,
    )}
    {...props}
  />
);

const H3 = ({ className, ...props }: ComponentProps<"h3">) => (
  <h3
    className={cn(
      "mt-8 scroll-m-20 text-2xl font-semibold tracking-tight",
      className,
    )}
    {...props}
  />
);

const H4 = ({ className, ...props }: ComponentProps<"h4">) => (
  <h4
    className={cn(
      "scroll-m-20 text-xl font-semibold tracking-tight",
      className,
    )}
    {...props}
  />
);

const H5 = ({ className, ...props }: ComponentProps<"h5">) => (
  <h5
    className={cn(
      "scroll-m-20 text-lg font-semibold tracking-tight",
      className,
    )}
    {...props}
  />
);

const H6 = ({ className, ...props }: ComponentProps<"h6">) => (
  <h6
    className={cn(
      "scroll-m-20 text-base font-semibold tracking-tight",
      className,
    )}
    {...props}
  />
);

const P = ({ className, ...props }: ComponentProps<"p">) => (
  <p
    className={cn("leading-7 not-first:mt-6", className)}
    {...props}
  />
);

const BlockQuote = ({
  className,
  ...props
}: ComponentProps<"blockquote">) => (
  <blockquote
    className={cn(
      "mt-6 border-l-2 border-slate-300 pl-6 italic text-slate-800 dark:border-slate-600 dark:text-slate-200",
      className,
    )}
    {...props}
  />
);

const Table = ({ className, ...props }: ComponentProps<"table">) => (
  <table className={cn("w-full", className)} {...props} />
);

const THead = ({ className, ...props }: ComponentProps<"thead">) => (
  <thead className={cn("", className)} {...props} />
);

const TBody = ({ className, ...props }: ComponentProps<"tbody">) => (
  <tbody className={cn("", className)} {...props} />
);

const TR = ({ className, ...props }: ComponentProps<"tr">) => (
  <tr
    className={cn(
      "m-0 border-t border-slate-300 p-0 even:bg-slate-100 dark:border-slate-700 dark:even:bg-slate-800",
      className,
    )}
    {...props}
  />
);

const TD = ({ className, ...props }: ComponentProps<"td">) => (
  <td
    className={cn(
      "border border-slate-200 px-4 py-2 text-left dark:border-slate-700 [&[align=center]]:text-center [&[align=right]]:text-right",
      className,
    )}
    {...props}
  />
);

const TH = ({ className, ...props }: ComponentProps<"th">) => (
  <th
    className={cn(
      "border border-slate-200 px-4 py-2 text-left font-bold dark:border-slate-700 [&[align=center]]:text-center [&[align=right]]:text-right",
      className,
    )}
    {...props}
  />
);

const UL = ({ className, ...props }: ComponentProps<"ul">) => (
  <ul
    className={cn("my-6 ml-6 list-disc [&>li]:mt-2", className)}
    {...props}
  />
);

const LI = ({ className, ...props }: ComponentProps<"li">) => (
  <li className={cn("", className)} {...props} />
);

const InlineCode = ({ className, ...props }: ComponentProps<"code">) => (
  <code
    className={cn(
      "relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold",
      className,
    )}
    {...props}
  />
);

const Lead = ({ className, ...props }: ComponentProps<"p">) => (
  <p
    className={cn("text-xl text-muted-foreground", className)}
    {...props}
  />
);

const Large = ({ className, ...props }: ComponentProps<"div">) => (
  <div
    className={cn("text-lg font-semibold", className)}
    {...props}
  />
);

const Small = ({ className, ...props }: ComponentProps<"small">) => (
  <small
    className={cn("text-sm font-medium leading-none", className)}
    {...props}
  />
);

const Subtle = ({ className, ...props }: ComponentProps<"p">) => (
  <p
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
);

export {
  H1,
  H2,
  H3,
  H4,
  P,
  BlockQuote,
  Table,
  THead,
  TBody,
  TR,
  TD,
  TH,
  UL,
  LI,
  InlineCode,
  Lead,
  Large,
  Small,
  Subtle,
};
