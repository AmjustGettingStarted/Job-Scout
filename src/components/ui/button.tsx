import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 cursor-pointer items-center justify-center rounded-buttons border border-transparent bg-clip-padding text-body-sm font-semibold whitespace-nowrap transition-shadow duration-300 outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "border-crimson-line bg-dark-mulberry text-frost-white shadow-none hover:shadow-plasma",
        outline:
          "border-crimson-line bg-obsidian-void text-frost-white hover:shadow-plasma-ambient",
        secondary:
          "border-hairline bg-secondary text-secondary-foreground hover:shadow-plasma-ambient",
        ghost:
          "text-frost-white hover:bg-plasma-wash hover:text-frost-white",
        destructive:
          "border-crimson-line bg-plasma-wash text-plasma-pink hover:shadow-plasma",
        link: "text-plasma-pink underline-offset-4 hover:underline",
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
