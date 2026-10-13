"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

export function ResumePanel({
  resume,
  jobsReady,
  scanning,
  onResume,
  onScanFirst,
  onFileError,
}: {
  resume: string;
  jobsReady: boolean;
  scanning: boolean;
  onResume: (value: string) => void;
  onScanFirst: () => void;
  onFileError: (message: string) => void;
}) {
  return (
    <section id="resume-panel" className="flex flex-col gap-4">
      <h2 className="text-subheading font-bold text-frost-white">Resume</h2>
      <Tabs defaultValue="paste">
        <TabsList>
          <TabsTrigger value="paste">Paste resume</TabsTrigger>
          <TabsTrigger value="upload">Upload .txt</TabsTrigger>
        </TabsList>
        <TabsContent value="paste" className="pt-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="resume">Your experience, in your words</Label>
            <Textarea
              id="resume"
              value={resume}
              placeholder="Paste the resume text you want compared. It is sent only to the model mode you picked."
              onChange={(event) => onResume(event.target.value)}
              className="min-h-72"
            />
          </div>
        </TabsContent>
        <TabsContent value="upload" className="pt-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="resume-file">Plain text file</Label>
            <Input
              id="resume-file"
              type="file"
              accept=".txt,text/plain"
              onChange={async (event) => {
                const file = event.target.files?.[0];
                if (!file) return;
                if (!file.name.toLowerCase().endsWith(".txt")) {
                  onFileError("Upload a .txt file.");
                  return;
                }
                onResume(await file.text());
              }}
            />
          </div>
        </TabsContent>
      </Tabs>
      <p className="text-caption text-frost-muted">
        {resume.trim()
          ? `${resume.trim().length.toLocaleString()} characters ready.`
          : "Paste your resume, then scan a role."}
      </p>
      <Button disabled={!resume.trim() || !jobsReady || scanning} onClick={onScanFirst}>
        {scanning ? "Scanning" : jobsReady ? "Scan first role" : "Search jobs first"}
      </Button>
    </section>
  );
}
