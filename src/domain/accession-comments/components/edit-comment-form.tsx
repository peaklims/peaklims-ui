import { Notification } from "@/components/notifications";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useUpdateAccessionComment } from "../apis/update-comment";

export const commentFormSchema = z.object({
  comment: z.string().nullable(),
});

export function SetCommentForm({
  accessionId,
  initialComment,
  afterSubmit,
  commentId,
}: {
  accessionId: string;
  initialComment: string;
  commentId: string;
  afterSubmit?: () => void;
}) {
  const commentForm = useForm<z.infer<typeof commentFormSchema>>({
    resolver: zodResolver(commentFormSchema),
    defaultValues: {
      comment: initialComment,
    },
  });

  const setCommentApi = useUpdateAccessionComment();
  function onSubmit(values: z.infer<typeof commentFormSchema>) {
    setCommentApi
      .mutateAsync({
        accessionId: accessionId,
        commentId: commentId,
        newComment: values.comment!,
      })
      .then(() => {
        if (afterSubmit) {
          afterSubmit();
        }
      })
      .catch((e) => {
        Notification.error("There was an error setting this comment");
        console.error(e);
      });
  }

  return (
    <Form {...commentForm}>
      <form
        onSubmit={commentForm.handleSubmit(onSubmit)}
        className="flex flex-col h-full"
      >
        <div className="flex-1 space-y-4">
          <FormField
            control={commentForm.control}
            name="comment"
            render={({ field }) => (
              <FormItem>
                <FormLabel required={false}>Comment</FormLabel>
                <FormControl>
                  <Textarea autoFocus rows={20} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex items-center justify-end pt-8">
          <Button type="submit">Submit</Button>
        </div>
      </form>
    </Form>
  );
}
