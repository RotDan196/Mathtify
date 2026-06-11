import type { DetailedHTMLProps, HTMLAttributes } from "react";
import type { MathfieldElement } from "mathlive";

declare module "mammoth/mammoth.browser";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "math-field": DetailedHTMLProps<HTMLAttributes<MathfieldElement>, MathfieldElement> & {
        "default-mode"?: "math" | "text" | "inline-math";
        "letter-shape-style"?: "auto" | "tex" | "iso" | "french" | "upright";
        "math-virtual-keyboard-policy"?: "auto" | "manual" | "sandboxed";
        placeholder?: string;
        "remove-extraneous-parentheses"?: string;
        "smart-fence"?: string;
        "smart-mode"?: string;
        "smart-superscript"?: string;
      };
    }
  }
}
