import { cva, VariantProps } from "class-variance-authority";
import { ButtonHTMLAttributes } from "react";
import { Loader2Icon } from "lucide-react";
import { cname } from "@/lib/utils";

export const buttonVariants = cva(
    "active: scale-95 inline-flex items-center justify-center rounded-md text-sm font-medium transition-color focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offse-2 disabled:opacity-50 disabled:pointer-events-none",
    {
        variants: {
            variant: {
                default: "bg-slate-900 text-white hover:bg-slate-800",
                ghost: "bg-transparent hover:text-slate-900 hover:bg-slate-200",
            },
            size: {
                default: "h-10 py-2 px-4",
                sm: "h-9 px-2",
                lg: "h-11 px-8",
            }
        },
        defaultVariants: {
            size: "default",
            variant: "default",
        },
    }
)

export interface IButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
    isLoading?: boolean
}

const Button: React.FunctionComponent<IButtonProps> = ({ className, size, children, isLoading, variant, ...props }) => {
    return (
        <button className={cname(buttonVariants({ variant, size, className }))} disabled={isLoading} {...props}>
            {isLoading ? <Loader2Icon className="h-4 w-4 animate-spin" color="#e2e8f0" /> : <>{children}</>}

        </button>
    );
};

export default Button;
