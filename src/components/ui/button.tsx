import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 cursor-pointer items-center justify-center rounded-buttons border border-transparent bg-clip-padding text-body-sm font-semibold whitespace-nowrap transition-all duration-300 outline-none select-none hover:-translate-y-0.5 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-coral text-paper shadow-plasma hover:bg-ink",
        outline:
          "border-fold bg-paper text-ink hover:shadow-plasma",
        secondary:
          "border-fold bg-sage-paper text-ink hover:shadow-plasma",
        ghost:
          "text-ink hover:bg-coral/10",
        destructive:
          "border-fold bg-coral/15 text-coral hover:shadow-plasma",
        link: "text-coral underline-offset-4 hover:underline",
      },
      size: {
        default: "h-auto gap-2 px-6 py-[14px]",
        xs: "h-6 gap-1 px-2 text-caption [&_svg:not([class*='size-'])]:size-3",
        sm: "h-9 gap-1.5 px-4 text-caption",
        lg: "h-auto gap-2 px-6 py-[14px] text-body-sm",
        icon: "size-9",
        "icon-xs": "size-6 [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-7",
        "icon-lg": "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
