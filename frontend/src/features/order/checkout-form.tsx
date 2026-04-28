import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { CheckoutFormValues } from "@/validations/checkout.schema";
import { checkoutSchema } from "@/validations/checkout.schema";

interface CheckoutFormProps {
  onSubmit: (values: CheckoutFormValues) => void;
  isSubmitting: boolean;
}

export const CheckoutForm = ({ onSubmit, isSubmitting }: CheckoutFormProps) => {
  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    mode: "onBlur",
    defaultValues: {
      name: "",
      address: "",
      phoneNumber: ""
    }
  });

  return (
    <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
      <div>
        <label htmlFor="name" className="mb-1 block text-sm font-medium">
          Name
        </label>
        <Input id="name" placeholder="Enter name" {...form.register("name")} />
        <p className="mt-1 text-xs text-red-600">{form.formState.errors.name?.message}</p>
      </div>
      <div>
        <label htmlFor="address" className="mb-1 block text-sm font-medium">
          Address
        </label>
        <Textarea id="address" placeholder="Enter full delivery address" {...form.register("address")} />
        <p className="mt-1 text-xs text-red-600">{form.formState.errors.address?.message}</p>
      </div>
      <div>
        <label htmlFor="phoneNumber" className="mb-1 block text-sm font-medium">
          Phone number
        </label>
        <Input
          id="phoneNumber"
          inputMode="numeric"
          maxLength={10}
          placeholder="10-digit number"
          {...form.register("phoneNumber")}
        />
        <p className="mt-1 text-xs text-red-600">{form.formState.errors.phoneNumber?.message}</p>
      </div>
      <Button disabled={isSubmitting} className="w-full" type="submit">
        {isSubmitting ? "Placing order..." : "Place order"}
      </Button>
    </form>
  );
};
