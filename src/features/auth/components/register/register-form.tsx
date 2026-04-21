// import {
//   Field,
//   FieldDescription,
//   FieldError,
//   FieldLabel,
// } from "@/shared/components/ui/field";
// import { Input } from "@/shared/components/ui/input";
// import { Controller, useForm } from "react-hook-form";

// const RegisterForm = () => {
//   const form = useForm<RegisterSchema>({
//     defaultValues: {  },
 
//   });

//   return (
//     <form
//       onSubmit={form.handleSubmit((data) => mutate(data))}
//       className="flex w-1/2 max-w-sm flex-col gap-6"
//     >
//       <div className="flex flex-col gap-1.5">
//         <h1 className="text-2xl font-bold tracking-tight">Create Account</h1>
//       </div>

//       <div className="flex flex-col gap-4">
//         <Controller
//           name="email"
//           control={form.control}
//           render={({ field, fieldState }) => (
//             <Field data-invalid={fieldState.invalid}>
//               <FieldLabel htmlFor={field.name}>Email</FieldLabel>
//               <Input
//                 {...field}
//                 id={field.name}
//                 aria-invalid={fieldState.invalid}
//                 placeholder="Enter your username"
//                 autoComplete="username"
//               />
//               <FieldDescription></FieldDescription>
//               {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
//             </Field>
//           )}
//         />
//       </div>

//       {error && (
//         <p role="alert" className="text-sm font-normal text-destructive">
//           {error.message}
//         </p>
//       )}

//       <Button
//         disabled={isPending}
//         className=" capitalize text-white bg-blue-600  rounded-none p-4 "
//       >
//         {isPending ? "Logging in…" : "Log in"}
//       </Button>
//     </form>
//   );
// };

// export default RegisterForm;
