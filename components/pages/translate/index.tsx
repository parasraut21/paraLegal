"use client"

import React, { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { FileIcon, Loader2, LanguagesIcon as TranslateIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input" // assume you have an input component
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription } from "@/components/ui/alert"

const languages = [
  { value: "hi", label: "Hindi" },
  { value: "bn", label: "Bengali" },
  { value: "ta", label: "Tamil" },
  { value: "te", label: "Telugu" },
  { value: "mr", label: "Marathi" },
  { value: "gu", label: "Gujarati" },
  { value: "pa", label: "Punjabi" },
  { value: "ml", label: "Malayalam" },
  { value: "kn", label: "Kannada" },
  { value: "or", label: "Odia" },
]

// Update the schema to have a "text" field instead of "file"
const formSchema = z.object({
  text: z.string().nonempty({ message: "Please enter some text" }),
  to: z.string({ required_error: "Please select a language" }),
  tts: z.boolean().default(false),
})

type FormValues = z.infer<typeof formSchema>

export default function TextTranslator() {
  const [isLoading, setIsLoading] = useState(false)
  const [translatedText, setTranslatedText] = useState<string | null>(null)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tts: false,
    },
  })

  async function onSubmit(data: FormValues) {
    setIsLoading(true)
    setTranslatedText(null)
    setAudioUrl(null)

    try {
      // Build query parameters from your form data.
      const queryParams = new URLSearchParams({
        to: data.to,
        tts: data.tts.toString()
      })

      // Instead of file, send JSON body with dummy text.
      const res = await fetch(`/api/translate?${queryParams.toString()}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ text: data.text })
      })

      if (!res.ok) {
        throw new Error("Translation failed")
      }

      const result = await res.json()
      console.log(result, "result")
      setTranslatedText(result.translatedText)

      // If there is audioBase64, create a data URL
      if (result.audioBase64) {
        const url = `data:audio/mpeg;base64,${result.audioBase64}`
        setAudioUrl(url)
      }
    } catch (error) {
      setTranslatedText(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <TranslateIcon className="h-5 w-5" />
          Translate legal documents to any language
        </CardTitle>
        <CardDescription>Enter text and translate it</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="text"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Enter Text</FormLabel>
                  <FormControl>
                    <Input placeholder="Type or paste text here" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="to"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Target Language</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {languages.map((language) => (
                        <SelectItem key={language.value} value={language.value}>
                          {language.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>Select the language you want to translate to</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tts"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <FormLabel>Text-to-Speech</FormLabel>
                    <FormDescription>Enable audio output of the translated text</FormDescription>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Translating...
                </>
              ) : (
                "Translate"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
      {(translatedText || audioUrl) && (
        <CardFooter className="flex flex-col gap-4">
          {translatedText && (
            <Alert>
              <AlertDescription className="whitespace-pre-wrap">
                {translatedText}
              </AlertDescription>
            </Alert>
          )}
          {audioUrl && (
            <audio controls autoPlay src={audioUrl}>
              Your browser does not support the audio element.
            </audio>
          )}
        </CardFooter>
      )}
    </Card>
  )
}
