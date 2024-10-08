"use client"
import React, { ChangeEvent, useState } from "react";
import * as z from "zod"
import { 
        Form,
        FormControl,
        FormDescription,
        FormField,
        FormItem,
        FormLabel,
        FormMessage, 
        } from "../ui/form";
import { Button } from "../ui/button";
import {useForm} from "react-hook-form"
import {zodResolver} from "@hookform/resolvers/zod"
import { usePathname, useRouter } from "next/navigation";
import { useOrganization } from "@clerk/nextjs";
import { updateUser } from "@/lib/actions/user.actions";
import { ThreadValidation } from "@/lib/validations/thread";
import { Textarea } from "../ui/textarea";
import { createThread } from "@/lib/actions/thread.actions";

interface Props {
    user:{
        id: string;
        objectId: string;
        username: string;
        name: string;
        bio: string;
        image: string;
    },
    btnTitle: string;
}

function PostThread({ userId } : {userId: string}){
    const router = useRouter()
    const pathname = usePathname()
    const organization = useOrganization()

    const form = useForm({
        resolver: zodResolver(ThreadValidation),
        defaultValues: {
            thread: "",
            accountId: userId

        }
    })

    const onSubmit = async (values: z.infer<typeof ThreadValidation>) => {
        await createThread({
            text: values.thread,
            author: values.accountId,
            communityId: organization.organization ? organization.organization.id : null,
            path: pathname
        })
        router.push("/")
    }

    return (
        <Form {...form}>
            <form 
                onSubmit={form.handleSubmit(onSubmit)} 
                className="flex flex-col justify-start gap-10 mt-10">
                    <FormField
                        control={form.control}
                        name="thread"
                        render={({ field }) => (
                            <FormItem className="flex flex-col gap-3 w-full">
                                <FormLabel className="text-base-semibold text-light-2">
                                    Content
                                </FormLabel>
                                <FormControl className="no-focus border border-dark-3 bg-dark-4 text-light-1">
                                    <Textarea 
                                        rows={15}
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                />
                <Button type="submit" className="bg-primary-500">
                        Post Thread
                </Button>
            </form>
        </Form>
    )
}

export default PostThread